import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MILEAGE_REIMBURSEMENT_FAQS } from './content';
import { OFFICIAL_MILEAGE_RATES } from './rates';

export function MileageReimbursementGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mileage-reimbursement"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mileage Reimbursement?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IRS standard mileage rates let eligible taxpayers estimate vehicle costs
        for business, medical, or charitable driving without tracking every gas
        and maintenance receipt. This tool multiplies your distances by the
        verified rate for the selected period. The title says reimbursement, but
        the result is labeled mileage deduction because the math follows IRS
 deduction rates; not a specific employer reimbursement policy.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Choose the IRS rate period (2024, 2025, or 2026 H1/H2). Rates update
          automatically.
        </li>
        <li>
          Enter miles or kilometers for business, medical, and charity. Each
          row has its own mi/km selector; switching units keeps the same
          physical distance.
        </li>
        <li>
          Read the combined mileage deduction in USD. Treat it as a nominal
 estimate; eligibility and Schedule limitations still apply.
        </li>
      </ol>

      <h2
        id="mileage-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Mileage Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Miles = Distance_mi  OR  Distance_km / 1.609344</p>
        <p>Business = BusinessMiles × BusinessRate</p>
        <p>Medical = MedicalMiles × MedicalRate</p>
        <p>Charity = CharityMiles × CharityRate</p>
        <p>Total = Business + Medical + Charity</p>
      </div>

      <h2
        id="irs-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Verified IRS Rates
      </h2>
      <div className="my-3 overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/30 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Period</th>
              <th className="px-3 py-2 font-semibold">Business</th>
              <th className="px-3 py-2 font-semibold">Medical</th>
              <th className="px-3 py-2 font-semibold">Charity</th>
              <th className="px-3 py-2 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {OFFICIAL_MILEAGE_RATES.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-2">{row.label}</td>
                <td className="px-3 py-2">${row.business.toFixed(3)}/mi</td>
                <td className="px-3 py-2">${row.medical.toFixed(3)}/mi</td>
                <td className="px-3 py-2">${row.charity.toFixed(2)}/mi</td>
                <td className="px-3 py-2">
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {row.source}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Primary index:{' '}
        <a
          href="https://www.irs.gov/tax-professionals/standard-mileage-rates"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-2 hover:underline"
        >
          IRS Standard Mileage Rates
        </a>
        . Rates are not invented or extrapolated.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Period = 2026 (Jan 1 – Jun 30)</p>
        <p>Business 100 mi × $0.725 = $72.50</p>
        <p>Medical 50 mi × $0.205 = $10.25</p>
        <p>Charity 25 mi × $0.14 = $3.50</p>
        <p>Total = $86.25</p>
      </div>

      <h2
        id="mileage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...MILEAGE_REIMBURSEMENT_FAQS]} />
      </div>
    </article>
  );
}
