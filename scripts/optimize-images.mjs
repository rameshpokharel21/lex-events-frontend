import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const inputDir = join(__dirname, "../public/event-images");

const files = await readdir(inputDir);
const pngs = files.filter((f) => extname(f).toLowerCase() === ".png");

for (const file of pngs) {
  const inputPath = join(inputDir, file);
  const outputName = basename(file, ".png") + ".webp";
  const outputPath = join(inputDir, outputName);

  await sharp(inputPath)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  await unlink(inputPath);
  console.log(`${file} → ${outputName}`);
}

console.log(`\nDone. Converted ${pngs.length} images.`);
