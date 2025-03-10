import { Badge, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

interface IngredientDetailProps {
  ingredient: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    serving_size_grams: number;
    added_by_image: boolean;
  };
  opened: boolean;
  onClose: () => void;
}

export function IngredientDetail({ ingredient, opened, onClose }: IngredientDetailProps) {
  if (!ingredient) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Title order={2}>Ingredient Details</Title>}
      size="md"
      centered
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Title order={3}>{ingredient.name}</Title>
          <Badge size="lg" color={ingredient.added_by_image ? 'green' : 'blue'}>
            {ingredient.added_by_image ? 'Image Scan' : 'Manual Entry'}
          </Badge>
        </Group>
        
        <Divider my="sm" />
        
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{ingredient.calories.toFixed(1)}</Text>
            <Text size="sm" c="dimmed">Calories</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{ingredient.protein.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">Protein</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{ingredient.fat.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">Fat</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{ingredient.carbohydrates.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">Carbs</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        
        <Stack gap="xs">
          <Text fw={500}>Serving Size: {ingredient.serving_size_grams}g</Text>
        </Stack>
      </Stack>
    </Modal>
  );
}
