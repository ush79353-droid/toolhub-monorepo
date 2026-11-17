'use client';

import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  IMPERIAL_TO_METRIC_FAQS,
  IMPERIAL_TO_METRIC_GUIDE_SECTIONS,
  LENGTH_TABLE,
  MASS_TABLE,
  VOLUME_TABLE,
} from './content';

function MiniTable({
  caption,
  rows,
}: {
  caption: string;
  rows: readonly { imperial: string; metric: string }[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-left text-sm">
        <caption className="bg-muted/40 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-accent">
          {caption}
        </caption>
        <thead className="bg-muted/20 text-accent">
          <tr>
            <th className="px-3 py-2 font-semibold">Imperial / US</th>
            <th className="px-3 py-2 font-semibold">Metric</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.imperial}-${row.metric}`} className="border-t border-border">
              <td className="px-3 py-2 tabular-nums text-foreground/90">{row.imperial}</td>
              <td className="px-3 py-2 tabular-nums text-foreground/90">{row.metric}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ImperialToMetricGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {IMPERIAL_TO_METRIC_GUIDE_SECTIONS.map((section) => (
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
            {section.id === 'conversion-tables' ? (
              <div className="mt-2 space-y-4">
                <MiniTable caption="Length" rows={LENGTH_TABLE} />
                <MiniTable caption="Mass" rows={MASS_TABLE} />
                <MiniTable caption="Volume" rows={VOLUME_TABLE} />
              </div>
            ) : null}
          </article>
        ))}
        <section id="imperial-to-metric-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Imperial to Metric Conversion FAQs
          </h2>
          <div className="mt-4">
            <FAQAccordion items={IMPERIAL_TO_METRIC_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
