'use client';

import {Container, Flex, Group, SimpleGrid, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import ImageDropzone from "@/components/AuctionForm/ImageDropzone";
import AuctionFormSubmitButton from "@/components/AuctionForm/AuctionFormSubmitButton";
import {useState} from "react";
import classes from './AuctionForm.module.css';
import {DateTimePicker} from "@mantine/dates";
import dayjs from 'dayjs';

export default function AuctionForm() {
    const form = useForm({
        initialValues: {
            make: '',
            model: '',
            color: '',
            year: '',
            mileage: '',
            reservePrice: '',
            endDateTime: null,
            image: null, // Initialized for a single image file
        },
        validate: {
            make: (value) => (value.trim().length < 2 ? 'Name must be at least 2 characters' : null),
            model: (value) => (value.trim().length < 2 ? 'Model must be at least 2 characters' : null),
            color: (value) => (value.trim().length < 2 ? 'Color must be at least 2 characters' : null),
            year: (value) => {
                if (value.trim().length !== 4) {
                    return 'Year must be exactly 4 digits';
                }
                if (!/^\d{4}$/.test(value)) {
                    return 'Year must contain only numbers';
                }
                return null;
            },
            mileage: (value) => {
                if (!/^\d+$/.test(value.trim())) {
                    return 'Mileage must be a number';
                }
                if (value.trim().length < 1) {
                    return 'Mileage must be at least 1 character';
                }
                return null;
            },
            reservePrice: (value) => {
                if (!/^\d+$/.test(value.trim())) {
                    return 'Reserve price must be a number';
                }
                if (value.trim().length < 1) {
                    return 'Reserve price must be at least 1 character';
                }
                return null;
            },
            endDateTime: (value) => {
                if (!value) {
                    return 'End date and time is required';
                }
                const now = dayjs();
                const selectedDate = dayjs(value);
                if (!selectedDate.isValid() || selectedDate.format('YYYY-MM-DD HH:mm') === 'Invalid Date') {
                    return 'Please select a valid date and time';
                }
                if (selectedDate.isBefore(now.add(24, 'hour'))) {
                    return 'End date and time must be at least 24 hours in the future';
                }
                return null;
            },
        },

    });

    const [submitting, setSubmitting] = useState(false);
    const [imageError, setImageError] = useState(false);

    const submitHandler = async (values) => {
        if (!values.image) {
            setImageError(true);
            return;
        }

        // Create a FormData object
        const formData = new FormData();

        // Append all form fields to the FormData object
        formData.append('make', values.make);
        formData.append('model', values.model);
        formData.append('color', values.color);
        formData.append('year', values.year);
        formData.append('mileage', values.mileage);
        formData.append('reservePrice', values.reservePrice);
        formData.append('endDateTime', values.endDateTime.toISOString());
        formData.append('image', values.image);

        setSubmitting(true);

        // await shareAuction(formData);
    };

    return (
        <Container>
            <form onSubmit={form.onSubmit(submitHandler)}>
                <Title
                    order={2}
                    size="h1"
                    style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}}
                    fw={900}
                    ta="center"
                >
                    Sell your vehicle today
                </Title>

                <SimpleGrid cols={{base: 1, sm: 2}} mt="xl">
                    <TextInput
                        label="Make"
                        placeholder="Your vehicle make"
                        {...form.getInputProps('make')}
                        variant="filled"
                    />
                    <TextInput
                        label="Model"
                        placeholder="Your vehicle model"
                        {...form.getInputProps('model')}
                        variant="filled"
                    />
                </SimpleGrid>
                <SimpleGrid cols={{base: 1, sm: 2}} mt="xl">
                    <TextInput
                        label="Color"
                        placeholder="Your vehicle color"
                        {...form.getInputProps('color')}
                        variant="filled"
                    />
                    <TextInput
                        label="Year"
                        placeholder="Your vehicle year"
                        {...form.getInputProps('year')}
                        variant="filled"
                    />
                </SimpleGrid>

                <SimpleGrid cols={{base: 1, sm: 2}} mt="xl">
                    <TextInput
                        label="Mileage"
                        placeholder="Your vehicle mileage"
                        {...form.getInputProps('mileage')}
                        variant="filled"
                    />
                    <TextInput
                        label="Reserve Price"
                        placeholder="Minimum price you will accept for your vehicle"
                        {...form.getInputProps('reservePrice')}
                        variant="filled"
                    />
                </SimpleGrid>

                <DateTimePicker
                    className={classes.dateInput}
                    variant="filled"
                    label="Auction End Date"
                    placeholder="Pick date and time"
                    {...form.getInputProps('endDateTime')}
                />

                <Flex
                    mih={50}
                    gap="xl"
                    justify="center"
                    align="flex-end"
                    direction="row"
                    wrap="wrap"
                    className={classes.buttonsContainer}
                >
                    <ImageDropzone form={form} emptyError={imageError} setImageError={setImageError} />
                    <AuctionFormSubmitButton pending={submitting}/>
                </Flex>
            </form>
        </Container>
    );
}
