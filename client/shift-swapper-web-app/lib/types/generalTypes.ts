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

type LinkItem = {
    link: string;
    label: string;
    links?: LinkItem[];
}

type AuctionFormValues = {
    make: string;
    model: string;
    color: string;
    year: string;
    mileage: string;
    reservePrice: string;
    endDateTime: string;
    image: File | null;
};

type ValidatedAuctionFormValues = {
    make: string;
    model: string;
    color: string;
    year: number;
    mileage: number;
    reservePrice: number;
    auctionEnd: string;
    imageUrl: string;
}

type AuctionError = {
    error: {
        status: string | number;
        message: string;
    };
}

type AuctionErrors = {
    errors: AuctionError[];
}

type Bid = {
    id: string;
    auctionId: string;
    bidder: string;
    bidTime: string;
    amount: number;
    bidStatus: string;
}

type AuctionFinished = {
    itemSold: boolean;
    auctionId: string;
    winner?: string;
    seller: string;
    amount?: number;
}
    