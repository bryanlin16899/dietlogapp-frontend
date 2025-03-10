"use client";

import { Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ColorSchemesSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Switch
      size="lg"
      color={theme.primaryColor}
      checked={colorScheme === 'dark'}
      onChange={toggleColorScheme}
      onLabel={<IconMoon size={16} color={theme.white} />}
      offLabel={<IconSun size={16} color={theme.black} />}
    />
  );
}
