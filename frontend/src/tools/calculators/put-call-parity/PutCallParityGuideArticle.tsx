import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PUT_CALL_PARITY_FAQS } from './content';

export function PutCallParityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Put-Call Parity Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use our Put-Call Parity Calculator to solve any one of four linked
        European option values: call price C, put price P, present value of
        strike PV(K), and spot S. Enter any three; the fourth follows from
        C + PV(K) = P + S. Independent currencies per field use Omega&apos;s
        stored FX rates. This is an educational parity tool, not a trading
        desk or market quote feed.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Put–Call Parity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Put–call parity is a foundational no-arbitrage relation for European
        options that share strike and maturity. A synthetic forward built from
        a long call and short put must match a forward financed through the
        spot and cash equal to the discounted strike. When markets are
        frictionless and early exercise is not allowed, the equality holds.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Put–Call Parity Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>C + PV(K) = P + S</p>
        <p>C = P + S − PV(K)</p>
        <p>P = C + PV(K) − S</p>
        <p>PV(K) = P + S − C</p>
        <p>S = C + PV(K) − P</p>
        <p>PV(K) helper: K × e^(−rT)</p>
      </div>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Pick which field to leave blank.</li>
        <li>Enter the other three monetary values (and currencies).</li>
        <li>
          Optionally expand the PV helper to set PV(K) from K, r, and T.
        </li>
        <li>Read the solved fourth value and the parity check.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: C = 10, PV(K) = 95, S = 100 → P = 5.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leave exactly one of the four primary fields empty. Use Share, Reload,
        or Clear as needed. Load example fills a consistent three-value case
        that solves for the put.
      </p>

      <h2
        id="pv-strike"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Present Value of Strike
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PV(K) is the discounted strike cash needed at expiration. The helper
        uses continuous compounding PV(K) = K e^(−rT). Discrete annual
        compounding K/(1+r)^T is a different convention; do not mix them
        without converting rates.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>European options (no early exercise).</li>
        <li>Same strike and maturity on the call and put.</li>
        <li>Non-dividend form using PV(K) rather than an explicit dividend yield.</li>
        <li>No transaction costs, taxes, or borrow fees in the identity.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Not for American options without adjustment.</li>
        <li>Does not scrape live option chains.</li>
        <li>FX conversion requires available stored rates.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/black-scholes-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Black Scholes Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/call-option-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Call Option Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/forward-rate-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Forward Rate Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="put-call-parity-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PUT_CALL_PARITY_FAQS]} />
      </div>
    </article>
  );
}
