import React from "react";
import {Autocomplete, rem} from "@mantine/core";
import classes from "./Search.module.css";
import {IconSearch} from "@tabler/icons-react";

export default function Search(){
    return (
        <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['Ford', 'Honda', 'Toyota', 'Tesla', 'BMW']}
            visibleFrom="xs"
        />
    );
}