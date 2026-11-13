import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AFFO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-affo', label: 'What is AFFO?' },
  { id: 'what-is-ffo', label: 'What is FFO?' },
  { id: 'calculate-ffo', label: 'How to calculate FFO' },
  { id: 'calculate-affo', label: 'How to calculate AFFO' },
  { id: 'affo-vs-ffo', label: 'AFFO vs FFO' },
  { id: 'affo-vs-net-income', label: 'AFFO vs net income' },
  { id: 'depreciation', label: 'Depreciation and amortization' },
  { id: 'property-sales', label: 'Gains and losses on property sales' },
  { id: 'straight-line-rent', label: 'Straight-line rent' },
  { id: 'recurring-capex', label: 'Recurring capital expenditures' },
  { id: 'worked-example', label: 'A worked example' },
  { id: 'why-investors-use-affo', label: 'Why investors use AFFO' },
  { id: 'payout-ratios', label: 'AFFO payout ratios' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'affo-faq', label: 'Frequently asked questions' },
];

export interface AffoGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const AFFO_GUIDE_SECTIONS: readonly AffoGuideSection[] = [
  {
    id: 'what-is-affo',
    title: 'What is Adjusted Funds From Operations (AFFO)?',
    paragraphs: [
      'Adjusted funds from operations is a non-GAAP figure many REIT analysts build on top of funds from operations. The idea is to move from accounting net income toward a recurring real-estate result, then take out items that still do not look like recurring economic cost or noncash rent.',
      'There is no single statute that defines AFFO. One REIT may subtract maintenance capital spending and straight-line rent. Another may also add back stock compensation or amortization of debt issuance costs. Read the reconciliation in that REIT’s supplement before you compare two AFFO numbers.',
    ],
  },
  {
    id: 'what-is-ffo',
    title: 'What is Funds From Operations (FFO)?',
    paragraphs: [
      'Funds from operations starts from net income and then adjusts for gains and losses on sales of real estate and for depreciation and amortization of real estate assets. Nareit publishes a definition that REITs often follow, and company supplements still add further lines for impairments, noncontrolling interests, and unconsolidated entities.',
      'FFO is not cash flow and it is not dividend capacity. A property can produce FFO while still needing a new roof, a lease commission, or a reserve the dividend will have to cover later.',
    ],
  },
  {
    id: 'calculate-ffo',
    title: 'How to calculate FFO',
    paragraphs: [
      'This calculator uses a simplified bridge. Add eligible real-estate depreciation and amortization to net income, add eligible losses on property sales, and subtract eligible gains on property sales. Interest income is shown on the form and is not added or removed, because a normal net-income total already includes it.',
      'Do not paste every depreciation line from the income statement into the eligible field. Office furniture, software, and other non-real-estate charges are not automatic add-backs. The same care applies to gains and losses: only property dispositions that belong in the FFO bridge go in those boxes.',
    ],
    formula: 'Simplified FFO = net income + eligible real-estate D&A + eligible property-sale losses − eligible property-sale gains',
  },
  {
    id: 'calculate-affo',
    title: 'How to calculate AFFO',
    paragraphs: [
      'The simplified AFFO estimate starts at that FFO and then subtracts the straight-line rent adjustment, recurring maintenance capital expenditures, and any incremental maintenance amount you mark as not already inside FFO. Optional lines can add back noncash compensation and debt-issuance amortization, or apply a signed lease-amortization figure.',
      'The screen does not invent a universal AFFO formula. Each optional line stays at zero until you enter it. If a REIT’s policy skips one of those lines, leave it blank.',
    ],
    formula:
      'Simplified AFFO = FFO − straight-line rent − recurring maintenance capex − incremental maintenance + noncash compensation + debt-issuance amortization + signed lease amortization',
  },
  {
    id: 'affo-vs-ffo',
    title: 'AFFO vs FFO',
    paragraphs: [
      'FFO still includes noncash straight-line rent and does not deduct the recurring capital spending that keeps a building leasable. AFFO attempts to remove those items so the result sits closer to a recurring earnings view. The gap, AFFO minus FFO, is only the net of the adjustments you entered.',
      'A lower AFFO than FFO is common when maintenance capex is large. A higher AFFO can appear when add-backs exceed the deductions. Neither direction is automatically “better.” It depends on which adjustments the inputs actually represent.',
    ],
  },
  {
    id: 'affo-vs-net-income',
    title: 'AFFO vs net income',
    paragraphs: [
      'Net income follows the accounting rules for the period, including depreciation of buildings that may still be economically useful and including gains when a property is sold. Those items can swing the earnings number without saying much about next year’s rent roll.',
      'AFFO tries to look through some of that noise. It can also hide a real cost if you deduct too little capital spending, or invent a cost if you deduct repairs that already reduced net income. Use both figures. Do not replace the audited income statement with the estimate.',
    ],
  },
  {
    id: 'depreciation',
    title: 'Depreciation and amortization adjustments',
    paragraphs: [
      'Real estate depreciation is often the largest FFO add-back because buildings are depreciated even when the land underneath is not, and even when the asset is maintained. Amortization of certain real-estate intangibles, such as in-place leases from an acquisition, is sometimes in the same bridge and sometimes discussed separately.',
      'This field is labeled eligible on purpose. If you are unsure whether a line is real-estate depreciation, leave it out and note the exclusion. Adding every amortization line will overstate FFO.',
    ],
  },
  {
    id: 'property-sales',
    title: 'Gains and losses on property sales',
    paragraphs: [
      'Selling a building can produce a large gain or loss that will not repeat next quarter. The simplified FFO bridge removes eligible gains and adds back eligible losses so the operating result is easier to compare across periods.',
      'A gain on a stock, a debt extinguishment, or a non-property asset is not automatically the same adjustment. Enter only the property-sale amounts you have identified. A gain larger than net income is allowed. FFO can be negative when the gain was the main source of profit.',
    ],
  },
  {
    id: 'straight-line-rent',
    title: 'Straight-line rent adjustments',
    paragraphs: [
      'Many leases step the cash rent up over time. Accounting may still recognize an average rent each period. The difference is straight-line rent: noncash income in the early years, or a noncash reduction later.',
      'The calculator subtracts a positive straight-line amount because that income is already inside FFO and was not collected as extra cash this period. A contractual rent increase that is actually billed and collected is not this field. Do not subtract ordinary rent growth just because the lease escalated.',
    ],
  },
  {
    id: 'recurring-capex',
    title: 'Recurring capital expenditures',
    paragraphs: [
      'Maintenance capital expenditure is recurring spending capitalized on the balance sheet instead of run through repairs expense, such as certain replacements that keep existing properties operating. Growth capital expenditure buys or builds new space. Those projects do not belong in a recurring AFFO deduction.',
      'Routine maintenance that already reduced net income is already in FFO. The separate maintenance box is only for an incremental qualifying adjustment. Leaving it at zero avoids deducting the same repair twice.',
    ],
  },
  {
    id: 'worked-example',
    title: 'A worked example',
    paragraphs: [
      'Take annual figures in one currency. Net income is 1,000,000. Eligible real-estate depreciation is 400,000. Eligible property-sale losses are 20,000. Eligible property-sale gains are 50,000. Interest income of 30,000 is already inside the 1,000,000, so it is not used again.',
      'Simplified FFO is 1,000,000 + 400,000 + 20,000 − 50,000 = 1,370,000. Straight-line rent of 25,000 and recurring maintenance capex of 120,000 are deducted. Noncash compensation of 15,000 and debt-issuance amortization of 5,000 are added. Incremental maintenance and lease amortization stay at zero. Simplified AFFO is 1,370,000 − 25,000 − 120,000 + 15,000 + 5,000 = 1,245,000. AFFO minus FFO is −125,000.',
    ],
  },
  {
    id: 'why-investors-use-affo',
    title: 'Why investors use AFFO',
    paragraphs: [
      'Investors use AFFO when they want a recurring figure that is less distorted by depreciation and one-time property sales, and that acknowledges straight-line rent and recurring capital needs. It is often placed next to the dividend to see whether the payout is covered by that estimate.',
      'The comparison only helps when the adjustments match the REIT’s own policy and the same period. An annual dividend next to a quarterly AFFO will look four times too high or too low. This calculator does not rescale periods for you.',
    ],
  },
  {
    id: 'payout-ratios',
    title: 'AFFO payout ratios',
    paragraphs: [
      'When you enter dividends for the same period and simplified AFFO is not zero, the payout ratio is dividends divided by that AFFO. A ratio under 100% means the dividend is smaller than the estimate. It does not mean the cash account can fund the dividend, because working capital, debt service, and development spending sit outside this bridge.',
      'If AFFO is zero, the ratio is left blank instead of showing an infinite result. If AFFO is negative, the ratio can be negative and should not be read as a normal coverage statistic.',
    ],
  },
  {
    id: 'limitations',
    title: 'Limitations of AFFO',
    paragraphs: [
      'The result is a simplified estimate. It omits impairment losses, gains or losses from unconsolidated entities, tax items, and other lines a full Nareit or company reconciliation may include. It also cannot tell maintenance capex from a development budget if you type the combined number into the recurring box.',
      'Currency on this page labels the amounts you typed. It does not convert them. Negative FFO and AFFO are valid outputs. They are signals to read the statements, not errors to hide.',
    ],
  },
];

