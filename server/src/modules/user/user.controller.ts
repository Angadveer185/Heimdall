import { Request, Response, NextFunction } from "express";
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
} from "./user.validation";
import { UserService } from "./user.service";
import { ApiError } from "@/lib/errors";

const service = new UserService();

/**
 * Controller to handle User-related requests
 * Migrated from Next.js endpoints to standard Express request/response format.
 */
export class UserController {
  /**
   * Get currently authenticated user's profile
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const user = await service.getUserById(req.user.id, req.user.id, req.user.role);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update currently authenticated user's profile
   */
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const user = await service.updateUserById(req.user.id, req.body, req.user.id, req.user.role);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a user by ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = getUserSchema.parse({ id: req.params.id });
      const user = await service.getUserById(validatedData.id, req.user.id, req.user.role);

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a user's public profile by ID
   */
  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getUserSchema.parse({ id: req.params.id });
      const user = await service.getPublicProfileById(validatedData.id);

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
   * Create a new user (Admin action)
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await service.createUser(validatedData);

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a user by ID
   */
  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = updateUserSchema.parse({
        id: req.params.id,
        ...req.body,
      });
      const { id, ...updateFields } = validatedData;

      const user = await service.updateUserById(id, updateFields, req.user.id, req.user.role);

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
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }
      const validatedData = deleteUserSchema.parse({ id: req.params.id });
      await service.deleteUserById(validatedData.id, req.user.id, req.user.role);

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
