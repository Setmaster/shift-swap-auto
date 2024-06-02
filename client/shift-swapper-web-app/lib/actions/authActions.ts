﻿'use server';

import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import {NextApiRequest} from "next";
import {cookies, headers} from "next/headers";
import {getToken} from "next-auth/jwt";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session) {
            return null;
        }
        return session.user;
    }catch(error){
        return null;
    }
}

export async function getTokenWorkaround(){
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(
            cookies()
                .getAll()
                .map((cookie) => [cookie.name, cookie.value])
        )
    } as NextApiRequest;
    
    return await getToken({req});
}