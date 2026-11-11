/**
 * Omega Calculators — Admin Mock Data & Safe Registries
 *
 * NOTE: This module contains strictly labeled demonstration records for UI prototyping.
 * Real administrative operations must communicate with the Express backend via Next.js Server Actions.
 * Arbitrary React component execution is disabled; only developer-approved component keys are valid.
 */

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  toolCount: number;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdDate: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  content?: string;
}

export interface AdminTool {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  executionType: 'client' | 'server' | 'third-party';
  componentKey: string;
  status: 'published' | 'draft' | 'disabled';
  isFeatured: boolean;
  shortDescription: string;
  fullDescription: string;
  toolIcon: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  isIndexable: boolean;
  howToUse: string[];
  about: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  relatedToolSlugs: string[];
  updatedDate: string;
  createdDate: string;
  executionCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'Viewer';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActivity: string;
}

export interface AdminMediaItem {
  id: string;
  fileName: string;
  fileType: 'image/png' | 'image/jpeg' | 'image/svg+xml' | 'application/pdf' | 'image/webp';
  fileSize: string;
  dimensions?: string;
  uploadDate: string;
  url: string;
  altText: string;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  action:
    'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'CONFIG_CHANGE' | 'LOGIN_ATTEMPT';
  resource: string;
  result: 'success' | 'warning' | 'error';
  details: string;
}

export interface AdminIntegration {
  id: string;
  name: string;
  category: 'AI Models' | 'File Storage' | 'Email Services' | 'Analytics' | 'Payment Gateways';
  status: 'connected' | 'disconnected' | 'pending_setup';
  description: string;
  lastSync?: string;
  configFields: {
    key: string;
    label: string;
    isSecret: boolean;
    maskedValue: string;
  }[];
}

export interface AdminCMSPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  updatedDate: string;
  seoStatus: 'optimized' | 'needs_review';
  views: number;
}

export const SAFE_COMPONENT_KEYS = [
  { key: 'AgeCalculator', name: 'Age Calculator Engine', type: 'client' },
  { key: 'BmiCalculator', name: 'BMI & Body Composition Engine', type: 'client' },
  { key: 'PercentageCalculator', name: 'Percentage Math Engine', type: 'client' },
  { key: 'LoanCalculator', name: 'Amortization & Loan Engine', type: 'client' },
  { key: 'WordCounter', name: 'Text & Typography Metrics Engine', type: 'client' },
  { key: 'JsonFormatter', name: 'JSON Validator & Formatter Engine', type: 'client' },
  { key: 'PdfMerger', name: 'PDF Processing Core', type: 'server' },
  { key: 'ImageCompressor', name: 'Image Compression Engine', type: 'server' },
  { key: 'SvgToPng', name: 'Vector Rasterizer Service', type: 'server' },
  { key: 'QrCodeGenerator', name: 'QR Matrix Generator', type: 'client' },
  { key: 'LoremIpsumGenerator', name: 'Placeholder Text Generator', type: 'client' },
  { key: 'ColorPicker', name: 'Hex/RGB/HSL Palette Engine', type: 'client' },
  { key: 'OpenAiSummarizer', name: 'OpenAI Summarization Service', type: 'third-party' },
] as const;

