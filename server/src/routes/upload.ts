import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { processUpload } from "../lib/images.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

const ALLOWED_FOLDERS = new Set(["services", "plans", "projects", "blog", "digital-products", "misc"]);

// Buffer the file in memory (small admin uploads), then sharp re-encodes it.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB before processing
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

/** POST /api/admin/upload  (admin only) — field "image", optional "folder". Returns { url }. */
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
