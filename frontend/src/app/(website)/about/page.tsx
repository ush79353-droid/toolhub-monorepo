import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About Omega Calculators',
  description:
    'Omega Calculators is a free collection of online calculators and converters, with the formula and a worked example on the same page.',
};

function operatorSentence(): string | null {
  const { name, city, country } = siteConfig.operator;
  const place = [city, country].filter(Boolean).join(', ');
  if (name && place) return `${siteConfig.name} is run by ${name}, based in ${place}.`;
  if (name) return `${siteConfig.name} is run by ${name}.`;
  if (place) return `${siteConfig.name} is based in ${place}.`;
  return null;
}

export default function AboutPage() {
  const operator = operatorSentence();
  const email = siteConfig.operator.email.trim();

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'About' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">About us</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A free collection of calculators and converters, with the formula and a worked example on the same page.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">About Omega Calculators</h2>
              <p className="mt-4 text-muted-foreground">
                Omega Calculators is a free collection of online calculators and converters. We built it for people
                who want a clear answer without hunting through ads, sign-ups, or confusing pages.
              </p>
              {operator ? <p className="mt-4 text-muted-foreground">{operator}</p> : null}
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">What you will find here</h2>
              <p className="mt-4 text-muted-foreground">
                Our tools cover everyday money questions, health and fitness, math, unit conversions, cooking,
                construction, and more. Each tool sits on its own page with the calculator at the top, then a
                plain-language explanation of how it works, the formula it uses, a worked example, and answers to
                common questions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">How we build our tools</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground">
                <li>
                  <span className="font-medium text-accent">Clear formulas.</span> Every calculator shows the formula
                  behind its result, so you can check it yourself.
                </li>
                <li>
                  <span className="font-medium text-accent">Worked examples.</span> We show a real example with real
                  numbers, so you can see how the answer is reached.
                </li>
                <li>
                  <span className="font-medium text-accent">Testing.</span> We test each published calculator against
                  known results before it goes live.
                </li>
                <li>
                  <span className="font-medium text-accent">Fixes.</span> If you find a mistake, tell us. We correct
                  errors.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Free to use</h2>
              <p className="mt-4 text-muted-foreground">
                Omega Calculators is free. The site is supported by advertising, which lets us keep the tools open
                to everyone without asking you to create an account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Important to know</h2>
              <p className="mt-4 text-muted-foreground">
                Our calculators give estimates for information and education. They are not financial, medical, legal,
                or professional advice. Please read the{' '}
                <Link href="/terms-of-service#disclaimers" className="font-medium text-primary hover:underline">
                  disclaimer
                </Link>{' '}
                before relying on any result. The full terms are on the{' '}
                <Link href="/terms-of-service" className="font-medium text-primary hover:underline">
                  terms of service
                </Link>{' '}
                page, and how we handle information is on the{' '}
                <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                  privacy policy
                </Link>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Contact</h2>
              <p className="mt-4 text-muted-foreground">
                Questions, ideas for new tools, or a mistake to report?{' '}
                {email ? (
                  <>
                    Write to us at{' '}
                    <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                      {email}
                    </a>{' '}
                    or use our{' '}
                  </>
                ) : (
                  'Use our '
                )}
                <Link href="/contact" className="font-medium text-primary hover:underline">
                  contact page
                </Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
