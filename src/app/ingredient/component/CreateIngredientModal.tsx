import { createIngredient, createIngredientByImage, CreateIngredientData } from "@/lib/api";
import {
    Button,
    Group,
    Modal,
    NumberInput,
    Select,
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
        message: 'Ingredient created successfully',
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
    } catch (error) {
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: 'Failed to create ingredient',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Add New Ingredient" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Add Ingredient Method"
            placeholder="Select method"
            data={[
              { value: 'manual', label: 'Type Manually' },
              { value: 'image', label: 'Add by Image' }
            ]}
            value={addMethod}
            onChange={(value) => setAddMethod(value as AddMethodType)}
          />

          <TextInput
            label="Name"
            placeholder="Ingredient Name"
            required
            {...form.getInputProps('name')}
          />

          {addMethod === 'manual' && (
            <>
              <NumberInput
                label="Calories (100g)"
                placeholder="Calories"
                required
                {...form.getInputProps('calories')}
              />
              <NumberInput
                label="Protein (100g)"
                placeholder="Protein"
                {...form.getInputProps('protein')}
              />
              <NumberInput
                label="Fat"
                placeholder="Fat (100g)"
                {...form.getInputProps('fat')}
              />
              <NumberInput
                label="Carbohydrates"
                placeholder="Carbohydrates (100g)"
                {...form.getInputProps('carbohydrates')}
              />
              <NumberInput
                label="Serving Size (grams)"
                placeholder="Serving Size"
                {...form.getInputProps('serving_size_grams')}
              />
            </>
          )}

          {addMethod === 'image' && (
            <Dropzone
              onDrop={(files) => {
                setImageFile(files[0]);
              }}
              onReject={(files) => {
                notifications.show({
                  position: 'top-right',
                  title: 'Invalid file',
                  message: 'Please upload a valid image file',
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
                    Drag image here or click to select file
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    File should not exceed 3MB
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
              loading={isLoading}
              disabled={isLoading || (addMethod === 'image' && !imageFile)}
            >
              {addMethod === 'manual' ? 'Add Ingredient' : 'Add Image Ingredient'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
