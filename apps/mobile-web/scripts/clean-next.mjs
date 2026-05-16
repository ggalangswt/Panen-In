import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");

const outputDirs = [".next", ".next-dev", ".next-build"];

await Promise.all(
  outputDirs.map((dir) =>
    rm(path.join(appDir, dir), {
      recursive: true,
      force: true,
    }),
  ),
);
