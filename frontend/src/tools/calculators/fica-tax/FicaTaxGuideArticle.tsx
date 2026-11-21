import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FICA_FAQS } from './content';
import {
  ADDITIONAL_MEDICARE_RATE,
  FICA_YEAR_PARAMS,
  MEDICARE_RATE_EACH,
  MEDICARE_RATE_SE,
  SE_NET_EARNINGS_FACTOR,
  SS_RATE_EACH,
  SS_RATE_SE,
} from './fica-parameters';

export function FicaTaxGuideArticle() {
  const y2025 = FICA_YEAR_PARAMS[2025];
  const y2026 = FICA_YEAR_PARAMS[2026];

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-fica" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is FICA Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FICA (Federal Insurance Contributions Act) funds Social Security (OASDI) and Medicare
        (Hospital Insurance). Employees and employers each pay Social Security at{' '}
        {(SS_RATE_EACH * 100).toFixed(1)}% up to the annual wage base and Medicare at{' '}
        {(MEDICARE_RATE_EACH * 100).toFixed(2)}% on all covered wages. Self-employed people generally
        pay both shares through self-employment tax on Schedule SE. High earners may also owe 0.9%
        Additional Medicare Tax above Form 8959 thresholds.
      </p>

      <h2
        id="how-this-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose Employee/Employer or Self-employed, select tax year 2025 or 2026, pick a filing
        status (used for Additional Medicare Tax), and enter income in USD. Employee mode treats
        income as FICA wages and shows employee and employer shares separately. Self-employed mode
        treats income as net SE profit, applies the {(SE_NET_EARNINGS_FACTOR * 100).toFixed(2)}%
        net-earnings factor, then computes Schedule SE Social Security and Medicare plus any
        Additional Medicare Tax and the deductible half of regular SE tax.
      </p>

      <h2 id="fica-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas &amp; Rates
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Employee SS = min(Wages, Wage base) × {(SS_RATE_EACH * 100).toFixed(1)}% (employer match
          identical)
        </p>
        <p>
          Employee Medicare = Wages × {(MEDICARE_RATE_EACH * 100).toFixed(2)}% (employer match
          identical)
        </p>
        <p>
          Additional Medicare = max(0, Medicare wages − filing-status threshold) ×{' '}
          {(ADDITIONAL_MEDICARE_RATE * 100).toFixed(1)}% (no employer match)
        </p>
        <p>
          SE earnings = Net profit × {(SE_NET_EARNINGS_FACTOR * 100).toFixed(2)}%
        </p>
        <p>
          SE Social Security = min(SE earnings, Wage base) × {(SS_RATE_SE * 100).toFixed(1)}%
        </p>
        <p>
          SE Medicare = SE earnings × {(MEDICARE_RATE_SE * 100).toFixed(1)}%
        </p>
        <p>Deductible half of SE tax = (SE Social Security + SE Medicare) ÷ 2</p>
      </div>

      <h2
        id="official-parameters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Official Parameters by Year
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Social Security wage base: {y2025.taxYear} — $
        {y2025.socialSecurityWageBase.toLocaleString('en-US')}; {y2026.taxYear} — $
        {y2026.socialSecurityWageBase.toLocaleString('en-US')} (SSA COLA / IRS Topic 751). Additional
        Medicare thresholds remain $250,000 (MFJ), $125,000 (MFS), and $200,000 (all other statuses)
        per IRS Topic 560. Rates shown do not invent federal income tax brackets.
      </p>

      <h2 id="limitations" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations &amp; Disclosures
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool is an educational estimate. It does not handle multi-employer wage bases, tip
        aggregation, railroad retirement, or Form 8959 when both wages and SE income occur in the
        same year. Employer Additional Medicare withholding starts at $200,000 of wages regardless
        of filing status and can differ from final Additional Medicare Tax liability.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/income-tax-calculator" className="text-primary hover:underline">
            Income Tax Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/salary-calculator" className="text-primary hover:underline">
            Salary Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/adjusted-gross-income-agi-calculator"
            className="text-primary hover:underline"
          >
            Adjusted Gross Income (AGI) Calculator
          </Link>
        </li>
      </ul>

      <h2 id="fica-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FICA_FAQS]} />
      </div>
    </article>
  );
}
