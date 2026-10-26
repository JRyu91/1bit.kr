"""Import numbered questions without renumbering gaps in the source PDF."""
import argparse
import json
import re
import subprocess
from pathlib import Path


def extract(pdf):
    text = subprocess.check_output(['pdftotext', '-layout', str(pdf), '-'], text=True).replace('\f', '\n')
    headers = list(re.finditer(r'(?m)^QUESTION\s+(\d+)([^\n]*)\n', text))
    questions = []
    clean = lambda value: re.sub(r'\s+', ' ', value).strip()
    for index, header in enumerate(headers):
        number = int(header[1])
        body = text[header.end():headers[index + 1].start() if index + 1 < len(headers) else len(text)]
        if '해설' in header[2]:
            if not questions or questions[-1]['id'] != number or questions[-1]['explanation'] is not None:
                raise ValueError(f'Unmatched explanation: {number}')
            questions[-1]['explanation'] = clean(re.sub(r'^\s*해설:\s*', '', body)) or None
            continue
        answer = list(re.finditer(r'Answer:\s*([^\n]*)', body))
        if len(answer) != 1 or not re.fullmatch(r'[A-F](?:[\s,]+[A-F])*', answer[0][1].strip()):
            raise ValueError(f'Invalid answer: {number}')
        parts = re.split(r'(?m)^([A-F])\.\s*', body[:answer[0].start()].strip())
        choices = [dict(id=parts[i], text=clean(parts[i + 1])) for i in range(1, len(parts), 2)]
        answers = re.findall(r'[A-F]', answer[0][1])
        if not clean(parts[0]) or [c['id'] for c in choices] != list('ABCDEF'[:len(choices)]) or not 2 <= len(choices) <= 6 or any(not c['text'] for c in choices) or not set(answers) <= {c['id'] for c in choices} or len(set(answers)) != len(answers):
            raise ValueError(f'Invalid question: {number}')
        questions.append(dict(id=number, prompt=clean(parts[0]), choices=choices, answers=answers, explanation=None))
    numbers = [q['id'] for q in questions]
    expected = [n for n in range(1, 955) if n not in {51, 73, 95, 147, 382, 933}]
    if numbers != expected or len(re.findall(r'Answer:', text)) != len(questions):
        raise ValueError('Source numbering or answer count changed; review PDF before importing')
    return questions


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('pdf', type=Path)
    parser.add_argument('--through', type=int, required=True)
    args = parser.parse_args()
    if not 1 <= args.through <= 954:
        parser.error('--through must be between 1 and 954')
    questions = [q for q in extract(args.pdf) if q['id'] <= args.through]
    target = Path(__file__).with_name('questions.json')
    previous = json.loads(target.read_text())
    by_id = {q['id']: q for q in questions}
    if any(by_id.get(q['id']) != q for q in previous):
        raise ValueError('Existing questions would be changed or removed')
    target.write_text(json.dumps(questions, ensure_ascii=False, indent=2) + '\n')
    print(f'1–{args.through}: {len(questions)} questions, {sum(len(q["answers"]) > 1 for q in questions)} multiple-answer, {sum(q["explanation"] is None for q in questions)} without explanation')
