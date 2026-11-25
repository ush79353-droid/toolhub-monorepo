import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PSA_DENSITY_FAQS, SOURCE_LABEL } from './content';

export function PsaDensityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="prostate-cancer-bph"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Prostate cancer and benign prostatic hyperplasia
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Elevated serum PSA can appear in prostate cancer, benign prostatic
        hyperplasia, prostatitis, and after manipulation. PSA density adjusts
        total PSA for gland size so a large benign gland is not judged only by
        the raw PSA number.
      </p>

      <h2
        id="what-is-psa"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is PSA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prostate-specific antigen (PSA) is a kallikrein-related serine protease
        measured in blood as ng/mL. It is organ-specific, not cancer-specific.
        Interpretation belongs with clinical context and specialist follow-up.
      </p>

      <h2
        id="psa-density-calculator"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PSA density calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This worksheet divides serum PSA by estimated prostate volume in cc.
        Enter length, width, and height for ellipsoid volume, or type volume
        directly when imaging already reported it.
      </p>

      <h2
        id="prostate-size"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Prostate size calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Volume uses the prolate ellipsoid formula V = L × W × H × (π/6) with
        dimensions in centimeters. One cc equals one mL. Other geometric models
        exist clinically; this tool matches the standard ellipsoid worksheet
        shown in the reference.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate PSA density and its meaning
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PSA density = PSA (ng/mL) ÷ prostate volume (cc). The result is a
        dimensionless ratio often labeled ng/mL² in teaching tools (PSA per unit
        volume). Research has discussed density cutoffs in biopsy decisions; this
        calculator does not apply those labels or diagnose cancer.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="psa-density-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...PSA_DENSITY_FAQS]} />
      </div>
    </article>
  );
}