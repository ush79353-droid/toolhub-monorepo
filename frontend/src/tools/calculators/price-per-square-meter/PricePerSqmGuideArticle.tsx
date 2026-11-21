import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PPSM_FAQS } from './content';

export function PricePerSqmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-to-calculate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How to Calculate the Price Per Square Meter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Price per square meter divides a property’s purchase price (or rent) by
        its floor area in square meters. Buyers and investors use it to compare
        differently sized homes and commercial spaces on a common unit-area basis.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Price Per m² = Total Property Price / Floor Area in m²
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $300,000 ÷ 150 m² = <strong>$2,000/m²</strong>.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Price Per Square Meter Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the property price or rent and choose purchase vs rent.</li>
        <li>Enter floor space (default unit is square meters).</li>
        <li>Review the price per metric area.</li>
        <li>Optionally enable a second property and compare unit prices.</li>
        <li>Use reverse modes to solve for total price or area.</li>
      </ol>

      <h2
        id="comparison-examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Examples of Comparing Price Per Square Meter
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Property A: $400,000 / 160 m² = $2,500/m²</li>
        <li>Property B: $450,000 / 180 m² = $2,500/m²</li>
        <li>Property C: $500,000 / 250 m² = $2,000/m²</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Property C has the highest total price but the lowest unit-area price.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Meter Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <div>Price per m² = Total Price / Area</div>
        <div>Total Price = Price per m² × Area</div>
        <div>Area = Total Price / Price per m²</div>
      </div>

      <h2
        id="sqm-vs-sqft"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Meter vs. Price Per Square Foot
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        1 m² ≈ 10.7639104167 ft² · 1 ft² = 0.09290304 m²
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $2,000/m² ≈ $185.81/ft². This tool converts area and
        price-per-area together so total value stays constant. A separate Price
        Per Square Foot Calculator is also available with ft² defaults.
      </p>

      <h2
        id="rental"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Rental Price Per Square Meter
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <div>Monthly Rent Per m² = Monthly Rent / Area</div>
        <div>Annual Rent Per m² = Annual Rent / Area</div>
      </div>

      <h2
        id="why-area-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Property Area Matters
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Consistent measurement standards (net usable vs gross floor area) 
        matter. Mixing definitions can make unit prices look more different than
        they really are.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Property Price Per Square Meter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Location, building quality, property type, amenities, demand, age,
        condition, and neighborhood characteristics all influence unit pricing.
      </p>

      <h2
        id="misleading"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Price Per Square Meter Can Be Misleading
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Premium locations, renovation needs, land value, floor plans, and
        amenities can justify higher unit prices. A lower price per m² is not
        automatically a better deal.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Price Per Square Meter Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Comparisons depend on accurate floor area. Purchase prices and rents are
        different measures. This calculator does not perform FX conversion or
        appraisals. Results are estimates for education and comparison only.
      </p>

      <h2
        id="ppsm-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...PPSM_FAQS]} />
      </div>
    </article>
  );
}
