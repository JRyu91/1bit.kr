import type {ReactNode} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Icon} from '@astryxdesign/core/Icon';
import {CheckIcon, ComputerDesktopIcon, MoonIcon, SunIcon} from '@heroicons/react/24/outline';

export type Mode = 'system' | 'light' | 'dark';

const menu = [
  {id: 'profile', label: 'Profile', href: '/profile/'},
  {id: 'portfolio', label: 'Portfolio', href: '/portfolio/'},
  {id: 'game', label: 'Playground', href: '/game/'},
  {id: 'contact', label: 'Contact', href: '/contact/'},
];
const modes = [
  {id: 'system', label: '사용자 설정 따름', icon: ComputerDesktopIcon},
  {id: 'light', label: '일반 모드', icon: SunIcon},
  {id: 'dark', label: '다크 모드', icon: MoonIcon},
] as const;

type Props = {current: string; mode: Mode; onModeChange: (mode: Mode) => void; children: ReactNode};

export default function Shell({current, mode, onModeChange, children}: Props) {
  const active = modes.find(item => item.id === mode) ?? modes[0];
  return (
    <AppShell
      variant="surface"
      height="auto"
      topNav={
        <TopNav
          label="주요 메뉴"
          heading={<TopNavHeading heading="유준형" headingHref="/" />}
          centerContent={menu.map(item => (
            <TopNavItem key={item.id} label={item.label} href={item.href} isSelected={item.id === current} />
          ))}
          endContent={
            <DropdownMenu
              button={{label: `화면 모드: ${active.label}`, variant: 'ghost', isIconOnly: true, icon: <Icon icon={active.icon} size="sm" />}}
              hasChevron={false}
              alignment="end"
              items={modes.map(item => ({
                label: item.label,
                icon: <Icon icon={item.icon} size="sm" />,
                endContent: item.id === mode ? <Icon icon={CheckIcon} size="sm" /> : undefined,
                onClick: () => onModeChange(item.id),
              }))}
            />
          }
        />
      }>
      {children}
    </AppShell>
  );
}
