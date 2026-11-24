import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DIC_SYNDROME_FAQS } from './content';
import { OVERT_DIC_THRESHOLD, SOURCE_LABEL } from './calculation';

export function DicSyndromeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">DIC Syndrome Calculator</h2>
      <p className="mt-3 text-sm">{SOURCE_LABEL}</p>
      <h2 id="isth" className="mt-8 text-lg font-bold text-accent">ISTH overt DIC</h2>
      <p className="mt-3 text-sm">Sum platelet, fibrin marker, PT prolongation, and fibrinogen points. Threshold ≥{OVERT_DIC_THRESHOLD} for overt DIC when predisposing disorder present.</p>
      <div className="mt-8">
        <FAQAccordion items={[...DIC_SYNDROME_FAQS]} />
      </div>
    </article>
  );
}