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
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

/**
 * Clears the authentication cookies on logout.
 */
export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}
