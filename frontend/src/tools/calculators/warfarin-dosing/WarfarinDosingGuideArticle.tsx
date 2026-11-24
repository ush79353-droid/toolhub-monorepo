import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { WARFARIN_DOSING_FAQS } from './content';

export function WarfarinDosingGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Warfarin Dosing Worksheet</h2>
        <p>
          This educational tool walks through maintenance warfarin adjustment
          using published clinic INR bands for targets 2–3 and 2.5–3.5, plus
          ACCP-framed pathways when bleeding is present. Enter current INR,
          bleeding category, and total weekly (or daily) dose. It is not a
          prescription, initiation order, or reversal protocol.
        </p>
      </section>
      <section id="maintenance-nomogram">
        <h2>Maintenance adjustment bands</h2>
        <p>
          With no significant bleeding, the worksheet maps INR against the
          selected target column and applies the published percent change to
          the current weekly total, showing a range rather than a single
          invented tablet schedule. In-range INR yields no percent change.
          Recheck timing notes follow the same clinic table language.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="bleeding-pathways">
        <h2>Bleeding pathways</h2>
        <p>
          Serious or life-threatening bleeding requires immediate clinical
          escalation. Numeric dose adjustment is suppressed. Educational text
          summarizes ACCP guidance to stop warfarin and pursue rapid reversal
          with four-factor PCC plus vitamin K — never an autonomous order from
          this page.
        </p>
      </section>
      <section id="warfarin-dosing-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...WARFARIN_DOSING_FAQS]} />
      </section>
    </article>
  );
}
