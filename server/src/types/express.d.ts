import { CreateUserType } from "@routes/v1/auth/schemas/signup.js";
import { LoginUserType } from "@routes/v1/auth/schemas/login.js";
import { JwtPayload } from "jsonwebtoken"

interface AuthPayload extends JwtPayload {
    sub: string
    v: number
    token_version: number
    role: "doctor" | "user" | "admin"
}

declare global {
  namespace Express {
    interface Request {
        validData: CreateUserType | LoginUserType
        user: AuthPayload
    }
  }
}