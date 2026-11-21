import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MEAL_CALORIE_FAQS } from './content';
import { ACTIVITY_OPTIONS } from './types';

export function MealCalorieGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Meal Calorie Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Divide a daily calorie target into breakfast, lunch, dinner, and
        optional snacks. Each meal gets a rounded center target plus a flexible
        min–max band you can nudge day to day.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter a daily kcal total (default 2,000) or turn on maintenance mode to
        estimate required calories from body metrics. Pick three, four, or five
        meals per day. The tool applies the percentage split, rounds each
        center to whole kcal, and reconciles so the meal centers add up to your
        daily total.
      </p>

      <h2
        id="splits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Meal Splits
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <strong>Three meals:</strong> breakfast 32.5% (30–35%), lunch 37.5%
          (35–40%), dinner 30% (25–35%).
        </li>
        <li>
          <strong>Four meals:</strong> breakfast 27.5%, morning snack 7.5%,
          lunch 37.5%, dinner 27.5% with matching min–max bands.
        </li>
        <li>
          <strong>Five meals:</strong> adds an afternoon snack at 7.5% and
          shifts dinner to 17.5% (15–20%).
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example at 2,000 kcal with three meals: breakfast 650 kcal (600–700),
        lunch 750 kcal (700–800), dinner 600 kcal (500–700).
      </p>

      <h2
        id="maintenance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Maintenance Option
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When “Calculate required calories” is checked, daily kcal comes from the
        shared Maintenance Calorie engine:{' '}
        <strong>Mifflin–St Jeor BMR × PAL</strong> (Mifflin et al., 1990). PAL
        options match that calculator:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        {ACTIVITY_OPTIONS.map((o) => (
          <li key={o.id}>
            {o.label} — PAL {o.pal}
          </li>
        ))}
      </ul>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Leave required-calories unchecked, enter 2,000 kcal/day, choose three
        meals → breakfast 650 kcal, lunch 750 kcal, dinner 600 kcal with the
        bands above.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational split guide only. Share copies the public page URL—not your
        typed calories or body metrics. Not medical nutrition advice.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/maintenance-calorie-calculator">
            Maintenance Calorie Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/calorie-intake-calculator-simple">
            Calorie Intake Calculator (Simple)
          </Link>
        </li>
        <li>
          <Link href="/tools/calorie-calculator">Calorie Calculator</Link>
        </li>
      </ul>

      <h2
        id="meal-calorie-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={MEAL_CALORIE_FAQS} />
      </div>
    </article>
  );
}