export type Role = 'DONOR' | 'SHELTER_ADMIN' | 'SUPER_ADMIN';

export interface JwtPayload {
  id: string;
  role: Role;
}

// Explicitly type duration options or cast them to string | number
export const JWT_ACCESS_EXPIRY = "60d";
export const JWT_REFRESH_EXPIRY = "60d";