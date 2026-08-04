import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define a reusable selector to keep query selections consistent across methods
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  shelterId: true,
  isReported: true,
  createdAt: true,
});

export class UserRepository {
  /**
   * Create a new user with Prisma's auto-generated create input
   */
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: defaultUserSelect,
    });
  }

  /**
   * Find user by unique ID (MongoDB ObjectId)
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: defaultUserSelect,
    });
  }

  /**
   * Find user by email (MongoDB ObjectId)
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...defaultUserSelect,
        passwordHash: true,
      },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: defaultUserSelect,
    });
  }

  /**
   * Update user details by ID or Email
   */
  async updateById(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: defaultUserSelect,
    });
  }

  /**
   * Delete user by ID
   */
  async deleteById(id: string) {
    return prisma.user.delete({
      where: { id },
      select: defaultUserSelect,
    });
  }
}
