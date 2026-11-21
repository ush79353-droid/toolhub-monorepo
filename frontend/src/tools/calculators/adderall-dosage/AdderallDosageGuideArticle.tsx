export function AdderallDosageGuideArticle() {
  return (
    <div className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Adderall Dosage — Educational IR Explorer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Adderall immediate-release tablets contain mixed amphetamine salts and
          are labeled for ADHD and narcolepsy. This page mirrors the approved
          screenshot controls and separates educational label/chart context from
          arithmetic on a dose your clinician already wrote. It is not a
          prescription tool and does not cover Adderall XR.
        </p>
      </section>

      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Enter age in years.</li>
          <li>
            Choose ADHD or Narcolepsy for educational IR chart context, or Enter
            a custom dose for prescribed-dose tablet math.
          </li>
          <li>Select an IR tablet strength (default 5 mg).</li>
          <li>
            In custom mode, enter the prescribed mg per administration already
            specified by a licensed clinician.
          </li>
        </ol>
      </section>

      <section id="ir-label" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">IR Label Context</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          DailyMed Adderall IR SPL (setid f22635fe-821d-4cde-aa12-419f8b53db81,
          updated May 29, 2024) lists tablet strengths 5–30 mg and describes
          ADHD and narcolepsy dosing with weekly titration language. Educational
          teaching starts shown here align with that IR label and Omni’s
          published regular-tablet charts. XR rows from Omni are omitted by
          design.
        </p>
      </section>

      <section id="custom-math" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Prescribed-Dose Tablet Math
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Custom mode uses:{' '}
          <code className="text-xs">
            tablet quantity = prescribed dose (mg) ÷ tablet strength (mg)
          </code>
          . Fractional results are shown mathematically without instructing
          tablet splitting or dose changes.
        </p>
      </section>

      <section id="limits" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Safety Limits</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Adderall is Schedule II with boxed warnings for abuse, misuse, and
          addiction. This tool does not automate titration, frequency, daily
          totals, or formulation switches. Confirm any medication plan with the
          prescribing clinician or pharmacist.
        </p>
      </section>

      <section id="adderall-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
      </section>
    </div>
  );
}
