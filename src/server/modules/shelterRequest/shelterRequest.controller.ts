import { Request, Response, NextFunction } from "express";
import { ShelterRequestService } from "./shelterRequest.service";
import {
  getShelterRequestSchema,
  createShelterRequestSchema,
  updateShelterRequestSchema,
  deleteShelterRequestSchema,
} from "./shelterRequest.validation";
import { ApiError } from "@/lib/errors";

export class ShelterRequestController {
  private shelterRequestService: ShelterRequestService;

  constructor(shelterRequestService: ShelterRequestService) {
    this.shelterRequestService = shelterRequestService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = createShelterRequestSchema.parse(req.body);
      const request = await this.shelterRequestService.createRequest(
        validatedData,
        req.user.id,
        req.user.role
      );
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getShelterRequestSchema.parse({ id: req.params.id });
      const request = await this.shelterRequestService.getRequestById(validatedData.id);
      res.status(200).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await this.shelterRequestService.getAllRequests();
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const { id } = getShelterRequestSchema.parse({ id: req.params.id });
      const validatedData = updateShelterRequestSchema.parse(req.body);

      const updated = await this.shelterRequestService.updateRequestById(
        id,
        validatedData,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = deleteShelterRequestSchema.parse({ id: req.params.id });
      const deleted = await this.shelterRequestService.deleteRequestById(
        validatedData.id,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      next(error);
    }
  }

  async purgeAll(req: Request, res: Response, next: NextFunction) {
    try {
      await this.shelterRequestService.purgeAllRequests();
      res.status(200).json({ success: true, message: "All shelter requests have been purged" });
    } catch (error) {
      next(error);
    }
  }
}
