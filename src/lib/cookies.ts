import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Sets secure HTTP-only cookies for access and refresh tokens.
 * Transmitted strictly via httpOnly, Secure (in production), SameSite=Strict cookies.
 */
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: SIXTY_DAYS_MS,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: SIXTY_DAYS_MS,
  });
}

/**
 * Clears the authentication cookies on logout.
 */
export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}