export const AFFO_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this Nareit FFO?',
    answer:
      'No. The FFO line is a simplified bridge from net income, eligible real-estate depreciation and amortization, and eligible property-sale gains and losses. A Nareit reconciliation can include more lines, including items related to impairment and unconsolidated entities.',
  },
  {
    question: 'Why is interest income on the form if it does not change FFO?',
    answer:
      'Interest income normally sits inside net income already. Subtracting it again would remove it twice. The field is there so you can record the amount without changing the bridge.',
  },
  {
    question: 'Should I subtract a rent increase?',
    answer:
      'Not if tenants are paying that higher rent in cash. Subtract only the noncash straight-line rent adjustment that accounting already included in FFO.',
  },
  {
    question: 'What if repairs are already in net income?',
    answer:
      'Leave the incremental maintenance adjustment at zero. Those repairs already reduced FFO. Entering them again deducts the same cost twice.',
  },
  {
    question: 'Can FFO or AFFO be negative?',
    answer:
      'Yes. A loss, a large property-sale gain that is removed, or heavy recurring capex can push either figure below zero. The calculator keeps that result.',
  },
  {
    question: 'Does changing the period convert the dollars?',
    answer:
      'No. Annual, quarterly, and monthly are labels. Enter every amount, including dividends and the share count, for that same period.',
  },
];
