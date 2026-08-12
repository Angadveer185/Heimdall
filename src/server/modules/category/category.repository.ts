import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { defaultGlobalItemSelect } from "../globalItem/globalItem.repository";

export const defaultCategorySelect = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  name: true,
  icon: true,
  description: true,
  items: {
    select: defaultGlobalItemSelect,
  },
});

export class CategoryRepository {
  async create(data: Omit<Prisma.CategoryCreateInput, "items">) {
    return prisma.category.create({
      data,
      select: defaultCategorySelect,
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      select: defaultCategorySelect,
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
      select: defaultCategorySelect,
    });
  }

  async getAllCategories() {
    return prisma.category.findMany({
      select: defaultCategorySelect,
    });
  }

  async updateById(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
      select: defaultCategorySelect,
    });
  }

  async deleteById(id: string) {
    return prisma.category.delete({
      where: { id },
      select: defaultCategorySelect,
    });
  }

  async purgeAllCategories() {
    return prisma.category.deleteMany();
  }
}
