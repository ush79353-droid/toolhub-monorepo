import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MBPS_CALC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mbps-vs-mbps', label: "What's the Difference Between Mbps and MBps?" },
  { id: 'what-are-units', label: 'What Are Mbps and MBps?' },
  { id: 'how-many-mbs', label: 'How Many MB/s Are in Mbps?' },
  { id: 'result-examples', label: 'Mbps to MBps Converter Result Examples' },
  { id: 'how-to-use', label: 'How to Use the Mbps Calculator' },
  { id: 'manual-mbps-to-mbs', label: 'How to Convert Mbps to MB/s Manually' },
  { id: 'manual-mbs-to-mbps', label: 'How to Convert MB/s to Mbps' },
  { id: 'download-slower', label: 'Why Is My Download Speed Lower Than My Internet Plan?' },
  { id: 'mbps-calc-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
  }[];
}

export const MBPS_CALC_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'mbps-vs-mbps',
    title: "What's the Difference Between Mbps and MBps?",
    paragraphs: [
      'Mbps means megabits per second. MB/s (sometimes written MBps) means megabytes per second. The lowercase letter b stands for bits; the uppercase letter B stands for bytes. Because eight bits equal one byte, the same data rate looks eight times larger when you count bits instead of bytes.',
      'Internet service providers usually advertise connection speed in Mbps. File download tools, operating-system transfer dialogs, and storage benchmarks more often show MB/s. Knowing both units helps you compare a plan’s advertised bandwidth with the throughput you see while copying a file.',
      'Advertised link speed is a theoretical ceiling for the connection. Application throughput is usually lower because of protocol overhead, Wi-Fi conditions, server limits, and device performance.',
    ],
    formula: 'Megabytes per second = Megabits per second ÷ 8 · Example: 80 Mbps ÷ 8 = 10 MB/s',
  },
  {
    id: 'what-are-units',
    title: 'What Are Mbps and MBps?',
    paragraphs: [
      'Both units measure data transfer rate—how much information moves each second—not how much data is stored on a disk.',
    ],
    subsections: [
      {
        id: 'megabits-per-second',
        title: 'Megabits per Second',
        paragraphs: [
          'Megabits per second (Mbps or Mbit/s) is a common networking unit. It appears in broadband plans, Ethernet and Wi-Fi interface ratings, streaming bandwidth estimates, and many communication-system specifications. Under SI decimal prefixes, 1 Mbps equals 1,000,000 bits per second.',
        ],
      },
      {
        id: 'megabytes-per-second',
        title: 'Megabytes per Second',
        paragraphs: [
          'Megabytes per second (MB/s) is widely used for file download speeds, file-transfer applications, storage throughput, backup tools, and transfer monitors. Under SI decimal prefixes, 1 MB/s equals 1,000,000 bytes per second, which is the same rate as 8 Mbps.',
        ],
      },
    ],
  },
  {
    id: 'how-many-mbs',
    title: 'How Many MB/s Are in Mbps?',
    paragraphs: [
      'Because one byte contains eight bits, dividing Mbps by eight converts to MB/s. That is why 1 Mbps equals 0.125 MB/s. The same relationship works in reverse: multiply MB/s by eight to get Mbps.',
      'Examples: 8 Mbps = 1 MB/s; 16 Mbps = 2 MB/s; 40 Mbps = 5 MB/s; 100 Mbps = 12.5 MB/s; 200 Mbps = 25 MB/s; 1000 Mbps = 125 MB/s.',
    ],
    formula: '1 Mbps = 0.125 MB/s · MB/s = Mbps ÷ 8 · Mbps = MB/s × 8',
  },
  {
    id: 'result-examples',
    title: 'Mbps to MBps Converter Result Examples',
    paragraphs: [
      'Use this SI decimal reference table when you need a quick Mbps to MB/s lookup. Values assume 8 bits per byte and powers of 1000 for kilo/mega/giga prefixes.',
    ],
    tableHeaders: ['Mbps', 'MB/s'],
    table: [
      { left: '1', right: '0.125' },
      { left: '2', right: '0.25' },
      { left: '4', right: '0.5' },
      { left: '5', right: '0.625' },
      { left: '8', right: '1' },
      { left: '10', right: '1.25' },
      { left: '20', right: '2.5' },
      { left: '40', right: '5' },
      { left: '50', right: '6.25' },
      { left: '80', right: '10' },
      { left: '100', right: '12.5' },
      { left: '300', right: '37.5' },
      { left: '600', right: '75' },
      { left: '1000', right: '125' },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mbps Calculator',
    paragraphs: [
      '1. Open the Megabits / Megabytes section (expanded by default).',
      '2. Enter either an Mbps (Mbit/s) or MB/s value.',
      '3. Read the automatically calculated companion field.',
      '4. Expand Other data transfer units (bits) for bit/s, kbit/s, and Gbit/s.',
      '5. Expand Other data transfer units (bytes) for B/s, kB/s, and GB/s.',
      '6. Select an example to populate the calculator with a worked scenario.',
      '7. Use Share result, Reload calculator, or Clear all changes as needed.',
    ],
  },
  {
    id: 'manual-mbps-to-mbs',
    title: 'How to Convert Mbps to MB/s Manually',
    paragraphs: [
      'Divide the megabit rate by eight. For example, 240 Mbps ÷ 8 = 30 MB/s. This calculator performs the same conversion while also filling related SI rate units from a shared bits-per-second value.',
    ],
    formula: 'MB/s = Mbps ÷ 8 · Example: 240 Mbps ÷ 8 = 30 MB/s',
  },
  {
    id: 'manual-mbs-to-mbps',
    title: 'How to Convert MB/s to Mbps',
    paragraphs: [
      'Multiply the megabyte rate by eight. For example, 15 MB/s × 8 = 120 Mbps. Editing either field in the calculator keeps every other rate synchronized.',
    ],
    formula: 'Mbps = MB/s × 8 · Example: 15 MB/s × 8 = 120 Mbps',
  },
  {
    id: 'download-slower',
    title: 'Why Is My Download Speed Lower Than My Internet Plan?',
    paragraphs: [
      'A plan rated at 100 Mbps has a theoretical maximum of 12.5 MB/s before overhead. Real downloads are often slower because of network protocol overhead, Wi-Fi signal quality, server bandwidth limits, congestion, router capacity, device performance, and background network activity.',
      'Unit confusion also matters: if a speed test reports 100 Mbps while a download dialog shows about 10–12 MB/s, those figures can still be consistent. Mbps counts bits; MB/s counts bytes.',
    ],
  },
];

