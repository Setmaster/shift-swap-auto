﻿'use server';

import {fetchWrapper} from "@/lib/utils/fetchWrapper";
import {S3} from '@aws-sdk/client-s3';
import {randomUUID} from "node:crypto";
import {validateAuctionData} from "@/lib/actions/sanitizationActions";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const s3 = new S3({
    region: 'us-east-1'
});

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await fetchWrapper.get(`search/?${query}`)
}

export async function getAuction(id: string): Promise<Auction> {
    return await fetchWrapper.get(`auctions/${id}`)
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }

    return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
}

export async function getUpdatedAuctionTest() {
    return await fetchWrapper.get('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c');
}

export async function createAuction(formData: FormData) {
    // Convert FormData to plain object
    const data: any = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const { errors, validatedData } = await validateAuctionData(data);

    if (errors) {
        return { errors };
    }
    
    if (validatedData) {
        // If there's an image, upload it and update the imageUrl
        if (data.image) {
            const imageUrl = await uploadImage(data.image);
            validatedData.imageUrl = imageUrl;
        }

        // Send the validated and sanitized data to the server
        const response = await fetchWrapper.post('auctions', validatedData);

        return response;
    }
}


async function uploadImage(image: File) {
    const fileName: string = randomUUID();
    const extension = image.name.split('.').pop();
    const bufferedImage = await image.arrayBuffer();

    const response = await s3.putObject({
        Bucket: 'shift-swap-imgs',
        Key: `${fileName}.${extension}`,
        Body: Buffer.from(bufferedImage),
        ContentType: image.type,
    });
    
    if (response.$metadata.httpStatusCode !== 200) {
        throw new Error('Failed to upload image');
    }
    
    return `https://shift-swap-imgs.s3.us-east-1.amazonaws.com/${fileName}.${extension}`
}