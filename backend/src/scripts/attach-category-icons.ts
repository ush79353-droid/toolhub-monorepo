import { randomUUID } from 'crypto';
import { connectDB, disconnectDB } from '../config/database';
import { env } from '../config/env';
import { Category } from '../modules/categories/category.model';
import { MediaAsset } from '../modules/media/media.model';
import { isLocalMediaUrl } from '../services/local-storage';
import { publicUrlFor, saveUploadedObject } from '../services/storage';

const LUCIDE_ICON: Record<string, string> = {
  'Finance & Business': 'landmark',
  'Health & Fitness': 'heart-pulse',
  'Math & Statistics': 'calculator',
  Physics: 'atom',
  Chemistry: 'flask-conical',
  'Biology & Ecology': 'leaf',
  'Construction & Home': 'house',
  'Conversion & Units': 'arrow-left-right',
  'Food & Cooking': 'utensils',
  'Sports & Training': 'dumbbell',
  'Everyday Life & Other Calculators': 'calendar-days',
  'Writing, Text & AI': 'pen-line',
  'Design & Graphics': 'palette',
  'Image Tools': 'image',
  'PDF Tools': 'file-text',
  'Video & Audio': 'clapperboard',
  'File & Data Converters': 'files',
  'SEO, Website & Domain': 'globe',
  'Developer & Misc Utilities': 'terminal',
};

const ICON_SOURCE = 'https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/icons';

async function downloadIcon(name: string): Promise<Buffer> {
  const response = await fetch(`${ICON_SOURCE}/${name}.svg`);
  if (!response.ok) throw new Error(`Could not download ${name}.svg (${response.status})`);
  const svg = (await response.text()).split('currentColor').join('#087E8B');
  if (!svg.includes('<svg')) throw new Error(`${name}.svg is not an SVG`);
  return Buffer.from(svg);
}

async function run(): Promise<void> {
  if (env.STORAGE_DRIVER !== 'local') {
    throw new Error('STORAGE_DRIVER must be local so these icons are stored on this server.');
  }
  const connected = await connectDB();
  if (!connected) throw new Error('Failed to connect to MongoDB.');

  try {
    const categories = await Category.find({ kind: 'category' }).sort({ name: 1 });
    let attached = 0;
    for (const category of categories) {
      const iconName = LUCIDE_ICON[category.name];
      if (!iconName) {
        console.log(`No icon chosen for ${category.name}`);
        continue;
      }
      if (category.iconUrl && isLocalMediaUrl(category.iconUrl)) {
        console.log(`${category.name}: already has ${category.iconUrl}`);
        continue;
      }
      const body = await downloadIcon(iconName);
      const key = `media/${randomUUID()}.svg`;
      await saveUploadedObject({ key, contentType: 'image/svg+xml', body });
      const url = publicUrlFor(key);
      const asset = await MediaAsset.create({
        fileName: `${category.slug}.svg`,
        contentType: 'image/svg+xml',
        size: body.length,
        altText: category.name,
        key,
        url,
      });
      category.iconMedia = asset._id;
      category.iconUrl = url;
      await category.save();
      attached += 1;
      console.log(`${category.name}: ${iconName} -> ${url}`);
    }
    console.log(`Attached ${attached} category icons.`);
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
