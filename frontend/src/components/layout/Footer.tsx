import * as React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Shield, FileText, ArrowRight } from 'lucide-react';
import { getPublicCategories } from '@/server/catalog/categories';

export async function Footer() {
  const categories = await getPublicCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white pt-14 pb-8 text-foreground">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex">
              <img
                src="/images/logo/horizontal-logo.png"
                alt="Omega Calculators"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your comprehensive platform for fast, free, in-browser online tools. From financial
              calculators and unit converters to developer formatters and PDF utilities.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-accent">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Client-Side In-Browser Execution</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Categories
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <span>All Categories</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Quick Tools
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/tools/age-calculator"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/bmi-calculator"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/percentage-calculator"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Percentage Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/word-counter"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Word Counter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/json-formatter"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/password-generator"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Password Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">Platform</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} Omega Calculators. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for productivity, accuracy, and accessibility.
          </p>
        </div>
      </Container>
    </footer>
  );
}
