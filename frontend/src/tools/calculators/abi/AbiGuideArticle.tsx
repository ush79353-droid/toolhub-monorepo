export function AbiGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">Ankle-Brachial Index</h2>
      <p>
        The ankle-brachial index (ABI) compares systolic pressure at the ankle
        with systolic pressure in the arms. This calculator reproduces the
        standard ratio using the higher arm pressure you supply and each
        leg&apos;s higher foot pressure. Educational only.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>
          Measure both arms and enter the higher brachial systolic pressure
          (mmHg).
        </li>
        <li>
          For each leg, enter the higher of the dorsalis pedis and posterior
          tibial systolic pressures.
        </li>
        <li>
          Read Right ABI and Left ABI. Either leg can compute independently once
          the arm value is available.
        </li>
      </ol>

      <h2 id="formula">Formula &amp; Reporting</h2>
      <p>
        ABI = foot systolic ÷ arm systolic. Example: arm 120 mmHg, right foot
        108 mmHg → 0.90; left foot 132 mmHg → 1.10. ACC/AHA reporting bands
        commonly use ≤0.90 abnormal, 0.91–0.99 borderline, 1.00–1.40 normal, and
        &gt;1.40 noncompressible arteries.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Use Doppler technique when measuring. Noncompressible vessels (e.g.,
        diabetes, CKD) can falsely elevate ABI. This tool does not interpret
        waveforms, toe-brachial index, or exercise ABI and cannot replace
        clinical evaluation.
      </p>
    </article>
  );
}
