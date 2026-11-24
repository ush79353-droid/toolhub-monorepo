import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { ADRENAL_WASHOUT_FAQS } from './content';

export function AdrenalWashoutGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>The adrenal washout calculator</h2>
        <p>
          Estimate absolute and relative adrenal washout from three CT density
          readings in Hounsfield units (HU): a non-contrast (pre-contrast)
          scan, a contrast-enhanced scan at about 60–75 seconds, and a
          15-minute delayed scan. Washout helps characterize adrenal lesions
          when lipid-rich adenoma criteria on unenhanced CT are indeterminate.
        </p>
      </section>

      <section id="formula">
        <h2>Adrenal washout formula</h2>
        <p>
          Absolute percentage washout (APW) = ((enhanced − delayed) ÷
          (enhanced − pre-contrast)) × 100. Relative percentage washout (RPW)
          = ((enhanced − delayed) ÷ enhanced) × 100. Densities are in HU.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>

      <section id="adenoma">
        <h2>Adrenal adenoma</h2>
        <p>
          On a dedicated adrenal CT washout protocol, absolute washout higher
          than 60% or relative washout higher than 40% is strongly suggestive
          of adrenal adenoma. Pre-contrast attenuation below about 10 HU also
          supports lipid-rich adenoma independently of washout. Clinical
          correlation and biochemical evaluation remain essential when
          hyperfunction is suspected.
        </p>
      </section>

      <section id="example">
        <h2>Adrenal calculator — a practical example</h2>
        <p>
          Example: pre-contrast 30 HU, 60–75 sec post-contrast 70 HU, 15 min
          delayed 29 HU. Absolute washout = (70 − 29) ÷ (70 − 30) × 100 =
          102.5%. Relative washout = (70 − 29) ÷ 70 × 100 ≈ 58.6%. Relative
          washout above 40% meets the commonly cited adenoma-suggestive
          threshold; absolute washout above 60% does as well in this case.
        </p>
      </section>

      <section id="adrenal-washout-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...ADRENAL_WASHOUT_FAQS]} />
      </section>
    </article>
  );
}
