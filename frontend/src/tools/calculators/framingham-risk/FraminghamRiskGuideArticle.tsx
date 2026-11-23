import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FRAMINGHAM_RISK_FAQS } from './content';
import { MAX_AGE, MIN_AGE, SOURCE_LABEL } from './calculation';

export function FraminghamRiskGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Framingham Risk Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter age, sex, blood pressure treatment, systolic BP, total and HDL
        cholesterol, and smoking to see the ATP III Framingham hard coronary
        heart disease point total. This tool is educational only and does not
        replace clinical cardiovascular risk assessment.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Framingham Point Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Framingham Heart Study published point scores to estimate 10-year
        risk of <strong>hard CHD</strong> — myocardial infarction or coronary
        death — for adults without known coronary disease. Adult Treatment Panel
        III (ATP III) adopted these tables for clinical education and lipid
        management discussions. This calculator reports the summed point total
        in <strong>pts</strong>, matching consumer tools that emphasize points
        over a separate risk dashboard.
      </p>

      <h2
        id="inputs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inputs on This Page
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Age</strong> — whole years, {MIN_AGE}–{MAX_AGE} for ATP III
          point bands.
        </li>
        <li>
          <strong>Sex</strong> — separate men&apos;s and women&apos;s tables.
        </li>
        <li>
          <strong>Blood pressure treatment</strong> — treated vs untreated
          systolic BP columns.
        </li>
        <li>
          <strong>Systolic BP</strong> — mmHg.
        </li>
        <li>
          <strong>Total and HDL cholesterol</strong> — mg/dL or mmol/L (× 38.67
          to mg/dL internally).
        </li>
        <li>
          <strong>Smoker</strong> — current cigarette use adds age-band points.
        </li>
      </ul>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Points Are Summed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Points = age + total cholesterol (age-band table) + HDL + systolic BP
        (treatment-specific) + smoking (0 if nonsmoker). Young adults can have
        negative age points (for example −9 for men 20–34). HDL uses the same
        bands for both sexes (≥60 mg/dL = −1 point).
      </p>

      <h2
        id="ten-year"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        10-Year Hard CHD Risk Tables
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ATP III publishes a mapping from total points to estimated 10-year hard
        CHD risk (%). When your form is complete, the calculator may mention
        that published mapping in explanation text under the pts output — for
        example, 7 pts in men aligns with about 3% in the published table. The
        UI does not add a separate percentage field to match screenshot parity.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age, systolic BP, total cholesterol, and HDL.</li>
        <li>Set sex, hypertension treatment, and smoking as appropriate.</li>
        <li>Read the Framingham risk score in pts at the bottom.</li>
        <li>Use Reload or Clear to reset; share copies the page URL only.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Man, 45 years, no BP treatment, systolic 130 mmHg, total cholesterol
        180 mg/dL, HDL 50 mg/dL, nonsmoker: age 3 + TC 3 + HDL 0 + SBP 1 + smoke
        0 = <strong>7 pts</strong> (ATP III tables associate about 3% 10-year
        hard CHD risk for men at 7 points).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Intended for adults {MIN_AGE}–{MAX_AGE} without diabetes or existing CHD
        in the original ATP III cohort description. Modern pooled cohort equations
        differ; do not use this pts total alone to start or stop therapy. Source:{' '}
        {SOURCE_LABEL}
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For other cardiovascular education tools on Omega Calculators, browse{' '}
        <Link href="/category/health" className="text-primary hover:underline">
          health calculators
        </Link>{' '}
        when available in the catalog.
      </p>

      <h2
        id="framingham-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...FRAMINGHAM_RISK_FAQS]} />
      </div>
    </article>
  );
}