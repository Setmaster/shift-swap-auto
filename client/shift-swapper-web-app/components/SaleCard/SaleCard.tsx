'use client';

import {ActionIcon, Badge, Card, Group, rem, Text, useMantineTheme} from '@mantine/core';
import {IconBookmark, IconHeart, IconShare, IconStar} from '@tabler/icons-react';
import classes from './SaleCard.module.css';
import Link from "next/link";
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SaleImage from "@/components/SaleCard/SaleImage";
import {formatCurrency} from "@/lib/utils/generalUtils";
import {getAPIUrl} from "@/lib/actions/userActions";

type SaleCardProps = {
    data: Auction;
};

function getTrimMiles(miles: number): string {
    if (miles >= 1000) {
        return `${(miles / 1000).toFixed(0)}k`;
    }
    return miles.toString();
}

function getCurrentPrice(currentHighBid: number, reservePrice: number): string {
    if (currentHighBid >= reservePrice && (currentHighBid != 0 && reservePrice != 0)) {
        return formatCurrency(currentHighBid);
    }
    return `${formatCurrency(reservePrice)}`;
}

export default function SaleCard({data}: SaleCardProps) {
    const theme = useMantineTheme();

    const handleShare = async (event: { stopPropagation: () => void; preventDefault: () => void; }) => {
        event.stopPropagation(); // Prevent the Card link from being triggered
        event.preventDefault(); // Stop the default behavior
        
        const baseUrl = await getAPIUrl();
        const shareLink = `${baseUrl}auctions/details/${data.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Auction Details',
                    url: shareLink,
                });
            } catch (error) {
                console.error('Error sharing link:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareLink);
            } catch (error) {
                console.error('Error copying link:', error);
            }
        }
    };

    return (
        <Card
            withBorder
            padding="lg"
            radius="md"
            className={classes.card}
            component={Link}
            href={`/auctions/details/${data.id}`}
            target="_self"
        >
            <Card.Section mb="sm">
                <div className={classes.saleImageContainer}>
                    <SaleImage data={data}/>
                </div>
            </Card.Section>
            <Group className={classes.countdown}>
                <CountdownTimer auctionEnd={data.auctionEnd}/>
            </Group>

            <Text fw={700} className={classes.title} mt="xs">
                {`${data.year} ${data.make} ${data.model}`}
            </Text>

            <Text fw={300} className={classes.subText} mt="xs">
                {`${data.color} • ${getTrimMiles(data.mileage)} miles`}
            </Text>

            <Text fw={600} className={classes.price} mt="xxl">
                {`${getCurrentPrice(data.currentHighBid, data.reservePrice)} `}
            </Text>

            <Card.Section className={classes.footer}>
                <Group justify="space-between">
                    <Badge color={data.currentHighBid === 0 ? "red" : "green"} size={"xl"}>
                        <Text fz="md">
                            {data.currentHighBid === 0 ? 'No bids' : formatCurrency(data.currentHighBid)}
                        </Text>
                    </Badge>
                    <Group gap={0}>
                        <ActionIcon variant="subtle" color="gray" onClick={handleShare}>
                            <IconShare
                                style={{width: rem(20), height: rem(20)}}
                                color={theme.colors.blue[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card.Section>
        </Card>
    );
}
