import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  milligramsToTablespoons,
  tablespoonsToMilligrams,
} from './calculation';
import { SALT_DENSITY_G_PER_ML, US_TABLESPOON_ML, WATER_DENSITY_G_PER_ML } from './types';

export const MG_TO_TABLESPOON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-tablespoon', label: 'What Is a Tablespoon?' },
  { id: 'how-to-convert-mg-to-tbsp', label: 'How Do I Convert Milligrams to Tablespoons?' },
  { id: 'density-as-mg-per-tbsp', label: 'How Do I Express Density as Milligrams per Tablespoon?' },
  { id: 'how-to-use', label: 'How to Use the mg to tablespoon Converter' },
  { id: 'why-density-matters', label: 'Why Does Ingredient Density Matter?' },
  { id: 'conversion-examples', label: 'mg to Tablespoon Conversion Examples' },
  { id: 'related-tools', label: 'Other Volume-to-Mass Converters' },
  { id: 'mg-to-tablespoon-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { label: string; value: string }[];
}

const water1TbspMg = tablespoonsToMilligrams(1, WATER_DENSITY_G_PER_ML, US_TABLESPOON_ML);
const salt1TbspMg = tablespoonsToMilligrams(1, SALT_DENSITY_G_PER_ML, US_TABLESPOON_ML);
const salt10000Tbsp = milligramsToTablespoons(10_000, SALT_DENSITY_G_PER_ML, US_TABLESPOON_ML);
const water5000Tbsp = milligramsToTablespoons(5000, WATER_DENSITY_G_PER_ML, US_TABLESPOON_ML);