export const INITIAL_ADMIN_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-1',
    name: 'Calculators',
    slug: 'calculators',
    description: 'Financial, health, math, and everyday numerical utility calculators.',
    icon: 'Calculator',
    toolCount: 18,
    status: 'active',
    sortOrder: 1,
    createdDate: '2026-01-10',
    seoTitle: 'Free Online Calculators — Finance, Health, Math | Omega Calculators',
    seoDescription:
      'Accurate and instant calculation tools for finance, health, math, and daily metrics with zero signup.',
  },
  {
    id: 'cat-2',
    name: 'Converters',
    slug: 'converters',
    description: 'Unit, currency, time zone, metric, and data format conversion utilities.',
    icon: 'ArrowLeftRight',
    toolCount: 14,
    status: 'active',
    sortOrder: 2,
    createdDate: '2026-01-11',
    seoTitle: 'Online Unit & Currency Converters | Omega Calculators',
    seoDescription:
      'Convert units, currencies, lengths, weights, and file data with real-time conversion rates.',
  },
  {
    id: 'cat-3',
    name: 'PDF Tools',
    slug: 'pdf',
    description: 'Merge, split, compress, protect, and convert PDF documents.',
    icon: 'FileText',
    toolCount: 12,
    status: 'active',
    sortOrder: 3,
    createdDate: '2026-01-12',
    seoTitle: 'Fast Online PDF Utilities — Merge, Split, Compress | Omega Calculators',
    seoDescription:
      'Private and secure document processing tools directly in your browser or fast cloud engines.',
  },
  {
    id: 'cat-4',
    name: 'Image Tools',
    slug: 'image',
    description: 'Resize, crop, compress, convert, and optimize images.',
    icon: 'Image',
    toolCount: 10,
    status: 'active',
    sortOrder: 4,
    createdDate: '2026-01-15',
    seoTitle: 'Image Optimization & Conversion Tools | Omega Calculators',
    seoDescription:
      'Compress PNGs, convert JPEGs to WebP, and resize images without losing visual quality.',
  },
  {
    id: 'cat-5',
    name: 'Developer Tools',
    slug: 'developer',
    description: 'Formatters, validators, encoders, decoders, and regex testers.',
    icon: 'Code2',
    toolCount: 16,
    status: 'active',
    sortOrder: 5,
    createdDate: '2026-01-18',
    seoTitle: 'Online Developer Utilities & Encoders | Omega Calculators',
    seoDescription:
      'JSON formatters, Base64 converters, regex analyzers, and code minifiers for engineers.',
  },
  {
    id: 'cat-6',
    name: 'SEO Tools',
    slug: 'seo',
    description: 'Meta tag generators, SERP previews, keyword density, and robot testers.',
    icon: 'Search',
    toolCount: 8,
    status: 'active',
    sortOrder: 6,
    createdDate: '2026-01-20',
    seoTitle: 'Free Search Engine Optimization Tools | Omega Calculators',
    seoDescription:
      'Audit meta tags, preview Google search snippets, and test your open graph cards.',
  },
  {
    id: 'cat-7',
    name: 'AI Tools',
    slug: 'ai',
    description: 'AI-assisted summarization, prompt enhancement, and text utilities.',
    icon: 'Sparkles',
    toolCount: 6,
    status: 'active',
    sortOrder: 7,
    createdDate: '2026-01-25',
    seoTitle: 'AI-Powered Text & Productivity Tools | Omega Calculators',
    seoDescription:
      'Smart AI assistants for summarization, paraphrasing, and workflow acceleration.',
  },
  {
    id: 'cat-8',
    name: 'Text & Writing',
    slug: 'text',
    description: 'Word counters, character statistics, case converters, and diff checkers.',
    icon: 'Type',
    toolCount: 9,
    status: 'active',
    sortOrder: 8,
    createdDate: '2026-01-28',
    seoTitle: 'Text Analysis & Typography Tools | Omega Calculators',
    seoDescription:
      'Analyze reading time, word count, character density, and text casing instantly.',
  },
  {
    id: 'cat-9',
    name: 'Security & Privacy',
    slug: 'security',
    description: 'Hash generators, password analyzers, and encryption decoders.',
    icon: 'ShieldCheck',
    toolCount: 5,
    status: 'inactive',
    sortOrder: 9,
    createdDate: '2026-02-01',
    seoTitle: 'Security & Cryptographic Utilities | Omega Calculators',
    seoDescription:
      'Generate secure SHA/MD5 hashes and analyze password entropy with local processing.',
  },
];

