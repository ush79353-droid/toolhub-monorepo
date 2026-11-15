import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AFN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-afn', label: 'What is Additional Funds Needed?' },
  { id: 'afn-formula', label: 'AFN formula' },
  { id: 'how-to-calculate', label: 'How to calculate AFN' },
  { id: 'change-in-assets-liabilities', label: 'Assets and liabilities' },
  { id: 'retained-earnings', label: 'Retained earnings' },
  { id: 'positive-negative-zero', label: 'Positive, negative, and zero AFN' },
  { id: 'worked-examples', label: 'Worked examples' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'afn-faq', label: 'Frequently asked questions' },
];

export interface AfnGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const AFN_GUIDE_SECTIONS: readonly AfnGuideSection[] = [
  {
    id: 'what-is-afn',
    title: 'What is Additional Funds Needed (AFN)?',
    paragraphs: [
      'Additional funds needed is a planning estimate of how much new outside capital a firm may require if assets grow with sales while only some of that growth is financed spontaneously by liabilities and retained earnings. Analysts use it when sketching next year’s balance sheet before choosing debt, equity, or a mix of both.',
      'AFN is not a bank’s credit decision and it is not a full cash-flow statement. It answers a narrower question: after spontaneous financing and internal equity retention, how large is the remaining financing gap (or surplus)?',
    ],
  },
  {
    id: 'afn-formula',
    title: 'AFN formula',
    paragraphs: [
      'This calculator uses the simplified identity that many textbooks introduce before the full percentage-of-sales model. Subtract the increase in liabilities and the increase in retained earnings from the increase in assets. What remains is the additional funds needed.',
      'The same identity rearranges to a financing surplus when liabilities and retained earnings grow by more than assets. The calculator leaves that surplus as a negative number instead of forcing the result to zero.',
    ],
    formula: 'AFN = ΔA − ΔL − ΔRE',
  },
  {
    id: 'how-to-calculate',
    title: 'How to calculate additional funding requirements',
    paragraphs: [
      'Start with the planned change in assets for the period. Then enter how much spontaneous liabilities are expected to rise, and how much retained earnings will increase after dividends. The calculator subtracts those two financing sources from the asset change.',
      'Keep every amount in the same currency and for the same planning horizon. Mixing a one-year asset forecast with a quarterly retained-earnings figure will invent a gap that is not real.',
    ],
    formula: 'Additional funds needed = Change in assets − Change in liabilities − Change in retained earnings',
  },
  {
    id: 'change-in-assets-liabilities',
    title: 'Change in assets and liabilities',
    paragraphs: [
      'A rise in assets is the financing demand. Inventory, receivables, and fixed assets that grow with sales all consume capital. A fall in assets (a negative change) reduces the need for new funds or can create a surplus on its own.',
      'The liability change in this simplified model stands for spontaneous financing — accounts payable, accruals, and similar items that tend to rise when operations expand. Long-term debt that management chooses later is usually treated as the plug that fills AFN, not as part of ΔL in this identity.',
    ],
  },
  {
    id: 'retained-earnings',
    title: 'Retained earnings and internal financing',
    paragraphs: [
      'Retained earnings are profits kept in the business after dividends. That addition is internal equity financing: it funds part of asset growth without a new share issue or loan.',
      'If the firm pays out most of its earnings, ΔRE is small and AFN rises. If it retains more, AFN falls. The calculator does not project sales, margins, or payout ratios for you — enter the retained-earnings change you already estimated.',
    ],
  },
  {
    id: 'positive-negative-zero',
    title: 'Positive, negative, and zero AFN',
    paragraphs: [
      'A positive AFN means the simplified model still needs outside money after spontaneous liabilities and retained earnings. That plug can be new debt, new equity, or a combination decided elsewhere.',
      'Zero AFN means those sources cover the asset change exactly under the numbers you entered. Negative AFN means a surplus: the firm is generating more spontaneous and internal financing than the asset plan requires. The surplus is left signed; it is not rewritten as zero.',
    ],
  },
  {
    id: 'worked-examples',
    title: 'Worked AFN examples',
    paragraphs: [
      'Example 1 — funding gap. Assets rise by 100,000, liabilities by 30,000, and retained earnings by 20,000. AFN = 100,000 − 30,000 − 20,000 = 50,000. The firm still needs 50,000 of external funds.',
      'Example 2 — balanced plan. Assets 50,000, liabilities 30,000, retained earnings 20,000. AFN = 0. Spontaneous and internal financing cover the growth.',
      'Example 3 — surplus. Assets 40,000, liabilities 30,000, retained earnings 20,000. AFN = −10,000. The model shows more financing than the asset plan needs.',
    ],
  },
  {
    id: 'limitations',
    title: 'Limitations of the simplified AFN formula',
    paragraphs: [
      'The full textbook AFN equation often embeds sales growth, capital intensity, spontaneous liability ratios, profit margin, and a payout ratio. This screen asks for the three net changes directly so the arithmetic stays transparent.',
      'It ignores lumpy capital projects, seasonal working capital, unused debt capacity, covenants, flotation costs, and the timing of cash versus accruals. Treat the result as a first-pass financing sketch, then reconcile it to a projected balance sheet and cash-flow forecast.',
    ],
  },
];

export const AFN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a positive AFN mean?',
    answer:
      'A positive figure means asset growth exceeds the combined rise in spontaneous liabilities and retained earnings, so the simplified model still needs outside financing.',
  },
  {
    question: 'Can AFN be negative?',
    answer:
      'Yes. A negative AFN is a financing surplus under this identity. The calculator does not clamp negative results to zero.',
  },
  {
    question: 'Do I include long-term debt in the change in liabilities?',
    answer:
      'Usually no. In the simplified plug approach, ΔL is spontaneous operating liabilities. Discretionary new borrowing is what AFN is estimating, not an input that already fills the gap.',
  },
  {
    question: 'Is AFN the same as a cash-flow forecast?',
    answer:
      'No. AFN is a balance-sheet financing identity. A cash-flow forecast tracks receipts and payments over time and can disagree with AFN when timing, noncash items, or off-balance financing matter.',
  },
  {
    question: 'Why must all amounts use the same currency?',
    answer:
      'The formula only subtracts like amounts. Changing the currency label here switches the display symbol and grouping; it does not convert figures between currencies.',
  },
  {
    question: 'What if one of my changes is negative?',
    answer:
      'Enter the signed change. Shrinking assets reduces financing needs; shrinking liabilities or retained earnings increases the gap. The arithmetic stays ΔA − ΔL − ΔRE.',
  },
];
