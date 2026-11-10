import * as React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Wrench, Shield, FileText, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/sample-data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white pt-14 pb-8 text-foreground">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-accent">
                MEGA<span className="text-primary">TOOLS</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your comprehensive platform for fast, free, in-browser online tools. From financial
              calculators and unit converters to developer formatters and PDF utilities.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-accent">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Client-Side In-Browser Execution</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Categories</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 6).map((cat) => (
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
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>All Categories</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Quick Tools</h4>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Platform</h4>
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
          <p>© {currentYear} Mega Tools. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for productivity, accuracy, and accessibility.
          </p>
        </div>
      </Container>
    </footer>
  );
}
