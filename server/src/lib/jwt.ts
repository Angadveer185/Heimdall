import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY } from "./auth.constants";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * Generates a short-lived Access Token (e.g., 15 minutes)
 */
export function generateAccessToken(payload: JwtPayload): string {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables",
    );
  }

  // Cast payload as object to satisfy jsonwebtoken overloads
  return jwt.sign({ ...payload }, ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  });
}

/**
 * Generates a long-lived Refresh Token (e.g., 7 days)
 */
export function generateRefreshToken(payload: JwtPayload): string {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in environment variables",
    );
  }

  return jwt.sign({ ...payload }, REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });
}

/**
 * Verifies an Access Token and returns the decoded payload.
 */
export function verifyAccessToken(token: string): JwtPayload {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables",
    );
  }
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as JwtPayload;
}

/**
 * Verifies a Refresh Token and returns the decoded payload.
 */
export function verifyRefreshToken(token: string): JwtPayload {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in environment variables",
    );
  }
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as unknown as JwtPayload;
}