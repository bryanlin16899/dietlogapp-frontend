import { IntakeFood } from "@/lib/api";
import { Badge, Divider, Group, Modal, Stack, Text, Title } from "@mantine/core";

interface IntakeFoodDetailProps {
  food: IntakeFood|null;
  opened: boolean;
  onClose: () => void;
}

export function IntakeFoodDetail({ food, opened, onClose }: IntakeFoodDetailProps) {
  if (!food) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Title order={2}>食物資訊</Title>}
      size="md"
      centered
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Title order={3}>{food.name}</Title>
          {/* need type safe */}
          <Badge size="lg" color="blue">{food.quantity} {food.unit_type === 'grams' ? '克' : '份'}</Badge>
        </Group>
        
        <Divider my="sm" />
        
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{food.calories}</Text>
            <Text size="sm" c="dimmed">熱量</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{food.protein}g</Text>
            <Text size="sm" c="dimmed">蛋白質</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{food.fat}g</Text>
            <Text size="sm" c="dimmed">脂肪</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{food.carbohydrates}g</Text>
            <Text size="sm" c="dimmed">碳水化合物</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        
        {/* <Stack gap="xs">
          <Text fw={500}>Consumed at: {food.date}</Text>
          {food.notes && (
            <>
              <Text fw={500}>Notes:</Text>
              <Text>{food.notes}</Text>
            </>
          )}
        </Stack> */}
      </Stack>
    </Modal>
  );
}
