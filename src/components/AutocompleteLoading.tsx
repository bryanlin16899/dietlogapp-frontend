"use client";
import { fetchIngredientList, recordDietIntake, UnitType } from '@/lib/api';
import { Autocomplete, Button, Flex, Loader, NumberInput, Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRef, useState } from 'react';

export function AutocompleteLoading({ onIntakeSuccess }: { onIntakeSuccess?: () => void }) {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState<string | number>('');
  const [unitType, setUnitType] = useState<UnitType>('grams');
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
        position: 'top-right',
        title: 'Error',
        message: 'Please enter both food name and quantity',
        color: 'red',
      });
      return;
    }
    
    try {
      const data = await recordDietIntake(
        'Bryan', 
        value, 
        quantity ? Number(quantity) : 100, 
        unitType
      );
      console.log('Intake recorded:', data);
      
      // Trigger callback to refresh diet log
      if (onIntakeSuccess) {
        onIntakeSuccess();
      }
      
      // Reset fields after successful intake
      setValue('');
      setQuantity('');
      setData([]);

      notifications.show({
        position: 'top-right',
        title: 'Success',
        message: 'Food intake recorded',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        position: 'top-right',
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
    <Flex className='mb-2' direction="column" gap="md">
      <Flex gap="xl" align="end">
        <Autocomplete
          value={value}
          data={data}
          onChange={handleChange}
          rightSection={loading ? <Loader size={16} /> : null}
          label="What was the last thing you ate?"
          placeholder="Apple, Fried rice, Pizza..."
          style={{ flexGrow: 1 }}
        />
        <NumberInput
          value={quantity}
          onChange={(val) => setQuantity(val)}
          label="Quantity"
          placeholder="Default 100"
          min={0}
          style={{ width: 120 }}
        />
        <Select
          label="Unit Type"
          value={unitType}
          onChange={(val) => setUnitType(val as UnitType)}
          data={[
            { value: 'grams', label: 'Grams' },
            { value: 'servings', label: 'Servings' }
          ]}
          style={{ width: 120 }}
        />
      </Flex>
      <Button onClick={handleIntake}>
        Record Intake
      </Button>
    </Flex>
  );
}
