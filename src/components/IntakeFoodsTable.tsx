"use client";
import { ActionIcon, Group, ScrollArea, Table } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import classes from './TableScrollArea.module.css';

import { useUser } from '@/context/userContext';
import { GetDietLogResponse, IntakeFood, removeIntakeById } from '@/lib/api';
import { forwardRef, useImperativeHandle } from 'react';

export const IntakeFoodsTable = forwardRef<
  { refreshDietLog: () => void }, 
  { 
    dietLog: GetDietLogResponse|null, 
    onRemoveIntake: () => void, 
    onFoodRowClick?: (food: IntakeFood) => void,
    onAddFood?: () => void 
  }
>(
  ({ dietLog, onRemoveIntake, onFoodRowClick, onAddFood }, ref) => {
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { userInfo } = useUser();

    useImperativeHandle(ref, () => ({
      refreshDietLog: () => {
        // This method is now a no-op since diet log is managed in parent
      }
    }));

  const handleRemoveIntake = async (foodId: number) => {
    if (!userInfo?.googleId) {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '請先登入',
        color: 'red',
      });
      return;
    }
    
    try {
      await removeIntakeById(userInfo?.googleId, foodId);
      
      // Trigger parent component to refresh diet log
      if (onRemoveIntake) {
        onRemoveIntake();
      }

      notifications.show({
        position: 'top-right',
        title: '刪除',
        message: '食物已成功刪除',
        color: 'green',
      });
    } catch {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '食物刪除失敗',
        color: 'red',
      });
    }
  };

  const rows = dietLog?.intake_foods?.map((food: IntakeFood) => (
    <Table.Tr 
      key={food.id} 
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        // Prevent row click when clicking the delete button
        if ((e.target as HTMLElement).closest('.delete-action')) return;
        if (onFoodRowClick) onFoodRowClick(food);
      }}
    >
      <Table.Td>{food.name}</Table.Td>
      <Table.Td>{food.calories}</Table.Td>
      {!isMobile && (
        <>
          <Table.Td>{food.protein > 0 ? food.protein : "-"}</Table.Td>
          <Table.Td>{food.fat > 0 ? food.fat : "-"}</Table.Td>
          <Table.Td>{food.carbohydrates > 0 ? food.carbohydrates : "-"}</Table.Td>
          <Table.Td>{food.quantity} {food.unit_type == 'grams' ? '(克)' : '(份)'}</Table.Td>
        </>
      )}
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon 
              variant="subtle" 
              color="red" 
              className="delete-action"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveIntake(food.id);
              }}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={400} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table 
        w="100%"
        miw={isMobile ? 350 : 700}
        fz={'sm'}
        verticalSpacing={isMobile ? 'xs' : 'md'}
        highlightOnHover
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
              </>
            )}
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows}
          <Table.Tr 
            style={{ 
              cursor: 'pointer', 
              textAlign: 'center' 
            }}
            onClick={onAddFood}
          >
            <Table.Td colSpan={isMobile ? 3 : 7} style={{ textAlign: 'center' }}>
              <Group justify="center" align="center">
                <ActionIcon 
                  variant="transparent" 
                  size="lg"
                  style={{
                    transition: 'transform 0.2s ease',
                    ':hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <IconPlus size={24} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
});

IntakeFoodsTable.displayName = 'TableScrollArea';
