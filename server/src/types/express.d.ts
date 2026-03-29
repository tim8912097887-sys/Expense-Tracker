import { CreateUserType } from "@routes/v1/auth/schemas/signup.js";
import { LoginUserType } from "@routes/v1/auth/schemas/login.js";
import { AuthPayload } from "./index.js";

declare global {
  namespace Express {
    interface Request {
        validData: CreateUserType | LoginUserType
        user: AuthPayload
    }
  }
}