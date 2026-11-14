import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  CUBIC_YARDS_TO_TONS_FAQS,
  CUBIC_YARDS_TO_TONS_GUIDE_SECTIONS,
} from './content';

export function CubicYardsToTonsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {CUBIC_YARDS_TO_TONS_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.table ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <caption className="sr-only">
                    Cubic yards to metric tonnes at an assumed density
                  </caption>
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        Cubic yards
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        Metric tonnes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr key={row.yards} className="border-t border-border">
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.yards}</td>
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.tonnes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.tableNote ? (
              <p className="mt-3 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                {section.tableNote}
              </p>
            ) : null}
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
                {section.formulaNote ? (
                  <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                    {section.formulaNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
        <section id="cubic-yards-to-tons-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...CUBIC_YARDS_TO_TONS_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
