export function GabapentinDosageGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Gabapentin Dosage Calculator
        </h2>
        <p>
          Explore FDA-labeled NEURONTIN (gabapentin) schedules by indication and
          age. Defaults stay blank. Off-label pathways stay informational — this
          is not a prescription writer.
        </p>
      </section>

      <section id="approved" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">FDA-Approved Uses</h2>
        <p>
          NEURONTIN is labeled for adult postherpetic neuralgia and as adjunctive
          therapy for partial-onset seizures in patients 3 years and older.
          Adult/adolescent epilepsy typically starts at 300 mg three times daily.
          PHN uses a 300 → 600 → 900 mg/day titration over three days, then up to
          1800 mg/day.
        </p>
      </section>

      <section id="off-label" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Off-Label &amp; Other Products
        </h2>
        <p>
          Restless legs syndrome is labeled for gabapentin enacarbil (HORIZANT),
          not IR gabapentin. Peripheral neuropathy and anxiety are not NEURONTIN
          indications here; no invented doses are shown.
        </p>
      </section>

      <section id="renal" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">Renal Adjustment</h2>
        <p>
          For ages ≥12, reduce total daily dose when creatinine clearance is
          below 60 mL/min per FDA Table 1 (TID → BID → QD bands, plus
          hemodialysis supplements). Pediatric renal impairment under 12 has not
          been studied. CrCl is not an input on this screen.
        </p>
      </section>

      <section id="how-to-use" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Select one indication.</li>
          <li>Enter age in years.</li>
          <li>Read labeled schedules or informational gating.</li>
          <li>Confirm with the PI and a clinician before any therapy change.</li>
        </ol>
      </section>
    </div>
  );
}
