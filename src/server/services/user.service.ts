import bcrypt from "bcryptjs";
import { ApiError } from "@/lib/errors";
import { UserRepository } from "../repositories/user.repository";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/lib/validations/user.validation";

const repository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserInput) {
    const existingUser = await repository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    // Hash password before passing to repository
    const passwordHash = await bcrypt.hash(data.password, 10);

    const { password, ...userData } = data;

    return repository.create({
      ...userData,
      passwordHash,
    });
  }

  async getUserById(id: string) {
    const user = await repository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await repository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async getAllUsers() {
    return repository.getAllUsers();
  }

  async updateUserById(id: string, data: Omit<UpdateUserInput, "id">) {
    const existingUser = await repository.findById(id);

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (data.email) {
      const existing = await repository.findByEmail(data.email);

      if (existing && existing.id !== id) {
        throw new ApiError(409, "Email belongs to another user");
      }
    }

    let passwordHash: string | undefined;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const { password, ...updateFields } = data;

    return repository.updateById(id, {
      ...updateFields,
      ...(passwordHash && { passwordHash }),
    });
  }

  async deleteUserById(id: string) {
    const existingUser = await repository.findById(id);

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    return repository.deleteById(id);
  }
}
