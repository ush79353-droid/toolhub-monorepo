import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TCC_FAQS } from './content';

export function TeslaChargingCostGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Tesla Charging Cost Calculator – Estimate EV Charging Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the electricity cost to charge a Tesla and the energy cost of a
        trip. Use illustrative model presets or enter custom usable capacity and
        efficiency. Currency selection changes denomination only — enter your
        tariff already in that currency.
      </p>

      <h2 id="how-much" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Does It Cost to Charge a Tesla?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For an ideal full recharge of usable capacity, multiply battery kWh by
        price per kWh. Real sessions also depend on start/end SOC and charging
        losses.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tesla Charging Cost Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        C = B × P
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Tesla Charging Cost
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter usable battery capacity in kWh.</li>
        <li>Enter your electricity price per kWh.</li>
        <li>Read the ideal full-charge cost; open Advanced for SOC windows and η.</li>
      </ol>

      <h2 id="full-example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Example: Full Battery Charging Cost
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        60 kWh × 0.25 = 15.00 currency units (ideal).
      </p>

      <h2 id="driving" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate the Cost of Driving a Tesla
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiply distance by energy use, then by electricity price.
      </p>

      <h2 id="drive-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tesla Driving Electricity Cost Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Cd = D × R × P / 100
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When R is kWh/100 km. Example: 200 km × 21.75 × 0.25 / 100 = 10.875 →
        about 10.88 displayed.
      </p>

      <h2 id="per-km" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tesla Charging Cost per Kilometer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost/km = (kWh/100 km × price) / 100.
      </p>

      <h2 id="per-mi" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tesla Charging Cost per Mile
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert efficiency to kWh/mi (or invert mi/kWh), then multiply by price.
      </p>

      <h2 id="factors" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Affects Tesla Charging Costs?
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Electricity tariff and time-of-use periods</li>
        <li>Usable battery capacity and SOC window</li>
        <li>Charging efficiency / losses</li>
        <li>Vehicle efficiency and driving conditions</li>
        <li>Weather, speed, and location fees</li>
      </ul>

      <h2 id="home-vs-sc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Home Charging vs. Supercharging
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Home AC rates are often lower per kWh; DC public charging can be faster
        but pricier and may include idle fees. This tool does not load live
        Supercharger prices.
      </p>

      <h2 id="capacity" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Tesla Battery Capacity?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal pack size can exceed usable capacity. Cost estimates should use
        usable kWh.
      </p>

      <h2 id="efficiency" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is EV Charging Efficiency?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The share of meter energy stored in the battery. Advanced mode divides
        added pack energy by η to estimate grid draw.
      </p>

      <h2 id="kwh100" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Much Energy Does a Tesla Use per 100 km?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It varies widely. Presets are labeled estimates; trip computer averages
        are better for personal planning.
      </p>

      <h2 id="soc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does Battery Level Affect Charging Cost?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cost scales with the SOC fraction charged. The chart shows cumulative
        electricity cost versus battery level for your capacity and tariff — not
        charging speed.
      </p>

      <h2 id="reduce" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Reduce Tesla Charging Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer off-peak home rates, moderate highway speeds, precondition while
        plugged in when useful, and avoid unnecessary high-price DC sessions.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Tesla Charging Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Efficiency and η vary; tariffs and fees vary; presets are not certified
        OEM data. Charging cost is not charging duration or power curve.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/fuel-cost-calculator" className="text-primary underline-offset-2 hover:underline">
            Fuel Cost Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/mpg-calculator" className="text-primary underline-offset-2 hover:underline">
            MPG Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/speed-calculator" className="text-primary underline-offset-2 hover:underline">
            Speed Calculator
          </Link>
        </li>
      </ul>

      <h2 id="tcc-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TCC_FAQS]} />
      </div>
    </article>
  );
}
