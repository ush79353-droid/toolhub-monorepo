import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ZAKAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-zakat', label: 'What is zakat?' },
  { id: 'what-is-nisab', label: 'What is nisab?' },
  { id: 'how-much-zakat-to-pay', label: 'Zakat calculator: How much zakat to pay.' },
  { id: 'assets-subject-to-zakat', label: 'Assets subject to zakat.' },
  { id: 'how-to-calculate-zakat', label: 'How to calculate zakat: Calculating it the right way.' },
  { id: 'zakat-calculation-example', label: 'Zakat calculation example.' },
  { id: 'zakat-faq', label: 'FAQs' },
];

export const ZAKAT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is Nisab significant?',
    answer:
      'Nisab is the minimum wealth threshold. If net Zakatable wealth is below the Nisab you selected, this calculator estimates Zakat at zero. Gold Nisab is 87.48 grams. Silver Nisab is 612.36 grams. The money value of those weights moves with the metal price. Scholars differ on whether to use the gold or the silver benchmark.',
  },
  {
    question: 'Am I eligible to pay Zakat?',
    answer:
      'Zakat generally applies to a Muslim who owns qualifying wealth that meets Nisab and has been held for one lunar year (Hawl), subject to the rules of the school they follow. This page estimates an amount. It does not decide eligibility.',
  },
  {
    question: 'Should I pay Zakat on jewelry I wear?',
    answer:
      'Scholars differ on gold and silver jewelry that is worn. Some include it. Others treat personal-use jewelry as exempt. Follow the guidance you accept, and enter only the weight you intend to include. Purity reduces the value of metal that is not pure.',
  },
  {
    question: 'How much Zakat should I pay on my net worth?',
    answer:
      'Ordinary personal belongings and a home you live in are not added here. Eligible net wealth — assets minus the immediate liabilities you deduct — is estimated at 2.5% when it meets the selected Nisab. Confirm Hawl before treating that figure as due.',
  },
  {
    question: 'How much Zakat do I pay on savings of 200,000?',
    answer:
      'If the full 200,000 is Zakatable, meets your Nisab, and the lunar-year condition is met, the illustrative amount is 200,000 × 2.5% = 5,000 in the same currency. If part of it is not yet due, or liabilities reduce it below Nisab, the amount is lower.',
  },
  {
    question: 'Do I pay Zakat on my house?',
    answer:
      'A primary residence is generally not Zakatable. Property held for trade, or cash and inventory from a property business, can be. This calculator has no home field. Enter only the value that your method treats as Zakatable.',
  },
  {
    question: 'Do I pay Zakat on stocks and investments?',
    answer:
      'It depends on why you hold them and which method you follow. Some approaches use the market value. Others use the Zakatable portion of the underlying assets, or dividends and cash. Enter the value you have already decided is eligible. Do not also enter that same value as cash.',
  },
];
