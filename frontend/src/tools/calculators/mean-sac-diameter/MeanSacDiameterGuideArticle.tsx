import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MSD_FAQS } from './content';

const SOURCE_LABEL =
  'MSD = (L+W+H)/3 mm; approximate GA days ≈ MSD + 30 (Hellman/Nyberg early-pregnancy teaching). Age gated to early MSD window; prefer CRL once an embryo is measurable (SOGC No. 303).';

export function MeanSacDiameterGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Mean Sac Diameter Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter length, width, and height of the gestational sac (inner fluid
        interfaces) to compute mean sac diameter and, when appropriate, an
        approximate early menstrual age.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It averages three orthogonal diameters and optionally applies the
        historical MSD + 30 days approximation. It does not diagnose miscarriage
        or establish a delivery date.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas and Dating Window
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_LABEL}
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Length 12 mm, width 15 mm, height 18 mm → MSD 15 mm → approximate age 45
        days.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Outside the early MSD window the age field stays blank even though MSD
        is shown. Once a crown–rump length is measurable, use CRL dating
        instead.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/crown-rump-length-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Crown-rump Length Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gestational-age-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Gestational Age Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="msd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...MSD_FAQS]} />
      </div>
    </article>
  );
}
