'use client';

import {Pagination} from "@mantine/core";
import {useState} from "react";

type ListingPaginationProps = {
    activePage: number;
    pageCount: number;
    setActivePage: (page: number) => void;
};

export default function ListingPagination({activePage, pageCount, setActivePage} : ListingPaginationProps) {
    return <Pagination
        total={pageCount}
        value={activePage}
        onChange={setActivePage}
    />;
}