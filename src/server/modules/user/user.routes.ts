import { Router } from "express";
import { UserController } from "./user.controller";

const userRouter = Router();
const controller = new UserController();

// User Routes
userRouter.get("/", (req, res, next) => controller.getAllUsers(req, res, next));
userRouter.get("/:id", (req, res, next) => controller.getById(req, res, next));
userRouter.patch("/:id", (req, res, next) => controller.updateById(req, res, next));
userRouter.delete("/:id", (req, res, next) => controller.deleteById(req, res, next));
// Only for development/testing purposes, delete purge logic before deploying to production
userRouter.delete("/", (req, res, next) => controller.purgeAllUsers(req, res, next));

export { userRouter };
