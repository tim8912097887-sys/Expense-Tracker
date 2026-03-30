import { nanoid } from 'nanoid'
import { env } from '@/configs/env.js';
import { authLogger } from '@/configs/logger/index.js';
import { AuthPayload, Payload } from '@/types/index.js';
import { CompactEncrypt, SignJWT,compactDecrypt,decodeJwt,jwtVerify } from 'jose';

export const createToken = async(payLoad: Payload,secret: string,expiresIn: number) => {

    // Ensure the secret is exactly 32 bytes for A256GCM
    const fullSecret = new TextEncoder().encode(secret);
    
    // Create a specific key for encryption (32 bytes)
    // and use the full secret for signing (or vice versa)
    const encryptionKey = fullSecret.slice(0, 32); 
    const signingKey = fullSecret;
    const token = await new SignJWT(payLoad)
                             .setProtectedHeader({ alg: 'HS256' })
                             .setIssuedAt()
                             .setIssuedAt()
                             .setJti(nanoid())
                             .setExpirationTime(expiresIn)
                             .sign(signingKey);
    const encryptedToken = await new CompactEncrypt(
        new TextEncoder().encode(token)
    )
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(encryptionKey);
     return encryptedToken;
}

export const decodeToken = async(token: string) => {
    const secrets = [
       { id: 'v2', key: new TextEncoder().encode(env.SECRET_CURRENT) },
       { id: 'v1', key: new TextEncoder().encode(env.SECRET_PREVIOUS) }
    ];

    for (const { key } of secrets) {
     
        try {
            
            // Create a specific key for encryption (32 bytes)
            // and use the full secret for signing (or vice versa)
            const encryptionKey = key.slice(0, 32);
            const { plaintext } = await compactDecrypt(token,encryptionKey)
            const signedJwt = new TextDecoder().decode(plaintext);
            const decode = decodeJwt(signedJwt);
            return decode as unknown as AuthPayload
        } catch (err: any) {
            authLogger.error(`JWT Decode: ${err}`);
            continue;
        }
    }
    return null;
}

export const verifyToken = async(token: string) => {
    const secrets = [
       { id: 'v2', key: new TextEncoder().encode(env.SECRET_CURRENT) },
       { id: 'v1', key: new TextEncoder().encode(env.SECRET_PREVIOUS) }
    ];

    for (const { key } of secrets) {
     
        try {
            
            // Create a specific key for encryption (32 bytes)
            // and use the full secret for signing (or vice versa)
            const encryptionKey = key.slice(0, 32); 
            const signingKey = key;
            const { plaintext } = await compactDecrypt(token,encryptionKey)
            const signedJwt = new TextDecoder().decode(plaintext);
            const decode = await jwtVerify(signedJwt,signingKey,{
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