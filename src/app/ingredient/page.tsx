"use client";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { NavMenu } from "@/components/NavMenu";
import {
  AppShell,
  AppShellMain,
  Box,
  Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { CreateIngredientModal } from "./component/CreateIngredientModal";
import { TableSort } from "./component/TableWithSearch";

export default function Ingredients() {
  const [opened, { open, close }] = useDisclosure(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleIngredientCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppShell 
      header={{ height: 100 }} 
      padding="md" 
      className="h-screen flex flex-col"
    >
      <AppShellMain className="flex flex-col justify-between h-full overflow-hidden gap-0.5">
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
        <div className="flex flex-col items-center justify-center flex-grow">
            <Button
                onClick={open}
                className="mb-1"
            >
                <IconPlus size={16} stroke={1.5} />
                 新增食材
            </Button>
            <CreateIngredientModal 
              opened={opened} 
              close={close} 
              onIngredientCreated={handleIngredientCreated}
            />
            <TableSort key={refreshTrigger}/>
        </div>

        
        {/* <div className="flex flex-col items-center">
          <Text
            className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mb-2"
            ta="center"
            size="lg"
          >
            Log you diet, mantain your diet and keep track of your diet.
          </Text>
        </div> */}
      </AppShellMain>
    </AppShell>
  );
}
