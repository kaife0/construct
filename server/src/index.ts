import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import healthRouter from "./routes/health.js";
import servicesRouter from "./routes/services.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/services", servicesRouter);
// Further resources (plans, projects, blog, inquiries, calculator-rates,
// site-settings) and admin auth are added alongside the admin panel.

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function main() {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
