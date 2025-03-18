import { Ingredient } from "@/lib/api";
import { Badge, Center, Divider, Group, Image, Loader, Modal, Stack, Text, Title } from "@mantine/core";

// Helper function to format nutrition values
const formatNutritionValue = (
  servingValue: number | undefined, 
  baseValue: number, 
  unit: 'calories' | 'protein' | 'fat' | 'carbohydrates'
): string => {
  const value = servingValue && servingValue > 0 ? servingValue : baseValue;
  
  if (value <= 0) return '-';
  
  const formattedValue = value.toFixed(1);
  
  return unit === 'calories' 
    ? formattedValue 
    : `${formattedValue}g`;
};

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
        <Stack>
          <Skeleton height={50} />
          <Skeleton height={20} />
          <Group grow>
            {[1, 2, 3, 4].map((item) => (
              <Stack key={item} gap="xs">
                <Skeleton height={30} />
                <Skeleton height={15} />
              </Stack>
            ))}
          </Group>
          <Skeleton height={200} />
        </Stack>
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
            <Text fw={700} size="lg" c="blue">{formatNutritionValue(undefined, ingredient.calories, 'calories')}</Text>
            <Text size="sm" c="dimmed">熱量</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{formatNutritionValue(undefined, ingredient.protein, 'protein')}</Text>
            <Text size="sm" c="dimmed">蛋白質</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{formatNutritionValue(undefined, ingredient.fat, 'fat')}</Text>
            <Text size="sm" c="dimmed">脂肪</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{formatNutritionValue(undefined, ingredient.carbohydrates, 'carbohydrates')}</Text>
            <Text size="sm" c="dimmed">碳水化合物</Text>
          </Stack>
        </Group>
        
        <Divider my="sm" />
        
        <Stack gap="xs">
          <Text fw={500}>每份: {ingredient.serving_size_grams}g</Text>
        </Stack>
        <Group grow>
          <Stack gap="xs">
            <Text fw={700} size="lg" c="blue">{formatNutritionValue(ingredient.serving_calories, ingredient.calories, 'calories')}</Text>
            <Text size="sm" c="dimmed">熱量</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="red">{formatNutritionValue(ingredient.serving_protein, ingredient.protein, 'protein')}</Text>
            <Text size="sm" c="dimmed">蛋白質</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="yellow">{formatNutritionValue(ingredient.serving_fat, ingredient.fat, 'fat')}</Text>
            <Text size="sm" c="dimmed">脂肪</Text>
          </Stack>
          
          <Stack gap="xs">
            <Text fw={700} size="lg" c="green">{formatNutritionValue(ingredient.serving_carbohydrates, ingredient.carbohydrates, 'carbohydrates')}</Text>
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
