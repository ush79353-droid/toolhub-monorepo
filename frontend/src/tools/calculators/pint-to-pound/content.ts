import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculatePintToPound, formatMeasure } from './calculation';
import {
  DEFAULT_PINT_TO_POUND_INPUT,
  GRAMS_PER_POUND,
  ML_PER_IMPERIAL_PINT,
  ML_PER_US_LIQUID_PINT,
} from './types';

export const PINT_TO_POUND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-pint', label: 'What Is a Pint?' },
  { id: 'what-is-a-pound', label: 'What Is a Pound?' },
  { id: 'why-density-matters', label: 'Why Density Matters' },
  { id: 'how-to-convert-pt-lb', label: 'How to Convert Pints to Pounds' },
  { id: 'how-to-convert-lb-pt', label: 'How to Convert Pounds to Pints' },
  { id: 'how-many-pints-in-pound', label: 'How Many Pints in One Pound?' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'us-vs-imperial', label: 'US vs Imperial Pints' },
  { id: 'dry-ingredients', label: 'Converting Dry Ingredients' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'pint-to-pound-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  pints: string;
  pounds: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_PINTS = [0.5, 1, 2, 3, 4, 5, 8, 10] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_PINTS.map((pt) => {
    const r = calculatePintToPound({
      ...DEFAULT_PINT_TO_POUND_INPUT,
      volume: pt,
    });
    return {
      pints: formatMeasure(pt),
      pounds: formatMeasure(r.mass),
    };
  });
}

const oneLbUsPints = GRAMS_PER_POUND / ML_PER_US_LIQUID_PINT;

