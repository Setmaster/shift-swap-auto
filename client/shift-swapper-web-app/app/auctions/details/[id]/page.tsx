import {getAuction, getBidsForAuction} from "@/lib/actions/auctionActions";
import {Button, Container, Group, rem, SimpleGrid, Stack, Text, useMantineTheme} from "@mantine/core";
import SaleImage from "@/components/SaleCard/SaleImage";
import classes from './page.module.css';
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SpecsTable from "@/components/SpecsTable/SpecsTable";
import {IconEdit} from "@tabler/icons-react";
import AuctionEditButton from "@/components/Buttons/AuctionEditButton";
import {getCurrentUser} from "@/lib/actions/authActions";
import BidsTable from "@/components/BidsTable/BidsTable";
import {User} from "next-auth";

export default async function AuctionDetailsPage({params}: { params: { id: string } }) {
    const data = await getAuction(params.id);
    const user : User | null = (await getCurrentUser());
    
    return (
        <Container fluid>
            <Stack>
                <SimpleGrid cols={{base: 1, md: 2}}>
                    <Container className={classes.leftSideContainer}>
                        <Stack>
                            <Group>
                                <Text
                                    size={'xl'}
                                    fw={700}
                                >
                                    {data.make + ' ' + data.model}
                                </Text>
                                {user?.username === data.seller && <AuctionEditButton auctionId={data.id}/>}
                            </Group>
                            <Container className={classes.saleImageContainer}>
                                <SaleImage data={data}/>
                            </Container>
                        </Stack>
                    </Container>
                    <Container className={classes.leftSideContainer}>
                        <Stack>
                            <Group>
                                <Text
                                    size={'xl'}
                                    fw={700}
                                >
                                    Time Left:
                                </Text>
                                <CountdownTimer auctionEnd={data.auctionEnd}/>
                            </Group>
                            <Container className={classes.bidsTableContainer}>
                                <BidsTable user={user} auctionData={data}/>
                            </Container>
                        </Stack>
                    </Container>
                </SimpleGrid>
                <Stack>
                    <Text
                        size={'xl'}
                        fw={700}
                    >
                        Specs:
                    </Text>
                <SpecsTable data={data}/>
                </Stack>
                </Stack>
        </Container>
    )
}