import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UPPERCASE_TO_LOWERCASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-uppercase', label: 'What Is an Uppercase Letter?' },
  { id: 'what-is-converter', label: 'What Is an Uppercase to Lowercase Converter?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'why-convert', label: 'Why Convert Uppercase to Lowercase?' },
  { id: 'upper-vs-lower', label: 'Uppercase vs. Lowercase' },
  { id: 'unicode-special', label: 'Unicode and Special Characters' },
  { id: 'uppercase-to-lowercase-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const UPPERCASE_TO_LOWERCASE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-uppercase',
    title: 'What Is an Uppercase Letter?',
    paragraphs: [
      'Uppercase letters (also called capital letters) are the larger forms of an alphabet; A, B, C rather than a, b, c. Lowercase letters are the smaller forms used for most running text.',
      'Writers typically capitalize the first letter of a sentence, proper names, and many abbreviations (NASA, HTML). Body paragraphs are usually written mostly in lowercase, with capitals reserved for those conventional spots.',
      'Examples of the mapping this tool applies: A → a, B → b, and HELLO → hello. Digits and most punctuation have no case, so they stay the same.',
    ],
    formula: 'A → a · B → b · HELLO → hello',
  },
  {
    id: 'what-is-converter',
    title: 'What Is an Uppercase to Lowercase Converter?',
    paragraphs: [
      'An uppercase to lowercase converter takes any text you paste or type and returns a version where every applicable letter is mapped to its lowercase form. Mixed-case input is normalized the same way.',
      'Numbers, spaces, line breaks, and punctuation remain in place. Only letters that have a lowercase equivalent are changed.',
    ],
    tableHeaders: ['Original Text', 'Lowercase Result'],
    table: [
      ['HELLO WORLD', 'hello world'],
      ['MY NAME IS JOHN', 'my name is john'],
      ['THIS IS A TEST', 'this is a test'],
      ['Hello EVERYONE', 'hello everyone'],
      ['ABC123', 'abc123'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Uppercase to Lowercase Converter',
    paragraphs: [
      '1. Enter or paste text into the input field.',
      '2. View the lowercase conversion instantly. no Calculate button is required.',
      '3. Copy the result with Copy Result.',
      '4. Paste the converted text wherever you need it.',
      '5. Use Clear All Changes or Reload Calculator to start again.',
    ],
  },
  {
    id: 'why-convert',
    title: 'Why Convert Uppercase to Lowercase?',
    paragraphs: [
      'Editing and writing: normalize accidental caps lock or ALL-CAPS drafts into readable lowercase.',
      'Data formatting: standardize imported lists or labels before further processing.',
      'Programming: prepare strings for case-insensitive comparisons or conventions that expect lowercase.',
      'Search preparation: normalize queries or indexes designed for case-insensitive matching.',
      'Email and communication: fix messages typed entirely in uppercase.',
      'Content management: format copy for publishing workflows that prefer sentence or lowercase body text.',
      'File naming: create consistent lowercase names where a project standard requires it.',
      'Changing case alone does not make text safe as an identifier, URL slug, or filename; those contexts may still need escaping, transliteration, or character restrictions.',
    ],
  },
  {
    id: 'upper-vs-lower',
    title: 'Uppercase vs. Lowercase',
    paragraphs: [
      'Both forms belong to the same alphabet; they differ in appearance and conventional use. This converter maps uppercase (and mixed) letters toward lowercase while leaving other characters alone.',
    ],
    tableHeaders: ['Feature', 'Uppercase', 'Lowercase'],
    table: [
      ['Example', 'ABC', 'abc'],
      ['Appearance', 'Capital letters', 'Small letters'],
      ['Common usage', 'Acronyms, headings, names', 'Regular body text'],
      ['Conversion', 'Can become lowercase', 'Can become uppercase'],
    ],
  },
  {
    id: 'unicode-special',
    title: 'Unicode and Special Characters',
    paragraphs: [
      'This converter uses JavaScript’s standard Unicode lowercase mapping, so many accented letters convert correctly (for example CAFÉ → café).',
      'Numbers and punctuation stay unchanged. Most emoji stay unchanged because they are not alphabetic case characters.',
      'Casing is not always a one-to-one mapping: some characters expand or behave differently under locale-specific rules (such as Turkish dotted and undotted i). This tool uses the default Unicode casing algorithm, not a per-language locale mode.',
      'Do not assume every uppercase character will change, or that character length is always preserved after casing.',
    ],
  },
];

export const UPPERCASE_TO_LOWERCASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert uppercase to lowercase in Word?',
    answer:
      'Select the text, then use Word’s Change Case command (often under the Font or Home ribbon). On many desktop Word setups, Shift + F3 cycles capitalization for the selection, though shortcuts can vary by platform and keyboard layout.',
  },
  {
    question: 'How do I convert uppercase to lowercase in Excel?',
    answer:
      'Use the LOWER function. Example: =LOWER(A1) returns the lowercase form of the text in cell A1.',
  },
  {
    question: 'What Is a Case Converter?',
    answer:
      'A case converter is a text tool that changes letter capitalization according to a chosen rule, for example all lowercase, all uppercase, or title case.',
  },
  {
    question: 'Can a Case Converter Handle Mixed Capitalization?',
    answer:
      'Yes. Mixed-case text can be converted to lowercase while numbers, spaces, and punctuation are preserved.',
  },
  {
    question: 'Can I Convert an Entire Paragraph to Lowercase?',
    answer:
      'Yes. Paste a full paragraph (or multiple paragraphs) into the input field; the converter updates the result as you type.',
  },
  {
    question: 'Does the Converter Remove Numbers or Symbols?',
    answer:
      'No. Numbers and punctuation are preserved. Only letters with a lowercase mapping are changed.',
  },
  {
    question: 'Can I Convert Unicode Text to Lowercase?',
    answer:
      'Yes. JavaScript applies Unicode lowercase mappings. Language-specific casing rules may still differ from the default algorithm this tool uses.',
  },
  {
    question: 'Is My Text Sent to a Server?',
    answer:
      'Lowercase conversion on this page runs in your browser and does not require a network request to transform your text. Broader site analytics or logging outside this calculator are outside the conversion itself.',
  },
];
