"use client";
import { Autocomplete, Button, Flex, Loader, NumberInput } from '@mantine/core';
import { useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';

export function AutocompleteLoading({ onIntakeSuccess }: { onIntakeSuccess?: () => void }) {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState('');
  const [weight, setWeight] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const fetchIngredientList = async (searchTerm: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/ingredient/get_ingredient_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchTerm })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setIngredientList(data);
      
      // Transform ingredient data for Autocomplete
      const ingredientSuggestions = data.ingredients.map((ingredient: { name: string }) => ingredient.name);
      setData(ingredientSuggestions);
    } catch (error) {
      console.error('Error fetching ingredient list:', error);
      setIngredientList([]);
      setData([]);
    }
  };

  const handleIntake = async () => {
    if (!value || !weight) {
      notifications.show({
        title: 'Error',
        message: 'Please enter both food name and weight',
        color: 'red',
      });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/diet/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: 'Bryan',
          food_name: value,
          weight: Number(weight)
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Intake recorded:', data);
      
      // Trigger callback to refresh diet log
      if (onIntakeSuccess) {
        onIntakeSuccess();
      }
      
      // Reset fields after successful intake
      setValue('');
      setWeight('');

      notifications.show({
        title: 'Success',
        message: 'Food intake recorded',
        color: 'green',
      });
    } catch (error) {
      console.error('Error recording intake:', error);
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
        fetchIngredientList(val);
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
        placeholder="Enter weight in grams"
        min={0}
      />
      <Button onClick={handleIntake}>
        Record Intake
      </Button>
    </Flex>
  );
}
