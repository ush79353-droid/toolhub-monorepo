import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  QUARTS_TO_GALLONS_FAQS,
  QUARTS_TO_GALLONS_GUIDE_SECTIONS,
} from './content';

const RELATED_LINKS = [
  { href: '/tools/gallon-calculator', label: 'Gallon Calculator' },
  { href: '/tools/volume-conversion', label: 'Volume Conversion' },
  { href: '/tools/pints-to-gallons-converter', label: 'Pints to Gallons Converter' },
  { href: '/tools/pints-to-cups-converter', label: 'Pints to Cups Converter' },
  { href: '/tools/gallons-to-cups-converter', label: 'Gallons to Cups Converter' },
  { href: '/tools/gallons-to-quarts-converter', label: 'Gallons to Quarts Converter' },
  { href: '/tools/cups-to-quarts-converter', label: 'Cups to Quarts Converter' },
  { href: '/tools/cups-to-gallons-converter', label: 'Cups to Gallons Converter' },
] as const;

export function QuartsToGallonsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {QUARTS_TO_GALLONS_GUIDE_SECTIONS.map((section) => (
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
                {RELATED_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
        <section id="quarts-to-gallons-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={QUARTS_TO_GALLONS_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
