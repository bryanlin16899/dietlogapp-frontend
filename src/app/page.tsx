"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { NavMenu } from "@/components/NavMenu";
import { StatsRing } from "@/components/Stats";
import { TableScrollArea } from "@/components/TableScrollArea";
import { fetchDietLog } from "@/lib/api";
import {
  AppShell,
  AppShellMain,
  Box,
  Text
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [dietLog, setDietLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tableScrollAreaRef = useRef<{ refreshDietLog: () => void }>(null);

  const handleFetchDietLog = async () => {
    try {
      const data = await fetchDietLog('Bryan', new Date().toISOString().split('T')[0]);
      setDietLog(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch diet log', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchDietLog();
  }, []);

  const handleIntakeSuccess = () => {
    handleFetchDietLog();
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
            <StatsRing dietLog={dietLog} />
          </div>
          <TableScrollArea 
            ref={tableScrollAreaRef} 
            dietLog={dietLog} 
            onRemoveIntake={handleFetchDietLog}
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
