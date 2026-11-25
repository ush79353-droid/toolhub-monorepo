import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCLAIMER, SOURCE_NOTE, TIDAL_VOLUME_FAQS } from './content';

export function TidalVolumeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Tidal Volume Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This educational worksheet estimates a protective tidal-volume band from
        Devine ideal body weight and an Ideal endotracheal tube (ETT) insertion
        depth from stature using the Chula formula. It does not replace bedside
        confirmation or ordered ventilator settings.
      </p>

      <h2
        id="ett-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ETT — EndoTracheal Tube use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An endotracheal tube supports mechanical ventilation and airway
        protection when clinicians decide intubation is required. Tube size and
        depth must be verified clinically (including auscultation and imaging
        when indicated). This page does not provide procedural instructions.
      </p>

      <h2
        id="ett-characteristics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Endotracheal tube characteristics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adult Ideal ETT depth here follows the Chula estimate from the right
        upper canine: depth (cm) = 0.1 × height (cm) + 4. Pediatric age-based
        tube size estimates belong on the separate Endotracheal Tube Size
        Calculator.
      </p>

      <h2
        id="tidal-volume-definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Tidal volume definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tidal volume is the volume of air moved with each quiet breath. Many
        educational protective-ventilation worksheets use about 6–8 mL per
        kilogram of ideal body weight rather than actual body weight.
      </p>

      <h2
        id="how-calculated"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How this calculator works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: a female patient 167 cm tall has Chula depth 20.7
        cm and Devine IBW ≈ 58.7 kg, so a 6–8 mL/kg band is about 352–470 mL.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {DISCLAIMER}
      </p>

      <div id="tidal-volume-faq" className="not-prose mt-8">
        <FAQAccordion items={TIDAL_VOLUME_FAQS} />
      </div>
    </article>
  );
}
