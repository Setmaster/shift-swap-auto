'use client';
import React, {useState, useEffect} from 'react';
import {Button, Code, Container, Group, Text, Title} from "@mantine/core";
import {getSession, getTokenWorkaround} from "@/lib/actions/authActions";
import {getUpdatedAuctionTest, updateAuctionTest} from "@/lib/actions/auctionActions";
import AuthTests from "@/components/AuthTests/AuthTests";
import {Session} from "next-auth";
import {JWT} from "next-auth/jwt";
import {notifications} from "@mantine/notifications";
import Image from "next/image";
import AuctionCreatedToast from "@/components/Toasts/AuctionCreatedToast";
import AuctionFinishedToast from "@/components/Toasts/AuctionFinishedToast";

export default function DevDashboard() {
    const [session, setSession] = useState<Session | null>(null);
    const [token, setToken] = useState<JWT | null>(null);
    const [updatedAuction, setUpdatedAuction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const sessionData = await getSession();
            const tokenData = await getTokenWorkaround();
            const auctionData = await getUpdatedAuctionTest();

            setSession(sessionData);
            setToken(tokenData);
            setUpdatedAuction(auctionData);
        }

        fetchData();
    }, []);

    const handleUpdateAuction = async () => {
        const auctionData = await getUpdatedAuctionTest();
        setUpdatedAuction(auctionData);
    };

    const doUpdate = async () => {
        setResult(null);
        setLoading(true);
        try {
            setResult(await updateAuctionTest());
            console.log('RESULT:', result);
            await handleUpdateAuction();  // this will trigger the re-fetch of the updatedAuction data
        } finally {
            setLoading(false);
        }
    };

    const createDummyAuctionFinished = (auction: Auction): AuctionFinished => {
        return {
            itemSold: Math.random() >= 0.5,
            auctionId: auction.id,
            winner: "testuser",
            seller: auction.seller,
            amount: 50,
        };
    };

    return (
        <Container>
            <Title order={1}>Dev Dashboard</Title>
            <Text size="xl">Welcome to the Shift Swapper Dev Dashboard</Text>
            <Text size="md">Session</Text>
            <Code block>{JSON.stringify(session, null, 2)}</Code>
            <AuthTests loading={loading} result={result} doUpdate={doUpdate}/>
            <Text size="md">Updated Auction</Text>
            <Code block>{JSON.stringify(updatedAuction, null, 2)}</Code>
            <Text size="md">Token</Text>
            <Code block>{JSON.stringify(token, null, 2)}</Code>
            <Group>
                <Button
                    onClick={() => {
                        notifications.show({
                            message: (
                                <AuctionCreatedToast auction={updatedAuction!}/>
                            ),
                            autoClose: false,
                        });
                    }
                    }
                >Show Created Notification</Button>
                <Button
                    onClick={() => {
                        if (updatedAuction) {
                            const auctionFinished = createDummyAuctionFinished(updatedAuction);
                            notifications.show({
                                message: (
                                    <AuctionFinishedToast auction={updatedAuction} auctionFinished={auctionFinished} />
                                ),
                                autoClose: false,
                            });
                        }
                    }}
                >Show Finished Notification</Button>
            </Group>
        </Container>
    );
}
