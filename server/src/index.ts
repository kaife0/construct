import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import { UPLOADS_DIR } from "./lib/storage/index.js";
import healthRouter from "./routes/health.js";
import servicesRouter from "./routes/services.js";
import plansRouter from "./routes/plans.js";
import digitalProductCategoriesRouter from "./routes/digital-product-categories.js";
import digitalProductsRouter from "./routes/digital-products.js";
import blogCategoriesRouter from "./routes/blog-categories.js";
import blogPostsRouter from "./routes/blog-posts.js";
import inquiriesRouter from "./routes/inquiries.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";
import calculatorRatesRouter from "./routes/calculator-rates.js";

const app = express();

app.set("trust proxy", 1); // behind a proxy in production — needed for correct client IPs (rate limiting)

app.use(
  // crossOriginResourcePolicy is relaxed so the frontend (proxied, but a
  // different dev origin) can render images served from /uploads.
  helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })
);
app.use(
  cors({
    // The browser never calls this server cross-origin in normal use — the
    // Next.js frontend proxies /api/* and /uploads/* to here server-side (see
    // client's next.config.ts rewrites). This stays locked down for defense in depth.
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Uploaded images, served statically with long-lived caching (filenames are
// content-random, so they're safe to cache immutably).
app.use("/uploads", express.static(UPLOADS_DIR, { immutable: true, maxAge: "30d" }));

app.use("/api/health", healthRouter);
app.use("/api/services", servicesRouter);
app.use("/api/plans", plansRouter);
app.use("/api/digital-product-categories", digitalProductCategoriesRouter);
app.use("/api/digital-products", digitalProductsRouter);
app.use("/api/blog-categories", blogCategoriesRouter);
app.use("/api/blog-posts", blogPostsRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin/upload", uploadRouter);
app.use("/api/calculator-rates", calculatorRatesRouter);
// Further resources (projects, site-settings) are added as
// the admin panel's remaining CRUD screens are built.

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
