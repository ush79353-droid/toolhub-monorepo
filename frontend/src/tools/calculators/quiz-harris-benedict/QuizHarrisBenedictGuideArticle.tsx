import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_HARRIS_BENEDICT_FAQS } from './content';
import { HARRIS_BENEDICT_CALCULATOR_HREF } from './questions';

export function QuizHarrisBenedictGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “Harris-Benedict equation to determine your basal metabolic rate” is a
        short educational quiz: what BMR means, which anthropometrics enter the
        equation, why activity multipliers estimate TDEE, sex-specific formulas,
        the sedentary 1.2 factor, using BMR as an energy baseline, and lean-mass
        effects on resting metabolism. It does not store answers on a server and
        is not a calorie prescription.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 7. There is no negative marking.</p>
        <p>
          The numeric score unlocks only after all seven questions are answered.
        </p>
      </div>

      <h2
        id="bmr-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BMR Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Basal metabolic rate is resting energy over 24 hours. Harris–Benedict
        estimates it from sex, age, height, and weight with separate male and
        female equations. Multiplying by an activity factor estimates total
        daily energy expenditure; a 1.2 factor is the light sedentary band.
        Building lean mass through resistance training can raise resting needs.
        For a numeric revised Harris–Benedict estimate, try the{' '}
        <Link
          href={HARRIS_BENEDICT_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Harris–Benedict Calculator
        </Link>
        .
      </p>

      <h2
        id="quiz-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_HARRIS_BENEDICT_FAQS]} />
      </div>
    </article>
  );
}
