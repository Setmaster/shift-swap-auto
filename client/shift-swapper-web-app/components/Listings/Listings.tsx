import SaleCard from "@/components/SaleCard/SaleCard";
import {Container, SimpleGrid} from "@mantine/core";
import classes from './Listings.module.css';

async function getData() : Promise<PagedResult<Auction>> {
    const response = await fetch('http://localhost:6001/search?pageSize=10');

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
}

export default async function Listings() {
    const data = await getData();

    const cards = data.results.map((item: Auction) => {
        return (<SaleCard key={item.id} data={item}/>);
    });
    
    return (
        <Container fluid className={classes.listingsContainer}>
        <SimpleGrid cols={{ base: 1, sm: 2, md:3, xl:4 }}>
            {cards}
        </SimpleGrid>
        </Container>
    );
}