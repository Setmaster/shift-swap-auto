'use client';

import {Anchor, Group, Menu, rem, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import cx from "clsx";
import classes from "./UserMainHeaderMenu.module.css";
import {
    IconChevronDown,
    IconHeart, IconLogout,
    IconMessage, IconPlayerPause,
    IconSettings,
    IconStar,
    IconSwitchHorizontal, IconTrash
} from "@tabler/icons-react";
import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import {useState} from "react";
import Link from "next/link";

type UserMainHeaderMenuProps = {
    user: {
        name: string;
        email: string;
    }
} 

export default function UserMainHeaderMenu({user}: UserMainHeaderMenuProps) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const isUserLoggedIn = true;
    
    if(!isUserLoggedIn){
        return <Anchor
            className={classes.loginButton}
            underline="never"
            component={Link}
            href=""
        >
            Login
        </Anchor>
    }
    
    return (
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
                    <div className={cx(classes.dropdownColorSchemeToggle)} >
                        <ColorSchemeToggle justify={'left'} />
                    </div>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}