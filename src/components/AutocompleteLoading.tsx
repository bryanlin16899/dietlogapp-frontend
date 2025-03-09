"use client";
import { fetchIngredientList, recordDietIntake } from '@/lib/api';
import { Autocomplete, Button, Flex, Loader, NumberInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRef, useState } from 'react';

export function AutocompleteLoading({ onIntakeSuccess }: { onIntakeSuccess?: () => void }) {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState('');
  const [weight, setWeight] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const handleFetchIngredientList = async (searchTerm: string) => {
    try {
      const data = await fetchIngredientList(searchTerm);
      setIngredientList(data);
      
      // Transform ingredient data for Autocomplete
      const ingredientSuggestions = data.ingredients.map((ingredient: { name: string }) => ingredient.name);
      setData(ingredientSuggestions);
    } catch (error) {
      setIngredientList([]);
      setData([]);
    }
  };

  const handleIntake = async () => {
    if (!value) {
      notifications.show({
        title: 'Error',
        message: 'Please enter both food name and weight',
        color: 'red',
      });
      return;
    }

    try {
      const data = await recordDietIntake('Bryan', value, weight ? Number(weight) : 100);
      console.log('Intake recorded:', data);
      
      // Trigger callback to refresh diet log
      if (onIntakeSuccess) {
        onIntakeSuccess();
      }
      
      // Reset fields after successful intake
      setValue('');
      setWeight('');
      setData([]);

      notifications.show({
        title: 'Success',
        message: 'Food intake recorded',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to record intake',
        color: 'red',
      });
    }
  };

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setValue(val);
    setData([]);

    if (val.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        handleFetchIngredientList(val);
        setLoading(false);
      }, 1000);
    }
  };
  return (
    <Flex direction="column" gap="md">
      <Autocomplete
        value={value}
        data={data}
        onChange={handleChange}
        rightSection={loading ? <Loader size={16} /> : null}
        label="What was the last thing you ate?"
        placeholder="Apple, Fried rice, Pizza..."
      />
      <NumberInput
        value={weight}
        onChange={(val) => setWeight(val)}
        label="Weight (g)"
        placeholder="Default 100g"
        min={0}
      />
      <Button onClick={handleIntake}>
        Record Intake
      </Button>
    </Flex>
  );
}
