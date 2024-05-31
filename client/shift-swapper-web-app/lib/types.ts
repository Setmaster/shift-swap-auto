type Auction = {
    id: string;
    reservePrice: number;
    seller: string;
    winner: string;
    soldAmount?: number;
    currentHighBid?: number;
    createdAt: string; 
    updatedAt: string; 
    auctionEnd: string; 
    status: Status; 
    item: Item; 
};

type Item = {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    imageUrl: string;
    auction: Auction;
    auctionId: string;
};

enum Status {
    Live,
    Finished,
    ReserveNotMet
}