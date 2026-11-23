import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CRL_FAQS } from './content';
import {
  MAX_CRL_MM,
  MIN_CRL_MM,
  ROBINSON_INTERCEPT,
  ROBINSON_SQRT_COEFF,
  SOURCE_LABEL,
  gestationalAgeDaysFromCrlMm,
  splitGestationalAge,
} from './calculation';

export function CrownRumpLengthGuideArticle() {
  const early = gestationalAgeDaysFromCrlMm(10)!;
  const mid = gestationalAgeDaysFromCrlMm(30)!;
  const late = gestationalAgeDaysFromCrlMm(60)!;
  const earlySplit = splitGestationalAge(early);
  const midSplit = splitGestationalAge(mid);
  const lateSplit = splitGestationalAge(late);

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Crown-rump Length Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter an ultrasound crown–rump length to see an educational estimate of
        menstrual gestational age in the first trimester.
      </p>

      <h2
        id="what-is-crl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is CRL?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Crown–rump length is the straight measurement from the top of the fetal
        head to the bottom of the torso on early pregnancy ultrasound. ACOG
        guidance treats early CRL dating as a primary method for estimating the
        due date when a reliable measurement is available.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Robinson–Fleming Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        GA days = {ROBINSON_SQRT_COEFF} × √(CRL_mm) + {ROBINSON_INTERCEPT}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter CRL and choose mm, cm, or in.</li>
        <li>Read gestational age as total days or weeks + days.</li>
        <li>Use the Early / Mid / Late examples to check fixtures.</li>
      </ol>

      <h2
        id="examples"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Examples
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Early ({MIN_CRL_MM <= 10 ? '10' : MIN_CRL_MM} mm) → {early} days (
          {earlySplit.weeks}w {earlySplit.days}d)
        </li>
        <li>
          Mid (30 mm) → {mid} days ({midSplit.weeks}w {midSplit.days}d)
        </li>
        <li>
          Late (60 mm) → {late} days ({lateSplit.weeks}w {lateSplit.days}d)
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Supported CRL band: {MIN_CRL_MM}–{MAX_CRL_MM} mm.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After about 14 weeks, CRL becomes less reliable. Use fetal biometry
        (for example the fetal weight percentile calculator) instead of
        extrapolating this equation.
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
            href="/tools/fetal-weight-percentile-calculator"
            className="text-primary hover:underline"
          >
            Fetal Weight Percentile Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gestational-age-calculator"
            className="text-primary hover:underline"
          >
            Gestational Age Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/due-date-calculator"
            className="text-primary hover:underline"
          >
            Due Date Calculator
          </Link>
        </li>
      </ul>

      <div id="crl-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...CRL_FAQS]} />
        </div>
      </div>
    </article>
  );
}
