import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPSF_FAQS } from './content';

export function PricePerSqftGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-to-calculate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How Do I Calculate the Price Per Square Foot?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price per square foot divides a property’s total purchase price (or rent)
        by its floor area. It helps compare homes or commercial spaces of
        different sizes on a common unit-area basis. Total price alone can hide
        whether a larger property is actually cheaper per square foot.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Price Per Sqft = Total Property Price / Area in Sqft
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $500,000 ÷ 2,500 ft² = <strong>$200/ft²</strong>.
      </p>

      <h2
        id="what-is-sqft"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Is a Square Foot?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 A square foot is an area equal to a square one foot on each side; not a
        linear foot. Square meters are the metric counterpart. Use one consistent
        measurement definition when comparing listings.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        1 ft² = 0.09290304 m² · 1 m² = 10.7639104167 ft²
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Cost Per Square Foot Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose whether you are calculating purchase price or rent.</li>
        <li>Enter price (or rent) and area, or use a reverse mode.</li>
        <li>Select ft² or m²; conversions preserve total value.</li>
        <li>Review the unit price result.</li>
        <li>Optionally enable a second property and compare unit prices.</li>
      </ol>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Foot Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <div>Price Per Area = Total Price / Area</div>
        <div>Total Price = Price Per Area × Area</div>
        <div>Area = Total Price / Price Per Area</div>
      </div>

      <h2
        id="comparison-examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Examples of Comparing Properties by Price Per Square Foot
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Property A: $290,000 / 1,400 ft² ≈ $207.14/ft²</li>
        <li>Property B: $310,000 / 1,200 ft² ≈ $258.33/ft²</li>
        <li>Property C: $400,000 / 2,400 ft² ≈ $166.67/ft²</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Property C has the highest total price but the lowest unit-area price; 
        illustrating why total price alone can mislead.
      </p>

      <h2
        id="total-vs-unit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Foot vs. Total Property Price
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The cheapest listing by total price is not always the cheapest per square
        foot. Unit pricing scales for size so you can compare differently sized
 assets more fairly; still subject to location and quality differences.
      </p>

      <h2
        id="rental-ppsf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rental Price Per Square Foot
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <div>Monthly Rent Per Area = Monthly Rent / Area</div>
        <div>Annual Rent Per Area = Annual Rent / Area</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not mix monthly unit rates with annual unit rates when comparing
        rentals.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Price Per Square Foot
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Location, condition, age, construction quality, amenities, demand,
        property type, layout, and measurement conventions all influence unit
        pricing.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Price Per Square Foot
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Properties are not perfectly comparable. Area definitions vary. Unit price
        alone cannot determine investment suitability. This calculator does not
        convert currencies or appraise properties.
      </p>

      <h2
        id="sqft-vs-sqm"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Foot vs. Price Per Square Meter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $100/ft² ≈ $1,076.39/m² because each square meter contains about
        10.7639 square feet. Switching units in this tool converts area and
        price-per-area together so the implied total price stays the same.
      </p>

      <h2
        id="ppsf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PPSF_FAQS]} />
      </div>
    </article>
  );
}
