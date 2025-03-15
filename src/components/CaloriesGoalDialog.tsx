"use client";

import { Button, Dialog, Group, NumberInput, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function CaloriesGoalDialog() {
    const [opened, { open, close }] = useDisclosure(false);
    const [value, setValue] = useState<string|number>("");
    
    useEffect(() => {
        const caloriesGoal = localStorage.getItem('calories-goal')
        const userInfo = localStorage.getItem('userInfo');
        if (!caloriesGoal && userInfo) open()
    }, [])

    const handleConfirm = () => {
        localStorage.setItem('calories-goal', String(value));
        close()
    }
    return (
        <>
        <Dialog 
            opened={opened} 
            withCloseButton 
            onClose={close} 
            size="md" 
            radius="md"
            withBorder
        >
            <Text size="sm" mb="xs" fw={500}>
            請輸入每日攝取熱量目標！
            </Text>

            <Group align="flex-end">
            <NumberInput 
                placeholder="1,200 大卡🔥" 
                size='md'
                min={1000} 
                max={6000} 
                suffix=' 大卡🔥' 
                allowNegative={false} 
                hideControls
                thousandSeparator=","
                style={{ flex: 1 }}
                onChange={(val) => setValue(val)} 
            />
            <Button size='md' onClick={handleConfirm}>確定</Button>
            </Group>
        </Dialog>
        </>
    );
}