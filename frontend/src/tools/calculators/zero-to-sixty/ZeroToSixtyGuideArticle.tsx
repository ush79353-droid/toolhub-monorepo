import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  DRIVETRAIN_COMPARISON_DATA,
  ZERO_TO_SIXTY_FAQS,
} from './content';

export function ZeroToSixtyGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {/* Section 1: What Is a 0-60 Calculator? */}
        <article id="what-is-a-0-60-calculator" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What Is a 0–60 Calculator?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              A 0–60 calculator is an automotive performance estimation tool designed to model how
              rapidly a motor vehicle accelerates from a dead stop to 60 miles per hour (96.56 km/h).
              Rather than guessing based purely on advertising numbers, this calculator computes
              the physical interactions between flywheel power, transmission losses, tire traction limits,
              and aerodynamic drag.
            </p>
            <p>
              Whether you are evaluating a prospective car purchase, tuning an engine upgrade, or
              comparing drivetrain configurations (such as RWD vs. AWD), this calculator translates
              core physical metrics into realistic, testable acceleration curves.
            </p>
          </div>
        </article>

        {/* Section 2: What Does 0-60 mph Mean? */}
        <article id="what-does-0-60-mean" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What Does 0–60 mph Mean?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In automotive testing, 0–60 mph is the universal industry standard benchmark for measuring
              a vehicle&apos;s initial acceleration capability. It represents the elapsed time (measured
              in seconds and hundredths of a second) required for a vehicle to accelerate from a complete
              standstill (0 mph) up to a velocity of exactly 60 miles per hour (26.8224 m/s).
            </p>
            <p>
              This benchmark is critically informative because it tests two distinct physical domains:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Traction-Limited Launch (0 to ~30 mph):</strong> The vehicle&apos;s initial burst of speed
                is limited by tire adhesion and drivetrain grip, testing launch control and weight transfer.
              </li>
              <li>
                <strong>Power-Limited Acceleration (~30 to 60 mph):</strong> Once tire slip ceases, acceleration
                is dictated primarily by power-to-weight ratio and gear shift efficiency against opposing aero drag.
              </li>
            </ul>
          </div>
        </article>

        {/* Section 3: How Does a 0-60 Calculator Work? */}
        <article id="how-the-calculator-works" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How Does a 0–60 Calculator Work?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Our calculator does not use arbitrary static formulas or hardcoded lookup tables. Instead,
              it runs a high-precision forward Euler numerical simulation stepping forward in 5-millisecond
              (0.005s) discrete time slices from standstill until the target velocity is crossed.
            </p>
            <p>
              At each instantaneous simulation step, the engine balances driving force against resistive
              forces, updating velocity and distance dynamically:
            </p>
            <ol className="list-decimal space-y-2 pl-5 marker:text-muted-foreground">
              <li>Calculates wheel power after mechanical drivetrain parasitic losses.</li>
              <li>Determines maximum available tire traction including dynamic rearward weight transfer.</li>
              <li>Computes opposing aerodynamic drag, rolling resistance, and gravitational slope force.</li>
              <li>Accounts for gear shift interruptions based on the transmission selected.</li>
              <li>Integrates acceleration into velocity and distance, interpolating exact crossing timestamps.</li>
            </ol>
          </div>
        </article>

        {/* Section 4: Core Acceleration Formulas */}
        <article id="acceleration-formulas" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Core Acceleration Physics Formulas
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The calculation engine implements classical vehicle dynamics equations grounded in SI units:
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
              <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
                F_net = F_drive - F_drag - F_roll - F_grade
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Where acceleration is computed as: a = F_net / (m_total &times; &gamma;), with &gamma; = 1.05
                accounting for rotational inertia of spinning driveline components.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
              <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
                F_drag = 0.5 &times; &rho; &times; C_d &times; A &times; v&sup2;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Where &rho; = 1.225 kg/m&sup3; (sea-level air density), C_d is the aerodynamic drag coefficient,
                A is frontal area (m&sup2;), and v is instantaneous velocity (m/s).
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
              <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
                F_traction = &mu; &times; m_total &times; g &times; cos(&theta;) &times; W_driven_fraction &times; k_launch
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Traction limits maximum drive force during low-speed launch before power-limited velocity is reached.
              </p>
            </div>
          </div>
        </article>

        {/* Section 5: What Affects 0-60 Performance? */}
        <article id="what-affects-0-60-performance" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What Affects 0–60 Performance?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Real-world acceleration is influenced by a combination of mechanical, environmental,
              and human factors:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Curb Weight vs. Gross Weight:</strong> Mass is the single greatest inhibitor of acceleration.
                Adding fuel, heavy wheels, or extra passengers noticeably increases time to speed.
              </li>
              <li>
                <strong>Tire Compound and Temperature:</strong> Cold street tires offer drastically less adhesion
                than warm performance rubber. Warm sticky compounds allow higher launch forces without wheelspin.
              </li>
              <li>
                <strong>Drivetrain Layout:</strong> All-Wheel Drive distributes launch torque across all 4 wheels,
                avoiding the traction limits that plague high-horsepower rear- and front-wheel-drive cars.
              </li>
              <li>
                <strong>Transmission Shift Interruption:</strong> Modern dual-clutch gearboxes shift in milliseconds,
                maintaining boost and forward momentum, whereas manual clutch gear changes cause noticeable coasting deceleration.
              </li>
              <li>
                <strong>Road Slope:</strong> Even a slight 2% to 3% uphill incline imposes substantial gravitational resistance.
              </li>
            </ul>
          </div>
        </article>

        {/* Section 6: Power-to-Weight Ratio Explained */}
        <article id="power-to-weight-ratio-explained" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Power-to-Weight Ratio Explained
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Power-to-weight ratio is the ultimate equalizer in performance engineering. Rather than looking
              at horsepower in isolation, power-to-weight expresses how many pounds each horsepower must propel:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
              <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
                Pounds per Horsepower = Total Vehicle Weight (lb) / Engine Power (hp)
              </p>
            </div>
            <p>
              For example, a 300 hp vehicle weighing 3,000 lb has a ratio of 10.0 lb/hp (or 200 hp per US ton).
              A heavier 4,500 lb vehicle with 400 hp has a ratio of 11.25 lb/hp, which means the lighter 300 hp
              car actually has superior power-to-weight and will typically accelerate faster once traction is established.
            </p>
          </div>
        </article>

        {/* Section 7: 0-60 mph vs 0-100 km/h */}
        <article id="0-60-vs-0-100-kmh" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            0–60 mph vs. 0–100 km/h: Why They Are Not Identical
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              A frequent point of confusion is treating 0–60 mph and 0–100 km/h as interchangeable.
              They are not:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                <strong>60 mph = 96.5606 km/h</strong>
              </li>
              <li>
                <strong>100 km/h = 62.1371 mph</strong>
              </li>
            </ul>
            <p>
              Reaching 100 km/h requires accelerating an additional 2.14 mph past 60 mph. Because acceleration
              naturally tapers off at higher velocities due to increased aerodynamic drag and taller gearing,
              and because some vehicles require an extra gear shift right at 61 mph, the 0–100 km/h time is
              typically 0.2 to 0.5 seconds slower than the 0–60 mph figure.
            </p>
          </div>
        </article>

        {/* Section 8: Drivetrain Dynamics */}
        <article id="drivetrain-comparison" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Drivetrain Dynamics: FWD vs. RWD vs. AWD
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              How engine power gets to the ground fundamentally dictates initial acceleration off the line:
            </p>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[500px] text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Drivetrain</th>
                  <th className="px-4 py-3">Dynamic Weight Transfer</th>
                  <th className="px-4 py-3">Launch Character</th>
                  <th className="px-4 py-3">Typical Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DRIVETRAIN_COMPARISON_DATA.map((row) => (
                  <tr key={row.drivetrain} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-accent">{row.drivetrain}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.weightTransfer}</td>
                    <td className="px-4 py-3 text-foreground/85">{row.launchStrength}</td>
                    <td className="px-4 py-3 font-mono font-medium text-primary">{row.typicalEfficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Section 9: Worked Example */}
        <article id="worked-0-60-example" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Worked Acceleration Example
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Consider a standard sports coupe evaluated by our calculation engine with the following baseline parameters:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-muted-foreground">
              <li><strong>Engine Power:</strong> 300 hp (flywheel)</li>
              <li><strong>Test Weight:</strong> 3,500 lb (including driver and fuel)</li>
              <li><strong>Drivetrain:</strong> Rear-Wheel Drive (RWD) with 85% mechanical efficiency</li>
              <li><strong>Transmission:</strong> Automatic (0.15s shift delay)</li>
              <li><strong>Tires & Surface:</strong> Standard street tires on dry level asphalt (0% gradient)</li>
            </ul>

            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-accent">Simulation Results from Implemented Engine:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground sm:grid-cols-3">
                <div>Estimated 0–60 mph: <strong className="text-primary font-bold">5.98 s</strong></div>
                <div>Estimated 0–100 km/h: <strong className="text-accent">6.25 s</strong></div>
                <div>Wheel Horsepower: <strong className="text-accent">255 whp</strong></div>
                <div>Distance to 60 mph: <strong className="text-accent">273.3 ft (83.3 m)</strong></div>
                <div>Average Acceleration: <strong className="text-accent">0.46 g (4.48 m/s²)</strong></div>
                <div>Power-to-Weight: <strong className="text-accent">171.4 hp/ton</strong></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Notice that the 0–100 km/h time is exactly 0.27 seconds slower than 0–60 mph, illustrating the
              extra speed and slight aerodynamic taper above 60 mph.
            </p>
          </div>
        </article>

        {/* Section 10: Model Accuracy and Limits */}
        <article id="model-accuracy-and-limits" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How Accurate Are Mathematical Estimates?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              This calculator provides an illustrative engineering estimate based on peak horsepower,
              drivetrain parasitic losses, and classic tire adhesion models. While highly representative
              for standard production vehicles, several real-world elements cannot be fully captured without
              full manufacturer dynamometer traces and telemetry data:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
              <li>
                <strong>RPM Torque Curves:</strong> Engines do not produce peak power at every RPM. A broad, flat
                turbocharged torque curve will accelerate faster than a peaky, high-revving naturally aspirated engine
                with identical peak horsepower.
              </li>
              <li>
                <strong>Launch Control Software:</strong> Advanced computer-managed launch control systems modulate
                throttle and spark timing hundreds of times per second to hold tires at optimal slip.
              </li>
              <li>
                <strong>Pavement Micro-Texture:</strong> Concrete vs. freshly sealed asphalt can alter the grip
                coefficient (&mu;) by &plusmn;15%.
              </li>
            </ul>
          </div>
        </article>

        {/* Section 11: Common Estimation Mistakes */}
        <article id="common-estimation-mistakes" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Common Acceleration Estimation Mistakes
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Forgetting Driver and Fuel Weight:</strong> Manufacturer specifications list empty curb weight.
                A 180-lb driver plus 100 lb of gasoline adds nearly 300 lb, which adds 0.2–0.3s to practical times.
              </li>
              <li>
                <strong>Ignoring Drivetrain Parasitic Losses:</strong> Flywheel horsepower is not wheel horsepower.
                Driveshafts, gearsets, differentials, and fluid pumps consume between 12% and 18% of power before it touches asphalt.
              </li>
              <li>
                <strong>Assuming Infinite Grip:</strong> High-powered sports cars often cannot use all their power below
                40 mph without spinning the drive wheels. More horsepower does not improve 0–60 if the car is already traction-limited.
              </li>
            </ul>
          </div>
        </article>

        {/* Section 12: Frequently Asked Questions */}
        <article id="frequently-asked-questions" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-5">
            <FAQAccordion items={[...ZERO_TO_SIXTY_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
