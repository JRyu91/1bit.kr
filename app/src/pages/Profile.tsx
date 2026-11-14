// 틀: Astryx `detail-page` 페이지 템플릿(요약 헤더 + 본문 섹션). 옆 패널 없이 한 열로 읽힌다.
import {useClipboard, useMediaQuery} from '@astryxdesign/core/hooks';

const EMAIL = 'ujun5190@gmail.com';
import {Layout, LayoutHeader, LayoutContent, VStack, HStack, StackItem, Section} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Button} from '@astryxdesign/core/Button';
import {List, ListItem} from '@astryxdesign/core/List';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowUpRightIcon} from '@heroicons/react/24/outline';

const duties = [
  '통신 장비·광모듈 검증, 고객 BMT·PoC 지원',
  '고객 기술지원 및 장애 분석',
  'DWDM 설치·유지보수',
  '재고·품질 관리, ISO 인증 수검 대응',
];
const projects = [
  {id: 'personal', name: '개인 프로젝트', sub: '웹게임 운영 인프라', text: 'Terraform 구성, 온디맨드·Spot 노드풀 분리, GitHub Actions·WIF 배포 자동화.'},
  {id: 'hackathon', name: '해커톤', sub: 'Partnerhub Cloud', text: '담당: 기획·E2E 검증·트러블슈팅 기록·발표.'},
  {id: 'endive', name: '2차 프로젝트', sub: 'ENDIVE-CLOUD', text: '담당: Kubernetes 클러스터 구축·Ansible 자동화.'},
  {id: 'bluebell', name: '1차 프로젝트', sub: 'Bluebell', text: '담당: Monitoring·Alerting 프로비저닝 자동화.'},
];
const skills: string[][] = [
  ['통신 실무', '통신 장비·광모듈 검증, DWDM'],
  ['클라우드·컨테이너', 'AWS, GCP, OpenStack, Docker, Kubernetes·GKE'],
  ['구성·배포 자동화', 'Terraform, Ansible, GitHub Actions, WIF'],
  ['모니터링', 'Prometheus, Grafana, Alerting'],
  ['기반 환경', 'Linux, 네트워킹'],
];
const credentials: string[][] = [
  ['한성대학교 컴퓨터공학과', '2009~2026 · 학사과정 · 2026.08 졸업'],
  ['정보처리기사', '2026.06 취득'],
  ['클라우드 인프라·DevOps 직업훈련', '수강 중 · 2026.12 수료 예정'],
  ['AWS SAA-C03', '준비 중'],
];

function Bullet() {
  return (
    <Text type="supporting" color="secondary">
      {'・'}
    </Text>
  );
}

function PageHeader() {
  const {copy, isCopied} = useClipboard({announce: '이메일 주소를 복사했습니다.'});
  return (
    <LayoutHeader hasDivider padding={6}>
      <VStack gap={3}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Avatar src="/profile/portrait.jpeg" name="유준형" size={72} shape="rounded" tooltip={false} />
          <StackItem size="fill">
            <VStack gap={0}>
              <Heading level={1}>유준형</Heading>
              <HStack gap={1} vAlign="center" wrap="wrap">
                <Text type="body">Cloud Infrastructure · DevOps</Text>
                <HStack gap={1} vAlign="center">
                  <Bullet />
                  <Text type="body">통신 장비 검증·기술지원 약 9년</Text>
                </HStack>
              </HStack>
            </VStack>
          </StackItem>
          <Button label={isCopied ? 'Copied' : 'Copy email'} variant="primary" clickAction={async () => {
              // 복사가 막힌 브라우저에서는 메일 앱으로 넘긴다.
              if (!(await copy(EMAIL))) location.href = `mailto:${EMAIL}`;
            }} />
        </HStack>
        <Text as="p" color="secondary" textWrap="pretty">
          통신 장비 검증·기술지원 경험을 바탕으로 클라우드 인프라·DevOps 직업훈련과 프로젝트를 진행하고 있습니다. Linux와
          네트워크 기초부터 인프라 구성·배포 자동화까지 직접 적용하며 학습하고 있습니다.
        </Text>
      </VStack>
    </LayoutHeader>
  );
}

function InfoSection({title, note, items, isNarrow}: {title: string; note: string; items: string[][]; isNarrow: boolean}) {
  return (
    <Section>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>{title}</Heading>
          <Text type="supporting">{note}</Text>
        </VStack>
        <MetadataList label={{position: isNarrow ? 'top' : 'start', width: isNarrow ? undefined : 200}}>
          {items.map(([label, value]) => (
            <MetadataListItem key={label} label={label}>
              {value}
            </MetadataListItem>
          ))}
        </MetadataList>
      </VStack>
    </Section>
  );
}

export default function Profile() {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  return (
    <Layout
      height="auto"
      contentWidth={960}
      defaultHasDividers
      header={<PageHeader />}
      content={
        <LayoutContent padding={6}>
          <VStack gap={4}>
            <Section>
              <VStack gap={4}>
                <Heading level={2}>Experience</Heading>
                <VStack gap={1}>
                  <Heading level={3}>(주)자람테크놀로지</Heading>
                  <Text type="supporting">2017.02~2026.04 · 사업부 품질기술팀 과장</Text>
                </VStack>
                <List listStyle="disc" density="compact">
                  {duties.map(duty => (
                    <ListItem key={duty} label={<Text>{duty}</Text>} />
                  ))}
                </List>
              </VStack>
            </Section>
            <Section>
              <VStack gap={4}>
                <VStack gap={1}>
                  <Heading level={2}>Cloud Projects</Heading>
                  <Text type="supporting">교육·개인·팀 프로젝트 경험</Text>
                </VStack>
                <List hasDividers edge="flush">
                  {projects.map(project => (
                    <ListItem
                      key={project.id}
                      href={`/portfolio/#${project.id}`}
                      label={
                        <HStack gap={2} vAlign="center" wrap="wrap">
                          <Text weight="bold">{project.name}</Text>
                          <Text type="supporting">{project.sub}</Text>
                        </HStack>
                      }
                      description={<Text type="supporting">{project.text}</Text>}
                      endContent={<Icon icon={ArrowUpRightIcon} size="sm" color="secondary" />}
                    />
                  ))}
                </List>
              </VStack>
            </Section>
            <InfoSection title="Skills" note="실무와 프로젝트에서 사용한 기술" items={skills} isNarrow={isNarrow} />
            <InfoSection title="Education & Certifications" note="취득·수강·준비 상태 구분" items={credentials} isNarrow={isNarrow} />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
