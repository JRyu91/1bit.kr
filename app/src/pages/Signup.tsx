// 틀: Astryx `login` 페이지 템플릿. 기존 quiz/signup/signup.js 의 동작을 옮겼다.
import {useRef, useState, type CSSProperties} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Card} from '@astryxdesign/core/Card';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {TextInput} from '@astryxdesign/core/TextInput';
import {api} from '../quiz/account';

const cardColumn: CSSProperties = {width: '100%', maxWidth: 400};

export default function Signup() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('아이디, 비밀번호, 닉네임, 가입코드를 입력하세요. 가입 완료 후 자동으로 로그인됩니다.');
  const created = useRef(false);

  async function submit() {
    if (created.current) return;
    const check =
      !/^[A-Za-z0-9_]{3,64}$/.test(id.trim()) ? '아이디는 영문·숫자·밑줄 3자 이상으로 입력하세요.'
      : pw.length < 8 ? '비밀번호는 8자 이상으로 입력하세요.'
      : pw !== pwConfirm ? '비밀번호가 일치하지 않습니다. 다시 확인하세요.'
      : !name.trim() || name.trim().length > 10 ? '닉네임은 1~10자로 입력하세요.'
      : !code.trim() ? '가입코드를 입력하세요.'
      : '';
    if (check) {
      setStatus(check);
      return;
    }
    setStatus('회원가입 중입니다.');
    try {
      await api('/quiz/signup', {id: id.trim(), pw, name: name.trim(), code: code.trim()});
      created.current = true;
      await api('/account/login', {id: id.trim(), pw});
      location.replace('/quiz/');
    } catch (e) {
      setStatus(created.current ? '회원가입이 완료되었습니다. 로그인 페이지에서 로그인하세요.' : (e as Error).message);
    }
  }

  return (
    <Center axis="horizontal" padding={6}>
      <VStack gap={4} hAlign="center" style={cardColumn}>
        <Card padding={8} width="100%">
          <VStack gap={4} hAlign="stretch">
            <VStack gap={1} hAlign="center">
              <Heading level={1}>회원가입</Heading>
              <Text type="body" color="secondary" size="sm">
                AWS 문제 연습
              </Text>
            </VStack>
            <TextInput label="아이디" value={id} onChange={setId} autoComplete="username" size="lg" />
            <TextInput label="비밀번호" value={pw} onChange={setPw} type="password" autoComplete="new-password" size="lg" />
            <TextInput label="비밀번호 확인" value={pwConfirm} onChange={setPwConfirm} type="password" autoComplete="new-password" size="lg" />
            <TextInput label="닉네임" value={name} onChange={setName} autoComplete="nickname" size="lg" />
            <TextInput label="가입코드" value={code} onChange={setCode} autoComplete="off" size="lg" onEnter={submit} />
            <Button label="회원가입" variant="primary" size="lg" clickAction={submit} />
            <Center axis="horizontal">
              <Link href="/quiz/">로그인으로 돌아가기</Link>
            </Center>
            <Text type="supporting" as="p" justify="center" role="status">
              {status}
            </Text>
          </VStack>
        </Card>
      </VStack>
    </Center>
  );
}
