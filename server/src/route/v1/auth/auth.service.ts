import { authLogger } from "@/configs/logger/index.js";
import AuthRepository from "./auth.repository.js";
import { LoginUserType } from "./schema/login.js";
import { CreateUserType } from "./schema/signup.js";
import { BadRequestError, ForbiddenError, ServerError, UnauthorizedError } from "@/customs/error/httpErrors.js";
import { env } from "@/configs/env.js";
import { UpdatedField } from "@/types/index.js";
import { createToken } from "@/utils/token.js";
import { sendEmail } from "@/utils/email.js";
import { generateOtp } from "@/utils/generateOtp.js";
import { VerificationType } from "./schema/verification.js";

export default class AuthService {
    
    constructor(private readonly authRepository: AuthRepository) {}

    login = async(user: LoginUserType) => {
        const existUser = await this.authRepository.getUserByEmail(user.email,true);

        if(!existUser || !existUser.isVerified) {
            if(existUser) {
                authLogger.info(`User Login: Account with email: ${existUser.email} haven't verified yet`);
            }
            throw new BadRequestError(`Email or Password is not correct`);
        }
        // Check if it's currently locked
        const isLock = existUser.lockExpired && existUser.lockExpired>Date.now();
        if(isLock) {
            authLogger.warn(`User Login: locked with email: ${existUser.email}`);
            throw new ForbiddenError("User account is locked");
        } 
        const isMatch = await existUser.comparePassword(user.password);

        if(!isMatch) {
            const updatedField: UpdatedField = {
                loginAttempts: existUser.loginAttempts+1
            }
            
            if(updatedField.loginAttempts>=env.ATTEMPT_TIME) {
                updatedField.lockExpired = Date.now()+env.ACCOUNT_LOCK_TIME;
                updatedField.loginAttempts = 0;
            }
            // Wait for data update
            const updatedValue = await this.authRepository.updateUserByEmail(existUser.email,updatedField);
            if(!updatedValue) {
                authLogger.warn(`User Login: Email: ${existUser.email} fail to update login attempt`);
                throw new ServerError("Update failed during login process");
            } 
            authLogger.warn(`User Login: Email: ${existUser.email}
                                     attempt ${updatedField.loginAttempts} times`);
            throw new BadRequestError(`Email or Password is not correct`);
        } 
        // Reset attempt state when success
        if(existUser.loginAttempts>0 || existUser.lockExpired) {
            const updatedField: UpdatedField = {
                loginAttempts: 0,
                lockExpired: -1   
            }
            // Wait for data update
            const updatedValue = await this.authRepository.updateUserByEmail(existUser.email,updatedField);
            if(!updatedValue) {
                authLogger.warn(`User Login: Email: ${existUser.email} fail to reset login attempt`);
                throw new ServerError("Update failed during login process");
            } 
            authLogger.info(`User Login: Email: ${existUser.email} login Reset`);
        }
        authLogger.info(`User Login: Email: ${existUser.email} success`);
        // Create token
        const payLoad = {
                sub: existUser._id.toString(),
                token_version: existUser.tokenVersion,
                v: env.TOKEN_VERSION
        }
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const expirationTime = currentTimeInSeconds + env.TOKEN_EXPIRED;
        const token = await createToken(payLoad,env.SECRET_CURRENT,expirationTime);
        return { existUser,token };
    }

    signup = async(user: CreateUserType) => {
         const existUser = await this.authRepository.getUserByEmail(user.email,false);
         const appName = "Expense Tracker";
         const otp = generateOtp();
         if(existUser && existUser.isVerified) {
            authLogger.warn(`Signup User: Email ${existUser.email} has already been used`);
            const subject = `Security Alert: Duplicate Signup Attempt for ${appName}`;
            const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #333;">Hello ${existUser.username},</h2>
                    <p>Someone recently tried to create a new account with your email address on <strong>${appName}</strong>.</p>
                    <p style="background-color: #fff4f4; padding: 15px; border-left: 5px solid #d9534f;">
                        <strong>Note:</strong> Your account is already verified. If this was you, you can simply log in as usual. If this was <strong>not</strong> you, your account is still secure, but you may want to update your password just in case.
                    </p>
                    <p>No action is required if you already have an account.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">This is an automated security notification.</p>
                </div>
            `;
            await sendEmail(user.email,subject,html);
            return { otp };
         }
         const expiredAt = new Date(Date.now()+env.OTP_EXPIRED);
         const createdOtp = await this.authRepository.createOtp(user.email,otp,expiredAt);
         authLogger.info(`Signup User: otp ${createdOtp.otp} successfully created for email ${createdOtp.email}`);
         if(existUser) {
             const subject = `Your New Verification Code - ${appName}`;

             const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
                    <p>It looks like you're trying to complete your registration on <strong>${appName}</strong>.</p>
                    <p>Please use the following verification code to verify your account:</p>
                    
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otp}</span>
                    </div>
                    
                    <p style="color: #777; font-size: 14px;">This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                </div>
            `;
             authLogger.warn(`Signup User: Email ${existUser.email} is not verified yet`);
             await sendEmail(existUser.email,subject,html);
             return { otp };
         }

         const createdUser = await this.authRepository.createUser(user);
         authLogger.info(`User Signup: User with email ${user.email} and username ${user.username} created Successfully`)
         const subject = `Welcome to ${appName}! Verify your account`;

         const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome, ${user.username}!</h2>
                    <p>Thank you for joining <strong>${appName}</strong>. We're excited to help you track your finances better.</p>
                    <p>To get started, please enter the following 6-digit code in the app:</p>
                    
                    <div style="background-color: #e8f4fd; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 1px dashed #2980b9;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2980b9;">${otp}</span>
                    </div>
                    
                    <p style="color: #777; font-size: 14px;">For security, this code is only valid for <strong>10 minutes</strong>.</p>
                    <p>Welcome aboard!<br>The ${appName} Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #aaa; text-align: center;">Secure financial tracking made simple.</p>
                </div>
            `;
         await sendEmail(createdUser.email,subject,html);
         return { otp };
    }

    verifyAccount = async(verifyInfo: VerificationType) => {
         
        const totp = await this.authRepository.getOtp(verifyInfo.email,verifyInfo.otp);
        if(!totp) {
            authLogger.warn(`Verify Account: Email ${verifyInfo.email} with Otp ${verifyInfo.otp} is expired`);
            throw new UnauthorizedError(`Otp Expired`);
        }
        await this.authRepository.updateUserByEmail(verifyInfo.email,{ isVerified: true });
        authLogger.info(`Verify Account: Email ${verifyInfo.email} successfully verified`);
        return;
    }
}