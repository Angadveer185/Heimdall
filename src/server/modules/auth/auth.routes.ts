import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";
import { authenticate } from "../../shared/middlewares/authenticate";

const authRouter = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const controller = new AuthController(authService);

// Public Routes
authRouter.post("/register", (req, res, next) => controller.register(req, res, next));
authRouter.post("/register-super-admin", (req, res, next) => controller.registerSuperAdmin(req, res, next));
authRouter.post("/login", (req, res, next) => controller.login(req, res, next));
authRouter.post("/refresh", (req, res, next) => controller.refresh(req, res, next));

// Protected Routes
authRouter.post("/logout", authenticate, (req, res, next) => controller.logout(req, res, next));

export { authRouter };
