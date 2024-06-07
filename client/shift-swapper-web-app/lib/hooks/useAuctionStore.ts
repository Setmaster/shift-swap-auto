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
                        currentPrice: amount,
                    };
                }
                return auction;
            }),
        }));
    },
}), shallow);