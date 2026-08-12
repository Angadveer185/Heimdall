import { ApiError } from "@/lib/errors";
import { ItemRepository } from "./globalItem.repository";
import { CreateItemInput, UpdateItemInput } from "./globalItem.validation";
import { prisma } from "@/lib/prisma";

export class ItemService {
    private itemRepository: ItemRepository;

    constructor(itemRepository: ItemRepository) {
        this.itemRepository = itemRepository;
    }

    async createItem(data: CreateItemInput) {
        // Check uniqueness of title
        const existingItem = await this.itemRepository.findByTitle(data.title);
        if (existingItem) {
            throw new ApiError(409, "Global item with this title already exists");
        }

        // Verify category exists if provided
        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!category) {
                throw new ApiError(400, "Category not found");
            }
        }

        const item = await this.itemRepository.create(data);
        return item;
    }

    async getItemById(id: string) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }
        return item;
    }

    async getAllItems() {
        return this.itemRepository.getAllItems();
    }

    async updateItemById(id: string, data: UpdateItemInput) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        if (data.title && data.title !== item.title) {
            const existingItem = await this.itemRepository.findByTitle(data.title);
            if (existingItem) {
                throw new ApiError(409, "Global item with this title already exists");
            }
        }

        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId }
            });
            if (!category) {
                throw new ApiError(400, "Category not found");
            }
        }

        const updatedItem = await this.itemRepository.updateById(id, data);
        return updatedItem;
    }

    async deleteItemById(id: string) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }
        return this.itemRepository.deleteById(id);
    }

    async purgeAllItems() {
        return this.itemRepository.purgeAllItems();
    }
}