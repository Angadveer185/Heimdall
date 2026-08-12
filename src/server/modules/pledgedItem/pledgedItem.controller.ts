import { Request, Response, NextFunction } from "express";
import { PledgedItemService } from "./pledgedItem.service";
import {
    getPledgedItemSchema,
    createPledgedItemSchema,
    updatePledgedItemSchema,
    deletePledgedItemSchema
} from "./pledgedItem.validation";
import { ApiError } from "@/lib/errors";

export class PledgedItemController {
    private pledgedItemService: PledgedItemService;

    constructor(pledgedItemService: PledgedItemService) {
        this.pledgedItemService = pledgedItemService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ApiError(401, "Unauthorized: User not authenticated");
            }
            const validatedData = createPledgedItemSchema.parse(req.body);
            const pledgedItem = await this.pledgedItemService.createPledgedItem(
                validatedData,
                req.user.id,
                req.user.role
            );
            res.status(201).json({ success: true, data: pledgedItem });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ApiError(401, "Unauthorized: User not authenticated");
            }
            const { id } = getPledgedItemSchema.parse({ id: req.params.id });
            const pledgedItem = await this.pledgedItemService.getPledgedItemById(
                id,
                req.user.id,
                req.user.role
            );
            res.status(200).json({ success: true, data: pledgedItem });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const pledgedItems = await this.pledgedItemService.getAllPledgedItems();
            res.status(200).json({ success: true, data: pledgedItems });
        } catch (error) {
            next(error);
        }
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ApiError(401, "Unauthorized: User not authenticated");
            }
            const { id } = getPledgedItemSchema.parse({ id: req.params.id });
            const validatedData = updatePledgedItemSchema.parse(req.body);
            const updatedItem = await this.pledgedItemService.updatePledgedItemById(
                id,
                validatedData,
                req.user.id,
                req.user.role
            );
            res.status(200).json({ success: true, data: updatedItem });
        } catch (error) {
            next(error);
        }
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new ApiError(401, "Unauthorized: User not authenticated");
            }
            const { id } = deletePledgedItemSchema.parse({ id: req.params.id });
            const deletedItem = await this.pledgedItemService.deletePledgedItemById(
                id,
                req.user.id,
                req.user.role
            );
            res.status(200).json({ success: true, data: deletedItem });
        } catch (error) {
            next(error);
        }
    }

    async purgeAll(req: Request, res: Response, next: NextFunction) {
        try {
            await this.pledgedItemService.purgeAllPledgedItems();
            res.status(200).json({ success: true, message: "All pledged items have been purged" });
        } catch (error) {
            next(error);
        }
    }
}
