// 틀: Astryx `classic-gallery` 페이지 템플릿(가운데 소개 + 필터 탭) + 프로젝트별 한 열 상세(헤더 → 도면|본문).
import {useEffect, useState, type CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Token} from '@astryxdesign/core/Token';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Lightbox} from '@astryxdesign/core/Lightbox';
import {List, ListItem} from '@astryxdesign/core/List';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Divider} from '@astryxdesign/core/Divider';
import {projects, type Project} from '../data/projects';

// 도면은 흰 바탕 그림이라 다크 모드에서도 흰 판 위에 올린다.
const cover: CSSProperties = {width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'var(--color-on-dark)'};
const frame: CSSProperties = {width: '100%', height: '72dvh', border: 0, display: 'block'};
// 해시로 들어올 때 sticky 상단 바에 제목이 가리지 않게 한다.
// --_app-shell-header-height 는 AppShell 이 상단 바를 재서 넣는 내부 변수라 Astryx 올릴 때 이름이 그대로인지 확인할 것.
const anchor: CSSProperties = {scrollMarginTop: 'calc(var(--_app-shell-header-height, 0px) + var(--spacing-4))'};

type Filter = 'all' | Project['category'];

function ProjectArticle({project, onZoom, onSlides}: {project: Project; onZoom: () => void; onSlides: () => void}) {
  return (
    <VStack id={project.id} as="article" gap={4} style={anchor}>
      <VStack gap={1}>
        <HStack gap={2} vAlign="center" wrap="wrap">
          <Text type="label" color="accent">
            {project.tag}
          </Text>
          {project.inProgress && (
            <Text type="supporting" color="accent">
              · In progress
            </Text>
          )}
        </HStack>
        <Heading level={2}>{project.title}</Heading>
        {project.achievements?.map(item => (
          <Text key={item} type="supporting" color="accent" weight="bold">
            {item}
          </Text>
        ))}
      </VStack>
      <Grid columns={{minWidth: 320, max: 2}} gap={6}>
        <VStack gap={2}>
          <ClickableCard label={`${project.title} 아키텍처 확대`} padding={0} onClick={onZoom}>
            <AspectRatio ratio={3 / 2}>
              <img style={cover} src={project.image} alt={project.alt} loading="lazy" />
            </AspectRatio>
          </ClickableCard>
          <Text type="supporting">도면을 누르면 크게 볼 수 있습니다.</Text>
        </VStack>
        <VStack gap={4}>
          <MetadataList>
            <MetadataListItem label="Period">{project.period}</MetadataListItem>
            <MetadataListItem label="Team">{project.team}</MetadataListItem>
            <MetadataListItem label="Role">{project.role}</MetadataListItem>
          </MetadataList>
          <Text as="p" textWrap="pretty">
            {project.summary}
          </Text>
          <List listStyle="disc" density="compact">
            {project.duties.map(duty => (
              <ListItem key={duty} label={<Text>{duty}</Text>} />
            ))}
          </List>
          {project.troubleshooting && (
            <Collapsible defaultIsOpen={false} trigger={<Text weight="bold">Troubleshooting {project.troubleshooting.length}건</Text>}>
              <VStack gap={3}>
                {project.troubleshooting.map(item => (
                  <VStack key={item.title} gap={1}>
                    <Text weight="bold">{item.title}</Text>
                    <Text as="p" type="supporting" textWrap="pretty">
                      {item.text}
                    </Text>
                  </VStack>
                ))}
              </VStack>
            </Collapsible>
          )}
          <HStack gap={2} wrap="wrap" vAlign="center">
            {project.techNote && <Text type="supporting">{project.techNote}</Text>}
            {project.tech.map(tech => (
              <Token key={tech} label={tech} size="sm" />
            ))}
          </HStack>
          <HStack gap={4} wrap="wrap" vAlign="center">
            {project.pdf ? (
              <>
                <Button label="View slides" variant="primary" onClick={onSlides} />
                <Link href={project.pdf} download>
                  Download {project.size}
                </Link>
              </>
            ) : (
              <Button label="View architecture" variant="primary" onClick={onZoom} />
            )}
            {project.service && <Link href={project.service.href}>{project.service.label}</Link>}
          </HStack>
        </VStack>
      </Grid>
    </VStack>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<Filter>('all');
  const [zoom, setZoom] = useState<Project | null>(null);
  const [slides, setSlides] = useState<Project | null>(null);
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  const shown = filter === 'all' ? projects : projects.filter(project => project.category === filter);

  return (
    <>
      <Layout
        height="auto"
        contentWidth={1100}
        content={
          <LayoutContent padding={6}>
            <VStack gap={8}>
              <VStack hAlign="center">
                <VStack gap={4} hAlign="center" maxWidth={680} width="100%">
                    <VStack gap={2} hAlign="center">
                      <Heading level={1} justify="center">
                        Portfolio
                      </Heading>
                      <Text type="body" color="secondary" justify="center">
                        운영 인프라를 설계하고, 구축과 배포를 자동화한 작업들입니다. 각 프로젝트에서 직접 맡은 업무와 팀의 전체 구성을
                        구분해 정리했습니다. PDF는 발표 당시의 최종 원본이고, 진행 중인 최종 프로젝트는 현재 설계 기준 아키텍처만
                        공개합니다.
                      </Text>
                    </VStack>
                    <TabList value={filter} onChange={value => setFilter(value as Filter)}>
                      <Tab value="all" label="All" />
                      <Tab value="personal" label="Personal" />
                      <Tab value="team" label="Team" />
                    </TabList>
                </VStack>
              </VStack>
              <VStack gap={8}>
                {shown.map((project, index) => (
                  <VStack key={project.id} gap={8}>
                    {index > 0 && <Divider />}
                    <ProjectArticle project={project} onZoom={() => setZoom(project)} onSlides={() => setSlides(project)} />
                  </VStack>
                ))}
              </VStack>
            </VStack>
          </LayoutContent>
        }
      />

      {zoom && (
        <Lightbox
          isOpen
          onOpenChange={isOpen => !isOpen && setZoom(null)}
          hasZoom
          media={{src: zoom.imageFull ?? zoom.image, alt: zoom.alt, caption: zoom.title}}
        />
      )}

      <Dialog isOpen={slides !== null} onOpenChange={isOpen => !isOpen && setSlides(null)} width={1100} maxHeight="94dvh">
        {slides?.pdf && (
          <Layout
            header={
              <DialogHeader
                title={slides.title}
                subtitle="자료가 보이지 않으면 Open original을 눌러 주세요."
                onOpenChange={() => setSlides(null)}
                endContent={<Button label="Open original" size="sm" href={slides.pdf} target="_blank" />}
              />
            }
            content={
              <LayoutContent padding={0} isScrollable={false}>
                <iframe style={frame} src={slides.pdf} title={`${slides.title} 발표자료`} />
              </LayoutContent>
            }
          />
        )}
      </Dialog>
    </>
  );
}