export const INITIAL_ADMIN_TOOLS: AdminTool[] = [
  {
    id: 'tool-1',
    name: 'Age Calculator',
    slug: 'age-calculator',
    categorySlug: 'calculators',
    categoryName: 'Calculators',
    executionType: 'client',
    componentKey: 'AgeCalculator',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Calculate exact age in years, months, days, hours, and minutes from date of birth.',
    fullDescription:
      'Comprehensive age calculation tool that delivers exact breakdowns of elapsed time, days until next birthday, and planetary ages.',
    toolIcon: 'Calendar',
    tags: ['age', 'birthday', 'chronology', 'date'],
    seoTitle: 'Age Calculator — Exact Age in Years, Months, and Days | Omega Calculators',
    seoDescription:
      'Find your precise age down to the day and minute. 100% private in-browser calculation.',
    isIndexable: true,
    howToUse: ['Select your birth date', 'Optionally pick target date', 'Click Calculate'],
    about: 'Computes calendar intervals considering leap years and month durations accurately.',
    features: ['Year/Month/Day Breakdown', 'Next Birthday Countdown', 'Total Days & Hours Lived'],
    faqs: [
      {
        question: 'Is my birthday stored?',
        answer: 'No, all calculations run in your browser memory.',
      },
    ],
    relatedToolSlugs: ['percentage-calculator', 'bmi-calculator'],
    updatedDate: '2026-02-10',
    createdDate: '2026-01-10',
    executionCount: 42800,
  },
  {
    id: 'tool-2',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    categorySlug: 'calculators',
    categoryName: 'Calculators',
    executionType: 'client',
    componentKey: 'PercentageCalculator',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Quickly solve percentage increase, decrease, discounts, and ratio questions.',
    fullDescription:
      'Multipurpose math calculator solving what is X% of Y, percentage differences, and sales markdowns.',
    toolIcon: 'Percent',
    tags: ['percentage', 'math', 'discount', 'ratio'],
    seoTitle: 'Percentage Calculator — Quick Percent Math & Discount Tool | Omega Calculators',
    seoDescription:
      'Calculate percentage discounts, increases, differences, and fractions instantly.',
    isIndexable: true,
    howToUse: ['Choose calculation mode', 'Enter numeric values', 'View real-time solution'],
    about: 'Provides clear formulas and step-by-step arithmetic steps alongside the answer.',
    features: ['Percent of Value', 'Percentage Difference', 'Discount / Tax Solver'],
    faqs: [
      {
        question: 'How is percentage difference calculated?',
        answer: '|A - B| / ((A + B)/2) * 100.',
      },
    ],
    relatedToolSlugs: ['age-calculator', 'loan-calculator'],
    updatedDate: '2026-02-09',
    createdDate: '2026-01-12',
    executionCount: 39540,
  },
  {
    id: 'tool-3',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    categorySlug: 'calculators',
    categoryName: 'Calculators',
    executionType: 'client',
    componentKey: 'BmiCalculator',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Calculate Body Mass Index (BMI) and health category based on WHO guidelines.',
    fullDescription:
      'Supports metric and imperial units with interactive weight category visualizer and healthy weight range indicators.',
    toolIcon: 'Activity',
    tags: ['bmi', 'health', 'fitness', 'weight'],
    seoTitle: 'BMI Calculator — Body Mass Index for Adults | Omega Calculators',
    seoDescription:
      'Check your Body Mass Index with metric and imperial units according to WHO standards.',
    isIndexable: true,
    howToUse: ['Choose unit system', 'Enter height and weight', 'Review your BMI category'],
    about: 'Uses standard Quetelet index formula (weight in kg / height in meters squared).',
    features: ['Metric & Imperial', 'WHO Category Classification', 'Healthy Weight Range Target'],
    faqs: [
      {
        question: 'What is a normal BMI?',
        answer: 'A BMI between 18.5 and 24.9 is considered normal weight.',
      },
    ],
    relatedToolSlugs: ['age-calculator'],
    updatedDate: '2026-02-08',
    createdDate: '2026-01-14',
    executionCount: 51200,
  },
  {
    id: 'tool-4',
    name: 'Loan Calculator',
    slug: 'loan-calculator',
    categorySlug: 'calculators',
    categoryName: 'Calculators',
    executionType: 'client',
    componentKey: 'LoanCalculator',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Estimate monthly loan payments, total interest, and full amortization schedule.',
    fullDescription:
      'Plan mortgages, auto loans, or personal debts with customizable interest rates and loan terms.',
    toolIcon: 'DollarSign',
    tags: ['loan', 'mortgage', 'finance', 'interest'],
    seoTitle: 'Loan Calculator — Monthly Payment & Amortization | Omega Calculators',
    seoDescription:
      'Accurate monthly mortgage and personal loan payment estimates with amortization schedules.',
    isIndexable: true,
    howToUse: [
      'Enter loan amount',
      'Set annual interest rate',
      'Select repayment duration in years',
    ],
    about: 'Computes monthly annuity payments using standard compounding amortization formulas.',
    features: ['Monthly Payment', 'Total Interest Cost', 'Yearly Amortization Chart'],
    faqs: [
      {
        question: 'Does this account for compounding?',
        answer: 'Yes, standard monthly compounding is used.',
      },
    ],
    relatedToolSlugs: ['percentage-calculator'],
    updatedDate: '2026-02-07',
    createdDate: '2026-01-15',
    executionCount: 28400,
  },
  {
    id: 'tool-5',
    name: 'Word Counter',
    slug: 'word-counter',
    categorySlug: 'text',
    categoryName: 'Text & Writing',
    executionType: 'client',
    componentKey: 'WordCounter',
    status: 'published',
    isFeatured: true,
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimated reading time.',
    fullDescription:
      'In-depth text analysis utility providing keyword frequency, character density, and readability score.',
    toolIcon: 'Type',
    tags: ['words', 'characters', 'text', 'writing'],
    seoTitle: 'Word Counter — Free Online Word & Character Count Tool | Omega Calculators',
    seoDescription: 'Instant word, sentence, and character counter with reading time estimation.',
    isIndexable: true,
    howToUse: ['Paste or type text in editor', 'Inspect live counters in real time'],
    about:
      'Client-side text analytics with zero server storage for complete confidential document safety.',
    features: ['Live Word Count', 'Reading & Speaking Time', 'Top Keyword Density'],
    faqs: [
      {
        question: 'Are spaces included in character count?',
        answer: 'Both with-space and without-space totals are provided.',
      },
    ],
    relatedToolSlugs: ['json-formatter'],
    updatedDate: '2026-02-06',
    createdDate: '2026-01-18',
    executionCount: 64100,
  },
  {
    id: 'tool-6',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    categorySlug: 'developer',
    categoryName: 'Developer Tools',
    executionType: 'client',
    componentKey: 'JsonFormatter',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Prettify, minify, validate, and debug JSON payloads with syntax highlighting.',
    fullDescription:
      'Essential developer tool providing clear error diagnostics with line and column highlighting.',
    toolIcon: 'Code2',
    tags: ['json', 'formatter', 'validator', 'developer'],
    seoTitle: 'JSON Formatter & Validator — Clean & Prettify JSON | Omega Calculators',
    seoDescription:
      'Validate and beautify JSON strings with 2-space or 4-space indentation and instant error pinpointing.',
    isIndexable: true,
    howToUse: ['Paste raw JSON', 'Select format or minify', 'Copy cleaned output'],
    about: 'Strict RFC 8259 parser running locally in the client engine.',
    features: ['Syntax Highlighting', 'Detailed Syntax Error Locations', '1-Click Clipboard Copy'],
    faqs: [
      { question: 'Can I upload files?', answer: 'You can paste or load files into the editor.' },
    ],
    relatedToolSlugs: ['word-counter'],
    updatedDate: '2026-02-05',
    createdDate: '2026-01-20',
    executionCount: 88700,
  },
  {
    id: 'tool-7',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    categorySlug: 'pdf',
    categoryName: 'PDF Tools',
    executionType: 'server',
    componentKey: 'PdfMerger',
    status: 'published',
    isFeatured: true,
    shortDescription: 'Combine multiple PDF documents into a single organized file in seconds.',
    fullDescription:
      'Drag and drop PDF pages to reorder them and generate a consolidated PDF document with pristine vector clarity.',
    toolIcon: 'FileText',
    tags: ['pdf', 'merge', 'documents', 'combine'],
    seoTitle: 'Merge PDF Online — Combine Multiple PDFs for Free | Omega Calculators',
    seoDescription: 'Combine multiple PDF files into one clean document quickly and securely.',
    isIndexable: true,
    howToUse: ['Select or drag PDF files', 'Arrange page order', 'Download merged PDF'],
    about: 'Processed securely via our server pipeline with automatic 1-hour file purging.',
    features: ['Drag & Drop Reordering', 'Preserves Bookmarks & Hyperlinks', 'Auto file cleanup'],
    faqs: [
      {
        question: 'Are files kept on your servers?',
        answer: 'Files are processed and purged automatically within 60 minutes.',
      },
    ],
    relatedToolSlugs: ['image-compressor'],
    updatedDate: '2026-02-04',
    createdDate: '2026-01-22',
    executionCount: 31200,
  },
  {
    id: 'tool-8',
    name: 'Image Compressor',
    slug: 'image-compressor',
    categorySlug: 'image',
    categoryName: 'Image Tools',
    executionType: 'server',
    componentKey: 'ImageCompressor',
    status: 'published',
    isFeatured: true,
    shortDescription:
      'Compress JPEG, PNG, and WebP images by up to 80% without noticeable quality loss.',
    fullDescription:
      'Smart lossy and lossless image compression utilizing libvips pipelines for rapid web asset optimization.',
    toolIcon: 'Image',
    tags: ['image', 'compress', 'optimize', 'png', 'jpg'],
    seoTitle: 'Image Compressor — Reduce Image File Size Online | Omega Calculators',
    seoDescription: 'Shrink JPEG, PNG, and WebP images while preserving sharp visual fidelity.',
    isIndexable: true,
    howToUse: ['Drop your images', 'Adjust compression slider', 'Download optimized files'],
    about: 'Optimizes images for web vitals and fast page loads.',
    features: ['Batch Compression', 'Before/After Comparison', 'Custom Quality Control'],
    faqs: [{ question: 'What formats are supported?', answer: 'JPEG, PNG, WebP, and AVIF.' }],
    relatedToolSlugs: ['merge-pdf'],
    updatedDate: '2026-02-03',
    createdDate: '2026-01-24',
    executionCount: 46800,
  },
  {
    id: 'tool-9',
    name: 'AI Text Summarizer',
    slug: 'ai-text-summarizer',
    categorySlug: 'ai',
    categoryName: 'AI Tools',
    executionType: 'third-party',
    componentKey: 'OpenAiSummarizer',
    status: 'draft',
    isFeatured: false,
    shortDescription: 'Condense long articles, essays, and documents into executive bullet points.',
    fullDescription:
      'Leverages advanced language models to extract key findings, action items, and executive summaries from long-form content.',
    toolIcon: 'Sparkles',
    tags: ['ai', 'summary', 'text', 'gpt'],
    seoTitle: 'AI Text Summarizer — Instant Article & Document Summary | Omega Calculators',
    seoDescription: 'Summarize long texts, research papers, and documents in seconds with AI.',
    isIndexable: false,
    howToUse: ['Paste long text', 'Choose summary length', 'Generate executive summary'],
    about: 'Interacts with configured AI provider endpoints securely via the backend.',
    features: ['Bullet Points or Paragraphs', 'Length Controls', 'Key Takeaway Extraction'],
    faqs: [
      {
        question: 'Is my text used for training?',
        answer: 'No, enterprise zero-retention API agreements are enforced.',
      },
    ],
    relatedToolSlugs: ['word-counter'],
    updatedDate: '2026-02-02',
    createdDate: '2026-02-01',
    executionCount: 1420,
  },
  {
    id: 'tool-10',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    categorySlug: 'developer',
    categoryName: 'Developer Tools',
    executionType: 'client',
    componentKey: 'QrCodeGenerator',
    status: 'published',
    isFeatured: false,
    shortDescription: 'Generate custom QR codes for URLs, text, WiFi, and contact vCards.',
    fullDescription:
      'Client-side QR matrix generator with color customization, error correction tiers, and PNG/SVG export.',
    toolIcon: 'QrCode',
    tags: ['qr', 'code', 'generator', 'wifi'],
    seoTitle: 'Free QR Code Generator with Custom Colors | Omega Calculators',
    seoDescription:
      'Generate high-resolution QR codes with color customization and vector SVG download.',
    isIndexable: true,
    howToUse: ['Select QR type (URL/WiFi/Text)', 'Enter content', 'Download PNG or SVG'],
    about: 'Generates standard ISO/IEC 18004 matrices in browser canvas.',
    features: ['High-Res Vector SVG', 'Error Correction Levels', 'Custom Colors'],
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'No, these are permanent static QR codes.' },
    ],
    relatedToolSlugs: ['json-formatter'],
    updatedDate: '2026-02-01',
    createdDate: '2026-01-26',
    executionCount: 19800,
  },
  {
    id: 'tool-11',
    name: 'Meta Tag Generator',
    slug: 'meta-tag-generator',
    categorySlug: 'seo',
    categoryName: 'SEO Tools',
    executionType: 'client',
    componentKey: 'WordCounter',
    status: 'disabled',
    isFeatured: false,
    shortDescription: 'Generate HTML meta tags, Open Graph cards, and Twitter Cards for websites.',
    fullDescription:
      'Audit search appearance and copy ready-to-paste meta tags for modern web projects.',
    toolIcon: 'Search',
    tags: ['seo', 'meta', 'opengraph', 'twitter'],
    seoTitle: 'Meta Tag Generator — Complete SEO & Open Graph Tags | Omega Calculators',
    seoDescription: 'Create search and social meta tags with live Google snippet preview.',
    isIndexable: false,
    howToUse: [
      'Fill in title, description, and keywords',
      'Preview search appearance',
      'Copy HTML tags',
    ],
    about: 'Generates compliant HTML5 meta tag blocks.',
    features: ['Google SERP Preview', 'Twitter Card Preview', '1-Click Code Copy'],
    faqs: [
      {
        question: 'What is the recommended title length?',
        answer: '50 to 60 characters for optimal display.',
      },
    ],
    relatedToolSlugs: ['word-counter'],
    updatedDate: '2026-01-29',
    createdDate: '2026-01-28',
    executionCount: 8400,
  },
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Bilal Ahmad',
    email: 'bilal@megatools.io',
    role: 'Super Admin',
    status: 'active',
    joinedDate: '2026-01-01',
    lastActivity: '2 minutes ago',
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@megatools.io',
    role: 'Admin',
    status: 'active',
    joinedDate: '2026-01-12',
    lastActivity: '1 hour ago',
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.v@megatools.io',
    role: 'Editor',
    status: 'active',
    joinedDate: '2026-01-18',
    lastActivity: 'Yesterday',
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.r@megatools.io',
    role: 'Editor',
    status: 'pending',
    joinedDate: '2026-02-05',
    lastActivity: 'Never',
  },
  {
    id: 'usr-5',
    name: 'David Kim',
    email: 'david.k@partner.io',
    role: 'Viewer',
    status: 'suspended',
    joinedDate: '2026-01-25',
    lastActivity: '14 days ago',
  },
];

