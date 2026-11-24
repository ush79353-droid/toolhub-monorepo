import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALBUMIN_CREATININE_RATIO_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AlbuminCreatinineRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Albumin Creatinine Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter urine albumin (mg/dL) and urine creatinine to estimate the
        albumin-to-creatinine ratio (ACR) in mg/g. This is an educational
        worksheet — not a laboratory report or CKD diagnosis.
      </p>

      <h2
        id="definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Urine albumin creatinine ratio definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ACR (also called UACR) divides urine albumin by urine creatinine from
        the same spot sample so concentration is normalized. A first-morning
        void is preferred when available; a random office sample is often used
        when it is not.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How ACR is calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: albumin 8 mg/dL and creatinine 110 mg/dL
        (0.11 g/dL) → ACR = 8 ÷ 0.11 = 72.7 mg/g.
      </p>

      <h2
        id="ckd-bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CKD albuminuria categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teaching bands often map ACR to KDIGO albuminuria categories: A1 &lt;30
        mg/g (normal to mildly increased), A2 30–300 mg/g (moderately
        increased), and A3 &gt;300 mg/g (severely increased). Full CKD staging
        also uses GFR and clinical context.
      </p>

      <div id="acr-faq" className="not-prose mt-8">
        <FAQAccordion items={ALBUMIN_CREATININE_RATIO_FAQS} />
      </div>
    </article>
  );
}
