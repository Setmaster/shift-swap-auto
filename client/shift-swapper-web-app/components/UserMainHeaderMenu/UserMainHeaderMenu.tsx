'use client';

import {Anchor, Button, Group, Menu, rem, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import cx from "clsx";
import classes from "./UserMainHeaderMenu.module.css";
import {
    IconCar,
    IconChevronDown,
    IconHeart, IconLogout,
    IconMessage, IconPlayerPause,
    IconSettings,
    IconStar,
    IconSwitchHorizontal, IconTrash, IconTrophy, IconUser
} from "@tabler/icons-react";
import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import {useEffect, useState} from "react";
import {signIn, signOut} from "next-auth/react";
import {getCurrentUser} from "@/lib/actions/authActions";
import {getData} from "@/lib/actions/auctionActions";
import {User} from "next-auth";

type UserMainHeaderMenuProps = {
    user: Partial<User> | null;
}
export default function UserMainHeaderMenu({user} : UserMainHeaderMenuProps) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    
    const handleLogin = () => {
        signIn('id-server', {callbackUrl: '/'})
    };
    
    const handleLogout = () => {
        signOut({callbackUrl: '/'});
    }
    
    if(!user){
        return <Button onClick={handleLogin} variant="default">
            Login
        </Button>
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
                            {user.username}
                        </Text>
                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} color={theme.colors.green[6]} stroke={1.5} />}
                >
                    My Auctions
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconTrophy style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[6]} stroke={1.5} />}
                >
                    Auctions won
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconCar style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />}
                >
                    Sell my vehicle
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconStar style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[6]} stroke={1.5} />}
                >
                    Saved posts
                </Menu.Item>

                <Menu.Divider />
                <Menu.Label>Settings</Menu.Label>

                <Menu.Item>
                    <div className={cx(classes.dropdownColorSchemeToggle)}>
                        <ColorSchemeToggle justify={'left'} />
                    </div>
                </Menu.Item>
                <Menu.Item
                    onClick={handleLogout} leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                >
                    Logout
                </Menu.Item>

            </Menu.Dropdown>
        </Menu>
    );
}
