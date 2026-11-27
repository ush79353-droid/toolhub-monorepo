import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_FFMI_FAQS } from './content';
import { FFMI_CALCULATOR_HREF } from './questions';

export function QuizFfmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “FFMI reality check” is a short sequential quiz: what FFMI stands for,
        what it measures, why athletes prefer it over BMI, why body fat % is
        required, how muscle changes FFMI, and common educational male/female
        interpretation bands. It does not store answers on a server and is not a
        body-composition prescription.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 8. There is no negative marking.</p>
        <p>
          Questions unlock in order. The numeric score appears only after all
          eight answers are selected.
        </p>
      </div>

      <h2
        id="ffmi-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FFMI Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fat-free mass index estimates lean mass relative to height. Fat-free
        mass is weight × (1 − body fat%/100). FFMI is FFM ÷ height in metres
        squared. Normalized FFMI adjusts toward a 1.8 m reference height with
        coefficient 6.1. Teaching bands (for example male “excellent” 22–23 and
        female “superior” 19–21.5) are educational labels, not diagnoses. For a
        numeric estimate, try the{' '}
        <Link
          href={FFMI_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FFMI Calculator
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
        <FAQAccordion items={[...QUIZ_FFMI_FAQS]} />
      </div>
    </article>
  );
}
