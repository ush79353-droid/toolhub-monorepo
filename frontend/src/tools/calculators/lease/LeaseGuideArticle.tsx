import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LEASE_FAQS } from './content';

export function LeaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-lease"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Lease Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This lease calculator estimates monthly payments, total interest, and total cost of
        ownership for a fixed-rate lease with an end-of-term residual/buyout. Optionally include a
        down payment to lower installments and total cash outlay during the term.
      </p>

      <h2
        id="lease-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Lease Payment Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = APR / 1200</p>
        <p>n = years × 12 (or months as entered)</p>
        <p>PMT = [(P − D) − R/(1+i)^n] × i / [1 − (1+i)^(−n)]</p>
        <p>When i = 0: PMT = (P − D − R) / n</p>
        <p>Total payments = D + PMT × n</p>
        <p>Total interest = total payments + R − P</p>
        <p>Total cost to own = total payments + R</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Product value P = 100,000 PKR</p>
        <p>Residual R = 40,000 PKR (40%)</p>
        <p>Term = 3 years (36 months), APR = 6%, no down payment</p>
        <p>Monthly payment ≈ 1,936.68 PKR</p>
        <p>Total payments ≈ 69,720.55 PKR · Total interest ≈ 9,720.55 PKR</p>
        <p>Total cost to own ≈ 109,720.55 PKR (payments + residual buyout)</p>
      </div>

      <h2
        id="lease-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...LEASE_FAQS]} />
      </div>
    </article>
  );
}
