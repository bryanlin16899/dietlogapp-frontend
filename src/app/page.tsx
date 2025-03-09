"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { StatsRing } from "@/components/Stats";
import { TableScrollArea } from "@/components/TableScrollArea";
import { fetchDietLog } from "@/lib/api";
import {
  AppShell,
  AppShellMain,
  Text,
  Title
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
      className="h-screen flex flex-col"
    >
      <AppShellMain className="flex flex-col justify-between h-full overflow-hidden gap-0.5">
        <div className="flex flex-col items-center justify-center flex-grow">
          <Title className="text-center mb-2">
            <AutocompleteLoading onIntakeSuccess={handleIntakeSuccess} />
          </Title>
          <StatsRing dietLog={dietLog} />
          <TableScrollArea 
            ref={tableScrollAreaRef} 
            dietLog={dietLog} 
            onRemoveIntake={handleFetchDietLog}
          />
        </div>

        
        <div className="flex flex-col items-center">
          <Text
            className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mb-2"
            ta="center"
            size="lg"
          >
            Log you diet, mantain your diet and keep track of your diet.
            you can search for the food you eat and log it.
          </Text>
          <div className="flex justify-center">
            <ColorSchemesSwitcher />
          </div>
        </div>
      </AppShellMain>
    </AppShell>
  );
}
