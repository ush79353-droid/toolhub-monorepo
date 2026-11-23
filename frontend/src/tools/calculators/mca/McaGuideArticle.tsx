export function McaGuideArticle() {
  return (
  <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-accent prose-p:text-foreground/90">
      <section id="introduction">
        <h2>MCA Calculator</h2>
        <p>
          Estimate fetal middle cerebral artery (MCA) peak systolic velocity
          (PSV) as multiples of the median (MoM) from a measured Doppler value
          and gestational age. Outputs are educational only.
        </p>
      </section>

      <section id="what-is">
        <h2>What This Calculator Does</h2>
        <ul>
          <li>Select singleton or twin pregnancy type.</li>
          <li>Choose gestational age in completed weeks.</li>
          <li>Enter MCA peak systolic velocity in cm/s or mm/s.</li>
          <li>Read MoM and the cohort median PSV for that week.</li>
        </ul>
      </section>

      <section id="formula">
        <h2>MoM Formula</h2>
        <p>MoM = measured PSV ÷ median PSV at the same gestational age.</p>
        <p>
          Velocities are converted to cm/s internally before division so mm/s
          and cm/s give the same MoM.
        </p>
      </section>

      <section id="references">
        <h2>Reference Populations</h2>
        <p>
          <strong>Single:</strong> Mari G et al. N Engl J Med 2000;342:9-14
          medians (weeks 14–40), as tabulated in Mari G. Ultrasound Obstet
          Gynecol 2005;25:323-330.
        </p>
        <p>
          <strong>Twin:</strong> O&apos;Gorman N et al. Ultrasound Obstet
          Gynecol 2009 — MCDA twin MCA-PSV 50th-centile references for weeks
          15–37. Weeks 14 and 38–40 have no median from that cohort in this
          tool. No chorionicity or intertwin discordance logic is applied.
        </p>
      </section>

      <section id="example">
        <h2>Worked Example</h2>
        <p>
          Singleton · 14 weeks · measured PSV 19.3 cm/s · median 19.3 cm/s → MoM
          1.0. At 38.6 cm/s the MoM is 2.0.
        </p>
      </section>

      <section id="limits">
        <h2>Limits and Safety</h2>
        <p>
          This page does not store clinical inputs, apply 1.5 MoM anemia
          thresholds, or manage alloimmunization. Always interpret MCA Doppler
          with appropriate ultrasound workflow and specialist guidance.
        </p>
      </section>
    </article>
  );
}