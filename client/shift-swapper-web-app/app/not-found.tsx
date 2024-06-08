'use client';

import {Container, Group, Title, Text} from "@mantine/core";
import classes from './not-found.module.css';
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="error">
            <div className={classes.root}>
                <Container>
                    <div className={classes.label}>404</div>
                    <Title className={classes.title}>You have found a secret place.</Title>
                    <Text size="lg" ta="center" className={classes.description}>
                        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.
                    </Text>
                    <Group justify="center">
                        <div className={classes.button}>
                            <Link href="/">Take me home</Link>
                        </div>
                    </Group>
                </Container>
            </div>
        </main>
    );
}