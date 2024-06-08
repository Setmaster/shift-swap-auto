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

export async function validateAuctionData(data: AuctionFormValues): Promise<{ errors?: any[], validatedData?: ValidatedAuctionFormValues }> {
    // Sanitize the input data to prevent XSS
    const sanitizedData = {
        make: xss(data.make),
        model: xss(data.model),
        color: xss(data.color),
        year: xss(data.year),
        mileage: xss(data.mileage),
        reservePrice: xss(data.reservePrice),
        endDateTime: xss(data.endDateTime),
        image: data.image // File objects don't need XSS sanitization
    };

    try {
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
        const validatedData = ValidatedAuctionFormValuesSchema.parse(finalData);

        return { validatedData };
    } catch (error: any) {
        const errors = error.errors?.map((err: any) => ({
            status: err.path,
            message: err.message
        })) || [{ status: 'Unknown',message: 'An unknown error occurred' }];

        return { errors };
    }
}



// Define the partial schema for the form values
const PartialAuctionFormValuesSchema = z.object({
    make: z.string().min(2, 'Make must be at least 2 characters').optional(),
    model: z.string().min(2, 'Model must be at least 2 characters').optional(),
    color: z.string().min(2, 'Color must be at least 2 characters').optional(),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').optional(),
    mileage: z.string().regex(/^\d+$/, 'Mileage must be a number').optional(),
});

// Define the schema for the validated values
const ValidatedPartialAuctionFormValuesSchema = z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    color: z.string().optional(),
    year: z.number().optional(),
    mileage: z.number().optional(),
});

export async function validateUpdateAuctionData(data: Partial<AuctionFormValues>): Promise<{ errors?: any[], validatedData?: Partial<ValidatedAuctionFormValues> }> {
    // Sanitize the input data to prevent XSS
    const sanitizedData: Partial<AuctionFormValues> = {};
    if (data.make) sanitizedData.make = xss(data.make);
    if (data.model) sanitizedData.model = xss(data.model);
    if (data.color) sanitizedData.color = xss(data.color);
    if (data.year) sanitizedData.year = xss(data.year);
    if (data.mileage) sanitizedData.mileage = xss(data.mileage);

    try {
        // Validate and parse the sanitized data
        const parsedData = PartialAuctionFormValuesSchema.parse(sanitizedData);

        // Convert string values to numbers where necessary
        const finalData: Partial<ValidatedAuctionFormValues> = {};
        if (parsedData.year) finalData.year = parseInt(parsedData.year, 10);
        if (parsedData.mileage) finalData.mileage = parseInt(parsedData.mileage, 10);
        if (parsedData.make) finalData.make = parsedData.make;
        if (parsedData.model) finalData.model = parsedData.model;
        if (parsedData.color) finalData.color = parsedData.color;

        // Validate the final data to ensure it matches the expected structure
        const validatedData = ValidatedPartialAuctionFormValuesSchema.parse(finalData);

        return { validatedData };
    } catch (error: any) {
        const errors = error.errors?.map((err: any) => ({
            status: err.path,
            message: err.message
        })) || [{ status: 'Unknown', message: 'An unknown error occurred' }];

        return { errors };
    }
}

// Define the schema for the bid values
const BidSchema = z.object({
    auctionId: z.string().uuid('Invalid auction ID'),
    amount: z.number()
        .positive('Bid amount must be a positive number')
        .refine((val) => /^[1-9][0-9]*$/.test(String(val)), {
            message: 'Bid amount must be a non-zero number and should not start with 0'
        })
});

export async function validateBidData(data: { auctionId: string, amount: number }): Promise<{ errors?: any[], validatedData?: { auctionId: string, amount: number } }> {
    const sanitizedData = {
        auctionId: xss(data.auctionId),
        amount: data.amount // Numbers don't need XSS sanitization
    };

    try {
        const validatedData = BidSchema.parse(sanitizedData);

        return { validatedData };
    } catch (error: any) {
        const errors = error.errors?.map((err: any) => ({
            status: err.path,
            message: err.message
        })) || [{ status: 'Unknown', message: 'An unknown error occurred' }];

        return { errors };
    }
}