import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AMT_FAQS } from './content';

export function AmtGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-amt" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is the Alternative Minimum Tax?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The alternative minimum tax (AMT) is a parallel federal income-tax system. Taxpayers
        compute a tentative minimum tax on alternative minimum taxable income (AMTI) and compare it
        with regular tax. When tentative minimum tax exceeds regular tax, the difference is
        additional AMT. This page estimates the AMT side of that comparison for historical years
        2022 and 2023.
      </p>

      <h2
        id="how-this-calculator-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How This Calculator Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter AGI and non-deductible taxes to suggest AMTI, or type AMTI directly from Form 6251
        line 4 when preference items apply. Choose filing status and optional AMT-permitted tax
        credits. The calculator applies that year’s exemption (with phaseout), computes taxable
        excess, applies the 26%/28% AMT rates, then subtracts permitted credits. Results are a
 tentative AMT estimate; not additional AMT versus regular tax.
      </p>

      <h2 id="amt-formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas (2022 &amp; 2023)
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Adjusted AMTI = AMTI + MFS add-on (when married filing separately thresholds apply)</p>
        <p>
          Exemption allowed = max(0, base exemption − 25% × max(0, Adjusted AMTI − phaseout start))
        </p>
        <p>Taxable excess = max(0, Adjusted AMTI − Exemption allowed)</p>
        <p>
          Tentative minimum tax = 26% of taxable excess, or 28% × taxable excess − year/status
          offset when above the 26% ceiling
        </p>
        <p>Tentative AMT after credits = max(0, Tentative minimum tax − permitted credits)</p>
      </div>

      <h2
        id="irs-parameters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IRS Parameters by Year
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exemption amounts, phaseout starts, MFS add-on rules, and 26%/28% ceilings follow the
        Instructions for Form 6251 for the selected year and the related revenue procedures (Rev.
        Proc. 2021-45 for 2022; Rev. Proc. 2022-38 for 2023). Changing the year switches the entire
 parameter set; current-year inflation figures are never mixed into a historical year.
      </p>

      <h2 id="limitations" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limitations &amp; Disclosures
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Regular tax liability is not collected, so additional AMT owed on Form 6251 cannot be
          computed.
        </li>
        <li>
          Capital-gain preferential AMT worksheets (Form 6251 Part III) and foreign earned income
          worksheets are out of scope.
        </li>
        <li>
 Educational estimate only; not tax advice and not a substitute for Form 6251 or a
          qualified preparer.
        </li>
      </ul>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For a broader federal income-tax estimate (not AMT), see the{' '}
        <Link href="/tools/income-tax-calculator" className="text-primary underline-offset-2 hover:underline">
          Income Tax Calculator
        </Link>
        .
      </p>

      <h2 id="amt-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...AMT_FAQS]} />
      </div>
    </article>
  );
}