export const INITIAL_ADMIN_MEDIA: AdminMediaItem[] = [
  {
    id: 'med-1',
    fileName: 'horizontal-logo.png',
    fileType: 'image/png',
    fileSize: '202 KB',
    dimensions: '1087x229',
    uploadDate: '2026-01-05',
    url: '/images/logo/horizontal-logo.png',
    altText: 'Omega Calculators',
  },
  {
    id: 'med-2',
    fileName: 'hero-dashboard-preview.png',
    fileType: 'image/png',
    fileSize: '412.8 KB',
    dimensions: '1920x1080',
    uploadDate: '2026-01-12',
    url: '/images/hero-dashboard-preview.png',
    altText: 'Homepage hero illustrative screenshot',
  },
  {
    id: 'med-3',
    fileName: 'og-default-cover.png',
    fileType: 'image/png',
    fileSize: '284.1 KB',
    dimensions: '1200x630',
    uploadDate: '2026-01-15',
    url: '/images/og-default-cover.png',
    altText: 'Default Open Graph banner image for social shares',
  },
  {
    id: 'med-4',
    fileName: 'calculator-badge-icon.svg',
    fileType: 'image/svg+xml',
    fileSize: '6.4 KB',
    dimensions: 'Vector',
    uploadDate: '2026-01-20',
    url: '/images/calculator-badge-icon.svg',
    altText: 'Calculators category emblem',
  },
  {
    id: 'med-5',
    fileName: 'platform-terms-v1.pdf',
    fileType: 'application/pdf',
    fileSize: '1.2 MB',
    dimensions: 'Document',
    uploadDate: '2026-01-25',
    url: '/docs/platform-terms-v1.pdf',
    altText: 'Archived legal agreement PDF',
  },
  {
    id: 'med-6',
    fileName: 'security-privacy-shield.webp',
    fileType: 'image/webp',
    fileSize: '68.5 KB',
    dimensions: '800x800',
    uploadDate: '2026-02-02',
    url: '/images/security-privacy-shield.webp',
    altText: 'Client privacy assurance badge illustration',
  },
];

