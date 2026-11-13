// 틀: Astryx `classic-gallery` 페이지 템플릿(가운데 소개 + 필터 탭 + 균일 타일 격자).
import {useEffect, useState, type CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Token} from '@astryxdesign/core/Token';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {List, ListItem} from '@astryxdesign/core/List';

const outer: CSSProperties = {
  maxWidth: 1200,
  width: '100%',
  paddingInline: 'var(--spacing-6)',
  paddingBlock: 'var(--spacing-8)',
};
const textCenter: CSSProperties = {textAlign: 'center'};
// 도면은 흰 바탕 그림이라 다크 모드에서도 흰 판 위에 올린다.
const cover: CSSProperties = {width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'var(--color-on-dark)'};
const frame: CSSProperties = {width: '100%', height: '72dvh', border: 0, display: 'block'};

type Filter = 'all' | Project['category'];

type Project = {
  id: string;
  category: 'personal' | 'team';
  name: string;
  label: string;
  pdf: string;
  size: string;
  image: string;
  alt: string;
  summary: string;
  role: string;
  duties: string[];
  techNote?: string;
  tech: string[];
  service?: {label: string; href: string};
};

const projects: Project[] = [
  {
    id: 'personal',
    category: 'personal',
    name: '개인 프로젝트',
    label: '웹게임 운영 인프라 · 시간 낭비의 숲 · PDF 13쪽',
    pdf: '/projects/Personal%20Project_web-game.pdf',
    size: '3.6MB',
    image: '/projects/personal-architecture.webp',
    alt: 'GKE 홈 채널·확장 채널, Redis와 Cloud SQL 연결 아키텍처',
    summary:
      '웹게임의 접속 세션을 유지하며 채널 수를 조절하는 운영 인프라입니다. 홈 채널은 온디맨드, 확장 채널은 Spot 노드풀에 배치했습니다.',
    role: '개인 수행 · 인프라 설계·구축·운영',
    duties: ['Terraform으로 GCP 인프라 구성', 'KEDA 기반 채널 확장·축소와 Redis 이관 구성', 'GitHub Actions·WIF로 빌드·배포 자동화'],
    tech: ['GCP', 'GKE', 'Terraform', 'Redis', 'Cloud SQL', 'GitHub Actions'],
    service: {label: '시간 낭비의 숲 플레이하기', href: '/game/'},
  },
  {
    id: 'hackathon',
    category: 'team',
    name: '해커톤',
    label: 'Partnerhub Cloud · Team Eclipse · PDF 13쪽',
    pdf: '/projects/Hackathon_Team%20Eclipse.pdf',
    size: '1.9MB',
    image: '/projects/hackathon-architecture.webp',
    alt: 'Partnerhub Cloud의 GKE 애플리케이션·PostgreSQL·GCS 및 배포·관리 접근 아키텍처',
    summary:
      '제조 협력사의 품질 데이터를 관리하고 AI 이상 탐지를 연계하는 플랫폼 제안·데모입니다. 팀은 GKE 배포와 Key-less CI/CD를 구성했습니다.',
    role: '담당 · 기획·발표·QA',
    duties: ['사업 시나리오 구상', '데모 7단계 E2E 검증', '트러블슈팅 기록 및 최종 발표'],
    techNote: '팀 기술',
    tech: ['GCP', 'GKE', 'Terraform', 'WIF'],
  },
  {
    id: 'endive',
    category: 'team',
    name: '2차 프로젝트',
    label: 'ENDIVE-CLOUD · PDF 27쪽',
    pdf: '/projects/2st%20Project_Team%20Endive.pdf',
    size: '11.3MB',
    image: '/projects/endive-architecture.webp',
    alt: 'AWS 서울 Active·도쿄 DR, OpenStack 모니터링 연결 아키텍처',
    summary:
      '서울 운영·도쿄 재해복구 환경을 구성한 야외행사 안내 플랫폼입니다. 팀은 리전 간 백업·이미지 복제와 OpenStack 중앙 관제를 연계했습니다.',
    role: '담당 · Kubernetes 구축·Ansible 자동화',
    duties: ['프로비저닝된 인프라에 Kubernetes 클러스터 구축', 'Ansible로 클러스터 설치·설정 자동화'],
    techNote: '팀 기술',
    tech: ['AWS', 'OpenStack', 'Kubernetes', 'Terraform', 'Ansible'],
  },
  {
    id: 'bluebell',
    category: 'team',
    name: '1차 프로젝트',
    label: 'Bluebell · PDF 22쪽',
    pdf: '/projects/1st%20Project_Team%20Bluebell.pdf',
    size: '5.6MB',
    image: '/projects/bluebell-architecture.webp',
    alt: 'AWS Web·WAS·DB 3-Tier와 Prometheus·Grafana 모니터링 아키텍처',
    summary:
      'AWS·온프레미스 3-Tier 환경의 구축·배포·장애복구 자동화 프로젝트입니다. 팀의 서비스 흐름에 모니터링과 알림 구성을 연결했습니다.',
    role: '담당 · Monitoring·Alerting 자동화',
    duties: ['Prometheus·Grafana 모니터링 스택 배포 자동화', '노드 Exporter 및 Alerting 프로비저닝 자동화'],
    techNote: '팀 기술',
    tech: ['AWS', 'Ansible', 'Docker Swarm', 'Prometheus', 'Grafana'],
  },
];

