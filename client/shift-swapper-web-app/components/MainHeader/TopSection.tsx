'use client';

import cx from 'clsx';
import { Anchor, Burger, Container, Group, Menu, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ShiftSwapLogo from "@/components/ShiftSwapLogo/ShiftSwapLogo";
import Search from "@/components/Search/Search";
import UserMainHeaderMenu from "@/components/UserMainHeaderMenu/UserMainHeaderMenu";
import Link from "next/link";
import classes from './MainHeader.module.css';
import { usePathname } from "next/navigation";

interface TopSectionProps {
    user: any;
    links: LinkItem[];
}

export default function TopSection({ user, links }: TopSectionProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const path = usePathname();

    const isActiveLink = (currentPath: string, link: string) => {
        const normalizePath = (path: string) => path.endsWith('/') ? path.slice(0, -1) : path;
        currentPath = normalizePath(currentPath);
        link = normalizePath(link);

        return currentPath === link;
    };

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
            <Anchor component={Link} href={item.link}
                    className={cx(classes.link, { [classes.active]: isActiveLink(path, item.link) })}>
                {item.label}
            </Anchor>
        </Menu.Item>
    ));

    return (
        <Container className={classes.topSection} size="md">
            <Group justify="space-between">
                <ShiftSwapLogo />
                <Search popOver={true} />
                <Search />
                <UserMainHeaderMenu user={user} />
                <Menu
                    shadow="md"
                    width={200}
                    opened={opened}
                    onChange={toggle}
                    withinPortal
                >
                    <Menu.Target>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Stack>
                            {dropdownItems}
                        </Stack>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Container>
    );
}
