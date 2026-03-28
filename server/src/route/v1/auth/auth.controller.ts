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
      
       await this.authService.signup(req.validData);
       const data = {
          message: "Please check the email for verification"
       }
       res.status(201).json(responseEnvelope({
           state: 'success',
           data
       }))
   }
}