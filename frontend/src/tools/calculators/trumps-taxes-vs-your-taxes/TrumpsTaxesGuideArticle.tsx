import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TRUMP_TAXES_FAQS } from './content';

export function TrumpsTaxesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="trumps-low-tax-bill-explained"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Trump&apos;s low tax bill explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator is a historical comparison tool. It places an example federal income tax
        amount next to a Trump comparison figure that defaults to the widely reported{' '}
        <strong>$750</strong> federal income tax payment for <strong>2016 and 2017</strong>. The
        screenshot-style label “Your tax in 2019” is an example entry for the user side of the
 comparison; it does not claim that $750 was Trump’s established 2019 federal income tax
        payment, and it does not compute anyone’s current liability.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reported tax payments can differ from total taxes paid (including payroll, state, property,
        or other federal taxes), from taxable income, and from wealth. Treat every figure here as
        an educational scenario input, not a verdict on compliance or fairness beyond the arithmetic
        you enter.
      </p>

      <h2
        id="how-to-use-trumps-tax-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use Trump&apos;s tax calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter your example tax amount (default $3,202.00) or replace it with another figure.</li>
        <li>
          Confirm or edit Trump’s comparison tax (default $750.00 for the reported 2016/2017
          illustration).
        </li>
        <li>
          Read the live “You paid…” result: multiplicative ratio, dollar difference, and percentage
          difference.
        </li>
        <li>
          Expand the luxury and essentials panels to see illustrative quantities funded by any
          positive tax difference.
        </li>
        <li>
 Optionally open comparison unit prices and change assumptions; quantities update
          immediately.
        </li>
        <li>Use Share/Copy for a text summary, or Clear/Reload defaults to restore the example.</li>
      </ol>

      <h2
        id="how-the-tax-comparison-is-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the tax comparison is calculated
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>taxRatio = userTax / trumpTax</p>
        <p>taxDifference = userTax − trumpTax</p>
        <p>percentageDifference = ((userTax − trumpTax) / trumpTax) × 100</p>
        <p>itemQuantity = floor( max(taxDifference, 0) / itemUnitPrice )</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example defaults: $3,202 ÷ $750 ≈ 4.2693×, difference $2,452, percentage difference ≈
        326.93%. Luxury and essentials quantities use floor division so indivisible items are never
        overstated. If your tax is equal to or below the Trump figure, the difference available for
        spending illustrations is zero.
      </p>

      <h2
        id="understanding-the-limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding the limitations
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Federal income tax is only one slice of taxation; payroll, state, local, and other taxes
          are out of scope.
        </li>
        <li>Income, deductions, credits, filing status, and wealth are not modeled.</li>
        <li>
          Product and benefit unit prices are editable illustrations. Defaults reproduce a
          reference screenshot’s quantities at the default tax pair and are not verified retail or
          benefit amounts.
        </li>
        <li>
 Where a real market price is unavailable, this tool does not invent a “verified” price; 
          it keeps an explicit assumption you can change.
        </li>
      </ul>

      <h2
        id="trumps-taxes-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...TRUMP_TAXES_FAQS]} />
      </div>
    </article>
  );
}
