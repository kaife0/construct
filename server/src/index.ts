import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import healthRouter from "./routes/health.js";
import servicesRouter from "./routes/services.js";
import authRouter from "./routes/auth.js";

const app = express();

app.set("trust proxy", 1); // behind Nginx in production — needed for correct client IPs (rate limiting)

app.use(helmet());
app.use(
  cors({
    // The browser never calls this server cross-origin in normal use — the
    // Next.js frontend proxies /api/* to here server-side (see client's
    // next.config.ts rewrites). This stays locked down for defense in depth.
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/services", servicesRouter);
app.use("/api/auth", authRouter);
// Further resources (plans, projects, blog, inquiries, calculator-rates,
// site-settings) are added as the admin panel's CRUD screens are built.

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
