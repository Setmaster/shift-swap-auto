'use client';
import classes from "./ErrorPageContent.module.css";
import {Container, Group, Text, Title} from "@mantine/core";
import Link from "next/link";

export default function ErrorPageContent() {
    return (
        <main className="error">
            <div className={classes.root}>
                <Container>
                    <div className={classes.label}>ERROR</div>
                    <Title className={classes.title}>Something bad just happened...</Title>
                    <Text size="lg" ta="center" className={classes.description}>
                        If you think this is a mistake, please contact us.
                    </Text>
                    <Group justify="center">
                        <div className={classes.button}>
                            <Link href="/" prefetch={false}>Take me home</Link>
                        </div>
                    </Group>
                </Container>
            </div>
        </main>
    );
}