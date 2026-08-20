import { Request, Response, NextFunction } from "express";
import { registerSchema, registerSuperAdminSchema, loginSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import { verifyRefreshToken } from "@/lib/jwt";
import { ApiError } from "@/lib/errors";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookies";
import { getGoogleAuthUrl, verifyGoogleCode } from "@/lib/google-oauth";


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
      const validatedData = registerSuperAdminSchema.parse(req.body);
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

  async initiateGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const intent = (req.query.intent as string) || "login";
      const inviteToken = (req.query.inviteToken as string) || "";

      // Encode flow state in URL-safe base64 or JSON state param
      const stateParam = Buffer.from(JSON.stringify({ intent, inviteToken })).toString("base64");
      const googleUrl = getGoogleAuthUrl(stateParam);

      res.redirect(googleUrl);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Callback handling code exchange and HTTP-only cookie assignment
   */
  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query;

      if (!code || typeof code !== "string") {
        throw new ApiError(400, "Authorization code missing from Google callback");
      }

      // Parse state
      let intent = "login";
      let inviteToken = "";
      if (state && typeof state === "string") {
        try {
          const parsed = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
          intent = parsed.intent;
          inviteToken = parsed.inviteToken;
        } catch {
          // Fallback if state parsing fails
        }
      }

      // Verify Google authorization code & retrieve profile
      const googleProfile = await verifyGoogleCode(code);

      // Authenticate or register in Heimdall auth service
      const result = await this.authService.handleGoogleAuth({
        ...googleProfile,
        intent: intent as any,
        inviteToken,
      });

      // Set httpOnly, Secure, SameSite=Strict cookies (Rule #3)
      setAuthCookies(res, result.accessToken, result.refreshToken);

      // Redirect client based on user role
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const redirectPath = result.user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/profile";

      res.redirect(`${clientUrl}${redirectPath}`);
    } catch (error) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const errorMessage = encodeURIComponent(error instanceof Error ? error.message : "Google authentication failed");
      res.redirect(`${clientUrl}/login?error=${errorMessage}`);
    }
  }
}
