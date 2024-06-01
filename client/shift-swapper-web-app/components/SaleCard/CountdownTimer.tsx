'use client';

import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { Badge } from "@mantine/core";

type rendererArgs = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
};

type CountdownTimerProps = {
    auctionEnd: string;
};

const renderer = ({ days, hours, minutes, seconds, completed }: rendererArgs) => {
    if (completed) {
        return <Badge color="red" size="xl">Sale Ended</Badge>;
    } else {
        return (
            <Badge color="green" size="xl">
                {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
            </Badge>
        );
    }
};

export default function CountdownTimer({ auctionEnd }: CountdownTimerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Return null during SSR
        return null;
    }

    return (
        <Countdown
            date={auctionEnd}
            renderer={renderer}
        />
    );
}
