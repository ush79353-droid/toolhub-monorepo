import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUICK_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Quick Ratio Calculator' },
  { id: 'definition', label: 'What Is a Quick Ratio?' },
  { id: 'formula', label: 'Quick Ratio Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Quick Ratio' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'good-ratio', label: 'What Is a Good Quick Ratio?' },
  { id: 'vs-current', label: 'Quick Ratio vs Current Ratio' },
  { id: 'vs-cash', label: 'Quick Ratio vs Cash Ratio' },
  { id: 'included', label: 'Assets Included' },
  { id: 'excluded', label: 'Assets Excluded' },
  { id: 'factors', label: 'What Factors Affect Quick Ratio?' },
  { id: 'importance', label: 'Why Quick Ratio Matters' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'improve', label: 'How to Improve Quick Ratio' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'qr-faq', label: 'Frequently Asked Questions' },
];

export const QUICK_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a quick ratio?',
    answer:
      'The quick ratio (acid-test ratio) compares a company’s most liquid current assets — typically cash, marketable securities, and net receivables — to its current liabilities.',
  },
  {
    question: 'What does acid-test ratio mean?',
    answer:
      'Acid-test is another name for the quick ratio. It asks whether liquid assets could “test” coverage of short-term obligations without selling inventory.',
  },
  {
    question: 'How do I calculate the quick ratio?',
    answer:
      'Add cash and cash equivalents, marketable securities, and net accounts receivable, then divide by current liabilities: QR = (C + MS + AR) ÷ CL.',
  },
  {
    question: 'What is the quick ratio formula?',
    answer:
      'QR = Quick Assets ÷ Current Liabilities, with Quick Assets = Cash + Marketable Securities + Net Accounts Receivable. An adjusted form is (CA − Inventory − Prepaid − Other non-quick) ÷ CL.',
  },
  {
    question: 'What is a good quick ratio?',
    answer:
      'There is no universal good ratio. Above 1 often means quick assets exceed current liabilities, but suitable levels depend on industry, receivables quality, and cash-flow timing.',
  },
  {
    question: 'Is a quick ratio of 1 good?',
    answer:
      'A ratio of 1.00 means quick assets equal current liabilities under the inputs used. That can be adequate for some models and thin for others — context matters.',
  },
  {
    question: 'Is a quick ratio below 1 bad?',
    answer:
      'Below 1 means quick assets are less than current liabilities. It signals tighter liquid coverage, but it is not an automatic sign of distress without industry and cash-flow context.',
  },
  {
    question: 'Can the quick ratio be greater than 2?',
    answer:
      'Yes. High ratios can reflect strong liquidity or idle cash. Extremely high ratios are not automatically “better” if capital could be used more productively.',
  },
  {
    question: 'Can a quick ratio be zero?',
    answer:
      'Yes, if quick assets are zero while current liabilities are positive. That implies no measured liquid coverage from the included asset set.',
  },
  {
    question: 'Can the quick ratio be negative?',
    answer:
      'Not under this calculator’s non-negative asset and liability inputs. Negative reported assets or unusual classifications require separate analysis.',
  },
  {
    question: 'What is the difference between quick ratio and current ratio?',
    answer:
      'Current ratio uses total current assets ÷ current liabilities. Quick ratio excludes less-liquid items such as inventory and prepaid expenses from the numerator.',
  },
  {
    question: 'What is the difference between quick ratio and cash ratio?',
    answer:
      'Cash ratio is stricter, typically using cash (and sometimes cash equivalents / near-cash) versus current liabilities, often excluding receivables.',
  },
  {
    question: 'Why is inventory excluded from the quick ratio?',
    answer:
      'Inventory may take time to sell and convert into cash, and may realize at a discount. The acid-test focuses on assets more readily available to meet near-term obligations.',
  },
  {
    question: 'Are accounts receivable included in the quick ratio?',
    answer:
      'Yes, usually net of allowances. Slow or doubtful collections can overstate liquidity even when the ratio looks healthy.',
  },
  {
    question: 'Are marketable securities included in the quick ratio?',
    answer:
      'Yes when they are liquid and unrestricted. Illiquid or restricted securities should not be treated as quick assets.',
  },
  {
    question: 'What are quick assets?',
    answer:
      'Quick assets are the liquid current assets used in the acid-test numerator — commonly cash, cash equivalents, marketable securities, and net receivables.',
  },
  {
    question: 'What happens if current liabilities are zero?',
    answer:
      'The quick ratio is undefined (division by zero). Enter a positive current liabilities amount to compute a finite ratio.',
  },
  {
    question: 'How can a company improve its quick ratio?',
    answer:
      'Faster collections, prudent cash reserves, and managing short-term liabilities can help. Maximizing the ratio is not always optimal for operations or returns.',
  },
  {
    question: 'Why do investors use the quick ratio?',
    answer:
      'It offers a quick read on short-term liquidity without assuming inventory can be sold immediately — useful alongside cash flow and other ratios.',
  },
  {
    question: 'How often should a company calculate its quick ratio?',
    answer:
      'Often with each reporting period or when working-capital conditions change. Seasonal businesses may need more frequent monitoring.',
  },
  {
    question: 'Does a high quick ratio always mean financial strength?',
    answer:
      'No. Asset quality, upcoming maturities, off-balance commitments, and operating cash needs can still create stress despite a high ratio.',
  },
  {
    question: 'What is the quick ratio for a company with no inventory?',
    answer:
      'If inventory is already zero, quick ratio and current ratio may be closer (or equal if no other non-quick current assets). Always check prepaid and other exclusions.',
  },
  {
    question:
      'Can two companies with the same quick ratio have different liquidity risks?',
    answer:
      'Yes. Receivables aging, security liquidity, liability timing, unused credit lines, and cash-flow volatility can differ widely at the same ratio.',
  },
  {
    question: 'How do accounting classifications affect the quick ratio?',
    answer:
      'How items are labeled as cash equivalents, marketable securities, or current liabilities changes the inputs. Consistent classification is essential for comparisons.',
  },
];
