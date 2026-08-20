import { ApiError } from "@/lib/errors";
import { PledgeRepository } from "./pledge.repository";
import { CreatePledgeInput, VerifyPledgeInput } from "./pledge.validation";
import { prisma } from "@/lib/prisma";
import { PledgeStatus, Role } from "@prisma/client";

export class PledgeService {
  private pledgeRepository: PledgeRepository;

  constructor(pledgeRepository: PledgeRepository) {
    this.pledgeRepository = pledgeRepository;
  }

  private generatePledgeCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "PLG-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createPledge(data: CreatePledgeInput, donorId: string) {
    const { items, scheduledDropOffDate } = data;

    const requestedItemIds = items.map((item) => item.requestedItemId);

    // Check if the requested items exist
    const requestedItems = await prisma.requestedItem.findMany({
      where: { id: { in: requestedItemIds } },
      include: {
        request: {
          include: {
            shelter: true,
          },
        },
      },
    });

    if (requestedItems.length !== requestedItemIds.length) {
      throw new ApiError(404, "One or more requested items not found");
    }

    // Verify all items belong to the same shelter request
    const requestIds = new Set(requestedItems.map((item) => item.requestId));
    if (requestIds.size > 1) {
      throw new ApiError(
        400,
        "All pledged items must belong to the same shelter request",
      );
    }

    const singleRequest = requestedItems[0].request;
    if (singleRequest.status !== "ACTIVE") {
      throw new ApiError(400, "Cannot pledge to an inactive shelter request");
    }

    // Verify that the shelter is verified
    if (singleRequest.shelter.verificationStatus !== "VERIFIED") {
      throw new ApiError(
        403,
        "Cannot pledge to a shelter that is not verified",
      );
    }

    const expiresAt = new Date(
      scheduledDropOffDate.getTime() + 24 * 60 * 60 * 1000,
    ); // Expiration: drop-off date + 24h

