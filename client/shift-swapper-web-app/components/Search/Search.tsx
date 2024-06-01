import React from "react";
import {Autocomplete, Button, Group, Popover, rem} from "@mantine/core";
import classes from "./Search.module.css";
import {IconSearch} from "@tabler/icons-react";

type SearchProps = {
    popOver?: boolean;
};

export default function Search({popOver: popover = false}) {

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
                        />
                    </Popover.Dropdown>
                </Popover>
            </Group>
        );
    }

    return (
        <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
            data={['Ford', 'Honda', 'Toyota', 'Tesla', 'BMW']}
            visibleFrom="xs"
        />
    );
}