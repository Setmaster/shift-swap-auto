'use client';

import React, {ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/lib/hooks/useAuctionStore";
import {useBidStore} from "@/lib/hooks/useBidStore";
import {User} from "next-auth";
import {notifications} from "@mantine/notifications";
import AuctionCreatedToast from "@/components/Toasts/AuctionCreatedToast";
import AuctionFinishedToast from "@/components/Toasts/AuctionFinishedToast";
import {getAuction} from "@/lib/actions/auctionActions";

type SignalRProviderProps = {
    children: ReactNode;
    user: User | null;
}

export default function SignalRProvider({children, user}: SignalRProviderProps) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const addAuction = useAuctionStore(state => state.addAuction);
    const removeAuction = useAuctionStore(state => state.removeAuction);
    const apiURL= process.env.NODE_ENV === 'production'
        ? 'https://api.shiftswap.com/notifications'
        : process.env.NEXT_PUBLIC_NOTIFY_URL;
    
    
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(apiURL!)
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
                        addAuction(auction);
                    });
                    
                    connection.on('AuctionDeleted', (auctionDeleted: { id: string }) => {
                        removeAuction(auctionDeleted.id);
                    });

                    connection.on('AuctionFinished', async (auctionFinished: AuctionFinished) => {
                        const auction = await getAuction(auctionFinished.auctionId);
                        notifications.show({
                            message: (
                                <AuctionFinishedToast auction={auction} auctionFinished={auctionFinished}/>
                            ),
                        });
                    });

                }).catch((error) => {
                console.log('SignalR error', error);
            });
        }

        return () => {
            connection?.stop();
        }
    }, [connection, setCurrentPrice, addBid, addAuction, removeAuction, user?.username]);

    return (
        <>
            {children}
        </>
    );
}
