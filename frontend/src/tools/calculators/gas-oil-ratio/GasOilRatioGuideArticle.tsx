import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GAS_OIL_FAQS } from './content';

export function GasOilRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gas Oil Ratio Calculator – Two-Stroke Fuel Mix Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Calculate how much two-stroke oil to add to gasoline, how much gas you
        need for a known oil volume, what ratio you already mixed, or how to
        split a desired total premix. Always follow your engine
        manufacturer&apos;s recommended ratio and oil type.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Gas-to-Oil Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is a volume-to-volume statement of gasoline parts per one part of
        two-stroke oil. A 50:1 mix means fifty equal volume parts of gas for
        each part of oil.
      </p>

      <h2
        id="two-vs-four"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Two-Stroke vs. Four-Stroke Engines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many small two-stroke engines lubricate by burning oil mixed into the
        fuel. Four-stroke engines usually keep crankcase oil separate and run on
        straight gasoline unless the manual says otherwise.
      </p>

      <h2
        id="why-mix"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Do Two-Stroke Engines Need Oil Mixed With Gas?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Premix oil coats moving parts as the fuel-air charge moves through the
        crankcase. Too little oil risks damage; too much can foul plugs and
        leave deposits.
      </p>

      <h2
        id="50-1"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Does a 50:1 Gas Oil Ratio Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For every 50 units of gasoline, add 1 unit of oil. Example: 5 L of gas
        needs 100 mL of oil. That does not mean every engine should use 50:1.
      </p>

      <h2
        id="how-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Gas-to-Oil Ratio
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Ratio = GasVolume / OilVolume (same units)
      </p>

      <h2
        id="oil-requirements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Two-Stroke Oil Requirements
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        OilVolume = GasVolume / Ratio
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert both to milliliters (or another shared unit) before dividing.
        For a fixed total premix volume use Oil = Total / (Ratio + 1) instead.
      </p>

      <h2
        id="one-liter"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Oil Do I Add to 1 Liter of Gas?
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>25:1 → 40 mL</li>
        <li>32:1 → 31.25 mL</li>
        <li>40:1 → 25 mL</li>
        <li>50:1 → 20 mL</li>
      </ul>

      <h2
        id="five-liters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Oil Do I Add to 5 Liters of Gas?
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>25:1 → 200 mL</li>
        <li>32:1 → 156.25 mL</li>
        <li>40:1 → 125 mL</li>
        <li>50:1 → 100 mL</li>
      </ul>

      <h2
        id="one-gallon"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Much Oil Do I Add to 1 Gallon of Gas?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Using a US gallon (128 US fl oz): 50:1 → 2.56 fl oz; 40:1 → 3.2 fl oz;
        32:1 → 4 fl oz; 25:1 → 5.12 fl oz. Imperial gallons differ — do not mix
        unit systems.
      </p>

      <h2
        id="chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas-to-Oil Ratio Mixing Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The interactive chart in the calculator shows oil to add for common
        gasoline volumes at 25:1, 32:1, 40:1, and 50:1 in metric or US units.
      </p>

      <h2
        id="common-ratios"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Two-Stroke Fuel Mixture Ratios
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        25:1, 32:1, 40:1, and 50:1 appear often in manuals, but none is
        universally correct. Older equipment and some oils specify richer mixes.
      </p>

      <h2
        id="how-to-mix"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Mix Gas and Oil Correctly
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use fresh fuel, measure oil accurately, pour into an approved fuel can,
        add gasoline, and shake to disperse. Mix outdoors or with good
        ventilation away from ignition sources.
      </p>

      <h2
        id="too-much"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens If There Is Too Much Oil?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Excess oil can cause smoking, plug fouling, and carbon buildup. Still
        avoid running leaner than the manufacturer allows.
      </p>

      <h2
        id="too-little"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens If There Is Too Little Oil?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insufficient lubrication can overheat and score bearings and pistons —
        a common cause of two-stroke failure.
      </p>

      <h2
        id="universal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Can I Use the Same Fuel Ratio for Every Two-Stroke Engine?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No. Ratios depend on engine design, oil specification, and operating
        conditions. Read the plate or manual for each machine.
      </p>

      <h2
        id="chainsaws"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Oil Ratio for Chainsaws
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many saws specify 50:1 with listed oils, but verify your model —
        especially older saws that may require richer mixes.
      </p>

      <h2
        id="trimmers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Oil Ratio for Trimmers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        String trimmers commonly list 40:1 or 50:1. Use the ratio and oil grade
        printed for your trimmer.
      </p>

      <h2
        id="blowers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Oil Ratio for Leaf Blowers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Blowers vary by brand and generation. Confirm premix versus
        four-stroke/backpack designs before mixing.
      </p>

      <h2
        id="motorcycles"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Oil Ratio for Motorcycles
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Premix bikes need the ratio in the handbook. Oil-injection bikes meter
        oil separately — do not assume tank premix unless specified.
      </p>

      <h2
        id="outboards"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gas Oil Ratio for Outboard Motors
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Older outboards may require premix; many newer units use oil injection.
        Marine oils (for example TC-W3 where required) matter as much as the
        ratio.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Gas-to-Oil Mixing Mistakes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mixing US and imperial ounces, treating total premix volume like
        gasoline-only volume, guessing a ratio, and using four-stroke motor oil
        are frequent errors.
      </p>

      <h2
        id="safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Safety Guidance
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>Follow the manufacturer&apos;s ratio and approved two-stroke oil.</li>
        <li>Do not treat 50:1 as universal.</li>
        <li>Mix away from ignition sources in approved containers.</li>
        <li>Ventilate when mixing; follow local fuel storage rules.</li>
        <li>
          This calculator provides mathematical estimates only — it does not
          replace product instructions.
        </li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        See{' '}
        <Link
          href="/tools/gas-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gas Calculator
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
          href="/tools/fuel-pump-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Fuel Pump Calculator
        </Link>{' '}
        when available in the catalog.
      </p>

      <h2
        id="gor-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...GAS_OIL_FAQS]} />
      </div>
    </article>
  );
}