export const PINT_TO_POUND_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Pint to Pound Conversion Calculator converts between volume (pints) and mass (pounds) using the density of the selected ingredient. Because pints and pounds measure different physical quantities, there is no single universal conversion factor.',
      'Use this tool for cooking estimates, recipe scaling, and educational density calculations. Always confirm the pint standard (US liquid, imperial, or US dry) and supply a realistic density for the substance you are measuring.',
    ],
  },
  {
    id: 'what-is-a-pint',
    title: 'What Is a Pint?',
    paragraphs: [
      `A pint is a unit of volume. Its common symbol is pt. US customary liquid, imperial liquid, and US dry pints are not the same size.`,
      `Exactly 1 US liquid pint = ${ML_PER_US_LIQUID_PINT} mL. Exactly 1 imperial liquid pint = ${ML_PER_IMPERIAL_PINT} mL. A US dry pint is larger than a US liquid pint and must not be mixed with liquid-pint factors.`,
    ],
  },
  {
    id: 'what-is-a-pound',
    title: 'What Is a Pound?',
    paragraphs: [
      `A pound is a unit of mass. Its symbol is lb. One international avoirdupois pound equals exactly ${GRAMS_PER_POUND} grams and contains 16 avoirdupois ounces.`,
      'Do not confuse pound mass with pound-force, and do not treat mass ounces as fluid ounces.',
    ],
  },
  {
    id: 'why-density-matters',
    title: 'Why Density Matters',
    paragraphs: [
      'Density is mass divided by volume: Density = Mass / Volume. In this calculator the canonical form is density (g/mL) = mass (g) / volume (mL).',
      'The same numerical pint of water, oil, or flour does not weigh the same, because each substance has a different density (or bulk density for dry goods).',
    ],
  },
  {
    id: 'how-to-convert-pt-lb',
    title: 'How to Convert Pints to Pounds',
    paragraphs: [
      'Select the ingredient or choose custom density, confirm the pint standard, enter the volume, and read the mass. Optionally switch the mass unit to ounces, grams, or kilograms.',
      'Internally the tool converts pints to milliliters, multiplies by density in g/mL, then divides by 453.59237 to obtain pounds.',
    ],
    formula: 'lb = pt × mL_per_pt × density(g/mL) ÷ 453.59237',
    formulaNote:
      'Example at density 1 g/mL: 1 US liquid pint → 473.176473 g → ≈ 1.04318 lb.',
  },
  {
    id: 'how-to-convert-lb-pt',
    title: 'How to Convert Pounds to Pints',
    paragraphs: [
      'Enter the mass, confirm density and pint standard, and read the volume. The reverse path converts pounds to grams, divides by density to get milliliters, then divides by milliliters per pint.',
    ],
    formula: 'pt = lb × 453.59237 ÷ density(g/mL) ÷ mL_per_pt',
    formulaNote: `Example at density 1 g/mL: 1 lb → ${GRAMS_PER_POUND} mL → ≈ ${formatMeasure(oneLbUsPints)} US liquid pints.`,
  },
  {
    id: 'how-many-pints-in-pound',
    title: 'How Many Pints Are in One Pound?',
    paragraphs: [
      'There is no universal answer. The result depends on density and which pint definition you use.',
      `Using an explicit reference density of 1 g/mL and the US liquid pint: 1 lb = ${GRAMS_PER_POUND} mL ≈ ${formatMeasure(oneLbUsPints)} US liquid pints. Real water density varies slightly with temperature.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Pint to Pound Conversion Table',
    paragraphs: [
      'The table below uses an explicitly assumed density of 1 g/mL and the US liquid pint. It is a reference illustration, not a universal conversion for every ingredient.',
    ],
    table: tableRows(),
    tableNote:
      'Assumptions: density = 1 g/mL (conventional water approximation); pint standard = US liquid. Change density or standard in the calculator for other substances.',
  },
  {
    id: 'us-vs-imperial',
    title: 'Difference Between US and Imperial Pints',
    paragraphs: [
      `An imperial liquid pint (${ML_PER_IMPERIAL_PINT} mL) is larger than a US liquid pint (${ML_PER_US_LIQUID_PINT} mL). The same typed “2 pints” therefore represents different volumes and different masses at the same density.`,
      'Always keep the selected standard visible when comparing recipes or labels from different regions.',
    ],
  },
  {
    id: 'dry-ingredients',
    title: 'Converting Dry Ingredients',
    paragraphs: [
      'Flour, sugar, grains, and similar dry goods are usually measured by bulk density, which depends on particle size, packing, moisture, and preparation. Scooping versus spooning flour can change the mass in a pint-sized container.',
      'This calculator lists dry-ingredient names for workflow convenience but does not invent bulk densities. Enter a measured or recipe-specific density for trustworthy estimates.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Common uses include cooking and baking conversions, recipe scaling when a recipe lists volume but you weigh on a scale, ingredient purchasing estimates, kitchen education, and comparing US versus imperial liquid measures.',
      'For purchase, shipping, or nutrition-critical decisions, prefer labeled or laboratory density data rather than a general estimate alone.',
    ],
  },
];

export const PINT_TO_POUND_FAQS: readonly FAQItem[] = [
  {
    question: 'How many pounds are in one pint?',
    answer:
      'There is no universal answer. It depends on the substance density and whether you use a US liquid, imperial liquid, or US dry pint.',
  },
  {
    question: 'How do I convert pints to pounds?',
    answer:
      'Convert pints to milliliters using the selected pint standard, multiply by density in g/mL to get grams, then divide by 453.59237 to get pounds.',
  },
  {
    question: 'How do I convert pounds to pints?',
    answer:
      'Convert pounds to grams, divide by density in g/mL to get milliliters, then divide by milliliters per pint for the selected standard.',
  },
  {
    question: 'Is one pint equal to one pound?',
    answer:
      'No. Pints measure volume and pounds measure mass. Even for water near 1 g/mL, one US liquid pint is about 1.043 lb, not exactly 1 lb.',
  },
  {
    question: 'How many pounds is one US pint of water?',
    answer: `Using an approximate density of 1 g/mL: 1 US liquid pint = ${ML_PER_US_LIQUID_PINT} mL ≈ ${formatMeasure(ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND)} lb. Actual water density varies with temperature.`,
  },
  {
    question: 'How many pounds are in two US pints of water?',
    answer: `At the same 1 g/mL assumption: 2 × ${ML_PER_US_LIQUID_PINT} mL ≈ ${formatMeasure((2 * ML_PER_US_LIQUID_PINT) / GRAMS_PER_POUND)} lb.`,
  },
  {
    question: 'What is the ratio of pints to pounds?',
    answer:
      'There is no fixed ratio because the units represent different physical quantities. Density links them.',
  },
  {
    question: 'Is a US pint the same as an Imperial pint?',
    answer: `No. A US liquid pint is ${ML_PER_US_LIQUID_PINT} mL and an imperial liquid pint is ${ML_PER_IMPERIAL_PINT} mL.`,
  },
  {
    question: 'How many ounces are in a pint?',
    answer:
      'For US liquid volume, one US liquid pint contains 16 US fluid ounces. That is a volume relationship, not a mass-ounce relationship.',
  },
  {
    question: 'How many pounds are in a pint of milk?',
    answer:
      'It depends on the milk’s actual density, fat content, temperature, and the pint standard. Enter a measured density rather than assuming water’s density.',
  },
  {
    question: 'How many pounds are in a pint of flour?',
    answer:
      'Flour uses bulk density, which varies with type, packing, and moisture. Enter a measured bulk density; this tool does not invent a single flour figure.',
  },
  {
    question: 'Can I convert dry pints to pounds?',
    answer:
      'Yes, when you supply an appropriate bulk density and select the US dry pint definition so the volume factor is correct.',
  },
  {
    question: 'Can I enter my own ingredient density?',
    answer:
      'Yes. Choose Custom ingredient (or any non-water option) and enter density in g/mL, kg/L, kg/m³, g/cm³, lb/US liquid pint, or lb/ft³.',
  },
  {
    question: 'Why do different ingredients have different pint-to-pound conversions?',
    answer:
      'Because different ingredients have different densities. Mass equals volume times density.',
  },
];