export const INITIAL_ADMIN_LOGS: AdminActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-02-11 02:24:10',
    actor: { name: 'Bilal Ahmad', email: 'bilal@megatools.io', role: 'Super Admin' },
    action: 'PUBLISH',
    resource: 'tools/age-calculator',
    result: 'success',
    details: 'Published new SEO metadata and upgraded calculation engine.',
  },
  {
    id: 'log-2',
    timestamp: '2026-02-11 01:45:32',
    actor: { name: 'Sarah Chen', email: 'sarah.chen@megatools.io', role: 'Admin' },
    action: 'UPDATE',
    resource: 'categories/calculators',
    result: 'success',
    details: 'Updated category description and primary display sort order to 1.',
  },
  {
    id: 'log-3',
    timestamp: '2026-02-10 18:30:15',
    actor: { name: 'Marcus Vance', email: 'marcus.v@megatools.io', role: 'Editor' },
    action: 'CREATE',
    resource: 'tools/ai-text-summarizer',
    result: 'warning',
    details: 'Created draft tool. Component key pending third-party API approval.',
  },
  {
    id: 'log-4',
    timestamp: '2026-02-10 14:12:00',
    actor: { name: 'Bilal Ahmad', email: 'bilal@megatools.io', role: 'Super Admin' },
    action: 'CONFIG_CHANGE',
    resource: 'settings/seo-defaults',
    result: 'success',
    details: 'Updated default Open Graph image and canonical domain to https://megatools.io.',
  },
  {
    id: 'log-5',
    timestamp: '2026-02-09 22:04:45',
    actor: { name: 'System Security', email: 'sec-audit@megatools.io', role: 'System' },
    action: 'LOGIN_ATTEMPT',
    resource: 'auth/admin-login',
    result: 'error',
    details: 'Blocked invalid IP from repeated login attempts (simulated log entry).',
  },
];

