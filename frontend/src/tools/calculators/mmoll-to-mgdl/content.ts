import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MMOLL_TO_MGDL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'formula', label: 'Conversion Formula' },
  { id: 'common-analytes', label: 'Common Analytes' },
  { id: 'custom-molar-mass', label: 'Custom Molar Mass' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'sources', label: 'Sources and Limits' },
  { id: 'mmoll-to-mgdl-faq', label: 'Frequently Asked Questions' },
];

export interface MmollToMgdlGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const MMOLL_TO_MGDL_GUIDE_SECTIONS: readonly MmollToMgdlGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Clinical laboratories report some analytes in millimoles per litre (mmol/L, SI) and others in milligrams per decilitre (mg/dL, conventional). Converting between them requires the substance molar mass—there is no single universal multiplier.',
      'This educational converter covers common blood analytes with published molecular weights or clinical reporting conventions, plus an independent custom molar-mass panel for other defined substances.',
    ],
  },
  {
    id: 'formula',
    title: 'Conversion Formula',
    paragraphs: [
      'Mass concentration equals molar concentration times molar mass. Accounting for litre versus decilitre gives the compact form used here: divide the molar mass in g/mol by 10 to obtain the mg/dL-per-mmol/L factor.',
      'Example (glucose, MW 180.156 g/mol): 5 mmol/L × 180.156 ÷ 10 = 90.078 mg/dL. The reverse divides by the same factor so the conversion does not drift.',
    ],
    formula: 'mg/dL = mmol/L × (MW g/mol) ÷ 10    ·    mmol/L = mg/dL × 10 ÷ MW',
  },
  {
    id: 'common-analytes',
    title: 'Common Analytes',
    paragraphs: [
      'Glucose uses anhydrous C₆H₁₂O₆ ≈ 180.156 g/mol (factor ×18.0156). Cholesterol (total/HDL/LDL mass) uses 386.65 g/mol (×38.67). Triglycerides follow the clinical triolein convention 885.7 g/mol (×88.57).',
      'Creatinine ≈ 113.12 g/mol; urea (whole molecule) ≈ 60.06 g/mol; BUN uses urea-nitrogen mass ≈ 28.014 g/mol; uric acid ≈ 168.11 g/mol; calcium ≈ 40.078 g/mol; magnesium ≈ 24.305 g/mol; bilirubin ≈ 584.66 g/mol. Match the entity named on the report (especially urea vs BUN).',
    ],
  },
  {
    id: 'custom-molar-mass',
    title: 'Custom Molar Mass',
    paragraphs: [
      'The custom panel is independent of the preset molecule fields. Enter a positive molar mass in g/mol, then either concentration; the other field updates with the same MW ÷ 10 rule.',
      'Non-positive molar mass is rejected and no custom conversion is shown. Changing custom values never overwrites the preset panel, and the reverse is also true.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use',
    paragraphs: [
      'Select the analyte that matches the laboratory report. Enter mmol/L or mg/dL; the paired field fills automatically. Optionally open Custom molar mass for a separate independent conversion.',
      'Share result copies a short summary plus the public page URL only—entered values are not stored. Reload restores Glucose with blank fields and custom open; Clear empties both panels.',
    ],
  },
  {
    id: 'sources',
    title: 'Sources and Limits',
    paragraphs: [
      'Molar masses follow PubChem / IUPAC-style molecular weights and widely cited clinical reporting factors (NCEP lipids, CIAAW atomic weights for Ca/Mg/N, triolein convention for triglycerides).',
      'This page does not diagnose, set reference ranges, or replace the reporting units on a laboratory result. Some analytes are more often reported in µmol/L—convert to mmol/L (÷1000) before using this tool.',
    ],
  },
];

export const MMOLL_TO_MGDL_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert glucose from mmol/L to mg/dL?',
    answer:
      'Multiply by 18.0156 (MW 180.156 ÷ 10). Example: 5 mmol/L → 90.078 mg/dL.',
  },
  {
    question: 'Is there one mmol/L to mg/dL factor for every lab test?',
    answer:
      'No. Each analyte needs its own molar mass (or clinical reporting convention). Glucose ×18 is not valid for cholesterol or triglycerides.',
  },
  {
    question: 'What is the difference between urea and BUN here?',
    answer:
      'Urea uses the whole-molecule mass ≈ 60.06 g/mol. BUN reports urea nitrogen ≈ 28.014 g/mol. Use the entity named on the report.',
  },
  {
    question: 'Can I enter my own molar mass?',
    answer:
      'Yes. Expand Custom molar mass, enter a positive g/mol value, then either concentration. That panel stays independent of the preset molecule fields.',
  },
  {
    question: 'Why was my custom conversion rejected?',
    answer:
      'Custom molar mass must be a finite positive number. Zero, negative, or blank mass cannot define a conversion factor.',
  },
  {
    question: 'Does this interpret whether my lab value is normal?',
    answer:
      'No. It only converts units. Reference intervals and clinical decisions belong with a qualified clinician and the reporting laboratory.',
  },
];
