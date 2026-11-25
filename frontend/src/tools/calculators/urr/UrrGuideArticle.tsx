import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { KTV_RELATED_SLUG, SOURCE_NOTE } from './calculation';
import { URR_FAQS } from './content';

export function UrrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What does URR stand for, and how to use it?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Urea reduction ratio (URR) estimates how much blood urea fell during a
        hemodialysis session. Enter pre- and post-dialysis urea in matching
        analyte units. Values stay in your browser only — share uses the public
        page URL, never the labs you typed.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate URR in dialysis?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: pre 60 mg/dL and post 18 mg/dL → URR = 70%.
      </p>

      <h2
        id="urr-vs-ktv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        URR versus Kt/V
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        URR is a simple percentage. Kt/V estimates dialysis dose with volume and
        timing assumptions. For a Daugirdas-style estimate, use the{' '}
        <Link
          href={`/tools/${KTV_RELATED_SLUG}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Kt/V Calculator (Daugirdas)
        </Link>
        .
      </p>

      <div id="urr-faq" className="not-prose mt-8">
        <FAQAccordion items={URR_FAQS} />
      </div>
    </article>
  );
}
