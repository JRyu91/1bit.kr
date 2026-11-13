// 틀: Astryx `centered-hero` 페이지 템플릿.
import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Section} from '@astryxdesign/core/Section';
import {ArrowRightIcon} from '@heroicons/react/20/solid';

const heroImage: CSSProperties = {width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated'};
const heroFrame: CSSProperties = {
  maxWidth: 720,
  marginInline: 'auto',
};

export default function Home() {
  return (
    <Layout
      height="auto"
      content={
        <LayoutContent padding={6}>
          <VStack gap={10}>
            <VStack gap={6} hAlign="center">
              <VStack gap={3} hAlign="center">
                <Text type="label" color="secondary">
                  Cloud Infrastructure · DevOps
                </Text>
                <Heading level={1} type="display-2" justify="center" textWrap="balance">
                  유준형
                </Heading>
                <Text type="body" color="secondary" justify="center" textWrap="balance">
                  통신 장비 검증·기술지원 약 9년의 경험을 바탕으로, 클라우드 인프라·DevOps 직무를 준비합니다.
                </Text>
              </VStack>
              <HStack gap={3}>
                <Button
                  label="Profile"
                  variant="primary"
                  href="/profile/"
                  endContent={<Icon icon={ArrowRightIcon} size="sm" color="inherit" />}
                />
                <Button label="Portfolio" variant="secondary" href="/portfolio/" />
              </HStack>
            </VStack>
            <Section variant="transparent" padding={0}>
              <AspectRatio ratio={16 / 9} style={heroFrame}>
                <picture>
                  <source srcSet="/assets/bow.gif" type="image/gif" media="(prefers-reduced-motion: no-preference)" />
                  <img style={heroImage} src="/assets/bow.png" alt="허리를 숙여 인사하는 유준형 픽셀 캐릭터" />
                </picture>
              </AspectRatio>
            </Section>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
