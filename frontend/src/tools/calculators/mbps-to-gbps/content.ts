import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MBPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'data-transfer-rate', label: 'Data Transfer Rate (DTR)' },
  { id: 'abbreviations', label: 'What Does Mbps Mean?' },
  { id: 'how-to-convert', label: 'How to Convert Mbps to Gbps' },
  { id: 'mbps-vs-mbps', label: 'Mbps vs MBps' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'practical-uses', label: 'Practical Applications' },
  { id: 'mbps-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    formula?: string;
    table?: readonly { left: string; right: string }[];
    tableHeaders?: readonly [string, string];
  }[];
}

export const MBPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'data-transfer-rate',
    title: 'Data Transfer Rate (DTR)',
    paragraphs: [
      'Data transfer rate measures how many bits move across a link each second. Internet plans, Ethernet ports, Wi-Fi radios, and data-center fabrics are commonly quoted in megabits per second (Mbps) or gigabits per second (Gbps). Advertised bandwidth is a nominal ceiling; real application throughput can be lower because of protocol overhead, congestion, Wi-Fi airtime, disk speed, and server limits.',
    ],
  },
  {
    id: 'abbreviations',
    title: 'What Does Mbps Mean? Abbreviations Explained',
    paragraphs: [
      'Mbps means megabits per second: 1 Mbps = 1,000,000 bits per second under decimal SI networking conventions. Gbps means gigabits per second: 1 Gbps = 1,000,000,000 bits per second. GB/s means gigabytes per second: 1 GB/s = 1,000,000,000 bytes per second. Because one byte is eight bits, 1 GB/s equals 8 Gbps. Lowercase b is bits; uppercase B is bytes; Mbps and MB/s are not the same unit.',
    ],
    formula: '1 Mbps = 1,000,000 bit/s · 1 Gbps = 1,000,000,000 bit/s · 1 GB/s = 8 Gbps · 1 B = 8 bits',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Mbps to Gbps',
    paragraphs: [
      'Divide megabits per second by 1000 to get gigabits per second. Multiply Gbps by 1000 to get Mbps. Examples: 100 Mbps = 0.1 Gbps; 500 Mbps = 0.5 Gbps; 1000 Mbps = 1 Gbps; 2500 Mbps = 2.5 Gbps; 10,000 Mbps = 10 Gbps.',
    ],
    formula: 'Gbps = Mbps / 1000 · Mbps = Gbps × 1000',
    subsections: [
      {
        id: 'mbps-in-gbps',
        title: 'How Many Mbps in Gbps?',
        paragraphs: ['1 Gbps = 1000 Mbps and 1 Mbps = 0.001 Gbps.'],
        formula: '1 Gbps = 1000 Mbps',
        tableHeaders: ['Mbps', 'Gbps'],
        table: [
          { left: '1', right: '0.001' },
          { left: '10', right: '0.01' },
          { left: '50', right: '0.05' },
          { left: '100', right: '0.1' },
          { left: '250', right: '0.25' },
          { left: '500', right: '0.5' },
          { left: '1000', right: '1' },
          { left: '2500', right: '2.5' },
          { left: '5000', right: '5' },
          { left: '10,000', right: '10' },
        ],
      },
      {
        id: 'mbps-in-gbps-bytes',
        title: 'How Many Mbps in GB/s?',
        paragraphs: [
          'Gigabytes per second count bytes, not bits. 1 GB/s = 8000 Mbps. Divide Mbps by 8000 for GB/s, or multiply GB/s by 8000 for Mbps.',
        ],
        formula: '1 GB/s = 8000 Mbps · GB/s = Mbps / 8000',
        tableHeaders: ['Mbps', 'GB/s'],
        table: [
          { left: '100', right: '0.0125' },
          { left: '500', right: '0.0625' },
          { left: '1000', right: '0.125' },
          { left: '2000', right: '0.25' },
          { left: '4000', right: '0.5' },
          { left: '8000', right: '1' },
          { left: '16,000', right: '2' },
        ],
      },
      {
        id: 'gbps-in-gbs',
        title: 'How Many Gbps in GB/s?',
        paragraphs: ['1 GB/s = 8 Gbps and 1 Gbps = 0.125 GB/s.'],
        formula: '1 GB/s = 8 Gbps',
        tableHeaders: ['Gbps', 'GB/s'],
        table: [
          { left: '1', right: '0.125' },
          { left: '2', right: '0.25' },
          { left: '4', right: '0.5' },
          { left: '8', right: '1' },
          { left: '10', right: '1.25' },
          { left: '20', right: '2.5' },
          { left: '40', right: '5' },
          { left: '100', right: '12.5' },
        ],
      },
    ],
  },
  {
    id: 'mbps-vs-mbps',
    title: 'Mbps vs MBps: What\'s the Difference?',
    paragraphs: [
      'Mbps is megabits per second; MB/s (sometimes written MBps) is megabytes per second. Because a byte has eight bits, 8 Mbps equals 1 MB/s as a unit conversion (80 Mbps ≈ 10 MB/s; 800 Mbps ≈ 100 MB/s). That conversion is nominal; it does not guarantee download speed after protocol and path overhead.',
    ],
    formula: '8 Mbps = 1 MB/s · 80 Mbps = 10 MB/s · 800 Mbps = 100 MB/s (nominal)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Mbps to Gbps Converter',
    paragraphs: [
      '1) Enter a value in megabits per second. 2) Read the matching gigabits per second. 3) Read gigabytes per second. 4) Edit Gbps or GB/s to convert in the reverse direction. 5) Clear fields or reload to the 1000 Mbps default. 6) Copy or share the summary when needed.',
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Applications of Mbps to Gbps Conversion',
    paragraphs: [
      'Use these conversions when comparing home fiber tiers, Ethernet port ratings (1G / 2.5G / 10G), router WAN specs, switch uplinks, data-center links, and rough file-transfer time estimates. Treat published rates as planning numbers; measured throughput depends on the full path.',
    ],
  },
];

