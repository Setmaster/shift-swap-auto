import './globals.css'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import MainHeader from "@/components/MainHeader/MainHeader";
import { theme } from '@/theme';
import React from "react";

export const metadata = {
  title: 'Shift Swapper',
  description: 'Welcome to Shift Swapper!',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
                                     children,
                                   }: RootLayoutProps) {
  return (
      <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <ColorSchemeScript defaultColorScheme={"dark"} />
      </head>
      <body>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <MainHeader/>
        {children}
      </MantineProvider>
      </body>
      </html>
  );
}