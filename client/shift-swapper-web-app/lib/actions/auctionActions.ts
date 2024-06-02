'use server';

import {getTokenWorkaround} from "@/lib/actions/authActions";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    console.log("QUERY: ", query);
    const response = await fetch(`http://localhost:6001/search?${query}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }
    
    const token = await getTokenWorkaround();
    const response = await fetch('http://localhost:6001/auctions/8977ab0e-8e5e-4b7a-a464-2179ce69283d', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token?.access_token
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return {status: response.status, message: response.statusText}
    }

    return response.statusText;

}
