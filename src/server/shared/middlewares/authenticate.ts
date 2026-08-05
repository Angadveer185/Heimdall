import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/lib/jwt";
import { ApiError } from "@/lib/errors";
import { JwtPayload } from "@/lib/auth.constants";

// Extend Express Request interface to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check both cookie and Authorization header fallback
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized access: Token missing");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized access: Invalid token"));
  }
}
