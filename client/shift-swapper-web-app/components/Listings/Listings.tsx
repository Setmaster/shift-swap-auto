'use client';

import SaleCard from "@/components/SaleCard/SaleCard";
import SaleCardSkeleton from "@/components/SaleCard/SaleCardSkeleton";
import { Container, Group, SimpleGrid } from "@mantine/core";
import classes from './Listings.module.css';
import ListingPagination from "@/components/ListingPagination/ListingPagination";
import { useEffect, useState } from "react";
import { useAuctions } from "@/lib/hooks/useAuctions";
import ListingFilter from "@/components/ListingFilter/ListingFilter";
import { useParamsStore } from "@/lib/hooks/useParamsStore";
import { shallow } from "zustand/shallow"; // Import the custom hook
import qs from 'query-string';
import { getData } from "@/lib/actions/auctionActions";

export default function Listings() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<PagedResult<Auction>>();
    const params = useParamsStore(
        (state) => ({
            pageNumber: state.pageNumber,
            pageSize: state.pageSize,
            searchTerm: state.searchTerm,
        }));
    const setParams = useParamsStore((state) => state.setParams);
    const url = qs.stringify(params);

    function setActivePage(pageNumber: number) {
        setParams({ pageNumber });
    }

    useEffect(() => {
        setLoading(true);
        getData(url).then((data) => {
            setData(data);
            setLoading(false);
        });
    }, [url]);

    const cards = data?.results?.map((item: Auction) => (
        <SaleCard key={item.id} data={item} />
    )) || [];

    const skeletons = Array.from({ length: params.pageSize }).map((_, index) => (
        <SaleCardSkeleton key={index} />
    ));

    return (
        <>
            <Group className={classes.filterGroup}>
                <ListingFilter />
            </Group>
            <Container fluid className={classes.listingsContainer}>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }}>
                    {loading ? skeletons : cards}
                </SimpleGrid>
            </Container>
            <Group className={classes.paginationGroup}>
                <ListingPagination
                    activePage={params.pageNumber}
                    pageCount={data?.pageCount || 0}
                    setActivePage={setActivePage}
                />
            </Group>
        </>
    );
}
