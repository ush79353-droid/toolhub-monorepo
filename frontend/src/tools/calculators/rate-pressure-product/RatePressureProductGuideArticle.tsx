import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RATE_PRESSURE_PRODUCT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function RatePressureProductGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Rate Pressure Product Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter maximum heart rate and maximum systolic blood pressure to compute
        the rate-pressure product (double product). Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How RPP Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: 150 beats/min × 160 mmHg = 24,000 bpm·mmHg.
      </p>

      <h2
        id="exercise"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Exercise Measurement Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        During graded exercise testing, HR and SBP rise together. Pairing values
        from the same workload gives a stage-specific double product used in
        physiology teaching and historical exercise research as a correlate of
        myocardial oxygen demand—not a stand-alone diagnosis.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool does not interpret ischemia, prescribe exercise limits, or
        replace supervised stress testing. Negative, zero, or non-finite inputs
        are rejected. Results are not medical advice.
      </p>

      <div id="rpp-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...RATE_PRESSURE_PRODUCT_FAQS]} />
        </div>
      </div>
    </article>
  );
}
