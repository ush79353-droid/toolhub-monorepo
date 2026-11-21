export function BenadrylDosageGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="introduction" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Benadryl Dosage Calculator
        </h2>
        <p>
          Map age to the published US OTC Drug Facts band for selected
          Benadryl® (diphenhydramine hydrochloride) oral products. The tool is
          an educational label reference — not a prescription, not veterinary
          dosing, and not a substitute for the carton or a clinician.
        </p>
      </section>

      <section id="how-it-works" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          How Label Dosing Works
        </h2>
        <p>
          Directions are age-banded. ULTRATAB (25 mg tablets) lists 1–2 tablets
          for ages 12 and over, 1 tablet for ages 6 to under 12, and do not use
          under 6, taken every 4 to 6 hours with a maximum of 6 doses in 24
          hours. Extra Strength 50 mg tablets are labeled for ages 12+ only.
          Children’s liquids (12.5 mg/5 mL) use milliliter ranges for ages 6–11
          and gate younger ages.
        </p>
      </section>

      <section id="products" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">Supported Products</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Benadryl® Allergy ULTRATAB (25 mg tablet)</li>
          <li>Benadryl® Extra Strength Allergy Relief (50 mg tablet)</li>
          <li>Children&apos;s Benadryl® Allergy Liquid (12.5 mg/5 mL)</li>
          <li>
            Children&apos;s Benadryl® Dye-Free Allergy Liquid (12.5 mg/5 mL)
          </li>
        </ul>
        <p>
          Sources include DailyMed SPL entries for these products and the brand
          dosing guide. Topical itch creams/gels are out of scope for this oral
          dosage calculator.
        </p>
      </section>

      <section id="how-to-use" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Leave Age blank to review uses and the 24-hour maximum note.</li>
          <li>Choose the medication type that matches your package.</li>
          <li>Enter age in years to see the matching label dose band.</li>
          <li>
            Confirm strength, device (dosing cup), and warnings on the carton.
          </li>
        </ol>
      </section>

      <section id="examples" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">Label Examples</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            ULTRATAB · age 30 → 1 to 2 tablets every 4–6 hours · max 6 doses/24 h
          </li>
          <li>ULTRATAB · age 8 → 1 tablet · max 6 doses/24 h</li>
          <li>ULTRATAB · age 4 → do not use</li>
          <li>
            Children&apos;s liquid · age 7 → 5 mL to 10 mL · dosing cup only
          </li>
        </ul>
      </section>

      <section id="limitations" className="space-y-3">
        <h2 className="text-xl font-semibold text-accent">
          Limitations &amp; Safety
        </h2>
        <p>
          Do not use diphenhydramine to make a child sleepy, and do not combine
          with other diphenhydramine products (including topicals). Marked
          drowsiness can occur. Overdose: contact Poison Control
          (1-800-222-1222) in the US. Pregnancy, nursing, glaucoma, breathing
          problems, prostate enlargement, and sedative interactions require
          professional advice. Entered ages are not stored or shared.
        </p>
      </section>
    </div>
  );
}
