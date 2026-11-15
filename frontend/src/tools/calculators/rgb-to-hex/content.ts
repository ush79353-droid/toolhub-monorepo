import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RGB_HEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rgb', label: 'What Is the RGB Color System?' },
  { id: 'what-is-hex', label: 'What Is the HEX Color System?' },
  { id: 'how-to-convert', label: 'How Do I Convert RGB to HEX?' },
  { id: 'how-to-use', label: 'How to Use This Converter' },
  { id: 'conversion-examples', label: 'RGB to HEX Conversion Examples' },
  { id: 'rgb-hex-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { color: string; rgb: string; hex: string }[];
}

export const RGB_HEX_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-rgb',
    title: 'What Is the RGB Color System?',
    paragraphs: [
      'RGB stands for Red, Green, and Blue. It is an additive color model: mixing different intensities of red, green, and blue light produces the colors you see on screens. In common 8-bit web notation each channel is an integer from 0 to 255.',
      'Designers and developers use RGB values in graphics tools, CSS rgb() functions, and image formats. Full intensity of one channel with the others at zero yields a primary color; equal channels yield grayscale.',
    ],
    formula:
      'RGB(255, 0, 0) = Red · RGB(0, 255, 0) = Green · RGB(0, 0, 255) = Blue · RGB(255, 255, 255) = White · RGB(0, 0, 0) = Black',
  },
  {
    id: 'what-is-hex',
    title: 'What Is the HEX Color System?',
    paragraphs: [
      'HEX is a hexadecimal encoding of the same RGB channels. Digits 0–9 and letters A–F represent values 0–15. Each channel becomes two hex characters, so a full opaque color is written as #RRGGBB.',
      'CSS also accepts shorthand three-digit codes such as #F00, which expands to #FF0000. This converter accepts both three-digit and six-digit forms, with or without a leading #.',
    ],
    formula: 'RGB(255, 0, 0) → #FF0000 · RGB(0, 128, 0) → #008000 · #F00 = #FF0000',
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert RGB to HEX Color?',
    paragraphs: [
      '1. Identify the red, green, and blue integers (0–255).',
      '2. Convert each decimal value to hexadecimal.',
      '3. Pad with a leading zero when a channel needs only one hex digit.',
      '4. Concatenate the three two-digit pairs and prefix with #.',
      'Example: RGB (52, 152, 219) → 52=34, 152=98, 219=DB → #3498DB.',
    ],
    formula: 'HEX = # + toHex(R) + toHex(G) + toHex(B)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use This RGB to HEX Converter',
    paragraphs: [
      '1. Choose RGB to HEX or HEX to RGB.',
      '2. Enter the RGB channels or a HEX color code (or use the color picker).',
      '3. Review the automatic result and live preview.',
      '4. Copy the primary result, share a summary, or switch direction to edit from the other side.',
      '5. Reload to restore the sample color, or clear all fields to start blank.',
    ],
  },
  {
    id: 'conversion-examples',
    title: 'RGB to HEX Conversion Examples',
    paragraphs: ['Common colors and their RGB / HEX pairs:'],
    table: [
      { color: 'Black', rgb: '0, 0, 0', hex: '#000000' },
      { color: 'White', rgb: '255, 255, 255', hex: '#FFFFFF' },
      { color: 'Red', rgb: '255, 0, 0', hex: '#FF0000' },
      { color: 'Green', rgb: '0, 255, 0', hex: '#00FF00' },
      { color: 'Blue', rgb: '0, 0, 255', hex: '#0000FF' },
      { color: 'Yellow', rgb: '255, 255, 0', hex: '#FFFF00' },
      { color: 'Cyan', rgb: '0, 255, 255', hex: '#00FFFF' },
      { color: 'Magenta', rgb: '255, 0, 255', hex: '#FF00FF' },
      { color: 'Orange', rgb: '255, 165, 0', hex: '#FFA500' },
      { color: 'Purple', rgb: '128, 0, 128', hex: '#800080' },
    ],
  },
];

export const RGB_HEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is RGB (0, 128, 0) Color?',
    answer:
      'RGB (0, 128, 0) is a medium green with no red or blue. Its HEX value is #008000.',
  },
  {
    question: 'How Do I Encode Gray as RGB?',
    answer:
      'Set R, G, and B to the same value. Examples: (0,0,0) black, (128,128,128) gray, (192,192,192) silver, (255,255,255) white.',
  },
  {
    question: 'How Do I Convert HEX to RGB?',
    answer:
      'Split a six-digit HEX code into three pairs and convert each from base 16 to decimal. Example: #FF8000 → FF=255, 80=128, 00=0 → RGB (255, 128, 0).',
  },
  {
    question: 'What Is the HEX Code for RGB (255, 255, 255)?',
    answer: '#FFFFFF',
  },
  {
    question: 'What Is the HEX Code for RGB (0, 0, 0)?',
    answer: '#000000',
  },
  {
    question: 'Can I Convert RGB to HEX Without a Calculator?',
    answer:
      'Yes. Convert each channel from decimal to two hex digits and join them after #. This tool automates that process and validates input.',
  },
  {
    question: 'What Is the Difference Between RGB and HEX?',
    answer:
      'RGB lists three decimal channel values. HEX encodes those same channels in hexadecimal after a #.',
  },
  {
    question: 'Does Converting RGB to HEX Change the Color?',
    answer:
      'No. Proper six-digit HEX and 8-bit RGB describe the same color values; conversion only changes notation.',
  },
  {
    question: 'Can HEX Color Codes Contain Transparency?',
    answer:
      'CSS supports 4-digit and 8-digit HEX with alpha. This converter focuses on standard three-channel RGB and 3-digit or 6-digit HEX. For alpha-aware formats, use the Color Converter.',
  },
];
