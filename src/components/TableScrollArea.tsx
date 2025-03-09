"use client";
import { ActionIcon, Group, ScrollArea, Table } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import cx from 'clsx';
import { useEffect, useState } from 'react';
import classes from './TableScrollArea.module.css';

import { fetchDietLog, removeIntakeById } from '@/lib/api';
import { forwardRef, useImperativeHandle } from 'react';

export const TableScrollArea = forwardRef<{ refreshDietLog: () => void }, { dietLog: any }>(
  ({ dietLog }, ref) => {
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useImperativeHandle(ref, () => ({
      refreshDietLog: () => {
        // This method is now a no-op since diet log is managed in parent
      }
    }));

  const handleRemoveIntake = async (foodId: number) => {
    try {
      await removeIntakeById(foodId);
      
      // Refresh diet log after successful removal
      const updatedData = await fetchDietLog('Bryan', new Date().toISOString().split('T')[0]);
      setDietLog(updatedData);

      notifications.show({
        position: 'top-right',
        title: 'Intake Removed',
        message: 'Food item successfully deleted',
        color: 'green',
      });
    } catch (error) {
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
          <Table.Td>{food.quantity} {food.unit_type == 'grams' ? '(g)' : '(serving)'}</Table.Td>
          <Table.Td>
            <Group gap={0} justify="flex-end">
              <ActionIcon 
                variant="subtle" 
                color="red" 
                onClick={() => {
                  // Emit event to parent to handle removal
                }}
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
                <Table.Th>份量</Table.Th>
                <Table.Th>操作</Table.Th>
              </>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
});
