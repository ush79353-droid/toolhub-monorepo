import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARRIED_INTEREST_FAQS } from './content';

export function CarriedInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-carried-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Carried Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Carried interest is the share of a private fund&apos;s profits paid to the general
        partner as a performance fee. It is usually taken only after limited partners earn a
        preferred return (the hurdle), and it applies to eligible profits — not to the entire
        fund value.
      </p>

      <h2
        id="carried-interest-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Carried Interest Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Fund Return (%) = ((Final − Initial) / Initial) × 100</p>
        <p className="mt-2">Profit = Final − Initial</p>
        <p className="mt-2">
          Hurdle Profit = Initial × ((1 + Hurdle Rate / 100)^Years − 1)
        </p>
        <p className="mt-2">
          Without catch-up: GP Carry = max(0, Profit − Hurdle) × Carry Rate
        </p>
        <p className="mt-2">
          With full catch-up: GP first receives post-hurdle profit until carry% of total profit,
          then residual × Carry Rate
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial fund value = PKR 100,000</p>
        <p>Final fund value = PKR 150,000</p>
        <p>Hold period = 10 years · Hurdle = 0% · Carry = 20% · Catch-up = No</p>
        <p>Fund return = 50%</p>
        <p>Total profit = PKR 50,000</p>
        <p>GP carried interest amount = PKR 10,000</p>
      </div>

      <h2
        id="carried-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CARRIED_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
