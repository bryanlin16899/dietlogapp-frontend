import { createIngredient, createIngredientByImage, CreateIngredientData } from "@/lib/api";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";

type AddMethodType = 'manual' | 'image';

export function CreateIngredientModal({ 
  opened, 
  close,
  onIngredientCreated
}: { 
  opened: boolean; 
  close: () => void;
  onIngredientCreated?: () => void;
}) {
  const [addMethod, setAddMethod] = useState<AddMethodType>('manual');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      if (addMethod === 'manual') {
        const ingredientData: CreateIngredientData = {
          name: values.name,
          calories: values.calories,
          protein: values.protein,
          fat: values.fat,
          carbohydrates: values.carbohydrates,
          serving_size_grams: values.serving_size_grams,
        };

        await createIngredient(ingredientData);
      } else if (addMethod === 'image' && imageFile) {
        await createIngredientByImage(imageFile, values.name);
      }

      notifications.show({
        position: 'top-right',
        title: 'Success',
        message: '食物新增成功',
        color: 'green',
      });

      // Reset form and close modal
      form.reset();
      setImageFile(null);
      close();

      // Trigger callback to refresh ingredient list
      if (onIngredientCreated) {
        onIngredientCreated();
      }
    } catch {
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: '食物新增失敗',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="新增食物" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <SegmentedControl
            value={addMethod}
            onChange={(value: AddMethodType) => {
              setAddMethod(value);
              // Reset form and image when switching methods
              form.reset();
              setImageFile(null);
            }}
            data={[
              { label: '手動輸入', value: 'manual' },
              { label: '圖片', value: 'image' }
            ]}
            fullWidth
          />

          <TextInput
            label="名稱"
            placeholder="鳳梨Pizza 🍍🍕"
            size="md"
            required
            {...form.getInputProps('name')}
          />

          {addMethod === 'manual' && (
            <>
              <NumberInput
                label="熱量 (100g)"
                size="md"
                required
                {...form.getInputProps('calories')}
              />
              <NumberInput
                label="蛋白質 (100g)"
                size="md"
                placeholder="Protein"
                {...form.getInputProps('protein')}
              />
              <NumberInput
                label="脂肪 (100g)"
                size="md"
                placeholder="Fat (100g)"
                {...form.getInputProps('fat')}
              />
              <NumberInput
                label="碳水化合物 (100g)"
                size="md"
                placeholder="Carbohydrates (100g)"
                {...form.getInputProps('carbohydrates')}
              />
              <NumberInput
                label="每份重量(g)"
                size="md"
                placeholder="50"
                {...form.getInputProps('serving_size_grams')}
              />
            </>
          )}

          {addMethod === 'image' && (
            <Dropzone
              onDrop={(files) => {
                setImageFile(files[0]);
              }}
              onReject={() => {
                notifications.show({
                  position: 'top-right',
                  title: '無效檔案',
                  message: '請上傳圖片檔案',
                  color: 'red'
                });
              }}
              maxSize={3 * 1024 * 1024}
              accept={IMAGE_MIME_TYPE}
              disabled={isLoading}
            >
              <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={50} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    拖曳或點擊上傳圖片
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    檔案不超過 3MB
                  </Text>
                  {imageFile && (
                    <Text size="sm" c="green" inline mt={7}>
                      Selected: {imageFile.name}
                    </Text>
                  )}
                </div>
              </Group>
            </Dropzone>
          )}

          <Group justify="flex-end" mt="md">
            <Button 
              type="submit" 
              w={120}
              loading={isLoading}
              disabled={isLoading || (addMethod === 'image' && !imageFile)}
            >
              新增
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
