import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, inchesToPixels, pixelsToInches } from './calculation';

export const PIXELS_TO_INCHES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-pixel', label: 'What Is a Pixel?' },
  { id: 'what-is-ppi', label: 'What Is PPI?' },
  { id: 'pixels-to-inches', label: 'How to Convert Pixels to Inches' },
  { id: 'inches-to-pixels', label: 'How to Convert Inches to Pixels' },
  { id: 'pixels-per-inch', label: 'How Many Pixels Are in an Inch?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-tables', label: 'Pixels to Inches Conversion Tables' },
  { id: 'ppi-vs-dpi', label: 'Difference Between PPI and DPI' },
  { id: 'why-size-changes', label: 'Why Does Image Size Change With PPI?' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'pixels-to-inches-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  pixels: string;
  inches: string;
}

export interface PixelsToInchesGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  tableTitle?: string;
  table?: readonly ConversionTableRow[];
  tableTitle2?: string;
  table2?: readonly ConversionTableRow[];
}

function tableAtPpi(ppi: number, pixelsList: readonly number[]): ConversionTableRow[] {
  return pixelsList.map((pixels) => ({
    pixels: formatMeasure(pixels),
    inches: formatMeasure(pixelsToInches(pixels, ppi)),
  }));
}

const TABLE_96 = tableAtPpi(96, [0, 24, 48, 72, 96, 192, 300, 480, 960, 1080, 1920]);
const TABLE_300 = tableAtPpi(300, [150, 300, 600, 900, 1200, 1800, 2400, 3000, 1080]);

export const PIXELS_TO_INCHES_GUIDE_SECTIONS: readonly PixelsToInchesGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Pixels to Inches Converter turns a pixel count into a physical length in inches at a PPI you choose, and the reverse. Enter inches or pixels, set pixels per inch, and read the matching value instantly.',
      'Pixels alone do not define a fixed physical size. The same 1,080-pixel width can be about 11.25 inches at 96 PPI or 3.6 inches at 300 PPI. This tool makes that relationship explicit for print planning, image sizing, and layout work.',
    ],
  },
  {
    id: 'what-is-a-pixel',
    title: 'What Is a Pixel?',
    paragraphs: [
      'A pixel is a picture element—one sample in a digital image or one addressable unit on a display. Raster images are usually described as width × height in pixels.',
      'How large those pixels appear on a screen depends on the display’s physical pixel density and scaling. How large they print depends on the pixels-per-inch relationship you choose for output. Pixels are not inherently equal to a fixed number of inches.',
    ],
  },
  {
    id: 'what-is-ppi',
    title: 'What Is PPI?',
    paragraphs: [
      'PPI means pixels per inch. It describes pixel density or the intended resolution of an image for a physical size. Raising PPI makes the same pixel count occupy less physical length; lowering PPI makes it larger.',
      'Image PPI metadata, a monitor’s physical pixels per inch, and the CSS reference pixel (often discussed as 96 CSS px per inch) are related ideas but not the same thing. Do not assume every screen is physically 96 PPI.',
    ],
  },
  {
    id: 'pixels-to-inches',
    title: 'How to Convert Pixels to Inches',
    paragraphs: [
      'Divide the pixel count by PPI. Example at 96 PPI: 1,080 ÷ 96 = 11.25 inches. Example at 300 PPI: 1,080 ÷ 300 = 3.6 inches. The pixel count stayed the same; only the intended density changed.',
    ],
    formula: 'inches = pixels / PPI',
    formulaNote: 'Use a PPI that matches your image or intended print/output resolution.',
  },
  {
    id: 'inches-to-pixels',
    title: 'How to Convert Inches to Pixels',
    paragraphs: [
      `Multiply inches by PPI. Example: 5 inches × 96 PPI = ${formatMeasure(inchesToPixels(5, 96))} pixels. At 300 PPI the same five inches become ${formatMeasure(inchesToPixels(5, 300))} pixels.`,
    ],
    formula: 'pixels = inches × PPI',
  },
  {
    id: 'pixels-per-inch',
    title: 'How Many Pixels Are in an Inch?',
    paragraphs: [
      'The answer depends entirely on PPI. At 72 PPI, one inch is 72 pixels. At 96 PPI it is 96 pixels. At 150 PPI it is 150 pixels. At 300 PPI it is 300 pixels. Those figures apply to the PPI convention you select, not to every physical display.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Enter a value in Inches or Pixels. Set PPI (default 96) or tap a preset such as 72, 150, 300, or 600. The field you last edited is preserved when PPI changes; the other field recalculates.',
      'Open More conversion options for millimeters, centimeters, and feet from the same inch length. Copy result places a short summary on the clipboard. Reset clears inches and pixels and restores PPI to 96.',
    ],
  },
  {
    id: 'conversion-tables',
    title: 'Pixels to Inches Conversion Tables',
    paragraphs: [
      'The tables below use the same formulas as the calculator. Values at 96 PPI illustrate the CSS reference convention; values at 300 PPI illustrate a common high-resolution print density.',
    ],
    tableTitle: 'At 96 PPI',
    table: TABLE_96,
    tableTitle2: 'At 300 PPI',
    table2: TABLE_300,
  },
  {
    id: 'ppi-vs-dpi',
    title: 'Difference Between PPI and DPI',
    paragraphs: [
      'PPI counts pixels per inch and usually describes digital image resolution or pixel density. DPI counts dots per inch and usually describes physical output from a printer or imaging device.',
      'People often use the terms loosely, but they should not be treated as identical. Matching print quality to an image still depends on pixel dimensions, intended size, and how the output device lays down dots.',
    ],
  },
  {
    id: 'why-size-changes',
    title: 'Why Does Image Size Change With PPI?',
    paragraphs: [
      'Physical size = pixel count ÷ PPI. Raising PPI packs the same pixels into fewer inches, so the intended print shrinks. Lowering PPI stretches those pixels across more inches. Changing PPI metadata alone does not add or remove pixels in the file; it changes how software maps those pixels to physical length.',
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for graphic and web design sizing, print layout, photography output, image editing, digital artwork, document preparation, UI design, and checking whether a pixel dimension fits a target print size at a chosen resolution.',
      'This page does not measure your monitor automatically. For physical screen size you need the display’s real pixel density and scaling behavior, then set PPI to that context.',
    ],
  },
];

