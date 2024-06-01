'use client';

import Countdown, { zeroPad } from 'react-countdown';
import {Badge} from "@mantine/core";

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
        // Render a completed state
        return <Badge
            color="red"
            size="xl"
        >Sale Ended</Badge>;
    } else {
        // Render a countdown
        return <Badge 
            color="green"
            size="xl"
        >{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</Badge>;
    }
};

export default function CountdownTimer({auctionEnd}: CountdownTimerProps) {
    return (
        <Countdown
            date={auctionEnd}
            renderer={renderer}
        />
        
    );
}