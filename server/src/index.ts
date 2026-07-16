import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import { UPLOADS_DIR } from "./lib/storage/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";
import servicesRouter from "./routes/services.js";
import plansRouter from "./routes/plans.js";
import digitalProductCategoriesRouter from "./routes/digital-product-categories.js";
import digitalProductsRouter from "./routes/digital-products.js";
import projectsRouter from "./routes/projects.js";
import blogCategoriesRouter from "./routes/blog-categories.js";
import blogPostsRouter from "./routes/blog-posts.js";
import inquiriesRouter from "./routes/inquiries.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import calculatorRatesRouter from "./routes/calculator-rates.js";
import siteSettingsRouter from "./routes/site-settings.js";

const app = express();

app.set("trust proxy", 1); // behind a proxy in production — needed for correct client IPs (rate limiting)

// crossOriginResourcePolicy relaxed so the frontend's dev origin can render /uploads images.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Locked to CORS_ORIGIN for defense in depth; the frontend proxies /api and /uploads server-side in normal use.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Uploaded images, served statically with long-lived caching (filenames are content-random, so caching immutably is safe).
app.use("/uploads", express.static(UPLOADS_DIR, { immutable: true, maxAge: "30d" }));

// Baseline abuse guard for every API route; endpoints with tighter needs (login, inquiries) layer their own limiter on top.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/api/health", healthRouter);
app.use("/api/services", servicesRouter);
app.use("/api/plans", plansRouter);
app.use("/api/digital-product-categories", digitalProductCategoriesRouter);
app.use("/api/digital-products", digitalProductsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/blog-categories", blogCategoriesRouter);
app.use("/api/blog-posts", blogPostsRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin/upload", uploadRouter);
app.use("/api/calculator-rates", calculatorRatesRouter);
app.use("/api/site-settings", siteSettingsRouter);

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  await connectDB();
  app.listen(PORT);
}

main().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
