'use client';

import SaleCard from "@/components/SaleCard/SaleCard";
import SaleCardSkeleton from "@/components/SaleCard/SaleCardSkeleton";
import {Container, Group, SimpleGrid} from "@mantine/core";
import classes from './Listings.module.css';
import ListingPagination from "@/components/ListingPagination/ListingPagination";
import {useState} from "react";
import {useAuctions} from "@/lib/hooks/useAuctions";
import ListingFilter from "@/components/ListingFilter/ListingFilter"; // Import the custom hook

export default function Listings() {
    const [activePage, setActivePage] = useState(1);
    const [pageSize, setPageSize] = useState(4); 
    const {auctions, pageCount, loading} = useAuctions(activePage, pageSize); // Use the custom hook

    const cards = auctions.map((item: Auction) => (
        <SaleCard key={item.id} data={item}/>
    ));

    const skeletons = Array.from({length: 4}).map((_, index) => (
        <SaleCardSkeleton key={index}/>
    ));

    return (
        <>
            <Group className={classes.filterGroup}>
                <ListingFilter pageSize={pageSize} setPageSize={setPageSize}/>
            </Group>
            <Container fluid className={classes.listingsContainer}>
                <SimpleGrid cols={{base: 1, sm: 2, md: 3, xl: 4}}>
                    {loading ? skeletons : cards}
                </SimpleGrid>
            </Container>
            <Group className={classes.paginationGroup}>
                <ListingPagination
                    activePage={activePage}
                    pageCount={pageCount}
                    setActivePage={setActivePage}
                />
            </Group>
        </>
    );
}