export const PIXELS_TO_INCHES_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert pixels to inches?',
    answer: 'Divide the pixel count by the selected PPI: inches = pixels ÷ PPI.',
  },
  {
    question: 'How many pixels are in one inch?',
    answer:
      'At 96 PPI, one inch corresponds to 96 pixels. At other PPI values the count equals that PPI.',
  },
  {
    question: 'How many inches is 192 pixels at 96 PPI?',
    answer: '192 ÷ 96 = 2 inches.',
  },
  {
    question: 'How many inches is 300 pixels at 300 PPI?',
    answer: '300 ÷ 300 = 1 inch.',
  },
  {
    question: 'How many pixels are in an inch at 300 PPI?',
    answer: '300 pixels.',
  },
  {
    question: 'How do I convert inches to pixels?',
    answer: 'Multiply inches by the selected PPI: pixels = inches × PPI.',
  },
  {
    question: 'What is the difference between pixels and inches?',
    answer:
      'Pixels are digital image samples or display units. Inches are a physical length unit. Converting between them requires a PPI (or equivalent density) assumption.',
  },
  {
    question: 'Is 96 PPI always the default for every screen?',
    answer:
      'No. The 96 px/in relationship is a CSS reference convention, not a universal physical screen density.',
  },
  {
    question: 'How many inches is 1080 pixels?',
    answer:
      'At 96 PPI: 1,080 ÷ 96 = 11.25 inches. At 300 PPI: 1,080 ÷ 300 = 3.6 inches.',
  },
  {
    question: 'Can I change PPI in the calculator?',
    answer: 'Yes. Enter any positive PPI or choose a preset such as 72, 96, 150, 200, 300, or 600.',
  },
  {
    question: 'What is the difference between PPI and DPI?',
    answer:
      'PPI describes pixels per inch. DPI generally describes dots per inch in physical output. They are related but not automatically the same.',
  },
  {
    question: 'Can this calculator determine the physical size of my monitor?',
    answer:
      'Only when you know the actual physical pixel density and relevant display scaling. Set PPI to match that measurement context.',
  },
];
