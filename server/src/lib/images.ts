import sharp from "sharp";
import { randomBytes } from "node:crypto";

const MAX_WIDTH = 1600; // plenty for full-bleed hero/detail images
const WEBP_QUALITY = 80;
const MAX_INPUT_PIXELS = 40_000_000; // ~40MP cap guards against decompression-bomb images

/** Re-encodes an upload to a capped-width WebP, stripping EXIF and any malicious payload smuggled in the original bytes. */
export async function processUpload(input: Buffer): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" })
    .rotate() // respect EXIF orientation before stripping it
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return { buffer, filename: `${randomBytes(12).toString("hex")}.webp` };
}
