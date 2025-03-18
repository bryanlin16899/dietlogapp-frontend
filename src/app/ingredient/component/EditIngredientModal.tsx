import { Ingredient, UnitType, updateIngredient, fetchIngredientById } from '@/lib/api';
import {
  Button,
  Collapse,
  Group,
  Image,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconChevronUp, IconPhoto } from '@tabler/icons-react';
import React, { useState } from 'react';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unitType, setUnitType] = useState<UnitType>('grams');
  const [imageUploadOpened, { toggle: toggleImageUpload }] = useDisclosure(false);

  // Function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  const form = useForm({
    initialValues: {
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      serving_size_grams: 0,
      image_base64: ''
    },
    validate: {
      name: (value) => value.trim().length > 0 ? null : 'Name is required',
      calories: (value) => value >= 0 ? null : 'Calories must be non-negative'
    },
  });

  React.useEffect(() => {
    const loadIngredientDetails = async () => {
      if (ingredient) {
        try {
          const fullIngredient = await fetchIngredientById(ingredient.id);
          
          form.setValues({
            name: fullIngredient.name,
            calories: unitType === 'grams' ? fullIngredient.calories : fullIngredient.serving_calories,
            protein: unitType === 'grams' ? fullIngredient.protein : fullIngredient.serving_protein,
            fat: unitType === 'grams' ? fullIngredient.fat : fullIngredient.serving_fat,
            carbohydrates: unitType === 'grams' ? fullIngredient.carbohydrates : fullIngredient.serving_carbohydrates,
            serving_size_grams: fullIngredient.serving_size_grams,
            image_base64: fullIngredient.image_base64,
          });
          
          setUnitType(fullIngredient.unit_type as UnitType);
          // Reset image state when ingredient changes
          setImageFile(null);
          setImagePreview(fullIngredient?.image_base64 || null);
        } catch (error) {
          notifications.show({
            position: 'top-right',
            title: '載入失敗',
            message: '無法取得食材詳細資訊',
            color: 'red',
          });
        }
      }
    };

    loadIngredientDetails();
  }, [ingredient, unitType]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!ingredient) return;
    
    setIsLoading(true);
    try {
      const updateData = {
        id: ingredient.id,
        ...values
      };
      
      // Add image_base64 if an image was uploaded
      if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        updateData.image_base64 = base64Image;
      } else {
        updateData.image_base64 = "";
      }

      const updatedIngredient = await updateIngredient(updateData);
      
      notifications.show({
        position: 'top-right',
        title: '食材已修改',
        message: `${values.name} 已成功修改`,
        color: 'green',
      });

      onUpdate(updatedIngredient);
      onClose();
      
      // Reset image state
      setImageFile(null);
      setImagePreview(null);
    } catch {
      notifications.show({
        position: 'top-right',
        title: '食材修改失敗',
        message: '無法成功修改食材',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
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
          <SegmentedControl
            disabled
            value={unitType}
            data={[
              { label: '克', value: 'grams' },
              { label: '份', value: 'servings' }
            ]}
            fullWidth
            mb="sm"
          />
          <NumberInput
            label="熱量"
            placeholder=""
            size='md'
            {...form.getInputProps('calories')}
          />
          <NumberInput
            label={`蛋白質 (${unitType === 'grams' ? '100g' : '每份'})`}
            placeholder=""
            size='md'
            {...form.getInputProps('protein')}
          />
          <NumberInput
            label={`脂肪 (${unitType === 'grams' ? '100g' : '每份'})`}
            placeholder="Fat"
            size='md'
            {...form.getInputProps('fat')}
          />
          <NumberInput
            label={`碳水化合物 (${unitType === 'grams' ? '100g' : '每份'})`}
            placeholder="Carbohydrates"
            size='md'
            {...form.getInputProps('carbohydrates')}
          />
          { unitType === 'grams' && (
            <NumberInput
              label="每份重量 (每100g)"
              placeholder="Serving Size"
              size='md'
              {...form.getInputProps('serving_size_grams')}
            />
          ) }
          
          <Group justify="space-between" align="center" mb={5}>
            <Text size="md" fw={500}>產品圖片</Text>
            <Button 
              variant="subtle" 
              onClick={toggleImageUpload}
              rightSection={imageUploadOpened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            >
              {imageUploadOpened ? '收起' : '展開'}
            </Button>
          </Group>
          
          <Collapse in={imageUploadOpened}>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4">
              {imagePreview ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Image 
                    src={imagePreview} 
                    alt="Product preview" 
                    fit="contain"
                    h={180}
                  />
                  <Text size="sm" c="green" mt={7}>
                    已選擇: {imageFile?.name}
                  </Text>
                  <Button 
                    variant="subtle" 
                    color="red" 
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    mt={5}
                  >
                    移除圖片
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <IconPhoto size={50} stroke={1.5} className="mx-auto mb-2" />
                  <Text size="xl" mb={2}>
                    上傳產品圖片
                  </Text>
                  <Text size="sm" c="dimmed" mb={3}>
                    檔案不超過 5MB
                  </Text>
                  <input
                    type="file"
                    id="imageUploadEdit"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          notifications.show({
                            position: 'top-right',
                            title: '檔案過大',
                            message: '請上傳小於 5MB 的圖片',
                            color: 'red'
                          });
                          return;
                        }
                        
                        setImageFile(file);
                        const imageUrl = URL.createObjectURL(file);
                        setImagePreview(imageUrl);
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('imageUploadEdit')?.click()}
                  >
                    選擇圖片
                  </Button>
                </div>
              )}
            </div>
          </Collapse>
          
          {imageFile && !imageUploadOpened && (
            <Text size="sm" c="green" mt={2} mb={5}>
              已選擇圖片: {imageFile.name}
            </Text>
          )}
          
          <Group justify="flex-end" mt="md">
            <Button 
              type="submit" 
              color="blue"
              loading={isLoading}
            >
              編輯
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
