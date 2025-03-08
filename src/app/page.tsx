import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import { TableScrollArea } from "@/components/TableScrollArea";
import {
  AppShell,
  AppShellMain,
  Text,
  Title
} from "@mantine/core";

export default function Home() {
  return (
    <AppShell 
      header={{ height: 60 }} 
      padding="md" 
      className="h-screen flex flex-col"
    >
      <AppShellMain className="flex flex-col justify-between h-full overflow-hidden">
        <div className="flex flex-col items-center justify-center flex-grow">
          <Title className="text-center mb-4">
            <AutocompleteLoading />
          </Title>
          <TableScrollArea className="w-full max-w-4xl"/>
        </div>
        
        <div className="flex flex-col items-center">
          <Text
            className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mb-4"
            ta="center"
            size="lg"
          >
            This starter Next.js project includes a minimal setup for Mantine with
            TailwindCSS. To get started edit page.tsx file.
          </Text>
          <div className="flex justify-center">
            <ColorSchemesSwitcher />
          </div>
        </div>
      </AppShellMain>
    </AppShell>
  );
}
