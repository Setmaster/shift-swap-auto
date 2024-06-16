'use server';

export async function getAPPUrl() {
    return process.env.APP_URL;
}