import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEIGHT_CONVERTER_FAQS, HEIGHT_CONVERTER_GUIDE_SECTIONS } from './content';

export function HeightConverterGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {HEIGHT_CONVERTER_GUIDE_SECTIONS.map((section) => (
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
                      <th className="px-3 py-2.5 font-semibold">Unit</th>
                      <th className="px-3 py-2.5 font-semibold">Centimeters</th>
                      <th className="px-3 py-2.5 font-semibold">Meters</th>
                      <th className="px-3 py-2.5 font-semibold">Inches</th>
                      <th className="px-3 py-2.5 font-semibold">Feet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr key={row.unit} className="border-t border-border">
                        <td className="px-3 py-2 text-foreground/90">{row.unit}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.cm}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.m}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.inches}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">{row.feet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}
        <section id="height-converter-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={HEIGHT_CONVERTER_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