    // Execute in a transaction to prevent race conditions
    return prisma.$transaction(async (tx) => {
      // Re-fetch requested items with lock/latest state within transaction
      const latestItems = await tx.requestedItem.findMany({
        where: { id: { in: requestedItemIds } },
      });

      const latestItemsMap = new Map(
        latestItems.map((item) => [item.id, item]),
      );

      // Verify available quantities for all items
      for (const itemInput of items) {
        const latestItem = latestItemsMap.get(itemInput.requestedItemId);
        if (!latestItem) {
          throw new ApiError(
            404,
            `Requested item ${itemInput.requestedItemId} not found inside transaction`,
          );
        }

        const available =
          latestItem.quantityNeeded - latestItem.quantityReserved;
        if (available < itemInput.quantityPledged) {
          throw new ApiError(
            400,
            `Insufficient quantity available for item. Only ${available} units can be pledged.`,
          );
        }
      }

      // Generate a unique pledge code
      let pledgeCode = this.generatePledgeCode();
      let attempt = 0;
      while (attempt < 5) {
        const existing = await tx.pledge.findUnique({
          where: { pledgeCode },
        });
        if (!existing) break;
        pledgeCode = this.generatePledgeCode();
        attempt++;
      }

      // 1. Update the requested items quantityReserved
      for (const itemInput of items) {
        await tx.requestedItem.update({
          where: { id: itemInput.requestedItemId },
          data: {
            quantityReserved: {
              increment: itemInput.quantityPledged,
            },
          },
        });
      }

      // 2. Create the pledge
      return tx.pledge.create({
        data: {
          pledgeCode,
          donorId,
          shelterId: singleRequest.shelterId,
          scheduledDropOffDate,
          expiresAt,
          status: PledgeStatus.RESERVED,
          items: {
            create: items.map((item) => ({
              requestedItemId: item.requestedItemId,
              quantityPledged: item.quantityPledged,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });
  }

  async getPledgeById(id: string, userId: string, userRole: Role) {
    const pledge = await this.pledgeRepository.findById(id);
    if (!pledge) {
      throw new ApiError(404, "Pledge not found");
    }

    // Ownership check
    let isAuthorized = false;
    if (userRole === Role.SUPER_ADMIN) {
      isAuthorized = true;
    } else if (userRole === Role.DONOR && pledge.donorId === userId) {
      isAuthorized = true;
    } else if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (user && user.shelterId === pledge.shelterId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(
        403,
        "Forbidden access: You are not authorized to view this pledge",
      );
    }

    return pledge;
  }

  async getPledgeByCode(code: string, userId: string, userRole: Role) {
    const pledge = await this.pledgeRepository.findByPledgeCode(code);
    if (!pledge) {
      throw new ApiError(404, "Pledge not found");
    }

    // Ownership check
    let isAuthorized = false;
    if (userRole === Role.SUPER_ADMIN) {
      isAuthorized = true;
    } else if (userRole === Role.DONOR && pledge.donorId === userId) {
      isAuthorized = true;
    } else if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (user && user.shelterId === pledge.shelterId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(
        403,
        "Forbidden access: You are not authorized to view this pledge",
      );
    }

    return pledge;
  }

  async getMyPledges(donorId: string) {
    return this.pledgeRepository.findByDonorId(donorId);
  }

  async getShelterPledges(shelterId: string, userId: string, userRole: Role) {
    // Authorization Check
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (!user || user.shelterId !== shelterId) {
        throw new ApiError(
          403,
          "Forbidden access: You are not authorized to view this shelter's pledges",
        );
      }
    }

    return this.pledgeRepository.findByShelterId(shelterId);
  }

  async getAllPledges() {
    return this.pledgeRepository.getAllPledges();
  }

  async verifyAndFulfillPledge(
    pledgeCode: string,
    userId: string,
    userRole: Role,
    data: Omit<VerifyPledgeInput, "pledgeCode">,
  ) {
    const pledge = await this.pledgeRepository.findByPledgeCode(pledgeCode);
    if (!pledge) {
      throw new ApiError(404, "Pledge not found");
    }

    if (pledge.status !== PledgeStatus.RESERVED) {
      throw new ApiError(
        400,
        `Pledge cannot be fulfilled. Current status is ${pledge.status}`,
      );
    }

    // Auth Check
    if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (!user || user.shelterId !== pledge.shelterId) {
        throw new ApiError(
          403,
          "Forbidden access: You are not authorized to fulfill pledges for this shelter",
        );
      }
    }

    // Execute drop-off verification atomically
    return prisma.$transaction(async (tx) => {
      // 1. Decrement reserved quantity and increment delivered quantity on all items
      for (const pledgeItem of pledge.items) {
        await tx.requestedItem.update({
          where: { id: pledgeItem.requestedItemId },
          data: {
            quantityReserved: {
              decrement: pledgeItem.quantityPledged,
            },
            quantityDelivered: {
              increment: pledgeItem.quantityPledged,
            },
          },
        });
      }

      // 2. Increment donor trust score (pledgesCompleted)
      await tx.user.update({
        where: { id: pledge.donorId },
        data: {
          pledgesCompleted: { increment: 1 },
        },
      });

      // 3. Update Pledge status to DELIVERED
      const updatedPledge = await tx.pledge.update({
        where: { id: pledge.id },
        data: {
          status: PledgeStatus.DELIVERED,
          fulfilledAt: new Date(),
          impactPhotoUrl: data.impactPhotoUrl || null,
          shelterThankYouNote: data.shelterThankYouNote || null,
        },
      });

      // 4. Check if the entire ShelterRequest is now fully delivered/fulfilled
      const requestedItemIds = pledge.items.map((item) => item.requestedItemId);
      const updatedItems = await tx.requestedItem.findMany({
        where: { id: { in: requestedItemIds } },
        select: { requestId: true },
      });
      const requestId = updatedItems[0]?.requestId;

      if (requestId) {
        // Fetch all requested items for this request
        const allItemsInRequest = await tx.requestedItem.findMany({
          where: { requestId },
        });

        // Check if every item has quantityDelivered >= quantityNeeded
        const allFulfilled = allItemsInRequest.every(
          (item) => item.quantityDelivered >= item.quantityNeeded,
        );

        if (allFulfilled) {
          // Update the request status to FULFILLED
          await tx.shelterRequest.update({
            where: { id: requestId },
            data: { status: "FULFILLED" },
          });
        }
      }

      return updatedPledge;
    });
  }

  async cancelPledge(id: string, userId: string, userRole: Role) {
    const pledge = await this.pledgeRepository.findById(id);
    if (!pledge) {
      throw new ApiError(404, "Pledge not found");
    }

    if (pledge.status !== PledgeStatus.RESERVED) {
      throw new ApiError(
        400,
        `Pledge cannot be cancelled. Current status is ${pledge.status}`,
      );
    }

    // Auth Check
    let isAuthorized = false;
    if (userRole === Role.SUPER_ADMIN) {
      isAuthorized = true;
    } else if (userRole === Role.DONOR && pledge.donorId === userId) {
      isAuthorized = true;
    } else if (userRole === Role.SHELTER_ADMIN) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shelterId: true },
      });
      if (user && user.shelterId === pledge.shelterId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ApiError(
        403,
        "Forbidden access: You are not authorized to cancel this pledge",
      );
    }

    return prisma.$transaction(async (tx) => {
      // 1. Decrement quantityReserved from all requested items
      for (const pledgeItem of pledge.items) {
        await tx.requestedItem.update({
          where: { id: pledgeItem.requestedItemId },
          data: {
            quantityReserved: {
              decrement: pledgeItem.quantityPledged,
            },
          },
        });
      }

      // 2. Mark pledge as CANCELLED
      return tx.pledge.update({
        where: { id: pledge.id },
        data: {
          status: PledgeStatus.CANCELLED,
        },
      });
    });
  }

  /**
   * Scans and processes expired active pledges.
   * Can be invoked via a cron scheduler endpoint or automated background tasks.
   */
  async expireExpiredPledges() {
    const now = new Date();
    const expiredPledges = await this.pledgeRepository.findActiveExpired(now);

    console.log(`Processing ${expiredPledges.length} expired pledges...`);

    const results = [];
    for (const pledge of expiredPledges) {
      try {
        const updated = await prisma.$transaction(async (tx) => {
          // Re-verify status inside transaction and include items
          const currentPledge = await tx.pledge.findUnique({
            where: { id: pledge.id },
            include: { items: true },
          });

          if (
            !currentPledge ||
            currentPledge.status !== PledgeStatus.RESERVED
          ) {
            return null;
          }

          // 1. Decrement reserved quantity from all requested items
          for (const pledgeItem of currentPledge.items) {
            await tx.requestedItem.update({
              where: { id: pledgeItem.requestedItemId },
              data: {
                quantityReserved: {
                  decrement: pledgeItem.quantityPledged,
                },
              },
            });
          }

          // 2. Increment donor trust metric (pledgesExpired)
          await tx.user.update({
            where: { id: currentPledge.donorId },
            data: {
              pledgesExpired: { increment: 1 },
            },
          });

          // 3. Mark pledge as EXPIRED
          return tx.pledge.update({
            where: { id: pledge.id },
            data: {
              status: PledgeStatus.EXPIRED,
            },
          });
        });

        if (updated) {
          results.push(updated);
        }
      } catch (err) {
        console.error(`Failed to expire pledge ${pledge.id}:`, err);
      }
    }

    return results;
  }

  async purgeAllPledges() {
    return this.pledgeRepository.purgeAllPledges();
  }
}