export const INITIAL_ADMIN_INTEGRATIONS: AdminIntegration[] = [
  {
    id: 'int-1',
    name: 'OpenAI API Gateway',
    category: 'AI Models',
    status: 'connected',
    description: 'Powers server-side AI summarization, prompt synthesis, and translation.',
    lastSync: '10 minutes ago',
    configFields: [
      {
        key: 'API_ENDPOINT',
        label: 'API Base URL',
        isSecret: false,
        maskedValue: 'https://api.openai.com/v1',
      },
      {
        key: 'API_KEY',
        label: 'Secret API Key',
        isSecret: true,
        maskedValue: 'sk-proj-••••••••••••••••3A9x',
      },
      { key: 'DEFAULT_MODEL', label: 'Primary Model', isSecret: false, maskedValue: 'gpt-4o-mini' },
    ],
  },
  {
    id: 'int-2',
    name: 'AWS S3 Asset Bucket',
    category: 'File Storage',
    status: 'connected',
    description: 'High-availability object storage for temporary PDF and image buffers.',
    lastSync: '1 hour ago',
    configFields: [
      {
        key: 'S3_BUCKET',
        label: 'Bucket Name',
        isSecret: false,
        maskedValue: 'megatools-assets-prod',
      },
      { key: 'S3_REGION', label: 'Region', isSecret: false, maskedValue: 'us-east-1' },
      {
        key: 'S3_SECRET_KEY',
        label: 'Secret Access Key',
        isSecret: true,
        maskedValue: 'AKIA••••••••••••9Q7Z',
      },
    ],
  },
  {
    id: 'int-3',
    name: 'Resend Transactional Email',
    category: 'Email Services',
    status: 'disconnected',
    description: 'Dispatches user notifications, contact form alerts, and system health warnings.',
    configFields: [
      {
        key: 'RESEND_API_KEY',
        label: 'API Key',
        isSecret: true,
        maskedValue: 're_••••••••••••••••••••',
      },
      {
        key: 'SENDER_EMAIL',
        label: 'From Email Address',
        isSecret: false,
        maskedValue: 'support@megatools.io',
      },
    ],
  },
  {
    id: 'int-4',
    name: 'Google Analytics 4',
    category: 'Analytics',
    status: 'connected',
    description: 'Aggregates anonymous page performance, bounce rates, and browser distributions.',
    lastSync: 'Just now',
    configFields: [
      {
        key: 'MEASUREMENT_ID',
        label: 'GA4 Measurement ID',
        isSecret: false,
        maskedValue: 'G-7XYZ9876QW',
      },
    ],
  },
  {
    id: 'int-5',
    name: 'Stripe Payments',
    category: 'Payment Gateways',
    status: 'pending_setup',
    description: 'Future infrastructure for developer API tiers and high-volume batch processing.',
    configFields: [
      {
        key: 'STRIPE_PUBLIC_KEY',
        label: 'Publishable Key',
        isSecret: false,
        maskedValue: 'pk_test_••••••••••••••••',
      },
      {
        key: 'STRIPE_SECRET_KEY',
        label: 'Secret Key',
        isSecret: true,
        maskedValue: 'sk_test_••••••••••••••••',
      },
    ],
  },
];

