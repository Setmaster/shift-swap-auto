import {getAuction} from "@/lib/actions/auctionActions";
import {Button, Container, Group, rem, SimpleGrid, Stack, Text} from "@mantine/core";
import SaleImage from "@/components/SaleCard/SaleImage";
import classes from './page.module.css';
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SpecsTable from "@/components/SpecsTable/SpecsTable";
import {IconLogin2} from "@tabler/icons-react";
import AuctionEditButton from "@/components/Buttons/AuctionEditButton";
import {getCurrentUser} from "@/lib/actions/authActions";
import BidsTable from "@/components/BidsTable/BidsTable";
import {User} from "next-auth";
import PlaceBidModal from "@/components/PlaceBid/PlaceBidModal";
import React from "react";
import {signIn} from "next-auth/react";
import PlacedBidNotSignedInButton from "@/components/PlaceBid/PlaceBidNotSignedInButton";
import {notFound} from "next/navigation";

function isAuctionErrors(data: Auction | AuctionErrors): data is AuctionErrors {
    return (data as AuctionErrors).errors !== undefined;
}

export default async function AuctionDetailsPage({params}: { params: { id: string } }) {
    const data : Auction | AuctionErrors = await getAuction(params.id);
    const user: User | null = (await getCurrentUser());

    if(isAuctionErrors(data)) {
            notFound();
    }

    return (
        <Container fluid>
            <Stack>
                <SimpleGrid cols={{base: 1, md: 2}}>
                    <Container className={classes.sideContainer}>
                        <Stack>
                            <Group>
                                <Text
                                    size={'xl'}
                                    fw={700}
                                >
                                    {data.make + ' ' + data.model}
                                </Text>
                                {user?.username === data.seller && <AuctionEditButton auctionId={data.id}/>}
                            </Group>
                            <Container className={classes.saleImageContainer}>
                                <SaleImage data={data}/>
                            </Container>
                        </Stack>
                    </Container>
                    <Container className={classes.sideContainer}>
                        <Stack>
                            <Group justify={"space-between"}>
                                <Group>
                                    <Text
                                        size={'xl'}
                                        fw={700}
                                    >
                                        Time Left:
                                    </Text>
                                    <CountdownTimer auctionEnd={data.auctionEnd}/>
                                </Group>
                                {!user && <PlacedBidNotSignedInButton/>}
                                {user && user?.username !== data.seller && <PlaceBidModal auctionId={data.id}/>}
                            </Group>
                            <Container className={classes.bidsTableContainer}>
                                <BidsTable user={user} auctionData={data}/>
                            </Container>
                        </Stack>
                    </Container>
                </SimpleGrid>
                <Stack>
                    <Text
                        size={'xl'}
                        fw={700}
                    >
                        Specs:
                    </Text>
                    <SpecsTable data={data}/>
                </Stack>
            </Stack>
        </Container>
    )
}