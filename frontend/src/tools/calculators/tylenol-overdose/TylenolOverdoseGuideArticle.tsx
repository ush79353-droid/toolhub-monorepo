import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { TYLENOL_OVERDOSE_FAQS } from './content';

export function TylenolOverdoseGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Tylenol overdose worksheet</h2>
        <p>
          This educational calculator frames a timed acetaminophen (Tylenol /
          paracetamol) serum level against published Rumack–Matthew nomogram
          lines for a single acute oral ingestion. It is not a diagnosis,
          antidote order, or permission to stay home. Suspected overdose always
          needs immediate poison-center or emergency care.
        </p>
      </section>
      <section id="rumack-matthew">
        <h2>Rumack–Matthew nomogram</h2>
        <p>
          The classic Rumack–Matthew probable hepatotoxicity line starts at{' '}
          <strong>200 µg/mL at 4 hours</strong> after a single acute oral
          ingestion and declines with a <strong>4-hour half-life</strong>. US
          poison-center teaching commonly also references the treatment
          (“possible toxicity”) line at <strong>150 µg/mL at 4 hours</strong>{' '}
          with the same slope. The usual educational timing window is{' '}
          <strong>4–24 hours</strong> after ingestion. Levels drawn earlier than
          4 hours are not interpreted on this plot. Intravenous acetaminophen
          and unknown-time or repeated exposures are outside this oral nomogram
          pathway.
        </p>
        <p>
          Concentration units: <strong>1 µg/mL = 1 mg/L</strong> for
          acetaminophen. Body weight on this worksheet is optional context only
          and does not move the concentration-vs-time lines.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="tylenol-overdose-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...TYLENOL_OVERDOSE_FAQS]} />
      </section>
    </article>
  );
}
