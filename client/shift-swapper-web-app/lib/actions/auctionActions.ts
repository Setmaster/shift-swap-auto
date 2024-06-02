'use server';

export async function getData(query: string): Promise<PagedResult<Auction>> {
    console.log("QUERY: ", query);
    const response = await fetch(`http://localhost:6001/search?${query}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}
