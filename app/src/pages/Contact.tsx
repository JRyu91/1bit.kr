// 틀: Astryx `blank` 페이지 템플릿 + 링크 목록(List/ListItem).
import {useState} from 'react';
import {useClipboard} from '@astryxdesign/core/hooks';
import {Layout, LayoutContent, VStack, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {List, ListItem} from '@astryxdesign/core/List';
import {ArrowUpRightIcon, CodeBracketIcon, EnvelopeIcon} from '@heroicons/react/24/outline';

const EMAIL = 'ujun5190@gmail.com';

const links = [
  {name: 'Email', address: EMAIL, note: '채용·협업 문의 · 메일 보내기', href: `mailto:${EMAIL}`, icon: EnvelopeIcon},
  {name: 'GitHub', address: 'github.com/JRyu91', note: '프로젝트 저장소·코드 보기 · 새 탭', href: 'https://github.com/JRyu91', icon: CodeBracketIcon, target: '_blank', isExternal: true},
];

export default function Contact() {
  const {copy, isCopied} = useClipboard({announce: '이메일 주소를 복사했습니다.'});
  const [failed, setFailed] = useState(false);

  return (
    <Layout
      height="auto"
      contentWidth={960}
      content={
        <LayoutContent padding={6}>
          <VStack gap={6}>
            <VStack gap={2}>
              <Heading level={1}>Contact</Heading>
              <Text type="body" color="secondary" textWrap="pretty">
                채용·협업 문의는 이메일로, 프로젝트 코드는 GitHub에서 확인해 주세요.
              </Text>
            </VStack>
            <List hasDividers edge="flush">
              {links.map(link => (
                <ListItem
                  key={link.name}
                  href={link.href}
                  target={link.target}
                  startContent={<Icon icon={link.icon} size="lg" color="secondary" />}
                  label={
                    <Text weight="bold" wordBreak="break-all">
                      {link.address}
                    </Text>
                  }
                  description={<Text type="supporting">{`${link.name} · ${link.note}`}</Text>}
                  endContent={link.isExternal ? <Icon icon={ArrowUpRightIcon} size="sm" color="secondary" /> : undefined}
                />
              ))}
            </List>
            <HStack gap={3} vAlign="center" wrap="wrap">
              <Button label={isCopied ? 'Copied' : 'Copy email'} clickAction={async () => setFailed(!(await copy(EMAIL)))} />
              {failed && (
                <Text type="supporting" as="p" role="status">
                  복사하지 못했습니다. 위 이메일 주소를 선택해 복사해 주세요.
                </Text>
              )}
            </HStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
