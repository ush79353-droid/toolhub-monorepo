import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
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

export default function ContactPage() {
  const email = siteConfig.operator.email.trim();
  const businessEmail = siteConfig.contact.businessEmail.trim();
  const phone = siteConfig.contact.phone.trim();
  const responseTime = siteConfig.contact.responseTime.trim();
  const place = [siteConfig.operator.city, siteConfig.operator.country]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
  const address = [siteConfig.contact.company, siteConfig.contact.street]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');

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
              We read every message. Use the form for a question, a correction, or an idea for a new tool.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-10 sm:py-14">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-4 lg:gap-8">
            <aside className="rounded-2xl border border-border bg-white p-5 shadow-xs lg:col-span-1">
              <h2 className="font-sans text-sm font-semibold text-accent">Contact details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                {email ? (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={mailHref(email)} className="mt-0.5 block break-all font-medium text-accent hover:text-primary">
                        {email}
                      </a>
                    </div>
                  </li>
                ) : null}
                {businessEmail ? (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-muted-foreground">Business</p>
                      <a
                        href={mailHref(businessEmail)}
                        className="mt-0.5 block break-all font-medium text-accent hover:text-primary"
                      >
                        {businessEmail}
                      </a>
                    </div>
                  </li>
                ) : null}
                {phone ? (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-0.5 block font-medium text-accent hover:text-primary">
                        {phone}
                      </a>
                    </div>
                  </li>
                ) : null}
                {place || address ? (
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      {address ? <p className="mt-0.5 font-medium text-accent">{address}</p> : null}
                      {place ? <p className="mt-0.5 font-medium text-accent">{place}</p> : null}
                    </div>
                  </li>
                ) : null}
              </ul>
              {responseTime ? (
                <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                  We aim to reply within {responseTime}.
                </p>
              ) : null}
            </aside>

            <div className="lg:col-span-3">
              <ContactForm email={email} businessEmail={businessEmail} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-sans text-base font-semibold text-accent">Report a mistake</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Name the tool, the numbers you entered, the result you got, and the result you expected. A source
                helps us check it. In the subject, write “Error report:” and the tool name.
              </p>
            </div>
            <div>
              <h2 className="font-sans text-base font-semibold text-accent">Suggest a tool</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell us what you need to calculate, and which inputs and result you would like. Those notes decide
                what we build next.
              </p>
            </div>
            <div>
              <h2 className="font-sans text-base font-semibold text-accent">General questions</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Questions about the site, or a note about how a tool could be clearer, can go through the form with
                the subject General.
              </p>
            </div>
            <div>
              <h2 className="font-sans text-base font-semibold text-accent">Advertising and press</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Partnerships, advertising, and press notes use the business address when one is listed, or the
                subject Business on the form.
              </p>
            </div>
          </div>
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            We cannot give personal financial, medical, or legal advice. For those questions, speak to a qualified
            professional. Read the{' '}
            <Link href="/disclaimer" className="font-medium text-primary hover:underline">
              disclaimer
            </Link>{' '}
            before relying on a calculator result.
          </p>
        </Container>
      </section>
    </div>
  );
}
