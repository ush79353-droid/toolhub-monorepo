import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CHECK_DIGIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Check Digit Calculator' },
  { id: 'what-is', label: 'What Is a Check Digit?' },
  { id: 'what-gtin', label: 'What Is GTIN?' },
  { id: 'barcode-numbers', label: 'What Do Barcode Numbers Mean?' },
  { id: 'gs1-mod10', label: 'GS1 Modulo 10 Algorithm' },
  { id: 'how-calculate', label: 'How to Calculate a Check Digit' },
  { id: 'ean13', label: 'EAN-13 Check Digit' },
  { id: 'upc', label: 'UPC-A Check Digit' },
  { id: 'gtin14', label: 'GTIN-14 Check Digit' },
  { id: 'validate', label: 'How to Validate a Barcode' },
  { id: 'why-important', label: 'Why Check Digits Matter' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'vs-checksum', label: 'Check Digits vs. Checksums' },
  { id: 'reliability', label: 'How Reliable Is Modulo 10?' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cd-faq', label: 'Frequently Asked Questions' },
];

export const CHECK_DIGIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a check digit?',
    answer:
      'A check digit is a calculated final digit appended to an identifier so systems can detect certain typing or scanning errors. It is derived from the preceding digits by a published algorithm such as GS1 Modulo 10.',
  },
  {
    question: 'How do I calculate a check digit?',
    answer:
      'Form the payload (digits without the check digit), multiply by alternating weights 3 and 1 from the right, sum the products, then CheckDigit = (10 − (S mod 10)) mod 10.',
  },
  {
    question: 'What is a GTIN check digit?',
    answer:
      'It is the last digit of a Global Trade Item Number (GTIN-8, GTIN-12, GTIN-13, or GTIN-14), computed with the GS1 Modulo 10 method so the full number has a consistent checksum.',
  },
  {
    question: 'What is the GS1 Modulo 10 algorithm?',
    answer:
      'A checksum that assigns weights of 3 and 1 from the rightmost payload digit, sums weighted digits, and chooses a check digit so the total is divisible by 10 when the check digit is included with weight 1 in verification contexts, or equivalently uses CheckDigit = (10 − (S mod 10)) mod 10 on the payload alone.',
  },
  {
    question: 'How do you calculate an EAN-13 check digit?',
    answer:
      'Use the 12-digit payload (GTIN-13 without the last digit). Apply GS1 weights from the right and compute (10 − (S mod 10)) mod 10. Example: 400638133393 → check digit 1.',
  },
  {
    question: 'How do you calculate a UPC check digit?',
    answer:
      'UPC-A uses an 11-digit payload (GTIN-12 without the check digit) and the same GS1 Modulo 10 rule. Example: 03600029145 → check digit 2.',
  },
  {
    question: 'How do you calculate a GTIN-14 check digit?',
    answer:
      'Use the 13-digit payload and GS1 Modulo 10. Example: 1001234567890 → check digit 2 → complete 10012345678902.',
  },
  {
    question: 'What is the difference between UPC and EAN?',
    answer:
      'UPC-A encodes a 12-digit GTIN-12; EAN-13 encodes a 13-digit GTIN-13. Both use the same Modulo 10 check-digit method. Symbology (how bars are drawn) differs from the GTIN numeric structure.',
  },
  {
    question: 'What does GTIN stand for?',
    answer: 'Global Trade Item Number: a family of GS1 identifiers for trade items.',
  },
  {
    question: 'Why do barcodes have check digits?',
    answer:
      'To catch many single-digit errors and some other mistakes during data entry or scanning before a wrong number enters retail, inventory, or logistics systems.',
  },
  {
    question: 'Can a check digit be zero?',
    answer:
      'Yes. When the weighted sum is divisible by 10, the formula yields 0; never 10.',
  },
  {
    question: 'Can a barcode contain leading zeros?',
    answer:
      'Yes. Leading zeros are significant digits in GTIN strings and must be preserved. Do not convert the identifier to a numeric type that drops them.',
  },
  {
    question: 'Is the final digit of a GTIN always the check digit?',
    answer:
      'For standard GTIN-8/12/13/14 identifiers, Yes: the rightmost digit is the Modulo 10 check digit.',
  },
  {
    question: 'How do I check whether a GTIN checksum is valid?',
    answer:
      'Split off the last digit, recalculate the check digit from the payload, and compare. This calculator’s validate mode does that automatically.',
  },
  {
    question: 'Does a valid check digit mean the barcode is registered?',
    answer:
      'No. A valid checksum only means the digits are structurally consistent. Registration and product assignment are separate GS1 company and catalog processes.',
  },
  {
    question: 'What is the difference between GTIN-12 and GTIN-13?',
    answer:
      'Length: 12 vs 13 digits including the check digit. GTIN-12 is commonly shown as UPC-A; GTIN-13 as EAN-13. Both use Modulo 10.',
  },
  {
    question: 'Can I calculate check digits manually?',
    answer:
      'Yes. List the payload, weight from the right with 3 and 1, sum, then apply (10 − (S mod 10)) mod 10. This tool automates and shows those steps.',
  },
  {
    question: 'What happens if the check digit is incorrect?',
    answer:
      'Scanners and software that verify Modulo 10 typically reject or flag the code, preventing a mistyped number from being accepted as a different product ID.',
  },
  {
    question: 'Can a check digit detect every error?',
    answer:
      'No. Modulo 10 detects many single-digit errors and some transpositions, but not every possible corruption. It is an integrity check, not error correction.',
  },
  {
    question: 'How is a check digit used in inventory management?',
    answer:
      'Systems validate scanned or keyed GTINs before updating stock, receiving shipments, or matching purchase orders, reducing misidentification of items.',
  },
  {
    question: 'What is the difference between a check digit and a checksum?',
    answer:
      'A check digit is usually a single digit produced by a checksum algorithm. “Checksum” is the broader term for any validation value derived from data.',
  },
  {
    question: 'Is the GS1 Modulo 10 algorithm the same as the Luhn algorithm?',
    answer:
      'No. Both use digit weighting and modulo 10, but the weight patterns and doubling rules differ. Do not interchange Luhn and GS1 GTIN formulas.',
  },
  {
    question: 'What is the check digit for EAN-8?',
    answer:
      'It depends on the 7-digit payload. Example: payload 9638507 → check digit 4 → complete 96385074.',
  },
  {
    question: 'How do barcode scanners use check digits?',
    answer:
      'Many scanners and host systems recompute the check digit from decoded payload digits and compare it to the scanned check digit before accepting the read.',
  },
  {
    question: 'How do I validate multiple GTIN numbers?',
    answer:
      'Validate each complete identifier separately (or use a batch tool if available). This calculator focuses on one GTIN at a time for clarity.',
  },
];
