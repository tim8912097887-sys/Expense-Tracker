import mongoose from "mongoose";

export type CleanupFn = () => Promise<void> | void

export interface IUser extends mongoose.Document {
    username: string
    email: string
    password: string
    avatar: string
    loginAttempts: number
    lockExpired: number
    isVerified: boolean
    tokenVersion: number
}

export interface ITotp extends mongoose.Document {
    email: string
    otp: string
    expiredAt: Date
}

export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

export type UserModelType = mongoose.Model<IUser,object, IUserMethods>;

export type AuthModelType = mongoose.Model<ITotp,object,object>;

export type UpdatedField = {
    loginAttempts: number
    lockExpired?: number
}

export type Payload = {
    sub: string
    v: number
    token_version: number
}
export type AuthPayload = {
    sub: string
    v: number
    token_version: number
    iat: number
    jti: string
    exp: number
}
