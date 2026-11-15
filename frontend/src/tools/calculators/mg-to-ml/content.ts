import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, massToVolume } from './calculation';
import { WATER_DENSITY_MG_PER_ML } from './types';

export const MG_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-many-mg-in-1-ml', label: 'How Many mg Are in 1 mL?' },
  { id: 'what-is-a-milligram', label: 'What Is a Milligram?' },
  { id: 'what-is-a-milliliter', label: 'What Is a Milliliter?' },
  { id: 'mg-to-ml-density', label: 'Convert mg to mL Using Density' },
  { id: 'ml-to-mg-density', label: 'Convert mL to mg Using Density' },
  { id: 'medication-concentration', label: 'Medication Concentration' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'conversion-examples', label: 'mg to mL Conversion Examples' },
  { id: 'density-vs-concentration', label: 'Density vs Concentration' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'mg-to-ml-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  mass: string;
  volume: string;
}

export interface MgToMlGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const EXAMPLE_MASSES_MG = [100, 250, 500, 1000, 2000, 5000, 10_000] as const;

export const MG_TO_ML_GUIDE_SECTIONS: readonly MgToMlGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts between milligrams (mg) and milliliters (mL) when you supply either a substance density or a labeled liquid concentration. Mass and volume are different kinds of measurement, so there is no universal mg-to-mL factor.',
      'Use density mode for a liquid or material with a known mass per volume. Use medication concentration mode when a preparation lists an active ingredient amount per milliliter. The tool performs arithmetic only; it does not recommend a dose.',
    ],
  },
  {
    id: 'how-many-mg-in-1-ml',
    title: 'How Many mg Are in 1 mL?',
    paragraphs: [
      'There is no single answer for every liquid. The milligram amount in one milliliter depends on density (for the whole substance) or on the concentration of a particular ingredient in a preparation.',
      `For an illustrative water-density approximation of about 1 g/mL (${WATER_DENSITY_MG_PER_ML} mg/mL), 1 mL of water corresponds to roughly ${WATER_DENSITY_MG_PER_ML} mg. That approximation does not apply to oils, syrups, or medications, and real water density also varies slightly with temperature and pressure.`,
    ],
  },
  {
    id: 'what-is-a-milligram',
    title: 'What Is a Milligram?',
    paragraphs: [
      'A milligram is a metric unit of mass. Its symbol is mg. One milligram equals 0.001 grams, and one gram equals 1000 milligrams.',
    ],
  },
  {
    id: 'what-is-a-milliliter',
    title: 'What Is a Milliliter?',
    paragraphs: [
      'A milliliter is a metric unit of volume. Its symbol is mL. One milliliter equals 0.001 liters and exactly one cubic centimeter (cm³).',
    ],
  },
  {
    id: 'mg-to-ml-density',
    title: 'How to Convert mg to mL Using Density',
    paragraphs: [
      'Divide mass in milligrams by density expressed in mg/mL. Example: 2500 mg ÷ 1000 mg/mL = 2.5 mL.',
    ],
    formula: 'Volume (mL) = Mass (mg) / Density (mg/mL)',
  },
  {
    id: 'ml-to-mg-density',
    title: 'How to Convert mL to mg Using Density',
    paragraphs: [
      'Multiply volume in milliliters by density in mg/mL. Example: 3 mL × 1000 mg/mL = 3000 mg.',
    ],
    formula: 'Mass (mg) = Volume (mL) × Density (mg/mL)',
  },
  {
    id: 'medication-concentration',
    title: 'Medication Concentration – How Many Milligrams Are in a Milliliter?',
    paragraphs: [
      'Medication concentration states how much of a specified active ingredient is present in each milliliter of a liquid preparation. A label of 20 mg/mL means 20 mg of that ingredient per milliliter of liquid—not the density of the whole liquid.',
      'Some labels use milligrams per 5 mL (or another volume). Convert those to mg/mL by dividing labeled milligrams by the labeled milliliters. Example: 100 mg per 5 mL → 20 mg/mL. Different products with the same drug name can have different strengths; always read the package in front of you.',
    ],
    formula: 'Concentration (mg/mL) = Labeled ingredient mass (mg) / Labeled liquid volume (mL)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mg to mL Calculator',
    paragraphs: [
      'Choose density-based or medication concentration conversion. For density, pick water (approximate reference) or enter a custom density with its unit. For medication mode, enter mg/mL or a labeled mg-per-volume pair. Type mass or volume; the other field updates. Expand More conversion options for mcg, g, kg, µL, cL, and L. Copy or reset as needed, and verify the displayed factor next to the result.',
    ],
  },
  {
    id: 'conversion-examples',
    title: 'mg to mL Conversion Examples',
    paragraphs: [
      `The table uses an assumed density of ${WATER_DENSITY_MG_PER_ML} mg/mL (about 1 g/mL). It is for illustration with that assumption only.`,
    ],
    table: EXAMPLE_MASSES_MG.map((mass) => ({
      mass: formatMeasure(mass),
      volume: formatMeasure(massToVolume(mass, WATER_DENSITY_MG_PER_ML)),
    })),
    tableNote:
      'These examples use an assumed density of 1000 mg/mL and do not represent universal mg-to-mL conversions or medication dosing instructions.',
  },
  {
    id: 'density-vs-concentration',
    title: 'Difference Between Density and Concentration',
    paragraphs: [
      'Density describes the mass of a substance per unit volume of that substance. Concentration describes the amount of a specified ingredient per unit volume of a preparation. Both may be written with units such as mg/mL, but they answer different questions and must not be swapped.',
      'Using a water-like density for a concentrated oral liquid, or treating density as if it were a drug strength, produces incorrect arithmetic for that use case.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Common uses include chemistry and laboratory mass–volume checks, educational unit conversions, comparing labeled concentrations, and liquid formulation arithmetic in research settings. The calculator is not a clinical dosing aid and does not replace labeled instructions or professional judgment.',
    ],
  },
];

