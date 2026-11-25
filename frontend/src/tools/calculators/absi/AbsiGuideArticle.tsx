import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ABSI_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AbsiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        ABSI Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate A Body Shape Index (ABSI) from sex, age, height, weight, and
        waist circumference. ABSI expresses waist size relative to height and
        BMI so body shape can be compared across people with different body
        mass. This worksheet is educational only — not a diagnosis or
        individual mortality prediction.
      </p>
      <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground sm:text-base">
        Not a replacement for professional medical assessment.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        A Body Shape Index formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: female, 30 years, 170 cm, 65 kg, waist 80 cm →
        BMI ≈ 22.49, ABSI ≈ 0.07701.
      </p>

      <h2
        id="z-score"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ABSI z-score
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The z-score standardizes ABSI against NHANES 1999–2004 age- and
        sex-specific smoothed means and standard deviations (Table S1). Entering
        ABSI equal to the reference mean yields a z-score of 0. Ages 85 and
        older use the age-85 sample mean and SD from the same table.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use this calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose sex, enter age in years, then height, weight, and waist with the
        unit menus. Results update when inputs are valid and clear when a
        required anthropometric field is erased. Unit changes preserve the
        physical quantity. Share copies only the public calculator URL.
      </p>

      <div id="absi-faq" className="not-prose mt-8">
        <FAQAccordion items={ABSI_FAQS} />
      </div>
    </article>
  );
}
