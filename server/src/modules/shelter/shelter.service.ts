import { ApiError } from "@/lib/errors";
import { ShelterRepository } from "./shelter.repository";
import { CreateShelterInput, UpdateShelterInput } from "./shelter.validation";
import { verifyShelter } from "./shelter.verification";
import { VerificationStatus, OrganizationIdType, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { hashPassword } from "@/lib/password";

export class ShelterService {
  private shelterRepository: ShelterRepository;

  constructor(shelterRepository: ShelterRepository) {
    this.shelterRepository = shelterRepository;
  }

  async verifyShelterCredentials(
    country: string,
    organizationIdType: OrganizationIdType,
    organizationId: string
  ) {
    return verifyShelter(country, organizationIdType, organizationId);
  }

  async createShelter(data: CreateShelterInput, userId: string) {
    // Check if the user is already associated with a shelter or has shelter admin privileges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { shelterId: true, role: true },
    });

    if (user && user.role !== "SUPER_ADMIN" && (user.shelterId || user.role === "SHELTER_ADMIN")) {
      throw new ApiError(
        400,
        "You are already associated with a shelter as an admin. Please delete your current shelter before registering a new one."
      );
    }

    const existingShelter = await this.shelterRepository.findByOrganizationId(
      data.organizationId,
    );

    if (existingShelter) {
      throw new ApiError(409, "Shelter already exists");
    }

    // Verify shelter prior to creation
    let verificationStatus: VerificationStatus = VerificationStatus.PENDING;
    let rejectionReason: string | null = null;
    try {
      const result = await verifyShelter(
        data.country,
        data.organizationIdType,
        data.organizationId
      );
      if (result.verified) {
        verificationStatus = VerificationStatus.VERIFIED;
        rejectionReason = null;
      } else {
        verificationStatus = VerificationStatus.REJECTED;
        rejectionReason = result.rejectionReason || "Verification failed";
      }
    } catch (error: any) {
      console.error("Verification engine lookup failed during creation:", error);
      verificationStatus = VerificationStatus.REJECTED;
      rejectionReason = error?.message || "Failed to verify organization credentials";
    }

    // Create shelter and promote user to SHELTER_ADMIN
    const shelter = await this.shelterRepository.create(
      data,
      userId,
      verificationStatus,
      rejectionReason
    );

    // Generate new session tokens preserving role
    const payloadRole = user?.role === Role.SUPER_ADMIN ? Role.SUPER_ADMIN : Role.SHELTER_ADMIN;
    const payload = { id: userId, role: payloadRole };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const refreshTokenHash = await hashPassword(refreshToken);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });

    return {
      shelter,
      accessToken,
      refreshToken,
    };
  }

  async verifyShelterBackground(
    shelterId: string,
    country: string,
    organizationIdType: OrganizationIdType,
    organizationId: string
  ) {
    try {
      const result = await verifyShelter(country, organizationIdType, organizationId);
      if (result.verified) {
        await this.shelterRepository.updateById(shelterId, {
          verificationStatus: VerificationStatus.VERIFIED,
        });
      } else {
        await this.shelterRepository.updateById(shelterId, {
          verificationStatus: VerificationStatus.REJECTED,
          rejectionReason: result.rejectionReason || "Verification failed",
        });
      }
    } catch (error) {
      console.error(`Temporary failure verifying shelter ${shelterId}, leaving as PENDING:`, error);
    }
  }

  async getShelterById(id: string) {
    const shelter = await this.shelterRepository.findById(id);
    if (!shelter) {
      throw new ApiError(404, "Shelter not found");
    }
    return shelter;
  }

  async getShelterByOrganizationId(organizationId: string) {
    const shelter =
      await this.shelterRepository.findByOrganizationId(organizationId);
    if (!shelter) {
      throw new ApiError(404, "Shelter not found");
    }
    return shelter;
  }

  async getAllShelters() {
    return this.shelterRepository.getAllShelters();
  }

  async updateShelterById(
    id: string,
    data: Omit<UpdateShelterInput, "id">,
    userId: string,
    userRole: Role
  ) {
    // Ownership check
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (!user || user.shelterId !== id) {
        throw new ApiError(403, "Forbidden access: You can only update your own shelter");
      }
    }

    const existingShelter = await this.shelterRepository.findById(id);
    if (!existingShelter) {
      throw new ApiError(404, "Shelter not found");
    }

    const { appendShelterImage, ...restData } = data;
    const updatePayload: any = { ...restData };
    if (appendShelterImage) {
      updatePayload.shelterImages = { push: appendShelterImage };
    }

    const updatedShelter = await this.shelterRepository.updateById(id, updatePayload);
    return updatedShelter;
  }

  async deleteShelterById(id: string, userId: string, userRole: Role) {
    // Ownership check
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (!user || user.shelterId !== id) {
        throw new ApiError(403, "Forbidden access: You can only delete your own shelter");
      }
    }

    const existingShelter = await this.shelterRepository.findById(id);
    if (!existingShelter) {
      throw new ApiError(404, "Shelter not found");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Revert all shelter admins associated with this shelter to DONOR role and clear shelterId
      await tx.user.updateMany({
        where: { shelterId: id },
        data: {
          shelterId: null,
          role: Role.DONOR,
        },
      });

      // 2. Cascade delete pledges associated with this shelter
      await tx.pledgedItem.deleteMany({
        where: {
          pledge: { shelterId: id },
        },
      });
      await tx.pledge.deleteMany({
        where: { shelterId: id },
      });

      // 3. Cascade delete requested items and shelter requests for this shelter
      await tx.requestedItem.deleteMany({
        where: {
          request: { shelterId: id },
        },
      });
      await tx.shelterRequest.deleteMany({
        where: { shelterId: id },
      });

      // 4. Delete the shelter itself
      return tx.shelter.delete({
        where: { id },
      });
    });
  }

  async purgeAllShelters() {
    return this.shelterRepository.purgeAllShelters();
  }

  async transferOwnership(
    shelterId: string,
    targetUserEmail: string,
    currentUserId: string,
    currentUserRole: Role
  ) {
    if (currentUserRole !== Role.SUPER_ADMIN) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { shelterId: true },
      });
      if (!currentUser || currentUser.shelterId !== shelterId) {
        throw new ApiError(403, "Forbidden access: You are not authorized to transfer ownership of this shelter");
      }
    }

    const shelter = await this.shelterRepository.findById(shelterId);
    if (!shelter) {
      throw new ApiError(404, "Shelter not found");
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: targetUserEmail.toLowerCase().trim() },
    });
    if (!targetUser) {
      throw new ApiError(404, `No registered user found with email "${targetUserEmail}"`);
    }

    if (targetUser.id === currentUserId) {
      throw new ApiError(400, "Cannot transfer ownership to yourself");
    }

    if (targetUser.shelterId && targetUser.shelterId !== shelterId) {
      throw new ApiError(400, "The specified user is already an administrator of another shelter facility");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Promote target user to SHELTER_ADMIN and assign shelterId
      const updatedTarget = await tx.user.update({
        where: { id: targetUser.id },
        data: {
          role: Role.SHELTER_ADMIN,
          shelterId: shelterId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          shelterId: true,
        },
      });

      // 2. Revert current user to DONOR and clear shelterId (unless SUPER_ADMIN)
      if (currentUserRole !== Role.SUPER_ADMIN) {
        await tx.user.update({
          where: { id: currentUserId },
          data: {
            role: Role.DONOR,
            shelterId: null,
          },
        });
      }

      return updatedTarget;
    });
  }
}
