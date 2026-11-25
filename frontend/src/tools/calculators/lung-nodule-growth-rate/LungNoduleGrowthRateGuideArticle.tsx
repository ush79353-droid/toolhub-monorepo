import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  DISCLAIMER,
  LUNG_NODULE_FAQS,
  SOURCE_NOTE,
} from './content';

export function LungNoduleGrowthRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Lung Nodule Growth Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Despite the catalog title, this worksheet implements the Brock
        University / PanCan malignancy probability equation for pulmonary
        nodules seen on first screening CT — not serial volume doubling time.
        Minimum age is 18 years.
      </p>

      <h2
        id="brock"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate lung nodule cancer risk
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter age in years (≥ 18).</li>
        <li>Select sex (Female / Male).</li>
        <li>Answer emphysema, family history of lung cancer, spiculation, and upper-lobe location.</li>
        <li>Enter nodule count and size in millimeters.</li>
        <li>Choose nodule type: nonsolid/ground-glass, partially solid, or solid.</li>
        <li>
          Review log odds and cancer probability (%). Probability = 100 / (1 +
          e<sup>−log odds</sup>).
        </li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What this is not
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This is not a growth-rate or volume doubling time calculator. Serial
        sizes and dates are not collected. {DISCLAIMER}
      </p>

      <div id="lung-nodule-faq" className="not-prose mt-8">
        <FAQAccordion items={LUNG_NODULE_FAQS} />
      </div>
    </article>
  );
}
