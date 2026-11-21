import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STAMP_DUTY_LAND_TAX_UK_FAQS } from './content';

export function StampDutyLandTaxUkGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Stamp Duty Land Tax Calculator UK
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate residential Stamp Duty Land Tax for England and Northern Ireland
        using HMRC&apos;s marginal bands. Choose your buyer scenario and residency,
        enter the property price, and see stamp duty with an optional
        band-by-band breakdown. Currency is fixed GBP (£); there is no FX
        conversion.
      </p>

      <h2
        id="how-sdlt-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How SDLT Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        SDLT is charged on successive portions of the purchase price. Each band
        has its own rate. First-time buyers may qualify for relief when the price
        is within the published limit. Additional dwellings and most buy-to-let
        purchases use higher rates. Non-UK residents usually pay a further
        surcharge on top of the rates that otherwise apply.
      </p>

      <h2
        id="rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rates and Reliefs
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Standard (from 1 April 2025):</strong> 0% to £125,000; 2% to
          £250,000; 5% to £925,000; 10% to £1.5m; 12% above.
        </li>
        <li>
          <strong>First-time buyers:</strong> 0% to £300,000 and 5% to £500,000
          when the price is £500,000 or less; otherwise standard bands.
        </li>
        <li>
          <strong>Higher rates:</strong> +5 percentage points on each standard
          band (from 1 April 2025).
        </li>
        <li>
          <strong>Non-UK residents:</strong> +2 percentage points on each
          applicable band rate.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Official references: GOV.UK residential property rates, higher rates for
        additional dwellings, and non-UK resident surcharge guidance.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select whether you are a first-time buyer, moving home, buying an additional property, or buying to let/flip.</li>
        <li>Choose UK resident or Non-UK resident.</li>
        <li>Enter the property price in pounds.</li>
        <li>Read the stamp duty result and expand the band breakdown if needed.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        First-time buyer, UK resident, property £500,000: 0% on £300,000 + 5% on
        £200,000 = <strong>£10,000</strong> SDLT (GOV.UK example).
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool models freehold / lease-premium style residential consideration
        only. It does not cover Scotland or Wales, company or trust special rates,
        shared ownership staircasing, linked purchases, or SDLT on lease rent NPV.
        Not tax advice.
      </p>

      <div id="sdlt-faq" className="mt-8">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...STAMP_DUTY_LAND_TAX_UK_FAQS]} />
        </div>
      </div>
    </article>
  );
}
