import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { KG_TO_GALLONS_FAQS, KG_TO_GALLONS_GUIDE_SECTIONS } from './content';

export function KgToGallonsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {KG_TO_GALLONS_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                  {section.formula}
                </p>
              </div>
            ) : null}
            {section.table ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <caption className="sr-only">
                    Water kg to US liquid gallons conversion table
                  </caption>
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        Kilograms
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-medium">
                        US Liquid Gallons, Approx.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr key={row.kg} className="border-t border-border">
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.kg}</td>
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.gallons}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.tableNote ? (
                  <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                    {section.tableNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
        <section id="kg-to-gallons-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...KG_TO_GALLONS_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
