import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEET_SPEAK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-leet', label: 'What Is Leet-Speak?' },
  { id: 'origins', label: 'The Origins of 1337 Speak' },
  { id: 'how-to-use', label: 'How to Use the Translator' },
  { id: 'examples', label: 'Examples of Leet-Speak' },
  { id: 'common-chars', label: 'Common Leet-Speak Characters' },
  { id: 'why-use', label: 'Why Do People Use Leet-Speak?' },
  { id: 'limitations', label: 'Limitations of Translation' },
  { id: 'leet-speak-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  tableNote?: string;
}

export const LEET_SPEAK_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-leet',
    title: 'What Is Leet-Speak?',
    paragraphs: [
      'Leet-speak (also written leetspeak or 1337 speak) is a playful writing style that swaps some letters for numbers or symbols that look similar. It grew popular in early online communities, gaming chats, and informal internet culture.',
      'There is no single official alphabet. Different communities prefer different substitutions, so the same English word can appear in several leet forms.',
    ],
    formula: 'Normal: LEET SPEAK · Basic leet: L337 5P34K',
  },
  {
    id: 'origins',
    title: 'The Origins of 1337 Speak: From English to Leet-Speak',
    paragraphs: [
      'Letter–number substitutions circulated in early bulletin board systems and online forums, where people experimented with keyboard characters for humor, identity, and group slang.',
      'Gaming and computing subcultures helped popularize the idea of “elite” status shortened to “leet,” often rendered as 1337. Exact founding dates and inventors are hard to pin down; the style evolved gradually across communities rather than from a single standard.',
      'Today the look of 1337 remains recognizable even when people only use a few classic swaps such as E→3 or O→0.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Leet-Speak Translator',
    paragraphs: [
      '1. Choose the translation direction (normal → leet or leet → normal).',
      '2. Pick Classic or Basic style for forward translation.',
      '3. Enter or paste text — the result updates instantly.',
      '4. Switch direction or style anytime; your input stays in place.',
      '5. Copy the translation, or clear/reload to start over.',
      'Reverse conversion uses a fixed digit→letter table and may not restore the original spelling when symbols are ambiguous.',
    ],
  },
  {
    id: 'examples',
    title: 'Examples of Leet-Speak',
    paragraphs: [
      'The table below uses the Basic Leet profile only (A, E, O, S, T). Letters such as I and L are left unchanged in Basic mode.',
    ],
    tableHeaders: ['Normal text', 'Basic leet'],
    table: [
      ['HELLO', 'H3LL0'],
      ['HACKER', 'H4CK3R'],
      ['GAME', 'G4M3'],
      ['PASSWORD', 'P455W0RD'],
      ['TEST', '7357'],
      ['COOL', 'C00L'],
      ['LEET', 'L337'],
    ],
    tableNote:
      'Classic mode also maps B→8, G→6, I→1, L→1, and Z→2, so HELLO becomes H3110 instead of H3LL0.',
  },
  {
    id: 'common-chars',
    title: 'Common Leet-Speak Characters',
    paragraphs: [
      'Communities invent many alternatives. The default translator only applies the documented Basic/Classic maps — not every creative variant.',
    ],
    tableHeaders: ['Letter', 'Common alternatives'],
    table: [
      ['A', '4, @, /-\\'],
      ['B', '8, 13'],
      ['C', '(, <'],
      ['E', '3'],
      ['G', '6, 9'],
      ['I', '1, !'],
      ['L', '1, |_'],
      ['O', '0'],
      ['S', '5, $'],
      ['T', '7, +'],
      ['Z', '2'],
    ],
    tableNote:
      'This calculator’s Classic reverse map uses 4→A, 8→B, 3→E, 6→G, 1→I, 0→O, 5→S, 7→T, 2→Z.',
  },
  {
    id: 'why-use',
    title: 'Why Do People Use Leet-Speak?',
    paragraphs: [
      'People use leet-speak for gaming nicknames, internet humor, visual wordplay, and nostalgia for early web culture. It can signal membership in a community or simply look stylish.',
      'Character substitution alone is not encryption. Anyone who knows the convention can read most messages, so leet-speak should never be treated as a security control.',
    ],
  },
  {
    id: 'limitations',
    title: 'Limitations of Leet-Speak Translation',
    paragraphs: [
      'No universal standard exists, so two translators may disagree.',
      'One symbol can stand for several letters (especially 1 for I or L), so reverse results are approximate.',
      'Advanced multi-character ASCII art substitutions are not decoded by this tool.',
      'Context and dictionary guessing are not implemented — the engine applies only the documented character maps.',
    ],
  },
];

export const LEET_SPEAK_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Say Hello in Leet-Speak?',
    answer:
      'With Basic leet: HELLO → H3LL0. With Classic leet (this tool’s default): HELLO → H3110 because L also maps to 1.',
  },
  {
    question: 'What Does 1337 Mean?',
    answer:
      '1337 is a numeric spelling commonly associated with “leet,” shortened from “elite.”',
  },
  {
    question: 'Is Leet-Speak Still Used?',
    answer:
      'Yes. Variations still appear in gaming, usernames, memes, and online humor even if everyday chat uses less of it than in earlier internet eras.',
  },
  {
    question: 'What Does 7 Mean in Leet-Speak?',
    answer: 'The digit 7 commonly stands for the letter T in classic leet substitutions.',
  },
  {
    question: 'Can I Translate Leet-Speak Back to English?',
    answer:
      'Yes for common digits, but ambiguous mappings mean the result may be approximate (for example H3110 → HEIIO).',
  },
  {
    question: 'Is Leet-Speak a Real Language?',
    answer:
      'It is generally a writing style or substitution convention, not an independent natural language with its own grammar.',
  },
  {
    question: 'Is Leet-Speak Encryption?',
    answer:
      'No. Simple letter–number swaps do not provide meaningful confidentiality or cryptographic security.',
  },
  {
    question: 'Can I Translate Entire Paragraphs?',
    answer:
      'Yes. Paste multiline text; spaces and line breaks are preserved while mapped letters are substituted.',
  },
];
