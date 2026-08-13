import { ApiError } from "@/lib/errors";
import { UserRepository } from "./user.repository";
import { UpdateUserInput } from "./user.validation";
import { hashPassword } from "@/lib/password";
import { Role } from "@prisma/client";

const repository = new UserRepository();

export class UserService {
  async getUserById(id: string, currentUserId: string, currentUserRole: Role) {
    if (currentUserRole !== Role.SUPER_ADMIN && currentUserId !== id) {
      throw new ApiError(403, "Forbidden access: You can only access your own profile");
    }
    const user = await repository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async getPublicProfileById(id: string) {
    const user = await repository.findPublicProfileById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role === Role.SUPER_ADMIN) {
      throw new ApiError(403, "Forbidden access: Cannot view public profile of an administrator");
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

  async updateUserById(
    id: string,
    data: Omit<UpdateUserInput, "id">,
    currentUserId: string,
    currentUserRole: Role
  ) {
    if (currentUserRole !== Role.SUPER_ADMIN && currentUserId !== id) {
      throw new ApiError(403, "Forbidden access: You can only update your own profile");
    }

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
      passwordHash = await hashPassword(data.password);
    }

    const { password, ...updateFields } = data;

    return repository.updateById(id, {
      ...updateFields,
      ...(passwordHash && { passwordHash }),
    });
  }

  async deleteUserById(id: string, currentUserId: string, currentUserRole: Role) {
    if (currentUserRole !== Role.SUPER_ADMIN && currentUserId !== id) {
      throw new ApiError(403, "Forbidden access: You can only delete your own profile");
    }

    const existingUser = await repository.findById(id);

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    return repository.deleteById(id);
  }

  async purgeAllUsers() {
    return repository.purgeAllUsers();
  }
}
