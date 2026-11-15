import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateDropsToMl, formatMeasure, mlToDrops } from './calculation';
import {
  DEFAULT_DROPS_PER_ML,
  DEFAULT_DROPS_TO_ML_INPUT,
  ML_PER_US_CUP,
  ML_PER_US_FL_OZ,
} from './types';

export const DROPS_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-many-drops-in-ml', label: 'How Many Drops in 1 mL?' },
  { id: 'what-is-a-drop', label: 'What Is a Drop?' },
  { id: 'how-to-convert-drops-ml', label: 'How to Convert Drops to mL' },
  { id: 'how-to-convert-ml-drops', label: 'How to Convert mL to Drops' },
  { id: 'how-to-use', label: 'How to Use This Converter' },
  { id: 'conversion-table', label: 'Conversion Chart' },
  { id: 'drops-in-liter', label: 'Drops in One Liter' },
  { id: 'drops-in-cup', label: 'Drops in a Cup' },
  { id: 'fl-oz-per-drop', label: 'US Fluid Ounces per Drop' },
  { id: 'why-sizes-vary', label: 'Why Drop Sizes Vary' },
  { id: 'accurate-measurement', label: 'Measuring Small Volumes' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'drops-to-ml-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  drops: string;
  ml: string;
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

const TABLE_DROPS = [1, 2, 5, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 2000] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_DROPS.map((drops) => {
    const r = calculateDropsToMl({
      ...DEFAULT_DROPS_TO_ML_INPUT,
      drops,
      dropsPerMl: DEFAULT_DROPS_PER_ML,
    });
    return { drops: formatMeasure(drops), ml: formatMeasure(r.ml) };
  });
}

const cupDrops = mlToDrops(ML_PER_US_CUP, DEFAULT_DROPS_PER_ML);
const flOzPerDrop = 0.05 / ML_PER_US_FL_OZ;

export const DROPS_TO_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Drops to mL Conversion Calculator estimates liquid volume from a drop count and can reverse the estimate from milliliters to drops. Results depend on the selected drops-per-milliliter factor.',
      'A drop is not a universally fixed SI volume. The default factor of 20 drops per milliliter is a convenient reference assumption, not a claim that every dropper and liquid matches that size.',
    ],
  },
  {
    id: 'how-many-drops-in-ml',
    title: 'How Many Drops Are in One Milliliter?',
    paragraphs: [
      'A commonly used reference assumption is 20 drops ≈ 1 mL, which implies about 0.05 mL per drop. Actual counts vary with the dispensing device and liquid properties.',
    ],
    formula: '20 drops ≈ 1 mL  →  1 drop ≈ 0.05 mL',
    formulaNote:
      'Treat this as an assumed factor unless you calibrate your own dropper and liquid.',
  },
  {
    id: 'what-is-a-drop',
    title: 'What Is a Drop?',
    paragraphs: [
      'A drop is a small quantity of liquid released from a tip or orifice. It is not a fixed SI unit. Drop volume depends on dropper geometry, calibration, viscosity, surface tension, temperature, and dispensing technique.',
      'A drop factor expresses how many drops correspond to one milliliter under a stated assumption or calibration.',
    ],
  },
  {
    id: 'how-to-convert-drops-ml',
    title: 'How to Convert Drops to mL',
    paragraphs: [
      'Divide the number of drops by the active drops-per-milliliter factor.',
      'Example: 50 drops ÷ 20 drops/mL ≈ 2.5 mL when that factor is assumed.',
    ],
    formula: 'mL = Drops / DropsPerMilliliter',
  },
  {
    id: 'how-to-convert-ml-drops',
    title: 'How to Convert mL to Drops',
    paragraphs: [
      'Multiply milliliters by the active drops-per-milliliter factor. Fractional results are mathematical estimates, not instructions to dispense a fraction of a physical drop.',
      'Example: 3 mL × 20 drops/mL ≈ 60 drops at the default assumption.',
    ],
    formula: 'Drops = mL × DropsPerMilliliter',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Drops to mL Converter',
    paragraphs: [
      'Enter drops or milliliters, confirm the drop factor (default 20 drops/mL), and read the paired result. Open Drop Size Settings to edit drops per mL or volume per drop. Use Calibrate Your Dropper when you have an observed count and measured volume. Expand More Conversion Options for related volume units.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Drops to Milliliters Conversion Chart',
    paragraphs: [
      'The chart below uses the fixed educational assumption of 20 drops per milliliter. If you change the calculator factor, do not treat this table as matching your custom setting.',
    ],
    table: tableRows(),
    tableNote:
      'These values assume 20 drops per milliliter. Actual drop sizes may differ.',
  },
  {
    id: 'drops-in-liter',
    title: 'How Many Drops Are There in One Liter?',
    paragraphs: [
      `At 20 drops/mL: 1 L = 1000 mL → 1000 × 20 = 20000 drops. This is an estimated count based on the selected factor, not a literal physical inventory of identical drops.`,
    ],
  },
  {
    id: 'drops-in-cup',
    title: 'How Many Drops Are in a Cup?',
    paragraphs: [
      `One US customary cup is exactly ${ML_PER_US_CUP} mL. At 20 drops/mL that is about ${formatMeasure(cupDrops)} drops. The figure is an estimate for the assumed factor.`,
    ],
  },
  {
    id: 'fl-oz-per-drop',
    title: 'How Many US Fluid Ounces Are in a Drop?',
    paragraphs: [
      `Using 1 drop ≈ 0.05 mL and 1 US fluid ounce = ${ML_PER_US_FL_OZ} mL: 0.05 ÷ ${ML_PER_US_FL_OZ} ≈ ${formatMeasure(flOzPerDrop)} US fl oz per drop under that assumption.`,
    ],
  },
  {
    id: 'why-sizes-vary',
    title: 'Why Drop Sizes Vary',
    paragraphs: [
      'Drop size changes with tip design, surface tension, viscosity, temperature, liquid composition, and how quickly the liquid is dispensed. Two droppers can disagree even with the same labeled liquid.',
    ],
  },
  {
    id: 'accurate-measurement',
    title: 'How to Measure Small Volumes More Accurately',
    paragraphs: [
      'When precise volume matters, prefer calibrated syringes, pipettes, or graduated cylinders over counting drops. Use this converter for general estimates and educational conversions, not as a substitute for measured volumes.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Common uses include general liquid estimates, classroom demonstrations, dropper calibration concepts, and household conversions. Do not use assumed drop factors as medication dosage instructions.',
    ],
  },
];

