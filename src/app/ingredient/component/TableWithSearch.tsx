import { deleteIngredient, fetchIngredientList, Ingredient } from '@/lib/api';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  ScrollArea,
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

function sortData(
  data: Ingredient[],
  payload: { sortBy: keyof Ingredient | null; reversed: boolean; search: string }
) {
  const { sortBy, search } = payload;
  const query = search.toLowerCase().trim();

  const filteredData = data.filter((item) => 
    Object.values(item).some(
      (value) => 
        value && 
        value.toString().toLowerCase().includes(query)
    )
  );

  if (!sortBy) {
    return filteredData;
  }

  return filteredData.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return payload.reversed 
        ? valueB.localeCompare(valueA) 
        : valueA.localeCompare(valueB);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return payload.reversed 
        ? valueB - valueA 
        : valueA - valueB;
    }

    return 0;
  });
}

export function TableSort() {
  const [search, setSearch] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [sortedData, setSortedData] = useState<Ingredient[]>([]);
  const [sortBy, setSortBy] = useState<keyof Ingredient | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [selectedIngredientForEdit, setSelectedIngredientForEdit] = useState<Ingredient | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredientList('');
        setIngredients(data.ingredients);
        setSortedData(data.ingredients);
      } catch (error) {
        console.error('Failed to fetch ingredients', error);
      }
    };

    loadIngredients();
  }, []);

  const setSorting = (field: keyof Ingredient) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(ingredients, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(ingredients, { sortBy, reversed: reverseSortDirection, search: value }));
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
    } catch (error) {
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
      onClick={() => {
        setSelectedIngredient(ingredient);
        openDetailModal();
      }}
    >
      <Table.Td style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {ingredient.name}
      </Table.Td>
      <Table.Td>{ingredient.calories.toFixed(1)}</Table.Td>
      {!isMobile && (
        <>
          <Table.Td>{ingredient.protein.toFixed(1)}</Table.Td>
          <Table.Td>{ingredient.fat.toFixed(1)}</Table.Td>
          <Table.Td>{ingredient.carbohydrates.toFixed(1)}</Table.Td>
        </>
      )}
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
    <ScrollArea h={500} miw={isMobile ? 300 : 800}>
      <TextInput
        placeholder="搜尋食材"
        mb="sm"
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
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={isMobile ? 2 : 6}>
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
  );
}
