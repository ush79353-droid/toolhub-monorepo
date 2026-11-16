import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertHardness } from './calculation';

export const HARDNESS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'different-hardness-scales', label: 'Different Hardness Scales' },
  { id: 'steel-hardness-chart', label: 'Steel Hardness Conversion Chart' },
  { id: 'how-to-calculate', label: 'How to Calculate Hardness Conversion' },
  { id: 'brinell-vs-rockwell', label: 'Brinell vs. Rockwell Hardness' },
  { id: 'vickers-explained', label: 'Vickers Hardness Explained' },
  { id: 'why-approximate', label: 'Why Hardness Conversions Are Approximate' },
  { id: 'hardness-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  showChart?: boolean;
}

export const HARDNESS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'different-hardness-scales',
    title: 'Different Hardness Scales',
    paragraphs: [
      'Metal hardness is measured with several indentation methods. Each method uses a different indenter, load, and readout, so hardness numbers are not universal physical units like meters or kilograms.',
      'Brinell hardness (HBW) uses a ball indenter under a specified force and reports hardness from the indentation diameter. Rockwell B (HRB) and Rockwell C (HRC) measure indentation depth under prescribed preliminary and major loads — HRB suits softer metals; HRC suits harder heat-treated steels. Vickers hardness (HV) uses a diamond pyramid and is widely used across a broad hardness range.',
      'Typical applications differ: HBW for large, relatively homogeneous sections; HRB for annealed or soft alloys; HRC for hardened steels; HV for laboratory and multi-range work. Specifying the exact test method and conditions always matters more than a converted estimate.',
    ],
  },
  {
    id: 'steel-hardness-chart',
    title: 'Steel Hardness Conversion Chart',
    paragraphs: [
      'Engineers use material-specific hardness conversion charts when a required test method cannot be performed. Charts are empirical: they apply to a stated material family and hardness regime, and they leave gaps where no verified relationship exists.',
      'This calculator ships a sparse educational chart for non-austenitic steels, aligned with ASTM E140-style relationships. Soft (HRB) and hard (HRC) regimes are listed separately. Em dashes mean that scale is not supported at that point. Do not treat the chart as universal for stainless, aluminum, copper, or nickel alloys.',
    ],
    showChart: true,
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Hardness Conversion',
    paragraphs: [
      '1. Select the material family (here: non-austenitic steel).',
      '2. Choose the hardness scale you measured (HBW, HRB, HRC, or HV).',
      '3. Enter the measured hardness value.',
      '4. Locate the corresponding interval in the verified soft or hard reference table.',
      '5. Interpolate linearly between adjacent validated rows when the value lies between them.',
      '6. Read estimated equivalents on other scales; treat missing cells as unavailable.',
      '7. Check the reference note and remember that converted numbers are approximate.',
    ],
    formula: 'y = y₁ + ((x − x₁) / (x₂ − x₁)) × (y₂ − y₁)  (no extrapolation)',
  },
  {
    id: 'brinell-vs-rockwell',
    title: 'Brinell vs. Rockwell Hardness',
    paragraphs: [
      'Brinell hardness is based on the projected area of a ball indentation. Rockwell hardness is based on the permanent increase in indentation depth after a major load is applied and then reduced to a minor load.',
      'Because geometry, load, and measured quantity differ, Brinell and Rockwell numbers are related only through empirical material-specific charts — never by a single universal equation for all metals.',
    ],
  },
  {
    id: 'vickers-explained',
    title: 'Vickers Hardness Explained',
    paragraphs: [
      'Vickers hardness uses a square-based diamond pyramid indenter. Hardness is computed from the applied force and the mean diagonal of the indentation. The scale covers soft through very hard materials and is common in metallography labs.',
      'Converted HV values from Brinell or Rockwell charts remain estimates. When a specification calls for HV, measure HV directly whenever practical.',
    ],
  },
  {
    id: 'why-approximate',
    title: 'Why Hardness Conversions Are Approximate',
    paragraphs: [
      'Hardness methods probe different combinations of elastic and plastic response. Indentation geometry, material microstructure, heat treatment, surface preparation, and test conditions all affect measured numbers.',
      'Even within one material family, published conversion tables report approximate relationships with limited ranges. Converted values do not replace direct testing when a contract or standard requires a specific hardness method.',
    ],
  },
];

const hvFor300Hbw = convertHardness({
  value: 300,
  scale: 'HBW',
  material: 'nonAusteniticSteel',
}).converted.HV;

export const HARDNESS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Vickers hardness number of steel with 300 HBW?',
    answer:
      hvFor300Hbw != null
        ? `For non-austenitic steel on this calculator’s educational ASTM E140-aligned chart, 300 HBW interpolates to approximately ${hvFor300Hbw} HV. Treat the result as approximate and prefer a direct Vickers test when required.`
        : 'Obtain HV from an applicable steel hardness conversion table for the material and range of interest. This tool reports an estimate only when the value falls inside its verified reference rows.',
  },
  {
    question: 'What is the hardness of mild steel?',
    answer:
      'Mild-steel hardness varies with composition, processing, and treatment. There is no single universal hardness number for all mild steels.',
  },
  {
    question: 'What is the relationship between hardness and tensile strength?',
    answer:
      'Empirical hardness–tensile relationships exist for some steels in limited ranges, but they are not universally applicable across materials or heat treatments.',
  },
  {
    question: 'What are Brinell, Rockwell, and Vickers hardness numbers?',
    answer:
      'They are method-specific indentation hardness numbers: Brinell from ball impression size, Rockwell from indentation depth under defined loads, and Vickers from diamond-pyramid indentation diagonals.',
  },
  {
    question: 'Can I convert HRC to HBW?',
    answer:
      'Yes, an estimated HBW may be read from an applicable material-specific hardness conversion reference within its supported range. Outside that range, no verified estimate should be shown.',
  },
  {
    question: 'Is HRB the same as HRC?',
    answer:
      'No. Rockwell B and Rockwell C use different indenters, loads, and scales. They are not interchangeable labels for the same measurement.',
  },
  {
    question: 'Are hardness conversions exact?',
    answer:
      'No. They are empirical approximations for a stated material family and range — not exact physical unit conversions like meters to millimeters.',
  },
];
