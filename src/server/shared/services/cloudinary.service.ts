import cloudinary from "@/server/config/cloudinary";

export class CloudinaryService {
  /**
   * Generates a SHA-1 upload signature for signed client-side uploads.
   * @param params Object containing parameters to sign (e.g., { timestamp, folder })
   */
  static generateUploadSignature(params: Record<string, string | number>): string {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      throw new Error("CLOUDINARY_API_SECRET environment variable is missing");
    }
    return cloudinary.utils.api_sign_request(params, apiSecret);
  }

  /**
   * Deletes an image from Cloudinary by its public ID.
   * @param publicId Cloudinary asset public ID
   */
  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("Failed to delete image from Cloudinary");
    }
  }

  /**
   * Generates a transformed/optimized Cloudinary URL on the fly.
   * @param url The raw Cloudinary image URL stored in DB
   * @param options Dynamic transformation parameters
   */
  static getOptimizedImageUrl(
    url: string | null | undefined,
    options: { width?: number; height?: number; crop?: string; quality?: string } = {}
  ): string {
    if (!url) return "";
    if (!url.includes("cloudinary.com")) return url;

    const { width = 800, height, crop = "limit", quality = "auto" } = options;
    const heightSegment = height ? `,h_${height}` : "";
    const transformSegment = `w_${width}${heightSegment},c_${crop},q_${quality},f_auto`;

    return url.replace("/upload/", `/upload/${transformSegment}/`);
  }
}


