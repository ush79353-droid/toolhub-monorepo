import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SHIFT_PAY_FAQS, SHIFT_PAY_GUIDE_SECTIONS } from './content';

export function TwelveHourShiftPayGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {SHIFT_PAY_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
                {section.formulaNote ? (
                  <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                    {section.formulaNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
        <section id="shift-pay-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...SHIFT_PAY_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
