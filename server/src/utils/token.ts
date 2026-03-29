import { nanoid } from 'nanoid'
import { env } from '@/configs/env.js';
import { authLogger } from '@/configs/logger/index.js';
import { AuthPayload, Payload } from '@/types/index.js';
import { SignJWT,jwtVerify } from 'jose';

export const createToken = async(payLoad: Payload,secret: string,expiresIn: number) => {
    const encodeSecret = new TextEncoder().encode(secret);
    const token = await new SignJWT(payLoad)
                             .setProtectedHeader({ alg: 'HS256' })
                             .setIssuedAt()
                             .setIssuedAt()
                             .setJti(nanoid())
                             .setExpirationTime(expiresIn)
                             .sign(encodeSecret);
     return token;
}

export const verifyToken = async(token: string) => {
    const secrets = [
       { id: 'v2', key: new TextEncoder().encode(env.SECRET_CURRENT) },
       { id: 'v1', key: new TextEncoder().encode(env.SECRET_PREVIOUS) }
    ];

    for (const { key } of secrets) {
     
        try {
            const decode = await jwtVerify(token,key,{
                algorithms: ["HS256"] 
            })
            return decode.payload as unknown as AuthPayload
        } catch (err: any) {
            authLogger.error(`JWT Verification: ${err}`);
            if (err.code === 'ERR_JWT_EXPIRED') throw err;
            continue;
        }
    }
}

export const versionVerify = {
    v1: async (token: string) => {
        const decode = await verifyToken(token);
        return decode;
    }
}