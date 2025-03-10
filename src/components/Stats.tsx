import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';

export function StatsRing({ dietLog }: { dietLog: any }) {
  const dietStats = {
    calories: dietLog?.calories || 0,
    consumption: dietLog?.consumption || 0,
  };

  const calculateProgress = (current: number, total: number) => {
    return total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  };

  const statsData = [
    { 
      label: 'Calories Intake', 
      stats: `${Math.round(dietStats.calories)} cal`, 
      progress: calculateProgress(dietStats.calories, 2000), 
      color: 'blue', 
      icon: 'up' 
    },
    { 
      label: 'Calories Consumed', 
      stats: `${Math.round(dietStats.consumption)} cal`, 
      progress: calculateProgress(dietStats.consumption, 2000), 
      color: 'teal', 
      icon: 'down' 
    },
  ];

  const icons = {
    up: IconArrowUpRight,
    down: IconArrowDownRight,
  };

  const stats = statsData.map((stat) => {
    const Icon = icons[stat.icon]; 
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={20} stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 2 }}>{stats}</SimpleGrid>;
}
