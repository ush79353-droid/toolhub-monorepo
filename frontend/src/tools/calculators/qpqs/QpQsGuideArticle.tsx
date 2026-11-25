import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QPQS_FAQS, SOURCE_LABEL } from './content';

export function QpQsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Qp/Qs Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the pulmonary-to-systemic blood flow ratio (shunt fraction
        direction depends on clinical context). Educational only.
      </p>

      <h2
        id="circulatory"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The circulatory system
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pulmonary circulation (Qp) oxygenates blood; systemic circulation (Qs)
        delivers oxygen to tissues. In a balanced circulation without shunt,
        Qp and Qs are similar.
      </p>

      <h2
        id="shunt"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is a shunt in the heart?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A shunt is abnormal blood flow between pulmonary and systemic circuits
        (for example across a septal defect). Qp/Qs summarizes relative flow
        imbalance; it does not localize the defect by itself.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is Qp/Qs? The Qp/Qs formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Echocardiography: (RVOT diameter² × RVOT VTI) ÷ (LVOT diameter² × LVOT
        VTI) after converting diameters to consistent length units. Fick oxygen
        content: (systemic arterial − mixed venous) ÷ (pulmonary venous −
        pulmonary arterial). Direct: Qp ÷ Qs in matched flow units.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the Qp/Qs calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose echo, Fick, or direct mode. Enter measurements for one method
        only. The ratio updates as fields validate. Share uses the page URL
        without your data.
      </p>

      <h2
        id="values"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Qp/Qs values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ratio near 1 suggests balanced flows. Higher ratios often reflect
        excess pulmonary flow (for example left-to-right shunt); lower ratios
        may reflect reduced pulmonary relative to systemic flow. Interpret with
        imaging, oxygen saturations, and hemodynamics.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="qpqs-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...QPQS_FAQS]} />
      </div>
    </article>
  );
}