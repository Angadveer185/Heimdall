import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const categoryRouter = Router();
const controller = new CategoryController(
  new CategoryService(new CategoryRepository()),
);

// Category Routes
categoryRouter.post("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.create(req, res, next)
);

categoryRouter.get("/", (req, res, next) =>
  controller.getAllCategories(req, res, next),
);

categoryRouter.get("/:id", (req, res, next) =>
  controller.getById(req, res, next),
);

categoryRouter.get("/name/:name", (req, res, next) =>
  controller.getByName(req, res, next),
);

categoryRouter.patch("/:id", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.updateById(req, res, next)
);

categoryRouter.delete("/:id", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.deleteById(req, res, next)
);

// Only for development/testing purposes, delete purge logic before deploying to production
categoryRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAllCategories(req, res, next)
);

export { categoryRouter };