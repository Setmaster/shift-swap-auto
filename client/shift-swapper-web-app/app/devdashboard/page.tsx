import {Code, Container, Text, Title} from "@mantine/core";
import {getServerSession} from "next-auth";
import {getSession, getTokenWorkaround} from "@/lib/actions/authActions";
import AuthTests from "@/components/AuthTests/AuthTests";

export default async function DevDashboard(){
    const session =  await getSession();
    const token = await getTokenWorkaround();
    
    return (
        <Container>
            <Title order={1}>Dev Dashboard</Title>
            <Text size="xl">Welcome to the Shift Swapper Dev Dashboard</Text>
            <Text size="md">Session</Text>
            <Code block>{JSON.stringify(session, null, 2)}</Code>
            <AuthTests />
            <Text size="md">Token</Text>
            <Code block>{JSON.stringify(token, null, 2)}</Code>
        </Container>
    );
}