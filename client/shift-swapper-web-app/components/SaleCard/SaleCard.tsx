'use client';

import {
    Card,
    ActionIcon,
    Group,
    Text,
    Avatar,
    Badge,
    useMantineTheme,
    rem,
} from '@mantine/core';
import {Image as MantineImage} from '@mantine/core';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
import classes from './SaleCard.module.css';
import Link from "next/link";
import Image from "next/image";

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
};

type SaleCardProps = {
    data: SaleCardData;
};

function getTrimMiles(miles: number): string {
    if(miles >= 1000) {
        return `${(miles/1000).toFixed(0)}k`;
    }
    return miles.toString();
}

function getCurrentPrice(currentHighBid: number, reservePrice: number): string {
    const formatCurrency = (amount : number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
    };
    if(currentHighBid >= reservePrice && (currentHighBid != 0 && reservePrice != 0)) {
        return formatCurrency(currentHighBid);
    }
    return `${formatCurrency(reservePrice)}`;
}

export default function SaleCard({ data }: SaleCardProps) {

    const theme = useMantineTheme();
    console.log(data);
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
                    <Image
                        className={classes.saleImage}
                        src={data.imageUrl}
                        alt={`${data.year} ${data.make} ${data.model}`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
            </Card.Section>

            {/*<Badge w="fit-content" variant="light">*/}
            {/*    decorations*/}
            {/*</Badge>*/}

            <Text fw={700} className={classes.title} mt="xs">
                {`${data.year} ${data.make} ${data.model}`}
            </Text>

            <Text fw={400} className={classes.subText}  mt="xs">
                {`${data.color} • ${getTrimMiles(data.mileage)} miles`}
            </Text>

            <Text fw={600} className={classes.price}  mt="xxl">
                {`${getCurrentPrice(data.currentHighBid, data.reservePrice)} `}
            </Text>
            
            {/*<Group mt="lg">*/}
            {/*    <Avatar*/}
            {/*        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"*/}
            {/*        radius="sm"*/}
            {/*    />*/}
            {/*    <div>*/}
            {/*        <Text fw={500}>Elsa Gardenowl</Text>*/}
            {/*        <Text fz="xs" c="dimmed">*/}
            {/*            posted 34 minutes ago*/}
            {/*        </Text>*/}
            {/*    </div>*/}
            {/*</Group>*/}

            <Card.Section className={classes.footer}>
                <Group justify="space-between">
                    <Text fz="xs" c="dimmed">
                        733 people liked this
                    </Text>
                    <Group gap={0}>
                        <ActionIcon variant="subtle" color="gray">
                            <IconHeart
                                style={{ width: rem(20), height: rem(20) }}
                                color={theme.colors.red[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray">
                            <IconBookmark
                                style={{ width: rem(20), height: rem(20) }}
                                color={theme.colors.yellow[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray">
                            <IconShare
                                style={{ width: rem(20), height: rem(20) }}
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