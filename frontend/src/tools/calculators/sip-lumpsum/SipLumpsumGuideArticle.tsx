import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SIP_LUMPSUM_FAQS } from './content';

export function SipLumpsumGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is SIP + Lumpsum?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        SIP Calculator + Lumpsum estimates the future value of a one-time
        investment combined with systematic periodic deposits. It is an
        educational compound-growth model—not personalized investment advice.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas and Timing
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + r/m)<sup>m/k</sup> − 1</p>
        <p>FV<sub>lumpsum</sub> = PV · (1+i)<sup>n</sup></p>
        <p>
          FV<sub>SIP,end</sub> = PMT · ((1+i)<sup>n</sup> − 1) / i
        </p>
        <p>
          FV<sub>SIP,begin</sub> = FV<sub>SIP,end</sub> · (1+i)
        </p>
        <p>
          FV = FV<sub>lumpsum</sub> + FV<sub>SIP</sub>
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: initial lumpsum 1,000, expected return 10% per year, term 10
        years, monthly compounding, zero SIP deposits → final balance ≈ 2,707.04.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose what you want to solve for (default: final balance).</li>
        <li>Enter the initial lumpsum, expected return, term, and start date.</li>
        <li>Set inflation (optional) and compounding frequency.</li>
        <li>Enter SIP deposit amount, frequency, and begin/end timing.</li>
        <li>
          Review opening balance, final balance, deposits, return, transaction
          count, and end date. Expand the schedule when needed.
        </li>
      </ol>

      <h2
        id="solve-modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Solve Modes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Besides projecting final balance, you can solve for the periodic
        deposit, initial lumpsum, required return, or term when a stable numeric
        solution exists. Target final balance becomes an input in those modes.
      </p>

      <h2
        id="inflation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inflation Adjustment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The primary final balance is nominal. When inflation is greater than
        zero, purchasing power is shown as FV / (1+f)<sup>t</sup>.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Returns are assumed constant; taxes, fees, and market volatility are
        ignored. Currency labels amounts only. Always confirm decisions with a
        licensed advisor when needed.
      </p>

      <div id="sip-lumpsum-faq" className="mt-8">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...SIP_LUMPSUM_FAQS]} />
        </div>
      </div>
    </article>
  );
}
