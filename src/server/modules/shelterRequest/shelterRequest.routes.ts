import { Router } from "express";
import { ShelterRequestController } from "./shelterRequest.controller";
import { ShelterRequestService } from "./shelterRequest.service";
import { ShelterRequestRepository } from "./shelterRequest.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const shelterRequestRouter = Router();
const controller = new ShelterRequestController(
  new ShelterRequestService(new ShelterRequestRepository()),
);

// Shelter Request Routes
shelterRequestRouter.post("/", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.create(req, res, next)
);

shelterRequestRouter.get("/", (req, res, next) =>
  controller.getAll(req, res, next),
);

shelterRequestRouter.get("/:id", (req, res, next) =>
  controller.getById(req, res, next),
);

shelterRequestRouter.patch("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.updateById(req, res, next)
);

shelterRequestRouter.delete("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.deleteById(req, res, next)
);

// Only for development/testing purposes
shelterRequestRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAll(req, res, next)
);

export { shelterRequestRouter };
