import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");

const [command = "dev", distDir = ".next"] = process.argv.slice(2);

const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/c", "pnpm", "exec", "next", command], {
        cwd: appDir,
        env: {
          ...process.env,
          NEXT_DIST_DIR: distDir,
        },
        stdio: "inherit",
      })
    : spawn("pnpm", ["exec", "next", command], {
        cwd: appDir,
        env: {
          ...process.env,
          NEXT_DIST_DIR: distDir,
        },
        stdio: "inherit",
      });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
