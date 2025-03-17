import { Ingredient } from "@/lib/api";
import { Badge, Divider, Group, Image, Modal, Stack, Text, Title } from "@mantine/core";

interface IngredientDetailProps {
  ingredient: Ingredient | null;
  opened: boolean;
  onClose: () => void;
  loading?: boolean;
}

export function IngredientDetail({ ingredient, opened, onClose, loading = false }: IngredientDetailProps) {
  if (!ingredient) return null;

  if (loading) {
    return (
      <Modal 
        opened={opened} 
        onClose={onClose} 
        title={<Title order={3}>食材資訊</Title>}
        size="md"
        centered
      >
        <Center h={200}>
          <Loader />
        </Center>
      </Modal>
    );
  }

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Title order={3}>食材資訊</Title>}
      size="md"
      centered
    >
      <Stack>
        <Group justify="space-between" align="center">
          <Title order={2}>{ingredient.name}</Title>
          <Badge size="lg" color={ingredient.added_by_image ? 'green' : 'blue'}>
            {ingredient.added_by_image ? '圖片新增' : '手動新增'}
          </Badge>
        </Group>
        
        <Divider my="sm" />
        
        <Stack gap="xs">
          <Text fw={500}>每 100 g</Text>
        </Stack>
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{ingredient.calories ? ingredient.calories.toFixed(1) : '-'}</Text>
            <Text size="sm" c="dimmed">熱量</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{ingredient.protein ? `${ingredient.protein.toFixed(1)}g` : '-'}</Text>
            <Text size="sm" c="dimmed">蛋白質</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{ingredient.fat ? `${ingredient.fat.toFixed(1)}g` : '-'}</Text>
            <Text size="sm" c="dimmed">脂肪</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{ingredient.carbohydrates ? `${ingredient.carbohydrates.toFixed(1)}g` : '-'}</Text>
            <Text size="sm" c="dimmed">碳水化合物</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        
        <Stack gap="xs">
          <Text fw={500}>每份: {ingredient.serving_size_grams}g</Text>
        </Stack>
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{ingredient.serving_calories.toFixed(1) || ingredient.calories.toFixed(1)}</Text>
            <Text size="sm" c="dimmed">熱量</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{ingredient.serving_protein.toFixed(1) || ingredient.protein.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">蛋白質</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{ingredient.serving_fat.toFixed(1) || ingredient.fat.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">脂肪</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{ingredient.serving_carbohydrates.toFixed(1) || ingredient.carbohydrates.toFixed(1)}g</Text>
            <Text size="sm" c="dimmed">碳水化合物</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        {ingredient.image_base64 && (
          <Stack gap="xs" align="center">
            <Image 
              src={ingredient.image_base64} 
              alt={ingredient.name}
              maw={250}
              mah={250}
              fit="contain"
            />
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
