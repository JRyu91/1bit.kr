// 틀: Astryx `centered-hero` 페이지 템플릿 + `dashboard` 템플릿의 지표 카드(MetricCard) 블록.
import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Icon} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {ArrowRightIcon} from '@heroicons/react/20/solid';
import {projects} from '../data/projects';

const heroImage: CSSProperties = {width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated'};
// 도면은 흰 바탕 그림이라 다크 모드에서도 흰 판 위에 올린다.
const cover: CSSProperties = {width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'var(--color-on-dark)'};

const metrics = [
  {label: 'Experience', value: '약 9년', note: '통신 장비 검증·기술지원 · 2017~2026'},
  {label: 'Cloud Projects', value: '4건', note: '개인 1 · 해커톤 1 · 팀 프로젝트 2'},
  {label: 'Certification', value: '정보처리기사', note: '2026.06 취득 · AWS SAA-C03 준비 중'},
  {label: 'Training', value: '2026.12', note: '클라우드 인프라·DevOps 직업훈련 수료 예정'},
];
const featured = projects.filter(project => project.id === 'personal' || project.id === 'endive');

function MetricCard({label, value, note}: {label: string; value: string; note: string}) {
  return (
    <Card>
      <VStack gap={2}>
        <Text type="label">{label}</Text>
        <Text type="display-3" size="2xl" weight="bold" color="accent">
          {value}
        </Text>
        <Text type="supporting" color="secondary">
          {note}
        </Text>
      </VStack>
    </Card>
  );
}

export default function Home() {
  return (
    <Layout
      height="auto"
      contentWidth={1100}
      content={
        <LayoutContent padding={6}>
          <VStack gap={10}>
            <VStack gap={6} hAlign="center">
              <VStack width={200}>
                <AspectRatio ratio={1}>
                  <picture>
                    <source srcSet="/assets/bow.gif" type="image/gif" media="(prefers-reduced-motion: no-preference)" />
                    <img style={heroImage} src="/assets/bow.png" alt="허리를 숙여 인사하는 유준형 픽셀 캐릭터" />
                  </picture>
                </AspectRatio>
              </VStack>
              <VStack gap={3} hAlign="center">
                <Text type="label" color="accent">
                  Cloud Infrastructure · DevOps
                </Text>
                <Heading level={1} type="display-2" justify="center" textWrap="balance">
                  유준형
                </Heading>
                <Text type="body" color="secondary" justify="center" textWrap="balance">
                  통신 장비 검증·기술지원 약 9년의 경험을 바탕으로, 클라우드 인프라·DevOps 직무를 준비합니다.
                </Text>
              </VStack>
              <HStack gap={3} wrap="wrap" hAlign="center">
                <Button
                  label="Profile"
                  variant="primary"
                  href="/profile/"
                  endContent={<Icon icon={ArrowRightIcon} size="sm" color="inherit" />}
                />
                <Button label="Contact" variant="secondary" href="/contact/" />
              </HStack>
            </VStack>

            <Grid columns={{minWidth: 220, repeat: 'fit'}} gap={4}>
              {metrics.map(metric => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </Grid>

            <VStack gap={4}>
              <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
                <Heading level={2}>Featured Projects</Heading>
                <Link href="/portfolio/">View all projects</Link>
              </HStack>
              <Grid columns={{minWidth: 300, max: 2}} gap={6}>
                {featured.map(project => (
                  <ClickableCard key={project.id} label={`${project.name} 자세히 보기`} href={`/portfolio/#${project.id}`} padding={0}>
                    <VStack gap={0}>
                      <AspectRatio ratio={16 / 9}>
                        <img style={cover} src={project.image} alt={project.alt} loading="lazy" />
                      </AspectRatio>
                      <VStack gap={2} padding={5}>
                        <HStack gap={2} vAlign="center" wrap="wrap">
                          <Heading level={3}>{project.name}</Heading>
                          {project.service && (
                            <Text type="supporting" color="accent">
                              Live
                            </Text>
                          )}
                        </HStack>
                        <Text type="supporting">{project.label}</Text>
                        <Text type="label" color="accent">
                          {project.role}
                        </Text>
                      </VStack>
                    </VStack>
                  </ClickableCard>
                ))}
              </Grid>
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
