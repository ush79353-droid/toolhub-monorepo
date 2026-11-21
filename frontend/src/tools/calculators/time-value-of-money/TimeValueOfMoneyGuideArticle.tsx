import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TIME_VALUE_OF_MONEY_FAQS } from './content';

export function TimeValueOfMoneyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-tvm-calculator"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Time Value of Money Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator converts between present value and future value using compound interest.
        Enter an interest rate, term (years and months), compounding frequency, and either present
 or future value: the other money field updates automatically from the most recently edited
        amount.
      </p>

      <h2 id="tvm-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>t = Years + Months / 12</p>
        <p>FV = PV × (1 + r / m)^(m × t)</p>
        <p>PV = FV / (1 + r / m)^(m × t)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Interest rate = 10%</p>
        <p>Term = 2 years</p>
        <p>Compound frequency = Yearly (m = 1)</p>
        <p>Present value = PKR 10,000</p>
        <p>FV = 10,000 × (1.10)^2 = PKR 12,100</p>
        <p className="mt-2">Reverse: FV 12,100 → PV = 12,100 / 1.21 = PKR 10,000</p>
      </div>

      <h2 id="tvm-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TIME_VALUE_OF_MONEY_FAQS]} />
      </div>
    </article>
  );
}
