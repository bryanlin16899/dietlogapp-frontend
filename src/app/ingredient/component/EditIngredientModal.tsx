import { updateIngredient, Ingredient } from '@/lib/api';
import { Button, Group, Modal, NumberInput, TextInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

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
      title="Edit Ingredient"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Ingredient name"
            {...form.getInputProps('name')}
          />
          <NumberInput
            label="Calories"
            placeholder="Calories"
            precision={1}
            {...form.getInputProps('calories')}
          />
          <NumberInput
            label="Protein (g)"
            placeholder="Protein"
            precision={1}
            {...form.getInputProps('protein')}
          />
          <NumberInput
            label="Fat (g)"
            placeholder="Fat"
            precision={1}
            {...form.getInputProps('fat')}
          />
          <NumberInput
            label="Carbohydrates (g)"
            placeholder="Carbohydrates"
            precision={1}
            {...form.getInputProps('carbohydrates')}
          />
          <NumberInput
            label="Serving Size (g)"
            placeholder="Serving Size"
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
