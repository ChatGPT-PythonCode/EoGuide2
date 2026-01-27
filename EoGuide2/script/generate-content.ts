import { readdir, readFile, mkdir, writeFile, stat } from "fs/promises";
import path from "path";

type GuideMeta = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  /**
   * Relative folder path under `content/guides/` (empty for root-level files).
   * Example: `quests/Hallodale`.
   */
  folderPath?: string;
  /**
   * Convenience field for quest location folders.
   * If a guide lives under `quests/<Location>/...`, this becomes `<Location>`.
   */
  locationFolder?: string;
};

function parseFrontmatter(markdown: string): { data: Record<string, string>; body: string } {
  const trimmed = markdown.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: markdown };
  }

  const lines = trimmed.split(/\r?\n/);
  let i = 1;
  const fmLines: string[] = [];
  for (; i < lines.length; i++) {
    if (lines[i].trim() === "---") break;
    fmLines.push(lines[i]);
  }
  // If no closing delimiter, treat as no frontmatter.
  if (i >= lines.length) return { data: {}, body: markdown };

  const body = lines.slice(i + 1).join("\n");

  // Minimal YAML "key: value" parsing (good for Decap CMS simple fields).
  // Supports quoted values and empty values.
  const data: Record<string, string> = {};
  for (const line of fmLines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2] ?? "";
    value = value.trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const contentDir = path.resolve("content/guides");
  const outDir = path.resolve("client/public/data/guides");
  await mkdir(outDir, { recursive: true });

  async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const out: string[] = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...(await walk(full)));
      } else if (e.isFile() && e.name.endsWith(".md")) {
        out.push(full);
      }
    }
    return out;
  }

  const files = await walk(contentDir);

  const index: Array<GuideMeta & { createdAt?: string }> = [];

  for (const full of files) {
    const raw = await readFile(full, "utf-8");
    const { data, body } = parseFrontmatter(raw);

    const rel = path.relative(contentDir, full).replace(/\\/g, "/");
    const folderPath = path.posix.dirname(rel) === "." ? "" : path.posix.dirname(rel);

    // If content is organized like: quests/<Location>/<file>.md
    const segs = folderPath.split("/").filter(Boolean);
    const locationFolder = segs[0]?.toLowerCase() === "quests" && segs.length >= 2 ? segs[1] : undefined;

    const fileName = path.basename(full);
    const title = data.title || fileName.replace(/\.md$/, "");
    const slug = data.slug || slugify(title);
    const category = data.category || "misc";
    const summary = data.summary || "";
    const imageUrl = data.imageUrl || "";
    const videoUrl = data.videoUrl || "";
    let createdAt = data.createdAt || "";

    if (!createdAt) {
      const s = await stat(full);
      createdAt = s.mtime.toISOString();
    }

    const guideJson = {
      title,
      slug,
      category,
      summary,
      content: body.trim() + "\n",
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      createdAt,
      folderPath: folderPath || undefined,
      locationFolder,
    };

    await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify(guideJson, null, 2), "utf-8");

    index.push({
      title,
      slug,
      category,
      summary,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      createdAt,
      folderPath: folderPath || undefined,
      locationFolder,
    });
  }

  // Sort newest first when createdAt exists
  index.sort((a, b) => {
    const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bt - at;
  });

  await writeFile(path.join(outDir, `index.json`), JSON.stringify(index, null, 2), "utf-8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
