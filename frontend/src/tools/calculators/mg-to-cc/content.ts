import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, massToVolumeCc, normalizeConcentration } from './calculation';
import { WATER_DENSITY_MG_PER_ML } from './types';

export const MG_TO_CC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mg-vs-cc', label: 'What Is the Difference Between mg and cc?' },
  { id: 'how-to-convert', label: 'How to Convert mg to cc' },
  { id: 'medications', label: 'mg to cc Conversion for Medications' },
  { id: 'water-table', label: 'mg to cc Conversion for Water' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'examples', label: 'mg to cc Conversion Examples' },
  { id: 'related-converters', label: 'Related Conversion Tools' },
  { id: 'mg-to-cc-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const WATER_MASSES = [100, 250, 500, 1000, 2500, 5000] as const;

export const MG_TO_CC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'mg-vs-cc',
    title: 'What Is the Difference Between mg and cc?',
    paragraphs: [
      'Milligrams measure mass. Cubic centimeters measure volume. One cubic centimeter equals one milliliter exactly.',
      'Mass-to-volume conversion depends on concentration (for medications) or density (for substances). One milligram is not generally equal to one cubic centimeter.',
    ],
    formula: '1 cc = 1 mL',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert mg to cc',
    paragraphs: [
      'Medication approach: divide mass in milligrams by concentration in mg/mL (or mg/cc).',
      'Density approach: divide mass in milligrams by density in mg/cc.',
      'Because 1 cc = 1 mL, the calculated volume in milliliters equals the volume in cubic centimeters.',
    ],
    formula: 'cc = mg ÷ (mg/mL) · cc = mg ÷ (mg/cc)',
  },
  {
    id: 'medications',
    title: 'mg to cc Conversion for Medications',
    paragraphs: [
      'A labeled concentration such as 50 mg/mL means 50 milligrams of the stated ingredient per milliliter of preparation. Different products with the same drug name can have different strengths.',
      'Labels that state milligrams per 5 mL convert to mg/mL by dividing by five. Example: 100 mg / 5 mL = 20 mg/mL.',
      'Always verify the exact formulation and concentration from the product in front of you. This calculator does not choose a clinical concentration or recommend a dose.',
    ],
  },
  {
    id: 'water-table',
    title: 'mg to cc Conversion for Water',
    paragraphs: [
      `Using an illustrative water density of about 1 g/mL (${WATER_DENSITY_MG_PER_ML} mg/mL). Real water density varies slightly with temperature. This table is an approximation, not a medication guide.`,
    ],
    tableHeaders: ['Mass', 'Approximate Volume'],
    table: WATER_MASSES.map((mg) => [
      `${mg} mg`,
      `${formatMeasure(massToVolumeCc(mg, WATER_DENSITY_MG_PER_ML))} cc`,
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Calculator',
    paragraphs: [
      '1. Select Medication or Substance.',
      '2. Enter the relevant concentration or density (and unit).',
      '3. Enter the mass in milligrams.',
      '4. Read the calculated volume in cc.',
      '5. View the equivalent volume in mL.',
      '6. Edit the volume field to perform the reverse calculation.',
    ],
  },
  {
    id: 'examples',
    title: 'mg to cc Conversion Examples',
    paragraphs: [
      `100 mg at 25 mg/mL → ${formatMeasure(massToVolumeCc(100, 25))} cc. Illustration only.`,
      `200 mg at 50 mg/mL → ${formatMeasure(massToVolumeCc(200, 50))} cc. Illustration only.`,
      `500 mg at 100 mg/mL → ${formatMeasure(massToVolumeCc(500, 100))} cc. Illustration only.`,
      `1000 mg of water at an assumed density of 1 g/mL → ${formatMeasure(massToVolumeCc(1000, WATER_DENSITY_MG_PER_ML))} cc.`,
      `Labeled 100 mg per 5 mL normalizes to ${formatMeasure(normalizeConcentration(100, 'mgPer5Ml'))} mg/mL.`,
    ],
    formula: 'Example concentrations are mathematical illustrations, not medication recommendations.',
  },
  {
    id: 'related-converters',
    title: 'Related Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Grams in mL Converter, Gram to Liter Conversion, kg to mL Converter, Volume to Mass Calculator, mg to g Converter, mL to g Converter, Density Calculator, and mg to mL Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const MG_TO_CC_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many cc Are in 100 mg?',
    answer: `The answer depends on concentration or density. For example, at 50 mg/mL: 100 ÷ 50 = ${formatMeasure(massToVolumeCc(100, 50))} cc. Therefore 100 mg corresponds to ${formatMeasure(massToVolumeCc(100, 50))} cc at that concentration.`,
  },
  {
    question: 'Is 1 mg Equal to 1 cc?',
    answer:
      'No. A milligram measures mass, while a cubic centimeter measures volume. The relationship depends on the substance’s density or medication concentration.',
  },
  {
    question: 'How Many mg Are in 1 cc?',
    answer:
      'It depends on the concentration or density. For example, a liquid with a concentration of 20 mg/mL contains 20 mg per cc.',
  },
  {
    question: 'Is 1 cc the Same as 1 mL?',
    answer: 'Yes. 1 cc = 1 mL exactly.',
  },
  {
    question: 'How Do I Convert 200 mg to cc?',
    answer: `Divide 200 mg by the concentration in mg/mL. For example, at 40 mg/mL: 200 ÷ 40 = ${formatMeasure(massToVolumeCc(200, 40))} cc.`,
  },
  {
    question: 'How Do I Convert mg per 5 mL to mg/mL?',
    answer: `Divide the stated amount in milligrams by five. For example, 100 mg / 5 mL = ${formatMeasure(normalizeConcentration(100, 'mgPer5Ml'))} mg/mL.`,
  },
  {
    question: 'Can I Use This Calculator for Medication Doses?',
    answer:
      'The calculator can perform mass-to-volume arithmetic using a known concentration, but it does not determine a safe or appropriate dose. Medication use requires verification by a qualified healthcare professional.',
  },
];
