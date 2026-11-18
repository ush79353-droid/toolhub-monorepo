import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAR_INTEREST_FAQS } from './content';

export function CarInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-car-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Car Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Car interest is the finance charge on an auto loan after your down payment and
        trade-in. This calculator first finds the financed principal, then estimates the
        fixed monthly payment and total interest over the loan term.
      </p>

      <h2
        id="car-interest-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Car Interest Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan Amount P = Car Price − Down Payment − Trade-in Value</p>
        <p>n = Years × 12 + Months</p>
        <p>r = Annual Interest Rate / 1200</p>
        <p>Monthly Payment = P × r / (1 − (1 + r)^(−n))</p>
        <p>If r = 0, Monthly Payment = P / n</p>
        <p>Total Interest = Monthly Payment × n − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Car price = PKR 2,000,000</p>
        <p>Down payment = PKR 400,000</p>
        <p>Trade-in value = PKR 100,000</p>
        <p>Loan amount P = 2,000,000 − 400,000 − 100,000 = PKR 1,500,000</p>
        <p>Interest rate = 12% → r = 0.01</p>
        <p>Loan term = 5 years → n = 60</p>
        <p>Monthly payment ≈ PKR 33,366.67</p>
        <p>Total interest ≈ PKR 502,000.29</p>
      </div>

      <h2
        id="car-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAR_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
