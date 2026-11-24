import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MCG_TO_IU_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-iu', label: 'What Is an IU?' },
  { id: 'vitamin-d', label: 'Vitamin D Conversion' },
  { id: 'vitamin-a', label: 'Vitamin A Conversion' },
  { id: 'vitamin-e', label: 'Vitamin E Conversion' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'sources', label: 'Sources and Limits' },
  { id: 'mcg-to-iu-faq', label: 'Frequently Asked Questions' },
];

export interface McgToIuGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const MCG_TO_IU_GUIDE_SECTIONS: readonly McgToIuGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter translates between micrograms (mcg) and International Units (IU) for selected vitamin forms. IU measures biological activity, so every substance needs its own published factor.',
      'Only vitamin D, vitamin A (RAE pathways), and vitamin E (α-tocopherol) presets from NIH Office of Dietary Supplements and FDA nutrition-labeling guidance are included. The tool does not invent conversion factors or recommend a dose.',
    ],
  },
  {
    id: 'what-is-iu',
    title: 'What Is an IU?',
    paragraphs: [
      'An International Unit describes the biological effect of a substance, not a fixed mass. One IU of vitamin D is not the same mass as one IU of vitamin A or vitamin E.',
      'Always match the calculator substance to the exact form on the product label before converting.',
    ],
  },
  {
    id: 'vitamin-d',
    title: 'Vitamin D Conversion',
    paragraphs: [
      'NIH ODS states that 1 mcg of vitamin D equals 40 IU for vitamin D₂ (ergocalciferol) and vitamin D₃ (cholecalciferol). FDA labeling guidance uses the same relationship as IU × 0.025 = mcg.',
      'Example: 25 mcg × 40 = 1,000 IU. Conversely, 1,000 IU ÷ 40 = 25 mcg.',
    ],
    formula: 'IU = mcg × 40    ·    mcg = IU × 0.025',
  },
  {
    id: 'vitamin-a',
    title: 'Vitamin A Conversion',
    paragraphs: [
      'Modern labels use mcg RAE (retinol activity equivalents). NIH ODS publishes IU → mcg RAE factors when the source is known: 1 IU retinol = 0.3 mcg RAE; 1 IU supplemental β-carotene = 0.3 mcg RAE; 1 IU dietary β-carotene = 0.05 mcg RAE; 1 IU dietary α-carotene or β-cryptoxanthin = 0.025 mcg RAE.',
      'These presets convert between IU and mcg RAE for a single known source. They do not convert mixed sources or treat mcg RAE as the raw mass of a carotenoid powder.',
    ],
    formula: 'mcg RAE = IU × (mcg RAE per IU)    ·    IU = mcg RAE ÷ (mcg RAE per IU)',
  },
  {
    id: 'vitamin-e',
    title: 'Vitamin E Conversion',
    paragraphs: [
      'NIH ODS lists vitamin E in mg of α-tocopherol. Older labels still show IU. Natural (d-α-tocopherol / RRR) uses 1 IU = 0.67 mg (670 mcg). Synthetic (dl-α-tocopherol / all-rac) uses 1 IU = 0.45 mg (450 mcg).',
      'Select the natural or synthetic preset that matches the label wording before converting.',
    ],
    formula: 'Natural: mcg = IU × 670    ·    Synthetic: mcg = IU × 450',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Choose the substance that matches your label. Enter either a mass (mcg, mg, or g) or an IU amount; the other field fills automatically. Changing substance clears the derived field so an old factor cannot linger.',
      'Share result copies a short summary plus the public page URL only—entered values are not stored. Reload restores the blank Vitamin D starting state; Clear all changes empties both quantity fields.',
    ],
  },
  {
    id: 'sources',
    title: 'Sources and Limits',
    paragraphs: [
      'Factors follow NIH Office of Dietary Supplements vitamin fact sheets and FDA guidance on converting IU for vitamins A, D, and E on Nutrition and Supplement Facts labels.',
      'This page is educational unit conversion only. It does not diagnose deficiency, set a supplement dose, or replace product labeling or clinical advice.',
    ],
  },
];

export const MCG_TO_IU_FAQS: readonly FAQItem[] = [
  {
    question: 'How many IU are in 25 mcg of vitamin D?',
    answer: '25 mcg × 40 = 1,000 IU for vitamin D₂ or D₃ (NIH ODS / FDA).',
  },
  {
    question: 'How do I convert IU to mcg for vitamin D?',
    answer: 'Multiply IU by 0.025, or divide IU by 40. Example: 1,000 IU → 25 mcg.',
  },
  {
    question: 'Why does the substance matter?',
    answer:
      'IU is substance-specific. Vitamin D, vitamin A forms, and vitamin E forms each use different published factors.',
  },
  {
    question: 'What mass unit does vitamin A use here?',
    answer:
      'Vitamin A presets use mcg RAE with the NIH ODS IU → RAE factors for a known single source.',
  },
  {
    question: 'How do natural and synthetic vitamin E differ?',
    answer:
      'Natural d-α-tocopherol uses 1 IU = 0.67 mg (670 mcg). Synthetic dl-α-tocopherol uses 1 IU = 0.45 mg (450 mcg) (NIH ODS).',
  },
  {
    question: 'Can I convert any drug from mcg to IU?',
    answer:
      'No. Only the listed vitamins with published NIH ODS / FDA factors are supported. Other substances need their own labeled potency.',
  },
  {
    question: 'Does this calculator recommend a dose?',
    answer:
      'No. It only converts labeled units. Dose decisions belong with a qualified healthcare professional and the product label.',
  },
];
