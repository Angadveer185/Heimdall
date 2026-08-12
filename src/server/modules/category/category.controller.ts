import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import {
  getCategorySchema,
  getCategoryByNameSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./category.validation";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await this.categoryService.createCategory(validatedData);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getCategorySchema.parse({ id: req.params.id });
      const category = await this.categoryService.getCategoryById(
        validatedData.id,
      );
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getCategoryByNameSchema.parse({
        name: req.params.name,
      });
      const category = await this.categoryService.getCategoryByName(
        validatedData.name,
      );
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateCategorySchema.parse({
        ...req.body,
        id: req.params.id,
      });
      const { id, ...updateData } = validatedData;
      const updatedCategory = await this.categoryService.updateCategoryById(
        id,
        updateData,
      );
      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = deleteCategorySchema.parse({ id: req.params.id });
      const deletedCategory = await this.categoryService.deleteCategoryById(
        validatedData.id,
      );
      res.status(200).json({ success: true, data: deletedCategory });
    } catch (error) {
      next(error);
    }
  }

  async purgeAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryService.purgeAllCategories();
      res
        .status(200)
        .json({ success: true, message: "All categories have been purged" });
    } catch (error) {
      next(error);
    }
  }
}
