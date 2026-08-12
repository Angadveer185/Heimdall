import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const defaultRequestedItemSelect = Prisma.validator<Prisma.RequestedItemSelect>()({
    id: true,
    requestId: true,
    globalItemId: true,
    quantityNeeded: true,
    quantityReserved: true,
    quantityDelivered: true,
    unit: true,
    notes: true,
    createdAt: true,
    updatedAt: true,
});

export class RequestedItemRepository {
    async create(data: Prisma.RequestedItemUncheckedCreateInput) {
        return prisma.requestedItem.create({
            data,
            select: defaultRequestedItemSelect
        })
    }

    async findById(id: string) {
        return prisma.requestedItem.findUnique({
            where: { id },
            select: defaultRequestedItemSelect
        })
    }

    async getAllItems() {
        return prisma.requestedItem.findMany({
            select: defaultRequestedItemSelect
        })
    }

    async updateById(id: string, data: Prisma.RequestedItemUncheckedUpdateInput) {
        return prisma.requestedItem.update({
            where: { id },
            data,
            select: defaultRequestedItemSelect
        })
    }

    async deleteById(id: string) {
        return prisma.requestedItem.delete({
            where: { id },
            select: defaultRequestedItemSelect
        })
    }

    async purgeAllItems() {
        return prisma.requestedItem.deleteMany()
    }
}