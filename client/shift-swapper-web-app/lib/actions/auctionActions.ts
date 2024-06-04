'use server';

import {fetchWrapper} from "@/lib/utils/fetchWrapper";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await fetchWrapper.get(`search/?${query}`)
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }

    return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
}

export async function getUpdatedAuctionTest() {
    return await fetchWrapper.get('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c');
}