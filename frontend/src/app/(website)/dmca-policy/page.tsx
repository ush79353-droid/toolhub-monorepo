import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'DMCA Policy',
  description:
    'How to send a copyright notice or counter-notice to Omega Calculators under the DMCA.',
};

const linkClass = 'font-medium text-primary hover:underline';

export default function DmcaPolicyPage() {
  const email = siteConfig.operator.email.trim();
  const place = [siteConfig.contact.company, siteConfig.operator.city, siteConfig.operator.country]
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
          <Breadcrumbs items={[{ label: 'DMCA Policy' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">DMCA policy</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Last updated: {siteConfig.dmca.updated}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-muted-foreground">
            <p>
              {siteConfig.name} respects the intellectual property of others and expects people who use the Site to do
              the same. This page explains how to send a copyright notice under the Digital Millennium Copyright Act
              (DMCA), and how to send a counter-notice if you believe material was removed by mistake.
            </p>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">1. Sending a notice</h2>
              <p className="mt-4">
                If you believe material on the Site infringes a copyright you own or control, send a written notice
                that includes all of the following:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Your physical or electronic signature</li>
                <li>A description of the copyrighted work you claim has been infringed</li>
                <li>The URL, or another clear location, of the material you want removed</li>
                <li>Your name, mailing address, telephone number, and email address</li>
                <li>A statement that you have a good-faith belief the use is not authorized by the owner, its agent, or the law</li>
                <li>
                  A statement, under penalty of perjury, that the information in the notice is accurate and that you
                  are the copyright owner or are authorized to act for the owner
                </li>
              </ul>
              <p className="mt-4">
                Send the notice
                {email ? (
                  <>
                    {' '}
                    to{' '}
                    <a href={`mailto:${email}?subject=${encodeURIComponent('DMCA notice')}`} className={linkClass}>
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
                {place ? <>, or to {place}</> : null}. We may remove or disable access to the material while we review
                the notice. A notice that leaves out required information may not be acted on.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">2. Counter-notice</h2>
              <p className="mt-4">
                If your material was removed and you believe that was a mistake, or that you have the right to use it,
                you may send a counter-notice that includes:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that was removed and where it appeared before removal</li>
                <li>
                  A statement, under penalty of perjury, that you have a good-faith belief the material was removed by
                  mistake or misidentification
                </li>
                <li>Your name, mailing address, telephone number, and email address</li>
                <li>
                  A statement that you consent to the jurisdiction of the federal court for the judicial district where
                  your address is located, or, if you are outside the United States, for any judicial district in which
                  the Site may be found, and that you will accept service of process from the person who sent the
                  original notice
                </li>
              </ul>
              <p className="mt-4">
                Send the counter-notice to the same address. If the notice was valid, we may restore the material
                after the period the DMCA allows, unless the person who sent the notice files a court action.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">3. Repeat infringement</h2>
              <p className="mt-4">
                We may close access for anyone who repeatedly infringes copyright, when the circumstances make that
                appropriate.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">4. Good faith</h2>
              <p className="mt-4">
                Please consider whether a use is permitted before you send a notice. The DMCA provides penalties for
                knowing material misrepresentations in a notice or a counter-notice. This page is our notice process.
                It is not legal advice. The statute is described by the{' '}
                <a
                  href="https://www.copyright.gov/dmca/"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  U.S. Copyright Office
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
