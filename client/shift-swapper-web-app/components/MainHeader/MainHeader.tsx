'use client';
import cx from 'clsx';
import {
    Anchor,
    Burger,
    Container,
    Group,
    Menu,
    Stack,
    Tabs,
    useComputedColorScheme,
    useMantineTheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconChevronDown,} from '@tabler/icons-react';
import {usePathname} from "next/navigation";
import Search from "@/components/Search/Search";
import Link from "next/link";
import classes from './MainHeader.module.css';
import UserMainHeaderMenu from "@/components/UserMainHeaderMenu/UserMainHeaderMenu";
import ShiftSwapLogo from "@/components/ShiftSwapLogo/ShiftSwapLogo";

// Define the interface for links
interface LinkItem {
    link: string;
    label: string;
    links?: LinkItem[];
}

// Define the links array
const links: LinkItem[] = [
    {link: '/contraptions', label: 'Contraptions'},
    {link: '/contraptions/share', label: 'Share'},
    {link: '/community', label: 'Community'},
    {
        link: '/about',
        label: 'About',
        links: [
            {link: '/faq', label: 'FAQ'},
            {link: '/contact', label: 'Contact'},
        ],
    },
];

const user = {
    name: 'Bob Bobson',
    email: 'bob@bob.com'
};

export default function MainHeader() {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const [opened, {toggle}] = useDisclosure(false);


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
                      className={cx(classes.link, {[classes.subActive]: isActiveLink(path, item.link)})}>
                    {item.label}
                </Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{exitDuration: 0}} withinPortal>
                    <Menu.Target>
                        <Link href={link.link}
                              className={cx(classes.link, {[classes.active]: isActiveLink(path, link.link)})}>
                            <Group>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5}/>
                            </Group>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link}
                  className={cx(classes.link, {[classes.active]: isActiveLink(path, link.link)})}>
                {link.label}
            </Link>
        );
    });

    const processLinks = (links: LinkItem[]): LinkItem[] => {
        let processedLinks: LinkItem[] = [];
        links.forEach((link: LinkItem) => {
            processedLinks.push({link: link.link, label: link.label});
            if (link.links) {
                link.links.forEach((subLink: LinkItem) => {
                    processedLinks.push({link: subLink.link, label: subLink.label});
                });
            }
        });
        return processedLinks;
    };

    const dropdownItems = processLinks(links).map((item: LinkItem) => (
        <Menu.Item key={item.link}>
            <Anchor component={Link} href={item.link}
                    className={cx(classes.link, {[classes.active]: isActiveLink(path, item.link)})}>
                {item.label}
            </Anchor>
        </Menu.Item>
    ));

    return (
        <div className={classes.header}>
            <Container className={classes.topSection} size="md">
                <Group justify="space-between">

                    <ShiftSwapLogo/>
                    <Search popOver={true}/>
                    <Search/>
                    <UserMainHeaderMenu user={user}/>
                    <Menu
                        shadow="md"
                        width={200}
                        opened={opened}
                        onChange={toggle}
                        withinPortal

                    >
                        <Menu.Target>
                            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm"/>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Stack>
                                {dropdownItems}
                            </Stack>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Container>
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
        </div>
    );
}
