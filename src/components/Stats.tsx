import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import { FaBurn } from 'react-icons/fa';
import { GiMeat } from 'react-icons/gi';

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
      label: '熱量攝入', 
      stats: `${dietStats.calories ? Math.round(dietStats.calories) : '-'} 大卡`, 
      progress: calculateProgress(dietStats.calories, 2000), 
      color: 'blue', 
      icon: 'up'
    },
    { 
      label: '熱量消耗', 
      stats: `${dietStats.consumption ? Math.round(dietStats.consumption) : '-'} 大卡`, 
      progress: calculateProgress(dietStats.consumption, 2000), 
      color: 'teal', 
      icon: 'down' 
    },
  ];

  const stats = statsData.map((stat) => {
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
                {stat.icon == 'up' ? <GiMeat size={20}/> : <FaBurn size={18}/>}
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

  return <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">{stats}</SimpleGrid>;
}