export const MBPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert Mbps to Gbps?',
    answer: 'Divide Mbps by 1000. Example: 2000 Mbps / 1000 = 2 Gbps.',
  },
  {
    question: 'How many Mbps are in 1 Gbps?',
    answer: 'There are exactly 1000 Mbps in 1 Gbps under decimal SI networking conventions.',
  },
  {
    question: 'Is 1000 Mbps equal to 1 Gbps?',
    answer: 'Yes. Under decimal SI networking conventions, 1000 Mbps is exactly 1 Gbps.',
  },
  {
    question: 'How many Gbps is 500 Mbps?',
    answer: '500 / 1000 = 0.5 Gbps.',
  },
  {
    question: 'How many Gbps is 2500 Mbps?',
    answer: '2500 / 1000 = 2.5 Gbps.',
  },
  {
    question: 'How many Mbps is 10 Gbps?',
    answer: '10 × 1000 = 10,000 Mbps.',
  },
  {
    question: 'How do I convert Mbps to GB/s?',
    answer: 'Divide Mbps by 8000. Example: 8000 Mbps = 1 GB/s.',
  },
  {
    question: 'Is gigabyte per second equal to gigabit per second?',
    answer: 'No. 1 GB/s = 8 Gbps because one byte contains eight bits.',
  },
  {
    question: 'What is the difference between Mbps and MBps?',
    answer:
      'Mbps measures megabits per second; MBps (MB/s) measures megabytes per second. One byte contains eight bits.',
  },
  {
    question: 'Is 1 Gbps internet faster than 100 Mbps?',
    answer:
      'Yes. A nominal 1 Gbps connection has ten times the data transfer rate of a nominal 100 Mbps connection, although real-world speeds depend on network conditions and equipment.',
  },
];
