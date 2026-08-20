import { ApiError } from "@/lib/errors";
import { RequestedItemRepository } from "./requestedItem.repository";
import { CreateRequestedItemInput, UpdateRequestedItemInput } from "./requestedItem.validation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export class RequestedItemService {
    private requestedItemRepository: RequestedItemRepository;

    constructor(requestedItemRepository: RequestedItemRepository) {
        this.requestedItemRepository = requestedItemRepository;
    }

    async createRequestedItem(data: CreateRequestedItemInput, userId: string, userRole: Role) {
        // Verify parent shelter request exists
        const shelterRequest = await prisma.shelterRequest.findUnique({
            where: { id: data.requestId }
        });
        if (!shelterRequest) {
            throw new ApiError(404, "Shelter request not found");
        }

        // Block modifications if the request status is not ACTIVE
        if (shelterRequest.status !== "ACTIVE") {
            throw new ApiError(400, "Cannot add items to a shelter request that is not active");
        }

        // Ownership check
        if (userRole === Role.SHELTER_ADMIN) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { shelterId: true }
            });
            if (!user || user.shelterId !== shelterRequest.shelterId) {
                throw new ApiError(
                    403,
                    "Forbidden access: You are not authorized to manage requested items for this shelter"
                );
            }
        }

        // Verify global item exists
        const globalItem = await prisma.globalItem.findUnique({
            where: { id: data.globalItemId }
        });
        if (!globalItem) {
            throw new ApiError(404, "Global item not found");
        }

        // Prevent duplicate global item requests in the same shelter request
        const existingItem = await prisma.requestedItem.findFirst({
            where: {
                requestId: data.requestId,
                globalItemId: data.globalItemId
            }
        });
        if (existingItem) {
            throw new ApiError(409, "This item has already been requested in this shelter request");
        }

        // Use global item's default unit if not specified
        const finalUnit = data.unit || globalItem.defaultUnit || "units";

        const requestedItem = await this.requestedItemRepository.create({
            requestId: data.requestId,
            globalItemId: data.globalItemId,
            quantityNeeded: data.quantityNeeded,
            unit: finalUnit,
            notes: data.notes ?? undefined,
        });

        return requestedItem;
    }

    async getRequestedItemById(id: string) {
        const item = await this.requestedItemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Requested item not found");
        }
        return item;
    }

    async getAllRequestedItems() {
        return this.requestedItemRepository.getAllItems();
    }

    async updateRequestedItemById(id: string, data: UpdateRequestedItemInput, userId: string, userRole: Role) {
        const item = await this.requestedItemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Requested item not found");
        }

        // Fetch parent request
        const shelterRequest = await prisma.shelterRequest.findUnique({
            where: { id: item.requestId }
        });
        if (!shelterRequest) {
            throw new ApiError(404, "Parent shelter request not found");
        }

        // Block modifications if request status is not ACTIVE
        if (shelterRequest.status !== "ACTIVE") {
            throw new ApiError(400, "Cannot update items on a shelter request that is not active");
        }

        // Ownership check
        if (userRole === Role.SHELTER_ADMIN) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { shelterId: true }
            });
            if (!user || user.shelterId !== shelterRequest.shelterId) {
                throw new ApiError(
                    403,
                    "Forbidden access: You are not authorized to manage requested items for this shelter"
                );
            }
        }

        if (data.quantityNeeded !== undefined) {
            if (data.quantityNeeded < item.quantityReserved) {
                throw new ApiError(400, `Quantity needed cannot be less than the reserved quantity (${item.quantityReserved})`);
            }
            if (data.quantityNeeded < item.quantityDelivered) {
                throw new ApiError(400, `Quantity needed cannot be less than the delivered quantity (${item.quantityDelivered})`);
            }
        }

        const updatedItem = await this.requestedItemRepository.updateById(id, {
            quantityNeeded: data.quantityNeeded,
            unit: data.unit,
            notes: data.notes,
        });

        return updatedItem;
    }

    async deleteRequestedItemById(id: string, userId: string, userRole: Role) {
        const item = await this.requestedItemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Requested item not found");
        }

        // Fetch parent request
        const shelterRequest = await prisma.shelterRequest.findUnique({
            where: { id: item.requestId }
        });
        if (!shelterRequest) {
            throw new ApiError(404, "Parent shelter request not found");
        }

        // Block modifications if request status is not ACTIVE
        if (shelterRequest.status !== "ACTIVE") {
            throw new ApiError(400, "Cannot delete items from a shelter request that is not active");
        }

        // Ownership check
        if (userRole === Role.SHELTER_ADMIN) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { shelterId: true }
            });
            if (!user || user.shelterId !== shelterRequest.shelterId) {
                throw new ApiError(
                    403,
                    "Forbidden access: You are not authorized to manage requested items for this shelter"
                );
            }
        }

        if (item.quantityReserved > 0 || item.quantityDelivered > 0) {
            throw new ApiError(400, "Cannot delete a requested item with active pledges or delivered inventory");
        }

        return this.requestedItemRepository.deleteById(id);
    }

    async purgeAllRequestedItems() {
        return this.requestedItemRepository.purgeAllItems();
    }
}
