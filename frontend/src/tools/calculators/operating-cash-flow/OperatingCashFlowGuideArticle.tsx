import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OCF_FAQS } from './content';

export function OperatingCashFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-operating-cash-flow"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Operating Cash Flow?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating cash flow (OCF) is the cash generated or used by a company&apos;s
        core operations. The indirect method starts from net income, adds back
        non-cash expenses such as depreciation and amortization, then adjusts for
        working-capital balance changes and other operating cash items.
      </p>

      <h2
        id="ocf-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Cash Flow Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          WC cash adj = −ΔInventories − ΔAR + ΔAP + ΔIncome tax payable
        </p>
        <p className="mt-2">
          OCF = Net income + Depreciation + Amortization + WC cash adj + Net
          other operating cash flows
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Balance changes use ending − beginning · tax payable is a change, not
          a stock balance · results may be negative
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An increase in inventory or receivables uses cash; an increase in
        payables or tax payable provides cash. Do not enter an absolute income
        tax payable balance as if it were a period cash adjustment.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Net income = 100,000 PKR</p>
        <p>Depreciation = 20,000 PKR · Amortization = 5,000 PKR</p>
        <p>ΔInventories = 8,000 · ΔAR = 4,000 · ΔAP = 6,000 · ΔTax payable = 1,000</p>
        <p>Net other cash flows = 2,000 PKR</p>
        <p>
          WC cash adj = −8,000 − 4,000 + 6,000 + 1,000 = −5,000 PKR
        </p>
        <p>
          OCF = 100,000 + 20,000 + 5,000 + (−5,000) + 2,000 = 122,000 PKR
        </p>
      </div>

      <h2
        id="ocf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...OCF_FAQS]} />
      </div>
    </article>
  );
}
