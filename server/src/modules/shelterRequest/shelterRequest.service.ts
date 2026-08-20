import { ApiError } from "@/lib/errors";
import { ShelterRequestRepository } from "./shelterRequest.repository";
import { CreateShelterRequestInput, UpdateShelterRequestInput } from "./shelterRequest.validation";
import { prisma } from "@/lib/prisma";
import { Role, VerificationStatus } from "@prisma/client";

export class ShelterRequestService {
  private shelterRequestRepository: ShelterRequestRepository;

  constructor(shelterRequestRepository: ShelterRequestRepository) {
    this.shelterRequestRepository = shelterRequestRepository;
  }

  async createRequest(data: CreateShelterRequestInput, userId: string, userRole: Role) {
    // Verify shelter exists
    const shelter = await prisma.shelter.findUnique({
      where: { id: data.shelterId }
    });
    if (!shelter) {
      throw new ApiError(404, "Shelter not found");
    }

    // Enforce ownership check for SHELTER_ADMIN
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true }
      });
      if (!user || user.shelterId !== data.shelterId) {
        throw new ApiError(
          403,
          "Forbidden access: You are not authorized to create requests for this shelter"
        );
      }
    }

    // Enforce shelter verification check
    if (shelter.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new ApiError(
        403,
        "Forbidden access: Only verified shelters can create requests"
      );
    }

    // Verify categories exist if provided
    if (data.categoryIds && data.categoryIds.length > 0) {
      const count = await prisma.category.count({
        where: { id: { in: data.categoryIds } }
      });
      if (count !== data.categoryIds.length) {
        throw new ApiError(400, "One or more categories do not exist");
      }
    }

    // Verify all global items exist and collect their default units
    const itemsToCreate = data.items || [];
    const globalItemIds = itemsToCreate.map(item => item.globalItemId);
    
    // Prevent duplicate global items in the same request payload
    if (new Set(globalItemIds).size !== globalItemIds.length) {
      throw new ApiError(400, "Duplicate global items in the request payload");
    }

    const globalItemsMap = new Map<string, string>(); // id -> defaultUnit
    if (globalItemIds.length > 0) {
      const globalItems = await prisma.globalItem.findMany({
        where: { id: { in: globalItemIds } }
      });
      if (globalItems.length !== globalItemIds.length) {
        throw new ApiError(400, "One or more global items do not exist");
      }
      globalItems.forEach(item => {
        globalItemsMap.set(item.id, item.defaultUnit);
      });
    }

    const { categoryIds, items, ...rest } = data;

    // Use Prisma transaction to create both request and its items
    const request = await prisma.$transaction(async (tx) => {
      // 1. Create the ShelterRequest
      const shelterRequest = await tx.shelterRequest.create({
        data: {
          ...rest,
          categoryIds: categoryIds ?? [],
          categories: categoryIds && categoryIds.length > 0 ? {
            connect: categoryIds.map(id => ({ id }))
          } : undefined
        }
      });

      // 2. Create the RequestedItems referencing the shelterRequest.id
      if (itemsToCreate.length > 0) {
        const preparedItems = itemsToCreate.map(item => ({
          requestId: shelterRequest.id,
          globalItemId: item.globalItemId,
          quantityNeeded: item.quantityNeeded,
          unit: item.unit || globalItemsMap.get(item.globalItemId) || "units",
          notes: item.notes ?? undefined
        }));

        await tx.requestedItem.createMany({
          data: preparedItems
        });
      }

      return shelterRequest;
    });

    // Fetch the full request with the default includes (categories, items, shelter)
    const fullRequest = await this.shelterRequestRepository.findById(request.id);
    if (!fullRequest) {
      throw new ApiError(500, "Failed to retrieve the newly created shelter request");
    }
    return fullRequest;
  }

  async getRequestById(id: string) {
    const request = await this.shelterRequestRepository.findById(id);
    if (!request) {
      throw new ApiError(404, "Shelter request not found");
    }
    return request;
  }

  async getAllRequests() {
    return this.shelterRequestRepository.getAll();
  }

  async updateRequestById(id: string, data: UpdateShelterRequestInput, userId: string, userRole: Role) {
    const existing = await this.shelterRequestRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, "Shelter request not found");
    }

    // Enforce ownership check for SHELTER_ADMIN
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true }
      });
      if (!user || user.shelterId !== existing.shelterId) {
        throw new ApiError(
          403,
          "Forbidden access: You are not authorized to update requests for this shelter"
        );
      }
    }

    const updateData: any = {
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      status: data.status,
    };

    if (data.categoryIds) {
      const count = await prisma.category.count({
        where: { id: { in: data.categoryIds } }
      });
      if (count !== data.categoryIds.length) {
        throw new ApiError(400, "One or more categories do not exist");
      }

      updateData.categoryIds = data.categoryIds;
      updateData.categories = {
        set: data.categoryIds.map(id => ({ id }))
      };
    }

    const updated = await this.shelterRequestRepository.updateById(id, updateData);
    return updated;
  }

  async deleteRequestById(id: string, userId: string, userRole: Role) {
    const existing = await this.shelterRequestRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, "Shelter request not found");
    }

    // Enforce ownership check for SHELTER_ADMIN
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true }
      });
      if (!user || user.shelterId !== existing.shelterId) {
        throw new ApiError(
          403,
          "Forbidden access: You are not authorized to delete requests for this shelter"
        );
      }
    }

    // Prevent deletion if any of the requested items have pledges/reservations/deliveries
    const hasActiveInventoryOrPledge = existing.items.some(
      (item) => item.quantityReserved > 0 || item.quantityDelivered > 0
    );

    if (hasActiveInventoryOrPledge) {
      throw new ApiError(
        400,
        "Cannot delete shelter request because some of its items have active pledges or delivered inventory"
      );
    }

    return this.shelterRequestRepository.deleteById(id);
  }

  async purgeAllRequests() {
    return this.shelterRequestRepository.purgeAll();
  }
}
