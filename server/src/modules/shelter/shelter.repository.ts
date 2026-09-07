import { prisma } from "@/lib/prisma";
import { Prisma, Role, VerificationStatus } from "@prisma/client";

// Define a reusable selector to keep query selections consistent across methods

const defaultShelterSelect = Prisma.validator<Prisma.ShelterSelect>()({
  id: true,
  name: true,
  country: true,
  organizationIdType: true,
  organizationId: true,
  verificationStatus: true,
  rejectionReason: true,
  description: true,
  street: true,
  city: true,
  state: true,
  zip: true,
  longitude: true,
  latitude: true,
  dropOffHours: true,
  contactEmail: true,
  phone: true,
  website: true,
  profileImageUrl: true,
  shelterImages: true,
  createdAt: true,
  updatedAt: true,
});

export class ShelterRepository {
    async create(
        data: Omit<Prisma.ShelterCreateInput, "admins">,
        userId: string,
        verificationStatus: VerificationStatus = VerificationStatus.PENDING,
        rejectionReason?: string | null
    ) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        const isSuperAdmin = user?.role === Role.SUPER_ADMIN;

        return prisma.$transaction(async (tx) => {
            const shelter = await tx.shelter.create({
                data: {
                    ...data,
                    verificationStatus,
                    rejectionReason: rejectionReason ?? null,
                    admins: {
                        connect: { id: userId },
                    },
                },
                select: defaultShelterSelect,
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    shelterId: shelter.id,
                    ...(isSuperAdmin ? {} : { role: Role.SHELTER_ADMIN }),
                },
            });

            return shelter;
        });
    }

    async findById(id: string) {
        return prisma.shelter.findUnique({
            where: { id },
            select: defaultShelterSelect,
        });
    }

    async findByOrganizationId(organizationId: string) {
        return prisma.shelter.findUnique({
            where: { organizationId },
            select: defaultShelterSelect,
        });
    }

    async getAllShelters() {
        return prisma.shelter.findMany({
            select: defaultShelterSelect,
        });
    }

    async updateById(id: string, data: Prisma.ShelterUpdateInput) {
        return prisma.shelter.update({
            where: { id },
            data,
            select: defaultShelterSelect,
        });
    }

    async updateVerificationStatusById(id: string, status: VerificationStatus) {
        return prisma.shelter.update({
            where: { id },
            data: { verificationStatus: status },
            select: defaultShelterSelect,
        });
    }

    async deleteById(id: string) {
        return prisma.shelter.delete({
            where: { id },
            select: defaultShelterSelect,
        });
    }

    async purgeAllShelters() {
        return prisma.shelter.deleteMany();
    }
}