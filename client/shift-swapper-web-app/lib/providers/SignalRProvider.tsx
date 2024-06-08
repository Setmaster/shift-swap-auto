'use client';

import {ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/lib/hooks/useAuctionStore";
import {useBidStore} from "@/lib/hooks/useBidStore";

type SignalRProviderProps = {
    children: ReactNode;
}

export default function SignalRProvider({children}: SignalRProviderProps) {
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