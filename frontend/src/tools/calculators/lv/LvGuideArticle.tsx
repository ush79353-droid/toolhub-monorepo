import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LV_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function LvGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        LV Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate left ventricular mass, mass index, and relative wall thickness
        from end-diastolic linear dimensions using the ASE cube formula.
      </p>

      <h2 id="formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        ASE Cube Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert LVEDD, IVSd, and PWd to centimeters, then apply LVM = 0.8 × 1.04 ×
        [(LVEDD+IVSd+PWd)³ − LVEDD³] + 0.6. Divide by BSA for LVMI. RWT = 2 ×
        PWd / LVEDD. Unknown BSA uses Mosteller from height and weight.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{SOURCE_LABEL}</p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select sex (reference labeling only).</li>
        <li>Enter BSA, or choose No and enter height/weight.</li>
        <li>Enter LVEDD, IVSd, and PWd (mm or cm).</li>
        <li>Read mass (g), LVMI (g/m²), and RWT.</li>
      </ol>

      <h2 id="limits" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Linear methods can mis-estimate distorted ventricles. This tool does not
        diagnose hypertrophy or recommend treatment.
      </p>

      <div id="lv-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...LV_FAQS]} />
        </div>
      </div>
    </article>
  );
}
