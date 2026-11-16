import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { formatHardness } from './calculation';
import { HARDNESS_FAQS, HARDNESS_GUIDE_SECTIONS } from './content';
import { CHART_HARD_ROWS, CHART_SOFT_ROWS } from './reference-data';

function HardnessChart() {
  return (
    <div className="mt-5 space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-accent">
          Soft regime (Rockwell B) — non-austenitic steel
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[360px] text-left text-sm">
            <caption className="sr-only">
              Soft-regime hardness conversion chart for non-austenitic steel
            </caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Brinell (HBW)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Rockwell B (HRB)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Rockwell C (HRC)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Vickers (HV)
                </th>
              </tr>
            </thead>
            <tbody>
              {CHART_SOFT_ROWS.map((row) => (
                <tr key={`soft-${row.HRB}`} className="border-t border-border">
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HBW)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HRB)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HRC)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HV)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-accent">
          Hard regime (Rockwell C) — non-austenitic steel
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[360px] text-left text-sm">
            <caption className="sr-only">
              Hard-regime hardness conversion chart for non-austenitic steel
            </caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Brinell (HBW)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Rockwell B (HRB)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Rockwell C (HRC)
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Vickers (HV)
                </th>
              </tr>
            </thead>
            <tbody>
              {CHART_HARD_ROWS.map((row) => (
                <tr key={`hard-${row.HRC}`} className="border-t border-border">
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HBW)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HRB)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HRC)}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-accent">
                    {formatHardness(row.HV)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Reference: approximate educational chart aligned with ASTM E140 relationships for
        non-austenitic steels. Em dash (—) means that scale is unsupported at that row. Sparse
        sampling — interpolate only between adjacent verified rows; do not extrapolate.
      </p>
    </div>
  );
}

export function HardnessGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {HARDNESS_GUIDE_SECTIONS.map((section) => (
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
            {section.showChart ? <HardnessChart /> : null}
          </article>
        ))}
        <section id="hardness-conversion-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={HARDNESS_FAQS} />
          </div>
        </section>
      </div>
    </div>
  );
}
