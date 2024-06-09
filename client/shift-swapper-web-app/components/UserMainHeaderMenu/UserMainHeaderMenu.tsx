'use client';

import {Button, Group, Menu, rem, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import cx from "clsx";
import classes from "./UserMainHeaderMenu.module.css";
import {
    IconCar,
    IconChevronDown,
    IconLogout,
    IconRadioactive,
    IconStar,
    IconTrophy,
    IconUser
} from "@tabler/icons-react";
import ColorSchemeToggle from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import {useState} from "react";
import {signIn, signOut} from "next-auth/react";
import {User} from "next-auth";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {useParamsStore} from "@/lib/hooks/useParamsStore";

type UserMainHeaderMenuProps = {
    user: User
}
export default function UserMainHeaderMenu({user} : UserMainHeaderMenuProps) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    
    const router = useRouter();
    const pathname = usePathname();
    const setParams = useParamsStore((state) => state.setParams);
    
    function setWinner(){
        setParams({winner: user.username, seller: undefined});
        if(pathname !== '/'){
            router.push('/');
        }
    }

    function setSeller(){
        setParams({seller: user.username, winner: undefined});
        if(pathname !== '/'){
            router.push('/');
        }
    }
    
    const handleLogin = () => {
        signIn('id-server', {callbackUrl: '/'}, {prompt: 'login'})
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
                    onClick={setSeller}
                    leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} color={theme.colors.green[6]} stroke={1.5} />}
                >
                    My Auctions
                </Menu.Item>
                <Menu.Item
                    onClick={setWinner}
                    leftSection={<IconTrophy style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[6]} stroke={1.5} />}
                >
                    Auctions won
                </Menu.Item>
                <Menu.Item
                    component={Link}
                    href={"/auctions/create"}
                    leftSection={<IconCar style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />}
                >
                    Sell my vehicle
                </Menu.Item>
                <Menu.Item
                    component={Link}
                    href={"/devdashboard"}
                    leftSection={<IconRadioactive style={{ width: rem(16), height: rem(16) }} color={theme.colors.green[6]} stroke={1.5} />}
                >
                    Dev Dashboard
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
