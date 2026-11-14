// 틀: Astryx `detail-page` 페이지 템플릿(요약 헤더 + 본문 섹션). 옆 패널 없이 한 열로 읽힌다.
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Layout, LayoutHeader, LayoutContent, VStack, HStack, StackItem, Section} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Button} from '@astryxdesign/core/Button';
import {List, ListItem} from '@astryxdesign/core/List';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowUpRightIcon} from '@heroicons/react/24/outline';
import {projects} from '../data/projects';

// 경력기술서 4분류를 한 줄씩. 성과는 담당(기술 검증)과 사업 결과(채택)를 나눠 Key Results 소제목에 담당을 한 번만 적는다.
const work: string[][] = [
  ['BMT·기술 검증', 'KT·SKB 등 고객사 RFP·요구사항 분석, 광모듈·DWDM 전송 시스템 시험환경 구성과 기술 검증'],
  ['제품 검증·품질 개선', '양산 전 전기·광학·신뢰성 검증(IEEE·MSA 규격), RMA 원인 분석과 8D Report로 고객 대응·공정 개선'],
  ['기술 지원·유지보수', 'EMS 알람·장비 로그로 현장 장애 원인 분석, 고객사·내부 부서 간 기술 이슈 조율'],
  ['기술 문서·품질 관리', 'ISO 9001·14001·45001·TL9000 심사 대응, 기술 문서·재고·기술 지원 이력 관리'],
];
const results: string[][] = [
  ['2019', 'KT 5G Front Haul 광모듈 최종 채택'],
  ['2020', 'KT 100G 광모듈 최종 채택'],
  ['2024', 'KT 100G 80km 광모듈 최종 채택'],
  ['2025', 'SKB 10G·100G 통합광모듈 사급화 사업 기술 검증'],
];
const skills: string[][] = [
  ['Cloud', 'AWS (1·2차, 최종), GCP (개인·해커톤), OpenStack (2차)'],
  ['Container', 'Docker·Docker Swarm (1차), Kubernetes — kubeadm 구축 (2차), GKE 운영 (개인), EKS 설계 (최종)'],
  ['IaC·Automation', 'Terraform (개인·최종), Ansible (1·2차)'],
  ['CI/CD', 'GitHub Actions·WIF (개인), Argo CD (2차)'],
  ['Monitoring', 'Prometheus, Grafana, Alerting (1차)'],
  ['OS·Network', 'Linux (Ubuntu, Rocky), TCP/IP, L2/L3 스위칭, 라우팅, VLAN, 광전송(DWDM)'],
  ['Collaboration·AI', 'GitHub, Jira, Confluence, Claude Code, Codex'],
];
const awards: string[][] = [
  ['Award', 'KT Cloud Infra 과정 해커톤 1위 · Partnerhub Cloud, 7인 팀 팀장·PM'],
  ['Award', '개인 프로젝트 우수 사례 선정·발표 · 시간 낭비의 숲 웹게임 운영 인프라'],
  ['Training', 'KT Cloud Infra 과정 (국비 직업훈련) · 2026.05.12~2026.12.03 수료 예정'],
  ['Training', 'ISO 45001 내부심사원 교육 · 2022.09 · 한국경영기술센터'],
];
const credentials: string[][] = [
  ['한성대학교 컴퓨터공학과', '2009~2026 · 학사과정 · 2026.08 졸업'],
  ['정보처리기사', '2026.06 취득'],
  ['AWS SAA-C03', '준비 중'],
];

function PageHeader() {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  const contact = <Button label="Contact" variant="primary" href="/contact/" />;
  return (
    <LayoutHeader hasDivider padding={6}>
      <VStack gap={3}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Avatar src="/profile/portrait-square.jpeg" name="유준형" size={96} shape="rounded" tooltip={false} />
          <StackItem size="fill">
            <VStack gap={1}>
              <Heading level={1}>유준형</Heading>
              <Text type="body">Cloud Engineer · SE · DevOps</Text>
              <Text type="supporting">통신 장비 검증·기술지원 약 9년</Text>
              {isNarrow && <HStack>{contact}</HStack>}
            </VStack>
          </StackItem>
          {!isNarrow && contact}
        </HStack>
        <Text as="p" color="secondary" textWrap="pretty">
          9년간 광통신 장비 검증과 기술 지원, 유지보수를 맡았습니다. 현장에서 장비 문제를 분석하고 해결해 온 경험을 바탕으로 클라우드와
          시스템 인프라로 업무 영역을 넓히고 있습니다.
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
            <MetadataListItem key={value} label={label}>
              <Text>{value}</Text>
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
                  <Text type="supporting">사업부 품질기술팀 과장 · 2017.02~2026.04 (9년 2개월)</Text>
                </VStack>
                <VStack gap={2}>
                  <HStack gap={2} vAlign="center" wrap="wrap">
                    <Heading level={4}>Key Results</Heading>
                    <Text type="supporting">BMT 기술 검증 담당</Text>
                  </HStack>
                  <MetadataList label={{position: 'start', width: 64}}>
                    {results.map(([label, value]) => (
                      <MetadataListItem key={label} label={label}>
                        <Text>{value}</Text>
                      </MetadataListItem>
                    ))}
                  </MetadataList>
                </VStack>
                <VStack gap={2}>
                  <Heading level={4}>Work</Heading>
                  <MetadataList label={{position: isNarrow ? 'top' : 'start', width: isNarrow ? undefined : 160}}>
                    {work.map(([label, value]) => (
                      <MetadataListItem key={label} label={label}>
                        <Text>{value}</Text>
                      </MetadataListItem>
                    ))}
                  </MetadataList>
                </VStack>
              </VStack>
            </Section>
            <Section>
              <VStack gap={4}>
                <VStack gap={1}>
                  <Heading level={2}>Cloud Projects</Heading>
                  <Text type="supporting">KT Cloud Infra 과정의 개인·팀 프로젝트 · 최근 순</Text>
                </VStack>
                <List hasDividers edge="flush">
                  {projects.map(project => (
                    <ListItem
                      key={project.id}
                      href={`/portfolio/#${project.id}`}
                      label={
                        <HStack gap={2} vAlign="center" wrap="wrap">
                          <Text weight="bold">{project.title}</Text>
                          <Text type="supporting">{`${project.tag} · ${project.period}`}</Text>
                        </HStack>
                      }
                      description={<Text type="supporting">{project.role}</Text>}
                      endContent={<Icon icon={ArrowUpRightIcon} size="sm" color="secondary" />}
                    />
                  ))}
                </List>
              </VStack>
            </Section>
            <InfoSection title="Skills" note="실무와 프로젝트에서 사용한 기술" items={skills} isNarrow={isNarrow} />
            <InfoSection title="Awards & Training" note="수상·교육 이력" items={awards} isNarrow={isNarrow} />
            <InfoSection title="Education & Certifications" note="취득·준비 상태 구분" items={credentials} isNarrow={isNarrow} />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
