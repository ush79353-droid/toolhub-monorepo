import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MCG_TO_ML_FAQS, MCG_TO_ML_GUIDE_SECTIONS } from './content';

export function McgToMlGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {MCG_TO_ML_GUIDE_SECTIONS.map((section) => (
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
                <p className="font-mono text-xs font-medium text-accent sm:text-sm">{section.formula}</p>
              </div>
            ) : null}
            {section.subsections?.map((sub) => (
              <div key={sub.id} id={sub.id} className="mt-6 scroll-mt-24">
                <h3 className="text-lg font-semibold tracking-tight text-accent sm:text-xl">
                  {sub.title}
                </h3>
                <div className="mt-3 space-y-3 text-[15px] leading-[1.72] text-foreground/85 sm:text-base">
                  {sub.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {sub.formula ? (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
                    <p className="font-mono text-xs font-medium text-accent sm:text-sm">
                      {sub.formula}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
            {section.links ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
                {section.links.map((link) => (
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
        <section id="mcg-to-ml-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={MCG_TO_ML_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
