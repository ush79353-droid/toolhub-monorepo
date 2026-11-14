import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GEMATRIA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gematria', label: 'What Is Gematria?' },
  { id: 'how-to-calculate', label: 'How to Calculate Gematria' },
  { id: 'alphabet-values', label: 'Gematria Alphabet Values' },
  { id: 'hebrew-values', label: 'Hebrew Letter Values' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'examples', label: 'Examples' },
  { id: 'gematria-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly {
    left: string;
    right: string;
    third?: string;
    fourth?: string;
  }[];
  tableHeaders?:
    | readonly [string, string]
    | readonly [string, string, string]
    | readonly [string, string, string, string];
}

export const GEMATRIA_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-gematria',
    title: 'What Is Gematria? Gematria Meaning',
    paragraphs: [
      'Gematria is a system of assigning numerical values to letters and adding those values for a word or phrase. It is especially associated with Jewish textual interpretation and Hebrew traditions, though related letter–number practices appear in other languages and eras.',
      'Different calculation systems assign different values, so a result depends entirely on the selected mapping. Gematria interpretations are cultural, historical, or symbolic rather than scientifically established predictions about a word’s meaning or destiny.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Gematria',
    paragraphs: [
      'Choose a Gematria system, identify each letter, look up its value, add the values, and read the total. English and Hebrew mappings differ and must not be mixed silently.',
      'Example with Simple Gematria for CAT: C=3, A=1, T=20 → 3+1+20=24.',
    ],
    formula: 'Total = sum of each letter’s value under the chosen mapping',
  },
  {
    id: 'alphabet-values',
    title: 'Gematria Alphabet Values (Latin)',
    paragraphs: [
      'Latin-letter mappings used by this calculator. English Jewish Gematria is a convention found in some English-language tools — not the traditional Hebrew alphabet chart.',
    ],
    table: [
      { left: 'A', right: '1', third: '6', fourth: '1' },
      { left: 'B', right: '2', third: '12', fourth: '2' },
      { left: 'C', right: '3', third: '18', fourth: '3' },
      { left: 'D', right: '4', third: '24', fourth: '4' },
      { left: 'E', right: '5', third: '30', fourth: '5' },
      { left: 'F', right: '6', third: '36', fourth: '6' },
      { left: 'G', right: '7', third: '42', fourth: '7' },
      { left: 'H', right: '8', third: '48', fourth: '8' },
      { left: 'I', right: '9', third: '54', fourth: '9' },
      { left: 'J', right: '600', third: '60', fourth: '10' },
      { left: 'K', right: '10', third: '66', fourth: '11' },
      { left: 'L', right: '20', third: '72', fourth: '12' },
      { left: 'M', right: '30', third: '78', fourth: '13' },
      { left: 'N', right: '40', third: '84', fourth: '14' },
      { left: 'O', right: '50', third: '90', fourth: '15' },
      { left: 'P', right: '60', third: '96', fourth: '16' },
      { left: 'Q', right: '70', third: '102', fourth: '17' },
      { left: 'R', right: '80', third: '108', fourth: '18' },
      { left: 'S', right: '90', third: '114', fourth: '19' },
      { left: 'T', right: '100', third: '120', fourth: '20' },
      { left: 'U', right: '200', third: '126', fourth: '21' },
      { left: 'V', right: '700', third: '132', fourth: '22' },
      { left: 'W', right: '900', third: '138', fourth: '23' },
      { left: 'X', right: '300', third: '144', fourth: '24' },
      { left: 'Y', right: '400', third: '150', fourth: '25' },
      { left: 'Z', right: '500', third: '156', fourth: '26' },
    ],
    tableHeaders: ['Letter', 'Jewish English', 'English', 'Simple'],
  },
  {
    id: 'hebrew-values',
    title: 'Hebrew Standard Letter Values (Mispar Hechrechi)',
    paragraphs: [
      'Traditional Hebrew letter values. Final forms (ך ם ן ף ץ) use the same values as their standard letters (20, 40, 50, 80, 90). Vowel points and cantillation marks are ignored.',
    ],
    table: [
      { left: 'א', right: '1' },
      { left: 'ב', right: '2' },
      { left: 'ג', right: '3' },
      { left: 'ד', right: '4' },
      { left: 'ה', right: '5' },
      { left: 'ו', right: '6' },
      { left: 'ז', right: '7' },
      { left: 'ח', right: '8' },
      { left: 'ט', right: '9' },
      { left: 'י', right: '10' },
      { left: 'כ / ך', right: '20' },
      { left: 'ל', right: '30' },
      { left: 'מ / ם', right: '40' },
      { left: 'נ / ן', right: '50' },
      { left: 'ס', right: '60' },
      { left: 'ע', right: '70' },
      { left: 'פ / ף', right: '80' },
      { left: 'צ / ץ', right: '90' },
      { left: 'ק', right: '100' },
      { left: 'ר', right: '200' },
      { left: 'ש', right: '300' },
      { left: 'ת', right: '400' },
    ],
    tableHeaders: ['Letter', 'Value'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Gematria Calculator',
    paragraphs: [
      '1) Enter a word, name, or phrase. 2) Choose Auto or an explicit Jewish mapping (English Jewish vs Hebrew Standard). 3) Read Jewish, English, and Simple totals. 4) Open the letter-by-letter breakdown. 5) Compare systems. 6) Share or reset as needed.',
      'Spaces and punctuation do not add to the total. Uppercase and lowercase English letters are treated the same. Hebrew and Latin scripts are never silently transliterated into each other.',
    ],
  },
  {
    id: 'examples',
    title: 'Examples of Gematria Calculations',
    paragraphs: [
      'Example 1 — CAT: Simple 24; English 144; English Jewish 104 (C=3, A=1, T=100).',
      'Example 2 — HELLO: Simple 52; English 312; English Jewish 103 (H=8, E=5, L=20, L=20, O=50).',
      'Example 3 — שלום: Hebrew Standard 376 (ש=300, ל=30, ו=6, ם=40). Simple and English totals do not apply to Hebrew letters.',
    ],
  },
];

