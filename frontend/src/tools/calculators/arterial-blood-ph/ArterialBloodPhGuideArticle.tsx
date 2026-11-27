import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ARTERIAL_BLOOD_PH_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function ArterialBloodPhGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Arterial Blood pH Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate arterial blood pH from bicarbonate and PaCO₂ using the
        Henderson–Hasselbalch equation. Educational only — not a laboratory ABG
        report.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is arterial blood gas?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Arterial blood gas analysis measures pH, PaCO₂, and related values to
        describe acid–base status. This worksheet focuses on the calculated pH
        from HCO₃ and PaCO₂.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Henderson–Hasselbalch equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HCO₃ 24 mEq/L and PaCO₂ 40 mmHg → pH ≈ 7.39.
      </p>

      <div id="abph-faq" className="not-prose mt-8">
        <FAQAccordion items={ARTERIAL_BLOOD_PH_FAQS} />
      </div>
    </article>
  );
}