export const MG_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert mg to mL?',
    answer:
      'Divide the mass in milligrams by the applicable density or ingredient concentration expressed in mg/mL.',
  },
  {
    question: 'How do I convert mL to mg?',
    answer:
      'Multiply the liquid volume by the applicable density or ingredient concentration in mg/mL.',
  },
  {
    question: 'Is 1 mg equal to 1 mL?',
    answer:
      'No. Milligrams measure mass, while milliliters measure volume. They are not interchangeable without density or concentration.',
  },
  {
    question: 'How many mg are in 1 mL of water?',
    answer:
      'Using the approximation of about 1 g/mL density, 1 mL of water corresponds to approximately 1000 mg. Real density varies slightly with conditions.',
  },
  {
    question: 'What is the formula for mg to mL?',
    answer: 'mL = mg / (mg/mL). The denominator must be the correct density or concentration for your case.',
  },
  {
    question: 'How do I convert a concentration from mg per 5 mL to mg/mL?',
    answer: 'Divide the labeled milligram amount by 5. Example: 100 mg per 5 mL → 20 mg/mL.',
  },
  {
    question: 'What is 100 mg in mL?',
    answer:
      'It depends on density or concentration. At 20 mg/mL, 100 ÷ 20 = 5 mL. That is arithmetic only, not a dosage recommendation.',
  },
  {
    question: 'Can I convert medication mg to mL without concentration?',
    answer: 'No. The labeled concentration (or an equivalent mg-per-volume statement) is required.',
  },
  {
    question: 'Is density the same as medication concentration?',
    answer:
      'No. Density is mass per volume of the substance; medication concentration is ingredient mass per volume of a preparation.',
  },
  {
    question: 'Can I use this calculator for different liquids?',
    answer: 'Yes, when the appropriate density or concentration is known and entered.',
  },
  {
    question: 'Does this calculator determine a safe medication dose?',
    answer:
      'No. It only converts numerical quantities using user-supplied conversion factors. It does not recommend doses.',
  },
  {
    question: 'Can I enter decimal measurements?',
    answer: 'Yes. Decimal mass, volume, density, and concentration values are supported.',
  },
];
