import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "@/lib/errors";

/**
 * Middleware to authorize requests based on user roles
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden access: Insufficient permissions"));
    }

    next();
  };
}
