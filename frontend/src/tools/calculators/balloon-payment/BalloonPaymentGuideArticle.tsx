import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BALLOON_PAYMENT_FAQS } from './content';

export function BalloonPaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-a-balloon-payment"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Balloon Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A balloon loan schedules smaller regular payments based on a longer amortization
        schedule, then requires a large final payment of the remaining principal after a
        shorter term. This calculator estimates that fixed monthly payment, the balloon
        balance after your chosen period, total repayment, and total interest.
      </p>

      <h2
        id="balloon-payment-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Balloon Payment Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = loan amount · N = amortization months · K = balloon months</p>
        <p className="mt-2">
          r = (1 + i/m)^(m/12) − 1 (effective monthly rate from compounding)
        </p>
        <p className="mt-2">M = P × r / (1 − (1+r)^(−N)) · if r = 0: M = P / N</p>
        <p className="mt-2">
          Balloon = P(1+r)^K − M × ((1+r)^K − 1) / r · if r = 0: Balloon = P − M×K
        </p>
        <p className="mt-2">
          Total repayment = M×K + Balloon · Total interest = Total repayment − P
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan = 200,000 PKR · Amortization = 20 years · Balloon after = 5 years</p>
        <p>Interest = 7% · Compounding = Monthly → r = 0.07 / 12</p>
        <p>Monthly payment ≈ PKR 1,550.60 for the first 60 months</p>
        <p>Balloon ≈ PKR 172,513.25 · Total repayment ≈ PKR 265,549.12</p>
        <p>Total of monthly payments ≈ PKR 93,035.87 · Interest ≈ PKR 65,549.12</p>
      </div>

      <h2
        id="balloon-payment-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...BALLOON_PAYMENT_FAQS]} />
      </div>
    </article>
  );
}
