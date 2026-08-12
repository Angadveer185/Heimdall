import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const defaultGlobalItemSelect = Prisma.validator<Prisma.GlobalItemSelect>()({
  id: true,
  title: true,
  description: true,
  defaultUnit: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
});

export class ItemRepository {
    async create(data: Prisma.GlobalItemUncheckedCreateInput) {
        return prisma.globalItem.create({
            data,
            select: defaultGlobalItemSelect
        })
    }

    async findById(id: string) {
        return prisma.globalItem.findUnique({
            where: { id },
            select: defaultGlobalItemSelect
        })
    }

    async findByTitle(title: string) {
        return prisma.globalItem.findUnique({
            where: { title },
            select: defaultGlobalItemSelect
        })
    }

    async getAllItems() {
        return prisma.globalItem.findMany({
            select: defaultGlobalItemSelect
        })
    }

    async updateById(id: string, data: Prisma.GlobalItemUncheckedUpdateInput) {
        return prisma.globalItem.update({
            where: { id },
            data,
            select: defaultGlobalItemSelect
        })
    }

    async deleteById(id: string) {
        return prisma.globalItem.delete({
            where: { id },
            select: defaultGlobalItemSelect
        })
    }

    async purgeAllItems() {
        return prisma.globalItem.deleteMany()
    }
}