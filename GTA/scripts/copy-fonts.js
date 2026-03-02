import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = [
  path.join(__dirname, '..', 'src', 'pricedown.otf'),
  path.join(__dirname, '..', 'src', 'assets', 'pricedown.otf'),
  path.join(__dirname, '..', 'pricedown.otf'),
];

const outDir = path.join(__dirname, '..', 'public');
const outFile = path.join(outDir, 'pricedown.otf');

(async () => {
  try {
    for (const src of candidates) {
      if (fs.existsSync(src)) {
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.copyFileSync(src, outFile);
        console.log('Copied', src, '->', outFile);
        process.exit(0);
      }
    }
    console.log('No pricedown.otf found in candidates; skipping copy.\nChecked:', candidates.join('\n'));
  } catch (err) {
    console.error('Error copying font:', err);
    process.exit(1);
  }
})();
