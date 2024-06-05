import {getAuction} from "@/lib/actions/auctionActions";
import {Container, Group, SimpleGrid, Stack, Text} from "@mantine/core";
import SaleImage from "@/components/SaleCard/SaleImage";
import classes from './page.module.css';
import CountdownTimer from "@/components/SaleCard/CountdownTimer";
import SpecsTable from "@/components/SpecsTable/SpecsTable";

export default async function AuctionDetailsPage({params}: { params: { id: string } }) {
    const data = await getAuction(params.id);

    return (
        <Container fluid>
            <Stack>
                <SimpleGrid cols={{base: 1, md: 2}}>
                    <Container className={classes.leftSideContainer}>
                        <Stack>
                            <Text
                                size={'xl'}
                                fw={700}
                            >
                                {data.make + ' ' + data.model}
                            </Text>
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