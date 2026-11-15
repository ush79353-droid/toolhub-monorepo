import { connectDB, disconnectDB } from '../config/database';
import { Category } from '../modules/categories/category.model';

const DESCRIPTIONS: Record<string, string> = {
  'Finance & Business': 'Loans, interest, payroll, tax, and other money calculations.',
  'Health & Fitness': 'Body measurements, nutrition, and fitness estimates.',
  'Math & Statistics': 'Algebra, geometry, statistics, and everyday number tools.',
  Physics: 'Motion, electricity, waves, and other physics calculations.',
  Chemistry: 'Molar mass, solutions, and other chemistry calculations.',
  'Biology & Ecology': 'Population, genetics, and ecology calculations.',
  'Construction & Home': 'Materials, measurements, and home project estimates.',
  'Conversion & Units': 'Convert length, weight, temperature, volume, and other units.',
  'Food & Cooking': 'Recipes, portions, and kitchen measurements.',
  'Sports & Training': 'Pace, training load, and sports measurements.',
  'Everyday Life & Other Calculators': 'Dates, time, ratios, and other day-to-day calculations.',
  'Writing, Text & AI': 'Word counts, text cleanup, and writing helpers.',
  'Design & Graphics': 'Color, layout, and graphic measurements.',
  'Image Tools': 'Resize, convert, and prepare image files.',
  'PDF Tools': 'Merge, split, compress, and work with PDF files.',
  'Video & Audio': 'Duration, bitrate, file size, and media calculations.',
  'File & Data Converters': 'Change file and data formats.',
  'SEO, Website & Domain': 'Page, domain, and search measurements.',
  'Developer & Misc Utilities': 'Formatters and small utilities for development work.',
};

async function run(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('Failed to connect to MongoDB.');

  try {
    const categories = await Category.find({ kind: 'category' }).sort({ name: 1 });
    let updated = 0;
    for (const category of categories) {
      const description = DESCRIPTIONS[category.name];
      if (!description) {
        console.log(`No description chosen for ${category.name}`);
        continue;
      }
      if (category.description.trim()) {
        console.log(`${category.name}: already has a description`);
        continue;
      }
      category.description = description;
      await category.save();
      updated += 1;
      console.log(`${category.name}: ${description}`);
    }
    console.log(`Updated ${updated} category descriptions.`);
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
