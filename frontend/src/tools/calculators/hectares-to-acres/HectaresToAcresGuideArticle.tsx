import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HECTARES_TO_ACRES_FAQS, HECTARES_TO_ACRES_GUIDE_SECTIONS } from './content';

export function HectaresToAcresGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {HECTARES_TO_ACRES_GUIDE_SECTIONS.map((section) => (
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
                <p className="whitespace-pre-line font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
            {section.table ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/40 text-accent">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold">Hectares</th>
                      <th className="px-3 py-2.5 font-semibold">Acres</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr key={row.hectares} className="border-t border-border">
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.hectares}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.acres}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}
        <section id="hectares-to-acres-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={HECTARES_TO_ACRES_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
