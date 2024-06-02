import {Button, Group, Pagination} from "@mantine/core";
import classes from './ListingFilter.module.css';
import {useParamsStore} from "@/lib/hooks/useParamsStore";

type ListingFilterProps = {
    pageSize: number;
    setPageSize: (size: number) => void;
};

export default function ListingFilter(){
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    return (
        <Group>
        <span>PAGE SIZE</span>
            <Button.Group>
                <Button 
                    className={classes.firstButton}
                    disabled={pageSize === 4}
                    onClick={() => setParams({pageSize: 4})}
                    variant="default">4</Button>
                <Button
                    disabled={pageSize === 8}
                    onClick={() => setParams({pageSize: 8})}
                    variant="default">8</Button>
                <Button
                    disabled={pageSize === 16}
                    onClick={() => setParams({pageSize: 16})}
                    variant="default">16</Button>
            </Button.Group>
        </Group>
    );
}