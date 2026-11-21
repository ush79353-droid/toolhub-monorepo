import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COLOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-color-converter', label: 'What Is a Color Converter?' },
  { id: 'color-formats', label: 'RGB vs. CMYK vs. HEX' },
  { id: 'how-to-use', label: 'How to Use Our Color Converter' },
  { id: 'hex-to-rgb', label: 'How to Convert HEX to RGB' },
  { id: 'rgb-to-cmyk', label: 'How to Convert RGB to CMYK' },
  { id: 'transparency', label: 'Understanding Color Transparency' },
  { id: 'conversion-examples', label: 'Color Conversion Examples' },
  { id: 'color-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { color: string; hex: string; rgb: string }[];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
}

export const COLOR_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-color-converter',
    title: 'What Is a Color Converter?',
    paragraphs: [
      'A color converter translates the same visible color between encoding systems used in design, development, and print workflows. Screens describe light with additive models such as RGB and HEX; many UI tools prefer HSL or HSV; print pipelines often speak in CMYK ink percentages.',
      'Digital color is stored as numbers. HEX packs red, green, and blue into hexadecimal digits. HSL and HSV rearrange those channels into hue, saturation, and either lightness or value so designers can adjust tints more intuitively. CMYK estimates how much cyan, magenta, yellow, and black ink a simplified formula would use.',
      'This calculator keeps one internal sRGB color (plus alpha), then derives every supported output from that canonical value so you avoid chaining rounded intermediate conversions.',
    ],
  },
  {
    id: 'color-formats',
    title: 'RGB vs. CMYK vs. HEX: Understanding Color Formats',
    paragraphs: [
      'Different industries settled on different encodings for the same screen color. Knowing what each format measures helps you pick the right input and interpret the outputs correctly.',
    ],
    subsections: [
      {
        id: 'rgb-format',
        title: 'RGB: Red, Green, Blue',
        paragraphs: [
          'RGB is an additive model: combining red, green, and blue light at full intensity yields white. Displays mix the three channels to produce a color. Each channel is typically an integer from 0 to 255 in 8-bit sRGB.',
        ],
      },
      {
        id: 'hex-format',
        title: 'HEX: Hexadecimal Color Codes',
        paragraphs: [
          'HEX is the web’s compact notation for RGB. Six hex digits encode the three channels (two digits each). Shorthand forms such as #RGB expand each digit. Four- and eight-digit forms can also store alpha for CSS.',
        ],
      },
      {
        id: 'hsl-format',
        title: 'HSL: Hue, Saturation, Lightness',
        paragraphs: [
          'Hue is an angle on the color wheel (0–360°). Saturation is the intensity of that hue (0–100%). Lightness runs from black (0%) through the pure color (near 50%) to white (100%). HSL is popular for theming because adjusting lightness keeps the hue stable.',
        ],
      },
      {
        id: 'hsv-format',
        title: 'HSV: Hue, Saturation, Value',
        paragraphs: [
          'HSV (also called HSB) shares hue with HSL but uses value, how bright the color is relative to the strongest channel. Many native color pickers use HSV because dragging “brightness” maps cleanly to value.',
        ],
      },
      {
        id: 'cmyk-format',
        title: 'CMYK: Cyan, Magenta, Yellow, Black',
        paragraphs: [
          'CMYK is a subtractive ink model used in printing. The mathematical RGB↔CMYK formulas here are a teaching approximation only. Real presses rely on ICC profiles, paper stock, and color-management workflows; this tool does not claim press-accurate print matching.',
        ],
      },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Color Converter',
    paragraphs: [
      '1. Choose the source encoding from the dropdown (RGB is the default).',
      '2. Enter the channel values, HEX string, or use the native color picker.',
      '3. Review the live preview and the automatically generated formats.',
      '4. Copy any individual code with its Copy button.',
      '5. Switch encodings to edit the same color from another model. alpha is preserved internally when the selected model omits it.',
      '6. Share a summary, reload the default sample, or clear all fields when you are done.',
    ],
  },
  {
    id: 'hex-to-rgb',
    title: 'How to Convert HEX Color Codes to RGB',
    paragraphs: [
      'Split a six-digit HEX code into three pairs and convert each pair from base 16 to decimal.',
    ],
    formula: 'HEX #FF6432 → FF=255, 64=100, 32=50 → RGB (255, 100, 50)',
  },
  {
    id: 'rgb-to-cmyk',
    title: 'How to Convert RGB to CMYK',
    paragraphs: [
      'Normalize each RGB channel by dividing by 255. Black (K) is 1 minus the largest normalized channel. For non-black colors, cyan, magenta, and yellow are (1 − channel − K) / (1 − K). Multiply by 100 for percentages. Pure black is C=M=Y=0, K=100%.',
      'Example: RGB (224, 224, 224) → K ≈ 12.16%, with C=M=Y=0. Treat these values as an approximation, send print jobs through a color-managed pipeline with the correct ICC profile when accuracy matters.',
    ],
    formula:
      "K = 1 − max(R', G', B') · C = (1 − R' − K)/(1 − K) · M = (1 − G' − K)/(1 − K) · Y = (1 − B' − K)/(1 − K)",
  },
  {
    id: 'transparency',
    title: 'Understanding Color Transparency',
    paragraphs: [
      'Alpha describes opacity from 0 (fully transparent) to 1 (fully opaque). RGBA and HSLA expose alpha directly. CSS also allows four- and eight-digit HEX codes where the last digit or pair encodes alpha.',
      'When you switch to a model without alpha (RGB, HSL, HSV, CMYK), this converter keeps the previous alpha for the preview and for alpha-capable outputs. Exported CMYK and opaque HEX/RGB strings intentionally omit transparency, use RGBA, HSLA, or HEX+alpha when you need it.',
      'The preview draws a checkerboard behind the swatch so transparent colors remain visible.',
    ],
  },
  {
    id: 'conversion-examples',
    title: 'Color Conversion Examples',
    paragraphs: [
      'Common named colors and their HEX / RGB equivalents:',
    ],
    table: [
      { color: 'Red', hex: '#FF0000', rgb: '255, 0, 0' },
      { color: 'Green', hex: '#00FF00', rgb: '0, 255, 0' },
      { color: 'Blue', hex: '#0000FF', rgb: '0, 0, 255' },
      { color: 'White', hex: '#FFFFFF', rgb: '255, 255, 255' },
      { color: 'Black', hex: '#000000', rgb: '0, 0, 0' },
      { color: 'Yellow', hex: '#FFFF00', rgb: '255, 255, 0' },
      { color: 'Cyan', hex: '#00FFFF', rgb: '0, 255, 255' },
      { color: 'Magenta', hex: '#FF00FF', rgb: '255, 0, 255' },
    ],
  },
];

