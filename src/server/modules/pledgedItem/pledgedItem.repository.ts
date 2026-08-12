import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const defaultPledgedItemSelect = Prisma.validator<Prisma.PledgedItemSelect>()({
    id: true,
    pledgeId: true,
    requestedItemId: true,
    quantityPledged: true,
    createdAt: true,
    updatedAt: true,
})

export class PledgedItemRepository {
    async create(data: Prisma.PledgedItemUncheckedCreateInput) {
        return prisma.pledgedItem.create({
            data,
            select: defaultPledgedItemSelect
        })
    }

    async findById(id: string) {
        return prisma.pledgedItem.findUnique({
            where: { id },
            select: defaultPledgedItemSelect
        })
    }

    async getAllItems() {
        return prisma.pledgedItem.findMany({
            select: defaultPledgedItemSelect
        })
    }

    async updateById(id: string, data: Prisma.PledgedItemUncheckedUpdateInput) {
        return prisma.pledgedItem.update({
            where: { id },
            data,
            select: defaultPledgedItemSelect
        })
    }

    async deleteById(id: string) {
        return prisma.pledgedItem.delete({
            where: { id },
            select: defaultPledgedItemSelect
        })
    }

    async purgeAllItems() {
        return prisma.pledgedItem.deleteMany()
    }
}