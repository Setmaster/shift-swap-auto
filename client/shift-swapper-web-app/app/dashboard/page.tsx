import {Container, Text, Title} from "@mantine/core";
import {getServerSession} from "next-auth";
import {getSession} from "@/lib/actions/authActions";

export default async function Dashboard(){
    const session =  await getSession();
    return (
        <Container>
            <Title order={1}>Dashboard</Title>
            <Text size="xl">Welcome to the Shift Swapper Dashboard</Text>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </Container>
    );
}