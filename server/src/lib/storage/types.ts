/**
 * Storage abstraction — lets us swap where uploaded images physically live without touching any
 * route/app code. "local" (LocalDiskStorage) works for dev and any host with a persistent disk;
 * "cloudinary" (CloudinaryStorage) is required for hosts with an ephemeral filesystem (Render,
 * Vercel, Cloud Run, ...). Selected via STORAGE_DRIVER in .env.
 */
export interface ImageStorage {
  /**
   * Persist an already-processed image buffer.
   * @param folder logical subfolder, e.g. "services"
   * @param filename final filename incl. extension, e.g. "abc123.webp"
   * @returns the public URL/path to store in the DB (e.g. "/uploads/services/abc123.webp")
   */
  save(folder: string, filename: string, data: Buffer): Promise<string>;

  /** Best-effort delete of a previously-saved image by its public URL/path. */
  remove(publicUrl: string): Promise<void>;
}
