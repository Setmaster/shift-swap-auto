'use client';
import cx from 'clsx';
import { useState } from 'react';
import {
    Container,
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    Tabs,
    Burger,
    rem,
    useMantineTheme, Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown,
} from '@tabler/icons-react';
import shiftSwapperLogo from '@/assets/logo.svg';
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";

import Link from "next/link";
import classes from './MainHeader.module.css';

// Define the interface for links
interface LinkItem {
    link: string;
    label: string;
    links?: LinkItem[];
}

// Define the links array
const links: LinkItem[] = [
    { link: '/contraptions', label: 'Contraptions' },
    { link: '/contraptions/share', label: 'Share' },
    { link: '/community', label: 'Community' },
    {
        link: '/about',
        label: 'About',
        links: [
            { link: '/faq', label: 'FAQ' },
            { link: '/contact', label: 'Contact' },
        ],
    },
];

const user = {
    name: 'Bob Bobson',
    email: 'bob@bob.com'};

export default function MainHeader() {
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const path = usePathname();
    const router = useRouter();

    const navigateHome = () => router.push('/');

    const isActiveLink = (currentPath: string, link: string) => {
        const normalizePath = (path: string) => path.endsWith('/') ? path.slice(0, -1) : path;
        currentPath = normalizePath(currentPath);
        link = normalizePath(link);

        return currentPath === link;
    };

    const items = links.map((link: LinkItem) => {
        const menuItems = link.links?.map((item: LinkItem) => (
            <Menu.Item key={item.link}>
                <Link href={item.link} className={cx(classes.link, { [classes.subActive]: isActiveLink(path, item.link) })}>
                    {item.label}
                </Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <Link href={link.link} className={cx(classes.link, { [classes.active]: isActiveLink(path, link.link) })}>
                            <Group>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Group>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link} className={cx(classes.link, { [classes.active]: isActiveLink(path, link.link) })}>
                {link.label}
            </Link>
        );
    });

    const processLinks = (links: LinkItem[]): LinkItem[] => {
        let processedLinks: LinkItem[] = [];
        links.forEach((link: LinkItem) => {
            processedLinks.push({ link: link.link, label: link.label });
            if (link.links) {
                link.links.forEach((subLink: LinkItem) => {
                    processedLinks.push({ link: subLink.link, label: subLink.label });
                });
            }
        });
        return processedLinks;
    };

    const dropdownItems = processLinks(links).map((item: LinkItem) => (
        <Menu.Item key={item.link}>
            <Link href={item.link} className={cx(classes.link, { [classes.active]: isActiveLink(path, item.link) })}>
                {item.label}
            </Link>
        </Menu.Item>
    ));

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="md">
                <Group justify="space-between">
                    <Image width={56} height={56} style={{ cursor: "pointer" }} src={shiftSwapperLogo.src} onClick={navigateHome} alt={"a white robot with blue eyes"} />

                    <Menu
                        width={260}
                        position="bottom-end"
                        transitionProps={{ transition: 'pop-top-right' }}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        withinPortal
                    >
                        <Menu.Target>
                            <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                                <Group gap={7}>
                                    <Text fw={500} size="sm" lh={1} mr={3}>
                                        {user.name}
                                    </Text>
                                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<IconHeart style={{ width: rem(16), height: rem(16) }} color={theme.colors.red[6]} stroke={1.5} />}
                            >
                                Liked posts
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconStar style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[6]} stroke={1.5} />}
                            >
                                Saved posts
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconMessage style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />}
                            >
                                Your comments
                            </Menu.Item>

                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item
                                leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            >
                                Account settings
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            >
                                Change account
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            >
                                Logout
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger zone</Menu.Label>
                            <Menu.Item
                                leftSection={<IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            >
                                Pause subscription
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            >
                                Delete account
                            </Menu.Item>
                            <Menu.Item>
                                <div className={cx(classes.dropdownColorSchemeToggle, "mantine-visible-from-sm")} >
                                    <ColorSchemeToggle justify={'left'} />
                                </div>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Menu shadow="md" width={200} opened={opened} onChange={toggle} withinPortal>
                        <Menu.Target>
                            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm"/>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Stack>
                                {dropdownItems}
                                <div className={classes.dropdownColorSchemeToggle}>
                                    <ColorSchemeToggle justify={'left'} />
                                </div>
                            </Stack>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Container>
            <Container size="md">
                <Tabs
                    defaultValue="Home"
                    variant="outline"
                    visibleFrom="sm"
                    classNames={{
                        root: classes.tabs,
                        list: classes.tabsList,
                        tab: classes.tab,
                    }}
                >
                    <Tabs.List>{items}</Tabs.List>
                </Tabs>
            </Container>
        </div>
    );
}
