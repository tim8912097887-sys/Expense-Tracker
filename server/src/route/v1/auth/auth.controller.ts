import { RequestHandler } from "express";
import AuthService from "./auth.service.js";
import AuthPresenter from "./auth.presenter.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";


export default class AuthController {
    
   constructor(private readonly authService: AuthService) {}

   loginUser: RequestHandler = async(req,res) => {
        const { existUser: user,token } = await this.authService.login(req.validData);
        const data = AuthPresenter.toLoginResponse(user,token);
       sendSuccessResponse(res,data);
   }

   signupUser: RequestHandler = async(req,res) => {
      
       const { otp } = await this.authService.signup(req.validData);
       const data = AuthPresenter.toOtpResponse(otp,"Please check the email for verification");
       sendSuccessResponse(res,data,201);
   }

   verifyAccount: RequestHandler = async(req,res) => {
      
       await this.authService.verifyAccount(req.validData);
       const data = AuthPresenter.toMessageResponse("Account verified successfully, please login");
       sendSuccessResponse(res,data);
   }

    logout: RequestHandler = async(req,res) => {
        await this.authService.logout(req.user);
        const data = AuthPresenter.toMessageResponse("Logout successfully");
        sendSuccessResponse(res,data);
    }

    logoutAll: RequestHandler = async(req,res) => {
        await this.authService.logoutAll(req.user);
        const data = AuthPresenter.toMessageResponse("Logout all devices successfully");
        sendSuccessResponse(res,data);
    }

    getMe: RequestHandler = async(req,res) => {
        const user = await this.authService.getMe(req.user);
        const data = AuthPresenter.toUserResponse(user);
        sendSuccessResponse(res,data);
     }

    forgotPassword: RequestHandler = async(req,res) => {
        const { otp } = await this.authService.forgotPassword(req.validData);
        const data = AuthPresenter.toOtpResponse(otp,"Please check your email for OTP");
        sendSuccessResponse(res,data);
    }
    
    resetPassword: RequestHandler = async(req,res) => {
        await this.authService.resetPassword(req.validData);
        const data = AuthPresenter.toMessageResponse("Password reset successfully, please login");
        sendSuccessResponse(res,data);
    }

}