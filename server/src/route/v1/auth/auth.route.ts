// Third party
import express from "express";
// Services
import AuthController from "./auth.controller.js";
// Middleware
import { schemaValidator } from "@/middlewares/schemaValidator.js";
import { LoginUserSchema } from "./schema/login.js";
import { CreateUserSchema } from "./schema/signup.js";
import AuthRepository from "./auth.repository.js";
import { UserModel } from "../users/users.model.js";
import AuthService from "./auth.service.js";
import { AuthModel } from "./auth.model.js";

// Initialize Instance
const authRepository = new AuthRepository(UserModel,AuthModel);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRouter = express.Router();

authRouter.post("/login",schemaValidator(LoginUserSchema),authController.loginUser);
authRouter.post("/signup",schemaValidator(CreateUserSchema),authController.signupUser);
