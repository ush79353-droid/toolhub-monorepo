import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GORLIN_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function GorlinFormulaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Gorlin Formula Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate aortic and mitral orifice areas from catheter-style
        hemodynamics using the Gorlin equation. Educational only.
      </p>
      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula and Constants
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Area (cm²) = CO (mL/min) ÷ (HR × period × K × √mean gradient). Aortic K
        = 44.3; mitral K = 37.7. Period is systolic ejection (aortic) or
        diastolic filling (mitral) in seconds per beat.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{SOURCE_LABEL}</p>
      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter cardiac output and heart rate.</li>
        <li>Complete aortic and/or mitral gradient + period fields.</li>
        <li>Read AVA and/or MVA; share uses the page URL only.</li>
      </ol>
      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CO 5 L/min, HR 75, SEP 0.30 s/beat, mean gradient 40 mmHg → AVA ≈{' '}
        <strong>0.79 cm²</strong>.
      </p>
      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Low flow and regurgitation can bias calculated areas.</li>
        <li>Uses mean—not peak—gradients.</li>
        <li>Not a diagnosis or intervention recommendation.</li>
      </ul>
      <div id="gorlin-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...GORLIN_FAQS]} />
        </div>
      </div>
    </article>
  );
}
