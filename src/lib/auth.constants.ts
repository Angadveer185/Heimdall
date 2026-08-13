import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  role: Role;
}

// Explicitly type duration options or cast them to string | number
export const JWT_ACCESS_EXPIRY = "15m";
export const JWT_REFRESH_EXPIRY = "30d";