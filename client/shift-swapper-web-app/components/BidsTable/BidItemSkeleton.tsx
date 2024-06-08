'use client';
import { Container, Grid, Skeleton, Stack, useMantineTheme, rem } from "@mantine/core";

export function BidItemSkeleton() {
    const theme = useMantineTheme();

    return (
        <Container
            style={{
                border: `${rem(2)} solid ${theme.colors.gray[3]}`,
                borderRadius: rem(8),
                marginBottom: rem(8),
                width: '100%',
            }}
        >
            <Grid justify={"space-between"} style={{ padding: rem(10) }}>
                <Grid.Col span="auto">
                    <Stack gap={"xs"} style={{ padding: 0 }}>
                        <Skeleton height={20} width="60%" radius="xl" />
                        <Skeleton height={15} width="40%" radius="xl" mt={6} />
                    </Stack>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack align="flex-end">
                        <Skeleton height={30} width="80%" radius="xl" />
                        <Skeleton height={15} width="50%" radius="xl" mt={6} />
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
