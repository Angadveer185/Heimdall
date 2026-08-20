/**
 * Frontend Cloudinary Upload Helper
 * Handles direct browser-to-Cloudinary uploads using signed requests.
 */

export type UploadCategory =
  | "profile"
  | "shelter-profile"
  | "shelter-gallery"
  | "impact";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Direct signed upload to Cloudinary from client-side code with optional automatic DB record update.
 * @param file The image File object from input element
 * @param type The category ('profile' | 'shelter-profile' | 'shelter-gallery' | 'impact')
 * @param targetId Optional ID of target record (userId, shelterId, or pledgeId) to update in DB
 */
export async function uploadImageToCloudinary(
  file: File,
  type: UploadCategory = "profile",
  targetId?: string,
): Promise<CloudinaryUploadResult> {
  // 1. Fetch signature & configuration parameters from Express API
  const sigRes = await fetch(`/api/upload/signature?type=${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const sigData = await sigRes.json();

  if (!sigRes.ok || !sigData.success) {
    throw new Error(
      sigData.message || "Failed to retrieve upload authorization signature",
    );
  }

  const { signature, timestamp, apiKey, cloudName, folder } = sigData.data;

  // 2. Prepare FormData for direct Cloudinary POST
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. Upload file directly from browser to Cloudinary CDN
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const uploadData = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(
      uploadData.error?.message || "Failed to upload image to Cloudinary",
    );
  }

  // 4. Update MongoDB record (defaults targetId to "me" for profile uploads)
  const effectiveTargetId = targetId || (type === "profile" ? "me" : undefined);

  if (effectiveTargetId) {
    let dbEndpoint = "";
    let payload: Record<string, any> = {};

    switch (type) {
      case "profile":
        dbEndpoint = `/api/users/${effectiveTargetId}`;
        payload = { profileImageUrl: uploadData.secure_url };
        break;

      case "shelter-profile":
        dbEndpoint = `/api/shelters/${effectiveTargetId}`;
        payload = { profileImageUrl: uploadData.secure_url };
        break;

      case "shelter-gallery":
        dbEndpoint = `/api/shelters/${effectiveTargetId}`;
        payload = { appendShelterImage: uploadData.secure_url };
        break;

      case "impact":
        dbEndpoint = `/api/pledges/${effectiveTargetId}`;
        payload = { impactPhotoUrl: uploadData.secure_url };
        break;
    }

    if (dbEndpoint) {
      const dbRes = await fetch(dbEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!dbRes.ok) {
        const dbErrorData = await dbRes.json();
        throw new Error(
          dbErrorData.message || "Failed to update database with Cloudinary URL",
        );
      }
    }
  }

  return {
    secureUrl: uploadData.secure_url,
    publicId: uploadData.public_id,
    format: uploadData.format,
    width: uploadData.width,
    height: uploadData.height,
  };
}

/**
 * Builds an optimized Cloudinary image URL with dynamic transformations (e.g., thumbnail crop, webp auto format, resizing).
 * @param url The stored raw Cloudinary URL (e.g. user.profileImageUrl or shelter.shelterImages[i])
 * @param options Transformation parameters (width, height, crop mode, quality)
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {},
): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  const { width = 800, height, crop = "limit", quality = "auto" } = options;
  const heightSegment = height ? `,h_${height}` : "";
  const transformSegment = `w_${width}${heightSegment},c_${crop},q_${quality},f_auto`;

  return url.replace("/upload/", `/upload/${transformSegment}/`);
}
