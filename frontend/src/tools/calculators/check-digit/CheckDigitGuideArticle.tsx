import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CHECK_DIGIT_FAQS } from './content';

export function CheckDigitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Check Digit Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This Check Digit Calculator generates and verifies GS1 Modulo 10 check
        digits for Global Trade Item Numbers (GTINs). Enter a payload with an
        optional leading-zero count, or paste a complete barcode to validate.
        The tool returns the check digit, the completed GTIN, the weighted sum,
        and a step-by-step breakdown. It supports GTIN-8 / EAN-8, GTIN-12 /
        UPC-A, GTIN-13 / EAN-13, and GTIN-14. Leading zeros are preserved as
        characters — identifiers are never converted to floating-point numbers.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A check digit helps systems catch many data-entry and scanning mistakes.
        It is not encryption, not a proof of authenticity, and not evidence that
        a number is officially assigned to a product. Use this calculator for
        educational and operational checksum checks alongside your GS1 company
        prefix and catalog practices.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Check Digit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A check digit is a calculated digit appended to an identifier so that
        software can detect certain errors when the number is typed, printed, or
        scanned. Product codes, retail barcodes, inventory systems, and logistics
        workflows rely on check digits to reduce silent misidentification. The
        digit is derived from the preceding payload with a public algorithm; it
        does not hide data or authenticate a brand.
      </p>

      <h2
        id="what-gtin"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is GTIN?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GTIN means Global Trade Item Number. Common lengths are GTIN-8 (8
        digits), GTIN-12 (12 digits, often encoded as UPC-A), GTIN-13 (13 digits,
        often encoded as EAN-13), and GTIN-14 (14 digits, often used for
        packaging and logistics trade items). In each case the rightmost digit is
        the Modulo 10 check digit. Do not confuse the numeric GTIN with barcode
        symbology — the same GTIN can be drawn with different bar patterns.
      </p>

      <h2
        id="barcode-numbers"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Do the Numbers in a Barcode Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GS1 structures typically combine an indicator digit (for some formats), a
        company prefix, an item reference, and a check digit. Exact field widths
        depend on the allocated prefix. The first digits of a GTIN are not a
        reliable “country of manufacture” map — prefixes identify GS1 member
        organizations and company assignments, not necessarily where a product
        was made. Always consult current GS1 documentation for allocation rules.
      </p>

      <h2
        id="gs1-mod10"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the GS1 Modulo 10 Algorithm?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Starting at the rightmost payload digit, assign alternating weights of 3
        and 1 moving left. Multiply each digit by its weight, sum the products to
        obtain S, then compute:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>CheckDigit = (10 − (S mod 10)) mod 10</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If S is divisible by 10, the check digit is 0 — never 10. Verification
        recalculates the expected digit from the payload and compares it to the
        supplied final digit.
      </p>

      <h2
        id="how-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a Check Digit
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Write the payload without the check digit; keep leading zeros.</li>
        <li>Assign weights 3, 1, 3, 1… from the right.</li>
        <li>Multiply each digit by its weight.</li>
        <li>Sum the products → S.</li>
        <li>Compute (10 − (S mod 10)) mod 10.</li>
        <li>Append that digit to form the complete GTIN.</li>
      </ol>

      <h2
        id="ean13"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate an EAN-13 Check Digit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payload <code className="rounded bg-muted px-1">400638133393</code>{' '}
        (12 digits). Weighted products from the left with right-origin weights
        sum to S = 89. Remainder = 9. Check digit = (10 − 9) mod 10 = 1. Complete
        EAN-13 / GTIN-13:{' '}
        <code className="rounded bg-muted px-1">4006381333931</code>.
      </p>

      <h2
        id="upc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a UPC-A Check Digit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        UPC-A encodes GTIN-12. Payload example{' '}
        <code className="rounded bg-muted px-1">03600029145</code> (11 digits,
        including a leading zero) → check digit 2 → complete{' '}
        <code className="rounded bg-muted px-1">036000291452</code>. If your
        source omits the leading zero, add it with the leading-zeros control so
        the padded payload stays 11 digits.
      </p>

      <h2
        id="gtin14"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate a GTIN-14 Check Digit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        GTIN-14 uses a 13-digit payload. Example{' '}
        <code className="rounded bg-muted px-1">1001234567890</code> → check
        digit 2 →{' '}
        <code className="rounded bg-muted px-1">10012345678902</code>. The same
        Modulo 10 weights apply; only the payload length changes.
      </p>

      <h2
        id="validate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Validate a Barcode Number
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm the total length matches a supported GTIN.</li>
        <li>Confirm every character is a digit 0–9.</li>
        <li>Separate the final digit as the supplied check digit.</li>
        <li>Recalculate the expected digit from the preceding payload.</li>
        <li>Compare expected vs supplied and report pass or fail.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: <code className="rounded bg-muted px-1">4006381333931</code> is
        valid;{' '}
        <code className="rounded bg-muted px-1">4006381333932</code> is invalid
        (expected 1).
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Are Check Digits Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        They reduce costly mis-scans and mistypes in retail checkout, warehouse
        receiving, inventory adjustments, and product master data. Catching a
        wrong digit early is cheaper than shipping the wrong SKU or posting the
        wrong sales record.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Check Digit Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Weighting from the left instead of the right.</li>
        <li>Dropping leading zeros by using numeric types.</li>
        <li>Including the existing check digit inside the payload sum.</li>
        <li>Using the wrong GTIN length for the intended format.</li>
        <li>Confusing UPC-A (12) with EAN-13 (13) totals.</li>
        <li>Returning 10 when the remainder is 0 instead of 0.</li>
        <li>Treating a valid checksum as proof of GS1 registration.</li>
      </ul>

      <h2
        id="vs-checksum"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Check Digits vs. Checksums
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A checksum is any validation value computed from data. A check digit is
        typically a single decimal digit produced by such an algorithm and stored
        as part of the identifier. GS1 Modulo 10 is one checksum family; credit
        cards often use Luhn, which is related but not identical.
      </p>

      <h2
        id="reliability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Reliable Is Modulo 10?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Modulo 10 with alternating 3/1 weights detects all single-digit errors
        and many (but not all) adjacent transpositions. It does not correct
        errors, and some multi-digit corruptions can still produce a colliding
        check digit. Treat it as a practical filter, not absolute proof of a
        correct read.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
        ,{' '}
        <Link
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        ,{' '}
        <Link
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        ,{' '}
        <Link
          href="/tools/percentage-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Discount
        </Link>
        , and{' '}
        <Link
          href="/tools/profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Profit
        </Link>
        .
      </p>

      <h2
        id="cd-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CHECK_DIGIT_FAQS]} />
      </div>
    </article>
  );
}
