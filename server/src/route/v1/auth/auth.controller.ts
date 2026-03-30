import { RequestHandler } from "express";
import AuthService from "./auth.service.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";


export default class AuthController {
    
   constructor(private readonly authService: AuthService) {}

   loginUser: RequestHandler = async(req,res) => {
        const { existUser: user,token } = await this.authService.login(req.validData);
        const data = {
            user,
            token
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
   }

   signupUser: RequestHandler = async(req,res) => {
      
       const { otp } = await this.authService.signup(req.validData);
       const data = {
          otp,
          message: "Please check the email for verification"
       }
       res.status(201).json(responseEnvelope({
           state: 'success',
           data
       }))
   }

   verifyAccount: RequestHandler = async(req,res) => {
      
       await this.authService.verifyAccount(req.validData);
       const data = {
          message: "Please login"
       }
       res.status(200).json(responseEnvelope({
           state: 'success',
           data
       }))
   }

    logout: RequestHandler = async(req,res) => {
        await this.authService.logout(req.user);
        const data = {
            message: "Logout successfully"
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
    }

    logoutAll: RequestHandler = async(req,res) => {
        await this.authService.logoutAll(req.user);
        const data = {
            message: "Logout all devices successfully"
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
    }

    getMe: RequestHandler = async(req,res) => {
        const user = await this.authService.getMe(req.user);
        const data = {
            user
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
     }

    forgotPassword: RequestHandler = async(req,res) => {
        const { otp } = await this.authService.forgotPassword(req.validData);
        const data = {
            otp,
            message: "Please check your email for OTP"
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
    }
    
    resetPassword: RequestHandler = async(req,res) => {
        await this.authService.resetPassword(req.validData);
        const data = {
            message: "Password reset successfully, please login"
        }
        res.status(200).json(responseEnvelope({
            state: 'success',
            data
        }))
    }

}