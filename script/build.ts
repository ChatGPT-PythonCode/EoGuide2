import { rm } from "fs/promises";
import { build as viteBuild } from "vite";

async function buildPages() {
  // Clean output
  await rm("dist", { recursive: true, force: true });

  // Generate static guide JSON (from content/guides/*.md)
  // Note: this runs as a separate script in npm, but leaving it here makes "tsx script/build.ts" work too.
  await import("./generate-content.ts");

  // Build the Vite client
  await viteBuild();
}

buildPages().catch((err) => {
  console.error(err);
  process.exit(1);
});
