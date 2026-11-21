import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact Omega Calculators',
  description:
    'Write to Omega Calculators with a question, a calculator mistake, a tool idea, or a business note. The form opens your email app.',
};

function mailHref(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function MailLine({ email, subject }: { email: string; subject?: string }) {
  if (!email) return null;
  return (
    <p className="mt-4 text-muted-foreground">
      Email:{' '}
      <a href={mailHref(email, subject)} className="font-medium text-primary hover:underline">
        {email}
      </a>
    </p>
  );
}

function postalAddress(): string | null {
  const line = [
    siteConfig.contact.company,
    siteConfig.contact.street,
    siteConfig.operator.city,
    siteConfig.operator.country,
  ]
    .map((part) => part.trim())
    .filter(Boolean);
  return line.length > 0 ? line.join(', ') : null;
}

export default function ContactPage() {
  const email = siteConfig.operator.email.trim();
  const businessEmail = siteConfig.contact.businessEmail.trim();
  const responseTime = siteConfig.contact.responseTime.trim();
  const address = postalAddress();

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">Contact</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We read every message. Here is the best way to reach us for each kind of question.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted/30 py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <ContactForm email={email} businessEmail={businessEmail} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">General questions and feedback</h2>
              <p className="mt-4 text-muted-foreground">
                Questions about the site, or a note about how a tool could be clearer, belong here.
              </p>
              <MailLine email={email} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Report a mistake in a calculator</h2>
              <p className="mt-4 text-muted-foreground">
                Please include the name of the tool, the numbers you entered, the result you got, and the result you
                expected. A source helps us check it. That is enough to find and fix the problem quickly. Use the
                subject “Error report:” followed by the tool name.
              </p>
              <MailLine email={email} subject="Error report:" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Suggest a new tool</h2>
              <p className="mt-4 text-muted-foreground">
                Tell us what you need to calculate, and which inputs and result you would like. We use these ideas to
                decide which tools to build next.
              </p>
              <MailLine email={email} subject="Tool suggestion" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">
                Advertising, partnerships and press
              </h2>
              <p className="mt-4 text-muted-foreground">
                Advertising, partnership, and press notes belong here.
              </p>
              <MailLine email={businessEmail} />
            </div>

            {responseTime ? (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-accent">Response time</h2>
                <p className="mt-4 text-muted-foreground">We aim to reply within {responseTime}.</p>
              </div>
            ) : null}

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">Please note</h2>
              <p className="mt-4 text-muted-foreground">
                We cannot give personal financial, medical, or legal advice by email. For those questions, please
                speak to a qualified professional. Read the{' '}
                <Link href="/terms-of-service#disclaimers" className="font-medium text-primary hover:underline">
                  disclaimer
                </Link>{' '}
                before relying on a calculator result.
              </p>
            </div>

            {address ? (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-accent">Address</h2>
                <p className="mt-4 text-muted-foreground">{address}</p>
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  );
}
