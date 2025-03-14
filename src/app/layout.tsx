import { UserProvider } from "@/context/userContext";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider
} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import type { Metadata } from "next";
import "./globals.css";
import theme from "./theme";
import { CaloriesGoalDialog } from "@/components/CaloriesGoalDialog";

export const metadata: Metadata = {
  title: "DietLog",
  description: "Maintain your diet and keep track of your nutrition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <UserProvider>
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
          <CaloriesGoalDialog />
        </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
