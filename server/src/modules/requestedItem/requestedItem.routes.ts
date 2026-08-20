import { Router } from "express";
import { RequestedItemController } from "./requestedItem.controller";
import { RequestedItemService } from "./requestedItem.service";
import { RequestedItemRepository } from "./requestedItem.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const requestedItemRouter = Router();
const controller = new RequestedItemController(
  new RequestedItemService(new RequestedItemRepository()),
);

// RequestedItem Routes
requestedItemRouter.post("/", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.create(req, res, next)
);

requestedItemRouter.get("/", (req, res, next) =>
  controller.getAllItems(req, res, next),
);

requestedItemRouter.get("/:id", (req, res, next) =>
  controller.getById(req, res, next),
);

requestedItemRouter.patch("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.updateById(req, res, next)
);

requestedItemRouter.delete("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.deleteById(req, res, next)
);

// Only for development/testing purposes, delete purge logic before deploying to production
requestedItemRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAllItems(req, res, next)
);

export { requestedItemRouter };