export const GEMATRIA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Gematria?',
    answer:
      'Gematria is a method of assigning numerical values to letters and adding them to calculate a numerical value for a word or phrase.',
  },
  {
    question: 'How do I calculate Gematria by hand?',
    answer:
      'Choose a mapping, determine each letter’s value, and add those values together. The result depends on which Gematria system you use.',
  },
  {
    question: 'What is Jewish Gematria?',
    answer:
      'Jewish Gematria traditionally assigns numerical values to Hebrew letters. Some English-language calculators also use alternative English-letter mappings, which this tool labels separately as English Jewish Gematria.',
  },
  {
    question: 'What is English Gematria?',
    answer:
      'In the convention used by this calculator, English Gematria assigns A = 6, B = 12, and so on up to Z = 156 (simple position × 6).',
  },
  {
    question: 'What is Simple Gematria?',
    answer: 'Simple Gematria assigns alphabetical positions: A = 1 through Z = 26.',
  },
  {
    question: 'What is the Gematria value of HELLO?',
    answer:
      'Using Simple Gematria, HELLO equals 52. Using the English Gematria multiply-by-six convention, it equals 312. English Jewish Gematria gives 103.',
  },
  {
    question: 'Does capitalization affect Gematria?',
    answer:
      'No. Uppercase and lowercase English letters are treated identically in the supported Latin-alphabet systems.',
  },
  {
    question: 'Are spaces counted in Gematria?',
    answer: 'No. Spaces and punctuation do not contribute to the numerical total.',
  },
  {
    question: 'Can I calculate Gematria for a full name?',
    answer:
      'Yes. Enter the full name and the calculator adds the numerical values of supported letters according to the selected mapping.',
  },
  {
    question: 'Is Gematria scientifically proven?',
    answer:
      'Gematria is a historical and cultural method of numerical interpretation. Its symbolic meanings are not established as scientific facts.',
  },
];