export const INITIAL_ADMIN_CMS_PAGES: AdminCMSPage[] = [
  {
    id: 'page-1',
    title: 'Homepage',
    slug: '/',
    status: 'published',
    updatedDate: '2026-02-11',
    seoStatus: 'optimized',
    views: 142500,
  },
  {
    id: 'page-2',
    title: 'All Tools Directory',
    slug: '/tools',
    status: 'published',
    updatedDate: '2026-02-11',
    seoStatus: 'optimized',
    views: 98400,
  },
  {
    id: 'page-3',
    title: 'Categories Catalog',
    slug: '/categories',
    status: 'published',
    updatedDate: '2026-02-11',
    seoStatus: 'optimized',
    views: 41200,
  },
  {
    id: 'page-4',
    title: 'About Us',
    slug: '/about',
    status: 'published',
    updatedDate: '2026-02-10',
    seoStatus: 'optimized',
    views: 12800,
  },
  {
    id: 'page-5',
    title: 'Contact Us',
    slug: '/contact',
    status: 'published',
    updatedDate: '2026-02-10',
    seoStatus: 'optimized',
    views: 8900,
  },
  {
    id: 'page-6',
    title: 'Privacy Policy',
    slug: '/privacy-policy',
    status: 'published',
    updatedDate: '2026-02-10',
    seoStatus: 'optimized',
    views: 6400,
  },
  {
    id: 'page-7',
    title: 'Terms of Service',
    slug: '/terms-of-service',
    status: 'published',
    updatedDate: '2026-02-10',
    seoStatus: 'optimized',
    views: 5200,
  },
];

