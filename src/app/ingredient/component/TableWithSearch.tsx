import { deleteIngredient, fetchIngredientById, fetchIngredientList, Ingredient } from '@/lib/api';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconChevronUp, IconEdit, IconSearch, IconSelector, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { EditIngredientModal } from './EditIngredientModal';
import { IngredientDetail } from './IngredientDetail';
import classes from './TableWithSearch.module.css';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// Removed sortData function as we're now using API-side filtering

export function TableSort() {
  const [search, setSearch] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [sortedData, setSortedData] = useState<Ingredient[]>([]);
  const [sortBy, setSortBy] = useState<keyof Ingredient | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  
  const PAGE_SIZE = 10;
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [selectedIngredientForEdit, setSelectedIngredientForEdit] = useState<Ingredient | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredientList(
          search, 
          false, // 不拿圖片
          {
            page: currentPage,
            page_size: PAGE_SIZE
          });
        setIngredients(data.ingredients);
        setSortedData(data.ingredients);
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };

    loadIngredients();
  }, [currentPage]);

  const setSorting = async (field: keyof Ingredient) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    
    try {
      const data = await fetchIngredientList(
        search, 
        false, // 不拿圖片
        {
          page: currentPage,
          page_size: PAGE_SIZE
        });
      setIngredients(data.ingredients);
      setSortedData(data.ingredients);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch sorted ingredients', error);
    }
  };

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    
    try {
      const data = await fetchIngredientList(
        value, 
        false,
        {
          page: currentPage,
          page_size: PAGE_SIZE
        });
      setIngredients(data.ingredients);
      setSortedData(data.ingredients);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to search ingredients', error);
    }
  };

  const handleDeleteIngredient = async () => {
    if (!ingredientToDelete) return;

    try {
      await deleteIngredient(ingredientToDelete.id);
      
      // Remove the deleted ingredient from the list
      const updatedIngredients = ingredients.filter(ing => ing.id !== ingredientToDelete.id);
      setIngredients(updatedIngredients);
      setSortedData(updatedIngredients);

      notifications.show({
        position: 'top-right',
        title: '刪除食材',
        message: `${ingredientToDelete.name} 成功刪除`,
        color: 'green',
      });

      closeDeleteModal();
    } catch {
      notifications.show({
        position: 'top-right',
        title: 'Error',
        message: '刪除失敗',
        color: 'red',
      });
    }
  };

  const rows = sortedData.map((ingredient) => (
    <Table.Tr 
      key={ingredient.id} 
      style={{ cursor: 'pointer' }}
      onClick={async () => {
        setIsLoadingDetail(true);
        try {
          const fullIngredientDetail = await fetchIngredientById(ingredient.id);
          setSelectedIngredient(fullIngredientDetail);
          openDetailModal();
        } catch {
          notifications.show({
            position: 'top-right',
            title: '載入失敗',
            message: '無法取得食材詳細資訊',
            color: 'red',
          });
        } finally {
          setIsLoadingDetail(false);
        }
      }}
    >
      <Table.Td style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {ingredient.name}
      </Table.Td>
      <Table.Td>{ingredient.unit_type === 'grams' ? ingredient.calories.toFixed(1) : ingredient.serving_calories.toFixed(1)}</Table.Td>
      {!isMobile && (
        <>
          <Table.Td>{ingredient.unit_type === 'grams' ? ingredient.protein.toFixed(1) : ingredient.serving_protein}</Table.Td>
          <Table.Td>{ingredient.unit_type === 'grams' ? ingredient.fat.toFixed(1) : ingredient.serving_fat}</Table.Td>
          <Table.Td>{ingredient.unit_type === 'grams' ? ingredient.carbohydrates.toFixed(1) : ingredient.serving_carbohydrates}</Table.Td>
        </>
      )}
      <Table.Td>
        {ingredient.unit_type === 'grams' ? '百克' : '每份'}
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon 
            variant="subtle" 
            color="blue" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIngredientForEdit(ingredient);
              openEditModal();
            }}
          >
            <IconEdit size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon 
            variant="subtle" 
            color="red" 
            onClick={(e) => {
              e.stopPropagation();
              setIngredientToDelete(ingredient);
              openDeleteModal();
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack>
      <ScrollArea h={isMobile ? 380 : 720} miw={isMobile ? 300 : 800}>
        <TextInput
          placeholder="搜尋食材"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          miw={isMobile ? 300 : 800} 
          fz={isMobile ? 'xs' : 'sm'}
          verticalSpacing={isMobile ? 'xs' : 'md'}
          highlightOnHover
          striped
        >
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'name'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('name')}
              >
                名稱
              </Th>
              <Th
                sorted={sortBy === 'calories'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('calories')}
              >
                熱量
              </Th>
              {!isMobile && (
                <>
                  <Th
                    sorted={sortBy === 'protein'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('protein')}
                  >
                    蛋白質
                  </Th>
                  <Th
                    sorted={sortBy === 'fat'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('fat')}
                  >
                    脂肪
                  </Th>
                  <Th
                    sorted={sortBy === 'carbohydrates'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('carbohydrates')}
                  >
                    碳水化合物
                  </Th>
                </>
              )}
              <Table.Th>單位</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={isMobile ? 4 : 7}>
                  <Text fw={500} ta="center">
                    無
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
        <IngredientDetail 
          ingredient={selectedIngredient} 
          opened={detailModalOpened} 
          onClose={closeDetailModal} 
          loading={isLoadingDetail}
        />
        <EditIngredientModal
          ingredient={selectedIngredientForEdit}
          opened={editModalOpened}
          onClose={closeEditModal}
          onUpdate={(updatedIngredient) => {
            // Update the ingredient in the list
            const updatedIngredients = ingredients.map(ing => 
              ing.id === updatedIngredient.id ? updatedIngredient : ing
            );
            setIngredients(updatedIngredients);
            setSortedData(updatedIngredients);
          }}
        />
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          title="確認刪除食材"
          centered
        >
          <Text mb="md">
            您確定要刪除 <strong>{ingredientToDelete?.name}</strong> 嗎？
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal}>
              取消
            </Button>
            <Button color="red" onClick={handleDeleteIngredient}>
              刪除
            </Button>
          </Group>
        </Modal>
      </ScrollArea>
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
