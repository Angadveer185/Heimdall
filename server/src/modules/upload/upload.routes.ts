import { Router, Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../../shared/services/cloudinary.service";
import { authenticate } from "../../shared/middlewares/authenticate";
import { ApiError } from "@/lib/errors";

const router = Router();

/**
 * Valid target asset types for Cloudinary upload folders.
 * - 'profile': DONOR, SHELTER_ADMIN, SUPER_ADMIN profile pictures
 * - 'shelter': Shelter facility images and showcase photos
 * - 'impact': Drop-off / verification impact proof photos
 */
const FOLDER_MAP: Record<string, string> = {
  profile: "heimdall/profiles",
  shelter: "heimdall/shelters",
  "shelter-profile": "heimdall/shelters",
  "shelter-gallery": "heimdall/shelters",
  impact: "heimdall/impact-proofs",
};

/**
 * GET /api/upload/signature
 * Returns a signed token and metadata required for direct browser-to-Cloudinary uploads.
 * Requires user authentication.
 */
router.get(
  "/signature",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = (req.query.type as string) || "profile";
      const folder = FOLDER_MAP[type] || FOLDER_MAP.profile;

      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = { timestamp, folder };

      const signature = CloudinaryService.generateUploadSignature(paramsToSign);

      const apiKey = process.env.CLOUDINARY_API_KEY;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

      if (!apiKey || !cloudName) {
        throw new ApiError(500, "Cloudinary configuration environment variables missing");
      }

      res.status(200).json({
        success: true,
        data: {
          signature,
          timestamp,
          apiKey,
          cloudName,
          folder,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export const uploadRouter = router;
export default uploadRouter;

