'use client';

import {Container, ScrollArea, Stack, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import BidItem from "@/components/BidsTable/BidItem";
import {User} from "next-auth";
import {useBidStore} from "@/lib/hooks/useBidStore";
import {getBidsForAuction} from "@/lib/actions/auctionActions";
import {notifications} from "@mantine/notifications";
import {BidItemSkeleton} from "@/components/BidsTable/BidItemSkeleton";

type BidsTableProps = {
    user: User | null;
    auctionData: Auction;
}

type HighestBid = Bid | { amount: number; id: null };

export default function BidsTable({user, auctionData}: BidsTableProps) {
    const [loading, setLoading] = useState(true);
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);

    useEffect(() => {
        getBidsForAuction(auctionData.id).then((bids) => {
                setBids(bids);
            }
        ).catch((error) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to retrieve bids',
                color: 'red',
            });
        }).finally(() => setLoading(false));
    }, [auctionData.id, setLoading, setBids]);

    let rows = Array.from({length: 10}, (_, index) => (
        <BidItemSkeleton key={index}/>
    ));

    if (!loading) {
        const highestAcceptedBid = bids.reduce<HighestBid>((highest, bid) => {
            return bid.bidStatus === 'Accepted' && bid.amount > highest.amount ? bid : highest;
        }, { amount: 0, id: null });

        const sortedBids = highestAcceptedBid.amount > 0
            ? [highestAcceptedBid as Bid, ...bids.filter(bid => bid.id !== highestAcceptedBid.id)]
            : [...bids];

        rows = sortedBids.map((bid, index) => (
            <BidItem bid={bid} key={index} isHighestBid={highestAcceptedBid.id === bid.id}/>
        ));
    }



    if (!loading && bids.length === 0) {
        return (
            <Container fluid>
                <Stack justify={"center"} align={"center"} h={{base: 180, md: 360}}>
                    <Text size="xl" fw={600}>No bids placed yet!</Text>
                    <Text size="md" fw={200}>Be the first to bid!</Text>
                </Stack>
            </Container>
        );
    }

    return (
        <ScrollArea.Autosize mah={360} mx="auto">
            <Stack
                gap="xs"
            >
                {rows}
            </Stack>
        </ScrollArea.Autosize>
    );
}
