import { GuideSectionHeading } from '@/tools/shared/GuideSectionHeading';

export function NavyBodyFatGuideArticle() {
  return (
    <article className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Navy Body Fat Calculator</GuideSectionHeading>
        <p>
          Estimate percent body fat from height and tape measurements using the
          classic U.S. Navy circumference equations (Hodgdon &amp; Beckett /
          NHRC). This page is educational and is not an official Navy Body
          Composition Assessment score.
        </p>
      </section>

      <section id="equations" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Circumference Equations</GuideSectionHeading>
        <p>
          Measurements are converted to centimeters. Logarithms are base-10.
          Arguments to log10 must be positive (waist &gt; neck for men; waist +
          hip &gt; neck for women).
        </p>
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 font-mono text-sm">
          Male: 495 / (1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height))
          − 450
        </p>
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 font-mono text-sm">
          Female: 495 / (1.29579 − 0.35004·log10(waist+hip−neck) +
          0.221·log10(height)) − 450
        </p>
      </section>

      <section id="female-hip" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Female Hip Measurement</GuideSectionHeading>
        <p>
          Selecting Female reveals the hip circumference field required by the
          Navy female equation. Male mode hides hip.
        </p>
      </section>

      <section id="vs-official" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Vs Official Navy BCA</GuideSectionHeading>
        <p>
          Official Navy Body Composition Assessment procedures, tape sites, and
          pass/fail standards are governed by current Navy instructions. This
          calculator reports the legacy published circumference estimate only.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>How to Use</GuideSectionHeading>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Optionally enter age (not used in the equation).</li>
          <li>Select Male or Female.</li>
          <li>Enter height, neck, and waist (plus hip if Female).</li>
          <li>Read estimated body fat %; reload or clear to reset.</li>
        </ol>
      </section>
    </article>
  );
}
