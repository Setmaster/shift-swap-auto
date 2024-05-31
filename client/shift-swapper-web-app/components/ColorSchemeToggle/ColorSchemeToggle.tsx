'use client';

import React, { useState, useEffect } from 'react';
import { Switch, useMantineTheme, rem, Group } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

export default function ColorSchemeToggle({ justify = 'center' }) {
    const theme = useMantineTheme();
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [checked, setChecked] = useState(computedColorScheme === 'dark');

    useEffect(() => {
        setChecked(computedColorScheme === 'dark');
    }, [computedColorScheme]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.currentTarget.checked;
        setColorScheme(isChecked ? 'dark' : 'light');
        setChecked(isChecked);
    };

    const sunIcon = (
        <IconSun
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color={theme.colors.yellow[4]}
        />
    );

    const moonIcon = (
        <IconMoonStars
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color={theme.colors.blue[6]}
        />
    );

    return (
        <Group justify={justify}>
            <span>Theme</span>
            <Switch
                size="md"
                color="dark.3"
                checked={checked}
                onChange={handleChange}
                onLabel={sunIcon}
                offLabel={moonIcon}
            />
        </Group>
    );
}
