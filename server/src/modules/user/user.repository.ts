import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define a reusable selector to keep query selections consistent across methods
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  refreshTokenHash: true,
  googleId: true,
  phone: true,
  profileImageUrl: true,
  role: true,
  shelterId: true,
  shelter: {
    select: {
      id: true,
      name: true,
      country: true,
      organizationIdType: true,
      organizationId: true,
      verificationStatus: true,
      rejectionReason: true,
      description: true,
      street: true,
      city: true,
      state: true,
      zip: true,
      dropOffHours: true,
      contactEmail: true,
      phone: true,
      website: true,
      profileImageUrl: true,
      shelterImages: true,
    },
  },
  isReported: true,
  pledgesCompleted: true,
  pledgesExpired: true,
  createdAt: true,
  updatedAt: true,
});

const publicUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  googleId: true,
  role: true,
  phone: true,
  createdAt: true,
  pledgesCompleted: true,
  pledgesExpired: true,
  isReported: true,
  shelterId: true,
  shelter: {
    select: {
      id: true,
      name: true,
    },
  },
});

const createWithOAuthSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  googleId: true,
  role: true,
  profileImageUrl: true,
  passwordHash: true,
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

  async createWithOAuth(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: createWithOAuthSelect,
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
   * Find public profile of a user by unique ID
   */
  async findPublicProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { ...publicUserSelect },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: defaultUserSelect,
    });
  }

  /**
   * Find user by Google sub ID
   */
  async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
      select: defaultUserSelect,
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

  async updateRefreshTokenHash(id: string, refreshTokenHash: string | null) {
    return prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
      select: defaultUserSelect,
    });
  }

  async findRefreshTokenHashById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { refreshTokenHash: true },
    });
    return user?.refreshTokenHash;
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

  async purgeAllUsers() {
    return prisma.user.deleteMany();
  }
}
