'use client';

import cx from 'clsx';
import {ActionIcon, useMantineColorScheme, useComputedColorScheme, Group} from '@mantine/core';
import {IconSun, IconMoon} from '@tabler/icons-react';
import classes from './ColorSchemeToggle.module.css';
import {useEffect, useState} from "react";

export default function ColorSchemeToggle({justify = 'center'}) {
    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    
    return (
        <Group justify={justify}>
            <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
            >
                <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
            </ActionIcon>
        </Group>
    );
}