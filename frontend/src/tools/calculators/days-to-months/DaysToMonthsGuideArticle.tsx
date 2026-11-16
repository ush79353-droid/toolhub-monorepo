import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  DAYS_TO_MONTHS_FAQS,
  DAYS_TO_MONTHS_GUIDE_SECTIONS,
  MONTH_LENGTH_TABLE,
} from './content';

export function DaysToMonthsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {DAYS_TO_MONTHS_GUIDE_SECTIONS.map((section) => (
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
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
            {section.id === 'how-to-convert' ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[240px] text-left text-sm">
                  <caption className="sr-only">Calendar month lengths</caption>
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Month
                      </th>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MONTH_LENGTH_TABLE.map((row) => (
                      <tr key={row[0]} className="border-t border-border">
                        <td className="px-3 py-2.5 text-accent">{row[0]}</td>
                        <td className="px-3 py-2.5 font-mono tabular-nums text-accent">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}
        <section id="days-to-months-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={DAYS_TO_MONTHS_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
