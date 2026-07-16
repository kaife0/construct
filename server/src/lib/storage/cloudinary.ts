import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { ImageStorage } from "./types.js";

/** Matches the public_id this driver assigns at upload time (`${folder}/${filename-without-extension}`) back out of a stored secure_url, so `remove` never needs the original folder/filename. */
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

/** Stores images on Cloudinary — required for hosts with an ephemeral filesystem (Render, Vercel, Cloud Run, ...). */
export class CloudinaryStorage implements ImageStorage {
  constructor() {
    cloudinary.config({
      cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: requireEnv("CLOUDINARY_API_KEY"),
      api_secret: requireEnv("CLOUDINARY_API_SECRET"),
      secure: true,
    });
  }

  async save(folder: string, filename: string, data: Buffer): Promise<string> {
    const publicId = `${folder}/${filename.replace(/\.[^.]+$/, "")}`;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ public_id: publicId, overwrite: false }, (err, res) =>
        err || !res ? reject(err ?? new Error("Cloudinary upload failed.")) : resolve(res)
      );
      stream.end(data);
    });
    return result.secure_url;
  }

  async remove(publicUrl: string): Promise<void> {
    const publicId = extractPublicId(publicUrl);
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      // Best-effort per the ImageStorage contract — a Cloudinary hiccup here must never fail the DB write/delete that already succeeded.
      console.error("[storage] failed to remove", publicUrl, err);
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — required when STORAGE_DRIVER=cloudinary.`);
  return value;
}
