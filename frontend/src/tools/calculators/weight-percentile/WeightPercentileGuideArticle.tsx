import { GuideSectionHeading } from '@/tools/shared/GuideSectionHeading';

export function WeightPercentileGuideArticle() {
  return (
    <article className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Weight Percentile Calculator</GuideSectionHeading>
        <p>
          Estimate a child&apos;s weight-for-age percentile using the World
          Health Organization Child Growth Standards (birth to 5 years). This
          tool is educational and is not a diagnosis.
        </p>
      </section>

      <section id="who-lms" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>WHO LMS Formula</GuideSectionHeading>
        <p>
          Each completed month and sex has LMS parameters. Weight W (kg) maps
          to a z-score, then to a percentile via the standard normal CDF.
        </p>
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 font-mono text-sm">
          z = ((W/M)^L − 1) / (L × S) &nbsp;·&nbsp; L = 0 → ln(W/M) / S
        </p>
        <p>
          WHO&apos;s ±3 SD tail adjustment is applied for extreme values, matching
          Child Growth Standards computation notes.
        </p>
      </section>

      <section id="age-bounds" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Age Coverage</GuideSectionHeading>
        <p>
          Supported ages are 0–60 completed months. Years convert as age × 12.
          Outside that window the calculator shows an error instead of
          extrapolating.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>How to Use</GuideSectionHeading>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Enter age in months or years.</li>
          <li>Select Girl or Boy.</li>
          <li>Enter weight in kg or lb.</li>
          <li>Read the WHO weight-for-age percentile and z-score.</li>
        </ol>
      </section>
    </article>
  );
}
