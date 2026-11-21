import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HRA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'HRA Exemption Calculator' },
  { id: 'what-is-hra', label: 'What Is HRA?' },
  { id: 'what-is-exemption', label: 'What Is HRA Exemption?' },
  { id: 'eligibility', label: 'Who Is Eligible?' },
  { id: 'formula', label: 'HRA Exemption Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate HRA' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'metro', label: 'Metro and Non-Metro Cities' },
  { id: 'old-regime', label: 'Old Tax Regime' },
  { id: 'new-regime', label: 'New Tax Regime' },
  { id: 'da', label: 'Does DA Count?' },
  { id: 'documents', label: 'Documents Required' },
  { id: 'rent-changes', label: 'When Rent Changes' },
  { id: 'parents', label: 'Living With Parents' },
  { id: 'vs-80gg', label: 'HRA vs Section 80GG' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hra-faq', label: 'Frequently Asked Questions' },
];

export const HRA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is HRA?',
    answer:
      'House Rent Allowance is a salary component employers may pay to help employees meet rental housing costs. Part of HRA can be tax-exempt under Indian income-tax rules when conditions are met.',
  },
  {
    question: 'What is the full form of HRA?',
    answer: 'HRA stands for House Rent Allowance.',
  },
  {
    question: 'What is HRA exemption?',
    answer:
      'HRA exemption is the portion of House Rent Allowance that is treated as tax-free when you rent qualifying accommodation and claim under the applicable (typically old) tax regime.',
  },
  {
    question: 'How is HRA exemption calculated?',
    answer:
      'Under the old regime, exemption is the lowest of: (1) actual HRA received, (2) rent paid minus 10% of qualifying salary, and (3) 40% or 50% of qualifying salary based on city and tax year.',
  },
  {
    question: 'What is the HRA exemption formula?',
    answer:
      'Exempt = max(0, min(HRA, R − 0.10S, p×S)), where S is qualifying salary and p is 0.40 or 0.50. Taxable HRA = actual HRA − exempt HRA.',
  },
  {
    question: 'Is HRA exemption available under the new tax regime?',
    answer:
      'Generally no. This calculator sets HRA exemption to zero under the new regime and shows the full HRA as non-exempt for the HRA computation.',
  },
  {
    question: 'What is the maximum HRA exemption?',
    answer:
      'It cannot exceed actual HRA received, and is further capped by rent−10% of salary and the city percentage of salary. There is no single fixed rupee maximum for all taxpayers.',
  },
  {
    question: 'Is HRA exemption 40% or 50%?',
    answer:
      'The salary-percentage limb is 50% for designated cities in the selected tax year’s rules, otherwise 40%. That limb is only one of three caps.',
  },
  {
    question: 'Which cities qualify for the 50% HRA limit?',
    answer:
      'Historically Delhi, Mumbai, Kolkata, and Chennai. From FY 2026–27 this tool’s educational mapping also includes Bengaluru, Hyderabad, Pune, and Ahmedabad. Confirm official notifications for your year.',
  },
  {
    question: 'Does DA count toward HRA salary?',
    answer:
      'Only DA that forms part of salary for retirement benefits is included in qualifying salary. Use the calculator checkbox to include or exclude DA.',
  },
  {
    question: 'Can I claim HRA without paying rent?',
    answer:
      'No. Without qualifying rent paid, the rent−10% limb is zero (or negative, floored at zero), so exemption is typically zero.',
  },
  {
    question: 'Can I claim HRA if I live with my parents?',
    answer:
      'Possibly, if there is a genuine rental arrangement and documentation supporting rent paid. Mere cohabitation without rent usually does not qualify. This is not legal advice.',
  },
  {
    question: 'Can I claim HRA if I own a house?',
    answer:
      'Owning a house elsewhere does not by itself grant HRA exemption. You still need qualifying rent paid for the accommodation you occupy under the rules.',
  },
  {
    question: 'Can I claim HRA and home loan benefits together?',
    answer:
      'In some situations both may be available subject to distinct conditions (for example renting while owning another property). Interaction rules are fact-specific; consult current law or a professional.',
  },
  {
    question: 'Is HRA fully tax-free?',
    answer:
      'Not necessarily. Only the exempt portion is tax-free under eligible claims; any excess HRA is taxable.',
  },
  {
    question: 'What happens if rent is less than 10% of salary?',
    answer:
      'Rent minus 10% of salary becomes zero (or would be negative and is treated as zero), so HRA exemption is zero under the standard formula.',
  },
  {
    question: 'Can I claim HRA for only part of the year?',
    answer:
      'Yes. Use eligible months in this calculator to scale annual exempt and taxable amounts when you rented for only part of the year.',
  },
  {
    question: 'What documents are required for HRA exemption?',
    answer:
      'Employers and tax authorities commonly expect rent receipts/agreements and, above certain rent thresholds, landlord PAN details. Requirements can change — verify for your year.',
  },
  {
    question: 'What is the difference between HRA and Section 80GG?',
    answer:
      'HRA exemption applies when HRA is part of salary. Section 80GG (or its successor) may help eligible taxpayers who pay rent but do not receive HRA. They are different provisions.',
  },
  {
    question: 'Can I claim HRA without rent receipts?',
    answer:
      'Claims without supporting documents are risky. Payroll and assessment practices usually expect proof of rent. This tool does not replace documentation.',
  },
  {
    question: 'Is landlord PAN information required?',
    answer:
      'Often yes when annual rent exceeds the threshold specified in current rules. Confirm the applicable year’s documentation requirements.',
  },
  {
    question: 'How do I calculate annual HRA exemption?',
    answer:
      'Compute monthly exemption, then multiply by the number of eligible months (usually 12). This calculator shows both monthly and annual figures.',
  },
  {
    question: 'How do I calculate monthly HRA exemption?',
    answer:
      'Normalize salary, HRA, and rent to monthly amounts, compute the three limbs, and take the minimum (floored at zero) under the old regime.',
  },
  {
    question: 'What happens if my HRA changes during the year?',
    answer:
      'Ideal treatment is period-based: apply the formula separately for each period with different HRA/rent/salary, then sum. Use partial-year months as a simplified average when periods are uniform.',
  },
  {
    question: 'What happens if I relocate to another city?',
    answer:
      'Apply the city percentage that applies to each period of residence under that tax year’s rules. A mid-year move can change the 40%/50% limb.',
  },
];
