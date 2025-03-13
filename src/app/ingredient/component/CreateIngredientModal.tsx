import { createIngredient, createIngredientByImage, CreateIngredientData } from "@/lib/api";
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
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronDown, IconChevronUp, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      serving_size_grams: 100,
      serving_calories: 0,
      serving_protein: 0,
      serving_fat: 0,
      serving_carbohydrates: 0,
      image_base64: '',
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
          image_base64: values.image_base64,
        };

        // Add image_base64 if an image was uploaded
        if (imageFile) {
          const base64Image = await fileToBase64(imageFile);
          ingredientData.image_base64 = base64Image;
        }

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
      setImagePreview(null);
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
            onChange={(value: string) => {
              setAddMethod(value as AddMethodType);
              // Reset form and image when switching methods
              form.reset();
              setImageFile(null);
              setImagePreview(null);
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
                <Dropzone
                  onDrop={(files) => {
                    setImageFile(files[0]);
                    const imageUrl = URL.createObjectURL(files[0]);
                    setImagePreview(imageUrl);
                  }}
                  onReject={() => {
                    notifications.show({
                      position: 'top-right',
                      title: '無效檔案',
                      message: '請上傳圖片檔案',
                      color: 'red'
                    });
                  }}
                  maxSize={5 * 1024 * 1024}
                  accept={IMAGE_MIME_TYPE}
                  disabled={isLoading}
                >
                  <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                    {!imagePreview ? (
                      <>
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
                            檔案不超過 5MB
                          </Text>
                        </div>
                      </>
                    ) : (
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
                      </div>
                    )}
                  </Group>
                </Dropzone>
              </Collapse>
              
              {imageFile && !imageUploadOpened && (
                <Text size="sm" c="green" mt={2} mb={5}>
                  已選擇圖片: {imageFile.name}
                </Text>
              )}
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
              maxSize={5 * 1024 * 1024}
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
                    檔案不超過 5MB
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
