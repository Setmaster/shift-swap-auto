'use client';
import {Button, rem} from "@mantine/core";
import {IconLogin2} from "@tabler/icons-react";
import React from "react";
import {signIn} from "next-auth/react";

export default function PlacedBidNotSignedInButton() {
    const handleLogin = () => {
        signIn('id-server', {callbackUrl: '/'})
    };
    return (
        <Button
            leftSection={<IconLogin2 style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
            color={"#870000"}
            onClick={handleLogin}
        >Sign in to bid</Button>
    );
}