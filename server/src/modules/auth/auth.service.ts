import { ApiError } from "@/lib/errors";
import { UserRepository } from "../user/user.repository";
import { RegisterData, LoginData } from "./auth.validation";
import { hashPassword, comparePassword } from "@/lib/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export interface GoogleAuthParams {
  googleId: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  intent?: "login" | "register_donor" | "register_super_admin";
  inviteToken?: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(data: RegisterData) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const { password, ...userData } = data;

    const user = await this.userRepository.create({
      ...userData,
      passwordHash,
    });

    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);

    // Update the user with the refresh token
    await this.userRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async registerSuperAdmin(data: RegisterData) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const { password, ...userData } = data;

    const user = await this.userRepository.create({
      ...userData,
      passwordHash,
      role: "SUPER_ADMIN",
    });

    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);

    // Update the user with the refresh token
    await this.userRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginData) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (!existingUser) {
      throw new ApiError(401, "User doesn't exist");
    }

    if(existingUser.googleId && existingUser.passwordHash === null) {
      throw new ApiError(401, "This account is linked with Google. Please log in using Google.");
    }

    const isMatch = await comparePassword(
      data.password,
      existingUser.passwordHash ? existingUser.passwordHash : "",
    );
    if (!isMatch) {
      throw new ApiError(401, "Invalid password. Try again.");
    }

    const payload = { id: existingUser.id, role: existingUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);

    // Update the user with the refresh token
    await this.userRepository.updateRefreshTokenHash(
      existingUser.id,
      refreshTokenHash,
    );

    const { passwordHash, refreshTokenHash: _, ...sanitizedUser } = existingUser;

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    // Remove the refresh token hash from the user
    await this.userRepository.updateRefreshTokenHash(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new ApiError(401, "User not found");
    }

    const refreshTokenHash = await this.userRepository.findRefreshTokenHashById(userId);
    if (!refreshTokenHash) {
      throw new ApiError(401, "Refresh token is missing");
    }

    const isMatch = await comparePassword(
      refreshToken,
      refreshTokenHash,
    );
    if (!isMatch) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const payload = { id: existingUser.id, role: existingUser.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const newRefreshTokenHash = await hashPassword(newRefreshToken);

    // Update the user with the new refresh token
    await this.userRepository.updateRefreshTokenHash(
      existingUser.id,
      newRefreshTokenHash,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async handleGoogleAuth(data: GoogleAuthParams) {
    const { googleId, email, name, profileImageUrl, intent, inviteToken } = data;

    // 1. Look up existing user by googleId first, then by email via UserRepository
    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(email);
    }

    if (!user) {
      // 2. User does NOT exist -> Determine Role
      let roleToAssign: "DONOR" | "SUPER_ADMIN" = "DONOR";

      if (intent === "register_super_admin") {
        const validSecret = process.env.SUPER_ADMIN_INVITE_SECRET;
        if (!inviteToken || inviteToken !== validSecret) {
          throw new ApiError(403, "Invalid or missing Super Admin invite token.");
        }
        roleToAssign = "SUPER_ADMIN";
      }

      // Create new user record via UserRepository
      user = await this.userRepository.create({
        name,
        email,
        googleId,
        profileImageUrl,
        role: roleToAssign,
      });
    } else {
      // 3. User exists -> Ensure googleId is linked via UserRepository
      if (!user.googleId) {
        user = await this.userRepository.updateById(user.id, { googleId });
      }

      // If user requested super admin registration but is already registered under another role
      if (intent === "register_super_admin" && user.role !== "SUPER_ADMIN") {
        const validSecret = process.env.SUPER_ADMIN_INVITE_SECRET;
        if (inviteToken && inviteToken === validSecret) {
          user = await this.userRepository.updateById(user.id, { role: "SUPER_ADMIN" });
        }
      }
    }

    if (!user) {
      throw new ApiError(500, "Failed to resolve or create user account");
    }

    // 4. Generate Heimdall Tokens & set refresh hash via UserRepository
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);
    await this.userRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    const { passwordHash: _, refreshTokenHash: __, ...sanitizedUser } = user;

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }
}
