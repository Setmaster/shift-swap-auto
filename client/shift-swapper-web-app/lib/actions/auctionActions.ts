'use server';

export async function getData(activePage: number, pageSize: number): Promise<PagedResult<Auction>> {
    const response = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${activePage}`);

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}
