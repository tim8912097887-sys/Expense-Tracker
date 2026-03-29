import { decodeJwt } from 'jose';
import { UnauthorizedError } from "@/customs/error/httpErrors.js";
import { versionVerify } from "@/utils/token.js";
import { authLogger } from "@/configs/logger/index.js";
import { RequestHandler } from "express";
import { redisInstance } from '@/configs/redis.js';
import { UserModel } from '@/route/v1/users/users.model.js';

type Current_Verion = 'v1';


export const tokenVerify: RequestHandler = async(req,_res,next) => {
      try {
          const bearerToken = req.get("Authorization");
        if(!bearerToken || !bearerToken.split(" ")[1]) {
          authLogger.warn(`Token Verify: Not Provide token`);
          throw new UnauthorizedError("Unauthenticated");
        } 
        const token = bearerToken.split(" ")[1];
        const unVerified = decodeJwt(token);
        const isBlacklisted = await redisInstance.get(`blacklist:${unVerified.jti}:${unVerified.sub}`);
        if(isBlacklisted) {
          authLogger.warn(`Token Verify: ${token} is blacklisted`);
          throw new UnauthorizedError("Invalid or Expired token");
        }
        const version = unVerified?.v?`v${unVerified?.v}`:'v1';
        const hasVersion = version in versionVerify;
        if(!hasVersion) {
          authLogger.warn(`Token Verify: ${token} with invalid verion: ${version}`);
          throw new UnauthorizedError("Invalid or Expired token");
        } 
        const decode = await versionVerify[version as Current_Verion](token);
        if(!decode) {
          authLogger.warn(`Token Verify: Invalid or Expired token: ${token}`);
          throw new UnauthorizedError("Invalid or Expired token");
        }
        const user = await UserModel.findById(decode.sub);
        if(!user) {
          authLogger.warn(`Token Verify: User not found for token: ${token}`);
          throw new UnauthorizedError("Invalid or Expired token");
        }
        if(user.tokenVersion !== decode.token_version) {
          authLogger.warn(`Token Verify: Token version mismatch for token: ${token}`);
          throw new UnauthorizedError("Invalid or Expired token");
        }
        req.user = decode;
        return next(); 
      } catch (error: any) {
        if(!error.isOperational) authLogger.error(`Token Verify: Error occurred while verifying token, Error: ${error}`);
        throw new UnauthorizedError("Unauthenticated");

      }
}