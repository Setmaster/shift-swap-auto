import classes from './NoResultsFilterError.module.css';
import {Text, Button, Container, Group, Title} from "@mantine/core";
import {useParamsStore} from "@/lib/hooks/useParamsStore";

export default function NoResultsFilterError(){
    const reset = useParamsStore(state => state.resetParams);
    return (
        <Container className={classes.root}>
            <div className={classes.label}>We found no matches for your filters</div>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                Try changing or resetting your filters
            </Text>
            <Group justify="center">
                <Button onClick={reset} variant="filled" size="md" className={classes.resetButton}>
                    Reset filters
                </Button>
            </Group>
        </Container>
    );
}