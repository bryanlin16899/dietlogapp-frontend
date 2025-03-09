"use client";
import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { StatsRing } from "@/components/Stats";
import { TableScrollArea } from "@/components/TableScrollArea";
import {
  AppShell,
  AppShellMain,
  Text,
  Title
} from "@mantine/core";
import { useRef } from "react";

export default function Home() {
  const tableScrollAreaRef = useRef<{ refreshDietLog: () => void }>(null);

  const handleIntakeSuccess = () => {
    tableScrollAreaRef.current?.refreshDietLog();
  };

  return (
    <AppShell 
      header={{ height: 100 }} 
      padding="md" 
      className="h-screen flex flex-col"
    >
      <AppShellMain className="flex flex-col justify-between h-full overflow-hidden gap-0.5">
        <div className="flex flex-col items-center justify-center flex-grow">
          <Title className="text-center mb-4">
            <AutocompleteLoading onIntakeSuccess={handleIntakeSuccess} />
          </Title>
          <TableScrollArea ref={tableScrollAreaRef} />
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <StatsRing />
        </div>
        
        <div className="flex flex-col items-center">
          <Text
            className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mb-4"
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
