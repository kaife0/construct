import { promises as fs } from "node:fs";
import path from "node:path";
import type { ImageStorage } from "./types.js";

/** Stores images on disk under UPLOADS_DIR, served statically at /uploads (see storage/index.ts). */
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
    try {
      if (!publicUrl.startsWith(`${this.publicBase}/`)) return;
      const relative = publicUrl.slice(this.publicBase.length + 1);
      const root = path.resolve(this.root);
      const target = path.resolve(root, relative);
      // Reject traversal outside root; the sep suffix avoids a sibling dir like "uploads-evil" false-passing startsWith.
      if (target !== root && !target.startsWith(root + path.sep)) return;
      await fs.rm(target, { force: true });
    } catch (err) {
      console.error("[storage] failed to remove", publicUrl, err); // best-effort cleanup — must not fail the caller's DB write
    }
  }
}
