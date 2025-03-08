import { AutocompleteLoading } from "@/components/AutocompleteLoading";
import { ColorSchemesSwitcher } from "@/components/color-schemes-switcher";
import {
  AppShell,
  AppShellMain,
  Text,
  Title
} from "@mantine/core";

export default function Home() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      {/* <AppShellHeader>
        <Group className="h-full px-md">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </Group>
      </AppShellHeader> */}
      <AppShellMain>
        <Title className="text-center mt-20">
          <AutocompleteLoading />
        </Title>
        <Text
          className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mx-auto mt-xl"
          ta="center"
          size="lg"
          maw={580}
          mx="auto"
          mt="xl"
        >
          This starter Next.js project includes a minimal setup for Mantine with
          TailwindCSS. To get started edit page.tsx file.
        </Text>

        <div className="flex justify-center mt-10">
          <ColorSchemesSwitcher />
        </div>
        
      </AppShellMain>
    </AppShell>
  );
}
