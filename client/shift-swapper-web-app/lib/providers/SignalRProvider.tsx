'use client';

import React, {ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/lib/hooks/useAuctionStore";
import {useBidStore} from "@/lib/hooks/useBidStore";
import {User} from "next-auth";
import {notifications} from "@mantine/notifications";
import AuctionCreatedToast from "@/components/Toasts/AuctionCreatedToast";

type SignalRProviderProps = {
    children: ReactNode;
    user: User | null;
}

export default function SignalRProvider({children, user}: SignalRProviderProps) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:6001/notifications')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('SignalR connected');

                    connection.on('BidPlaced', (bid: Bid) => {
                        console.log('BidPlaced', bid);
                        if (bid.bidStatus.includes('Accepted')) {
                            setCurrentPrice(bid.auctionId, bid.amount);
                        }
                        addBid(bid);
                    });
                    
                    connection.on('AuctionCreated', (auction: Auction) => {
                        if (user?.username !== auction.seller) {
                            notifications.show({
                                message: (
                                    <AuctionCreatedToast auction={auction}/>
                                ),
                            });
                        }
                    });
                }).catch((error) => {
                console.log('SignalR error', error);
            });
        }

        return () => {
            connection?.stop();
        }
    }, [connection, setCurrentPrice, addBid]);

    return (
        <>
            {children}
        </>
    );
}