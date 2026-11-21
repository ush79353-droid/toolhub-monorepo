import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BANK_RECONCILIATION_FAQS } from './content';

export function BankReconciliationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-bank-reconciliation"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is a bank reconciliation statement?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A bank reconciliation statement compares an organization’s cashbook balance with the closing
        balance on its bank statement for the same period. The cashbook records receipts and payments
        from the business’s perspective; the bank statement records the same account from the bank’s
        perspective. Timing differences—such as deposits in transit and outstanding checks—plus
        unrecorded bank charges, interest earned, NSF checks, automatic payments, and accounting or
        bank errors often leave the two raw balances unequal until each side is adjusted.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The goal is not to force the original balances to match. It is to compute an adjusted cashbook
        balance and an adjusted bank statement balance that should agree after valid reconciling
        items are applied. Any remaining difference is a signal to investigate further.
      </p>

      <h2 id="why-important" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why is bank reconciliation important for companies to prepare monthly?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Regular reconciliation helps detect recording errors, unauthorized or duplicate payments,
        missing deposits, and long-outstanding checks. It supports accurate cash reporting, improves
        cash-flow visibility, strengthens fraud monitoring, and underpins reliable financial
        statements. Small businesses benefit from catching mistakes early; larger organizations use
        the same discipline across multiple accounts and legal entities. Monthly preparation is a
        common baseline; high-volume accounts may need more frequent reviews.
      </p>

      <h2
        id="cashbook-adjustments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Adjustments to cashbook
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cashbook adjustments capture bank activity that has already affected the statement but has
        not yet been entered in the books—bank charges, NSF/returned checks, automatic payments,
        interest earned, direct deposits or credits, and accounting corrections. Fixed items in this
        calculator follow standard signs: interest is added; charges, NSF checks, and automatic
        payments are subtracted. Extra rows use an explicit Add or Subtract direction so amounts stay
        nonnegative and are never double-negated.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Adjusted cashbook = Cashbook balance + Interest + Credits − Bank charges − NSF − Auto
          payments − Other debits
        </p>
      </div>

      <h2
        id="bank-statement-adjustments"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Adjustments to bank statements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bank statement adjustments cover cashbook items that have not yet cleared the bank—especially
        deposits in transit (add) and outstanding checks (subtract)—plus bank errors and other
        statement-side corrections. Timing differences are normal near period end; they do not
        automatically mean the cashbook is wrong.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Adjusted bank = Statement balance + Deposits in transit − Outstanding checks ± Bank
          errors/other
        </p>
      </div>

      <h2
        id="how-to-prepare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to prepare your bank reconciliation statement
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Collect the bank statement and cashbook for the same reconciliation period.</li>
        <li>Compare deposits and credits line by line.</li>
        <li>Match checks and withdrawals against cleared items.</li>
        <li>Identify deposits in transit.</li>
        <li>Identify outstanding checks.</li>
        <li>Record unposted bank charges and interest.</li>
        <li>Note NSF checks, automatic payments, and other bank-initiated items.</li>
        <li>Identify and correct accounting or bank errors.</li>
        <li>Update the cashbook for items that belong in the books.</li>
        <li>Adjust the bank statement balance for timing items.</li>
        <li>Compare both adjusted balances.</li>
        <li>Investigate any remaining difference and prepare the final statement.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The objective is equal adjusted balances after valid adjustments—not equal original balances.
      </p>

      <h2
        id="reconciliation-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Examples of cashbook, bank statement, and bank reconciliation statement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company: ABC Company · Period: December 2026. The same figures power the calculator’s Load
        example action.
      </p>

      <h3 className="mt-5 text-base font-semibold text-accent">A — Cashbook reconciliation</h3>
      <div className="my-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Particulars</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Cashbook balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$10,000</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Add: Interest earned</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$100</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Add: Additional bank credit</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$300</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: Bank charges</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($50)</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: NSF checks</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($200)</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: Automatic payments</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($150)</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: Accounting correction</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($100)</td>
            </tr>
            <tr className="border-t border-border bg-muted/30 font-medium">
              <td className="px-3 py-1.5">Adjusted cashbook balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$9,900</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 text-base font-semibold text-accent">B — Bank statement reconciliation</h3>
      <div className="my-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Particulars</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Bank statement balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$8,500</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Add: Deposits in transit</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$2,000</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Add: Bank credit correction</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$100</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: Outstanding checks</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($600)</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Less: Bank debit correction</td>
              <td className="px-3 py-1.5 text-right tabular-nums">($100)</td>
            </tr>
            <tr className="border-t border-border bg-muted/30 font-medium">
              <td className="px-3 py-1.5">Adjusted bank statement balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$9,900</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 text-base font-semibold text-accent">C — Final reconciliation summary</h3>
      <div className="my-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Particulars</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Adjusted cashbook balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$9,900</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Adjusted bank statement balance</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$9,900</td>
            </tr>
            <tr className="border-t border-border bg-muted/30 font-medium">
              <td className="px-3 py-1.5">Difference</td>
              <td className="px-3 py-1.5 text-right tabular-nums">$0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Status: <span className="font-medium text-emerald-800">Reconciled</span> — both adjusted
        balances match.
      </p>

      <h2
        id="how-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How our bank reconciliation calculator works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the cashbook and bank statement starting balances, fill the common fixed adjustments,
        and add any extra rows with description, amount, and Add/Subtract. Calculate computes both
        adjusted balances independently, then reports the absolute difference and a status of
        Reconciled or Unreconciled. The tool never forces the sides to match and never treats equal
        original balances as a successful reconciliation without adjustments being considered. Share
        copies a summary; Reload and Clear reset the form without refreshing the page. Display
        currency changes formatting only.
      </p>

      <h2
        id="common-errors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common bank reconciliation errors
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Missing deposits or deposits recorded twice</li>
        <li>Incorrect check amounts or transposed digits</li>
        <li>Unrecorded bank charges or interest</li>
        <li>Outstanding checks left off the bank-side schedule</li>
        <li>Cashbook entries posted to the wrong period</li>
        <li>Bank errors treated as book errors (or the reverse)</li>
        <li>Timing differences mistaken for fraud or misstatement</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When a difference remains, re-tick matching lines, confirm periods align, and verify each
        adjustment’s direction before changing source documents.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/free-cash-flow-calculator" className="text-primary hover:underline">
            Free Cash Flow Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/operating-cash-flow-calculator"
            className="text-primary hover:underline"
          >
            Operating Cash Flow Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/interest-calculator" className="text-primary hover:underline">
            Interest Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/loan-calculator" className="text-primary hover:underline">
            Loan Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="bank-reconciliation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BANK_RECONCILIATION_FAQS]} />
      </div>
    </article>
  );
}
