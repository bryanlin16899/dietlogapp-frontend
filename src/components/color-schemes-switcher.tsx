"use client";

import { ActionIcon, Group } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ColorSchemesSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Group>
      <ActionIcon 
        variant={colorScheme === 'light' ? 'filled' : 'subtle'}
        onClick={() => setColorScheme("light")} 
        size="lg"
      >
        <IconSun />
      </ActionIcon>
      <ActionIcon 
        variant={colorScheme === 'dark' ? 'filled' : 'subtle'}
        onClick={() => setColorScheme("dark")} 
        size="lg"
      >
        <IconMoon />
      </ActionIcon>
    </Group>
  );
}
