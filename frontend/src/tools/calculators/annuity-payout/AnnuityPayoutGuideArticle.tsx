import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANNUITY_PAYOUT_FAQS } from './content';

export function AnnuityPayoutGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-annuity-payout"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Annuity Payout?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An annuity payout is a series of equal (or growing) withdrawals from a starting
        balance that earns interest. This calculator solves either the sustainable
        periodic withdrawal for a known length, or how long a chosen withdrawal lasts,
        for ordinary (end-of-period) or due (beginning-of-period) timing.
      </p>

      <h2
        id="annuity-payout-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annuity Payout Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>For an ordinary level annuity with zero ending balance:</p>
        <p className="mt-2">Payment = PV × r / (1 − (1+r)^(−n))</p>
        <p className="mt-2">When r = 0: Payment = PV / n</p>
        <p className="mt-2">
          Default period rate uses the effective annual convention r = (1 + i)^(1/k) − 1.
          Annuity due divides the ordinary payment by (1+r). Total interest comes from the
          cash-flow schedule.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial balance = 100,000 PKR · Rate = 6% · Term = 10 years · Monthly · Ordinary</p>
        <p>n = 120 · r = (1.06)^(1/12) − 1</p>
        <p>Payment ≈ 1,102.24 PKR · Total interest ≈ 32,268.83 PKR</p>
      </div>

      <h2
        id="annuity-payout-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ANNUITY_PAYOUT_FAQS]} />
      </div>
    </article>
  );
}
