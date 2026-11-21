import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HRA_FAQS } from './content';

export function HraGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        HRA Exemption Calculator – House Rent Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This HRA Exemption Calculator estimates how much of your House Rent
        Allowance may be tax-free under Indian income-tax rules for the selected
        tax year. Enter basic salary, eligible dearness allowance, HRA received,
        rent paid, city, and tax regime to see exempt HRA, taxable HRA, and a
        transparent three-limb breakdown. Results are educational estimates, not
        tax advice.
      </p>

      <h2
        id="what-is-hra"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is HRA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        House Rent Allowance is a salary component that helps employees pay for
        rented housing. Employers may structure pay with an HRA head; tax rules
        then decide how much of that allowance can be exempt when you actually
        pay rent for qualifying accommodation.
      </p>

      <h2
        id="what-is-exemption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is HRA Exemption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HRA exemption is the tax-free portion of HRA. Any HRA above the exempt
        amount is taxable. Exemption cannot exceed HRA actually received.
      </p>

      <h2
        id="eligibility"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Who Is Eligible for HRA Exemption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typically salaried employees who receive HRA, pay rent for a residential
        unit they occupy, and claim under the old tax regime (subject to
        documentation and current law). Living in owned accommodation without
        rent generally yields zero exemption.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Exemption Calculation Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>S = Basic + eligible DA</p>
        <p>Exempt = max(0, min(HRA, R − 0.10S, p×S))</p>
        <p>Taxable HRA = HRA − Exempt</p>
        <p>p = 0.50 or 0.40 from tax-year city rules</p>
      </div>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate HRA Exemption
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Compute qualifying salary S.</li>
        <li>Note actual HRA received.</li>
        <li>Compute rent paid minus 10% of S (floor at zero).</li>
        <li>Compute p×S using the city rate for your tax year.</li>
        <li>Take the minimum of the three amounts (old regime).</li>
        <li>Subtract exempt HRA from actual HRA for taxable HRA.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Exemption Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monthly basic ₹50,000, eligible DA ₹5,000, HRA ₹20,000, rent ₹18,000,
        Delhi (50%), old regime: S = ₹55,000; rent−10%S = ₹12,500; 50% of S =
        ₹27,500; exempt = ₹12,500; taxable = ₹7,500; annual exempt ≈ ₹150,000
        for 12 months.
      </p>

      <h2
        id="metro"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Exemption in Metro and Non-Metro Cities
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Older years commonly treat Delhi, Mumbai, Kolkata, and Chennai as 50%
        cities. This calculator’s FY 2026–27+ educational mapping expands the 50%
        list to include Bengaluru, Hyderabad, Pune, and Ahmedabad. Other cities
        use 40%. Always confirm the official city list for your assessment year.
      </p>

      <h2
        id="old-regime"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Under the Old Tax Regime
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The classic three-limb HRA exemption is designed for taxpayers who opt
        for the old regime (and meet other conditions). Use the old-regime option
        in this tool to estimate exempt and taxable HRA.
      </p>

      <h2
        id="new-regime"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Under the New Tax Regime
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Under the new tax regime, HRA exemption is generally not claimable. The
        calculator shows zero exemption and treats HRA as fully non-exempt for
        this computation. It does not compute overall income-tax liability.
      </p>

      <h2
        id="da"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Dearness Allowance Count Toward HRA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DA enters qualifying salary when it forms part of salary for retirement
        benefits. If it does not, leave the checkbox unchecked so S = basic only.
      </p>

      <h2
        id="documents"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Documents Are Required for HRA Exemption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rent receipts or agreements are commonly required. Landlord PAN may be
        needed when rent exceeds applicable thresholds. Keep employer Form 16
        and salary slips aligned with your claim.
      </p>

      <h2
        id="rent-changes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Exemption When Rent Changes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When rent, HRA, or city changes mid-year, calculate each period
        separately and sum. The partial-year months control is a simplified
        scaler when monthly amounts are otherwise stable.
      </p>

      <h2
        id="parents"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA Exemption When Living With Parents
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A genuine rental arrangement with proof of rent paid may support a claim;
        informal living without rent typically does not. Documentation quality
        matters.
      </p>

      <h2
        id="vs-80gg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HRA vs. Section 80GG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HRA exemption needs an HRA salary component. Section 80GG (or successor
        rules) may apply to eligible rent-paying taxpayers without HRA. This
        calculator does not auto-apply 80GG.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common HRA Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>Using gross salary instead of qualifying salary.</li>
        <li>Forgetting that rent − 10% of S can be zero.</li>
        <li>Applying 50% to a non-qualifying city for that tax year.</li>
        <li>Claiming HRA exemption under the new regime.</li>
        <li>Ignoring partial-year rent or city moves.</li>
      </ul>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the HRA Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select tax year, regime, and monthly or annual inputs.</li>
        <li>Enter basic, DA (with eligibility), HRA, and rent.</li>
        <li>Choose your city classification.</li>
        <li>Optionally set eligible months for partial-year claims.</li>
        <li>Read annual/monthly exempt and taxable HRA plus the breakdown.</li>
      </ol>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/epf-calculator" className="text-primary">
            EPF Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gratuity-calculator" className="text-primary">
            Gratuity Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/gross-to-net-calculator" className="text-primary">
            Gross to Net Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/income-tax-calculator" className="text-primary">
            Income Tax Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="hra-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...HRA_FAQS]} />
      </div>
    </article>
  );
}
