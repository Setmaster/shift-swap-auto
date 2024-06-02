'use client';

import {Button, Group, Pagination} from "@mantine/core";
import classes from './ListingFilters.module.css';
import {useParamsStore} from "@/lib/hooks/useParamsStore";
import {
    IconAlarmPlus,
    IconClock,
    IconFlare,
    IconHourglassHigh,
    IconHourglassLow,
    IconSortAscendingLetters
} from "@tabler/icons-react";

const pageSizeOptions = [4, 8, 16];

const sortOptions = [
    {icon: IconSortAscendingLetters, label: 'Alphabetical', value: 'make'},
    {icon: IconClock, label: 'End date', value: 'endingSoon'},
    {icon: IconAlarmPlus, label: 'Recently added', value: 'new'},
];

const statusOptions = [
    {icon: IconFlare, label: 'Live', value: 'live'},
    {icon: IconHourglassHigh, label: 'Ending soon', value: 'endingSoon'},
    {icon: IconHourglassLow, label: 'Finished', value: 'finished'},
]

export default function ListingFilters(){
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);
    const filterBy = useParamsStore(state => state.filterBy);
    
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

    const statusButtons = statusOptions.map(({label, icon: Icon, value}) => (
        <Button
            key={value}
            disabled={filterBy === value}
            onClick={() => setParams({filterBy: value})}
            variant="default"
            leftSection={<Icon />}
        >
            {label}
        </Button>
    ));
    
    return (
        // TODO: Implement small screen version
        <Group className={classes.filtersGroup} visibleFrom={'xs'}>
            <Button.Group>
                {statusButtons}
            </Button.Group>
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