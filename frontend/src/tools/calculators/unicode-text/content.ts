import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UNICODE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-unicode-font', label: 'What Is a Unicode Font Generator?' },
  { id: 'unicode-styles', label: 'Types of Unicode Text Styles' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'unicode-vs-fonts', label: 'Unicode Text vs. Regular Fonts' },
  { id: 'where-to-use', label: 'Where Can You Use Unicode Text?' },
  { id: 'accessibility', label: 'Accessibility and Limitations' },
  { id: 'unicode-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
}

export const UNICODE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-unicode-font',
    title: 'What Is a Unicode Font Generator?',
    paragraphs: [
      'A Unicode text generator transforms ordinary letters and digits into alternative Unicode characters that look decorative—circled, squared, upside-down, or monospaced. In most cases this is not a font change applied to the same letters. The converter substitutes different code points from other Unicode blocks.',
      'People use these styles for social bios, usernames, messaging, captions, and creative headings. Because the result is made of special characters, appearance, search behavior, and accessibility depend on the destination app and font support.',
    ],
  },
  {
    id: 'unicode-styles',
    title: 'Types of Unicode Text Styles',
    paragraphs: [
      'This converter produces seven styles where Unicode provides usable mappings. Coverage is incomplete for some alphabets and symbols; unmapped characters are left unchanged.',
    ],
    subsections: [
      {
        id: 'circled',
        title: 'Circled Text',
        paragraphs: [
          'Enclosed alphanumeric characters place letters or digits inside circles. Lowercase and uppercase have separate ranges where defined.',
        ],
        formula: 'hello → ⓗⓔⓛⓛⓞ',
      },
      {
        id: 'negative-circled',
        title: 'Negative Circled Text',
        paragraphs: [
          'Filled circular Latin capitals exist for A–Z. Lowercase input is mapped to those capitals, so visual case is not preserved.',
        ],
      },
      {
        id: 'squared',
        title: 'Squared Text',
        paragraphs: [
          'Squared Latin capital letters are available for A–Z. Digits and punctuation without a matching squared character stay as entered.',
        ],
      },
      {
        id: 'negative-squared',
        title: 'Negative Squared Text',
        paragraphs: [
          'Negative squared Latin capitals (A–Z) use filled square backgrounds. Font support varies by platform.',
        ],
      },
      {
        id: 'inverted',
        title: 'Inverted Text',
        paragraphs: [
          'Characters are substituted with upside-down-looking glyphs from a verified map, keeping original order.',
        ],
        formula: 'abc → ɐqɔ',
      },
      {
        id: 'inverted-reversed',
        title: 'Inverted Reversed Text',
        paragraphs: [
          'The same upside-down map is applied, then the string is reversed by grapheme cluster so emoji and combining marks stay intact.',
        ],
        formula: 'abc → ɔqɐ',
      },
      {
        id: 'monospaced',
        title: 'Monospaced Text',
        paragraphs: [
          'Mathematical monospace letters and digits live in a supplementary Unicode plane. They look fixed-width but remain distinct characters—not CSS font-family: monospace.',
        ],
        formula: 'hello → 𝚑𝚎𝚕𝚕𝚘',
      },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Unicode Text Converter',
    paragraphs: [
      '1. Open the Unicode Text Converter.',
      '2. Type or paste the text you want to transform.',
      '3. Review the seven generated styles.',
      '4. Click Copy next to the style you want.',
      '5. Paste into your destination app and check display support.',
      '6. Edit the original text to refresh all styles instantly, or reload/clear to reset.',
    ],
  },
  {
    id: 'unicode-vs-fonts',
    title: 'Unicode Text vs. Regular Fonts',
    paragraphs: [
      'Unicode assigns identity to characters. Fonts draw those characters. CSS can restyle the same letters with a different typeface, while decorative Unicode swaps in different letters that merely look similar.',
      'That difference matters for searching, sorting, screen readers, and password or username rules. Mathematical alphanumeric symbols are not the same as ordinary ASCII letters even when they look alike.',
    ],
  },
  {
    id: 'where-to-use',
    title: 'Where Can You Use Unicode Text?',
    paragraphs: [
      'Decorative Unicode often appears in social bios, chat, gaming profiles, creative usernames, and informal titles. Compatibility is not guaranteed—some platforms normalize, filter, or poorly render certain blocks.',
      'Always keep a plain-text version for anything important, legal, or accessibility-sensitive.',
    ],
  },
  {
    id: 'accessibility',
    title: 'Unicode Text Accessibility and Limitations',
    paragraphs: [
      'Screen readers may announce circled or mathematical letters unexpectedly. Missing glyphs show as boxes (□). Search engines and apps may normalize or reject fancy characters.',
      'Unicode defines characters, not guaranteed visuals. Prefer ordinary text for formal documents, forms, and content that must remain readable and searchable.',
    ],
  },
];

export const UNICODE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Text to Unicode?',
    answer:
      'Enter text in the converter. Styles update automatically. Copy the style you want and paste it into your application.',
  },
  {
    question: 'What Is a Circled Font?',
    answer:
      'Circled text uses Unicode enclosed alphanumeric characters—distinct code points that look like letters inside circles—not a font applied to plain letters.',
  },
  {
    question: 'How Do I Invert Text?',
    answer:
      'Use Inverted for upside-down substitutions in order, or Inverted (reversed) to also reverse grapheme order for a classic upside-down reading effect.',
  },
  {
    question: 'Can I Copy Unicode Text to Instagram or Other Social Platforms?',
    answer:
      'Many apps accept Unicode, but display, search, and moderation vary. Always test the pasted result in the destination app.',
  },
  {
    question: 'Is Unicode Text the Same as a Font?',
    answer:
      'No. Unicode defines characters; fonts render them. Decorative converters substitute characters rather than changing typeface.',
  },
  {
    question: 'Why Do Some Unicode Characters Appear as Boxes?',
    answer:
      'The device or font lacks glyphs for those code points. Try another app or keep the plain-text original.',
  },
  {
    question: 'Can Unicode Text Be Converted Back to Normal Text?',
    answer:
      'Some mappings can be reversed, but not all are one-to-one. Case and punctuation distinctions may be lost—especially with negative circled styles.',
  },
  {
    question: 'Does Unicode Support Every Fancy Text Style?',
    answer:
      'No. Unicode includes many enclosed and mathematical symbols, but not complete matching alphabets for every visual style.',
  },
  {
    question: 'Does Unicode Text Work in All Browsers?',
    answer:
      'Modern browsers support Unicode encoding, but individual glyph appearance depends on installed fonts and the OS.',
  },
];
