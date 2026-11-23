import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What Omega Calculators collects, how calculator entries stay in your browser, and the choices you have.',
};

const linkClass = 'font-medium text-primary hover:underline';

function publicHost(): string {
  try {
    const host = new URL(siteConfig.url).host;
    if (host && !host.includes('localhost')) return host;
  } catch {
    // Fall through to the public name.
  }
  return 'omegacalculators.com';
}

export default function PrivacyPolicyPage() {
  const email = siteConfig.operator.email.trim();
  const place = [siteConfig.contact.company, siteConfig.operator.city, siteConfig.operator.country]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
  const retention = siteConfig.privacy.emailRetention.trim();

  return (
    <div>
      <section className="relative border-b border-border bg-gradient-to-br from-[#cfeeed] via-[#e7f6f4] to-[#f4f7f2]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffffff,hsl(177,42%,78%))]" />
          <div className="absolute -right-20 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,hsl(175,35%,84%))]" />
          <div className="absolute bottom-10 right-[18%] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_40%,#ffffff,hsl(186,35%,86%))]" />
        </div>
        <Container className="relative z-10 py-10 sm:py-14">
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">Privacy policy</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Last updated: {siteConfig.privacy.updated}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-muted-foreground">
            <p>
              This privacy policy explains what information {siteConfig.name} (“we”, “us”, “our”) collects when you
              visit {publicHost()} (the “Site”), how we use it, and the choices you have. By using the Site you agree
              to this policy.
            </p>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">1. Information we collect</h2>
              <div className="mt-4 space-y-4">
                <p>
                  <span className="font-medium text-accent">Numbers you enter into calculators.</span> Our calculators
                  run in your web browser. The values you type are used to produce your result on your device. They
                  are not saved as an account. The California sales tax tool is different: it sends the purchase
                  amount and the address you enter to our server so it can look up the local rate. Currency tools
                  load a stored list of exchange rates. They do not send your amounts to an exchange-rate service.
                </p>
                <div>
                  <p>
                    <span className="font-medium text-accent">Information collected automatically.</span> Like most
                    websites, when you visit, we and our service providers may collect:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>Your IP address (usually shortened or approximate)</li>
                    <li>Browser type and version, device type, and operating system</li>
                    <li>Pages you visit, time spent, and the page you came from</li>
                    <li>Approximate location (country or city level) derived from your IP address</li>
                  </ul>
                </div>
                <p>
                  <span className="font-medium text-accent">Information you give us.</span> If you contact us by email
                  or through the form, we receive your name, email address, and the message you send. The form opens
                  your own email app. We do not store that form on the Site. We use the message only to reply to you.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">2. Cookies and similar technologies</h2>
              <p className="mt-4">
                Cookies are small files stored on your device. We and our partners use them to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Make the Site work and remember simple preferences, including tools you opened recently</li>
                <li>Measure traffic and understand which tools are used (analytics)</li>
                <li>Show and measure advertising</li>
              </ul>
              <p className="mt-4">
                You can control cookies in your browser settings. If you block some cookies, parts of the Site may not
                work as expected.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">3. Analytics</h2>
              <p className="mt-4">
                The Site does not currently load Google Analytics. If we add it, it collects information such as pages
                viewed and approximate location. You can opt out of Google Analytics with the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className={linkClass}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">4. Advertising</h2>
              <p className="mt-4">
                The Site is supported by advertising. When ads are shown, third-party advertising companies, including
                Google AdSense, may place them. We do not control the cookies set by these third parties. Please check
                their own privacy policies for details.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on your previous visits to
                  this Site and other sites on the internet.
                </li>
                <li>
                  Google’s use of advertising cookies enables it and its partners to serve ads to you based on your
                  visit to our Site and other sites.
                </li>
                <li>
                  You can opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://adssettings.google.com/"
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can also opt out of some third-party vendors’ use of cookies for personalized advertising at{' '}
                  <a
                    href="https://www.aboutads.info/choices"
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aboutads.info
                  </a>
                  .
                </li>
                <li>
                  To learn more about how Google uses data from sites that use its services, see{' '}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    className={linkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    How Google uses information from sites or apps that use our services
                  </a>
                  .
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">5. How we use information</h2>
              <p className="mt-4">We use the information we collect to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Operate, maintain, and improve the Site and our calculators</li>
                <li>Understand which tools people use and decide what to build next</li>
                <li>Show advertising that helps pay for the Site</li>
                <li>Respond to your messages</li>
                <li>Detect and prevent fraud, abuse, and security problems</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">
                6. Legal bases (for visitors in the EEA and UK)
              </h2>
              <p className="mt-4">
                Where the GDPR applies, we process personal data based on our legitimate interests in running and
                improving the Site, your consent for non-essential cookies and personalized advertising, and legal
                obligations. You can refuse non-essential cookies in your browser. The Site does not yet have its own
                cookie-settings page. Personalized ads for visitors in the EEA and UK need a certified consent
                platform before they are served.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">7. Sharing of information</h2>
              <p className="mt-4">
                We do not sell your personal information for money. We may share information with:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Service providers who help us run the Site (hosting, analytics, advertising)</li>
                <li>Authorities, when the law requires it</li>
                <li>A successor, if the Site is sold or merged</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">8. Data retention</h2>
              <p className="mt-4">
                We keep information only as long as needed for the purposes above or as the law requires.
                {retention
                  ? ` Emails you send us are kept for ${retention} unless we need them longer to resolve an issue.`
                  : null}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">9. Your rights</h2>
              <p className="mt-4">
                Depending on where you live, you may have the right to access, correct, delete, or restrict the use of
                your personal data, to object to its use, to withdraw consent, and to complain to your local data
                protection authority. California residents may also have rights under the CCPA/CPRA, including to know
                what we collect and to opt out of the “sale” or “sharing” of personal information for advertising. To
                use any of these rights,{' '}
                {email ? (
                  <>
                    email{' '}
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </>
                ) : (
                  <>
                    write through our{' '}
                    <Link href="/contact" className={linkClass}>
                      contact page
                    </Link>
                  </>
                )}
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">10. Children</h2>
              <p className="mt-4">
                The Site is not directed at children under 13, and we do not knowingly collect personal information
                from them. If you believe a child has given us personal information, contact us and we will delete it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">11. Security</h2>
              <p className="mt-4">
                We take reasonable steps to protect information, including HTTPS encryption. No method of transmission
                or storage is completely secure, so we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">12. Links to other sites</h2>
              <p className="mt-4">
                The Site may link to other websites. We are not responsible for their content or privacy practices.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">13. International transfers</h2>
              <p className="mt-4">
                Our service providers may process data in countries other than your own, including the United States.
                Where required, we rely on appropriate safeguards.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">14. Changes to this policy</h2>
              <p className="mt-4">
                We may update this policy from time to time. The “Last updated” date at the top shows when. Continued
                use of the Site after changes means you accept them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">15. Contact us</h2>
              <p className="mt-4">
                {email ? (
                  <>
                    Questions about this policy:{' '}
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </>
                ) : (
                  <>
                    Questions about this policy can be sent through our{' '}
                    <Link href="/contact" className={linkClass}>
                      contact page
                    </Link>
                  </>
                )}
                .
              </p>
              {place ? <p className="mt-2">{place}</p> : null}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
