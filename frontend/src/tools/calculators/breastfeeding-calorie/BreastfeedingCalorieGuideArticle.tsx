import { GuideSectionHeading } from '@/tools/shared/GuideSectionHeading';

export function BreastfeedingCalorieGuideArticle() {
  return (
    <article className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
      <section id="introduction" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Breastfeeding Calorie Calculator</GuideSectionHeading>
        <p>
          Estimate average daily energy needs while breastfeeding or during
          pregnancy. The calculator combines the Institute of Medicine /
          National Academies Dietary Reference Intakes (DRI) Estimated Energy
          Requirement (EER) for women with the same tables&apos; pregnancy and
          lactation additions.
        </p>
      </section>

      <section id="what-it-estimates" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>What This Calculator Estimates</GuideSectionHeading>
        <p>
          You choose lactation (0–6 months or after six months) or a pregnancy
          trimester, then enter age, height, weight, and a physical-activity
          category. The result is an educational kilocalorie-per-day figure—not
          a personalized medical prescription.
        </p>
      </section>

      <section id="dri-eer" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>
          IOM DRI Estimated Energy Requirement
        </GuideSectionHeading>
        <p>
          For adult women (ages 19–70), non-pregnant EER (kcal/day) is:
        </p>
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 font-mono text-sm">
          354 − (6.91 × age) + PA × [(9.36 × weight_kg) + (726 × height_m)]
        </p>
        <p>
          For adolescent girls (ages 14–18), the DRI girl equation (including
          +25 kcal for growth) is used instead, with adolescent PA
          coefficients.
        </p>
      </section>

      <section id="additions" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>
          Pregnancy and Lactation Additions
        </GuideSectionHeading>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Pregnancy 1st trimester: +0 kcal/day</li>
          <li>Pregnancy 2nd trimester: +340 kcal/day</li>
          <li>Pregnancy 3rd trimester: +452 kcal/day</li>
          <li>
            Lactation 0–6 months: +330 kcal/day (≈500 milk energy − 170 from fat
            stores)
          </li>
          <li>Lactation &gt;6 months: +400 kcal/day</li>
        </ul>
      </section>

      <section id="activity" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Physical Activity Coefficients</GuideSectionHeading>
        <p>
          Activity options map to official DRI PA values. “Little/no exercise”
          is sedentary (PA = 1.00). Light, moderate, and heavy exercise map to
          low-active, active, and very-active coefficients (adult 1.12, 1.27,
          1.45; adolescent 1.16, 1.31, 1.56).
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>How to Use</GuideSectionHeading>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Select lactation stage or pregnancy trimester.</li>
          <li>Enter age in years (14–70 for this model).</li>
          <li>Enter height and weight; switch units as needed.</li>
          <li>Choose physical activity (default: Little/no exercise).</li>
          <li>Read daily energy needs in kcal; reload or clear to reset.</li>
        </ol>
      </section>

      <section id="limitations" className="scroll-mt-24 space-y-3">
        <GuideSectionHeading>Limitations</GuideSectionHeading>
        <p>
          EER equations estimate average needs for healthy individuals. Twins,
          exclusive vs partial breastfeeding, illness, athletic training, and
          intentional weight change can require different targets. This tool
          does not store your inputs or put them in share links.
        </p>
      </section>
    </article>
  );
}
