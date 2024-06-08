'use client';

import {ScrollArea, Stack, Table} from "@mantine/core";
import {useEffect, useState} from "react";
import {formatCurrency} from "@/lib/utils/generalUtils";
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
        rows = bids.map((bid, index) => (

            <BidItem bid={bid} key={index}/>
        ));
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