﻿export {default} from "next-auth/middleware"

export const config = {
    matcher: [
        '/dashboard'
    ],
    pages:{
        signIn: '/api/auth/signin',
    }
}