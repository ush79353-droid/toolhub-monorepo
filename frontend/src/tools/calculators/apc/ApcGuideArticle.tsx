import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { APC_FAQS } from './content';

export function ApcGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-apc" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is the average propensity to consume (APC)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Average Propensity to Consume (APC) is the proportion of disposable income spent on
        consumption. It connects household spending, disposable income, saving behavior, and broader
        consumption patterns used in macroeconomic analysis. APC is one indicator among many and
        should be interpreted with other relevant data.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate average propensity to consume
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>APC = C / Yd</p>
        <p className="mt-2">APC (%) = (C / Yd) × 100</p>
        <p className="mt-2">S = Yd − C</p>
        <p className="mt-2">APS = (Yd − C) / Yd</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Here C is total consumption and Yd is disposable income for the same period. Multiply the
        decimal ratio by 100 to express APC as a percentage. Under the simplified model, APC + APS =
        1.
      </p>

      <h2
        id="what-is-disposable-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is disposable income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Disposable income is income available after direct taxes — roughly take-home income that can
        be consumed or saved. A simplified definition is Yd = Y − T, where Y is personal income and
        T is direct taxes. Definitions can differ across statistical frameworks and datasets.
      </p>

      <h2
        id="what-is-consumption"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is total consumption?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total consumption is expenditure on goods and services over a period — durables,
        non-durables, and services that make up household or personal consumption demand. Use the
        same accounting period for consumption and disposable income when calculating APC.
      </p>

      <h2
        id="advanced-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advanced APC formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A simplified Keynesian consumption function is:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>C = C₀ + c × Yd</p>
        <p className="mt-2">APC = C / Yd = C₀ / Yd + c</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        C₀ is autonomous consumption, and c is the marginal propensity to consume (MPC). Even with a
        constant MPC, APC can change with income because of the autonomous term. This calculator’s
        primary result still uses the basic APC = C / Yd inputs.
      </p>

      <h2 id="apc-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        An example of average propensity to consume calculation
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Disposable income Yd = $10,000</p>
        <p>Consumption C = $8,400</p>
        <p className="mt-2">APC = 8,400 / 10,000 = 0.84</p>
        <p>APC percentage = 84%</p>
        <p>Implied savings = 10,000 − 8,400 = $1,600</p>
        <p>APS = 16%</p>
      </div>

      <h2 id="apc-vs-mpc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is the difference between average and marginal propensity to consume?
      </h2>
      <div className="my-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Feature</th>
              <th className="px-3 py-2 font-medium">APC</th>
              <th className="px-3 py-2 font-medium">MPC</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Full form</td>
              <td className="px-3 py-1.5">Average Propensity to Consume</td>
              <td className="px-3 py-1.5">Marginal Propensity to Consume</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Measurement</td>
              <td className="px-3 py-1.5">Total consumption relative to total income</td>
              <td className="px-3 py-1.5">Change in consumption relative to change in income</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Formula</td>
              <td className="px-3 py-1.5 font-mono text-xs">C / Yd</td>
              <td className="px-3 py-1.5 font-mono text-xs">ΔC / ΔYd</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-1.5">Purpose</td>
              <td className="px-3 py-1.5">Average spending behavior</td>
              <td className="px-3 py-1.5">Additional spending behavior</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Economists use both measures because average and marginal spending behavior answer different
        questions about consumer demand.
      </p>

      <h2 id="why-important" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why is APC important in economics?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APC informs discussions of household consumption and saving, aggregate demand, growth,
        fiscal policy responses, consumer confidence, and forecasting. It remains one indicator and
        should not be used alone for policy or personal finance decisions.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/503020-rule-calculator" className="text-primary hover:underline">
            50/30/20 Rule Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/702010-rule-money-calculator" className="text-primary hover:underline">
            70/20/10 Rule Calculator
          </Link>
        </li>
      </ul>

      <h2 id="apc-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...APC_FAQS]} />
      </div>
    </article>
  );
}
