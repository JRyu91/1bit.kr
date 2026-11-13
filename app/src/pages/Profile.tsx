// 틀: Astryx `detail-page` 페이지 템플릿(요약 헤더 + 본문 섹션 + 옆 패널).
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Layout, LayoutHeader, LayoutContent, LayoutPanel, VStack, HStack, StackItem, Section} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Button} from '@astryxdesign/core/Button';
import {List, ListItem} from '@astryxdesign/core/List';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Collapsible} from '@astryxdesign/core/Collapsible';
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
const skills = [
  ['통신 실무', '통신 장비·광모듈 검증, DWDM'],
  ['클라우드·컨테이너', 'AWS, GCP, OpenStack, Docker, Kubernetes·GKE'],
  ['구성·배포 자동화', 'Terraform, Ansible, GitHub Actions, WIF'],
  ['모니터링', 'Prometheus, Grafana, Alerting'],
  ['기반 환경', 'Linux, 네트워킹'],
];
const credentials = [
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

function PageHeader({isNarrow}: {isNarrow: boolean}) {
  const actions = [
    <Button key="portfolio" label="Portfolio" variant="primary" href="/portfolio/" />,
    <Button key="contact" label="Contact" variant="secondary" href="/contact/" />,
  ];
  return (
    <LayoutHeader hasDivider padding={4}>
      <VStack gap={3}>
        <HStack gap={4} vAlign="center">
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
          {!isNarrow && <HStack gap={2}>{actions}</HStack>}
        </HStack>
        {isNarrow && (
          <HStack gap={2}>
            {actions.map(action => (
              <StackItem key={action.key} size="fill">
                <VStack hAlign="stretch">{action}</VStack>
              </StackItem>
            ))}
          </HStack>
        )}
      </VStack>
    </LayoutHeader>
  );
}

function PanelContent() {
  return (
    <VStack gap={4}>
      <Collapsible trigger={<Heading level={4}>기술 스택</Heading>}>
        <MetadataList label={{position: 'top'}}>
          {skills.map(([label, value]) => (
            <MetadataListItem key={label} label={label}>
              {value}
            </MetadataListItem>
          ))}
        </MetadataList>
      </Collapsible>
      <Collapsible trigger={<Heading level={4}>학력·자격·교육</Heading>}>
        <MetadataList label={{position: 'top'}}>
          {credentials.map(([label, value]) => (
            <MetadataListItem key={label} label={label}>
              {value}
            </MetadataListItem>
          ))}
        </MetadataList>
      </Collapsible>
    </VStack>
  );
}

export default function Profile() {
  const isNarrow = useMediaQuery('(max-width: 1024px)');
  return (
    <Layout
      height="auto"
      contentWidth={1000}
      defaultHasDividers
      header={<PageHeader isNarrow={isNarrow} />}
      content={
        <LayoutContent role="main">
          <VStack gap={4}>
            <Section>
              <VStack gap={4}>
                <Heading level={2}>소개</Heading>
                <Text as="p" textWrap="pretty">
                  통신 장비 검증·기술지원 경험을 바탕으로, 클라우드 인프라·DevOps 직업훈련과 프로젝트를 진행하고 있습니다.
                  Linux와 네트워크 기초부터 인프라 구성·배포 자동화까지 직접 적용하며 학습하고 있습니다.
                </Text>
              </VStack>
            </Section>
            <Section>
              <VStack gap={4}>
                <Heading level={2}>실무 경력</Heading>
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
                  <Heading level={2}>클라우드 프로젝트</Heading>
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
            {/* 좁은 화면에서는 옆 패널을 숨기지 않고 본문 끝에 이어 붙인다. */}
            {isNarrow && (
              <Section>
                <PanelContent />
              </Section>
            )}
          </VStack>
        </LayoutContent>
      }
      end={
        isNarrow ? undefined : (
          <LayoutPanel width={320} padding={4} role="complementary">
            <PanelContent />
          </LayoutPanel>
        )
      }
    />
  );
}
