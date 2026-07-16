import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { processUpload } from "../lib/images.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

const ALLOWED_FOLDERS = new Set(["services", "plans", "projects", "blog", "digital-products", "misc"]);
// Explicit allowlist rather than "image/*" — the mimetype is client-supplied, so this only narrows what sharp is asked to parse.
const ALLOWED_MIMETYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

const upload = multer({
  storage: multer.memoryStorage(), // small admin uploads only; sharp re-encodes the buffer before it ever touches disk
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MIMETYPES.has(file.mimetype));
  },
});

/** POST /api/admin/upload (admin only) — field "image", optional "folder". Returns { url }. */
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No image file provided." });
    return;
  }

  const folderRaw = typeof req.body.folder === "string" ? req.body.folder : "misc";
  const folder = ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "misc";

  try {
    const { buffer, filename } = await processUpload(req.file.buffer);
    const url = await storage.save(folder, filename, buffer);
    res.status(201).json({ url });
  } catch {
    res.status(400).json({ error: "Could not process that image. Try a different file." });
  }
});

export default router;
