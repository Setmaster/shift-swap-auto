'use client';

import cx from 'clsx';
import {Container, Group, Menu, Tabs} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from "next/link";
import classes from './MainHeader.module.css';
import { usePathname } from "next/navigation";

interface TabsSectionProps {
    links: LinkItem[];
}

export default function TabsSection({ links }: TabsSectionProps) {
    const path = usePathname();

    const isActiveLink = (currentPath: string, link: string) => {
        const normalizePath = (path: string) => path.endsWith('/') ? path.slice(0, -1) : path;
        currentPath = normalizePath(currentPath);
        link = normalizePath(link);

        return currentPath === link;
    };

    const items = links.map((link: LinkItem) => {
        const menuItems = link.links?.map((item: LinkItem) => (
            <Menu.Item key={item.link}>
                <Link href={item.link}
                      className={cx(classes.link, { [classes.subActive]: isActiveLink(path, item.link) })}>
                    {item.label}
                </Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <Link href={link.link}
                              className={cx(classes.link, { [classes.active]: isActiveLink(path, link.link) })}>
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
            <Link key={link.label} href={link.link}
                  className={cx(classes.link, { [classes.active]: isActiveLink(path, link.link) })}>
                {link.label}
            </Link>
        );
    });

    return (
        <Container fluid className={classes.bottomSection}>
            <Tabs
                defaultValue="Home"
                variant="default"
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
    );
}