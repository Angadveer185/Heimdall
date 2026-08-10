import { ApiError } from "@/lib/errors";
import { ShelterRepository } from "./shelter.repository";
import { CreateShelterInput, UpdateShelterInput } from "./shelter.validation";
import { verifyShelter } from "./shelter.verification";
import { VerificationStatus, OrganizationIdType } from "@prisma/client";

export class ShelterService {
  private shelterRepository: ShelterRepository;

  constructor(shelterRepository: ShelterRepository) {
    this.shelterRepository = shelterRepository;
  }

  async createShelter(data: CreateShelterInput, userId: string) {
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

    return shelter;
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

  async updateShelterById(id: string, data: Omit<UpdateShelterInput, "id">) {
    const existingShelter = await this.shelterRepository.findById(id);
    if (!existingShelter) {
      throw new ApiError(404, "Shelter not found");
    }
    const updatedShelter = await this.shelterRepository.updateById(id, data);
    return updatedShelter;
  }

  async deleteShelterById(id: string) {
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
