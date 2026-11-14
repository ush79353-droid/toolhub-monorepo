import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PQ_FAQS, PQ_GUIDE_SECTIONS } from './content';

export function PriceQuantityGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {PQ_GUIDE_SECTIONS.map((section) => (
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
              <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-muted/40 px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-accent">
                {section.formula}
              </pre>
            ) : null}
          </article>
        ))}
        <div id="pq-faq" className="scroll-mt-24 pt-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...PQ_FAQS]} />
          </div>
        </div>
      </div>
    </div>
  );
}
