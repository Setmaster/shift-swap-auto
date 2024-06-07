'use client';

import {ScrollArea, Stack, Table} from "@mantine/core";
import {useState} from "react";
import {formatCurrency} from "@/lib/utils/generalUtils";
import BidItem from "@/components/BidsTable/BidItem";

export default function BidsTable({bids}: { bids: Bid[] }) {
    const [scrolled, setScrolled] = useState(false);

    const rows = bids.map((bid, index) => (

            <BidItem bid={bid} key={index}/>
    ));

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