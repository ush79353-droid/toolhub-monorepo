import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Markaki M et al. A validated clinical risk prediction model for lung cancer in smokers of all ages and exposure types: A HUNT Study. EBioMedicine. 2018;31:36–46. Corrigendum EBioMedicine. 2022;82:104187 (natural log +1 increments; non-rounded coefficients; S0(16)≈0.06 Cox absolute risk; 6-year logistic). Ever-smokers only.';

export const DISCLAIMER =
  'Educational HUNT Lung Cancer Model worksheet for ever-smokers only. It does not diagnose cancer, recommend screening, or replace clinician judgment. Never-smokers are outside the published validation population.';

export const LUNG_CANCER_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Lung Cancer Risk Calculator' },
  { id: 'how-it-works', label: 'How the HUNT model works' },
  { id: 'quitting', label: 'Quitting and risk' },
  { id: 'limits', label: 'Limits' },
  { id: 'lung-cancer-risk-faq', label: 'Frequently Asked Questions' },
];

export const LUNG_CANCER_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'What percentage of smokers get lung cancer?',
    answer:
      'Lifetime risk varies widely by intensity, duration, age, and other factors. This tool reports 6- and 16-year absolute risks from the HUNT ever-smoker model, not a single lifetime percentage for all smokers.',
  },
  {
    question: 'How does the lung cancer risk calculator work?',
    answer:
      'It applies Markaki et al. (HUNT) coefficients: sex, age transform (age/100)⁻¹, pack-years, cigarettes/day, years since quitting, BMI, daily indoor smoke hours, and daily cough. Pack-years = (cigarettes/day ÷ 20) × smoking years. Natural logs use ln(x+1) per the 2022 corrigendum.',
  },
  {
    question: 'Can never-smokers use this calculator?',
    answer:
      'No. The HUNT Lung Cancer Model was derived and validated in ever-smokers. Risks for never-smokers are outside that population and are not estimated here.',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Share and copy use the public page URL only — never ages, body measures, smoking history, or risk percentages.',
  },
];
