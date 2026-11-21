import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEX_RGB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hex-rgb', label: 'What Is HEX and RGB Color Coding?' },
  { id: 'how-to-convert', label: 'How Do I Convert HEX to RGB?' },
  { id: 'worked-example', label: 'Example of Converting HEX to RGB' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'shorthand', label: 'What Is HEX Shorthand Notation?' },
  { id: 'conversion-table', label: 'Common HEX to RGB Conversion Table' },
  { id: 'hex-rgb-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { color: string; hex: string; rgb: string }[];
}

export const HEX_RGB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-hex-rgb',
    title: 'What Is HEX and RGB Color Coding?',
    paragraphs: [
      'RGB means Red, Green, and Blue. It is an additive digital color model: screens mix those three lights to produce a color. In standard 8-bit web notation each channel is an integer from 0 to 255.',
      'HEX encodes the same RGB channels with hexadecimal digits (0–9 and A–F). A six-digit code uses the form #RRGGBB. Designers and developers use both formats in CSS, graphics tools, and design systems.',
    ],
    formula:
      'RGB(255, 0, 0) = #FF0000 · RGB(0, 255, 0) = #00FF00 · RGB(0, 0, 255) = #0000FF · RGB(255, 255, 255) = #FFFFFF · RGB(0, 0, 0) = #000000',
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert HEX to RGB?',
    paragraphs: [
      '1. Remove the optional # prefix.',
      '2. Confirm every character is a valid hexadecimal digit.',
      '3. Expand three-digit shorthand (#RGB → #RRGGBB) when applicable.',
      '4. Split the six characters into three pairs.',
      '5. Convert each pair from base 16 to base 10: (first digit × 16) + second digit.',
      '6. Write the decimals as RGB (R, G, B).',
      'Example: #4A90E2 → 4A=74, 90=144, E2=226 → RGB (74, 144, 226).',
    ],
    formula: 'Decimal = (high nibble × 16) + low nibble',
  },
  {
    id: 'worked-example',
    title: 'Example of Converting HEX to RGB',
    paragraphs: [
      'Take HEX #AC7F38. Split into pairs AC, 7F, and 38.',
      'AC = 10×16 + 12 = 172. 7F = 7×16 + 15 = 127. 38 = 3×16 + 8 = 56.',
      'The same color is therefore RGB (172, 127, 56). Changing notation does not change the displayed color when both use 8-bit channels.',
    ],
    formula: '#AC7F38 → RGB (172, 127, 56)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the HEX to RGB Converter',
    paragraphs: [
      '1. Select HEX to RGB (the default) or RGB to HEX.',
      '2. Enter a hexadecimal color code, optionally with #.',
      '3. Enable “Use shorthand HEX notation” when entering a three-digit code.',
      '4. Review the RGB tuple, live preview, and copy or share the result.',
      '5. Switch direction to edit from RGB channels, or reload/clear to reset.',
    ],
  },
  {
    id: 'shorthand',
    title: 'What Is HEX Shorthand Notation?',
    paragraphs: [
      'Three-digit HEX (#RGB) expands by repeating each digit: #F00 becomes #FF0000, #ABC becomes #AABBCC, and #F80 becomes #FF8800.',
      'Not every six-digit color has an exact three-digit shorthand. Only colors whose channel pairs are identical digits (like 88 or FF) compress that way. This converter accepts six-digit codes always, and three-digit codes when shorthand is enabled.',
    ],
    formula: '#F00 → #FF0000 · #0F0 → #00FF00 · #00F → #0000FF · #FFF → #FFFFFF · #000 → #000000',
  },
  {
    id: 'conversion-table',
    title: 'Common HEX to RGB Conversion Table',
    paragraphs: ['Frequently used colors and their HEX / RGB pairs:'],
    table: [
      { color: 'Black', hex: '#000000', rgb: '0, 0, 0' },
      { color: 'White', hex: '#FFFFFF', rgb: '255, 255, 255' },
      { color: 'Red', hex: '#FF0000', rgb: '255, 0, 0' },
      { color: 'Green', hex: '#00FF00', rgb: '0, 255, 0' },
      { color: 'Blue', hex: '#0000FF', rgb: '0, 0, 255' },
      { color: 'Yellow', hex: '#FFFF00', rgb: '255, 255, 0' },
      { color: 'Cyan', hex: '#00FFFF', rgb: '0, 255, 255' },
      { color: 'Magenta', hex: '#FF00FF', rgb: '255, 0, 255' },
      { color: 'Orange', hex: '#FFA500', rgb: '255, 165, 0' },
      { color: 'Purple', hex: '#800080', rgb: '128, 0, 128' },
    ],
  },
];

export const HEX_RGB_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is #F000 as a HEX Color?',
    answer:
      '#F000 is a four-digit CSS HEX color that includes alpha. It expands toward #FF000000; red with zero opacity. This converter focuses on three-channel RGB and 3/6-digit HEX; alpha formats need separate handling (see the Color Converter).',
  },
  {
    question: 'What Is the Ugliest HEX Color?',
    answer:
      'There is no objective ugliest color. Preferences depend on context, contrast, accessibility, and design goals.',
  },
  {
    question: 'What Is the Difference Between HEX and RGB?',
    answer:
      'RGB lists decimal red, green, and blue channels. HEX encodes those same channels in hexadecimal. RGB(255, 0, 0) and #FF0000 are the same red.',
  },
  {
    question: 'How Do I Convert HEX to RGB Manually?',
    answer:
      'Split the six-digit code into three pairs and convert each pair from base 16 to base 10.',
  },
  {
    question: 'Can a Three-Digit HEX Code Be Converted to RGB?',
    answer:
      'Yes. Example: #F80 expands to #FF8800, which is RGB (255, 136, 0). Enable shorthand notation in this calculator to accept three-digit input.',
  },
  {
    question: 'What Is the RGB Value of #FFFFFF?',
    answer: 'RGB(255, 255, 255)',
  },
  {
    question: 'What Is the RGB Value of #000000?',
    answer: 'RGB(0, 0, 0)',
  },
  {
    question: 'Does HEX to RGB Conversion Change a Color?',
    answer:
      'No. Converting a standard six-digit HEX color into equivalent 8-bit RGB preserves the same color.',
  },
  {
    question: 'Can HEX Colors Represent Transparency?',
    answer:
      'Yes. CSS supports 4-digit and 8-digit HEX with alpha. This converter’s primary output is standard three-channel RGB.',
  },
];
