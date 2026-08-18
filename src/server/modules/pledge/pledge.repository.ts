import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const defaultPledgeSelect = Prisma.validator<Prisma.PledgeSelect>()({
    id: true,
    pledgeCode: true,
    donorId: true,
    shelterId: true,
    shelter: {
        select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true,
            profileImageUrl: true,
            verificationStatus: true,
            organizationIdType: true,
            organizationId: true,
        }
    },
    items: {
        select: {
            id: true,
            requestedItemId: true,
            quantityPledged: true,
            requestedItem: {
                select: {
                    id: true,
                    requestId: true,
                    globalItemId: true,
                    globalItem: {
                        select: {
                            title: true,
                            defaultUnit: true,
                        }
                    }
                }
            }
        }
    },
    scheduledDropOffDate: true,
    impactPhotoUrl: true,
    shelterThankYouNote: true,
    status: true,
    fulfilledAt: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
})

export class PledgeRepository {
    async create(data: Prisma.PledgeCreateInput) {
        return prisma.pledge.create({
            data,
            select: defaultPledgeSelect,
        });
    }

    async findById(id: string) {
        return prisma.pledge.findUnique({
            where: { id },
            select: defaultPledgeSelect,
        });
    }

    async findByPledgeCode(pledgeCode: string) {
        return prisma.pledge.findUnique({
            where: { pledgeCode },
            select: defaultPledgeSelect,
        });
    }

    async findByDonorId(donorId: string) {
        return prisma.pledge.findMany({
            where: { donorId },
            select: defaultPledgeSelect,
        });
    }

    async findByShelterId(shelterId: string) {
        return prisma.pledge.findMany({
            where: { shelterId },
            select: defaultPledgeSelect,
        });
    }

    async getAllPledges() {
        return prisma.pledge.findMany({
            select: defaultPledgeSelect,
        });
    }

    async updateById(id: string, data: Prisma.PledgeUpdateInput) {
        return prisma.pledge.update({
            where: { id },
            data,
            select: defaultPledgeSelect,
        });
    }

    async deleteById(id: string) {
        return prisma.pledge.delete({
            where: { id },
            select: defaultPledgeSelect,
        });
    }

    async findActiveExpired(now: Date) {
        return prisma.pledge.findMany({
            where: {
                status: "RESERVED",
                expiresAt: {
                    lt: now,
                },
            },
            select: defaultPledgeSelect,
        });
    }

    async purgeAllPledges() {
        return prisma.pledge.deleteMany();
    }
}