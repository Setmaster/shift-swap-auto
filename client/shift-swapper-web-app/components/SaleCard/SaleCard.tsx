'use client';

import {ActionIcon, Card, Group, rem, Text, useMantineTheme,} from '@mantine/core';
import {IconBookmark, IconHeart, IconShare} from '@tabler/icons-react';
import classes from './SaleCard.module.css';
import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SaleImage from "@/components/SaleCard/SaleImage";

type SaleCardData = {
    id: string; // auctionId
    status: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    imageUrl: string;
    currentHighBid: number;
    reservePrice: number;
    auctionEnd: string;
};

type SaleCardProps = {
    data: SaleCardData;
};

function getTrimMiles(miles: number): string {
    if (miles >= 1000) {
        return `${(miles / 1000).toFixed(0)}k`;
    }
    return miles.toString();
}

function getCurrentPrice(currentHighBid: number, reservePrice: number): string {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };
    if (currentHighBid >= reservePrice && (currentHighBid != 0 && reservePrice != 0)) {
        return formatCurrency(currentHighBid);
    }
    return `${formatCurrency(reservePrice)}`;
}

export default function SaleCard({data}: SaleCardProps) {

    const theme = useMantineTheme();
    return (
        <Card
            withBorder
            padding="lg"
            radius="md"
            className={classes.card}
            component={Link}
            href={``}
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
                    <Text fz="xs" c="dimmed">
                        733 people liked this
                    </Text>
                    <Group gap={0}>
                        <ActionIcon variant="subtle" color="gray">
                            <IconHeart
                                style={{width: rem(20), height: rem(20)}}
                                color={theme.colors.red[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray">
                            <IconBookmark
                                style={{width: rem(20), height: rem(20)}}
                                color={theme.colors.yellow[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray">
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
