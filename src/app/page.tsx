"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { IntakeFoodDetail } from "@/components/IntakeFoodDetail";
import { NavMenu } from "@/components/NavMenu";
import { StatsRing } from "@/components/Stats";
import { TableScrollArea } from "@/components/TableScrollArea";
import { useUser } from "@/context/userContext";
import { fetchDietLog } from "@/lib/api";
import {
  AppShell,
  AppShellMain,
  Box,
  Button,
  Collapse,
  Group,
  Text
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from "react";

// Component that uses useSearchParams
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const googleId = searchParams.get('id');
    const userId = searchParams.get('user_id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const picture = searchParams.get('picture');

    if (googleId && userId && name && email) {
      const userInfo = {
        googleId,
        userId,
        name: decodeURIComponent(name),
        email,
        picture
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const [dietLog, setDietLog] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const tableScrollAreaRef = useRef<{ refreshDietLog: () => void }>(null);
  const [opened, { toggle }] = useDisclosure(false);
  const { userInfo } = useUser();

  const handleFetchDietLog = async () => {
    try {
      if (!userInfo?.googleId) {
        console.warn('No user ID found');
        setLoading(false);
        return;
      }
      const data = await fetchDietLog(userInfo.googleId, new Date().toISOString().split('T')[0]);
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

  const handleFoodRowClick = (food: any) => {
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
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
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
          <AutocompleteLoading onIntakeSuccess={handleIntakeSuccess}/>
          <div className="w-full mb-4">
            <Group justify="center" className="w-full">
              <Button 
                onClick={toggle}
                rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                variant="subtle"
              >
                {opened ? 'Hide' : 'Show'} Stats
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
            Search for the food you eat and log it easily.
          </Text>
        </div>
      </AppShellMain>
    </AppShell>
  );
}