export const ADMIN_ANALYTICS_DATA = {
  totalTools: 94,
  publishedTools: 82,
  draftTools: 12,
  totalCategories: 12,
  totalUsers: 5,
  totalExecutions: '328,450',
  dailyTraffic: [
    { date: 'Feb 05', pageViews: 12400, toolRuns: 19800 },
    { date: 'Feb 06', pageViews: 14200, toolRuns: 22100 },
    { date: 'Feb 07', pageViews: 13800, toolRuns: 21400 },
    { date: 'Feb 08', pageViews: 16900, toolRuns: 26800 },
    { date: 'Feb 09', pageViews: 18400, toolRuns: 29500 },
    { date: 'Feb 10', pageViews: 21200, toolRuns: 34100 },
    { date: 'Feb 11', pageViews: 24500, toolRuns: 38900 },
  ],
  categoryBreakdown: [
    { category: 'Calculators', count: 18, percentage: 32 },
    { category: 'Developer', count: 16, percentage: 28 },
    { category: 'Converters', count: 14, percentage: 18 },
    { category: 'PDF Tools', count: 12, percentage: 12 },
    { category: 'Image Tools', count: 10, percentage: 10 },
  ],
  deviceBreakdown: [
    { device: 'Desktop (Windows / Mac)', percentage: 64 },
    { device: 'Mobile (iOS / Android)', percentage: 31 },
    { device: 'Tablet & Other', percentage: 5 },
  ],
  popularTools: [
    { name: 'JSON Formatter', slug: 'json-formatter', executions: 88700, category: 'Developer' },
    { name: 'Word Counter', slug: 'word-counter', executions: 64100, category: 'Text' },
    { name: 'BMI Calculator', slug: 'bmi-calculator', executions: 51200, category: 'Calculators' },
    { name: 'Image Compressor', slug: 'image-compressor', executions: 46800, category: 'Image' },
    { name: 'Age Calculator', slug: 'age-calculator', executions: 42800, category: 'Calculators' },
  ],
};
