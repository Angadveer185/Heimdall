import { Router } from "express";
import { ItemController } from "./globalItem.controller";
import { ItemService } from "./globalItem.service";
import { ItemRepository } from "./globalItem.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const globalItemRouter = Router();
const controller = new ItemController(
  new ItemService(new ItemRepository()),
);

// GlobalItem Routes
globalItemRouter.post("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.create(req, res, next)
);

globalItemRouter.get("/", (req, res, next) =>
  controller.getAllItems(req, res, next),
);

globalItemRouter.get("/:id", (req, res, next) =>
  controller.getById(req, res, next),
);

globalItemRouter.patch("/:id", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.updateById(req, res, next)
);

globalItemRouter.delete("/:id", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.deleteById(req, res, next)
);

// Only for development/testing purposes, delete purge logic before deploying to production
globalItemRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAllItems(req, res, next)
);

export { globalItemRouter };
