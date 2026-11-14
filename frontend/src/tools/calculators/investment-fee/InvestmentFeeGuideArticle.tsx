import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { INVESTMENT_FEE_FAQS } from './content';

export function InvestmentFeeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-investment-fees"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Investment Fees?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Investment fees include sales loads, annual operating costs, turnover costs, and
        redemption charges. Even small percentages can erase a large share of long-term growth.
      </p>

      <h2
        id="investment-fee-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Fees Are Calculated
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Invested amount = Initial × (1 − sales load)</p>
        <p className="mt-2">Effective return = Annual return − operating fees</p>
        <p className="mt-2">
          Before redemption = Invested × (1 + effective)^n − Invested × turnover
        </p>
        <p className="mt-2">Final = Before redemption × (1 − redemption fee)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial = 10,000 · Sales load 2% · Return 10% · Operating 2%</p>
        <p>Duration 10 years · Turnover 3% · Redemption 2%</p>
        <p>Invested = 9,800 · Effective return = 8%</p>
        <p>Final fund value ≈ 20,446.20 · Without fees ≈ 25,937.42</p>
      </div>

      <h2
        id="investment-fee-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...INVESTMENT_FEE_FAQS]} />
      </div>
    </article>
  );
}
