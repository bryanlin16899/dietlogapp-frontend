import { Ingredient, updateIngredient } from '@/lib/api';
import { Button, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React from 'react';

interface EditIngredientModalProps {
  ingredient: Ingredient | null;
  opened: boolean;
  onClose: () => void;
  onUpdate: (updatedIngredient: Ingredient) => void;
}

export function EditIngredientModal({ 
  ingredient, 
  opened, 
  onClose, 
  onUpdate 
}: EditIngredientModalProps) {
  const form = useForm({
    initialValues: {
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      serving_size_grams: 0,
    },
    validate: {
      name: (value) => value.trim().length > 0 ? null : 'Name is required',
      calories: (value) => value >= 0 ? null : 'Calories must be non-negative',
      serving_size_grams: (value) => value > 0 ? null : 'Serving size must be positive',
    },
  });

  React.useEffect(() => {
    if (ingredient) {
      form.setValues({
        name: ingredient.name,
        calories: ingredient.calories,
        protein: ingredient.protein,
        fat: ingredient.fat,
        carbohydrates: ingredient.carbohydrates,
        serving_size_grams: ingredient.serving_size_grams,
      });
    }
  }, [ingredient]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!ingredient) return;

    try {
      const updatedIngredient = await updateIngredient({
        id: ingredient.id,
        ...values
      });

      notifications.show({
        title: 'Ingredient Updated',
        message: `${values.name} has been successfully updated`,
        color: 'green',
      });

      onUpdate(updatedIngredient);
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Update Failed',
        message: 'Unable to update ingredient',
        color: 'red',
      });
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="編輯食材"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack
            gap='sm'
        >
          <TextInput
            label="名稱"
            placeholder="毛豆 🫛"
            size='md'
            {...form.getInputProps('name')}
          />
          <NumberInput
            label="熱量"
            placeholder=""
            precision={1}
            size='md'
            {...form.getInputProps('calories')}
          />
          <NumberInput
            label="蛋白質 (每100g)"
            placeholder=""
            precision={1}
            size='md'
            {...form.getInputProps('protein')}
          />
          <NumberInput
            label="脂肪 (每100g)"
            placeholder="Fat"
            precision={1}
            size='md'
            {...form.getInputProps('fat')}
          />
          <NumberInput
            label="碳水化合物 (每100g)"
            placeholder="Carbohydrates"
            precision={1}
            size='md'
            {...form.getInputProps('carbohydrates')}
          />
          <NumberInput
            label="每份重量 (每100g)"
            placeholder="Serving Size"
            size='md'
            {...form.getInputProps('serving_size_grams')}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit" color="blue">
              Update Ingredient
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
