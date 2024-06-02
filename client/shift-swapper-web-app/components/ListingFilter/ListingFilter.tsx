import {Button, Group, Pagination} from "@mantine/core";
import classes from './ListingFilter.module.css';

type ListingFilterProps = {
    pageSize: number;
    setPageSize: (size: number) => void;
};

export default function ListingFilter({pageSize, setPageSize}: ListingFilterProps){
    return (
        <Group>
        <span>PAGE SIZE</span>
            <Button.Group>
                <Button 
                    className={classes.firstButton}
                    disabled={pageSize === 4}
                    onClick={() => setPageSize(4)}
                    variant="default">4</Button>
                <Button
                    disabled={pageSize === 8}
                    onClick={() => setPageSize(8)}
                    variant="default">8</Button>
                <Button
                    disabled={pageSize === 16}
                    onClick={() => setPageSize(16)}
                    variant="default">16</Button>
            </Button.Group>
        </Group>
    );
}