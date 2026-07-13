/**
 * Storage abstraction — lets us swap where uploaded images physically live
 * without touching any route/app code. Local-disk is implemented now (works in
 * dev and on a Compute Engine VM with a persistent disk). A GoogleCloudStorage
 * implementation can be added later for Cloud Run (ephemeral disk) by
 * implementing this same interface and selecting it via STORAGE_DRIVER in .env.
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
