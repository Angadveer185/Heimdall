import { ApiError } from "@/lib/errors";
import { CategoryRepository } from "./category.repository";
import {
  createCategoryInput,
  updateCategoryInput,
} from "./category.validation";

export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async createCategory(data: createCategoryInput) {
        const existingCategory = await this.categoryRepository.findByName(data.name);
        if (existingCategory) {
            throw new ApiError(409, "Category with this name already exists");
        }
        const category = await this.categoryRepository.create(data);

        return category;
    }

    async getCategoryById(id: string) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return category;
    }

    async getCategoryByName(name: string) {
        const category = await this.categoryRepository.findByName(name);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return category;
    }

    async getAllCategories() {
        return this.categoryRepository.getAllCategories();
    }

    async updateCategoryById(id: string, data: Omit<updateCategoryInput, "id">) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        if (data.name && data.name !== category.name) {
            const existingCategory = await this.categoryRepository.findByName(data.name);
            if (existingCategory) {
                throw new ApiError(409, "Category with this name already exists");
            }
        }

        const updatedCategory = await this.categoryRepository.updateById(id, data);
        return updatedCategory;
    }

    async deleteCategoryById(id: string) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        const deletedCategory = await this.categoryRepository.deleteById(id);
        return deletedCategory;
    }

    async purgeAllCategories() {
        return this.categoryRepository.purgeAllCategories();
    }
}