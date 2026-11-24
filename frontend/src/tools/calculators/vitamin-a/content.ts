import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VITAMIN_A_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'rae-and-iu', label: 'RAE and IU' },
  { id: 'source-factors', label: 'Source-specific factors' },
  { id: 'rda', label: 'Recommended intakes' },
  { id: 'how-to-use', label: 'How to use' },
  { id: 'sources', label: 'Sources and limits' },
  { id: 'vitamin-a-faq', label: 'Frequently Asked Questions' },
];

export interface VitaminAGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const VITAMIN_A_GUIDE_SECTIONS: readonly VitaminAGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This educational worksheet converts International Units (IU) to micrograms of retinol activity equivalents (mcg RAE) for known vitamin A sources, sums total RAE, and shows the NIH Office of Dietary Supplements age- and sex-specific Recommended Dietary Allowance (or Adequate Intake for infants).',
      'It does not prescribe a dose, diagnose deficiency, or replace labeled Supplement Facts or clinical advice.',
    ],
  },
  {
    id: 'rae-and-iu',
    title: 'RAE and IU',
    paragraphs: [
      'Modern nutrition labels use mcg RAE so retinol and provitamin A carotenoids can be compared on one scale. Older labels and some international products still list IU.',
      'IU cannot be converted to RAE unless the source is known. Mixed-diet IU totals are not convertible with a single factor.',
    ],
  },
  {
    id: 'source-factors',
    title: 'Source-specific factors',
    paragraphs: [
      'NIH ODS publishes IU → mcg RAE factors when the source is known: 1 IU retinol = 0.3 mcg RAE; 1 IU supplemental β-carotene = 0.3 mcg RAE; 1 IU dietary β-carotene = 0.05 mcg RAE; 1 IU dietary α-carotene or β-cryptoxanthin = 0.025 mcg RAE.',
      'Each panel converts its own IU ↔ RAE pair with that source’s factor. Total RAE is the sum of the four RAE fields — never the sum of IU values.',
    ],
    formula:
      'mcg RAE = IU × (mcg RAE per IU)    ·    IU = mcg RAE ÷ (mcg RAE per IU)    ·    total = Σ source RAE',
  },
  {
    id: 'rda',
    title: 'Recommended intakes',
    paragraphs: [
      'RDAs (and infant AIs) come from NIH ODS Table 1 for vitamin A, expressed as mcg RAE/day. This calculator shows male and female life-stage rows only; pregnancy and lactation RDAs are not on the reference worksheet.',
      'Comparing total entered RAE to the listed RDA/AI is a planning aid, not a clinical assessment.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to use',
    paragraphs: [
      'Select Female or Male and an age band to display the matching RDA or AI. Enter IU or mcg RAE in any source panel; the paired field updates with that panel’s NIH factor.',
      'Leave unused sources at zero so they do not inflate the total. Share copies only the public page URL — intakes stay in the browser.',
    ],
  },
  {
    id: 'sources',
    title: 'Sources and limits',
    paragraphs: [
      'Primary source: NIH Office of Dietary Supplements, Vitamin A and Carotenoids — Health Professional Fact Sheet (IU→RAE conversion notes and Table 1 RDAs/AIs).',
      'This tool reuses the same mcg-per-IU factors as the mcg to IU Converter for vitamin A presets. It does not invent factors, convert unknown mixed sources, or apply pregnancy/lactation rows.',
    ],
  },
];

export const VITAMIN_A_FAQS: readonly FAQItem[] = [
  {
    question: 'Why do dietary and supplemental β-carotene use different IU factors?',
    answer:
      'NIH ODS lists 1 IU supplemental β-carotene = 0.3 mcg RAE and 1 IU dietary β-carotene = 0.05 mcg RAE. Bioactivity differs by source, so the panels stay separate.',
  },
  {
    question: 'Can I convert a mixed-diet IU total to RAE?',
    answer:
      'No. NIH ODS states RAE can be converted to IU only when sources are known. Enter each known source in its panel instead of a single mixed IU amount.',
  },
  {
    question: 'Does this calculator include pregnancy or lactation RDAs?',
    answer:
      'Not on this worksheet. The reference UI shows Female/Male only. Use the NIH ODS table directly for pregnancy and lactation values.',
  },
  {
    question: 'Are my entries stored or shared?',
    answer:
      'No. Values stay in the browser. Share copies only the public calculator page URL—never age, sex, or intake amounts.',
  },
];
