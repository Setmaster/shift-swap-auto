'use client';

import {Button, Modal, rem, Stack, TextInput} from "@mantine/core";
import {IconCash, IconSquareRoundedPlus} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import React, {useState} from "react";
import {placeBidForAuction} from "@/lib/actions/auctionActions";

export default function PlaceBidModal({auctionId}: { auctionId: string}) {
    const [opened, {open, close}] = useDisclosure(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const validateInput = (input: string) => {
        const regex = /^[1-9][0-9]*$/; // Only digits that don't start with 0
        if (!regex.test(input)) {
            setError('Invalid bid amount. Please enter a valid number that does not start with 0.');
        } else {
            setError('');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;
        setValue(inputValue);
        validateInput(inputValue);
    };

    const submitBid = async () => {
        if (error || !value) {
            console.log("Validation error or empty value");
            return;
        }
        setSubmitting(true);
        try {
            const response = await placeBidForAuction(auctionId, Number(value));
            if (response.errors) {
                const errorMessage = response.errors[0]?.message || 'An unexpected error occurred.';
                setError(errorMessage);
            } else {
                setError('');
                close();
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="Place Bid" centered>
                <Stack>
                    <TextInput
                        leftSectionPointerEvents="none"
                        leftSection={<IconCash style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
                        label="Bid Amount"
                        placeholder="1000"
                        value={value}
                        onChange={handleInputChange}
                        error={error}
                    />
                    <Button disabled={submitting} type="submit" size="md" color={"#870000"} onClick={submitBid}>
                        {submitting ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                </Stack>
            </Modal>

            <Button
                variant={"filled"}
                rightSection={<IconSquareRoundedPlus style={{width: rem(16), height: rem(16)}} stroke={1.5}/>}
                onClick={open}
                color={"#117600"}
            >
                Add Bid
            </Button>
        </>
    );
}
