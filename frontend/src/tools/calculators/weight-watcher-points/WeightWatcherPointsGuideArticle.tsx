import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { WEIGHT_WATCHER_POINTS_FAQS } from './content';

export function WeightWatcherPointsGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Weight Watcher Points</h2>
        <p>
          Estimate historical SmartPoints for a food serving from calories,
          sugar, protein, and saturated fat. Enter the same serving basis for
          every field. This worksheet is educational only and is not affiliated
          with WW International.
        </p>
      </section>
      <section id="smartpoints-formula">
        <h2>SmartPoints formula</h2>
        <p>
          The publicly documented SmartPoints food formula (used roughly
          2015–2021) weights energy, saturated fat, and sugar upward and
          protein downward, then rounds to a whole point with a minimum of
          zero. Later PersonalPoints systems are personalized and unpublished —
          they are not reproduced here.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="serving-basis">
        <h2>Serving basis</h2>
        <p>
          Score one label serving (or the portion you actually eat) by entering
          matching calories and grams. Mass fields accept g, mg, or oz; unit
          switches preserve the underlying mass so the SmartPoints math always
          runs in grams.
        </p>
      </section>
      <section id="weight-watcher-points-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...WEIGHT_WATCHER_POINTS_FAQS]} />
      </section>
    </article>
  );
}
