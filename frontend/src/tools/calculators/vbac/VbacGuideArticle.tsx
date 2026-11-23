import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VBAC_FAQS } from './content';
import { COEFFICIENTS, MODEL_VERSION } from './calculation';

export function VbacGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        VBAC Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the probability of successful vaginal birth after cesarean (VBAC)
        when counseling about trial of labor after cesarean (TOLAC). The
        calculator implements the published MFMU Network race-neutral logistic
        model — educational only, not a delivery plan.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Model Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Among people with one prior low-transverse cesarean who attempt TOLAC
        with a vertex singleton at term, the model returns an individualized
        predicted chance of VBAC based on history and anthropometrics available
        early in pregnancy.
      </p>

      <h2
        id="race-neutral"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Race-Neutral Update
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An earlier widely distributed calculator included race/ethnicity
        categories. The MFMU re-derived the model without those variables while
        preserving calibration and discrimination similar to the prior tool (
        {MODEL_VERSION}). Omega Calculators uses only this validated
        race-neutral equation — not legacy ethnicity fields.
      </p>

      <h2
        id="predictors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Model Predictors
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Maternal age (years)</li>
        <li>Pre-pregnancy weight (kg) — not delivery weight</li>
        <li>Height (cm)</li>
        <li>Arrest disorder indication for the prior cesarean (yes/no)</li>
        <li>
          Prior vaginal birth history: none; vaginal delivery only before the
          cesarean; or prior VBAC
        </li>
        <li>Medication-treated chronic hypertension (yes/no)</li>
      </ul>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Logistic Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Linear predictor w = β₀ + Σβᵢxᵢ; probability (%) = 100 × e<sup>w</sup> /
        (1 + e<sup>w</sup>). Published coefficients on the overall analytic
        cohort:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-xs text-foreground/90 sm:text-sm">
        <li>β₀ (intercept): {COEFFICIENTS.intercept}</li>
        <li>Age per year: {COEFFICIENTS.agePerYear}</li>
        <li>Pre-pregnancy weight per kg: {COEFFICIENTS.prePregnancyWeightPerKg}</li>
        <li>Height per cm: {COEFFICIENTS.heightPerCm}</li>
        <li>Arrest indication (1=yes): {COEFFICIENTS.arrestIndication}</li>
        <li>Vaginal birth before cesarean only (1=yes):{' '}
          {COEFFICIENTS.vaginalBeforePriorCesarean}</li>
        <li>Prior VBAC (1=yes): {COEFFICIENTS.priorVbac}</li>
        <li>Treated chronic hypertension (1=yes):{' '}
          {COEFFICIENTS.treatedChronicHypertension}</li>
      </ul>

      <h2
        id="departure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Legacy Screenshot Differences
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Reference screenshots may show ethnicity radios and a single
        pre-pregnancy BMI checkbox. Those inputs belong to an older race-based
        tool. This implementation deliberately omits ethnicity, collects
        weight and height separately per the 2021 model, distinguishes prior
        VBAC from vaginal birth before the cesarean, and includes treated
        chronic hypertension. A separate{' '}
        <strong>2024 admission-time</strong> race-neutral model adds cervical
        exam findings — it is not mixed here.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age, height, and pre-pregnancy weight.</li>
        <li>Answer obstetric history and hypertension items.</li>
        <li>
          Read the predicted VBAC probability (%) and model log-odds (w). No
          score cutoff hides or blocks the result.
        </li>
        <li>
          Share only the public page URL — not the typed clinical details.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Paper Table 3 example 7: age 30, weight 71 kg, height 156 cm, no arrest
        indication, no prior vaginal birth, no treated hypertension → about{' '}
        <strong>59.4%</strong> predicted VBAC. Load the in-calculator example to
        reproduce it.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Eligibility and Limits
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Training population: one prior low-transverse cesarean, TOLAC, vertex
          singleton ≥37 weeks (MFMU Cesarean Registry).
        </li>
        <li>Does not apply to prior classical incision or prior myomectomy.</li>
        <li>
          Does not incorporate cervical dilation, effacement, or other
          admission-only variables.
        </li>
        <li>
          Probability estimates support counseling — they do not mandate mode of
          delivery or replace shared decision-making.
        </li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/bishop-score-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Bishop Score Calculator
          </Link>{' '}
          — cervical favorability (separate educational score).
        </li>
        <li>
          <Link
            href="/tools/vte-risk-score-calculator-in-pregnancy"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            VTE Risk Score in Pregnancy
          </Link>{' '}
          — thrombosis risk factors (different guideline).
        </li>
      </ul>

      <h2
        id="vbac-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={VBAC_FAQS} />
      </div>
    </article>
  );
}