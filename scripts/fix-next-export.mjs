import { constants } from "node:fs";
import { copyFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const checkOnly = process.argv.includes("--check");
let checked = 0;
let copied = 0;

async function verify(source, target) {
  const [original, flattened] = await Promise.all([
    readFile(source),
    readFile(target),
  ]);
  if (!original.equals(flattened)) {
    throw new Error(`Export segment differs from its flat copy: ${target}`);
  }
  checked++;
}

async function flattenSegments(directory, routeDir, parts) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await flattenSegments(source, routeDir, [...parts, entry.name]);
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      const target = path.join(routeDir, [...parts, entry.name].join("."));
      if (!checkOnly) {
        try {
          await copyFile(source, target, constants.COPYFILE_EXCL);
          copied++;
        } catch (error) {
          if (error.code !== "EEXIST") throw error;
        }
      }
      await verify(source, target);
    }
  }
}

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = path.join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      // On Windows, Next 16 exports a dotted RSC URL as nested folders.
      // Keep its original files and add the flat paths requested by the client.
      await flattenSegments(child, directory, [entry.name]);
    } else if (entry.name !== "_next") {
      await visit(child);
    }
  }
}

await visit(outDir);
console.log(
  `Static export segments: ${checked} verified, ${copied} flat copies created.`,
);
