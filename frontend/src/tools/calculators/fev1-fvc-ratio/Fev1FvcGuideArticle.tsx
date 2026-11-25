import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FEV1_FVC_FAQS, SOURCE_LABEL } from './content';

export function Fev1FvcGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        FEV1/FVC Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute the measured Tiffeneau index from FEV1 and FVC, or estimate a
        predicted FEV1/FVC ratio from published American (Hankinson/NHANES III)
        or European (Falaschetti/Health Survey for England) equations.
        Educational only.
      </p>

      <h2
        id="ratio-explained"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FEV1/FVC Ratio Explained
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FEV1 is the volume exhaled in the first second of a forced maneuver;
        FVC is the total forced vital capacity. Their ratio (also called the
        Tiffeneau index) helps frame airflow obstruction versus restriction in
        teaching discussions — it does not replace supervised spirometry.
      </p>

      <h2
        id="normal-values"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Normal Values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed teaching cut-offs such as 0.70 (or lower thresholds in older
        adults) appear in many COPD summaries. Age- and height-aware predicted
        ratios and lower limits of normal are preferred in modern interpretation
        guidelines; this calculator reports the predicted mean ratio only.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose Real ratio and enter FEV1 and FVC in liters or milliliters, or
        choose Prediction, pick the American or European cohort, and enter the
        demographics required by that equation set. Results update in the
        browser; share uses the public page URL only.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measured ratio (%) = 100 × FEV1 / FVC after converting both volumes to
        the same unit. Example: 3 L / 4 L → 75%.
      </p>

      <h2
        id="copd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Values in COPD
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GOLD teaching stages combine a reduced FEV1/FVC with FEV1 percent
        predicted bands. This tool does not stage COPD or compute FEV1 percent
        predicted from separate volume equations.
      </p>

      <h2
        id="predicted"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Predicted Values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        American mode uses Hankinson et al. age-and-ethnicity FEV1/FVC%
        equations. European mode uses Falaschetti et al. multiplicative
        ln(FEV1/FVC) equations with age and height for White English adults.
        The output is the predicted ratio (%), not “percent of predicted” of a
        measured ratio.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="fev1-fvc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FEV1_FVC_FAQS]} />
      </div>
    </article>
  );
}