export const MBPS_CALC_FAQS: readonly FAQItem[] = [
  {
    question: 'Is megabyte per second equal to megabit per second?',
    answer:
      'No. One megabyte contains eight megabits, so 1 MB/s = 8 Mbps. The units differ by a factor of eight.',
  },
  {
    question: 'How do I convert Mbps to MB/s?',
    answer: 'Divide Mbps by eight. Example: 100 Mbps ÷ 8 = 12.5 MB/s.',
  },
  {
    question: 'How do I convert MB/s to Mbps?',
    answer: 'Multiply MB/s by eight. Example: 10 MB/s × 8 = 80 Mbps.',
  },
  {
    question: 'Is 100 Mbps fast?',
    answer:
      '100 Mbps provides a theoretical maximum of 12.5 MB/s. Whether that is enough depends on how many users, devices, and applications share the connection, and on activities such as 4K streaming, large downloads, or cloud backups.',
  },
  {
    question: 'How many MB/s is 1 Gbps?',
    answer:
      '1 Gbps = 1000 Mbps under SI networking prefixes. 1000 ÷ 8 = 125 MB/s. So 1 Gbps equals 125 MB/s.',
  },
  {
    question: 'What is the difference between Mbps and MB/s?',
    answer:
      'Mbps measures megabits per second. MB/s measures megabytes per second. The difference is a factor of eight because there are eight bits in one byte.',
  },
  {
    question: 'Is Mbps the same as MBps?',
    answer:
      'No. Capitalization matters: Mbps is megabits per second; MBps (or MB/s) is megabytes per second.',
  },
  {
    question: 'How long does it take to download a 1 GB file at 100 Mbps?',
    answer:
      'For a decimal 1 GB file (1000 MB) at a theoretical 12.5 MB/s (100 Mbps ÷ 8), the minimum time is about 80 seconds (1000 ÷ 12.5). Real downloads often take longer because of overhead and other limits.',
  },
  {
    question: 'What is the difference between MB/s and MiB/s?',
    answer:
      'MB/s uses decimal SI megabytes (1 MB = 1,000,000 bytes). MiB/s uses binary mebibytes (1 MiB = 1,048,576 bytes). They are not identical and should not be substituted for each other without converting.',
  },
];
