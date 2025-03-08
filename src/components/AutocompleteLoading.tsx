"use client";
import { Autocomplete, Loader } from '@mantine/core';
import { useRef, useState } from 'react';

export function AutocompleteLoading() {
  const timeoutRef = useRef<number>(-1);
  const [value, setValue] = useState('');
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
    } catch (error) {
      console.error('Error fetching ingredient list:', error);
      setIngredientList([]);
    }
  };

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setValue(val);
    setData([]);
    console.log(ingredientList);
    

    if (val.trim().length === 0 || val.includes('@')) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        fetchIngredientList(val);
        setLoading(false);
        setData(['gmail.com', 'outlook.com', 'yahoo.com'].map((provider) => `${val}@${provider}`));
      }, 1000);
    }
  };
  return (
    <Autocomplete
      value={value}
      data={data}
      onChange={handleChange}
      rightSection={loading ? <Loader size={16} /> : null}
      label="What was the last thing you ate?"
      placeholder="Apple, Fried rice, Pizza..."
    />
  );
}
