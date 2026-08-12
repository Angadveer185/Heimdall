import { Request, Response, NextFunction } from "express";
import { RequestedItemService } from "./requestedItem.service";
import {
  getRequestedItemSchema,
  createRequestedItemSchema,
  updateRequestedItemSchema,
  deleteRequestedItemSchema,
} from "./requestedItem.validation";
import { ApiError } from "@/lib/errors";

export class RequestedItemController {
  private requestedItemService: RequestedItemService;

  constructor(requestedItemService: RequestedItemService) {
    this.requestedItemService = requestedItemService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = createRequestedItemSchema.parse(req.body);
      const item = await this.requestedItemService.createRequestedItem(
        validatedData,
        req.user.id,
        req.user.role
      );
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getRequestedItemSchema.parse({ id: req.params.id });
      const item = await this.requestedItemService.getRequestedItemById(validatedData.id);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.requestedItemService.getAllRequestedItems();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const { id } = getRequestedItemSchema.parse({ id: req.params.id });
      const validatedData = updateRequestedItemSchema.parse(req.body);

      const updatedItem = await this.requestedItemService.updateRequestedItemById(
        id,
        validatedData,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = deleteRequestedItemSchema.parse({ id: req.params.id });
      const deletedItem = await this.requestedItemService.deleteRequestedItemById(
        validatedData.id,
        req.user.id,
        req.user.role
      );
      res.status(200).json({ success: true, data: deletedItem });
    } catch (error) {
      next(error);
    }
  }

  async purgeAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      await this.requestedItemService.purgeAllRequestedItems();
      res.status(200).json({ success: true, message: "All requested items have been purged" });
    } catch (error) {
      next(error);
    }
  }
}
