import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUEL_INJ_FAQS } from './content';

export function FuelInjectorGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fuel Injector Calculator – Calculate Injector Size and Fuel Flow Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate required fuel injector mass-flow from crankshaft horsepower,
        BSFC, injector count, and maximum duty cycle. Suggested BSFC and density
        values are labeled engineering estimates — not measured engine maps or
        manufacturer certifications.
      </p>

      <h2
        id="what-is-injector"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Fuel Injector?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A fuel injector meters pressurized fuel into the engine under electronic
        control, atomizing fuel for mixing with air.
      </p>

      <h2
        id="what-is-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Fuel Injector Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies a transparent mass-flow sizing model so you can compare
        injector capacity to a target horsepower and duty-cycle limit.
      </p>

      <h2
        id="how-injection"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Fuel Injection Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The ECU commands pulse width. Flow depends on differential pressure,
        nozzle geometry, and open time. This calculator abstracts that into an
        average mass-flow requirement.
      </p>

      <h2
        id="bsfc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Brake-Specific Fuel Consumption (BSFC)?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        BSFC = FuelMassFlow / BrakePower
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Typical unit here: lb/(hp·hr). Lower BSFC means less fuel mass per unit
        brake power.
      </p>

      <h2
        id="bsfc-fuels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BSFC for Different Fuel Types
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suggested gasoline NA ≈ 0.50; turbo gasoline often higher; diesel often
        lower; E85/ethanol/methanol typically higher mass flow for the same
        power. All are estimates — override with your dyno or calibration data.
      </p>

      <h2
        id="na-vs-fi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Naturally Aspirated vs. Turbocharged Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Forced induction often runs richer targets and different operating maps,
        so sizing estimates commonly use higher BSFC than NA gasoline.
      </p>

      <h2
        id="how-to-find"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find the Required Fuel Injector Flow Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose HP (target if set), BSFC, injector count, and max duty cycle,
        then apply the formula below.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Flow Rate Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        IFR = (HP × BSFC) / (N × DC)
      </p>

      <h2
        id="how-to-size"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Injector Size
      </h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>Select horsepower (target total, not additive).</li>
        <li>Set BSFC (estimate or measured).</li>
        <li>Set injector count N.</li>
        <li>Convert duty cycle percent to a decimal.</li>
        <li>Compute IFR and convert units with density if needed.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Calculator Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        400 hp · BSFC 0.50 · 8 injectors · 80% DC → IFR = 200 / 6.4 ={' '}
        <strong>31.25 lb/hr</strong> per injector. Total fuel mass flow = 200
        lb/hr.
      </p>

      <h2
        id="duty-cycle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Injector Duty Cycle?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duty cycle is the fraction of available time the injector is open.
        Leaving headroom (e.g., sizing at 80%) helps avoid running injectors
        static at peak load.
      </p>

      <h2
        id="duty-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Duty Cycle Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        RequiredDC = (HP × BSFC) / (N × InjectorFlow)
      </p>

      <h2
        id="fuel-pressure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Fuel Pressure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Rail gauge pressure is not always the differential pressure across the
        injector tip — manifold pressure under boost can reduce ΔP unless the
        system compensates.
      </p>

      <h2
        id="pressure-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Fuel Pressure Affects Injector Flow
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Q₂ = Q₁ √(ΔP₂ / ΔP₁)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 300 cc/min at 3 bar → at 4 bar ≈ 346.41 cc/min (ideal model).
      </p>

      <h2
        id="turbo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Size for Turbocharged Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use a turbo aspiration BSFC suggestion or your own map, and check
        differential pressure at boost.
      </p>

      <h2
        id="super"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Size for Supercharged Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Similar planning approach to turbo: higher power targets and often richer
        BSFC estimates increase required flow.
      </p>

      <h2
        id="na"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Size for Naturally Aspirated Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NA gasoline sizing examples often start near 0.50 lb/(hp·hr) BSFC — still
        an estimate, not a measured map point.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fuel Injector Flow Rate Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mass: lb/hr, g/min, kg/hr. Volume: cc/min or mL/min (needs density).
      </p>

      <h2
        id="lb-to-cc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert lb/hr to cc/min
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        g/min = lb/hr × 453.59237 / 60; cc/min = (g/min) / density(g/mL). Do not
        use a single universal lb/hr→cc/min factor for all fuels.
      </p>

      <h2
        id="v8"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Injector Size for a V8 Engine
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        400 hp · 0.50 BSFC · 8 injectors · 80% → 31.25 lb/hr each.
      </p>

      <h2
        id="four-cyl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Injector Size for a Four-Cylinder Engine
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        200 hp · 0.50 BSFC · 4 injectors · 80% → 31.25 lb/hr each.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Fuel Injector Sizing Mistakes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adding current and target HP; ignoring injector count overrides; treating
        rail pressure as ΔP; using gasoline density for alcohol; assuming 100%
        DC with no headroom.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Injector Sizing Estimates Differ From Real Engine Requirements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Real BSFC varies with load and AFR; injectors are nonlinear at short
        pulse widths; fuel temperature and pressure regulators change flow. Use
        this tool for planning, then verify with calibration.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/bsfc-calculator">BSFC Calculator</Link>
        </li>
        <li>
          <Link href="/tools/horsepower-calculator">Horsepower Calculator</Link>
        </li>
        <li>
          <Link href="/tools/boost-horsepower-calculator">
            Boost Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/fuel-cost-calculator">Fuel Cost Calculator</Link>
        </li>
        <li>
          <Link href="/tools/compression-ratio-calculator">
            Compression Ratio Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="fi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FUEL_INJ_FAQS]} />
      </div>
    </article>
  );
}
