import './globals.css'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import MainHeader from "@/components/MainHeader/MainHeader";
import {theme} from '@/theme';
import React from "react";
import {Notifications} from "@mantine/notifications";
import SignalRProvider from "@/lib/providers/SignalRProvider";
import {getCurrentUser} from "@/lib/actions/authActions";

export const metadata = {
    title: 'Shift Swapper',
    description: 'Welcome to Shift Swapper!',
};

type RootLayoutProps = {
    children: React.ReactNode;
};

export default async function RootLayout({
                                       children,
                                   }: RootLayoutProps) {
    const user = await getCurrentUser();
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <ColorSchemeScript defaultColorScheme={"dark"}/>
        </head>
        <body>
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
            <Notifications/>
            <MainHeader/>
            <SignalRProvider user={user}>
                {children}
            </SignalRProvider>
        </MantineProvider>
        </body>
        </html>
    );
}