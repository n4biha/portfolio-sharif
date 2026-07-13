import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAW_DIR = path.resolve("public/images/smiski-footer/raw");
const OUTPUT_DIR = path.resolve("public/images/smiski-footer");
const KEY = [255, 0, 255];
const CLEAR_DISTANCE = 34;
const OPAQUE_DISTANCE = 118;
const PADDING = 20;
const BOUNDS_ALPHA = 128;
const BOUNDS_MARGIN = 8;

const expected = [
  "smiski-berkeley-raw.png",
  "smiski-coding-raw.png",
  "smiski-artist-raw.png",
  "smiski-music-raw.png",
  "smiski-hanging-raw.png",
  "smiski-data-raw.png",
  "smiski-reading-raw.png",
  "smiski-waving-raw.png",
  "smiski-lounging-raw.png",
  "smiski-peeking-raw.png",
  "smiski-title-sitter-raw.png",
  "smiski-resume-raw.png",
];

const distanceFromKey = (r, g, b) =>
  Math.hypot(r - KEY[0], g - KEY[1], b - KEY[2]);

function outputName(filename) {
  return filename.replace(/-raw\.png$/i, ".png");
}

function findArtworkBounds(data, info, label) {
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < BOUNDS_ALPHA) continue;
    const pixel = i / 4;
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  if (maxX < minX || maxY < minY) {
    throw new Error(`${label}: no high-confidence artwork bounds found`);
  }

  const left = Math.max(0, minX - BOUNDS_MARGIN);
  const top = Math.max(0, minY - BOUNDS_MARGIN);
  const right = Math.min(info.width - 1, maxX + BOUNDS_MARGIN);
  const bottom = Math.min(info.height - 1, maxY + BOUNDS_MARGIN);

  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function processImage(filename) {
  const inputPath = path.join(RAW_DIR, filename);
  const outputPath = path.join(OUTPUT_DIR, outputName(filename));
  const image = sharp(inputPath).ensureAlpha();
  const metadata = await image.metadata();

  if (metadata.format !== "png" || metadata.width !== 1024 || metadata.height !== 1024) {
    throw new Error(`${filename}: expected a 1024 x 1024 PNG source`);
  }

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  let sourceGreenPixels = 0;
  let retainedGreenPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const originalAlpha = data[i + 3];
    const distance = distanceFromKey(r, g, b);

    const isArtworkGreen = g > r + 4 && g > b + 12 && distance > OPAQUE_DISTANCE;
    if (isArtworkGreen) sourceGreenPixels += 1;

    if (distance <= CLEAR_DISTANCE) {
      data[i + 3] = 0;
      continue;
    }

    if (distance < OPAQUE_DISTANCE) {
      const matte = (distance - CLEAR_DISTANCE) / (OPAQUE_DISTANCE - CLEAR_DISTANCE);
      const eased = matte * matte * (3 - 2 * matte);
      data[i + 3] = Math.round(originalAlpha * eased);

      // Remove the red/blue magenta cast from antialiased edge pixels without
      // changing their green channel or opaque artwork colours.
      const spill = Math.max(0, Math.min(r, b) - g) * (1 - eased);
      data[i] = Math.max(0, Math.round(r - spill));
      data[i + 2] = Math.max(0, Math.round(b - spill));
    }

    if (isArtworkGreen && data[i + 3] >= 220) retainedGreenPixels += 1;
  }

  if (sourceGreenPixels < 500 || retainedGreenPixels / sourceGreenPixels < 0.96) {
    throw new Error(`${filename}: green artwork retention check failed`);
  }

  // Crop from pixels with substantial alpha rather than any non-zero alpha.
  // This preserves the antialiased fringe around the artwork while ignoring
  // faint keyed-background specks that would otherwise create oversized hitboxes.
  const artworkBounds = findArtworkBounds(data, info, filename);
  const keyed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract(artworkBounds)
    .extend({
      top: PADDING,
      right: PADDING,
      bottom: PADDING,
      left: PADDING,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  await sharp(keyed).toFile(outputPath);
  await validateOutput(outputPath, filename);
}

async function validateOutput(outputPath, label) {
  const image = sharp(outputPath).ensureAlpha();
  const metadata = await image.metadata();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  let visible = 0;
  let visibleMagenta = 0;
  let green = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) transparent += 1;
    if (a > 24) {
      visible += 1;
      if (distanceFromKey(r, g, b) < 70) visibleMagenta += 1;
      if (g > r + 4 && g > b + 12) green += 1;
    }
  }

  const pixels = info.width * info.height;
  const failures = [
    metadata.format !== "png" && "not PNG",
    metadata.hasAlpha !== true && "missing alpha channel",
    transparent / pixels < 0.02 && "not enough transparent pixels",
    visible < 1000 && "empty visible bounds",
    visibleMagenta / Math.max(visible, 1) > 0.002 && "visible magenta remains",
    green < 500 && "green artwork appears to be missing",
  ].filter(Boolean);

  if (failures.length) throw new Error(`${label}: ${failures.join(", ")}`);
  console.log(`✓ ${path.basename(outputPath)} (${info.width}x${info.height}, alpha verified)`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const available = new Set(await readdir(RAW_DIR));
  const missing = expected.filter((filename) => !available.has(filename));
  if (missing.length) throw new Error(`Missing raw assets: ${missing.join(", ")}`);
  for (const filename of expected) await processImage(filename);
  console.log(`Processed and verified ${expected.length} Smiski assets.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
