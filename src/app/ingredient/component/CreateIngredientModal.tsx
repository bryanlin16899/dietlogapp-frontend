import { createIngredient, CreateIngredientData } from "@/lib/api";
import { Button, Group, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export function CreateIngredientModal({ 
  opened, 
  close,
  onIngredientCreated
}: { 
  opened: boolean; 
  close: () => void;
  onIngredientCreated?: () => void;
}) {
  const form = useForm({
    initialValues: {
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      serving_size_grams: 100,
      serving_calories: 0,
      serving_protein: 0,
      serving_fat: 0,
      serving_carbohydrates: 0,
    },
    validate: {
      name: (value) => value.trim() === '' ? 'Name is required' : null,
      calories: (value) => value < 0 ? 'Calories cannot be negative' : null,
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const ingredientData: CreateIngredientData = {
        name: values.name,
        calories: values.calories,
        protein: values.protein,
        fat: values.fat,
        carbohydrates: values.carbohydrates,
        serving_size_grams: values.serving_size_grams,
        serving_calories: values.serving_calories,
        serving_protein: values.serving_protein,
        serving_fat: values.serving_fat,
        serving_carbohydrates: values.serving_carbohydrates
      };

      await createIngredient(ingredientData);

      notifications.show({
        title: 'Success',
        message: 'Ingredient created successfully',
        color: 'green',
      });

      // Reset form and close modal
      form.reset();
      close();

      // Trigger callback to refresh ingredient list
      if (onIngredientCreated) {
        onIngredientCreated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create ingredient',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Add New Ingredient">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Ingredient Name"
          required
          {...form.getInputProps('name')}
        />
        <NumberInput
          label="Calories"
          placeholder="Calories"
          required
          {...form.getInputProps('calories')}
        />
        <NumberInput
          label="Protein"
          placeholder="Protein"
          {...form.getInputProps('protein')}
        />
        <NumberInput
          label="Fat"
          placeholder="Fat"
          {...form.getInputProps('fat')}
        />
        <NumberInput
          label="Carbohydrates"
          placeholder="Carbohydrates"
          {...form.getInputProps('carbohydrates')}
        />
        <NumberInput
          label="Serving Size (grams)"
          placeholder="Serving Size"
          {...form.getInputProps('serving_size_grams')}
        />
        <NumberInput
          label="Serving Calories"
          placeholder="Serving Calories"
          {...form.getInputProps('serving_calories')}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Add Ingredient</Button>
        </Group>
      </form>
    </Modal>
  );
}
