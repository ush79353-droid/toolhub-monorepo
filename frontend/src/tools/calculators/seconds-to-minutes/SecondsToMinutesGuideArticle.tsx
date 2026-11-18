import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { S2M_FAQS, S2M_GUIDE_SECTIONS } from './content';

const RELATED_LINKS = [
  { href: '/tools/time-unit-converter', label: 'Time Unit Converter' },
  { href: '/tools/minute-converter', label: 'Minute Converter' },
  { href: '/tools/seconds-converter', label: 'Seconds Converter' },
  { href: '/tools/hours-to-minutes-converter', label: 'Hours to Minutes Converter' },
  { href: '/tools/hours-to-seconds-converter', label: 'Hours to Seconds Converter' },
  { href: '/tools/seconds-to-hours-converter', label: 'Seconds to Hours Converter' },
  { href: '/tools/minutes-to-seconds-converter', label: 'Minutes to Seconds Converter' },
  { href: '/tools/seconds-to-days-converter', label: 'Seconds to Days Converter' },
] as const;

export function SecondsToMinutesGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {S2M_GUIDE_SECTIONS.map((section) => (
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
              <div className="mt-5 max-h-[28rem] overflow-auto rounded-xl border border-border">
                <table className="w-full min-w-[240px] text-left text-sm">
                  <caption className="sr-only">{section.title}</caption>
                  <thead className="sticky top-0 bg-muted/90 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
                    <tr>
                      {section.tableHeaders?.map((header) => (
                        <th key={header} scope="col" className="px-3 py-2.5 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr key={row.join('|')} className="border-t border-border">
                        {row.map((cell, index) => (
                          <td
                            key={`${index}-${cell}`}
                            className="px-3 py-2.5 font-mono tabular-nums text-accent"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.id === 'related-tools' ? (
              <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
                {RELATED_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-primary underline-offset-2 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
        <section id="seconds-to-minutes-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={S2M_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
