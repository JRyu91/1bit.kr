import type {ReactNode} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Icon} from '@astryxdesign/core/Icon';
import {Button} from '@astryxdesign/core/Button';
import {CheckIcon, ComputerDesktopIcon, HomeIcon, MoonIcon, SunIcon} from '@heroicons/react/24/outline';

export type Mode = 'system' | 'light' | 'dark';

const menu = [
  {id: 'profile', label: 'Profile', href: '/profile/'},
  {id: 'portfolio', label: 'Portfolio', href: '/portfolio/'},
  {id: 'game', label: 'Playground', href: '/game/'},
  {id: 'contact', label: 'Contact', href: '/contact/'},
];
const modes = [
  {id: 'system', label: 'System', icon: ComputerDesktopIcon},
  {id: 'light', label: 'Light', icon: SunIcon},
  {id: 'dark', label: 'Dark', icon: MoonIcon},
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
          label="Main menu"
          heading={<Button label="Home" href="/" variant="ghost" isIconOnly icon={<Icon icon={HomeIcon} size="sm" />} />}
          centerContent={menu.map(item => (
            <TopNavItem key={item.id} label={item.label} href={item.href} isSelected={item.id === current} />
          ))}
          endContent={
            <DropdownMenu
              button={{label: `Theme: ${active.label}`, variant: 'ghost', isIconOnly: true, icon: <Icon icon={active.icon} size="sm" />}}
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
