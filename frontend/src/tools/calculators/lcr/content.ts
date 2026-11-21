import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LCR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'LCR Calculator — Liquidity Coverage Ratio' },
  { id: 'what-is', label: 'What Is the Liquidity Coverage Ratio (LCR)?' },
  { id: 'why-important', label: 'Why Is the Liquidity Coverage Ratio Important?' },
  { id: 'formula', label: 'Liquidity Coverage Ratio Formula' },
  { id: 'hqla', label: 'What Are High-Quality Liquid Assets?' },
  { id: 'how-hqla', label: 'How to Calculate High-Quality Liquid Assets' },
  { id: 'net-outflows', label: 'What Are Expected 30-Day Net Cash Outflows?' },
  { id: 'how-to', label: 'How to Calculate the Liquidity Coverage Ratio' },
  { id: 'interpret', label: 'How to Interpret the LCR' },
  { id: 'good-lcr', label: 'What Is a Good Liquidity Coverage Ratio?' },
  { id: 'basel', label: 'Basel III Liquidity Coverage Ratio Requirements' },
  { id: 'vs-nsfr', label: 'LCR vs. Net Stable Funding Ratio' },
  { id: 'vs-other', label: 'LCR vs. Other Bank Liquidity Ratios' },
  { id: 'improve', label: 'How Can Banks Improve Their LCR?' },
  { id: 'limitations', label: 'Limitations of the Liquidity Coverage Ratio' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'lcr-faq', label: 'Frequently Asked Questions' },
];

export const LCR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is LCR in banking?',
    answer:
      'The Liquidity Coverage Ratio measures whether a bank holds enough high-quality liquid assets to cover estimated net cash outflows over a 30-day stress period.',
  },
  {
    question: 'What does LCR stand for?',
    answer: 'Liquidity Coverage Ratio.',
  },
  {
    question: 'What is the liquidity coverage ratio formula?',
    answer:
      'LCR = (HQLA / Expected 30-day net cash outflows) × 100.',
  },
  {
    question: 'How do you calculate LCR?',
    answer:
      'Divide eligible high-quality liquid assets by expected net cash outflows over 30 days and multiply by 100.',
  },
  {
    question: 'What is a good LCR?',
    answer:
      'Basel frameworks often reference a 100% minimum for covered banks, but “good” depends on jurisdiction, business model, and supervisory expectations. Higher is not automatically better.',
  },
  {
    question: 'Is 100% LCR good?',
    answer:
      'It meets a commonly cited Basel-style minimum in many educational presentations, but local rules, phase-ins, and bank-specific supervision still matter.',
  },
  {
    question: 'Can LCR exceed 100%?',
    answer:
      'Yes. Many banks operate with buffers above 100%. This calculator does not clamp results at 100%.',
  },
  {
    question: 'Can LCR be negative?',
    answer:
      'Not under the standard nonnegative HQLA and positive net-outflow formula. Negative inputs are rejected here.',
  },
  {
    question: 'What does an LCR below 100% mean?',
    answer:
      'Illustratively, estimated HQLA are below estimated 30-day net outflows. That is not automatically a legal finding — use is educational.',
  },
  {
    question: 'What is Basel III?',
    answer:
      'An international banking reform package from the Basel Committee on Banking Supervision that includes capital and liquidity standards such as LCR and NSFR.',
  },
  {
    question: 'What are high-quality liquid assets?',
    answer:
      'Assets that can be expected to convert into cash easily and with little loss of value in stress, subject to eligibility rules, haircuts, and composition caps.',
  },
  {
    question: 'What are Level 1 HQLA?',
    answer:
      'The highest-quality HQLA category (e.g., qualifying cash, central bank reserves, and certain sovereign securities), typically without haircut in simplified illustrations.',
  },
  {
    question: 'What are Level 2A assets?',
    answer:
      'Eligible liquid assets below Level 1 quality; educational illustrations often apply a 15% haircut and include them within Level 2 composition limits.',
  },
  {
    question: 'What are Level 2B assets?',
    answer:
      'A lower HQLA subcategory with larger haircuts (e.g., 25% or 50% depending on instrument type) and tighter composition caps in Basel-style frameworks.',
  },
  {
    question: 'What are 30-day net cash outflows?',
    answer:
      'Estimated cash outflows minus allowable inflows over a 30-calendar-day stress horizon under the LCR standard’s assumptions.',
  },
  {
    question: 'Why does LCR use a 30-day period?',
    answer:
      'It focuses on short-term liquidity resilience — whether liquid assets can cover stressed net outflows for about one month.',
  },
  {
    question: 'What is the difference between LCR and NSFR?',
    answer:
      'LCR is a 30-day HQLA-to-net-outflows measure; NSFR compares available stable funding to required stable funding over a one-year horizon.',
  },
  {
    question: 'What is the minimum LCR requirement?',
    answer:
      'Basel standards generally reference 100% for covered banks after phase-in, but national implementation and supervisory practice can differ. Verify local rules.',
  },
  {
    question: 'Can banks use their liquidity buffers during stress?',
    answer:
      'Basel LCR design contemplates that banks may draw on HQLA in genuine stress, subject to supervisory expectations — not a prohibition on ever falling below 100% during crisis.',
  },
  {
    question: 'How can banks improve their liquidity coverage ratio?',
    answer:
      'Increase eligible HQLA, reduce expected outflows, manage funding concentration, diversify funding, and strengthen liquidity planning — within business and regulatory constraints.',
  },
  {
    question: 'Does a higher LCR always mean a safer bank?',
    answer:
      'No. Liquidity is only one risk dimension; capital, credit quality, governance, and market conditions also matter, and excess liquidity has opportunity costs.',
  },
  {
    question: 'What are the limitations of LCR?',
    answer:
      'It relies on regulatory assumptions, varies by jurisdiction, may not capture all stress dynamics, and is incomplete as a sole measure of bank safety.',
  },
  {
    question: 'What happens when a bank faces a liquidity shortage?',
    answer:
      'It may sell or pledge liquid assets, seek funding, use central bank facilities where available, and face intensified supervision — outcomes depend on severity and policy frameworks.',
  },
  {
    question: 'Is LCR relevant to nonbank financial institutions?',
    answer:
      'The Basel LCR is a bank prudential standard. Other entities may use similar concepts informally, but formal LCR rules target covered banks unless local law extends them.',
  },
  {
    question: 'How do regulatory haircuts affect HQLA?',
    answer:
      'Haircuts reduce the recognized value of lower-quality liquid assets so the HQLA stock reflects expected realizable value in stress.',
  },
];
