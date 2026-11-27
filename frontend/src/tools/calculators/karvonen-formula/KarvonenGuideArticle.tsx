import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { KARVONEN_FAQS } from './content';

export function KarvonenGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Karvonen Formula Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate target heart rate and heart rate reserve with the Karvonen
        method. Educational only — not an exercise prescription or medical
        device.
      </p>

      <h2
        id="why-target"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why do we need the target heart rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Target heart rate expresses how hard the heart is working relative to
        resting and maximum rates. It helps describe training intensity bands in
        teaching materials; personal goals still need clinical or coaching
        context.
      </p>

      <h2
        id="how-target"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do I calculate target heart rate using the Karvonen formula?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        THR = resting HR + (intensity/100) × (maximum HR − resting HR). Heart
        rate reserve is maximum HR minus resting HR. Example: resting 60 bpm,
        maximum 180 bpm, intensity 70% → reserve 120 bpm and target 144 bpm.
      </p>

      <h2
        id="how-max"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do I calculate Karvonen formula for maximum heart rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When maximum HR is unknown, this worksheet uses the classic Fox estimate
        maximum HR = 220 − age (years). Age-predicted maxima can be off by about
        10–12 bpm and are not a substitute for a measured peak when one is
        available.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use this Karvonen formula calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter resting heart rate, choose whether you know maximum HR (or enter
        age for the 220 − age estimate), set intensity percent, and read target
        heart rate plus heart rate reserve. Share copies only the public page
        URL — heart-rate values stay in your browser.
      </p>

      <div id="karvonen-faq" className="not-prose mt-8">
        <FAQAccordion items={KARVONEN_FAQS} />
      </div>
    </article>
  );
}
