import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    result[key] = value;
  }
  return result;
}

function resolveEnv() {
  const envLocal = readEnvFile(path.join(rootDir, ".env.local"));
  const envFile = readEnvFile(path.join(rootDir, ".env"));
  return {
    NEXT_PUBLIC_CONVEX_URL:
      process.env.NEXT_PUBLIC_CONVEX_URL ??
      envLocal.NEXT_PUBLIC_CONVEX_URL ??
      envFile.NEXT_PUBLIC_CONVEX_URL,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? envLocal.ADMIN_EMAILS ?? envFile.ADMIN_EMAILS ?? "",
  };
}

async function main() {
  const env = resolveEnv();

  const emails = Array.from(
    new Set(
      env.ADMIN_EMAILS.split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  const result = spawnSync(
    "npx",
    ["convex", "run", "admins:syncAdminEmails", "{}"],
    {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_CONVEX_URL: env.NEXT_PUBLIC_CONVEX_URL },
    },
  );

  if (result.status !== 0) {
    throw new Error("Failed to sync admin emails to Convex.");
  }

  console.log(`Synced ${emails.length} admin email(s) from ADMIN_EMAILS.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Failed to sync admin emails.");
  process.exit(1);
});
