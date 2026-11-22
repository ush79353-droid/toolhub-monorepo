import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms for using Omega Calculators, including estimates, acceptable use, and the disclaimer.',
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

export default function TermsOfServicePage() {
  const email = siteConfig.operator.email.trim();
  const owner = siteConfig.contact.company.trim() || siteConfig.operator.name.trim();
  const country = siteConfig.operator.country.trim();
  const court = [siteConfig.operator.city, siteConfig.operator.country]
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
          <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">Terms of service</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Last updated: {siteConfig.terms.updated}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12 text-base leading-relaxed text-muted-foreground">
            <p>
              Welcome to {siteConfig.name}. By using {publicHost()} (the “Site”), you agree to these Terms. If you do
              not agree, please do not use the Site.
            </p>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">1. What the Site offers</h2>
              <p className="mt-4">
                The Site provides free online calculators, converters, and related information. Tools are provided for
                general information and education only.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">2. No professional advice</h2>
              <p className="mt-4">
                Nothing on the Site is financial, medical, legal, tax, engineering, or other professional advice.
                Results are estimates based on the numbers you enter and on general formulas. See our{' '}
                <Link href="#disclaimers" className={linkClass}>
                  disclaimer
                </Link>
                . Always check important results and consult a qualified professional before making decisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">3. Accuracy</h2>
              <p className="mt-4">
                We work to keep our tools and content accurate and up to date, but we do not guarantee that they are
                free from errors, complete, or current. Rates, rules, and standards change. You are responsible for
                checking results before relying on them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">4. Acceptable use</h2>
              <p className="mt-4">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Use the Site for anything unlawful or harmful</li>
                <li>Try to hack, overload, disrupt, or reverse-engineer the Site, or bypass its security</li>
                <li>
                  Use bots, scrapers, or automated tools to copy large parts of the Site or its tools without our
                  written permission
                </li>
                <li>Copy, republish, or sell our content or calculators without permission</li>
                <li>Use the Site in a way that interferes with others’ use of it</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">5. Intellectual property</h2>
              <p className="mt-4">
                The Site, including its text, design, logo, code, and calculators, is owned by{' '}
                {owner || siteConfig.name} or its licensors and is protected by copyright and other laws. You may use
                the Site for your own personal, non-commercial use. You may link to our pages freely. You may quote
                short extracts with a link back to the source page. Any other use needs our written permission.
              </p>
              <p className="mt-4">
                Where a tool offers an embed, you may place that embed on your own site only as we provide it. Do not
                change the embed to hide its source, and do not present it as your own calculator or as our endorsement
                of your site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">
                6. Third-party content, ads and links
              </h2>
              <p className="mt-4">
                The Site contains advertising and links to other websites. We do not control and are not responsible
                for third-party content, products, or services, and a link or ad is not an endorsement.
              </p>
            </div>

            <div id="disclaimers">
              <h2 className="text-2xl font-semibold tracking-tight text-accent">7. Disclaimer of warranties</h2>
              <p className="mt-4">
                The Site and its tools are provided “as is” and “as available”, without warranties of any kind, whether
                express or implied, including fitness for a particular purpose, accuracy, or uninterrupted or error-free
                operation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">8. Limitation of liability</h2>
              <p className="mt-4">
                To the fullest extent allowed by law, {siteConfig.name} and its owners will not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or
                goodwill, arising from your use of, or inability to use, the Site or from reliance on any result. Where
                the law does not allow some of these limits, our liability is limited to the smallest amount the law
                permits.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">9. Changes to the Site and the Terms</h2>
              <p className="mt-4">
                We may change, suspend, or remove any part of the Site at any time, and we may update these Terms. The
                “Last updated” date shows when. Continued use after changes means you accept the new Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">10. Governing law</h2>
              <p className="mt-4">
                {country ? (
                  <>These Terms are governed by the laws of {country}, without regard to conflict-of-law rules.</>
                ) : (
                  <>These Terms are governed without regard to conflict-of-law rules.</>
                )}{' '}
                {court ? (
                  <>
                    Disputes will be handled in the courts of {court}, unless the law of your country gives you other
                    rights.
                  </>
                ) : (
                  <>The law of your country may give you other rights.</>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-accent">11. Contact</h2>
              <p className="mt-4">
                {email ? (
                  <>
                    Questions about these Terms:{' '}
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Questions about these Terms can be sent through our{' '}
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