export const COLOR_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I use HEX codes for printing?',
    answer:
      'HEX codes describe digital (usually sRGB) colors. Printing workflows generally convert to CMYK using a color profile matched to the press and paper, not a raw HEX string alone.',
  },
  {
    question: 'How do I convert a HEX color code to CMYK?',
    answer:
      'Convert HEX to RGB first, normalize the channels, then apply the simplified CMYK formulas shown above. For production print work, use color management with an appropriate ICC profile instead of a website approximation.',
  },
  {
    question: 'How do I convert RGB to CMYK without losing color?',
    answer:
      'A mathematical converter can only approximate CMYK. Some RGB colors lie outside a given printer’s gamut and cannot be reproduced exactly. Accurate matching needs calibrated devices and ICC profiles.',
  },
  {
    question: 'What is RGB (224, 224, 224) in CMYK?',
    answer:
      'Using the simplified formula, RGB (224, 224, 224) is approximately CMYK (0%, 0%, 0%, 12.16%).',
  },
  {
    question: 'What is the difference between RGB and HEX?',
    answer:
      'RGB lists red, green, and blue as decimal channel values. HEX encodes those same channels as hexadecimal digits after a #.',
  },
  {
    question: 'Can HEX colors contain transparency?',
    answer:
      'Yes. Four-digit (#RGBA) and eight-digit (#RRGGBBAA) CSS hexadecimal notation can store an alpha channel.',
  },
  {
    question: 'What is the difference between HSL and HSV?',
    answer:
      'Both use hue and saturation, but HSL’s third axis is lightness while HSV’s is value (brightness). The same color usually has different numeric S/L vs S/V values.',
  },
  {
    question: 'How do I convert RGB to HEX?',
    answer:
      'Convert each channel from 0–255 into a two-digit hexadecimal value and concatenate the three pairs after #. Example: 255,100,50 → #FF6432.',
  },
  {
    question: 'Can I use CMYK colors directly in CSS?',
    answer:
      'Standard CSS does not provide a universally supported cmyk() function. Prefer RGB, HEX, HSL, or other CSS-supported formats for browser rendering.',
  },
];
