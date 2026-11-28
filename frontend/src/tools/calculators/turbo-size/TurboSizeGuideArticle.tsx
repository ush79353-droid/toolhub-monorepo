import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TU_FAQS } from './content';

export function TurboSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Turbo Size Calculator – Estimate Turbocharger Airflow for Your Engine
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the compressor airflow a target horsepower implies, compute
        power density, and optionally derive advanced mass flow and pressure
        ratio. Results are sizing estimates — not exact turbo model picks.
      </p>

      <h2 id="what-turbo" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is a Turbocharger?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A turbocharger uses an exhaust-driven turbine to spin a compressor that
        raises intake air density, enabling more fuel and higher power potential.
      </p>

      <h2 id="how-works" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How Does a Turbocharger Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Exhaust energy spins the turbine; the shaft drives the compressor wheel,
        which packs air into the intake path (often through an intercooler).
      </p>

      <h2 id="what-size" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Does Turbo Size Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “Size” may mean wheel diameters, housings, or airflow capacity. Two
        inputs (displacement and hp) cannot uniquely determine every physical
        turbo dimension.
      </p>

      <h2 id="how-calc" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Calculate Turbo Size
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use a documented airflow heuristic, then refine with RPM, VE, pressures,
        and temperatures when available.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbo Size Calculator Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        ṁ_air ≈ HP / 10 &nbsp;·&nbsp; P_d = HP / V_L
      </p>
      <p className="mt-2 text-sm text-foreground/90">Labeled approximate heuristic.</p>

      <h2 id="how-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use the Turbo Size Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter displacement and target power.</li>
        <li>Optionally adjust the hp per lb/min factor.</li>
        <li>Open Advanced for RPM/VE/P/T estimates.</li>
        <li>Compare airflow and PR to a real compressor map.</li>
      </ol>

      <h2 id="example" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbo Sizing Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        2.0 L · 400 hp → ≈ 40 lb/min (≈ 18.14 kg/min) · 200 hp/L at C = 10.
      </p>

      <h2 id="any-engine" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Can You Turbocharge Any Engine?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider compression ratio, fueling, bottom-end strength, cooling, ECU
        control, and exhaust design before adding boost.
      </p>

      <h2 id="disp" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbocharger Size vs. Engine Displacement
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Similar displacements can need different turbos depending on RPM targets
        and power goals.
      </p>

      <h2 id="hp" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbocharger Size vs. Horsepower
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Power follows airflow, fuel energy, and efficiency — not boost gauge
        alone.
      </p>

      <h2 id="lag" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Turbo Lag?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Response delay before useful boost. Avoid equating lag solely with
        “bigger turbo.”
      </p>

      <h2 id="small-large" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Small Turbo vs. Large Turbo
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Trade response, peak airflow, efficiency islands, and operating range.
      </p>

      <h2 id="pr" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What Is Compressor Pressure Ratio?
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        PR = P_out,abs / P_in,abs
      </p>

      <h2 id="map" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Read a Turbocharger Compressor Map
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plot corrected airflow against PR; stay clear of surge and choke; favor
        efficient islands for your RPM band.
      </p>

      <h2 id="airflow" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Estimate Engine Airflow
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        V̇ = Vd × RPM × VE / 120 · ṁ = ρ × V̇
      </p>

      <h2 id="efficiency" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbocharger Efficiency
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lower compressor efficiency raises discharge temperature and can limit
        safe power for a given system.
      </p>

      <h2 id="factors" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Factors Affecting Turbocharger Selection
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>Displacement, target hp, RPM, VE</li>
        <li>Boost/PR, fuel, temps, compressor η</li>
        <li>Turbine sizing, backpressure, vehicle use</li>
      </ul>

      <h2 id="mistakes" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Common Turbo Sizing Mistakes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choosing only by advertised “supports XXX hp” without maps or engine
        operating points.
      </p>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Turbo Size Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Preliminary airflow sizing only. It does not replace compressor maps,
        engine-specific analysis, or professional tuning.
      </p>

      <h2 id="related" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
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
          <Link href="/tools/fuel-injector-calculator">
            Fuel Injector Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/rpm-calculator">RPM Calculator</Link>
        </li>
        <li>
          <Link href="/tools/bsfc-calculator">BSFC Calculator</Link>
        </li>
      </ul>

      <h2 id="tu-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...TU_FAQS]} />
      </div>
    </article>
  );
}
