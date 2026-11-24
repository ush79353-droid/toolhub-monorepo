import * as React from 'react';
import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import type { PublicPublishedGuide } from '@/server/catalog/tools';

export function PublishedGuideArticle({
  guide,
  categoryHref,
  categoryName,
}: {
  guide: PublicPublishedGuide;
  categoryHref: string;
  categoryName: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {guide.sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
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
            {section.bullets.length > 0 ? (
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15px] font-normal leading-[1.7] text-foreground/85 marker:text-muted-foreground sm:text-base sm:leading-[1.75]">
                {section.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}

        <article id="published-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            FAQ
          </h2>
          <div className="mt-4">
            <FAQAccordion items={guide.faqs} />
          </div>
        </article>

        <article id="published-related" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Related calculators
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-foreground/85 sm:text-base">
            {guide.links.map((link) => (
              <li key={link.slug}>
                <Link href={`/tools/${link.slug}`} className="text-primary hover:underline">
                  {link.anchor}
                </Link>
              </li>
            ))}
            <li>
              <Link href={categoryHref} className="text-primary hover:underline">
                {categoryName}
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{guide.disclaimer}</p>
        </article>
      </div>
    </div>
  );
}
