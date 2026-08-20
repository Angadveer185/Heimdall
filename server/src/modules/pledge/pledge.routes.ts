import { Router } from "express";
import { PledgeController } from "./pledge.controller";
import { PledgeService } from "./pledge.service";
import { PledgeRepository } from "./pledge.repository";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import { Role } from "@prisma/client";

const pledgeRouter = Router();
const controller = new PledgeController(
  new PledgeService(new PledgeRepository())
);

// Create a new pledge
pledgeRouter.post("/", authenticate, authorize(Role.DONOR), (req, res, next) =>
  controller.create(req, res, next)
);

// View user's own pledges
pledgeRouter.get("/my", authenticate, authorize(Role.DONOR), (req, res, next) =>
  controller.getMyPledges(req, res, next)
);

// View shelter-specific pledges
pledgeRouter.get("/shelter/:shelterId", authenticate, authorize(Role.SHELTER_ADMIN), (req, res, next) =>
  controller.getShelterPledges(req, res, next)
);

// Verify and fulfill drop-off via QR code or manual input
pledgeRouter.post("/verify", authenticate, authorize(Role.SHELTER_ADMIN), (req, res, next) =>
  controller.verifyDropOff(req, res, next)
);

// Cancel a pledge
pledgeRouter.post("/:id/cancel", authenticate, authorize(Role.DONOR), (req, res, next) =>
  controller.cancel(req, res, next)
);

// Get pledge details by ID
pledgeRouter.get("/:id", authenticate, authorize(Role.DONOR), (req, res, next) =>
  controller.getById(req, res, next)
);

// Get pledge details by code
pledgeRouter.get("/code/:code", authenticate, authorize(Role.DONOR), (req, res, next) =>
  controller.getByCode(req, res, next)
);

// Trigger check and expiration of expired reservations
pledgeRouter.post("/trigger-expiry", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.triggerExpiry(req, res, next)
);

// Purge all pledges (mainly for development/testing environments)
pledgeRouter.delete("/", authenticate, authorize(Role.SUPER_ADMIN), (req, res, next) =>
  controller.purgeAll(req, res, next)
);

export { pledgeRouter };
