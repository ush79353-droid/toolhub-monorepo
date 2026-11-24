import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DLBCL_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function DiffuseLargeBCellLymphomaPrognosisGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">Diffuse Large B-cell Lymphoma Prognosis</h2>
      <p className="mt-3 text-sm">{SOURCE_LABEL}</p>
      <h2 id="outcomes" className="mt-8 text-lg font-bold text-accent">4-year outcomes</h2>
      <p className="mt-3 text-sm">Five binary risk factors (0–5 points) map to published progression-free and overall survival percentages.</p>
      <div className="mt-8">
        <FAQAccordion items={[...DLBCL_FAQS]} />
      </div>
    </article>
  );
}