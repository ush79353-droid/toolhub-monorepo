import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DUKE_TREADMILL_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function DukeTreadmillScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Duke Treadmill Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter Bruce-protocol exercise duration, maximal ST-segment deviation,
        and angina symptoms to see the classic Duke treadmill score. This page
        is educational arithmetic only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Duke Treadmill Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mark and colleagues combined treadmill exercise time, ST-segment
        deviation, and angina into a single score used in cardiovascular
        teaching and research. This calculator stops at the numeric score.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Score Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DTS = exercise duration (min) − 5 × max ST deviation (mm) − 4 × angina
        index, where angina index is 0 (none), 1 (non-limiting), or 2
        (exercise-limiting). {SOURCE_NOTE}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter Bruce treadmill exercise duration in minutes.</li>
        <li>Enter maximal ST-segment deviation in millimeters.</li>
        <li>Select the angina index radio that matches the test.</li>
        <li>Read the Duke treadmill score when both numeric fields are set.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Duration 10 min and ST deviation 1 mm yields scores 5 (no angina), 1
        (non-limiting), and −3 (limiting angina).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not use this tool to decide catheterization, discharge, or medical
        therapy. ECG measurement and treadmill interpretation belong with
        clinicians.
      </p>

      <h2
        id="dts-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...DUKE_TREADMILL_FAQS]} />
      </div>
    </article>
  );
}
