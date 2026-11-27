import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_PCR_FAQS } from './content';
import {
  PROTEIN_CREATININE_RATIO_CALCULATOR_HREF,
  URINE_OUTPUT_CALCULATOR_HREF,
} from './questions';

export function QuizProteinCreatinineRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        We designed this quiz to help you review and consolidate the key concepts
        behind the protein creatinine ratio. It covers what PCR helps check,
        why creatinine balances the protein reading, what a high ratio may
        suggest, which organ filters protein, and which specimen is used. It
        does not store answers on a server and is not a lab calculator.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For numeric UPCR from urine protein and creatinine, use the{' '}
        <Link
          href={PROTEIN_CREATININE_RATIO_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          protein creatinine ratio calculator
        </Link>
        . For volume context you can also explore the{' '}
        <Link
          href={URINE_OUTPUT_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          urine output calculator
        </Link>
        .
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 5. There is no negative marking.</p>
        <p>
          The numeric score unlocks only after all five questions are answered.
        </p>
      </div>

      <h2
        id="pcr-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PCR Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A spot urine protein-to-creatinine ratio divides urine protein by urine
        creatinine (same concentration units) to approximate daily protein
        excretion without a full 24-hour collection. Creatinine helps normalize
        for how dilute or concentrated the urine is. An elevated ratio can mean
        the kidneys may be leaking protein and needs clinical interpretation —
        this quiz does not diagnose disease.
      </p>

      <h2
        id="quiz-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_PCR_FAQS]} />
      </div>
    </article>
  );
}
