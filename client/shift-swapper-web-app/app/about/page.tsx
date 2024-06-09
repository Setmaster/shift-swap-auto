'use client';

import { Container, Text, Button, Group } from '@mantine/core';
import classes from './page.module.css';
import Link from "next/link";
import { GithubIcon } from '@mantinex/dev-icons';

export default function AboutPage(){
    return (
        <div className={classes.wrapper}>
            <Container size={900} className={classes.inner}>
                <h1 className={classes.title}>
                    Welcome to{' '}
                    <Text component="span" variant="gradient" gradient={{ from: 'rgb(135,0,0)', to: 'rgba(126,126,126)' }} inherit>
                        Shift Swap
                    </Text>{' '}
                    — where vehicle auctions come alive
                </h1>

                <Text className={classes.description} color="dimmed">
                    Experience the thrill of real-time bidding with Shift Swap. Our platform allows you to create auctions to sell your vehicles, while buyers can bid on them in real time. Join our community and discover a new way to buy and sell vehicles, with transparency and excitement at every turn.
                </Text>

                <Group className={classes.controls}>
                    <Link className={classes.a} href={'/'}>See live Auctions</Link>

                    <a className={classes.a} href={'https://github.com/Setmaster/shift-swap-auto'}><GithubIcon size={20} />Visit our GitHub</a>
                </Group>
            </Container>
        </div>
    );
}
