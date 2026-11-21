import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ER_FAQS } from './content';

export function EarlyRetirementGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Early Retirement Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An early retirement calculator estimates how long it may take to reach
        financial independence given your savings capacity, current nest egg,
        expected investment return, and a planning withdrawal rate. It is a
        simplified accumulation model for education and planning—not personalized
        financial advice.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas and Assumptions
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MonthlyDeposit = max(NetIncome − Expenses, 0) / 12</p>
        <p>RequiredBalance = Expenses / (WithdrawalRate / 100)</p>
        <p>rm = (1 + r)<sup>1/12</sup> − 1</p>
        <p>
          Target = P<sub>0</sub>(1+rm)<sup>n</sup> + PMT × ((1+rm)<sup>n</sup> −
          1) / rm
        </p>
        <p>Deposits: end of each month (ordinary annuity)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: net income 60,000, expenses 30,000, initial balance 0, return 5%
        per year, withdrawal rate 4% → monthly deposit 2,500, required balance
        750,000, about 197 whole months (≈ 16 years 5 months) with end-of-month
        deposits.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter annual net income and annual expenses.</li>
        <li>Enter your current investable balance (use 0 if starting from scratch).</li>
        <li>Set an expected annual return and a withdrawal rate (often near 4%).</li>
        <li>
          Review monthly deposit, required balance, total contributions, interest,
          and duration.
        </li>
        <li>Use Reload to restore defaults or Clear to blank the form.</li>
      </ol>

      <h2
        id="withdrawal-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Withdrawal Rate and Required Balance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The withdrawal rate links annual spending to a capital target. A 4% rate
        implies about 25× annual expenses. Choosing a higher rate lowers the
        required balance but increases the chance of running down capital in
        retirement; a lower rate raises the target. This tool does not simulate
        sequence-of-returns risk, taxes, or Social Security.
      </p>

      <h2
        id="compounding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Monthly Compounding and Deposit Timing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Returns are converted to a monthly effective rate so the model compounds
        twelve times per year consistently with the stated annual return.
        Deposits occur at month-end. Whole months are used for contribution totals
        so the final scheduled deposit meets or exceeds the required balance.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Fixed return and withdrawal rate; no inflation glide path in this view.</li>
        <li>No taxes, fees, employer matches, or irregular cash flows.</li>
        <li>Currency selection formats amounts only; it does not convert FX.</li>
        <li>Distinct from age-based FIRE scenario tools on Omega Calculators.</li>
      </ul>

      <div id="er-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...ER_FAQS]} />
        </div>
      </div>
    </article>
  );
}
