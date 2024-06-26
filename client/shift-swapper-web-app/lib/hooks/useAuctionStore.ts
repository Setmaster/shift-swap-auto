﻿import {create} from "zustand";
import {shallow} from "zustand/shallow";
import {createWithEqualityFn} from "zustand/traditional";

type State = {
    auctions: Auction[];
    totalCount: number;
    pageCount: number;
}


type Actions = {
    setData: (data: PagedResult<Auction>) => void;
    setCurrentPrice: (auctionId: string , amount: number) => void;
    addAuction: (auction: Auction) => void;
    removeAuction: (id: string) => void;
}
const initialState: State = {
    auctions: [],
    totalCount: 0,
    pageCount: 0,
};

export const useAuctionStore = createWithEqualityFn<State & Actions>((set) => ({
    ...initialState,
    setData: (data) => {
        set(() => ({
            auctions: data.results,
            totalCount: data.totalCount,
            pageCount: data.pageCount,
        }));
    },
    setCurrentPrice: (auctionId, amount) => {
        set((state) => ({
            auctions: state.auctions.map((auction) => {
                if (auction.id === auctionId) {
                    // If the auctionId matches, update the current price
                    return {
                        ...auction,
                        currentHighBid: amount,
                    };
                }
                return auction;
            }),
        }));
    },
    addAuction: (auction) => {
        set((state) => ({
            auctions: [auction, ...state.auctions],
        }));
    },
    removeAuction: (id) => set((state) => ({
        auctions: state.auctions.filter(auction => auction.id !== id)
    })),
}), shallow);