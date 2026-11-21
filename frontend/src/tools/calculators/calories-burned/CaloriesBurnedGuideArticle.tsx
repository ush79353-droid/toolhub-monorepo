import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CALORIES_BURNED_FAQS } from './content';

export function CaloriesBurnedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Calories Burned Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates gross calories burned during a single activity
        session. You choose an activity from the 2011 Adult Compendium of
        Physical Activities, enter body weight and either time or (for some
        paces) distance, then press Calculate. Results are educational
        estimates—not clinical measurements.
      </p>

      <h2
        id="compendium"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Adult Compendium METs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MET values come from the{' '}
        <a
          href="https://sites.google.com/site/compendiumofphysicalactivities/"
          className="font-medium text-primary underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          2011 Compendium of Physical Activities
        </a>{' '}
        (Ainsworth et al.). Each dropdown option maps to a documented MET for a
        specific activity and, where applicable, pace (for example running 6 mph
        or cycling 12–13.9 mph).
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calorie Burn Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>kcal = MET × 3.5 × weight (kg) × minutes ÷ 200</p>
        <p>Calories per hour ≈ total kcal ÷ (minutes ÷ 60)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: MET 6.0, 70 kg, 45 minutes → 6 × 3.5 × 70 × 45 ÷ 200 ≈ 331
        kcal. For daily maintenance calories (BMR × activity level), see the{' '}
        <a
          href="/tools/calorie-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Calorie Calculator
        </a>{' '}
        on Omega Calculators.
      </p>

      <h2
        id="distance-mode"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Distance Mode
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For walking, running, and cycling options with a listed mph pace, you can
        enter distance in miles instead of clock time. The tool converts distance
        to minutes with{' '}
        <span className="font-mono text-xs">minutes = (miles ÷ mph) × 60</span>,
        then applies the MET formula. Distance mode is not available for sports,
        aerobics, or home activities without a standard speed.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the activity that best matches your pace or effort.</li>
        <li>
          Enter duration (hours and minutes) or, for supported paces, switch to
          distance and enter miles.
        </li>
        <li>
          Enter body weight in kg or lb (range 35–160 kg / 80–350 lb).
        </li>
        <li>Press Calculate. Use Clear or Reload to reset.</li>
        <li>
          Share copies only the public page URL—your weight and activity are not
          included.
        </li>
      </ol>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MET tables average population data. Individual burn depends on fitness,
        body composition, grade, wind, equipment, and effort drift. This tool does
        not replace medical or dietary counseling. Children, pregnancy, and
        clinical conditions need professional guidance.
      </p>

      <h2
        id="calories-burned-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={CALORIES_BURNED_FAQS} />
      </div>
    </article>
  );
}