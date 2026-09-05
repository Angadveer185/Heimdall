import { ApiError } from "@/lib/errors";
import { UserRepository } from "./user.repository";
import { CreateUserInput, UpdateUserInput } from "./user.validation";
import { hashPassword } from "@/lib/password";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

  async createUser(data: CreateUserInput) {
    const existing = await repository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, "User with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const { password, ...fields } = data;

    return repository.create({
      ...fields,
      passwordHash,
    });
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

    return prisma.$transaction(async (tx) => {
      // 1. Cascade delete all pledges made by this user as a donor
      const userPledges = await tx.pledge.findMany({
        where: { donorId: id },
        select: { id: true },
      });
      const userPledgeIds = userPledges.map((p) => p.id);
      if (userPledgeIds.length > 0) {
        await tx.pledgedItem.deleteMany({
          where: { pledgeId: { in: userPledgeIds } },
        });
        await tx.pledge.deleteMany({
          where: { donorId: id },
        });
      }

      // 2. Cascade delete shelter facility if this user is the only admin
      if (existingUser.shelterId) {
        const otherAdmins = await tx.user.count({
          where: {
            shelterId: existingUser.shelterId,
            id: { not: id },
          },
        });

        if (otherAdmins === 0) {
          // Cascade delete shelter pledges
          const shelterPledges = await tx.pledge.findMany({
            where: { shelterId: existingUser.shelterId },
            select: { id: true },
          });
          const shelterPledgeIds = shelterPledges.map((p) => p.id);
          if (shelterPledgeIds.length > 0) {
            await tx.pledgedItem.deleteMany({
              where: { pledgeId: { in: shelterPledgeIds } },
            });
            await tx.pledge.deleteMany({
              where: { shelterId: existingUser.shelterId },
            });
          }

          // Cascade delete shelter requests and items
          await tx.requestedItem.deleteMany({
            where: { request: { shelterId: existingUser.shelterId } },
          });
          await tx.shelterRequest.deleteMany({
            where: { shelterId: existingUser.shelterId },
          });

          // Delete the shelter itself
          await tx.shelter.delete({
            where: { id: existingUser.shelterId },
          });
        }
      }

      // 3. Delete the user
      return tx.user.delete({
        where: { id },
      });
    });
  }

  async purgeAllUsers() {
    return repository.purgeAllUsers();
  }
}
