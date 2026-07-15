import type { ImageStorage } from "./storage/index.js";

/** Removes every URL in `oldImages` that's no longer present in `newImages`. */
export async function removeStaleImages(storage: ImageStorage, oldImages: string[] = [], newImages: string[] = []) {
  const stale = oldImages.filter((img) => !newImages.includes(img));
  await Promise.all(stale.map((img) => storage.remove(img)));
}
