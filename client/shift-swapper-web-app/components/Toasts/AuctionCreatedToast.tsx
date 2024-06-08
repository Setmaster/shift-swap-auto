import Link from "next/link";
import {Container, Group, Stack, Text} from "@mantine/core";
import Image from "next/image";
import classes from './AuctionCreatedToast.module.css';

type AuctionCreatedToastProps = {
    auction: Auction;
}

export default function AuctionCreatedToast({auction}: AuctionCreatedToastProps) {
    return (
        <Link href={`/auctions/details/${auction.id}`} className={classes.link}>
            <Container fluid className={classes.container}>
                <Group >
                    <Image
                        className={classes.image}
                        src={auction.imageUrl}
                        alt='image'
                        width="80"
                        height="80"
                        style={{objectFit: 'cover', objectPosition: 'center'}}
                    />
                    <Stack>
                    <Text c={"gray"} >New Auction!</Text>
                        <Text c={"red"}>{auction.year} {auction.make} {auction.model}</Text>
                    </Stack>
                </Group>
            </Container>
        </Link>
    )
}