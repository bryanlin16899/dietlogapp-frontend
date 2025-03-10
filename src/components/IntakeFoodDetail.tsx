import { Badge, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

interface IntakeFoodDetailProps {
  food: any;
  opened: boolean;
  onClose: () => void;
}

export function IntakeFoodDetail({ food, opened, onClose }: IntakeFoodDetailProps) {
  if (!food) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Title order={3}>Food Details</Title>}
      size="md"
      centered
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Title order={4}>{food.name}</Title>
          <Badge size="lg" color="blue">{food.quantity} {food.unit_type === 'grams' ? 'g' : 'serving'}</Badge>
        </Group>
        
        <Divider my="sm" />
        
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{food.calories}</Text>
            <Text size="sm" c="dimmed">Calories</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{food.protein}g</Text>
            <Text size="sm" c="dimmed">Protein</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{food.fat}g</Text>
            <Text size="sm" c="dimmed">Fat</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{food.carbohydrates}g</Text>
            <Text size="sm" c="dimmed">Carbs</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        
        <Stack gap="xs">
          <Text fw={500}>Consumed at: {new Date(food.created_at).toLocaleString()}</Text>
          {food.notes && (
            <>
              <Text fw={500}>Notes:</Text>
              <Text>{food.notes}</Text>
            </>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
}
