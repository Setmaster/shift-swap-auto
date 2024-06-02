'use client';
import {Button, Container, Group, Text} from "@mantine/core";
import classes from "@/components/NoResultsFilterError/NoResultsFilterError.module.css";
import {signIn} from "next-auth/react";

export default function NotLoggedInError({callbackUrl} : {callbackUrl: string}) {
    return (
        <Container className={classes.root}>
            <div className={classes.label}>You need to logged in to see this content</div>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                Please click below to sign in
            </Text>
            <Group justify="center">
                <Button onClick={()=> signIn('id-server', {callbackUrl})} variant="filled" size="md" className={classes.resetButton}>
                    Login
                </Button>
            </Group>
        </Container>
    );
}