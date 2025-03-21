"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { IntakeFoodDetail } from "@/components/IntakeFoodDetail";
import { IntakeFoodsTable } from "@/components/IntakeFoodsTable";
import { NavMenu } from "@/components/NavMenu";
import { StatsRing } from "@/components/Stats";
import { useUser } from "@/context/userContext";
import { fetchDietLog, GetDietLogResponse, IntakeFood } from "@/lib/api";
import {
  AppShell,
  AppShellMain,
  Box,
  Button,
  Collapse,
  Group,
  Text,
  Title
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Modal, TextInput, NumberInput, Group, Button, SegmentedControl } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export default function Home() {
  const [dietLog, setDietLog] = useState<GetDietLogResponse|null>(null);
  const [loading, setLoading] = useState(false);
  const [logDate, setLogDate] = useState<Date | null>(() => {
    const taiwanDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' })
    );
    return taiwanDate;
  });
  const [selectedFood, setSelectedFood] = useState<IntakeFood|null>(null);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [manualIntakeModalOpened, setManualIntakeModalOpened] = useState(false);
  const tableScrollAreaRef = useRef<{ refreshDietLog: () => void }>(null);
  const [opened, { toggle }] = useDisclosure(true);
  const { userInfo } = useUser();

  const handleFetchDietLog = async () => {
    try {
      if (!userInfo?.googleId) {
        console.warn('No user ID found');
        setLoading(false);
        return;
      }

      // Get date in Taiwan timezone (UTC+8)           
      const taiwanDate = new Date(                     
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' })
      );  

      // Format the date as YYYY-MM-DD                 
      const dateToFetch = logDate || taiwanDate;
      const formattedDate = dateToFetch.getFullYear() + '-' +
        String(dateToFetch.getMonth() + 1).padStart(2, '0') + '-' +                                      
        String(dateToFetch.getDate()).padStart(2, '0');
      const data = await fetchDietLog(userInfo.googleId, formattedDate);
      setDietLog(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch diet log', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.googleId) {
      handleFetchDietLog();
    }
  }, [userInfo, logDate]);

  const handleIntakeSuccess = () => {
    handleFetchDietLog();
  };

  const handleFoodRowClick = (food: IntakeFood) => {
    setSelectedFood(food);
    setDetailModalOpened(true);
  };

  const handleAddFood = () => {
    setManualIntakeModalOpened(true);
  };

  const manualIntakeForm = useForm({
    initialValues: {
      foodName: '',
      calories: 0,
      quantity: 0,
      unitType: 'grams' as UnitType
    },
    validate: {
      foodName: (value) => value.trim() === '' ? '食物名稱不能為空' : null,
      calories: (value) => value <= 0 ? '卡路里必須大於0' : null,
      quantity: (value) => value <= 0 ? '份量必須大於0' : null,
    }
  });

  const submitManualIntake = async () => {
    if (!userInfo?.googleId) {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '請先登入',
        color: 'red',
      });
      return;
    }

    const formValues = manualIntakeForm.validate();
    if (formValues.hasErrors) {
      return;
    }

    try {
      const formattedDate = logDate ? 
        `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}` : 
        new Date().toISOString().split('T')[0];

      await recordDietIntakeManually(
        userInfo.googleId, 
        formattedDate, 
        manualIntakeForm.values.foodName, 
        manualIntakeForm.values.calories, 
        manualIntakeForm.values.quantity, 
        manualIntakeForm.values.unitType
      );

      notifications.show({
        position: 'top-right',
        title: '成功',
        message: '食物已成功新增',
        color: 'green',
      });

      setManualIntakeModalOpened(false);
      handleFetchDietLog();
      manualIntakeForm.reset();
    } catch (error) {
      notifications.show({
        position: 'top-right',
        title: '錯誤',
        message: '新增食物失敗',
        color: 'red',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AppShell 
      header={{ height: 100 }} 
      padding="md"
      className="flex flex-col"
    >
      {/* <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense> */}
      <Box 
        pos="fixed"
        top={10}
        left={10}
      >
        <ColorSchemesSwitcher />
      </Box>
      <Box
        pos="fixed" 
        top={10} 
        right={10} 
      >
        <NavMenu/>
      </Box>
      <AppShellMain className="flex flex-col justify-between h-full overflow-hidden gap-0.5">
        <div className="flex flex-col items-center justify-center flex-grow max-w-[800px] w-full mx-auto px-4">
          {userInfo?.googleId && (
            <Group
              className="w-full mb-1 max-sm:flex-col max-sm:items-start max-sm:ml-0.5"
              justify="space-between"
            >
              <Title className="max-sm:text-center max-sm:-mb-1.5">
                Hi {userInfo.name} 👋
              </Title>
              <DateInput
                size="md"
                variant="unstyled"
                value={logDate}
                onChange={setLogDate}
                aria-label="日期"
                min={"2025/01/01"}
                placeholder=""
                valueFormat="YYYY / MM / DD"
                className="w-auto pt-0 max-sm:text-center text-right"
                id="custom-date-input"
                inputMode='none'
              />
            </Group>
          )}
          <AutocompleteLoading onIntakeSuccess={handleIntakeSuccess} logDate={logDate}/>
          <div className="w-full mb-2">
            <Group justify="center" className="w-full relative py-1">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 dark:bg-gray-700"></div>
              <Button 
                onClick={toggle}
                rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                variant="subtle"
                className="z-10 bg-white dark:bg-dark-700 hover:bg-white dark:hover:bg-dark-700"
              >
                {opened ? '隱藏' : '顯示'} 狀態
              </Button>
            </Group>
            <Collapse in={opened}>
              <StatsRing dietLog={dietLog} />
            </Collapse>
          </div>
          <IntakeFoodsTable 
            ref={tableScrollAreaRef} 
            dietLog={dietLog} 
            onRemoveIntake={handleFetchDietLog}
            onFoodRowClick={handleFoodRowClick}
            onAddFood={handleAddFood}
          />
          <IntakeFoodDetail
            food={selectedFood}
            opened={detailModalOpened}
            onClose={() => setDetailModalOpened(false)}
          />
          <Modal 
            opened={manualIntakeModalOpened} 
            onClose={() => {
              setManualIntakeModalOpened(false);
              manualIntakeForm.reset();
            }} 
            title="手動新增食物"
            size="md"
          >
            <form onSubmit={manualIntakeForm.onSubmit(submitManualIntake)}>
              <TextInput
                label="食物名稱"
                placeholder="輸入食物名稱"
                {...manualIntakeForm.getInputProps('foodName')}
                mb="md"
              />
              <NumberInput
                label="卡路里"
                placeholder="輸入卡路里"
                {...manualIntakeForm.getInputProps('calories')}
                mb="md"
                min={0}
              />
              <NumberInput
                label="份量"
                placeholder="輸入份量"
                {...manualIntakeForm.getInputProps('quantity')}
                mb="md"
                min={0}
              />
              <SegmentedControl
                label="單位"
                {...manualIntakeForm.getInputProps('unitType')}
                data={[
                  { label: '克', value: 'grams' },
                  { label: '份', value: 'servings' }
                ]}
                mb="md"
              />
              <Group justify="flex-end" mt="md">
                <Button type="submit" variant="filled">新增</Button>
              </Group>
            </form>
          </Modal>
          <Text
            className="text-center text-gray-700 dark:text-gray-300 mb-2"
            ta="center"
            size="lg"
          >
            Log your diet, maintain your diet and keep track of your nutrition.
          </Text>
        </div>
      </AppShellMain>
    </AppShell>
  );
}
