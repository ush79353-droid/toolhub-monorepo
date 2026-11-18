export function SalaryWithOvertimeGuideArticle() {
  return (
    <div className="space-y-8 text-[15px] leading-7 text-foreground">
      <section id="what-is-salary-with-overtime" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is Salary With Overtime?</h2>
        <p>
          Many roles pay a regular wage for scheduled hours and a higher rate for overtime.
          This calculator estimates total regular pay, overtime pay, and combined pay from
          your regular rate, regular hours, overtime multiplier, and overtime hours. It is a
          planning tool, not a payroll or compliance determination.
        </p>
      </section>

      <section id="salary-with-overtime-formulas" className="scroll-mt-24 space-y-3">
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
          Regular pay 500 per hour, 160 hours per month, multiplier 1.5, and 20 overtime
          hours per month:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Regular monthly pay = 500 × 160 = 80,000</li>
          <li>Overtime hourly rate = 500 × 1.5 = 750</li>
          <li>Monthly overtime pay = 750 × 20 = 15,000</li>
          <li>Total monthly pay = 95,000</li>
        </ol>
      </section>

      <section id="salary-with-overtime-faq" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Frequently Asked Questions</h2>
        <p>
          See the FAQ accordion below for unit conversion notes, FX behavior, and planning
          caveats for this calculator.
        </p>
      </section>
    </div>
  );
}
