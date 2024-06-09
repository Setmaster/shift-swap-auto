'use server';

export async function getAPIUrl() {
    return process.env.API_URL;
}