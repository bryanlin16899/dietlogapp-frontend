"use client";
import { ActionIcon, Group, ScrollArea, Table } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import cx from 'clsx';
import { useEffect, useState } from 'react';
import classes from './TableScrollArea.module.css';

export function TableScrollArea() {
  const [scrolled, setScrolled] = useState(false);
  const [dietLog, setDietLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchDietLog = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/diet/get_diet_log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            name: 'Bryan'
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        setDietLog(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching diet log:', error);
        setLoading(false);
      }
    };

    fetchDietLog();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRemoveIntake = async (foodId: number) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/diet/remove_intake_by_id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: foodId })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Refresh diet log after successful removal
      const updatedResponse = await fetch('http://127.0.0.1:8000/diet/get_diet_log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          name: 'Bryan'
        })
      });

      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated diet log');
      }

      const updatedData = await updatedResponse.json();
      setDietLog(updatedData);

      notifications.show({
        position: 'top-right',
        title: 'Intake Removed',
        message: 'Food item successfully deleted',
        color: 'green',
      });
    } catch (error) {
      console.error('Error removing intake:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to remove food item',
        color: 'red',
      });
    }
  };

  const rows = dietLog?.intake_foods?.map((food: any) => (
    <Table.Tr key={food.id}>
      <Table.Td>{food.name}</Table.Td>
      <Table.Td>{food.calories}</Table.Td>
      {!isMobile && (
        <>
          <Table.Td>{food.protein}</Table.Td>
          <Table.Td>{food.fat}</Table.Td>
          <Table.Td>{food.carbohydrates}</Table.Td>
          <Table.Td>{food.weight}</Table.Td>
          <Table.Td>
            <Group gap={0} justify="flex-end">
              {/* <ActionIcon variant="subtle" color="gray">
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon> */}
              <ActionIcon 
                variant="subtle" 
                color="red" 
                onClick={() => handleRemoveIntake(food.id)}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Table.Td>
        </>
      )}
    </Table.Tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table 
        miw={400} 
        fz={isMobile ? 'xs' : 'sm'}
        verticalSpacing={isMobile ? 'xs' : 'md'}
      >
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>{isMobile ? '食物' : '食物名稱'}</Table.Th>
            <Table.Th>卡路里</Table.Th>
            {!isMobile && (
              <>
                <Table.Th>蛋白質</Table.Th>
                <Table.Th>脂肪</Table.Th>
                <Table.Th>碳水化合物</Table.Th>
                <Table.Th>重量(g)</Table.Th>
                <Table.Th>操作</Table.Th>
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
