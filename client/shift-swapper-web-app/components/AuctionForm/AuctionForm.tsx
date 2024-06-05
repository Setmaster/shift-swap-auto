'use client';

import {Container, Flex, SimpleGrid, TextInput, Title, Button} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useState, useEffect} from 'react';
import {DateTimePicker} from '@mantine/dates';
import dayjs from 'dayjs';
import {createAuction, updateAuction} from "@/lib/actions/auctionActions";
import {useRouter} from 'next/navigation';
import {notifications} from '@mantine/notifications';
import ImageDropzone from '@/components/AuctionForm/ImageDropzone';
import AuctionFormSubmitButton from '@/components/AuctionForm/AuctionFormSubmitButton';
import classes from './AuctionForm.module.css';
import {revalidatePath} from "next/cache";

type AuctionFormProps = {
    mode?: 'create' | 'update';
    auctionId?: string;
    initialAuctionData?: {
        make: string;
        model: string;
        color: string;
        year: string;
        mileage: string;
        reservePrice?: string;
        endDateTime?: string;
        image?: string;
    };
};

export default function AuctionForm({mode = 'create', auctionId, initialAuctionData}: AuctionFormProps) {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            make: mode === 'update' ? initialAuctionData!.make : '',
            model: mode === 'update' ? initialAuctionData!.model : '',
            color: mode === 'update' ? initialAuctionData!.color : '',
            year: mode === 'update' ? initialAuctionData!.year : '',
            mileage: mode === 'update' ? initialAuctionData!.mileage : '',
            reservePrice: '',
            endDateTime: null,
            image: null,
        },
        validate: {
            make: (value) => (value.trim().length < 2 ? 'Make must be at least 2 characters' : null),
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
            ...(mode === 'create' && {
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
                        return 'End date and time are required';
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
            }),
        },
    });

    const [submitting, setSubmitting] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const submitHandler = async (values: any) => {
        if (mode === 'create' && !values.image) {
            setImageError(true);
            return;
        }

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        if (mode === 'create') {
            formData.append('endDateTime', values.endDateTime.toISOString());
        } else {
            formData.append('id', auctionId!);
        }

        setSubmitting(true);

        const response = mode === 'create' ? await createAuction(formData) : await updateAuction(formData);

        if (response?.errors) {
            response.errors.map((err: AuctionError) => {
                notifications.show({
                    title: 'Form Submission Error',
                    message: `${err.error.status}: ${err.error.message}`,
                    color: 'red',
                });
            });
        } else {
            if (mode === 'create') {
                router.push(`/auctions/details/${response.id}`);
            }
            if (mode === 'update') {
                router.push(`/auctions/details/${auctionId}`);
            }
        }
        setSubmitting(false);
    };

    const handleCancel = () => {
        if (mode === 'update') {
            router.push(`/auctions/details/${auctionId}`);
        } else {
            router.push('/');
        }
    };

    return (
        <Container className={classes.formContainer}>
            <form onSubmit={form.onSubmit(submitHandler)}>
                <Title
                    order={2}
                    size="h1"
                    style={{fontFamily: 'Greycliff CF, var(--mantine-font-family)'}}
                    fw={900}
                    ta="center"
                >
                    {mode === 'create' ? 'Sell your vehicle today' : 'Update Auction'}
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

                {mode === 'update' && (
                    <TextInput
                        label="Mileage"
                        placeholder="Your vehicle mileage"
                        {...form.getInputProps('mileage')}
                        variant="filled"
                    />
                )}
                {mode === 'create' && (
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
                )}

                {mode === 'create' && (
                    <DateTimePicker
                        className={classes.dateInput}
                        variant="filled"
                        label="Auction End Date"
                        placeholder="Pick date and time"
                        {...form.getInputProps('endDateTime')}
                    />
                )}

                <Flex
                    mih={50}
                    gap="xl"
                    justify="center"
                    align="flex-end"
                    direction="row"
                    wrap="wrap"
                    className={classes.buttonsContainer}
                >
                    <Button onClick={handleCancel} size="md" variant="outline">
                        Cancel
                    </Button>
                    {mode === 'create' && (
                        <ImageDropzone form={form} emptyError={imageError} setImageError={setImageError}/>
                    )}
                    <AuctionFormSubmitButton pending={submitting}/>
                </Flex>
            </form>
        </Container>
    );
}
