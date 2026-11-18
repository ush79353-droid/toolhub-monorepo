import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOWERCASE_TO_UPPERCASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'upper-lower-letters', label: 'Uppercase and Lowercase Letters' },
  { id: 'what-is-converter', label: 'What Is a Lowercase to Uppercase Converter?' },
  { id: 'when-to-use', label: 'When to Use Lowercase and Uppercase' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'why-convert', label: 'Why Convert Lowercase to Uppercase?' },
  { id: 'lowercase-to-uppercase-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const LOWERCASE_TO_UPPERCASE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'upper-lower-letters',
    title: 'Uppercase and Lowercase Letters',
    paragraphs: [
      'Lowercase letters are the smaller forms of an alphabet (a, b, c). Uppercase letters — also called capital letters — are the larger forms (A, B, C).',
      'Capitalization helps readers spot sentence starts, names, headings, and abbreviations. Writing long paragraphs entirely in uppercase can make text harder to scan, so most body copy stays mostly lowercase with capitals used for structure and emphasis.',
    ],
    formula: 'Lowercase: hello world · Uppercase: HELLO WORLD',
  },
  {
    id: 'what-is-converter',
    title: 'What Is a Lowercase to Uppercase Converter?',
    paragraphs: [
      'A lowercase to uppercase converter transforms letters into their uppercase equivalents while leaving numbers, spaces, and punctuation alone.',
      'Paste a word, sentence, or paragraph and copy the capitalized result for headlines, labels, or short announcements.',
    ],
    formula: 'Input: good morning → Output: GOOD MORNING',
  },
  {
    id: 'when-to-use',
    title: 'When to Use Lowercase Letters and When to Switch to Uppercase',
    paragraphs: [
      'Use uppercase for acronyms (NASA), initialisms (HTML), short headings, labels, formatting requirements, and selective emphasis.',
      'Use lowercase for regular sentence text, paragraphs, informal writing where appropriate, and readable body content.',
      'Sentence capitalization depends on language and writing conventions. This tool’s optional sentence-case mode is a simple helper, not a full style guide for every language.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Lowercase to Uppercase Converter',
    paragraphs: [
      '1. Enter or paste text into the input field.',
      '2. Watch the uppercase output update automatically (or pick another optional mode).',
      '3. Review the result and the character/word/line counts.',
      '4. Click Copy Result to copy the transformed text.',
      '5. Paste it wherever needed.',
      '6. Use Clear All Changes or Reload Calculator to start again (restores Uppercase mode).',
    ],
  },
  {
    id: 'why-convert',
    title: 'Why Convert Lowercase to Uppercase?',
    paragraphs: [
      'Common uses include document formatting, spreadsheet cleanup, database presentation, data standardization, writing and editing, content management, and preparing short labels.',
      'Uppercasing changes presentation. It does not make arbitrary identifiers case-insensitive, URL-safe, or otherwise “normalized” for systems that still treat case as significant.',
    ],
  },
];

export const LOWERCASE_TO_UPPERCASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Change Lowercase to Uppercase in Word on a Mac?',
    answer:
      'Microsoft Word includes a Change Case command (often under the Font or Home ribbon). Keyboard shortcuts vary by Word version and Mac keyboard layout, so check Word’s Help for your build rather than relying on a single universal shortcut.',
  },
  {
    question: 'How Do I Convert All Lowercase to Caps in Microsoft Word?',
    answer:
      'Select the text, open Change Case, and choose UPPERCASE. That converts the selection without retyping.',
  },
  {
    question: 'What Is the Key to Converting Lowercase to Uppercase?',
    answer:
      'Shortcuts depend on the software. Caps Lock affects new typing; it does not automatically convert text you already typed.',
  },
  {
    question: 'How Many Lowercase Letters Are There?',
    answer:
      'The English alphabet has 26 lowercase letters. Other writing systems have different character sets and casing rules.',
  },
  {
    question: 'Can I Convert an Entire Paragraph to Uppercase?',
    answer: 'Yes. Paste a full paragraph or multiple lines; spaces and line breaks are preserved.',
  },
  {
    question: 'Does Uppercase Conversion Remove Punctuation?',
    answer: 'No. Punctuation, spaces, numbers, and line breaks stay in place.',
  },
  {
    question: 'Can Uppercase Conversion Handle Unicode Characters?',
    answer:
      'Yes. The converter uses JavaScript’s Unicode-aware casing. Some characters expand when uppercased (for example German ß → SS), so output length is not always identical to input length.',
  },
];
