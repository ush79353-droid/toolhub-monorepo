import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MV_FAQS } from './content';

export function MaturityValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Maturity Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maturity value is the amount an investment is worth when it reaches the
        end of its planned term: the original principal plus accumulated
        interest. It depends on how much you invest, the annual rate, how long
        money stays invested, and how often interest compounds. It is not the
        same as the starting principal alone.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Maturity Value Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MV = P × (1 + r)<sup>t</sup></p>
        <p>P = principal · r = annual rate as a decimal · t = years</p>
        <p>With a percent rate R: MV = P × (1 + R/100)<sup>t</sup></p>
        <p>Example: 2,000 × (1.03)<sup>2</sup> = 2,121.80</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses annual compounding: interest is applied once per
        year at the stated annual rate. Months are converted to years by
        dividing by 12.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Maturity Value
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine the principal (starting amount).</li>
        <li>Identify the annual interest rate as a percent.</li>
        <li>Determine the investment duration (years or months).</li>
        <li>Convert the percent rate to a decimal (divide by 100).</li>
        <li>Apply MV = P × (1 + r)<sup>t</sup>.</li>
        <li>Interpret the result and optionally subtract principal for interest earned.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: principal $2,000, rate 3% per year, time 2 years →
        MV = 2,000 × (1.03)<sup>2</sup> = $2,121.80; interest earned = $121.80.
      </p>

      <h2
        id="compound-vs-simple"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Compound Interest vs Simple Interest
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Simple: MV = P × (1 + r × t)</p>
        <p>Compound (annual): MV = P × (1 + r)<sup>t</sup></p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Simple interest grows linearly with time. Compound interest earns
        interest on prior interest. For the same $2,000 at 3% for 2 years,
        simple interest gives $2,120.00 while annual compounding gives
        $2,121.80. This calculator uses compound interest.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Maturity Value
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Larger principal scales the ending amount.</li>
        <li>Higher rates increase growth per year.</li>
        <li>Longer duration compounds growth over more periods.</li>
        <li>More frequent compounding (not used in the default model) can raise effective growth.</li>
        <li>Real products may deduct fees and taxes or change rates.</li>
        <li>Inflation can reduce purchasing power of a nominal maturity amount.</li>
        <li>Extra deposits or withdrawals change the path to maturity.</li>
      </ul>

      <h2
        id="duration-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Investment Duration Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compound growth accelerates with time. At 5% annually, $10,000 becomes
        about $11,576 after 3 years and about $16,289 after 10 years. Extending
        the horizon has a larger effect than a short linear projection suggests.
      </p>

      <h2
        id="where-used"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Where Maturity Value Calculations Are Used
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Planners use maturity-value math for fixed deposits, savings projections,
        certificates of deposit, and simplified bond-style illustrations when
        cash flows match the model. Actual products may use different day-count
        conventions, payout schedules, or compounding rules.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of a Basic Maturity Value Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A fixed annual compound model does not automatically include variable
        returns, taxes, fees, inflation, default risk, additional contributions,
        withdrawals, or product-specific compounding. Treat results as
        educational estimates, not personalized financial advice.
      </p>

      <h2
        id="mv-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MV_FAQS]} />
      </div>
    </article>
  );
}
