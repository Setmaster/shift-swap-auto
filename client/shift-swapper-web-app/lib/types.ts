type PagedResult<T> = {
    results: T[]
    pageCount: number
    totalCount: number
}

type Auction = {
    reservePrice: number
    seller: string
    winner?: string
    soldAmount: number
    currentHighBid: number
    createdAt: string
    updatedAt: string
    auctionEnd: string
    status: Status
    make: string
    model: string
    year: number
    color: string
    mileage: number
    imageUrl: string
    id: string // Auction id not item id
};

enum Status {
    Live,
    Finished,
    ReserveNotMet
}