'use client';

import SaleCard from "@/components/SaleCard/SaleCard";
import SaleCardSkeleton from "@/components/SaleCard/SaleCardSkeleton";
import {Container, Group, SimpleGrid} from "@mantine/core";
import classes from './Listings.module.css';
import ListingPagination from "@/components/ListingPagination/ListingPagination";
import {useEffect, useState} from "react";
import ListingFilters from "@/components/ListingFilters/ListingFilters";
import {useParamsStore} from "@/lib/hooks/useParamsStore";
import qs from 'query-string';
import {getData} from "@/lib/actions/auctionActions";
import NoResultsFilterError from "@/components/NoResultsFilterError/NoResultsFilterError";
import {useAuctionStore} from "@/lib/hooks/useAuctionStore";

export default function Listings() {
    const [loading, setLoading] = useState(true);
    const params = useParamsStore(
        (state) => ({
            pageNumber: state.pageNumber,
            pageSize: state.pageSize,
            searchTerm: state.searchTerm,
            orderBy: state.orderBy,
            filterBy: state.filterBy,
            seller: state.seller,
            winner: state.winner,
        }));
    const data = useAuctionStore((state) =>({
        auctions: state.auctions,
        totalCount: state.totalCount,
        pageCount: state.pageCount,
    }));
    const setData = useAuctionStore((state) => state.setData);
    const setParams = useParamsStore((state) => state.setParams);
    const url = qs.stringify(params);
    function setActivePage(pageNumber: number) {
        setParams({pageNumber});
    }

    useEffect(() => {
        getData(url).then((data) => {
            setData(data);
            setLoading(false);
        });
    }, [url, setData]);

    const cards = data?.auctions?.map((item: Auction) => (
        <SaleCard key={item.id} data={item}/>
    )) || [];

    const skeletons = Array.from({length: params.pageSize}).map((_, index) => (
        <SaleCardSkeleton key={index}/>
    ));

    if (data?.auctions?.length === 0 && !loading) {
        return (
            <>
                <ListingFilters/>
                <NoResultsFilterError/>
            </>
        );
    }

    return (
        <>
            <ListingFilters/>

            <Container fluid className={classes.listingsContainer}>
                <SimpleGrid cols={{base: 1, sm: 2, md: 3, xl: 4}}>
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
