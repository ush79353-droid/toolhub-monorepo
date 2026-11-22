import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Omega Calculators gives estimates for information and education. Results are not financial, medical, legal, or professional advice.',
};

const linkClass = 'font-medium text-primary hover:underline';

export default function DisclaimerPage() {
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
          <Breadcrumbs items={[{ label: 'Disclaimer' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">Disclaimer</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Last updated: {siteConfig.disclaimer.updated}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-muted-foreground">
            <p>
              The calculators, converters, and articles on {siteConfig.name} are provided for general information and
              educational purposes only.
            </p>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Not professional advice</h2>
              <div className="mt-4 space-y-4">
                <p>
                  <span className="font-medium text-accent">Financial and business calculators</span> (such as loan,
                  mortgage, interest, investment, tax, and salary tools) give estimates based on the numbers you enter.
                  They do not take your full situation into account and are not financial, investment, tax, or legal
                  advice. Real offers from lenders, banks, and tax authorities may differ. Please speak to a qualified
                  financial adviser before making financial decisions.
                </p>
                <p>
                  <span className="font-medium text-accent">Health and fitness calculators</span> (such as BMI,
                  calorie, macro, body fat, and pregnancy tools) give general estimates. They are not a medical
                  diagnosis, treatment, or advice, and they are not a substitute for a doctor, dietitian, or other
                  qualified health professional. If you have a medical condition or concerns about your health, please
                  consult a professional. Never ignore or delay medical advice because of something you read on this
                  Site.
                </p>
                <p>
                  <span className="font-medium text-accent">
                    Construction, engineering, chemistry, and science calculators
                  </span>{' '}
                  are for planning and learning. Do not use them as the only basis for safety-critical, structural, or
                  professional work. Have a qualified professional check the work.
                </p>
                <p>
                  <span className="font-medium text-accent">Cooking and food calculators</span> give guideline values.
                  Cooking times, temperatures, and food safety depend on your equipment and ingredients. Always follow
                  official food-safety guidance.
                </p>
                <p>
                  <span className="font-medium text-accent">Unit converters</span> use standard conversion factors and
                  rounding. Results may be rounded for display.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Accuracy</h2>
              <p className="mt-4">
                We work hard to make our tools correct and keep them up to date, but we cannot promise they are
                error-free. Rates, laws, rules, and standards change over time. Check results against an official or
                professional source before relying on them. If you find an error, please tell us
                {email ? (
                  <>
                    {' '}
                    at{' '}
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </>
                ) : (
                  <>
                    {' '}
                    through our{' '}
                    <Link href="/contact" className={linkClass}>
                      contact page
                    </Link>
                  </>
                )}
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Use at your own risk</h2>
              <p className="mt-4">
                You use the Site and its results at your own risk. {siteConfig.name} and its owners are not liable for
                any loss or damage resulting from your use of, or reliance on, any calculator or content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Advertising and external links</h2>
              <p className="mt-4">
                The Site shows ads and may link to other websites. We do not control or endorse them, and we are not
                responsible for their content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Examples and illustrations</h2>
              <p className="mt-4">
                Examples on our pages use sample numbers to show how a calculation works. They are not predictions,
                quotes, or recommendations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Contact</h2>
              <p className="mt-4">
                {email ? (
                  <>
                    Questions about this disclaimer:{' '}
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about this disclaimer can be sent through our{' '}
                    <Link href="/contact" className={linkClass}>
                      contact page
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
