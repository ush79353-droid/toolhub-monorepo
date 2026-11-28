import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ENGINE_HOURS_FAQS } from './content';

export function EngineHoursGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Engine Hours to Miles Converter – Calculate Equivalent Vehicle Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert engine operating hours into estimated driving distance using an
        average speed, reverse the estimate to find driving hours from distance,
        or explore maintenance-equivalent mileage for idle time. Results are
        educational estimates — not odometer readings or manufacturer wear
        guarantees.
      </p>

      <h2
        id="what-are-engine-hours"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Are Engine Hours?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Engine hours are the cumulative time an engine has been running,
        typically tracked by an hour meter. Unlike the odometer, the meter does
        not care how far you travel — only how long the engine operates.
      </p>

      <h2
        id="hours-vs-odometer"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours vs. Odometer Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Odometer miles measure distance. Engine hours measure time. A delivery
        van that idles between stops can rack up hours faster than highway
        miles. Both metrics matter; neither fully replaces the other.
      </p>

      <h2
        id="how-to-convert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Engine Hours to Miles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose driving mode, enter engine hours and an average speed, then read
        the estimated distance. Switch units freely — the tool converts to a
        consistent internal basis before multiplying.
      </p>

      <h2
        id="formula-miles"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours to Miles Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Miles = Engine Hours × Average Speed (mph)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 1,000 h × 30 mph = 30,000 estimated miles.
      </p>

      <h2
        id="formula-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Engine Hours to Kilometers
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Kilometers = Engine Hours × Average Speed (km/h)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 500 h × 50 km/h = 25,000 km. Or convert miles with 1 mi =
        1.609344 km.
      </p>

      <h2
        id="miles-to-hours"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Convert Miles to Engine Hours
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Engine Hours = Distance ÷ Average Speed
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 60,000 mi ÷ 30 mph = 2,000 estimated driving hours. This is
        moving time only — recorded hour-meter totals may be higher if idle is
        included.
      </p>

      <h2
        id="driving-vs-idle"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Driving Engine Hours vs. Idle Engine Hours
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Driving hours imply the vehicle is moving, so distance ≈ hours × speed.
        Stationary or idle hours mean actual distance traveled is zero, even
        though the engine still accumulates wear, heat cycles, and fuel use.
      </p>

      <h2
        id="miles-per-hour"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Many Miles Equal One Engine Hour?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        There is no universal conversion. One driving hour equals whatever
        average speed you assume. One idle hour equals zero road miles. Do not
        treat any single factor as a global automotive standard.
      </p>

      <h2
        id="maintenance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Engine Hours Matter for Vehicle Maintenance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Oil, filters, belts, and inspections often follow hour-based or dual
        (hours or miles) schedules. Tracking hours catches wear on machines that
        work hard without logging highway distance.
      </p>

      <h2
        id="idling-wear"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Engine Idling Affects Vehicle Wear
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Idling still circulates oil, loads cooling systems, and consumes fuel.
        Prolonged idle can advance hour-based service intervals while the
        odometer barely moves — which is why fleets monitor idle percentage.
      </p>

      <h2
        id="maintenance-equiv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Maintenance-Equivalent Mileage?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Equivalent Miles = Idle Hours × Conversion Factor (mi/h)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Some maintenance programs invent an “as if” mileage for idle time so
        schedules stay consistent with mile-based intervals. The factor is a
        policy choice — configurable in this calculator and clearly labeled as
        an assumption. It is never actual distance traveled.
      </p>

      <h2
        id="trucks"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours for Trucks and Commercial Vehicles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fleet trucks often idle for refrigeration, comfort, or PTO work.
        Comparing hours, miles, and idle ratio helps plan PM and flag outliers.
      </p>

      <h2
        id="agriculture"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours for Agricultural Equipment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tractors and harvesters may cover little road distance yet run for long
        field hours. Hour meters — not odometers — usually drive service timing.
      </p>

      <h2
        id="construction"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours for Construction Equipment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Excavators, loaders, and generators frequently operate without meaningful
        road mileage. Converting hours to “miles” is mainly for cross-comparing
        assets that mix road and job-site duty — and must stay clearly labeled.
      </p>

      <h2
        id="inspection"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours and Used Vehicle Inspection
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When buying used commercial or specialty equipment, review both hour and
        mileage readings. High hours with low miles can indicate idle-heavy use;
        treat estimated conversions as context, not proof of odometer history.
      </p>

      <h2
        id="estimate-speed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Average Vehicle Speed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        From a known trip: Average Speed = Distance ÷ Driving Time. Prefer
        moving time over total hour-meter time if idle is significant. Highway
        vs. urban duty cycles produce very different averages.
      </p>

      <h2
        id="cannot-exact"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Engine Hours Cannot Determine Exact Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Hours alone do not encode distance. Without speed or measured miles, any
        conversion invents an assumption. Stationary operation proves the point:
        hours rise while actual distance stays zero.
      </p>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Engine Hours Conversion Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>1,000 h × 30 mph → 30,000 estimated miles</li>
        <li>500 h × 50 km/h → 25,000 estimated km</li>
        <li>60,000 mi ÷ 30 mph → 2,000 estimated driving hours</li>
        <li>
          500 idle h × 30 mi/h factor → 15,000 maintenance-equivalent miles
          (actual distance still 0)
        </li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Engine Hours to Miles Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Speed assumptions vary by route and duty cycle. Idle factors are
        policy-specific. Hour meters can differ in what they count. This tool
        does not replace OEM schedules, telematics reports, or professional
        inspection.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/drive-time-calculator">Drive Time Calculator</Link>
        </li>
        <li>
          <Link href="/tools/commute-calculator">Commute Calculator</Link>
        </li>
        <li>
          <Link href="/tools/carpooling-calculator">Carpooling Calculator</Link>
        </li>
        <li>
          <Link href="/tools/boat-speed-calculator">Boat Speed Calculator</Link>
        </li>
        <li>
          <Link href="/tools/horsepower-calculator">Horsepower Calculator</Link>
        </li>
      </ul>

      <h2
        id="eh-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...ENGINE_HOURS_FAQS]} />
      </div>
    </article>
  );
}
