'use client';

import React, {useState} from "react";
import {Autocomplete, Button, Group, Popover, rem} from "@mantine/core";
import classes from "./Search.module.css";
import {IconSearch} from "@tabler/icons-react";
import {useParamsStore} from "@/lib/hooks/useParamsStore";

type SearchProps = {
    popOver?: boolean;
};

export default function Search({popOver: popover = false}) {
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);
    function onChange(input : string){
        setSearchValue(input);
    }
    
    function search(){
        setParams({searchTerm: searchValue});
    }
    
    if (popover) {
        return (
            <Group
                hiddenFrom="xs"
                className={classes.popover}
            >
                <Popover
                    width={300}
                    position="bottom"
                    withArrow
                    shadow="md"
                >
                    <Popover.Target>
                        <Button
                            className={classes.popoverButton}
                            color="gray"
                        >🔎</Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Autocomplete
                            className={classes.search}
                            placeholder="Search"
                            leftSection={<IconSearch style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
                            data={['Ford', 'Honda', 'Toyota', 'Tesla', 'BMW']}
                            comboboxProps={{withinPortal: false}}
                            value={searchValue}
                            onChange={onChange}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    search();
                                }
                            }}
                        />
                    </Popover.Dropdown>
                </Popover>
            </Group>
        );
    }

    return (
        <Autocomplete
            className={classes.search}
            placeholder="Search Make, Model, or Keyword"
            leftSection={<IconSearch style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
            data={['Ford', 'Honda', 'Toyota', 'Tesla', 'BMW']}
            visibleFrom="xs"
            value={searchValue}
            onChange={onChange}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    search();
                }
            }}
        />
    );
}