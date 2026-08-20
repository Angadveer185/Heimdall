import { ApiError } from "@/lib/errors";
import { PledgedItemRepository } from "./pledgedItem.repository";
import { CreatePledgedItemInput, UpdatePledgedItemInput } from "./pledgedItem.validation";
import { prisma } from "@/lib/prisma";
import { PledgeStatus, Role } from "@prisma/client";

export class PledgedItemService {
    private pledgedItemRepository: PledgedItemRepository;

    constructor(pledgedItemRepository: PledgedItemRepository) {
        this.pledgedItemRepository = pledgedItemRepository;
    }

    async createPledgedItem(data: CreatePledgedItemInput, userId: string, userRole: Role) {
        return prisma.$transaction(async (tx) => {
            // Verify parent pledge exists
            const pledge = await tx.pledge.findUnique({
                where: { id: data.pledgeId }
            });
            if (!pledge) {
                throw new ApiError(404, "Pledge not found");
            }

            if (pledge.status !== PledgeStatus.RESERVED) {
                throw new ApiError(400, `Cannot add items to a pledge with status ${pledge.status}`);
            }

            // Auth Check
            let isAuthorized = false;
            if (userRole === Role.SUPER_ADMIN) {
                isAuthorized = true;
            } else if (userRole === Role.DONOR && pledge.donorId === userId) {
                isAuthorized = true;
            } else if (userRole === Role.SHELTER_ADMIN) {
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: { shelterId: true }
                });
                if (user && user.shelterId === pledge.shelterId) {
                    isAuthorized = true;
                }
            }

            if (!isAuthorized) {
                throw new ApiError(403, "Forbidden access: You are not authorized to manage pledged items for this pledge");
            }

            // Verify requested item exists
            const requestedItem = await tx.requestedItem.findUnique({
                where: { id: data.requestedItemId },
                include: { request: true }
            });

            if (!requestedItem) {
                throw new ApiError(404, "Requested item not found");
            }

            // Verify that the requested item belongs to the same shelter as the pledge
            if (requestedItem.request.shelterId !== pledge.shelterId) {
                throw new ApiError(400, "Requested item does not belong to the same shelter as the pledge");
            }

            // Prevent duplicate pledges for the same requested item
            const existingPledge = await tx.pledgedItem.findFirst({
                where: {
                    pledgeId: data.pledgeId,
                    requestedItemId: data.requestedItemId
                }
            });

            if (existingPledge) {
                throw new ApiError(409, "This item has already been pledged in this pledge");
            }

            // Verify quantity availability
            const available = requestedItem.quantityNeeded - requestedItem.quantityReserved;
            if (available < data.quantityPledged) {
                throw new ApiError(
                    400,
                    `Insufficient quantity available for item. Only ${available} units can be pledged.`
                );
            }

            // 1. Update quantityReserved on requestedItem
            await tx.requestedItem.update({
                where: { id: data.requestedItemId },
                data: {
                    quantityReserved: {
                        increment: data.quantityPledged
                    }
                }
            });

            // 2. Create pledgedItem
            const pledgedItem = await tx.pledgedItem.create({
                data,
                select: {
                    id: true,
                    pledgeId: true,
                    requestedItemId: true,
                    quantityPledged: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return pledgedItem;
        });
    }

    async getPledgedItemById(id: string, userId: string, userRole: Role) {
        const item = await this.pledgedItemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Pledged item not found");
        }

        // Auth Check
        let isAuthorized = false;
        if (userRole === Role.SUPER_ADMIN) {
            isAuthorized = true;
        } else {
            const pledge = await prisma.pledge.findUnique({
                where: { id: item.pledgeId },
                select: { donorId: true, shelterId: true }
            });
            if (pledge) {
                if (userRole === Role.DONOR && pledge.donorId === userId) {
                    isAuthorized = true;
                } else if (userRole === Role.SHELTER_ADMIN) {
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { shelterId: true }
                    });
                    if (user && user.shelterId === pledge.shelterId) {
                        isAuthorized = true;
                    }
                }
            }
        }

        if (!isAuthorized) {
            throw new ApiError(403, "Forbidden access: You are not authorized to view this pledged item");
        }

        return item;
    }

    async getAllPledgedItems() {
        return this.pledgedItemRepository.getAllItems();
    }

    async updatePledgedItemById(id: string, data: UpdatePledgedItemInput, userId: string, userRole: Role) {
        return prisma.$transaction(async (tx) => {
            const existingItem = await tx.pledgedItem.findUnique({
                where: { id },
                include: {
                    pledge: true,
                    requestedItem: true
                }
            });

            if (!existingItem) {
                throw new ApiError(404, "Pledged item not found");
            }

            if (existingItem.pledge.status !== PledgeStatus.RESERVED) {
                throw new ApiError(400, `Cannot update pledged items for a pledge with status ${existingItem.pledge.status}`);
            }

            // Auth Check
            let isAuthorized = false;
            if (userRole === Role.SUPER_ADMIN) {
                isAuthorized = true;
            } else if (userRole === Role.DONOR && existingItem.pledge.donorId === userId) {
                isAuthorized = true;
            } else if (userRole === Role.SHELTER_ADMIN) {
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: { shelterId: true }
                });
                if (user && user.shelterId === existingItem.pledge.shelterId) {
                    isAuthorized = true;
                }
            }

            if (!isAuthorized) {
                throw new ApiError(403, "Forbidden access: You are not authorized to manage pledged items for this pledge");
            }

            const diff = data.quantityPledged - existingItem.quantityPledged;
            if (diff > 0) {
                const available = existingItem.requestedItem.quantityNeeded - existingItem.requestedItem.quantityReserved;
                if (available < diff) {
                    throw new ApiError(
                        400,
                        `Insufficient quantity available for item. Only ${available} additional units can be pledged.`
                    );
                }
            }

            // 1. Update quantityReserved on requestedItem
            await tx.requestedItem.update({
                where: { id: existingItem.requestedItemId },
                data: {
                    quantityReserved: {
                        increment: diff
                    }
                }
            });

            // 2. Update PledgedItem
            const updatedItem = await tx.pledgedItem.update({
                where: { id },
                data: {
                    quantityPledged: data.quantityPledged
                },
                select: {
                    id: true,
                    pledgeId: true,
                    requestedItemId: true,
                    quantityPledged: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return updatedItem;
        });
    }

    async deletePledgedItemById(id: string, userId: string, userRole: Role) {
        return prisma.$transaction(async (tx) => {
            const existingItem = await tx.pledgedItem.findUnique({
                where: { id },
                include: {
                    pledge: true,
                    requestedItem: true
                }
            });

            if (!existingItem) {
                throw new ApiError(404, "Pledged item not found");
            }

            if (existingItem.pledge.status !== PledgeStatus.RESERVED) {
                throw new ApiError(400, `Cannot delete pledged items for a pledge with status ${existingItem.pledge.status}`);
            }

            // Auth Check
            let isAuthorized = false;
            if (userRole === Role.SUPER_ADMIN) {
                isAuthorized = true;
            } else if (userRole === Role.DONOR && existingItem.pledge.donorId === userId) {
                isAuthorized = true;
            } else if (userRole === Role.SHELTER_ADMIN) {
                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: { shelterId: true }
                });
                if (user && user.shelterId === existingItem.pledge.shelterId) {
                    isAuthorized = true;
                }
            }

            if (!isAuthorized) {
                throw new ApiError(403, "Forbidden access: You are not authorized to manage pledged items for this pledge");
            }
            // 1. Decrement quantityReserved on requestedItem
            await tx.requestedItem.update({
                where: { id: existingItem.requestedItemId },
                data: {
                    quantityReserved: {
                        decrement: existingItem.quantityPledged
                    }
                }
            });

            // 2. Get the number of items in this pledge to check if this is the last one
            const itemCount = await tx.pledgedItem.count({
                where: { pledgeId: existingItem.pledgeId }
            });

            // 3. Delete PledgedItem
            const deletedItem = await tx.pledgedItem.delete({
                where: { id },
                select: {
                    id: true,
                    pledgeId: true,
                    requestedItemId: true,
                    quantityPledged: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            // 4. If this was the last item, cancel the parent pledge to avoid a ghost reservation
            if (itemCount === 1) {
                await tx.pledge.update({
                    where: { id: existingItem.pledgeId },
                    data: { status: PledgeStatus.CANCELLED }
                });
            }

            return deletedItem;        });
    }

    async purgeAllPledgedItems() {
        return this.pledgedItemRepository.purgeAllItems();
    }
}