import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DIET_RISK_FAQS } from './content';
import { MAX_SCORE, SOURCE_LABEL } from './calculation';

export function DietRiskScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">Diet Risk Score Calculator</h2>
      <p className="mt-3 text-sm">{SOURCE_LABEL}</p>
      <h2 id="scoring" className="mt-8 text-lg font-bold text-accent">Scoring</h2>
      <p className="mt-3 text-sm">Sum nine item scores (max {MAX_SCORE}). Protective foods score higher when intake is lower.</p>
      <div className="mt-8">
        <FAQAccordion items={[...DIET_RISK_FAQS]} />
      </div>
    </article>
  );
}