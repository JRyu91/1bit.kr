// 틀: Astryx `classic-gallery` 페이지 템플릿(가운데 소개) + 프로젝트별 한 열 상세(헤더 → 도면|본문).
import {useEffect, useState, type CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
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

function Note({title, children}: {title: string; children: string}) {
  return (
    <VStack gap={1}>
      <Text weight="bold">{title}</Text>
      <Text as="p" type="supporting" textWrap="pretty">
        {children}
      </Text>
    </VStack>
  );
}

function Details({project, onZoom, onSlides}: {project: Project; onZoom: () => void; onSlides: () => void}) {
  return (
    <VStack gap={4}>
      <MetadataList>
        <MetadataListItem label="Period">
          <Text>{project.period}</Text>
        </MetadataListItem>
        <MetadataListItem label="Team">
          <Text>{project.team}</Text>
        </MetadataListItem>
        <MetadataListItem label="Role">
          <Text>{project.role}</Text>
        </MetadataListItem>
      </MetadataList>
      <Text as="p" textWrap="pretty">
        {project.summary}
      </Text>
      <VStack gap={1}>
        <Text weight="bold">My role</Text>
        <List listStyle="disc" density="compact">
          {project.duties.map(duty => (
            <ListItem key={duty} label={<Text>{duty}</Text>} />
          ))}
        </List>
      </VStack>
      {project.why && <Note title="Why">{project.why}</Note>}
      {project.troubleshooting?.map(item => (
        <Collapsible key={item.title} defaultIsOpen={false} trigger={<Text weight="bold">{`Troubleshooting · ${item.title}`}</Text>}>
          <Text as="p" type="supporting" textWrap="pretty">
            {item.text}
          </Text>
        </Collapsible>
      ))}
      {project.lessons && (
        <Collapsible defaultIsOpen={false} trigger={<Text weight="bold">Lessons</Text>}>
          <Text as="p" type="supporting" textWrap="pretty">
            {project.lessons}
          </Text>
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
          <Button label="View slides" variant="primary" onClick={onSlides} />
        ) : (
          <Button label="View architecture" variant="primary" onClick={onZoom} />
        )}
        {project.pdf && project.compact && <Button label="View architecture" variant="secondary" onClick={onZoom} />}
        {project.pdf && (
          <Link href={project.pdf} download>
            Download {project.size}
          </Link>
        )}
        {project.service && <Link href={project.service.href}>{project.service.label}</Link>}
      </HStack>
    </VStack>
  );
}

function ProjectArticle({project, onZoom, onSlides}: {project: Project; onZoom: () => void; onSlides: () => void}) {
  const details = <Details project={project} onZoom={onZoom} onSlides={onSlides} />;
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
        {project.achievements && (
          <Text type="supporting" color="accent" weight="bold">
            {project.achievements.join(' · ')}
          </Text>
        )}
      </VStack>
      {/* 1차처럼 짧게 보여줄 프로젝트는 큰 도면 대신 View architecture 버튼만 둔다. */}
      {project.compact ? (
        details
      ) : (
        <Grid columns={{minWidth: 320, max: 2}} gap={6}>
          {/* 격자 칸 높이만큼 카드가 늘어나지 않게 한 번 감싼다. */}
          <VStack>
            <ClickableCard label={`${project.title} 아키텍처 확대`} padding={0} onClick={onZoom}>
              <AspectRatio ratio={3 / 2}>
                <img style={cover} src={project.image} alt={project.alt} loading="lazy" />
              </AspectRatio>
            </ClickableCard>
          </VStack>
          {details}
        </Grid>
      )}
    </VStack>
  );
}

export default function Portfolio() {
  const [zoom, setZoom] = useState<Project | null>(null);
  const [slides, setSlides] = useState<Project | null>(null);
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <Layout
        height="auto"
        contentWidth={1100}
        content={
          <LayoutContent padding={6}>
            <VStack gap={8}>
              <VStack hAlign="center">
                <VStack gap={2} hAlign="center" maxWidth={680} width="100%">
                  <Heading level={1} justify="center">
                    Portfolio
                  </Heading>
                  <Text type="large" justify="center" textWrap="balance">
                    기술을 검증하던 경험에서, 시스템을 운영하는 역량으로
                  </Text>
                  <Text type="supporting" justify="center" textWrap="pretty">
                    최근 프로젝트부터 담당 업무와 팀 전체 구성을 나눠 정리했습니다. 도면을 누르면 크게 볼 수 있고, PDF는 발표 당시
                    원본입니다. 진행 중인 최종 프로젝트는 현재 설계 기준 아키텍처만 공개합니다.
                  </Text>
                </VStack>
              </VStack>
              <VStack gap={8}>
                {projects.map((project, index) => (
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
