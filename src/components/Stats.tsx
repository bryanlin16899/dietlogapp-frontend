import { GetDietLogResponse } from '@/lib/api';
import { Center, Group, Paper, RingProgress, SimpleGrid, Text, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { FaBurn } from 'react-icons/fa';
import { GiMeat } from 'react-icons/gi';

export function StatsRing({ dietLog }: { dietLog: GetDietLogResponse|null }) {
  const [caloriesGoal, setCaloriesGoal] = useState<string>("2000");
  const dietStats = {
    intake: dietLog?.intake || 0,
    consumption: dietLog?.consumption || 0,
  };

  const calculateProgress = (current: number, total: number) => {
    return total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  };

  useEffect(() => {
    const goal = localStorage.getItem('calories-goal');
    if (goal) setCaloriesGoal(goal);
  }, [])

  const statsData = [
    { 
      label: '熱量攝入', 
      stats: `${dietStats.intake ? Math.round(dietStats.intake) : '-'} 大卡`, 
      progress: calculateProgress(dietStats.intake, Number(caloriesGoal)), 
      color: 'yellow', 
      icon: 'up',
      tooltipMsg: `還剩 ${(Number(caloriesGoal)-dietStats.intake).toFixed(0)} 大卡 🫠`
    },
    { 
      label: '熱量消耗', 
      stats: `${dietStats.consumption ? Math.round(dietStats.consumption) : '-'} 大卡`, 
      progress: calculateProgress(dietStats.consumption, 1000), 
      color: 'skyBlue', 
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
            transitionDuration={1000}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                {stat.icon == 'up' ? <GiMeat size={20}/> : <FaBurn size={18}/>}
              </Center>
            }
          />

          <Tooltip
            label={stat.tooltipMsg}
            offset={10}                                                                                                                         
             events={{                                                                                                                           
               hover: true,                                                                                                                      
               focus: true,                                                                                                                      
               touch: true
             }}
            hidden={stat.tooltipMsg ? false : true}
          >
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
          </Tooltip>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">{stats}</SimpleGrid>;
}
