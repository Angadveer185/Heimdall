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

  async createShelter(data: CreateShelterInput, userId: string) {
    // Check if the user is already associated with a shelter or has shelter admin privileges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { shelterId: true, role: true },
    });

    if (user && (user.shelterId || user.role === "SHELTER_ADMIN")) {
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

    const shelter = await this.shelterRepository.create(data, userId);

    // Run verification asynchronously in the background
    this.verifyShelterBackground(
      shelter.id,
      data.country,
      data.organizationIdType,
      data.organizationId
    ).catch((err) => {
      console.error(`Background verification error for shelter ${shelter.id}:`, err);
    });

    // Generate new session tokens for the promoted shelter admin
    const payload = { id: userId, role: Role.SHELTER_ADMIN };
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
    const updatedShelter = await this.shelterRepository.updateById(id, data);
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
    const deletedShelter = await this.shelterRepository.deleteById(id);
    return deletedShelter;
  }

  async purgeAllShelters() {
    return this.shelterRepository.purgeAllShelters();
  }
}
