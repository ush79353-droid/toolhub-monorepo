import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WHAT_TO_OFFER_FAQS } from './content';

export function WhatToOfferGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-fmv"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Does the Term Fair Market Value Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fair market value (FMV) is the estimated price a property would likely
        bring in an ordinary transaction between informed, willing buyers and
        sellers under normal market conditions. It is usually informed by
 comparable sales, property condition, and local demand, and it may
        differ from the asking price or the eventual contract price.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This What To Offer On A House Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the property’s estimated fair market value.</li>
        <li>Enter expected renovation costs (or leave blank for zero).</li>
        <li>
          Enter a desired discount as an amount or as a percentage of FMV.
        </li>
        <li>
          Enter a desired profit allowance if you are using an investment-style
          model (use zero for many personal purchases).
        </li>
        <li>Review the offer amount and the breakdown.</li>
        <li>Adjust inputs to compare negotiation scenarios.</li>
        <li>Reload or clear to start another estimate.</li>
      </ol>

      <h2
        id="how-to-decide"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Determine What to Offer on a House?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider asking price, FMV, comps, condition, renovations, buyer
        competition, seller motivation, financing limits, and your budget. This
        calculator supplies a numerical framework, not a complete bidding
        strategy.
      </p>

      <h2
        id="buyers-market"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When Will the Real Estate Market Become a Buyer’s Market?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 A buyer’s market generally means more supply relative to demand; 
        higher inventory, longer days on market, and more negotiating room. A
        seller’s market flips those conditions. Markets can also be roughly
        balanced. No calculator can reliably predict when a specific local
        market will shift.
      </p>

      <h2
        id="market-and-fmv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does the Existing Market Condition Influence the Fair Market Value of a
        House?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Yes. Comparable sales, demand, supply, interest rates, condition, and
        local economic conditions all feed into FMV estimates and into how much
        negotiating flexibility buyers or sellers may have.
      </p>

      <h2
        id="renovation-costs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Renovation Costs Affect Your Offer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Buyers often reduce offers to account for roof, electrical, plumbing,
        kitchen, bathroom, or structural work. Use contractor quotes and
        contingency room where possible. An as-is valuation plus renovation
        deduction is not the same as starting from after-repair value.
      </p>

      <h2
        id="discount-vs-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Desired Discount vs. Desired Profit
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Desired discount</strong>: an additional negotiated
          reduction relative to the stated valuation.
        </li>
        <li>
 <strong>Desired profit</strong>: an investor’s separate profit
          allowance in this simplified model. Personal buyers may leave it at
          zero.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep renovation, discount, and profit conceptually separate so you do
        not double-count the same dollars.
      </p>

      <h2
        id="offer-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate an Offer Price
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Offer Amount = Fair Market Value − Renovation Cost − Desired Discount −
        Desired Profit
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: FMV $300,000 − renovation $20,000 − discount $10,000 − profit
        $30,000 = offer <strong>$240,000</strong>.
      </p>

      <h2
        id="what-is-arv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an After-Repair Value (ARV)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ARV estimates what a property may be worth after renovations. It differs
        from current as-is FMV. For ARV-based maximum-bid planning, use Omega
        Calculators’ ARV Calculator rather than treating this FMV field as
        post-renovation value.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Important Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This simplified offer model does not automatically include financing
        costs, closing costs, taxes, inspection surprises, appraisal gaps, legal
        fees, holding costs, selling costs, or market swings. Results are
        educational estimates, not advice. Verify local conditions and
        professional guidance before making an offer.
      </p>

      <div id="what-to-offer-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...WHAT_TO_OFFER_FAQS]} />
        </div>
      </div>
    </article>
  );
}
