import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TBSP_TO_G_FAQS, TBSP_TO_G_GUIDE_SECTIONS } from './content';

const RELATED_LINKS = [
  { href: '/tools/weight-converter', label: 'Weight Converter' },
  { href: '/tools/mg-to-tablespoon-converter', label: 'mg to tablespoon Converter' },
  { href: '/tools/mg-to-teaspoon-converter', label: 'mg to teaspoon Converter' },
  { href: '/tools/ml-to-tbsp-converter', label: 'ml to tbsp Converter' },
  { href: '/tools/ml-to-tsp-converter', label: 'ml to tsp Converter' },
  { href: '/tools/grams-in-ml-converter', label: 'Grams in mL Converter' },
  { href: '/tools/grams-to-fl-oz-converter', label: 'Grams to fl oz Converter' },
  { href: '/tools/ounces-to-grams-converter', label: 'Ounces to Grams Converter' },
  { href: '/tools/grams-to-ounces-calculator', label: 'Grams to Ounces Calculator' },
] as const;

export function TbspToGramsGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {TBSP_TO_G_GUIDE_SECTIONS.map((section) => (
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
                <table className="w-full min-w-[320px] text-left text-sm">
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
            {section.notice ? (
              <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-sm leading-relaxed text-amber-950/90">
                {section.notice}
              </p>
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
        <section id="tbsp-to-g-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={TBSP_TO_G_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
