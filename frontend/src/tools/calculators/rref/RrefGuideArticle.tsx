import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MatrixDisplay } from './MatrixDisplay';
import { RREF_FAQS, RREF_GUIDE_SECTIONS } from './content';

export function RrefGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {RREF_GUIDE_SECTIONS.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-24 py-7 first:pt-0">
            <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
              {section.title}
            </h2>

            <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>

            {section.orderedSteps ? (
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15px] font-normal leading-[1.7] text-foreground/85 marker:text-muted-foreground sm:text-base sm:leading-[1.75]">
                {section.orderedSteps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ul>
            ) : null}

            {section.bullets ? (
              <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15px] font-normal leading-[1.7] text-foreground/85 marker:text-muted-foreground sm:text-base sm:leading-[1.75]">
                {section.bullets.map((bullet, bIndex) => (
                  <li key={bIndex}>{bullet}</li>
                ))}
              </ul>
            ) : null}

            {section.hasWorkedExample ? (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-4">
                  <h3 className="text-sm font-semibold text-accent">Original matrix</h3>
                  <div className="mt-3">
                    <MatrixDisplay
                      matrix={[
                        ['1', '2', '3'],
                        ['2', '4', '6'],
                        ['1', '1', '1'],
                      ]}
                      aria-label="Worked example original matrix"
                    />
                  </div>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
                    <li>R2 → R2 − 2R1 produces a zero row.</li>
                    <li>R3 → R3 − R1 yields [0 −1 −2].</li>
                    <li>Swap/scale to place a pivot of 1 in column 2.</li>
                    <li>Clear above that pivot to finish RREF.</li>
                  </ol>
                </div>
                <div className="rounded-xl border border-border bg-brand-softTeal/50 p-4">
                  <h3 className="text-sm font-semibold text-accent">RREF result</h3>
                  <div className="mt-3">
                    <MatrixDisplay
                      matrix={[
                        ['1', '0', '-1'],
                        ['0', '1', '2'],
                        ['0', '0', '0'],
                      ]}
                      pivotColumns={[1, 2]}
                      aria-label="Worked example RREF matrix"
                    />
                  </div>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-xs font-normal text-muted-foreground sm:text-[13px]">
                    <li>Rank = 2 (two pivot columns)</li>
                    <li>Pivot columns = 1 and 2</li>
                    <li>Nullity = 1 (free column 3)</li>
                  </ul>
                </div>
              </div>
            ) : null}

            {section.hasComparisonTable ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-muted text-xs font-medium text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Property
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        REF
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        RREF
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white font-normal text-foreground">
                    <tr className="hover:bg-muted/35">
                      <td className="px-4 py-3 font-medium text-accent">Leading entries</td>
                      <td className="px-4 py-3">Leading 1s, stair-step right</td>
                      <td className="px-4 py-3">Same</td>
                    </tr>
                    <tr className="hover:bg-muted/35">
                      <td className="px-4 py-3 font-medium text-accent">Below pivots</td>
                      <td className="px-4 py-3">Must be zero</td>
                      <td className="px-4 py-3">Must be zero</td>
                    </tr>
                    <tr className="hover:bg-muted/35">
                      <td className="px-4 py-3 font-medium text-accent">Above pivots</td>
                      <td className="px-4 py-3">May be nonzero</td>
                      <td className="px-4 py-3">Must be zero</td>
                    </tr>
                    <tr className="hover:bg-muted/35">
                      <td className="px-4 py-3 font-medium text-accent">Uniqueness</td>
                      <td className="px-4 py-3">Not unique in general</td>
                      <td className="px-4 py-3">Unique for each matrix</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        ))}

        <section id="rref-faq" className="scroll-mt-24 pt-7">
          <h2 className="mb-5 text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={[...RREF_FAQS]} />
        </section>
      </div>
    </div>
  );
}
