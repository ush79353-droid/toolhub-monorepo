import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PSI_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function PsiPortGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is Pneumonia Severity Index?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The PSI (Pneumonia Severity Index), also called PORT score, stratifies
        adults with community-acquired pneumonia by estimated mortality risk and
        assigns risk classes to support — not replace — disposition discussions.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the PSI calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter sex and age, then check each comorbidity, examination finding, or
        laboratory criterion that is present. The worksheet applies the published
        Fine rule weights and shows total points with the corresponding risk class.
      </p>

      <h2
        id="how-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate PSI/PORT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {DISCLAIMER}
      </p>

      <h2
        id="psi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <FAQAccordion items={PSI_FAQS} className="mt-4 not-prose" />
    </article>
  );
}