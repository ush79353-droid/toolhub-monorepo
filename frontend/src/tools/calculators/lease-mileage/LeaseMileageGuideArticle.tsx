import Link from 'next/link';

export function LeaseMileageGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-is-lease-mileage" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is This Calculator?</h2>
        <p>
          The Lease Mileage Calculator projects whether you will exceed a lease mileage
          allowance by lease end, estimates the excess-distance charge, and shows how much to
          save each remaining month. It uses a transparent constant-driving-rate assumption —
          not a dealer contract, insurance product, or tax estimate.
        </p>
        <p>
          For payment structure (cap cost, residual, money factor), see the{' '}
          <Link
            href="/tools/car-lease-calculator"
            className="font-medium text-primary hover:underline"
          >
            Car Lease Calculator
          </Link>{' '}
          or{' '}
          <Link
            href="/tools/auto-lease-calculator"
            className="font-medium text-primary hover:underline"
          >
            Auto Lease Calculator
          </Link>
          .
        </p>
      </section>

      <section id="lease-mileage-formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Total term T and remaining term R in months; elapsed = T − R.</li>
          <li>Estimated annual driving rate = D × 12 / elapsed.</li>
          <li>Predicted total distance = D × T / elapsed.</li>
          <li>Total allowed distance = A × T / 12.</li>
          <li>Predicted excess = max(0, predicted total − allowed).</li>
          <li>Lease-end charge = excess × fee per distance unit.</li>
          <li>Monthly savings required = charge ÷ R.</li>
        </ul>
        <p>
          Future driving is assumed to continue at the historical average rate implied by current
          miles and elapsed time.
        </p>
      </section>

      <section id="lease-mileage-units" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Distance & Currency</h2>
        <p>
          km and mi convert with 1 mi = 1.609344 km. Fee / km vs / mi is normalized before the
          charge. Result currencies convert with stored Phase 2 FX rates. Years, months, and
          distance units are never FX-converted.
        </p>
      </section>
    </div>
  );
}
