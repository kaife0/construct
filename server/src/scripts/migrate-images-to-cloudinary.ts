/**
 * One-time migration: uploads every locally-stored image (server/uploads/**)
 * to Cloudinary and rewrites the referencing DB documents to the new URLs.
 * Idempotent — already-migrated (non "/uploads/…") URLs are left untouched,
 * so it's safe to re-run if it's interrupted partway through.
 *
 * Requires CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in .env (regardless of
 * the current STORAGE_DRIVER — this script talks to Cloudinary directly).
 * Run this once, then set STORAGE_DRIVER=cloudinary before deploying.
 *
 * Usage: npm run migrate:images-to-cloudinary
 */
import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import mongoose, { type Model } from "mongoose";
import { connectDB } from "../db.js";
import { UPLOADS_DIR } from "../lib/storage/index.js";
import { CloudinaryStorage } from "../lib/storage/cloudinary.js";
import { Service, Plan, Project, BlogPost, DigitalProduct, DigitalProductCategory } from "../models/index.js";

const cloudinary = new CloudinaryStorage();

async function migrateUrl(url: string | undefined): Promise<string | undefined> {
  if (!url || !url.startsWith("/uploads/")) return url;
  const [folder, ...rest] = url.slice("/uploads/".length).split("/");
  const filename = rest.join("/");
  const buffer = await fs.readFile(path.join(UPLOADS_DIR, folder, filename));
  return cloudinary.save(folder, filename, buffer);
}

async function migrateDoc(doc: any, fields: string[]): Promise<boolean> {
  let changed = false;
  for (const field of fields) {
    const value = doc[field];
    if (typeof value === "string") {
      const migrated = await migrateUrl(value);
      if (migrated && migrated !== value) {
        doc[field] = migrated;
        changed = true;
      }
    } else if (Array.isArray(value)) {
      const migrated = await Promise.all(value.map((v: string) => migrateUrl(v)));
      if (migrated.some((v, i) => v !== value[i])) {
        doc[field] = migrated;
        changed = true;
      }
    }
  }
  if (changed) await doc.save();
  return changed;
}

async function migrateModel(model: Model<any>, fields: string[], label: string) {
  const docs = await model.find();
  let updated = 0;
  for (const doc of docs) {
    if (await migrateDoc(doc, fields)) updated++;
  }
  console.log(`[migrate-images] ${label}: ${updated}/${docs.length} updated`);
}

async function main() {
  await connectDB();
  await migrateModel(Service, ["image"], "Services");
  await migrateModel(Plan, ["image", "images"], "Plans");
  await migrateModel(Project, ["image", "images"], "Projects");
  await migrateModel(BlogPost, ["image"], "Blog posts");
  await migrateModel(DigitalProductCategory, ["image"], "Digital product categories");
  await migrateModel(DigitalProduct, ["image", "images"], "Digital products");
  console.log("[migrate-images] done. Existing files in server/uploads/ are untouched — delete them once you've verified the site on Cloudinary URLs.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[migrate-images] failed:", err);
  process.exit(1);
});
