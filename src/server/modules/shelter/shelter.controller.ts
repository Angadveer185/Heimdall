import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/lib/errors";
import { ShelterService } from "./shelter.service";
import {
  getShelterSchema,
  getShelterByOrganizationIdSchema,
  createShelterSchema,
  updateShelterSchema,
  deleteShelterSchema,
} from "./shelter.validation";

export class ShelterController {
  private shelterService: ShelterService;
  constructor(shelterService: ShelterService) {
    this.shelterService = shelterService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = createShelterSchema.parse(req.body);
      const shelter = await this.shelterService.createShelter(validatedData, req.user.id);
      res.status(201).json({ success: true, data: shelter });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getShelterSchema.parse({ id: req.params.id });
      const shelter = await this.shelterService.getShelterById(
        validatedData.id,
      );

      res.status(200).json({ success: true, data: shelter });
    } catch (error) {
      next(error);
    }
  }

  async getByOrganizationId(req: Request, res: Response, next: NextFunction) {
    try {
      let orgId = req.params.organizationId || req.params[0];
      if (Array.isArray(orgId)) {
        orgId = orgId.join("/");
      }
      const validatedData = getShelterByOrganizationIdSchema.parse({
        organizationId: orgId,
      });
      const shelter = await this.shelterService.getShelterByOrganizationId(
        validatedData.organizationId,
      );
      res.status(200).json({ success: true, data: shelter });
    } catch (error) {
      next(error);
    }
  }

  async getAllShelters(req: Request, res: Response, next: NextFunction) {
    try {
      const shelters = await this.shelterService.getAllShelters();
      res.status(200).json({ success: true, data: shelters });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateShelterSchema.parse({
        id: req.params.id,
        ...req.body,
      });
      const { id, ...updateFields } = validatedData;
      const shelter = await this.shelterService.updateShelterById(
        id,
        updateFields,
      );
      res.status(200).json({ success: true, data: shelter });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = deleteShelterSchema.parse({ id: req.params.id });
      await this.shelterService.deleteShelterById(validatedData.id);
      res
        .status(200)
        .json({ success: true, message: "Shelter deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async purgeAllShelters(req: Request, res: Response, next: NextFunction) {
    try {
      await this.shelterService.purgeAllShelters();
      res
        .status(200)
        .json({ success: true, message: "All shelters purged successfully" });
    } catch (error) {
      next(error);
    }
  }
}
