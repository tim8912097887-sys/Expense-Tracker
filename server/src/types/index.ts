import mongoose from "mongoose";

export type CleanupFn = () => Promise<void> | void

export interface IUser extends mongoose.Document {
    username: string
    email: string
    password: string
    avatar: string
    loginAttempts: number
    loginAbility: number
    isVerified: boolean
}

export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

export type UserModelType = mongoose.Model<IUser,object, IUserMethods>;