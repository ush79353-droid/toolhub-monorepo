import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LIGHTS_CRITERIA_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function LightsCriteriaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How to use Light’s criteria calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter paired pleural and serum protein, pleural and serum LDH, and your
        laboratory’s serum LDH upper reference limit. The worksheet applies
        Light’s three strict inequalities. Exudate appears as soon as any one
        evaluable criterion is met; transudate appears only when all three can
        be assessed and none are met.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {SOURCE_NOTE}
      </p>

      <h2
        id="transudate-vs-exudate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pleural effusion — transudate vs exudate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Transudates reflect systemic pressure or oncotic imbalances (for
        example heart failure or hypoalbuminemia). Exudates reflect local
        pleural inflammation or impaired lymphatic drainage. Light’s criteria
        are a laboratory starting point, not a final etiology.
      </p>

      <h2
        id="differentiation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pleural effusion differentiation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Protein and LDH comparisons help separate hydrostatic from inflammatory
        fluids. Borderline equalities (ratio exactly 0.5 or 0.6, or LDH exactly
        ⅔×ULN) do not meet the classic exudate rule — this calculator uses
        strict greater-than cut-offs.
      </p>

      <h2
        id="causes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pleural effusion causes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common teaching examples include congestive heart failure and cirrhosis
        among transudates, and pneumonia, malignancy, and pulmonary embolism
        among exudates. Overlap and false positives occur — especially after
        diuresis.
      </p>

      <h2
        id="treatment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pleural effusion treatment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Management depends on cause, size, and symptoms — from treating heart
        failure to antibiotics, drainage, or oncology pathways. This page does
        not recommend therapy.
      </p>

      <h2
        id="patient-note"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        A note for the patient — why is there water in my lung?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fluid can collect between the lung and chest wall for many reasons.
        Laboratory Light’s criteria help clinicians describe the fluid type;
        they do not replace a clinician’s examination, imaging, or advice.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>

      <div id="lights-faq" className="not-prose mt-8">
        <FAQAccordion items={LIGHTS_CRITERIA_FAQS} />
      </div>
    </article>
  );
}
