import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BODY_FRAME_SIZE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BodyFrameSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Body Frame Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a height-to-wrist body frame index and map it to small, medium,
        or large teaching categories. Educational only — not a clinical bone
        assessment.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is body frame size?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Frame-size heuristics compare skeletal breadth (often via wrist
        circumference) with height. They are historical teaching aids used with
        height–weight tables and are not substitutes for body composition or
        densitometry.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the index works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: female height 1.70 m and wrist 16 cm → index
        10.63 → medium frame.
      </p>

      <h2
        id="thresholds"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sex-specific thresholds
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A higher index means a relatively slender wrist for height (smaller
        frame). Medium bands are inclusive at both ends; values just outside
        those bands flip to small or large.
      </p>

      <div id="bfs-faq" className="not-prose mt-8">
        <FAQAccordion items={BODY_FRAME_SIZE_FAQS} />
      </div>
    </article>
  );
}
