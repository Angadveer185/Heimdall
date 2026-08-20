import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const defaultShelterRequestInclude = Prisma.validator<Prisma.ShelterRequestInclude>()({
  categories: {
    select: {
      id: true,
      name: true,
      icon: true,
    }
  },
  items: {
    include: {
      globalItem: {
        select: {
          id: true,
          title: true,
          defaultUnit: true,
        }
      }
    }
  },
  shelter: {
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      verificationStatus: true,
    }
  }
});

export class ShelterRequestRepository {
  async create(data: Prisma.ShelterRequestUncheckedCreateInput) {
    return prisma.shelterRequest.create({
      data,
      include: defaultShelterRequestInclude
    });
  }

  async findById(id: string) {
    return prisma.shelterRequest.findUnique({
      where: { id },
      include: defaultShelterRequestInclude
    });
  }

  async getAll() {
    return prisma.shelterRequest.findMany({
      include: defaultShelterRequestInclude
    });
  }

  async updateById(id: string, data: Prisma.ShelterRequestUncheckedUpdateInput) {
    return prisma.shelterRequest.update({
      where: { id },
      data,
      include: defaultShelterRequestInclude
    });
  }

  async deleteById(id: string) {
    return prisma.shelterRequest.delete({
      where: { id },
      include: defaultShelterRequestInclude
    });
  }

  async purgeAll() {
    return prisma.shelterRequest.deleteMany();
  }
}
