import { Request, Response, NextFunction } from "express";
import { ItemService } from "./globalItem.service";
import {
  getItemSchema,
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from "./globalItem.validation";

export class ItemController {
  private itemService: ItemService;

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createItemSchema.parse(req.body);
      const item = await this.itemService.createItem(validatedData);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getItemSchema.parse({ id: req.params.id });
      const item = await this.itemService.getItemById(validatedData.id);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async getAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.itemService.getAllItems();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = getItemSchema.parse({ id: req.params.id });
      const validatedData = updateItemSchema.parse(req.body);

      const updatedItem = await this.itemService.updateItemById(
        id,
        validatedData,
      );
      res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = deleteItemSchema.parse({ id: req.params.id });
      const deletedItem = await this.itemService.deleteItemById(validatedData.id);
      res.status(200).json({ success: true, data: deletedItem });
    } catch (error) {
      next(error);
    }
  }

  async purgeAllItems(req: Request, res: Response, next: NextFunction) {
    try {
      await this.itemService.purgeAllItems();
      res.status(200).json({ success: true, message: "All items have been purged" });
    } catch (error) {
      next(error);
    }
  }
}
