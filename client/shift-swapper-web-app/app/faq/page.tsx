'use client';

import { Container, Title, Accordion } from '@mantine/core';
import classes from './page.module.css';

const answers = {
    'what-is-shift-swap': 'Shift Swap is a website where you can create auctions to sell your vehicles with real-time bidding. Buyers can place bids in real-time, making the auction process exciting and competitive.',
    'how-to-create-auction': 'To create an auction, you need to be registered and logged in, open your user menu at the top of the page, and select sell my vehicle, fill in the details about your vehicle, set a starting price, and choose the duration of the auction. Once submitted, your auction will be live for others to bid on.',
    'how-to-bid': 'To place a bid, you need to be registered and logged in. Navigate to the auction you are interested in, click the "Place Bid" button and enter your bid amount, . Watch the auction in real-time to see if you are outbid.',
    'auction-rules': 'Our auction rules ensure a fair and transparent process. All bids are binding, and the highest bid at the end of the auction wins. Please review our full auction rules on the Auction Rules page.',
    'payment-and-delivery': 'Once you win an auction, you will receive a notification with payment instructions. After payment is confirmed, the seller will arrange the delivery or pickup of the vehicle. Our platform ensures secure transactions to protect both buyers and sellers.'
};

export default function FaqPage() {
    return (
        <Container size="sm" className={classes.wrapper}>
            <Title ta="center" className={classes.title}>
                Frequently Asked Questions
            </Title>

            <Accordion variant="separated">
                <Accordion.Item className={classes.item} value="what-is-shift-swap">
                    <Accordion.Control>What is Shift Swap?</Accordion.Control>
                    <Accordion.Panel>{answers["what-is-shift-swap"]}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item className={classes.item} value="how-to-create-auction">
                    <Accordion.Control>How do I create an auction?</Accordion.Control>
                    <Accordion.Panel>{answers["how-to-create-auction"]}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item className={classes.item} value="how-to-bid">
                    <Accordion.Control>How do I place a bid?</Accordion.Control>
                    <Accordion.Panel>{answers["how-to-bid"]}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item className={classes.item} value="auction-rules">
                    <Accordion.Control>What are the auction rules?</Accordion.Control>
                    <Accordion.Panel>{answers["auction-rules"]}</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item className={classes.item} value="payment-and-delivery">
                    <Accordion.Control>What are the payment and delivery options?</Accordion.Control>
                    <Accordion.Panel>{answers["payment-and-delivery"]}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}
