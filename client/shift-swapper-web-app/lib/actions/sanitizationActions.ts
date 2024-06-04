import { z } from 'zod';
import xss from 'xss';

// Define the schema for the form values
const AuctionFormValuesSchema = z.object({
    make: z.string().min(2, 'Make must be at least 2 characters'),
    model: z.string().min(2, 'Model must be at least 2 characters'),
    color: z.string().min(2, 'Color must be at least 2 characters'),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
    mileage: z.string().regex(/^\d+$/, 'Mileage must be a number'),
    reservePrice: z.string().regex(/^\d+$/, 'Reserve price must be a number'),
    endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }).refine((val) => {
        const date = new Date(val);
        const now = new Date();
        return date.getTime() > now.getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }, {
        message: 'Date must be at least 24 hours in the future',
    }),
    image: z.instanceof(File).nullable(),
});

// Define the schema for the validated values
const ValidatedAuctionFormValuesSchema = z.object({
    make: z.string(),
    model: z.string(),
    color: z.string(),
    year: z.number(),
    mileage: z.number(),
    reservePrice: z.number(),
    auctionEnd: z.string(),
    imageUrl: z.string(),
});


export async function validateAuctionData(data: any): Promise<ValidatedAuctionFormValues> {
    // Sanitize the input data to prevent XSS
    const sanitizedData = {
        make: xss(data.make),
        model: xss(data.model),
        color: xss(data.color),
        year: xss(data.year),
        mileage: xss(data.mileage),
        reservePrice: xss(data.reservePrice),
        endDateTime: xss(data.endDateTime),
        image: data.image, // File objects don't need XSS sanitization
    };

    // Validate and parse the sanitized data
    const parsedData = AuctionFormValuesSchema.parse(sanitizedData);

    // Convert string values to numbers where necessary
    const finalData = {
        ...parsedData,
        year: parseInt(parsedData.year, 10),
        mileage: parseInt(parsedData.mileage, 10),
        reservePrice: parseInt(parsedData.reservePrice, 10),
        auctionEnd: parsedData.endDateTime,
        imageUrl: '',  // This will be filled after image upload
    };

    // Validate the final data to ensure it matches the expected structure
    return ValidatedAuctionFormValuesSchema.parse(finalData);
}