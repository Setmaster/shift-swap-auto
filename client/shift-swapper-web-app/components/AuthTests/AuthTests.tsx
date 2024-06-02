'use client'

import React, { useState } from 'react'
import {updateAuctionTest} from "@/lib/actions/auctionActions";
import {Button} from "@mantine/core";
export default function AuthTests() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>();

    function doUpdate() {
        setResult(undefined);
        setLoading(true);
        updateAuctionTest()
            .then(res => setResult(res))
            .finally(() => setLoading(false))

    }

    return (
        <div >
            <Button loading={loading} loaderProps={{ type: 'dots' }} onClick={doUpdate}>
                Test auth
            </Button>
            <div>
                {JSON.stringify(result, null, 2)}
            </div>
        </div>
    )
}