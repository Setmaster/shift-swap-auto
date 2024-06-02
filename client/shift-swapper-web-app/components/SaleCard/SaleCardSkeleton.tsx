import { Card, Skeleton } from '@mantine/core';
import classes from './SaleCard.module.css';

export default function SaleCardSkeleton() {
    return (
        <Card withBorder padding="lg" radius="md" className={classes.card}>
            <Card.Section mb="sm">
                <Skeleton height={200} />
            </Card.Section>
            <Skeleton height={30} mt="xs" />
            <Skeleton height={20} mt="xs" width="70%" />
            <Skeleton height={30} mt="xxl" width="50%" />
            <Card.Section className={classes.footer}>
                <Skeleton height={20} width="50%" />
                <Skeleton height={20} width="20%" />
            </Card.Section>
        </Card>
    );
}
