import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BYTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'common-conversions', label: 'Most Common Byte Conversions' },
  { id: 'bytes-to-kb-mb', label: 'Bytes to KB, MB, GB, and TB' },
  { id: 'decimal-vs-binary', label: 'Decimal vs Binary Storage Units' },
  { id: 'bits-vs-bytes', label: 'Bits vs Bytes' },
  { id: 'conversion-chart', label: 'Byte Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'byte-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const BYTE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'common-conversions',
    title: 'Most Common Byte Conversions',
    paragraphs: [
      'A byte is eight bits in modern computing. Storage capacity is often quoted with decimal SI prefixes (KB, MB, GB, TB) that step by 1000, while many operating systems and RAM sizes use binary IEC prefixes (KiB, MiB, GiB, TiB) that step by 1024. Mixing the labels is a common source of “missing” disk space confusion.',
    ],
    formula:
      '1 B = 8 bits · 1 KB = 1000 B · 1 MB = 1000 KB · 1 GB = 1000 MB · 1 TB = 1000 GB · 1 KiB = 1024 B · 1 MiB = 1024 KiB · 1 GiB = 1024 MiB · 1 TiB = 1024 GiB',
  },
  {
    id: 'bytes-to-kb-mb',
    title: 'How to Convert Bytes to KB, MB, GB, and TB',
    paragraphs: [
      'Divide by the matching power of 1000. Example: 1,500,000 bytes ÷ 1000 = 1500 KB; ÷ 1,000,000 = 1.5 MB; ÷ 1,000,000,000 = 0.0015 GB.',
    ],
    formula: '1,500,000 B = 1500 KB = 1.5 MB = 0.0015 GB',
  },
  {
    id: 'decimal-vs-binary',
    title: 'Decimal vs Binary Storage Units',
    paragraphs: [
      'Kilobyte (KB) means 1000 bytes; kibibyte (KiB) means 1024 bytes. The same pattern applies to MB/MiB, GB/GiB, and TB/TiB. Drive manufacturers usually advertise decimal capacities; many OS file browsers historically showed binary units while still labeling them with SI-looking abbreviations.',
    ],
    table: [
      { left: 'KB', right: '1,000 B', third: 'KiB = 1,024 B' },
      { left: 'MB', right: '1,000,000 B', third: 'MiB = 1,048,576 B' },
      { left: 'GB', right: '1,000,000,000 B', third: 'GiB = 1,073,741,824 B' },
      { left: 'TB', right: '1,000,000,000,000 B', third: 'TiB = 1,099,511,627,776 B' },
    ],
    tableHeaders: ['Decimal', 'Bytes', 'Binary counterpart'],
  },
  {
    id: 'bits-vs-bytes',
    title: 'Bits vs Bytes',
    paragraphs: [
      'Lowercase b usually means bits; uppercase B means bytes. Network rates are often quoted in megabits per second (Mbps), while file sizes use megabytes (MB). Nominally 8 Mbps = 1 MB/s as a unit conversion — not a guarantee of real-world throughput after protocol overhead.',
    ],
    formula: '1 B = 8 bits · 8 Mbps = 1 MB/s (nominal)',
  },
  {
    id: 'conversion-chart',
    title: 'Byte Conversion Chart',
    paragraphs: ['Selected verified values:'],
    table: [
      { left: '1 B', right: '8 bits', third: '2 nibbles' },
      { left: '8 B', right: '64 bits', third: '16 nibbles' },
      { left: '100 B', right: '0.1 KB', third: '≈ 0.09765625 KiB' },
      { left: '1000 B', right: '1 KB', third: '0.9765625 KiB' },
      { left: '1024 B', right: '1.024 KB', third: '1 KiB' },
      { left: '1,000,000 B', right: '1 MB', third: '≈ 0.953674 MiB' },
      { left: '1,048,576 B', right: '1.048576 MB', third: '1 MiB' },
      { left: '1,000,000,000 B', right: '1 GB', third: '≈ 0.931323 GiB' },
      { left: '1,073,741,824 B', right: '1.073741824 GB', third: '1 GiB' },
    ],
    tableHeaders: ['Bytes', 'Decimal', 'Binary / other'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Byte Conversion Calculator',
    paragraphs: [
      '1) Enter a value in bytes, kilobytes, megabytes, or gigabytes. 2) Watch the other fields update automatically. 3) Choose an additional unit (bits, KiB, TiB, …) and optionally edit that field as the source. 4) Compare KB vs KiB for the same byte quantity. 5) Share, reload to the 1000 B default, or clear all fields.',
    ],
  },
];

export const BYTE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a byte?',
    answer:
      'A byte is a unit of digital information consisting of eight bits in modern computing.',
  },
  {
    question: 'What is the difference between a bit and a byte?',
    answer: 'A bit is a single binary digit; a byte contains eight bits.',
  },
  {
    question: 'How many bytes are in 1 KB?',
    answer: 'One kilobyte contains exactly 1000 bytes under decimal SI prefixes.',
  },
  {
    question: 'How many bytes are in 1 KiB?',
    answer: 'One kibibyte contains exactly 1024 bytes.',
  },
  {
    question: 'How many bytes are in 1 MB?',
    answer: 'One megabyte contains 1,000,000 bytes.',
  },
  {
    question: 'How many bytes are in 1 MiB?',
    answer: 'One mebibyte contains 1,048,576 bytes.',
  },
  {
    question: 'How many MB are in 1 GB?',
    answer: 'One gigabyte contains 1000 megabytes.',
  },
  {
    question: 'How many MiB are in 1 GiB?',
    answer: 'One gibibyte contains 1024 mebibytes.',
  },
  {
    question: 'Are byte multiples binary or decimal?',
    answer:
      'Both systems exist. Decimal storage units use powers of 1000; binary IEC units use powers of 1024 and different symbols (KiB, MiB, GiB, …).',
  },
  {
    question: 'How many kilobytes are 1000 bytes?',
    answer: '1000 bytes equal 1 KB or 0.9765625 KiB.',
  },
  {
    question: 'Why does my computer display a different file size?',
    answer:
      'Differences can come from binary versus decimal unit conventions, rounding, filesystem allocation blocks, or compression. Not every operating system uses the same unit labels for the same factors.',
  },
];