export default function Portfolio() {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Project | null>(null);
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  const shown = filter === 'all' ? projects : projects.filter(project => project.category === filter);

  return (
    <>
      <Layout
        height="auto"
        content={
          <LayoutContent padding={0}>
            <Center axis="horizontal">
              <VStack gap={8} style={outer}>
                <Center axis="horizontal">
                  <Section variant="transparent" maxWidth={680} padding={0}>
                    <VStack gap={4} hAlign="center" style={textCenter}>
                      <VStack gap={2} hAlign="center">
                        <Heading level={1}>프로젝트</Heading>
                        <Text type="body" color="secondary">
                          운영 인프라를 설계하고, 구축과 배포를 자동화한 작업들입니다. 각 프로젝트에서 직접 맡은 업무와 팀의
                          전체 구성을 구분해 정리했습니다. PDF는 발표 당시 기준의 최종 원본입니다.
                        </Text>
                      </VStack>
                      <TabList value={filter} onChange={value => setFilter(value as Filter)}>
                        <Tab value="all" label="전체" />
                        <Tab value="personal" label="개인" />
                        <Tab value="team" label="팀" />
                      </TabList>
                    </VStack>
                  </Section>
                </Center>
                <Grid columns={{minWidth: 320, max: 2}} columnGap={6} rowGap={10}>
                  {shown.map(project => (
                    <VStack key={project.id} id={project.id} as="article" gap={4}>
                      <ClickableCard label={`${project.name} 발표자료 보기`} padding={0} onClick={() => setOpen(project)}>
                        <AspectRatio ratio={3 / 2}>
                          <img style={cover} src={project.image} alt={project.alt} loading="lazy" />
                        </AspectRatio>
                      </ClickableCard>
                      <VStack gap={1}>
                        <Heading level={2}>{project.name}</Heading>
                        <Text type="supporting">{project.label}</Text>
                      </VStack>
                      <Text as="p" textWrap="pretty">
                        {project.summary}
                      </Text>
                      <VStack gap={1}>
                        <Text type="label">{project.role}</Text>
                        <List listStyle="disc" density="compact">
                          {project.duties.map(duty => (
                            <ListItem key={duty} label={<Text>{duty}</Text>} />
                          ))}
                        </List>
                      </VStack>
                      <HStack gap={2} wrap="wrap" vAlign="center">
                        {project.techNote && <Text type="supporting">{project.techNote}</Text>}
                        {project.tech.map(tech => (
                          <Token key={tech} label={tech} size="sm" />
                        ))}
                      </HStack>
                      <HStack gap={4} wrap="wrap" vAlign="center">
                        <Button label="발표자료 보기" variant="primary" onClick={() => setOpen(project)} />
                        <Link href={project.pdf} download>
                          다운로드 {project.size}
                        </Link>
                        {project.service && <Link href={project.service.href}>{project.service.label}</Link>}
                      </HStack>
                    </VStack>
                  ))}
                </Grid>
              </VStack>
            </Center>
          </LayoutContent>
        }
      />

      <Dialog isOpen={open !== null} onOpenChange={isOpen => !isOpen && setOpen(null)} width={1100} maxHeight="94dvh">
        {open && (
          <Layout
            header={
              <DialogHeader
                title={open.name}
                subtitle="자료가 표시되지 않으면 원본 열기를 이용해 주세요."
                onOpenChange={() => setOpen(null)}
                endContent={<Button label="원본 열기" size="sm" href={open.pdf} target="_blank" />}
              />
            }
            content={
              <LayoutContent padding={0} isScrollable={false}>
                <iframe style={frame} src={open.pdf} title={`${open.name} 발표자료`} />
              </LayoutContent>
            }
          />
        )}
      </Dialog>
    </>
  );
}
