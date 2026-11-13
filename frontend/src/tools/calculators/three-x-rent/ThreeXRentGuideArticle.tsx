import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { THREE_X_RENT_FAQS, THREE_X_RENT_GUIDE_SECTIONS } from './content';

export function ThreeXRentGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {THREE_X_RENT_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.examples ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <caption className="sr-only">Gross income at 3 times selected monthly rents</caption>
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">Monthly rent</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Gross monthly income</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Gross annual income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.examples.map((row) => (
                      <tr key={row.rent} className="border-t border-border">
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.rent}</td>
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.monthly}</td>
                        <td className="px-4 py-2.5 tabular-nums text-accent">{row.annual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.formula ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
                {section.formulaNote ? (
                  <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                    {section.formulaNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
        <section id="three-x-rent-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...THREE_X_RENT_FAQS]} />
          </div>
        </section>
      </div>
    </div>
  );
}
