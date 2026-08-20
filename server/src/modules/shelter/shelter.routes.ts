import { Router } from "express";
import { ShelterController } from "./shelter.controller";
import { ShelterService } from "./shelter.service";
import { ShelterRepository } from "./shelter.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const shelterRouter = Router();
const controller = new ShelterController(
  new ShelterService(new ShelterRepository()),
);

// Shelter Routes
shelterRouter.post("/", authenticate, (req, res, next) => controller.create(req, res, next));
shelterRouter.get("/", (req, res, next) =>
  controller.getAllShelters(req, res, next),
);
shelterRouter.get("/:id", (req, res, next) =>
  controller.getById(req, res, next),
);
shelterRouter.get("/organization/*organizationId", (req, res, next) =>
  controller.getByOrganizationId(req, res, next),
);
shelterRouter.patch("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.updateById(req, res, next),
);
shelterRouter.delete("/:id", authenticate, authorize(Role.SHELTER_ADMIN, Role.SUPER_ADMIN), (req, res, next) =>
  controller.deleteById(req, res, next),
);

// Only for development/testing purposes, delete purge logic before deploying to production
shelterRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAllShelters(req, res, next),
);

export { shelterRouter };
