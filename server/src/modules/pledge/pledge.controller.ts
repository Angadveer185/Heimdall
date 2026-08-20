import { Request, Response, NextFunction } from "express";
import { PledgeService } from "./pledge.service";
import {
  createPledgeSchema,
  getPledgeSchema,
  getPledgeByCodeSchema,
  verifyPledgeSchema,
} from "./pledge.validation";
import { ApiError } from "@/lib/errors";

export class PledgeController {
  private pledgeService: PledgeService;

  constructor(pledgeService: PledgeService) {
    this.pledgeService = pledgeService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const validatedData = createPledgeSchema.parse(req.body);
      const pledge = await this.pledgeService.createPledge(validatedData, req.user.id);
      res.status(201).json({ success: true, data: pledge });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const { id } = getPledgeSchema.parse({ id: req.params.id });
      const pledge = await this.pledgeService.getPledgeById(id, req.user.id, req.user.role);
      res.status(200).json({ success: true, data: pledge });
    } catch (error) {
      next(error);
    }
  }

  async getByCode(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const { code } = getPledgeByCodeSchema.parse({ code: req.params.code });
      const pledge = await this.pledgeService.getPledgeByCode(code, req.user.id, req.user.role);
      res.status(200).json({ success: true, data: pledge });
    } catch (error) {
      next(error);
    }
  }

  async getMyPledges(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const pledges = await this.pledgeService.getMyPledges(req.user.id);
      res.status(200).json({ success: true, data: pledges });
    } catch (error) {
      next(error);
    }
  }

  async getShelterPledges(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const { shelterId } = req.params as { shelterId: string };
      if (!shelterId || !/^[0-9a-fA-F]{24}$/.test(shelterId)) {
        throw new ApiError(400, "Invalid shelter ID format");
      }
      const pledges = await this.pledgeService.getShelterPledges(
        shelterId,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: pledges });
    } catch (error) {
      next(error);
    }
  }

  async verifyDropOff(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const { pledgeCode, impactPhotoUrl, shelterThankYouNote } = verifyPledgeSchema.parse(req.body);
      const updatedPledge = await this.pledgeService.verifyAndFulfillPledge(
        pledgeCode,
        req.user.id,
        req.user.role,
        { impactPhotoUrl, shelterThankYouNote }
      );
      res.status(200).json({ success: true, data: updatedPledge });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
      }
      const { id } = getPledgeSchema.parse({ id: req.params.id });
      const cancelledPledge = await this.pledgeService.cancelPledge(
        id,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: cancelledPledge });
    } catch (error) {
      next(error);
    }
  }

  async triggerExpiry(req: Request, res: Response, next: NextFunction) {
    try {
      const expired = await this.pledgeService.expireExpiredPledges();
      res.status(200).json({ success: true, message: `Processed ${expired.length} expired pledges`, data: expired });
    } catch (error) {
      next(error);
    }
  }

  async purgeAll(req: Request, res: Response, next: NextFunction) {
    try {
      await this.pledgeService.purgeAllPledges();
      res.status(200).json({ success: true, message: "All pledges have been purged" });
    } catch (error) {
      next(error);
    }
  }
}
