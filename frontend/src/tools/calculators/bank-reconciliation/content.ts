import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BANK_RECONCILIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bank-reconciliation', label: 'What is a bank reconciliation statement?' },
  { id: 'why-important', label: 'Why monthly bank reconciliation matters' },
  { id: 'cashbook-adjustments', label: 'Adjustments to cashbook' },
  { id: 'bank-statement-adjustments', label: 'Adjustments to bank statements' },
  { id: 'how-to-prepare', label: 'How to prepare a bank reconciliation' },
  { id: 'reconciliation-example', label: 'Cashbook, bank statement & summary example' },
  { id: 'how-calculator-works', label: 'How this calculator works' },
  { id: 'common-errors', label: 'Common bank reconciliation errors' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'bank-reconciliation-faq', label: 'Frequently asked questions' },
];

export const BANK_RECONCILIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'Can a balance brought forward be negative?',
    answer:
      'Yes. A negative cashbook or bank balance can represent an overdraft or an account that sits below zero, depending on how the account is recorded. Enter the signed balance as it appears in your books or statement; adjustments still use nonnegative amounts with an explicit Add or Subtract direction.',
  },
  {
    question: 'How do I prepare a bank reconciliation statement?',
    answer:
      'Compare the cashbook and bank statement for the same period, mark matching deposits and withdrawals, list timing differences (deposits in transit and outstanding checks), record unposted bank items (charges, interest, NSF, auto-payments), correct errors, compute both adjusted balances, and investigate any remaining difference.',
  },
  {
    question: 'How often should I create a bank reconciliation statement for my business?',
    answer:
      'Monthly reconciliation is a common control for most businesses. Higher transaction volume, multiple accounts, or tighter cash monitoring may justify weekly or even daily reviews, while still producing a formal month-end reconciliation for the books.',
  },
  {
    question: 'Why should I prepare my bank reconciliation statement on a monthly basis?',
    answer:
      'A monthly cadence catches recording errors, unauthorized or duplicate payments, missing deposits, and uncleared checks while supporting accurate cash reporting, fraud monitoring, and reliable month-end financial statements.',
  },
  {
    question: 'What is the difference between a cashbook and a bank statement?',
    answer:
      'The cashbook is the business’s own record of bank-related receipts and payments. The bank statement is the bank’s record of the same account. Timing differences and unrecorded items often cause the two closing balances to differ until both sides are adjusted.',
  },
  {
    question: 'What are deposits in transit?',
    answer:
      'Deposits in transit are receipts already entered in the cashbook that have not yet appeared on the bank statement, often because of cutoff timing. They are added to the bank statement balance during reconciliation.',
  },
  {
    question: 'What are outstanding checks?',
    answer:
      'Outstanding checks are checks (or similar payments) recorded in the cashbook that the bank has not yet cleared. They are subtracted from the bank statement balance during reconciliation.',
  },
  {
    question: 'Why do cashbook and bank statement balances differ?',
    answer:
      'Common causes include deposits in transit, outstanding checks, bank charges, interest, NSF checks, automatic payments, missing or duplicate entries, and recording errors on either side. Timing alone can create a temporary difference even when both records are otherwise correct.',
  },
  {
    question: 'What does it mean when a bank reconciliation does not balance?',
    answer:
      'It means the adjusted cashbook balance and adjusted bank statement balance still differ. Investigate omitted items, wrong amounts, double-counted adjustments, and period mismatches until the remaining difference is explained or corrected.',
  },
  {
    question: 'What happens when both adjusted balances match?',
    answer:
      'The reconciliation is balanced for the figures you entered. That is useful evidence for the period, but it still depends on complete and accurate source records, matching totals do not prove every underlying transaction was authorized.',
  },
  {
    question: 'Are bank charges added or subtracted during reconciliation?',
    answer:
      'Unrecorded bank charges are generally subtracted from the cashbook balance so the books catch up with fees the bank has already deducted.',
  },
  {
    question: 'Are deposits in transit added or subtracted?',
    answer:
      'Deposits in transit are generally added to the bank statement balance because the cashbook already includes them while the statement does not yet.',
  },
];
