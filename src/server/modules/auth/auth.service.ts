import { ApiError } from "@/lib/errors";
import { UserRepository } from "../user/user.repository";
import { RegisterData, LoginData } from "@/lib/validations/auth.validation";
import { hashPassword, comparePassword } from "@/lib/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

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

  async login(data: LoginData) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (!existingUser) {
      throw new ApiError(401, "User doesn't exist");
    }

    const isMatch = await comparePassword(
      data.password,
      existingUser.passwordHash,
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
    if (!existingUser || !existingUser.refreshTokenHash) {
      throw new ApiError(401, "User not found or refresh token is missing");
    }

    const isMatch = await comparePassword(
      refreshToken,
      existingUser.refreshTokenHash,
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
}
