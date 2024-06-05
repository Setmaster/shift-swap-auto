import {getAuction} from "@/lib/actions/auctionActions";
import {Button, Container, Group, rem, SimpleGrid, Stack, Text, useMantineTheme} from "@mantine/core";
import SaleImage from "@/components/SaleCard/SaleImage";
import classes from './page.module.css';
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SpecsTable from "@/components/SpecsTable/SpecsTable";
import {IconEdit} from "@tabler/icons-react";
import AuctionEditButton from "@/components/Buttons/AuctionEditButton";

export default async function AuctionDetailsPage({params}: { params: { id: string } }) {
    const data = await getAuction(params.id);

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
                                <AuctionEditButton auctionId={params.id}/>
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
                            <Container className={classes.saleImageContainer}>
                                <SaleImage data={data}/>
                            </Container>
                        </Stack>
                    </Container>
                </SimpleGrid>
                <SpecsTable data={data}/>
            </Stack>
        </Container>
    )
}