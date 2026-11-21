import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KB_MB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'binary-system', label: 'How the Binary Number System Works' },
  { id: 'how-many-kb', label: 'How Many Kilobytes Are in a Megabyte?' },
  { id: 'kb-to-mb-formula', label: 'kB to MB Conversion Formula' },
  { id: 'kib-to-mib-formula', label: 'KiB to MiB Conversion Formula' },
  { id: 'conversion-chart', label: 'kB to MB Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'unit-differences', label: 'Difference Between kB, KiB, MB, and MiB' },
  { id: 'speed-vs-size', label: 'Internet Speed vs. File Size' },
  { id: 'kb-mb-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const KB_MB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'binary-system',
    title: 'How the Binary Number System Works',
    paragraphs: [
      'Computers store and process information using binary (base 2). Each bit is 0 or 1. Grouping bits into bytes (8 bits) creates the building block for file sizes. Binary prefixes grow by powers of two: 2¹⁰ = 1024, which is why IEC units such as kibibyte (KiB) and mebibyte (MiB) use 1024.',
      'SI decimal prefixes instead use powers of 1000. Storage marketing and many web tools mix the two naming traditions, so this converter always labels MB (decimal) and MiB (binary) separately.',
    ],
    formula: '2⁰=1 · 2¹=2 · 2²=4 · 2³=8 · 2¹⁰=1024 · 1 byte = 8 bits',
  },
  {
    id: 'how-many-kb',
    title: 'How Many Kilobytes Are in a Megabyte?',
    paragraphs: [
      'Under SI decimal units, 1 MB = 1000 kB. Under IEC binary units, 1 MiB = 1024 KiB. These are different systems, do not treat them as interchangeable definitions of “mega.”',
    ],
    formula: '1 MB = 1000 kB · 1 MiB = 1024 KiB',
  },
  {
    id: 'kb-to-mb-formula',
    title: 'kB to MB Conversion Formula',
    paragraphs: [
      'Divide decimal kilobytes by 1000 to get decimal megabytes. Examples: 500 kB = 0.5 MB; 1000 kB = 1 MB; 2500 kB = 2.5 MB.',
    ],
    formula: 'MB = kB / 1000 · kB = MB × 1000',
  },
  {
    id: 'kib-to-mib-formula',
    title: 'KiB to MiB Conversion Formula',
    paragraphs: [
      'Divide kibibytes by 1024 to get mebibytes. Examples: 512 KiB = 0.5 MiB; 1024 KiB = 1 MiB; 2048 KiB = 2 MiB.',
    ],
    formula: 'MiB = KiB / 1024 · KiB = MiB × 1024',
  },
  {
    id: 'conversion-chart',
    title: 'kB to MB Conversion Chart',
    paragraphs: ['Decimal (SI) reference values:'],
    tableHeaders: ['Kilobytes (kB)', 'Megabytes (MB)'],
    table: [
      { left: '1', right: '0.001' },
      { left: '10', right: '0.01' },
      { left: '100', right: '0.1' },
      { left: '500', right: '0.5' },
      { left: '1000', right: '1' },
      { left: '1024', right: '1.024' },
      { left: '2048', right: '2.048' },
      { left: '5000', right: '5' },
      { left: '10000', right: '10' },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the kB to MB Converter',
    paragraphs: [
      '1. Choose whether the first field is kB (SI) or KiB (IEC).',
      '2. Enter a non-negative value in kilobytes/kibibytes, megabytes, or mebibytes.',
      '3. Review the linked SI MB and binary MiB results.',
      '4. Edit any field to recalculate the others through a shared byte value.',
      '5. Copy or share the summary, or reload/clear to reset.',
    ],
  },
  {
    id: 'unit-differences',
    title: 'Difference Between kB, KiB, MB, and MiB',
    paragraphs: [
      '1 kB = 1000 bytes; 1 KiB = 1024 bytes. 1 MB = 1,000,000 bytes; 1 MiB = 1,048,576 bytes. Lowercase b usually means bit; uppercase B means byte. Confusing them changes results by a factor of eight for transfer rates.',
    ],
    formula: '1 kB = 1000 B · 1 KiB = 1024 B · 1 MB = 1,000,000 B · 1 MiB = 1,048,576 B',
  },
  {
    id: 'speed-vs-size',
    title: 'Internet Connection Speed vs. File Size',
    paragraphs: [
      'File sizes are usually quoted in bytes (kB, MB, GiB). Network speeds are often bits per second (kbps, Mbps). Because 1 byte = 8 bits, an 8 Mbps link can transfer at most 1 MB/s in theory before protocol overhead.',
      'This tool converts storage sizes, not live network throughput.',
    ],
    formula: '8 Mbps ≈ 1 MB/s (theoretical, before overhead)',
  },
];

export const KB_MB_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert kB to MB?',
    answer: 'Divide kilobytes by 1000 for decimal megabytes. Example: 2048 kB = 2.048 MB.',
  },
  {
    question: 'How Big Is a kB Compared to an MB?',
    answer: 'One decimal megabyte contains 1000 kilobytes, so an MB is 1000 times a kB.',
  },
  {
    question: 'How Do I Convert MB to kB?',
    answer: 'Multiply decimal megabytes by 1000. Example: 2 MB = 2000 kB.',
  },
  {
    question: 'Which Is Larger, a Megabyte or a Kilobyte?',
    answer: 'A megabyte is larger. In SI units, 1 MB = 1000 kB.',
  },
  {
    question: 'Is 1024 kB Equal to 1 MB?',
    answer:
      'No under SI: 1024 kB = 1.024 MB. Separately, 1024 KiB = 1 MiB in the IEC binary system.',
  },
  {
    question: 'What Is the Difference Between MB and MiB?',
    answer:
      'MB is decimal (1,000,000 bytes). MiB is binary (1,048,576 bytes). This converter shows both from a shared byte value.',
  },
  {
    question: 'How Many Bytes Are in 1 kB?',
    answer: 'One decimal kilobyte contains 1000 bytes.',
  },
  {
    question: 'How Many Bytes Are in 1 KiB?',
    answer: 'One kibibyte contains 1024 bytes.',
  },
  {
    question: 'Are MB and Mb the Same?',
    answer:
      'No. MB means megabytes; Mb means megabits. One byte equals eight bits.',
  },
];
