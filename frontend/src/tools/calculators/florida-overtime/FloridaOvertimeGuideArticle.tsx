export function FloridaOvertimeGuideArticle() {
  return (
    <div className="space-y-8 text-[15px] leading-7 text-foreground">
      <section id="what-is-florida-overtime" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is Florida Overtime Pay?</h2>
        <p>
          Overtime is pay for hours worked beyond a regular schedule. In Florida, covered
          non-exempt employees commonly receive at least time-and-a-half (1.5×) for hours
          over 40 in a workweek under the federal Fair Labor Standards Act. This calculator
          estimates regular pay, overtime pay, and total pay from the rates and hours you
          enter. It is a planning tool, not a compliance determination.
        </p>
      </section>

      <section id="florida-overtime-formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-accent">Regular monthly pay</span> = hourly
            rate × weekly regular hours × 52/12
          </li>
          <li>
            <span className="font-medium text-accent">Overtime hourly rate</span> = regular
            hourly rate × overtime multiplier
          </li>
          <li>
            <span className="font-medium text-accent">Monthly overtime pay</span> = overtime
            hourly rate × monthly overtime hours
          </li>
          <li>
            <span className="font-medium text-accent">Total monthly pay</span> = regular
            monthly pay + monthly overtime pay
          </li>
        </ul>
        <p>
          Pay and duration unit selectors normalize wages and hours before these formulas
          run. Currency selectors convert money amounts only; hours and the multiplier stay
          unchanged.
        </p>
      </section>

      <section id="step-by-step-example" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Step-by-Step Example</h2>
        <p>
          Regular pay 20 per hour, 40 hours per week, multiplier 1.5, and 10 overtime hours
          per month:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Regular monthly pay = 20 × 40 × 52/12 ≈ 3,466.67</li>
          <li>Overtime hourly rate = 20 × 1.5 = 30</li>
          <li>Monthly overtime pay = 30 × 10 = 300</li>
          <li>Total monthly pay ≈ 3,766.67</li>
        </ol>
      </section>

      <section id="florida-overtime-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Frequently Asked Questions</h2>
        <p>
          See the FAQ accordion below for exemption caveats, unit conversion notes, and how
          independent FX selectors behave on this page.
        </p>
      </section>
    </div>
  );
}
