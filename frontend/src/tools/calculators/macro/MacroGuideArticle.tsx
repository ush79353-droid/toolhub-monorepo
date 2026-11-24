import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { MACRO_FAQS } from './content';

export function MacroGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Macro Calculator</h2>
        <p>
          Educational daily calorie and macronutrient ranges from height,
          weight, age, activity, and goal. Shares the IIFYM engine model.
        </p>
      </section>
      <section id="method">
        <h2>Calories and macros</h2>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="macro-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...MACRO_FAQS]} />
      </section>
    </article>
  );
}
