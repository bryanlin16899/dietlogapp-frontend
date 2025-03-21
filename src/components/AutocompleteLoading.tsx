"use client";
import { useUser } from '@/context/userContext';
import { fetchIngredientList, recordDietIntake, UnitType } from '@/lib/api';
import { Autocomplete, Button, Flex, Loader, NumberInput, SegmentedControl } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRef, useState } from 'react';

export function AutocompleteLoading({ onIntakeSuccess, logDate }: { onIntakeSuccess?: () => void, logDate: Date|null }) {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState<string | number>('');
  const [unitType, setUnitType] = useState<UnitType>('grams');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const { userInfo } = useUser();

  const handleFetchIngredientList = async (searchTerm: string) => {
    try {
      const data = await fetchIngredientList(
        searchTerm, 
        false, // 不拿圖片
        {
        page: 1,
        page_size: 1000
      });
      
      // Transform ingredient data for Autocomplete
      const ingredientSuggestions = data.ingredients.map((ingredient: { name: string }) => ingredient.name);
      setData(ingredientSuggestions);
    } catch {
      setData([]);
    }
  };

  const handleIntake = async () => {
    if (!value || !userInfo) {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '請輸入食物名稱與數量',
        color: 'red',
      });
      return;
    }
    
    try {
      const data = await recordDietIntake(
        userInfo?.googleId, 
        value, 
        quantity ? Number(quantity) : unitType === 'grams' ? 100 : 1, 
        unitType,
        logDate ? 
          logDate.getFullYear() + '-' +
          String(logDate.getMonth() + 1).padStart(2, '0') + '-' +                                      
          String(logDate.getDate()).padStart(2, '0') 
        : 
          new Date().getFullYear() + '-' +
          String(new Date().getMonth() + 1).padStart(2, '0') + '-' +                                      
          String(new Date().getDate()).padStart(2, '0')
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
        title: '新增',
        message: '食物已成功紀錄',
        color: 'green',
      });
    } catch {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '食物紀錄失敗',
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
    <Flex className='mb-1' direction="column" gap="xs">
      <Flex 
        gap="xs" 
        direction={{ base: 'column', sm: 'row' }} 
        align={{ base: 'stretch', sm: 'end' }}
      >
        <Autocomplete
          value={value}
          data={data}
          onChange={handleChange}
          rightSection={loading ? <Loader size={16} /> : null}
          label="🍪 吃了什麼？"
          placeholder="Apple 🍎, Fries 🍟  ..."
          size='md'
          style={{ flexGrow: 1 }}
        />
        <NumberInput
          value={quantity}
          onChange={(val) => setQuantity(val)}
          label="數量"
          placeholder={`${unitType === 'grams' ?  "100 克" : "1 份"}`}
          size='md'
          min={0}
          step={10}
        />
        <SegmentedControl 
          data={[
            { label: '克', value: 'grams' },
            { label: '份', value: 'servings' }
          ]}
          size='md'
          w={260}
          value={unitType}
          onChange={(val) => setUnitType(val as UnitType)}
        />
      </Flex>
      <Button onClick={handleIntake}>
        紀錄
      </Button>
    </Flex>
  );
}
