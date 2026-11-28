import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FLIGHT_RAD_FAQS } from './content';

export function FlightRadiationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Flight Radiation Calculator – Estimate Cosmic Radiation Exposure While
        Flying
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate cosmic radiation dose during air travel from flight duration
        and an average dose rate. Results are educational estimates under stated
        assumptions — not personalized medical risk predictions or replacements
        for validated aviation dosimetry.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Flight Radiation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “Flight radiation” refers mainly to cosmic ionizing radiation at
        aircraft altitudes. Secondary particles produced in the atmosphere
        contribute to the effective dose passengers and crew receive during a
        flight.
      </p>

      <h2
        id="why-increases"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Does Radiation Exposure Increase During Flights?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        At cruising altitude there is less atmosphere overhead to attenuate
        cosmic radiation. Latitude and solar conditions further change the
        rate. Ground-level natural background remains separate from this
        short-duration flight increment.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Flight Radiation Exposure
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter flight time and an average dose rate, then read the estimated
        dose. Optionally multiply by a whole number of identical flights for a
        cumulative estimate. Always keep the dose-rate assumption visible.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Flight Radiation Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Dose = Dose Rate × Flight Time
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With compatible units: mSv = (mSv/h) × h. Optionally: Total = Dose per
        flight × Number of flights.
      </p>

      <h2
        id="dose-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Radiation Dose Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dose rate is dose per unit time. A constant cruise average simplifies a
        path that actually changes along the route. The calculator default
        0.003 mSv/h (3 µSv/h) is illustrative only.
      </p>

      <h2
        id="microsievert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Microsievert?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        1 mSv = 1,000 µSv
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The microsievert (µSv) is a convenient subunit of the sievert for small
        flight doses.
      </p>

      <h2
        id="millisievert"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Millisievert?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The millisievert (mSv) is widely used in radiation protection when
        discussing annual or occupational exposures. Do not confuse sievert
        quantities with absorbed dose in gray (Gy).
      </p>

      <h2
        id="how-much"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Radiation Do You Receive During a Flight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exposure varies by route and conditions. Agencies such as the FAA, CDC,
        EPA, IAEA, UNSCEAR, and ICRP publish context on cosmic radiation and
        aviation — verify figures against primary sources before citing them as
        personal limits.
      </p>

      <h2
        id="short-flights"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Radiation Exposure During Short Flights
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example (illustrative 0.003 mSv/h): 3 h → 0.009 mSv (9 µSv). Climb and
        descent share of short flights can change the true average rate.
      </p>

      <h2
        id="long-haul"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Radiation Exposure During Long-Haul Flights
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example (same illustrative rate): 8 h → 0.024 mSv; 12 h → 0.036 mSv.
        Polar long-haul routes may warrant a higher rate assumption than
        equatorial ones.
      </p>

      <h2
        id="altitude"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Flight Altitude Affect Radiation Exposure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher altitudes generally increase cosmic radiation intensity. This
        tool does not invent an altitude-to-dose formula; adjust the dose rate
        from a validated source when altitude-specific estimates are required.
      </p>

      <h2
        id="latitude"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Flight Latitude Affect Radiation Exposure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Geomagnetic shielding is typically stronger near the equator. Higher
        geomagnetic latitudes often correspond to higher cosmic radiation rates
        at a given altitude.
      </p>

      <h2
        id="solar"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Solar Activity Affect Flight Radiation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Solar particle events and the solar cycle can elevate exposure,
        especially on polar routes. Operational aviation guidance addresses rare
        high-flux events separately from routine cruise averages.
      </p>

      <h2
        id="frequent"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Radiation Exposure for Frequent Flyers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cumulative dose scales with flying hours at a given average rate. Use
        the optional flight count only for identical-assumption scenarios, and
        treat totals as estimates.
      </p>

      <h2
        id="crew"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Radiation Exposure for Pilots and Cabin Crew
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many regulators treat aircrew as occupationally exposed and require
        monitoring frameworks. Airline programs and validated computational
        codes — not this educational calculator — support compliance.
      </p>

      <h2
        id="medical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cosmic Radiation vs. Medical Radiation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Medical imaging doses are procedure-specific and reported under clinical
        protocols. Cosmic flight doses accumulate over hours at altitude.
        Compare only with cited sources and matching dose quantities
        (effective vs. absorbed).
      </p>

      <h2
        id="pregnancy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Is Flying During Pregnancy Associated With Radiation Exposure?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cosmic radiation is one of several aviation considerations discussed in
        public-health and aviation guidance. Individual advice must come from a
        qualified healthcare professional — this calculator does not provide
        medical clearance.
      </p>

      <h2
        id="accuracy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Accurate Is a Flight Radiation Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Accuracy tracks the quality of the dose-rate input. A constant-rate
        model cannot capture route structure, solar events, or aircraft-specific
        profiles.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Flight Radiation Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool intentionally omits invented altitude/latitude formulas.
        Validated scientific models or documented data are required for
        route-specific predictions. Results are estimates for education and
        planning context only.
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
          <Link href="/tools/engine-hours-to-miles-converter">
            Engine Hours to Miles Converter
          </Link>
        </li>
        <li>
          <Link href="/tools/boat-speed-calculator">Boat Speed Calculator</Link>
        </li>
      </ul>

      <h2
        id="fr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...FLIGHT_RAD_FAQS]} />
      </div>
    </article>
  );
}
