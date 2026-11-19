export function RevenueGuideArticle() {
  return (
    <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
      <section id="what-is-revenue-calculator" className="scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-accent">
          What Is This Calculator?
        </h2>
        <p className="mt-3">
          The Revenue Calculator solves the relationship between unit price, quantity sold, and
          total revenue. Leave exactly one field blank to solve for price, quantity, or total
          revenue.
        </p>
      </section>

      <section id="revenue-formulas" className="scroll-mt-24 pt-7">
        <h2 className="text-xl font-semibold tracking-tight text-accent">Formulas</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Total Revenue = Price × Quantity
          </li>
          <li>
            Price = Total Revenue ÷ Quantity
          </li>
          <li>
            Quantity = Total Revenue ÷ Price
          </li>
        </ul>
        <p className="mt-3">
          Money fields are normalized into the price currency before multiplication or division.
          Quantity is a count and is never FX-converted.
        </p>
      </section>

      <section id="revenue-example" className="scroll-mt-24 pt-7">
        <h2 className="text-xl font-semibold tracking-tight text-accent">Example</h2>
        <p className="mt-3">
          Price 100 PKR × Quantity 25 → Total revenue 2,500 PKR. Solving for quantity with total
          2,500 and price 100 returns 25.
        </p>
      </section>

      <section id="revenue-faq" className="scroll-mt-24 pt-7">
        <h2 className="text-xl font-semibold tracking-tight text-accent">
          Frequently Asked Questions
        </h2>
        <div className="mt-3 space-y-4">
          <div>
            <h3 className="font-medium text-accent">Can quantity be fractional?</h3>
            <p className="mt-1">
              Yes. Fractional quantities are allowed when they make sense for the unit sold.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-accent">What if I fill all three fields?</h3>
            <p className="mt-1">
              Leave exactly one blank to solve. If all three are filled, clear the field you want
              recalculated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
