import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PRIVATE_SAVINGS_FAQS } from './content';

export function PrivateSavingsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-private-savings"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Private Savings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Private savings is the portion of income left after taxes and consumption.
        In simple macroeconomic accounting it equals total income minus taxes paid
        to government minus consumption expenditure. A positive value means the
        private sector is saving; a negative value is dissaving.
      </p>

      <h2
        id="private-savings-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Private Savings Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Sp = Y − T − C</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Y = total income · T = taxes paid to government · C = consumption · Sp =
          private savings
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Zero and negative results are valid. This tool uses only the basic identity
        above; it does not invent unsupported additional parameters or charts.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total income Y = 100,000 PKR</p>
        <p>Taxes T = 15,000 PKR</p>
        <p>Consumption C = 70,000 PKR</p>
        <p>Private savings Sp = 100,000 − 15,000 − 70,000 = 15,000 PKR</p>
        <p className="mt-2">
          If consumption were 95,000 PKR instead, Sp = −10,000 PKR (dissaving).
        </p>
      </div>

      <h2
        id="private-savings-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PRIVATE_SAVINGS_FAQS]} />
      </div>
    </article>
  );
}
