import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WHP_FAQS } from './content';

export function WheelHorsepowerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Wheel Horsepower Calculator – Calculate WHP and Drivetrain Loss
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate wheel horsepower from crankshaft power (or the reverse), apply
        overall or component-based drivetrain efficiency, and see power loss and
        loss percentage. Presets are editable modeling estimates — not universal
        OEM specifications or a substitute for dynamometer testing.
      </p>

      <h2
        id="what-whp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Wheel Horsepower (WHP)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Wheel horsepower is the power delivered at the driven wheels after the
        transmission, shafts, differentials, and related hardware consume a
        share of engine output. Engine or crankshaft horsepower is measured
        upstream of most of those losses.
      </p>

      <h2
        id="whp-vs-hp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wheel Horsepower vs. Engine Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine horsepower describes power at the crankshaft (or a comparable
        engine-output reference). Wheel horsepower reflects what reaches the
        tires. Powertrain losses and chassis-dyno methods explain why the two
        numbers differ even for the same vehicle state.
      </p>

      <h2
        id="how-calc-whp"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Wheel Horsepower
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        WHP = HP × η
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 300 hp engine power at 85% drivetrain efficiency → WHP = 300 ×
        0.85 = 255 WHP.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wheel Horsepower Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HP is engine power, η is overall drivetrain efficiency as a decimal
        (percent ÷ 100). Convert units consistently — this tool supports
        mechanical horsepower (hp), kilowatts (kW), and metric horsepower (PS)
        while preserving the physical power value when you switch units.
      </p>

      <h2
        id="how-calc-engine"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Engine Horsepower from WHP
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        HP = WHP / η
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 255 WHP at 85% efficiency → HP = 255 / 0.85 = 300 hp.
      </p>

      <h2
        id="drivetrain-loss"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Drivetrain Loss?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mechanical friction, gear meshing, fluid churning, and other parasitic
        effects reduce power between the crankshaft and the wheels. In this
        model, power loss ≈ HP − WHP.
      </p>

      <h2
        id="loss-percent"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Drivetrain Loss Percentage
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Loss% = 100 × (1 − η)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An 85% efficient path implies about 15% drivetrain loss under the same
        simplified assumption.
      </p>

      <h2
        id="drivetrain-eff"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Drivetrain Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Overall efficiency can be entered directly, or computed from a series of
        component efficiencies: η_total = η₁ × η₂ × … × ηₙ. Do not stack overall
        and component losses at the same time.
      </p>

      <h2
        id="gearbox"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gearbox Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Transmissions dissipate power through gear friction, clutch or torque
        converter behavior, and fluid motion. Enter the percentage of power you
        expect to leave the gearbox.
      </p>

      <h2
        id="prop-shaft"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Propeller Shaft Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On many RWD, AWD, and 4WD layouts, a propeller shaft carries torque
        rearward. Bearing and joint losses are modeled here when that component
        applies; FWD presets typically omit it.
      </p>

      <h2
        id="differential"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Differential Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Differentials split torque and add gear and bearing losses. Enter the
        percentage of power transmitted through the differential stage in your
        simplified model.
      </p>

      <h2
        id="driveshaft"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Driveshaft Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Half-shafts or driveshafts deliver torque to the wheels. Their joint and
        bearing losses appear as a final efficiency percentage in component mode.
      </p>

      <h2
        id="fwd-rwd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Front-Wheel Drive vs. Rear-Wheel Drive
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FWD packages often use a shorter power path without a long propeller
        shaft; illustrative presets use ~88% efficiency (~12% loss). RWD layouts
        commonly use ~85% (~15% loss) as a starting estimate. Hardware still
        overrides the label.
      </p>

      <h2
        id="awd-rwd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        AWD vs. RWD Drivetrain Losses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AWD and 4WD systems may engage additional gearing and differentials.
        Illustrative presets use ~80% efficiency (~20% loss). Operating mode and
        mechanical design can narrow or widen that gap versus RWD.
      </p>

      <h2
        id="how-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Wheel Horsepower Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose drivetrain type (editable overall preset) or Custom.</li>
        <li>
          Select calculation mode: engine → wheel, wheel → engine, or measured
          efficiency from both HP and WHP.
        </li>
        <li>
          Use overall efficiency, or switch to component efficiencies (gearbox,
          propeller shaft when applicable, differential, driveshaft).
        </li>
        <li>Enter power in hp, kW, or PS — switching units keeps physical power.</li>
        <li>Read WHP/HP, overall η, power loss, and loss % in the results panel.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wheel Horsepower Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine horsepower 300 hp · drivetrain efficiency 85% → wheel horsepower
        255 WHP · power loss 45 hp · drivetrain loss 15%.
      </p>

      <h2
        id="accuracy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Accurate Is a Wheel Horsepower Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results match the efficiencies you enter. Measured losses vary with
        transmission design, gear, speed, tires, fluid temperature, dyno
        methodology, and operating conditions.
      </p>

      <h2
        id="chassis-dyno"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Chassis Dynamometer?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A chassis dynamometer loads the vehicle through the driven wheels
        (rollers or hubs) to measure wheel horsepower and related performance
        data under controlled corrections.
      </p>

      <h2
        id="engine-vs-chassis"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Dyno vs. Chassis Dyno
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An engine (brake) dynamometer measures engine output more directly. A
        chassis dyno measures power at the wheels after drivetrain losses. Do not
        mix correction standards when comparing runs.
      </p>

      <h2
        id="why-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Does Wheel Horsepower Matter?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        WHP helps compare vehicle performance closer to the tires and track
        chassis-dyno progress after tuning — useful alongside, not instead of,
        engine power figures.
      </p>

      <h2
        id="improve"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Drivetrain Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep fluids and hardware in good condition, follow service intervals, and
        evaluate mechanical changes carefully. Treat any horsepower change as
        situation-dependent — this calculator does not promise gains.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Wheel Horsepower Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Confusing efficiency (%) with loss (%)</li>
        <li>Applying overall and component losses together</li>
        <li>Mixing hp, kW, and PS without converting</li>
        <li>Treating generic drivetrain presets as exact measurements</li>
        <li>Using the wrong calculation direction for filled fields</li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Wheel Horsepower Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool uses a simplified efficiency model. It is not a replacement for
        chassis or engine dynamometer measurement, OEM data, or professional
        calibration.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/horsepower-calculator">Horsepower Calculator</Link>
        </li>
        <li>
          <Link href="/tools/boost-horsepower-calculator">
            Boost Horsepower Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rpm-calculator">RPM Calculator</Link>
        </li>
        <li>
          <Link href="/tools/turbo-size-calculator">Turbo Size Calculator</Link>
        </li>
        <li>
          <Link href="/tools/bsfc-calculator">BSFC Calculator</Link>
        </li>
        <li>
          <Link href="/tools/fuel-injector-calculator">
            Fuel Injector Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="whp-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...WHP_FAQS]} />
      </div>
    </article>
  );
}
