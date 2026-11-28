import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GVWR_FAQS } from './content';

export function GvwrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GVWR Calculator – Gross Vehicle Weight Rating Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate loaded vehicle weight from tare and payload, then compare it
        with the manufacturer&apos;s GVWR to check remaining capacity,
        utilization, and overload. This tool never invents an official GVWR from
        tare + payload.
      </p>

      <h2
        id="what-is-gvwr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is GVWR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross Vehicle Weight Rating is the manufacturer&apos;s maximum
        permissible weight of the vehicle when loaded, as shown on the
        certification label.
      </p>

      <h2
        id="what-is-gvw"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Gross Vehicle Weight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Gross vehicle weight (GVW) is the actual or estimated mass of the
        vehicle as loaded — not the rating limit.
      </p>

      <h2
        id="gvwr-vs-gvw"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR vs. Gross Vehicle Weight
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GVW answers “how heavy is it now?” GVWR answers “how heavy is it allowed
        to be?” Stay at or below GVWR and still check axle and tire ratings.
      </p>

      <h2
        id="tare"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Vehicle Tare Weight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tare weight is the unloaded vehicle under a defined weighing convention.
        Fuel, fluids, and equipment rules can differ by industry and region.
      </p>

      <h2
        id="curb"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Vehicle Curb Weight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Curb weight usually includes standard equipment and fluids without
        passengers or cargo. Treat it as related to, not always identical to,
        tare.
      </p>

      <h2
        id="payload"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Vehicle Payload?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payload covers people, cargo, luggage, tools, and other carried mass —
        and tongue weight on a tow vehicle when applicable.
      </p>

      <h2
        id="how-gvw"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gross Vehicle Weight
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Gross vehicle weight = Tare weight + Payload
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 1,000 kg tare + 500 kg payload = 1,500 kg estimated GVW.
      </p>

      <h2
        id="how-check"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Check Your Vehicle Against GVWR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the labeled GVWR and compare it with measured or estimated GVW.
        Remaining capacity = GVWR − GVW.
      </p>

      <h2
        id="max-payload"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Maximum Payload
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Maximum payload ≈ GVWR − Unloaded weight
      </p>

      <h2
        id="remaining"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Remaining Vehicle Capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: GVWR 2,500 kg and GVW 2,100 kg leave 400 kg remaining (~84%
        utilization). Under GVWR is not automatically safe for every axle or
        tire.
      </p>

      <h2
        id="exceed"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens if a Vehicle Exceeds GVWR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Excess mass can lengthen stopping distance, raise tire and chassis
        stress, and create compliance issues. Unload before operating.
      </p>

      <h2
        id="gcwr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR vs. GCWR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GCWR rates the combined tow vehicle and trailer (loaded) per the
        manufacturer — separate from each unit&apos;s GVWR.
      </p>

      <h2
        id="gawr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR vs. GAWR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GAWR limits load on a specific axle. Front/rear distribution can violate
        GAWR while total weight remains under GVWR.
      </p>

      <h2
        id="towing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR vs. Towing Capacity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Towing capacity is not GVWR. Respect hitch, GCWR, tongue weight, and
        trailer GVWR as separate limits.
      </p>

      <h2
        id="tongue"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Does Trailer Tongue Weight Count Toward GVWR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tongue weight on the hitch adds to the tow vehicle&apos;s loaded mass
        and therefore toward its GVWR budget.
      </p>

      <h2
        id="pickups"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR for Pickup Trucks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bed cargo, passengers, fuel, and accessories all share payload. Bed
        capacity stickers do not replace GVWR or GAWR.
      </p>

      <h2
        id="suvs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR for SUVs and Cars
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Full passenger loads plus luggage and roof cargo can consume payload
        quickly on lighter passenger vehicles.
      </p>

      <h2
        id="commercial"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR for Commercial Trucks
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Commercial operations may face additional licensing and weight rules
        beyond the manufacturer rating. This calculator is educational only.
      </p>

      <h2
        id="trailers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        GVWR for Trailers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trailers carry their own GVWR. Cargo must respect trailer GVWR and axle
        ratings separately from the tow vehicle.
      </p>

      <h2
        id="find-gvwr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Find Your Vehicle&apos;s GVWR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Check the door-jamb certification label, VIN plate documentation, or
        the owner&apos;s manual. Do not guess from marketing payload slogans
        alone.
      </p>

      <h2
        id="measure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Measure Actual Vehicle Weight
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use a certified scale with the vehicle loaded as driven. Axle-by-axle
        weights help verify GAWR as well as total GVW.
      </p>

      <h2
        id="safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why GVWR Matters for Road Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Staying within rated mass supports predictable braking, steering, and
        tire performance. Pair GVWR checks with tire pressures and load indexes.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/horsepower-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Horsepower Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/fuel-cost-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Fuel Cost Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/gas-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gas Calculator
        </Link>{' '}
        when available in the catalog.
      </p>

      <h2
        id="gvwr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...GVWR_FAQS]} />
      </div>
    </article>
  );
}
