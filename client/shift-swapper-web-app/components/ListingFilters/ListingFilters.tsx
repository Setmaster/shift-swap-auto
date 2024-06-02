'use client';

import {Button, Group, Pagination} from "@mantine/core";
import classes from './ListingFilters.module.css';
import {useParamsStore} from "@/lib/hooks/useParamsStore";
import {IconAlarmPlus, IconClock, IconSortAscendingLetters} from "@tabler/icons-react";

const pageSizeOptions = [4, 8, 16];

const sortOptions = [
    {icon: IconSortAscendingLetters, label: 'Alphabetical', value: 'make'},
    {icon: IconClock, label: 'End date', value: 'endingSoon'},
    {icon: IconAlarmPlus, label: 'Recently added', value: 'new'},
];

export default function ListingFilters(){
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);
    
    const pageSizeButtons = pageSizeOptions.map((size) => (
        <Button
            key={size}
            disabled={pageSize === size}
            onClick={() => setParams({pageSize: size})}
            variant="default">{size}</Button>
    ));
    
    const sortButtons = sortOptions.map(({label, icon: Icon, value}) => (
        <Button
            key={value}
            disabled={orderBy === value}
            onClick={() => setParams({orderBy: value})}
            variant="default"
            leftSection={<Icon />}
            >
            {label}
        </Button>
    ));
    
    return (
        <Group className={classes.filtersGroup}>
            <Button.Group>
                {sortButtons}
            </Button.Group>
        <Group>
        <span>PAGE SIZE</span>
            <Button.Group>
                {pageSizeButtons}
            </Button.Group>
        </Group>
        </Group>
    );
}