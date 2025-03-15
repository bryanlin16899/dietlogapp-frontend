"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { IntakeFoodDetail } from "@/components/IntakeFoodDetail";
import { NavMenu } from "@/components/NavMenu";
import { StatsRing } from "@/components/Stats";
import { TableScrollArea } from "@/components/TableScrollArea";
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

// Component that uses useSearchParams
// function SearchParamsHandler() {
//   const searchParams = useSearchParams();
  
//   useEffect(() => {
//     const googleId = searchParams.get('id');
//     const userId = searchParams.get('user_id');
//     const name = searchParams.get('name');
//     const email = searchParams.get('email');
//     const picture = searchParams.get('picture');

//     if (googleId && userId && name && email) {
//       const userInfo = {
//         googleId,
//         userId,
//         name: decodeURIComponent(name),
//         email,
//         picture
//       };

//       localStorage.setItem('userInfo', JSON.stringify(userInfo));
//     }
//   }, [searchParams]);

//   return null;
// }

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
  }, [userInfo]);

  const handleIntakeSuccess = () => {
    handleFetchDietLog();
  };

  const handleFoodRowClick = (food: IntakeFood) => {
    setSelectedFood(food);
    setDetailModalOpened(true);
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
            <div className="flex w-full items-center justify-between">
              <Title>
                Hi {userInfo.name} 👋
              </Title>
              <DateInput
                variant="unstyled"
                value={logDate}
                onChange={setLogDate}
                aria-label="日期"
                min={"2025/01/01"}
                placeholder=""
                className="w-auto"
              />
            </div>
          )}
          <AutocompleteLoading onIntakeSuccess={handleIntakeSuccess}/>
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
          <TableScrollArea 
            ref={tableScrollAreaRef} 
            dietLog={dietLog} 
            onRemoveIntake={handleFetchDietLog}
            onFoodRowClick={handleFoodRowClick}
          />
          <IntakeFoodDetail
            food={selectedFood}
            opened={detailModalOpened}
            onClose={() => setDetailModalOpened(false)}
          />
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