export const MG_TO_TABLESPOON_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-tablespoon',
    title: 'What Is a Tablespoon?',
    paragraphs: [
      'A tablespoon is a cooking volume unit. Its size depends on the measurement standard you follow.',
      `A US customary tablespoon is exactly ${US_TABLESPOON_ML} mL (one sixteenth of a US cup). A metric tablespoon is commonly 15 mL. An Australian metric tablespoon is 20 mL.`,
      'This converter defaults to the US tablespoon and always shows which standard is selected. Do not mix standards without converting the volume first.',
    ],
    formula: `US tbsp = ${US_TABLESPOON_ML} mL\nMetric tbsp = 15 mL\nAustralian tbsp = 20 mL`,
  },
  {
    id: 'how-to-convert-mg-to-tbsp',
    title: 'How Do I Convert Milligrams to Tablespoons?',
    paragraphs: [
      'Milligrams measure mass. Tablespoons measure volume. You need the ingredient density in g/mL before converting.',
      'Convert milligrams to grams (divide by 1000), divide by density to get milliliters, then divide by the tablespoon volume in milliliters.',
      `For salt at an assumed bulk density of ${SALT_DENSITY_G_PER_ML} g/mL using US tablespoons, 10,000 mg ≈ ${formatMeasure(Number(salt10000Tbsp.toFixed(5)))} US tbsp.`,
    ],
    formula: `tbsp = mg / (1000 × ρ × ${US_TABLESPOON_ML})\nwhere ρ is density in g/mL`,
  },
  {
    id: 'density-as-mg-per-tbsp',
    title: 'How Do I Express Density as Milligrams per Tablespoon?',
    paragraphs: [
      'Sometimes it is useful to know how many milligrams fit in one tablespoon of a substance at a given density.',
      `mg per tbsp = ρ(g/mL) × tablespoon_mL × 1000. For water at 1 g/mL and a US tablespoon, that is about ${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg per US tbsp.`,
      `For salt at ${SALT_DENSITY_G_PER_ML} g/mL, one US tablespoon is about ${formatMeasure(Number(salt1TbspMg.toFixed(2)))} mg. These values change if you switch to metric or Australian tablespoons.`,
    ],
    formula: `mg/tbsp = ρ × V_tbsp × 1000\n1 US tbsp water ≈ ${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg\n1 US tbsp salt (ρ=${SALT_DENSITY_G_PER_ML}) ≈ ${formatMeasure(Number(salt1TbspMg.toFixed(2)))} mg`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mg to tablespoon Converter',
    paragraphs: [
      '1. Select the ingredient (Salt is the default) or choose Custom density.',
      '2. Check the density and unit; edit if your substance differs.',
      '3. Choose the tablespoon standard (US, metric, or Australian).',
      '4. Enter the mass in milligrams.',
      '5. Read the calculated volume in tablespoons.',
      '6. Or edit tablespoons to calculate milligrams.',
      '7. Use Reload calculator to restore Salt defaults, or Clear all changes to empty mass and volume while keeping density settings.',
    ],
  },
  {
    id: 'why-density-matters',
    title: 'Why Does Ingredient Density Matter?',
    paragraphs: [
      'Equal masses of different ingredients occupy different volumes. A tablespoon of honey weighs more than a tablespoon of flour because honey is denser.',
      'Bulk density for powders and crystals can vary with particle size, packing, moisture, temperature, and composition. Preset values are illustrative estimates, not laboratory certificates.',
      'Always prefer a measured density for your specific sample when accuracy matters. This tool performs physical mass–volume arithmetic only.',
    ],
  },
  {
    id: 'conversion-examples',
    title: 'mg to Tablespoon Conversion Examples',
    paragraphs: [
      `Water at ≈ 1 g/mL: 1 US tbsp ≈ ${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg. Therefore 5000 mg ≈ ${formatMeasure(Number(water5000Tbsp.toFixed(5)))} US tbsp.`,
      `Salt at assumed bulk density ${SALT_DENSITY_G_PER_ML} g/mL: 1 US tbsp ≈ ${formatMeasure(Number(salt1TbspMg.toFixed(2)))} mg. Therefore 10,000 mg ≈ ${formatMeasure(Number(salt10000Tbsp.toFixed(5)))} US tbsp.`,
      'These examples use the US tablespoon. Switching to metric (15 mL) or Australian (20 mL) changes the tablespoon count for the same mass.',
    ],
    table: [
      {
        label: '1 US tbsp water (1 g/mL)',
        value: `${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg`,
      },
      {
        label: `1 US tbsp salt (${SALT_DENSITY_G_PER_ML} g/mL)`,
        value: `${formatMeasure(Number(salt1TbspMg.toFixed(2)))} mg`,
      },
      {
        label: '5000 mg water → US tbsp',
        value: formatMeasure(Number(water5000Tbsp.toFixed(5))),
      },
      {
        label: '10,000 mg salt → US tbsp',
        value: formatMeasure(Number(salt10000Tbsp.toFixed(5))),
      },
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Volume-to-Mass Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Grams in mL Converter, mg to mL Converter, mg to cc Conversion, kg to Liter Converter, kg to mL Converter, Grams to fl oz Converter, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const MG_TO_TABLESPOON_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many mg Are in a Tablespoon of Water?',
    answer: `Using water density of approximately 1 g/mL and a US tablespoon of ${US_TABLESPOON_ML} mL: mg = ${US_TABLESPOON_ML} × 1 × 1000 ≈ ${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg. Therefore 1 US tablespoon of water ≈ ${formatMeasure(Number(water1TbspMg.toFixed(2)))} mg.`,
  },
  {
    question: 'How Many Milligrams Are in a Tablespoon?',
    answer: `There is no single answer for every substance. Milligrams depend on ingredient density and the tablespoon standard. Use mg = tbsp × V_tbsp × ρ × 1000. For salt at ${SALT_DENSITY_G_PER_ML} g/mL, 1 US tbsp ≈ ${formatMeasure(Number(salt1TbspMg.toFixed(2)))} mg.`,
  },
  {
    question: 'How Do I Convert 5000 mg to Tablespoons?',
    answer: `Select the substance and density first. For water at 1 g/mL using US tablespoons: tbsp = 5000 / (1000 × 1 × ${US_TABLESPOON_ML}) ≈ ${formatMeasure(Number(water5000Tbsp.toFixed(5)))} US tbsp.`,
  },
  {
    question: 'Is a Tablespoon Always 15 mL?',
    answer: `No. A metric tablespoon is commonly 15 mL, but a US customary tablespoon is ${US_TABLESPOON_ML} mL. An Australian metric tablespoon is 20 mL. Always confirm the standard being used.`,
  },
  {
    question: 'Can I Convert mg to Tablespoons Without Density?',
    answer:
      'Not accurately. Milligrams measure mass while tablespoons measure volume, so the substance density is required.',
  },
  {
    question: 'Can I Use This Calculator for Medication Doses?',
    answer:
      "This calculator provides physical mass-to-volume conversions based on density. It must not be used to determine medication doses. For liquid medication, dosing depends on the product's stated drug concentration (such as mg/mL), not the liquid's overall mass density. Use the product's approved dosing instructions and a calibrated measuring device.",
  },
];
