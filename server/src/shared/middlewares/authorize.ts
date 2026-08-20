import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "@/lib/errors";

// Role hierarchy mapping: key role inherits all roles in the value array
const ROLE_HIERARCHY: Record<Role, Role[]> = {
  SUPER_ADMIN: [Role.SUPER_ADMIN, Role.SHELTER_ADMIN, Role.DONOR],
  SHELTER_ADMIN: [Role.SHELTER_ADMIN, Role.DONOR],
  DONOR: [Role.DONOR],
};

/**
 * Middleware to authorize requests based on user roles (supporting role hierarchy)
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const userInheritedRoles = ROLE_HIERARCHY[req.user.role] || [];
    const hasPermission = allowedRoles.some((role) => userInheritedRoles.includes(role));

    if (!hasPermission) {
      return next(new ApiError(403, "Forbidden access: Insufficient permissions"));
    }

    next();
  };
}

