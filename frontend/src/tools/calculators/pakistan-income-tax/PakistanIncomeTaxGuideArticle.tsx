import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PAKISTAN_INCOME_TAX_FAQS } from './content';

export function PakistanIncomeTaxGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-pakistan-income-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates Pakistan federal income tax on salaried employment income from a
        monthly gross salary entered in Pakistani Rupees (Rs.). It annualizes the salary, applies
        the verified FBR progressive salary table for Tax Year 2027, then shows monthly and yearly
        tax plus take-home monthly income after tax.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your monthly gross taxable salary in Rs. (default 0).</li>
        <li>Read Monthly tax, Monthly income after tax, Yearly income, and Yearly tax.</li>
        <li>
          Treat figures as estimates only — deductions, credits, exemptions, and withholding
          timing are not included.
        </li>
      </ol>

      <h2
        id="fbr-tax-year-slabs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FBR Salaried Tax Slabs (Tax Year 2027)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Source: Finance Act, 2026 — substitution of the Table in clause (2) of Division I of Part
        I of the First Schedule (Gazette of Pakistan, Extra., 26 June 2026); summarized in FBR
        Circular No. 02 of 2026-27 (8 September 2026). Salaried surcharge under section 4AB was
        withdrawn for Tax Year 2027.
      </p>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[28rem] border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="border-b border-border px-3 py-2 font-semibold">
                Annual taxable income (Rs.)
              </th>
              <th className="border-b border-border px-3 py-2 font-semibold">Rate of tax</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="bg-white">
              <td className="border-b border-border px-3 py-2">Does not exceed 600,000</td>
              <td className="border-b border-border px-3 py-2">0%</td>
            </tr>
            <tr className="bg-muted/20">
              <td className="border-b border-border px-3 py-2">600,001 – 1,200,000</td>
              <td className="border-b border-border px-3 py-2">
                1% of the amount exceeding 600,000
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-border px-3 py-2">1,200,001 – 2,200,000</td>
              <td className="border-b border-border px-3 py-2">
                6,000 + 11% of the amount exceeding 1,200,000
              </td>
            </tr>
            <tr className="bg-muted/20">
              <td className="border-b border-border px-3 py-2">2,200,001 – 3,200,000</td>
              <td className="border-b border-border px-3 py-2">
                116,000 + 20% of the amount exceeding 2,200,000
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-border px-3 py-2">3,200,001 – 4,100,000</td>
              <td className="border-b border-border px-3 py-2">
                316,000 + 25% of the amount exceeding 3,200,000
              </td>
            </tr>
            <tr className="bg-muted/20">
              <td className="border-b border-border px-3 py-2">4,100,001 – 5,600,000</td>
              <td className="border-b border-border px-3 py-2">
                541,000 + 29% of the amount exceeding 4,100,000
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-border px-3 py-2">5,600,001 – 7,000,000</td>
              <td className="border-b border-border px-3 py-2">
                976,000 + 32% of the amount exceeding 5,600,000
              </td>
            </tr>
            <tr className="bg-muted/20">
              <td className="px-3 py-2">Exceeds 7,000,000</td>
              <td className="px-3 py-2">
                1,424,000 + 35% of the amount exceeding 7,000,000
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Monthly income = 100,000 Rs.</p>
        <p>Yearly income = 100,000 × 12 = 1,200,000 Rs.</p>
        <p>
          Yearly tax (slab 2 max) = 1% × (1,200,000 − 600,000) = 6,000 Rs.
        </p>
        <p>Monthly tax = 6,000 ÷ 12 = 500 Rs.</p>
        <p>Monthly income after tax = 100,000 − 500 = 99,500 Rs.</p>
      </div>

      <h2
        id="pakistan-income-tax-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...PAKISTAN_INCOME_TAX_FAQS]} />
      </div>
    </article>
  );
}
