import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const userRouter = Router();
const controller = new UserController();

// User Routes
userRouter.get("/me", authenticate, (req, res, next) => controller.getMe(req, res, next));
userRouter.patch("/me", authenticate, (req, res, next) => controller.updateMe(req, res, next));

userRouter.get("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) => controller.getAllUsers(req, res, next));
userRouter.post("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) => controller.createUser(req, res, next));
userRouter.get("/:id/public", authenticate, authorize(Role.DONOR), (req, res, next) => controller.getPublicProfile(req, res, next));
userRouter.get("/:id", authenticate, authorize(Role.DONOR), (req, res, next) => controller.getById(req, res, next));
userRouter.patch("/:id", authenticate, authorize(Role.DONOR), (req, res, next) => controller.updateById(req, res, next));
userRouter.delete("/:id", authenticate, authorize(Role.DONOR), (req, res, next) => controller.deleteById(req, res, next));
// Only for development/testing purposes, delete purge logic before deploying to production
userRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) => controller.purgeAllUsers(req, res, next));

export { userRouter };

