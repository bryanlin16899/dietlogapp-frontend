import {
  Box,
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider
} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import type { Metadata } from "next";
import { NavMenu } from "@/components/NavMenu";
import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: "Next App Mantine Tailwind Template",
  description: "Next App Mantine Tailwind Template",
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
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>
          <Notifications />
          <Box 
            pos="fixed" 
            top={10} 
            right={10} 
            zIndex={1000}
          >
            <NavMenu/>
          </Box>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
