import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARV_FAQS } from './content';

export function ArvGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-arv"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is After Repair Value (ARV)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After repair value (ARV) is a planning estimate of a property&apos;s market
        worth once renovations are complete. Real estate investors use ARV to
        size offers, stress-test renovation budgets, and compare deals. It is
        distinct from today&apos;s as-is value: current value reflects the property
        now, while ARV projects the value after the planned work.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accurate ARV depends on local comps, the quality of renovations, and
        market conditions. This calculator helps you organize numbers quickly; it
        does not replace an appraisal or a broker&apos;s comparable analysis.
      </p>

      <h2
        id="how-to-calculate-arv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate After Repair Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A straightforward planning formula is:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        ARV = Current Property Value + Value Added by Renovations
      </div>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Property value = $300,000</p>
        <p>Value added by renovations = $50,000</p>
        <p>ARV = 300,000 + 50,000 = $350,000</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        You can also derive current value from average area price × property
        size when you are working from neighborhood comps priced per square
        foot or square meter.
      </p>

      <h2
        id="seventy-percent-rule"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the 70% Rule in Real Estate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many house flippers use a purchase heuristic sometimes called the 70%
        rule: offer no more than about 70% of ARV after subtracting renovation
        cost. The buffer is meant to leave room for profit, carrying costs, and
        surprises. It is a heuristic, not a law — hot markets, lower risk, or
        different exit strategies may justify a higher or lower percentage.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Maximum bid = (ARV × Purchase rule % / 100) − Renovation cost
      </div>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>ARV = $350,000</p>
        <p>Purchase rule = 70%</p>
        <p>Renovation cost = $50,000</p>
        <p>Maximum bid = (350,000 × 0.70) − 50,000 = $195,000</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the ARV Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select your property valuation method.</li>
        <li>
          Enter the property&apos;s current value, or average area price and
          property size.
        </li>
        <li>Enter the value added by renovations.</li>
        <li>Review the calculated ARV.</li>
        <li>Enter the estimated renovation cost.</li>
        <li>Adjust the investor purchase rule if needed (default 70%).</li>
        <li>Review the maximum bid price.</li>
        <li>
          Optionally enter a custom purchase price or target ROI under Additional
          settings / Potential ROI to refine return estimates.
        </li>
      </ol>

      <h2
        id="arv-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ARV Calculation Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ARV = PV + VR</p>
        <p>PV = APP × PA</p>
        <p>MBP = ARV × (P / 100) − RC</p>
        <p>ROI = [(ARV − PP − RC) / (PP + RC)] × 100</p>
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>PV</strong> — current (as-is) property value
        </li>
        <li>
          <strong>VR</strong> — value added by renovations (market uplift)
        </li>
        <li>
          <strong>APP</strong> — average price per unit of area
        </li>
        <li>
          <strong>PA</strong> — property area
        </li>
        <li>
          <strong>MBP</strong> — maximum bid price under the purchase rule
        </li>
        <li>
          <strong>P</strong> — investor purchase rule percent
        </li>
        <li>
          <strong>RC</strong> — total renovation cost
        </li>
        <li>
          <strong>PP</strong> — purchase price used for ROI
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Area conversion uses 1 m² = 10.7639104167 ft². Changing the area unit
        also converts average price per area so the product stays consistent.
      </p>

      <h2
        id="arv-vs-market-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ARV vs. Market Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Current market value describes what buyers would likely pay today.
        Estimated after-repair market value describes what they might pay after
        the planned work. Renovation cost is a cash outlay; renovation value is
        the market&apos;s response. Local comparable sales of renovated homes
        remain the strongest check on both figures.
      </p>

      <h2
        id="arv-limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of ARV Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simple ARV worksheet does not automatically include unexpected
        renovation overruns, financing and interest, holding costs, property
        taxes, closing costs, selling commissions, or sudden market shifts.
        Always cross-check with local comps and professional advice before
        making an offer.
      </p>

      <h2
        id="arv-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...ARV_FAQS]} />
      </div>
    </article>
  );
}
