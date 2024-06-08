import Link from "next/link";
import {Container, Grid, Group, SimpleGrid, Stack, Text} from "@mantine/core";
import Image from "next/image";
import classes from './AuctionCreatedToast.module.css';
import {formatCurrency} from "@/lib/utils/generalUtils";

type AuctionCreatedToastProps = {
    auctionFinished: AuctionFinished;
    auction: Auction;
}

export default function AuctionFinishedToast({auction, auctionFinished}: AuctionCreatedToastProps) {
    return (
        <Link href={`/auctions/details/${auction.id}`} className={classes.link}>
            <Container fluid className={classes.container}>
                <Grid align="center">
                    <Grid.Col span={3}>
                    <Image
                        className={classes.image}
                        src={auction.imageUrl}
                        alt='image'
                        width="80"
                        height="80"
                        style={{objectFit: 'cover', objectPosition: 'center'}}
                    />
                    </Grid.Col>
                    <Grid.Col span={"auto"}>
                    <Stack>
                        <Text c={"gray"} >Auction for {auction.year} {auction.make} {auction.model} finished</Text>
                        {auctionFinished.itemSold && auctionFinished.amount ? (
                            <Text
                                c={"red"}
                            >Sold for {formatCurrency(auctionFinished.amount)} to {auctionFinished.winner} by {auction.seller}</Text>
                        ) : (
                            <Text c={"red"}>Ran out of time</Text>
                        )}
                    </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </Link>
    )
}