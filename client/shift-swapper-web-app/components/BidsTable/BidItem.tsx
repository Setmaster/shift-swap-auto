'use client';
import {Box, Container, Grid, Group, MantineTheme, rem, Stack, Text, useMantineTheme} from "@mantine/core";
import {formatCurrency} from "@/lib/utils/generalUtils";
import dayjs from 'dayjs';

type BidStatus = 'Accepted' | 'AcceptedBelowReserve' | 'TooLow' | 'Other';
type BidInfo = {
    bgColor: string;
    text: string;
};
function getBidInfo(bid: Bid, theme: MantineTheme){


    const statusInfo: Record<BidStatus, BidInfo> = {
        'Accepted': { bgColor: theme.colors.green[2], text: 'Bid accepted' },
        'AcceptedBelowReserve': { bgColor: theme.colors.orange[0], text: 'Reserve not met' },
        'TooLow': { bgColor: theme.colors.red[2], text: 'Bid was too low' },
        'Other': { bgColor: theme.colors.red[2], text: 'Bid placed after auction finished' }
    };

    // If bidStatus is not one of the keys, default to 'Other'
    return statusInfo[bid.bidStatus as BidStatus] || statusInfo['Other'];
}

export default function BidItem({bid}: {bid: Bid}){
    const theme = useMantineTheme();
    const bidInfo = getBidInfo(bid, theme);
    
return (
    <Container
        style={{
            border: `${rem(2)} solid ${theme.colors.gray[3]}`,
            borderRadius: rem(8),
            backgroundColor: bidInfo.bgColor,
            marginBottom: rem(8),
            width: '100%',
        }}
    >
        <Grid justify={"space-between"} style={{
            padding:rem(10),
        }}>
            <Grid.Col span="auto">
            <Stack 
                gap={"xs"}
                style={{
                padding: 0
            }}>
                <Text fw={600} c={"black"}>Bidder: {bid.bidder}</Text>
                <Text size="sm" c={"black"}>
                    Time: {dayjs(bid.bidTime).format('D MMM YYYY h:mm A')}
                </Text>
            </Stack>
            </Grid.Col>
            <Grid.Col span="auto">
            <Stack  align="flex-end">
                <Text fw={600} size="xl" c={"black"}>
                    {formatCurrency(bid.amount)}
                </Text>
                <Text c={"black"}>{bidInfo.text}</Text>
            </Stack>
            </Grid.Col>
        </Grid>
    </Container>
);
}