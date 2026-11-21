import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SIP_FAQS } from './content';

export function SipGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-sip" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is a SIP?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A Systematic Investment Plan (SIP) invests a fixed amount every month. This calculator
        estimates the future value of those contributions at a constant expected annual return,
        plus total principal invested and the growth multiple.
      </p>
      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter monthly SIP amount and currency.</li>
        <li>Enter investment period in years and expected annual return %.</li>
        <li>Read total investment, maturity amount, and multiplication factor.</li>
      </ol>
      <h2 id="sip-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = r / 12 / 100 · n = t × 12</p>
        <p>FV = P × [((1+i)^n − 1) / i] × (1+i) (i ≠ 0)</p>
        <p>FV = P × n when r = 0</p>
        <p>Total investment = P × n · Factor = FV / Total investment</p>
      </div>
      <h2 id="step-by-step-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>P = 10,000 · t = 10 years · r = 12%</p>
        <p>n = 120 · Total investment = 1,200,000</p>
        <p>Maturity uses the ordinary SIP FV formula above.</p>
      </div>
      <h2 id="sip-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        FAQ
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...SIP_FAQS]} />
      </div>
    </article>
  );
}
