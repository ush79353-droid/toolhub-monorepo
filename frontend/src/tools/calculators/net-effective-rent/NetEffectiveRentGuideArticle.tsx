export function NetEffectiveRentGuideArticle() {
  return (
    <div className="space-y-8 text-[15px] leading-7 text-foreground">
      <section id="what-is-net-effective-rent" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is Net Effective Rent?</h2>
        <p>
          Net effective rent is the average rent after tenant concessions and landlord
          operating costs are spread across the lease term. This calculator estimates
          monthly and annual net effective rent from lease length, rent, rent-free months,
          cash allowance, and operating costs — with real FX conversion on money fields.
        </p>
      </section>

      <section id="net-effective-rent-formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-accent">Lease months</span> = years × 12 +
            months
          </li>
          <li>
            <span className="font-medium text-accent">Gross lease value</span> = monthly rent
            × lease months
          </li>
          <li>
            <span className="font-medium text-accent">Rent-free value</span> = monthly rent ×
            rent-free months
          </li>
          <li>
            <span className="font-medium text-accent">Monthly operating cost</span> = fixed
            monthly op-ex + monthly rent × (op-ex % / 100)
          </li>
          <li>
            <span className="font-medium text-accent">Net lease value</span> = gross −
            rent-free − allowance − (monthly op-ex × lease months)
          </li>
          <li>
            <span className="font-medium text-accent">Net effective rent (monthly)</span> =
            net lease value ÷ lease months
          </li>
          <li>
            <span className="font-medium text-accent">Net effective rent (annual)</span> =
            monthly × 12
          </li>
        </ul>
      </section>

      <section id="step-by-step-example" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Step-by-Step Example</h2>
        <p>
          1 year lease, rent 10,000 / mo, 1 rent-free month, allowance 5,000, operating costs
          500 / mo, 0%:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Gross lease = 10,000 × 12 = 120,000</li>
          <li>Rent-free = 10,000 × 1 = 10,000</li>
          <li>Op-ex lease = 500 × 12 = 6,000</li>
          <li>Net lease = 120,000 − 10,000 − 5,000 − 6,000 = 99,000</li>
          <li>Monthly NER = 99,000 / 12 = 8,250; annual = 99,000</li>
        </ol>
      </section>

      <section id="net-effective-rent-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Frequently Asked Questions</h2>
        <p>
          See the FAQ accordion below for FX behavior, operating-cost %, and the disabled
          area-based toggle.
        </p>
      </section>
    </div>
  );
}
