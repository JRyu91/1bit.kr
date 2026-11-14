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
import {projects, type Project} from '../data/projects';

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
