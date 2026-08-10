import { Request, Response, NextFunction } from "express";
import {
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
} from "./user.validation";
import { UserService } from "./user.service";

const service = new UserService();

/**
 * Controller to handle User-related requests
 * Migrated from Next.js endpoints to standard Express request/response format.
 */
export class UserController {
  /**
   * Get a user by ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getUserSchema.parse({ id: req.params.id });
      const user = await service.getUserById(validatedData.id);

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await service.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a user by ID
   */
  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = updateUserSchema.parse({
        id: req.params.id,
        ...req.body,
      });
      const { id, ...updateFields } = validatedData;

      const user = await service.updateUserById(id, updateFields);

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a user by ID
   */
  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = deleteUserSchema.parse({ id: req.params.id });
      await service.deleteUserById(validatedData.id);

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async purgeAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      await service.purgeAllUsers();
      res
        .status(200)
        .json({ success: true, message: "All users purged successfully" });
    } catch (error) {
      next(error);
    }
  }
}
