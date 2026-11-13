// 틀: 로그인 전 = Astryx `login` 템플릿, 로그인 후 = `detail-page` 템플릿(요약 헤더 + 본문 + 옆 패널).
// 기존 quiz/quiz.js 의 화면 동작을 그대로 옮겼다. 채점·진도 규칙은 quiz/engine.js, 서버 동기화는 ../quiz/account.ts.
import {useEffect, useReducer, useRef, useState, type CSSProperties} from 'react';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Layout, LayoutHeader, LayoutContent, LayoutPanel, VStack, HStack, StackItem, Section} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {TextInput} from '@astryxdesign/core/TextInput';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import type {Question, QuizState} from '../../../quiz/engine.js';
import {E, QuizAccount, guestKey} from '../quiz/account';

const cardColumn: CSSProperties = {width: '100%', maxWidth: 400};
const hiddenInput: CSSProperties = {display: 'none'};
const confettiColors = ['var(--color-accent)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)'];

// 목표 달성 축포. 움직임 줄이기 설정이면 생략한다.
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {position: 'fixed', left: '50%', top: '40%', pointerEvents: 'none', zIndex: '9999'});
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('i');
    const angle = (i / 40) * Math.PI * 2;
    const distance = 100 + Math.random() * 160;
    Object.assign(piece.style, {position: 'absolute', width: '8px', height: '12px', background: confettiColors[i % 4]});
    piece.animate(
      [
        {transform: 'translate(0, 0) rotate(0deg)', opacity: 1},
        {transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 100}px) rotate(${180 + Math.random() * 540}deg)`, opacity: 0},
      ],
      {duration: 1300, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards'},
    );
    layer.append(piece);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 1400);
}

type Result = {correct: boolean; selected: string[]; marked: boolean};
type Loaded = {questions: Question[]; account: QuizAccount; state: QuizState};

export default function Quiz() {
  const [, redraw] = useReducer((n: number) => n + 1, 0);
  const loaded = useRef<Loaded | null>(null);
  const started = useRef(false);
  const restoreInput = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [dailyMessage, setDailyMessage] = useState('');
  const [goalInput, setGoalInput] = useState<number | null>(null);
  const [numbersOpen, setNumbersOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  // 새 문제를 보여줄 때마다 답 선택·채점 결과를 비운다.
  function show(focus = false) {
    setSelected([]);
    setResult(null);
    setGoalInput(null);
    setDailyMessage('');
    redraw();
    if (focus) requestAnimationFrame(() => document.getElementById('question')?.scrollIntoView({block: 'start'}));
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      let questions: Question[];
      try {
        const response = await fetch('/quiz/questions.json');
        if (!response.ok) throw Error();
        questions = await response.json();
      } catch {
        setLoadError('문제를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침하세요.');
        return;
      }
      const account = new QuizAccount(
        questions,
        value => {
          if (loaded.current) loaded.current.state = value;
          setNotice('');
          show();
        },
        redraw,
      );
      const guest = account.read(guestKey);
      const state = await account.start(E.valid(guest, questions) ? guest : E.fresh());
      loaded.current = {questions, account, state};
      redraw();
    })();
  }, []);

  // 다른 탭의 진도 변경 감지 + 한국 시간 자정에 일일 집계 초기화.
  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout>;
    const onStorage = (event: StorageEvent) => loaded.current?.account.onStorage(event);
    function checkDay() {
      clearTimeout(midnightTimer);
      const current = loaded.current;
      if (current && current.state.daily?.day !== E.dayKey()) {
        E.daily(current.state);
        if (current.account.canEdit()) current.account.save(current.state);
        redraw();
      }
      const now = Date.now();
      const nextMidnight = Date.parse(E.dayKey(now) + 'T00:00:00+09:00') + 86400000;
      midnightTimer = setTimeout(checkDay, Math.max(1, nextMidnight - now));
    }
    const onVisible = () => !document.hidden && checkDay();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', checkDay);
    document.addEventListener('visibilitychange', onVisible);
    checkDay();
    return () => {
      clearTimeout(midnightTimer);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', checkDay);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  if (loadError) {
    return (
      <Center axis="horizontal" padding={6}>
        <VStack style={cardColumn}>
          <Banner status="error" title={loadError} />
        </VStack>
      </Center>
    );
  }
  if (!loaded.current) {
    return (
      <Center axis="horizontal" padding={6}>
        <Text color="secondary">문제와 로그인 상태를 불러오는 중</Text>
      </Center>
    );
  }

  const current = loaded.current;
  const {questions, account} = current;
  const state = current.state;
  const save = () => account.save(state);

  function backup() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(current.state)], {type: 'application/json'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = '1bit-quiz-progress.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // ─── 로그인 전 ────────────────────────────────────────────────────────────
  if (!account.user) {
    const login = async () => {
      const id = loginId.trim();
      if (!/^[A-Za-z0-9_]{3,64}$/.test(id) || !loginPw) {
        account.status('아이디(영문·숫자·밑줄 3자 이상)와 비밀번호를 입력하세요.');
        return;
      }
      await account.login(id, loginPw);
      setLoginPw('');
    };
    return (
      <Center axis="horizontal" padding={6}>
        <VStack gap={4} hAlign="center" style={cardColumn}>
          <Card padding={8} width="100%">
            <VStack gap={4} hAlign="stretch">
              <VStack gap={1} hAlign="center">
                <Heading level={1}>AWS 문제 연습</Heading>
                <Text type="body" color="secondary" size="sm">
                  로그인하면 계정별로 진도가 저장됩니다.
                </Text>
              </VStack>
              <TextInput label="아이디" value={loginId} onChange={setLoginId} autoComplete="username" size="lg" onEnter={login} />
              <TextInput
                label="비밀번호"
                value={loginPw}
                onChange={setLoginPw}
                type="password"
                autoComplete="current-password"
                size="lg"
                onEnter={login}
              />
              <Button label="로그인" variant="primary" size="lg" clickAction={login} />
              <Center axis="horizontal">
                <Link href="/quiz/signup/">회원가입</Link>
              </Center>
              <Text type="supporting" as="p" justify="center" role="status">
                {account.message}
              </Text>
              {/* 세션이 만료돼도 미전송 기록은 내려받을 수 있게 둔다. */}
              {account.paused && <Button label="진도 백업" onClick={backup} />}
            </VStack>
          </Card>
        </VStack>
      </Center>
    );
  }

  // ─── 로그인 후 ────────────────────────────────────────────────────────────
  const complete = state.complete === true;
  const question = questions.find(item => item.id === state.current)!;
  const daily = E.daily(state);
  const wrongCount = Object.values(state.records).filter(record => !record.correct).length;
  const mark = (id: number) => (!state.records[id] ? '△' : state.records[id].correct ? 'O' : 'X');
  const statusWord = (id: number) => (!state.records[id] ? '미풀이' : state.records[id].correct ? '정답' : '오답');

  function submit() {
    if (result || !account.canEdit() || !selected.length) return;
    const correct = E.answer(state, question, selected);
    const achieved = E.claimGoal(state);
    save();
    setResult({correct, selected, marked: false});
    if (achieved) celebrate();
  }
  function markWrong() {
    if (!account.canEdit() || !result || !E.markWrong(state, question)) return;
    save();
    setResult({...result, correct: false, marked: true});
  }
  function leaveReview() {
    const back = state.review!.back;
    delete state.review;
    Object.assign(state, {current: back.current, autoReview: back.autoReview, complete: back.complete});
  }
  function toggleReview() {
    if (!account.canEdit()) return;
    setReviewNote('');
    if (state.review) {
      leaveReview();
      save();
      show(true);
      return;
    }
    const queue = questions.filter(item => state.records[item.id] && !state.records[item.id].correct).map(item => item.id);
    if (!queue.length) return;
    const back = {current: state.current, autoReview: state.autoReview ?? null, complete};
    state.current = queue.shift()!;
    state.autoReview = null;
    state.complete = false;
    state.review = {queue, back};
    save();
    show(true);
  }
  function next() {
    if (!account.canEdit()) return;
    if (state.review) {
      const id = state.review.queue.shift();
      if (id !== undefined) {
        state.current = id;
        save();
        show(true);
        return;
      }
      leaveReview();
      const remaining = Object.values(state.records).filter(record => !record.correct).length;
      save();
      show();
      setReviewNote(`복습 완료 · 남은 오답 ${remaining}개`);
      return;
    }
    const upcoming = E.next(state, questions);
    state.autoReview = upcoming && state.records[upcoming.id] && !state.records[upcoming.id].correct ? upcoming.id : null;
    state.complete = !upcoming;
    if (upcoming) state.current = upcoming.id;
    save();
    show(!!upcoming);
  }
  function pick(id: number) {
    if (!account.canEdit()) return;
    delete state.review;
    setReviewNote('');
    state.current = id;
    state.autoReview = null;
    state.complete = false;
    setNumbersOpen(false);
    save();
    show(true);
  }
  function saveGoal() {
    if (!account.canEdit()) return;
    try {
      E.setGoal(state, Number(goalInput ?? daily.goal), questions.length);
      const achieved = E.claimGoal(state);
      save();
      setGoalInput(null);
      setDailyMessage(daily.ids.length < (daily.goal ?? 0) ? '목표가 저장되었습니다.' : '');
      if (achieved) celebrate();
    } catch (e) {
      setDailyMessage((e as Error).message);
    }
  }
  async function restore(file: File | undefined) {
    if (!file || !account.canEdit()) return;
    const owner = account.user!.id;
    const before = current.state;
    const sequence = account.sequence;
    try {
      if (file.size > 100000) throw Error();
      const restored = JSON.parse(await file.text());
      if (!E.valid(restored, questions)) throw Error();
      if (!account.canEdit() || account.user?.id !== owner || current.state !== before || account.sequence !== sequence) {
        setNotice('파일을 읽는 동안 계정 또는 진도가 변경되어 복원을 중단했습니다. 다시 백업을 선택하세요.');
        return;
      }
      if (!confirm('현재 진도를 백업 내용으로 변경하시겠습니까?')) return;
      current.state = restored;
      setReviewNote('');
      setNotice('');
      account.save(restored);
      show();
    } catch {
      setNotice('이 퀴즈에서 사용할 수 없는 백업 파일입니다. 현재 진도는 유지됩니다.');
    }
  }
  function reset() {
    if (!account.canEdit()) return;
    if (!confirm('진도와 오답 기록을 모두 지우고 처음부터 시작하시겠습니까?')) return;
    current.state = {...E.fresh(), daily: E.daily(state)};
    setReviewNote('');
    setNotice('');
    account.save(current.state);
    show(true);
  }

  const choiceLabel = (choice: Question['choices'][number]) => `${choice.id}. ${choice.text}`;
  const choiceBadge = (id: string) =>
    !result ? undefined : question.answers.includes(id) ? (
      <Badge variant="success" label="정답" />
    ) : result.selected.includes(id) ? (
      <Badge variant="error" label="선택" />
    ) : undefined;

  const panel = (
    <VStack gap={4}>
      <VStack gap={2}>
        <Heading level={4}>일일 학습 목표</Heading>
        <Text type="body" role="status">
          {daily.goal ? `오늘 ${daily.ids.length} / ${daily.goal}문제` : `오늘 ${daily.ids.length}문제 · 목표를 설정하세요.`}
        </Text>
        <ProgressBar label="오늘 학습 진행률" isLabelHidden value={daily.goal ? Math.min(daily.ids.length, daily.goal) : 0} max={daily.goal || 1} />
        <HStack gap={2} vAlign="end">
          <StackItem size="fill">
            <NumberInput label="하루 목표(문제)" value={goalInput ?? daily.goal} onChange={setGoalInput} min={1} max={questions.length} />
          </StackItem>
          <Button label="저장" onClick={saveGoal} />
        </HStack>
        <Text type="supporting">한국 시간 매일 00시 초기화 · 같은 문제는 하루 한 번 집계합니다.</Text>
        <Text type="supporting" as="p" role="status">
          {dailyMessage || (daily.goal && daily.ids.length >= daily.goal ? '오늘의 학습 목표를 달성했습니다!' : '')}
        </Text>
      </VStack>
      <VStack gap={2}>
        <Heading level={4}>오답 복습</Heading>
        <Button
          label={state.review ? '복습 종료' : `복습하기 (${wrongCount})`}
          isDisabled={!state.review && wrongCount === 0}
          onClick={toggleReview}
        />
        <Text type="supporting" as="p" role="status">
          {state.review ? '오답만 복습 중' : reviewNote}
        </Text>
      </VStack>
      <Collapsible
        isOpen={numbersOpen}
        onOpenChange={setNumbersOpen}
        trigger={<Heading level={4}>{`문제 번호 지정${complete ? '' : ` · ${state.current} [${mark(state.current)}]`}`}</Heading>}>
        {/* 948개 버튼이라 펼쳤을 때만 그린다. */}
        {numbersOpen && (
          <Grid columns={{minWidth: 72}} gap={1}>
            {questions.map(item => (
              <Button
                key={item.id}
                size="sm"
                label={`문제 ${item.id}, ${statusWord(item.id)}`}
                variant={!complete && item.id === state.current ? 'primary' : 'ghost'}
                onClick={() => pick(item.id)}>
                {`${item.id} ${mark(item.id)}`}
              </Button>
            ))}
          </Grid>
        )}
      </Collapsible>
    </VStack>
  );

  return (
    <Layout
      height="auto"
      contentWidth={1000}
      defaultHasDividers
      header={
        <LayoutHeader hasDivider padding={4}>
          <HStack gap={4} vAlign="center">
            <StackItem size="fill">
              <VStack gap={0}>
                <Heading level={1}>AWS 문제 연습</Heading>
                <Text type="body" color="secondary" role="status">
                  {`${account.user.name} · ${account.message}`}
                </Text>
              </VStack>
            </StackItem>
            <DropdownMenu
              button={{label: '계정·진도'}}
              alignment="end"
              items={[
                {label: '기존 브라우저 진도 가져오기', onClick: () => account.importGuest()},
                ...(account.paused ? [{label: '서버 진도 불러오기', onClick: () => void account.reload()}] : []),
                {label: '진도 백업', onClick: backup},
                {label: '백업 불러오기', onClick: () => restoreInput.current?.click()},
                {label: '처음부터 시작', onClick: reset},
                {label: '로그아웃', onClick: () => void account.logout()},
              ]}
            />
            <input
              ref={restoreInput}
              style={hiddenInput}
              type="file"
              accept="application/json,.json"
              onChange={event => {
                void restore(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent role="main">
          <VStack gap={4}>
            {notice && <Banner status="warning" title={notice} />}
            {account.paused && <Banner status="warning" title="저장이 멈췄습니다" description={account.message} />}
            {complete ? (
              <Section>
                <VStack gap={2}>
                  <Heading level={2}>모든 문제를 풀었습니다.</Heading>
                  <Text as="p">남은 오답이 없습니다. 문제 번호를 선택해 다시 풀 수 있습니다.</Text>
                </VStack>
              </Section>
            ) : (
              <Section>
                <VStack gap={4}>
                  <HStack gap={2} vAlign="center">
                    <Heading level={2} id="question">{`문제 ${question.id}`}</Heading>
                    {state.autoReview === question.id && <Badge variant="info" label="자동 복습" />}
                  </HStack>
                  <Text as="p" textWrap="pretty">
                    {question.prompt}
                  </Text>
                  {question.answers.length > 1 ? (
                    <CheckboxList label="보기" isLabelHidden value={selected} onChange={setSelected} isDisabled={!!result}>
                      {question.choices.map(choice => (
                        <CheckboxListItem key={choice.id} value={choice.id} label={choiceLabel(choice)} endContent={choiceBadge(choice.id)} align="first-line" />
                      ))}
                    </CheckboxList>
                  ) : (
                    <RadioList label="보기" isLabelHidden value={selected[0] ?? ''} onChange={value => setSelected([value])} isDisabled={!!result}>
                      {question.choices.map(choice => (
                        <RadioListItem key={choice.id} value={choice.id} label={choiceLabel(choice)} endContent={choiceBadge(choice.id)} align="first-line" />
                      ))}
                    </RadioList>
                  )}
                  {result && (
                    <Banner
                      status={result.correct ? 'success' : 'error'}
                      title={result.marked ? '학습 기록을 X로 저장했습니다.' : result.correct ? '정답입니다!' : '오답입니다 · 다시 복습하세요.'}
                      description={`선택: ${result.selected.join(', ')} / 정답: ${question.answers.join(', ')}`}
                      collapsible={false}>
                      <Text as="p" textWrap="pretty">
                        {question.explanation || '등록된 해설이 없습니다.'}
                      </Text>
                    </Banner>
                  )}
                  <HStack gap={2} wrap="wrap">
                    {result ? (
                      <Button label={result.correct ? '정답입니다! 다음 문제' : '다음 문제'} variant="primary" onClick={next} />
                    ) : (
                      <Button label="정답 확인" variant="primary" isDisabled={!selected.length} onClick={submit} />
                    )}
                    {result?.correct && <Button label="찍어서 맞힘 · 오답으로 저장" onClick={markWrong} />}
                  </HStack>
                </VStack>
              </Section>
            )}
            {isNarrow && <Section>{panel}</Section>}
          </VStack>
        </LayoutContent>
      }
      end={
        isNarrow ? undefined : (
          <LayoutPanel width={320} padding={4} role="complementary">
            {panel}
          </LayoutPanel>
        )
      }
    />
  );
}
