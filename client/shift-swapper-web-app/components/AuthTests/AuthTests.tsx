import React from 'react';
import {Button, Group, Text} from "@mantine/core";

type AuthTestsProps = {
    loading: boolean;
    result: any;
    doUpdate: () => void;
};

export default function AuthTests({ loading, result, doUpdate }: AuthTestsProps) {
    return (
        <Group>
            <Button loading={loading} loaderProps={{ type: 'dots' }} onClick={doUpdate}>
                Test auth
            </Button>
            <Text>{JSON.stringify(result, null, 2)}</Text>
        </Group>
    );
}
