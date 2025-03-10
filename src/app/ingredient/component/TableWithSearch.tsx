import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { fetchIngredientList, Ingredient } from '@/lib/api';
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

  const rows = sortedData.map((ingredient) => (
    <Table.Tr key={ingredient.id}>
      <Table.Td>{ingredient.name}</Table.Td>
      <Table.Td>{ingredient.calories.toFixed(1)}</Table.Td>
      <Table.Td>{ingredient.protein.toFixed(1)}</Table.Td>
      <Table.Td>{ingredient.fat.toFixed(1)}</Table.Td>
      <Table.Td>{ingredient.carbohydrates.toFixed(1)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={500} miw={400}>
      <TextInput
        placeholder="Search ingredients"
        mb="sm"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        miw={400} 
        fz={isMobile ? 'xs' : 'sm'}
        verticalSpacing={isMobile ? 'xs' : 'md'}
      >
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'calories'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('calories')}
            >
              Calories
            </Th>
            <Th
              sorted={sortBy === 'protein'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('protein')}
            >
              Protein
            </Th>
            <Th
              sorted={sortBy === 'fat'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('fat')}
            >
              Fat
            </Th>
            <Th
              sorted={sortBy === 'carbohydrates'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('carbohydrates')}
            >
              Carbohydrates
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
