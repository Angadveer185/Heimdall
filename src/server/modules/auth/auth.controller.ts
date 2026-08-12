import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import { verifyRefreshToken } from "@/lib/jwt";
import { ApiError } from "@/lib/errors";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookies";

/**
 * Controller to handle Authentication-related requests
 * Migrated from Next.js endpoints to standard Express request/response format.
 */
export class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);

      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(201).json({ success: true, data: result.user });
    } catch (error) {
      next(error);
    }
  }

  async registerSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.registerSuperAdmin(validatedData);

      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(201).json({ success: true, data: result.user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in an existing user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);

      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log out the current user, clearing cookies and database hash
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await this.authService.logout(req.user.id);
      }
      clearAuthCookies(res);
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh the access and refresh token pair
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "Refresh token is missing");
      }

      const decoded = verifyRefreshToken(refreshToken);
      const result = await this.authService.refreshTokens(decoded.id, refreshToken);

      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json({ success: true, message: "Tokens refreshed successfully" });
    } catch (error) {
      next(error);
    }
  }
}