export const DROPS_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How many drops are in 1 mL?',
    answer:
      'Using the commonly assumed factor of 20 drops per mL, approximately 20 drops correspond to 1 mL. Actual counts vary by liquid and dropper.',
  },
  {
    question: 'How do I convert drops to mL?',
    answer: 'Divide the number of drops by the selected drops-per-milliliter factor.',
  },
  {
    question: 'How do I convert mL to drops?',
    answer: 'Multiply milliliters by the selected drops-per-milliliter factor.',
  },
  {
    question: 'Is one drop exactly 0.05 mL?',
    answer:
      'No. That is an approximate reference value based on 20 drops per milliliter.',
  },
  {
    question: 'How many mL are 10 drops?',
    answer: 'At 20 drops/mL: 10 ÷ 20 = 0.5 mL.',
  },
  {
    question: 'How many mL are 20 drops?',
    answer: 'At 20 drops/mL: 20 ÷ 20 = 1 mL.',
  },
  {
    question: 'How many mL are 100 drops?',
    answer: 'At 20 drops/mL: 100 ÷ 20 = 5 mL.',
  },
  {
    question: 'How many drops are in 5 mL?',
    answer: 'At 20 drops/mL: 5 × 20 = 100 drops.',
  },
  {
    question: 'How many drops are in one liter?',
    answer: 'At 20 drops/mL: 1000 × 20 = 20000 drops.',
  },
  {
    question: 'How many drops are in one US customary cup?',
    answer: `At 20 drops/mL: ${ML_PER_US_CUP} × 20 ≈ ${formatMeasure(cupDrops)} drops.`,
  },
  {
    question: 'Why do different droppers produce different drop sizes?',
    answer:
      'Drop size depends on device geometry, viscosity, surface tension, temperature, and dispensing conditions.',
  },
  {
    question: 'Can I change the drops-per-mL factor?',
    answer:
      'Yes. Open Drop Size Settings to enter a custom factor, or calibrate from observed drops and measured volume.',
  },
  {
    question: 'Can I use this calculator for medication dosage?',
    answer:
      'The calculator provides general numerical volume estimates only. Medication measurements should follow verified product instructions and appropriate clinical measuring devices.',
  },
  {
    question: 'Can I enter decimal milliliter values?',
    answer: 'Yes. The calculator supports integer and decimal volume measurements.',
  },
];
