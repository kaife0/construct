/**
 * One-time / occasional CLI script to create or update an admin user.
 * There is no public signup route — this is the only way an admin account
 * gets created, deliberately.
 *
 * Usage:
 *   npm run seed:admin -- --email you@example.com --password "..." --name "Your Name"
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import { AdminUser } from "../models/index.js";
import { hashPassword } from "../lib/auth.js";

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = getArg("--email")?.trim().toLowerCase();
  const password = getArg("--password");
  const name = getArg("--name") ?? "Admin";

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- --email you@example.com --password "..." --name "Your Name"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const passwordHash = await hashPassword(password);
  const user = await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash, name },
    { upsert: true, new: true }
  );

  console.log(`[seed:admin] admin user ready: ${user.email} (${user.name})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed:admin] failed:", err);
  process.exit(1);
});
