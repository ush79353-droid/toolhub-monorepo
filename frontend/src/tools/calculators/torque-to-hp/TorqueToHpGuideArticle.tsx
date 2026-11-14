import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TORQUE_TO_HP_FAQS, TORQUE_TO_HP_GUIDE_SECTIONS } from './content';

export function TorqueToHpGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {TORQUE_TO_HP_GUIDE_SECTIONS.map((section) => (
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
            {section.table ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <caption className="sr-only">{section.title}</caption>
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      {(section.tableHeaders ?? ['From', 'To']).map((header) => (
                        <th key={header} scope="col" className="px-4 py-2.5 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr
                        key={`${row.left}-${row.mid}-${row.mid2}-${row.right}`}
                        className="border-t border-border"
                      >
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.left}</td>
                        {row.mid !== undefined ? (
                          <td className="px-4 py-2.5 tabular-nums text-accent">{row.mid}</td>
                        ) : null}
                        {row.mid2 !== undefined ? (
                          <td className="px-4 py-2.5 tabular-nums text-accent">{row.mid2}</td>
                        ) : null}
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.tableNote ? (
                  <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                    {section.tableNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
        <section id="torque-to-hp-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...TORQUE_TO_HP_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
