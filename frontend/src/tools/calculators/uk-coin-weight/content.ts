import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UK_COIN_WEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'UK Coin Weight Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'royal-mint-masses', label: 'Royal Mint Standard Masses' },
  { id: 'units', label: 'Grams and Kilograms' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ukcw-faq', label: 'Frequently Asked Questions' },
];

export const UK_COIN_WEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the UK Coin Weight Calculator work?',
    answer:
      'Enter how many coins you have of each denomination. The calculator multiplies each count by the Royal Mint standard mass for that coin and sums the results in grams. You can display the same total in kilograms.',
  },
  {
    question: 'Which coin weights are used?',
    answer:
      'Current circulating specifications from The Royal Mint: 1p 3.56 g, 2p 7.12 g, 5p 3.25 g, 10p 6.50 g, 20p 5.00 g, 50p 8.00 g, £1 (12-sided) 8.75 g, and £2 12.00 g.',
  },
  {
    question: 'Does switching from g to kg change the calculation?',
    answer:
      'No. The calculator always stores the total in grams. Choosing kg only divides by 1,000 for display.',
  },
  {
    question: 'Is face value the same as weight?',
    answer:
      'No. Face value is the monetary sum of the counts you entered. Weight is estimated mass from standard coin specifications.',
  },
  {
    question: 'Why might a real bag of coins weigh differently?',
    answer:
      'Manufacturing tolerance, dirt, wear, mixed commemorative issues, or older withdrawn designs can shift actual mass. This tool is an educational estimate from published standards.',
  },
];
