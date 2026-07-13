import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ImageStorage } from "./types.js";
import { LocalDiskStorage } from "./localDisk.js";

export type { ImageStorage } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the uploads directory (server/uploads by default). */
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.resolve(__dirname, "../../../uploads");

/**
 * Selected storage backend. Add a "gcs" branch here (new GoogleCloudStorage
 * class implementing ImageStorage) when deploying to Cloud Run — nothing else
 * in the app changes.
 */
function createStorage(): ImageStorage {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  switch (driver) {
    case "local":
      return new LocalDiskStorage(UPLOADS_DIR);
    default:
      throw new Error(`Unknown STORAGE_DRIVER: ${driver}`);
  }
}

export const storage = createStorage();
