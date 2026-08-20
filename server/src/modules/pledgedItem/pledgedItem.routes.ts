import { Router } from "express";
import { PledgedItemController } from "./pledgedItem.controller";
import { PledgedItemService } from "./pledgedItem.service";
import { PledgedItemRepository } from "./pledgedItem.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const pledgedItemRouter = Router();
const controller = new PledgedItemController(
    new PledgedItemService(new PledgedItemRepository())
);

// Create a pledged item (restricted to DONOR)
pledgedItemRouter.post("/", authenticate, authorize(Role.DONOR), (req, res, next) =>
    controller.create(req, res, next)
);

// Get all pledged items (restricted to SUPER_ADMIN)
pledgedItemRouter.get("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
    controller.getAll(req, res, next)
);

// Get pledged item by ID (accessible by DONOR, which inherits to SHELTER_ADMIN and SUPER_ADMIN)
pledgedItemRouter.get("/:id", authenticate, authorize(Role.DONOR), (req, res, next) =>
    controller.getById(req, res, next)
);

// Update pledged item by ID (restricted to DONOR)
pledgedItemRouter.patch("/:id", authenticate, authorize(Role.DONOR), (req, res, next) =>
    controller.updateById(req, res, next)
);

// Delete pledged item by ID (restricted to DONOR)
pledgedItemRouter.delete("/:id", authenticate, authorize(Role.DONOR), (req, res, next) =>
    controller.deleteById(req, res, next)
);

// Purge all pledged items (restricted to SUPER_ADMIN)
pledgedItemRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
    controller.purgeAll(req, res, next)
);

export { pledgedItemRouter };
