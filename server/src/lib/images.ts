import sharp from "sharp";
import { randomBytes } from "node:crypto";

const MAX_WIDTH = 1600; // plenty for full-bleed hero/detail images
const WEBP_QUALITY = 80;

/**
 * Re-encode an uploaded image to a capped-width WebP. Re-encoding also strips
 * EXIF metadata and any malicious payload smuggled into the original file, so
 * we never write attacker-controlled bytes straight to disk.
 * @returns processed buffer + a random, safe filename
 */
export async function processUpload(input: Buffer): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await sharp(input)
    .rotate() // respect EXIF orientation before stripping it
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return { buffer, filename: `${randomBytes(12).toString("hex")}.webp` };
}
