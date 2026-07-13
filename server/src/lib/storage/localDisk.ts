import { promises as fs } from "node:fs";
import path from "node:path";
import type { ImageStorage } from "./types.js";

/**
 * Stores images on the local filesystem under UPLOADS_DIR (default: server/uploads),
 * served statically by Express at /uploads. The public URL stored in the DB is a
 * root-relative path like "/uploads/services/abc123.webp" — the frontend proxies
 * /uploads/* to this server so the same path works in dev and production.
 */
export class LocalDiskStorage implements ImageStorage {
  private root: string;
  private publicBase = "/uploads";

  constructor(root: string) {
    this.root = root;
  }

  async save(folder: string, filename: string, data: Buffer): Promise<string> {
    const dir = path.join(this.root, folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), data);
    return `${this.publicBase}/${folder}/${filename}`;
  }

  async remove(publicUrl: string): Promise<void> {
    if (!publicUrl.startsWith(`${this.publicBase}/`)) return;
    const relative = publicUrl.slice(this.publicBase.length + 1);
    // Guard against path traversal from a tampered DB value.
    const target = path.resolve(this.root, relative);
    if (!target.startsWith(path.resolve(this.root))) return;
    await fs.rm(target, { force: true });
  }
}
