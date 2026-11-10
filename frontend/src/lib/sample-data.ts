import type { ToolMetadata } from '@/types/tool';
import type { CategoryMetadata } from '@/types/category';

export interface ToolDetailData extends ToolMetadata {
  isPopular?: boolean;
  howToUse?: string[];
  aboutContent?: string;
  features?: string[];
  faqs?: { question: string; answer: string }[];
}

export interface CategoryDetailData extends CategoryMetadata {
  longDescription?: string;
  faqs?: { question: string; answer: string }[];
}

export const CATEGORIES: CategoryDetailData[] = [
  {
    id: 'cat-1',
    name: 'Calculators',
    slug: 'calculators',
    description: 'Financial, health, percentage, age, and mathematical calculation tools.',
    longDescription:
      'Explore precision calculation utilities designed for finance, health, algebra, geometry, and daily estimations. Every calculator is designed for instant in-browser computation with zero latency.',
    icon: 'Calculator',
    displayOrder: 1,
    isActive: true,
    toolCount: 6,
    faqs: [
      {
        question: 'Are calculations processed on a server?',
        answer:
          'Client-side calculators run directly in your web browser. No numbers or financial inputs leave your device.',
      },
      {
        question: 'How accurate are the financial calculations?',
        answer:
          'All formulas strictly adhere to standard financial and mathematical algorithms. However, results serve as informational estimates and do not replace certified advice.',
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Unit Converters',
    slug: 'converters',
    description: 'Length, weight, currency, speed, data, temperature, and area converters.',
    longDescription:
      'Quickly convert between metric, imperial, and specialized measurement systems. Instant two-way conversions with custom precision controls.',
    icon: 'ArrowLeftRight',
    displayOrder: 2,
    isActive: true,
    toolCount: 4,
    faqs: [
      {
        question: 'Which measurement systems are supported?',
        answer: 'Metric (SI), Imperial, US Customary, and standard digital storage scales.',
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'PDF Tools',
    slug: 'pdf',
    description: 'Merge, split, compress, convert, organize, and protect PDF documents.',
    longDescription:
      'Manage documents effortlessly with browser-powered PDF tools. Combine files, reorder pages, and optimize file sizes cleanly and safely.',
    icon: 'FileText',
    displayOrder: 3,
    isActive: true,
    toolCount: 3,
    faqs: [
      {
        question: 'What is the maximum supported PDF size?',
        answer: 'Standard client-side processing supports documents up to 50MB smoothly.',
      },
    ],
  },
  {
    id: 'cat-4',
    name: 'Image Tools',
    slug: 'image',
    description: 'Compress, resize, crop, convert, and optimize images without quality loss.',
    longDescription:
      'Optimize web graphics, transform PNG, JPG, and WEBP formats, adjust dimensions, and compress assets directly on your device.',
    icon: 'Image',
    displayOrder: 4,
    isActive: true,
    toolCount: 4,
    faqs: [
      {
        question: 'Which image formats are supported?',
        answer: 'JPEG, PNG, WEBP, SVG, and modern AVIF files are supported for conversions.',
      },
    ],
  },
  {
    id: 'cat-5',
    name: 'Text Tools',
    slug: 'text',
    description: 'Word counters, case converters, text diff, lorem ipsum, and character analyzers.',
    longDescription:
      'Essential utilities for writers, editors, and students. Analyze character frequencies, convert cases, compare revisions, and clean text formatting.',
    icon: 'AlignLeft',
    displayOrder: 5,
    isActive: true,
    toolCount: 4,
    faqs: [
      {
        question: 'Does the word counter count punctuation?',
        answer: 'You can toggle whether hyphenated terms and punctuation are counted separately.',
      },
    ],
  },
  {
    id: 'cat-6',
    name: 'SEO Tools',
    slug: 'seo',
    description:
      'Meta tag generators, keyword density checkers, robots.txt, and sitemap analyzers.',
    longDescription:
      'Audit page elements, formulate Open Graph tags, check title lengths, and generate valid robots.txt and XML sitemap records.',
    icon: 'Search',
    displayOrder: 6,
    isActive: true,
    toolCount: 3,
    faqs: [
      {
        question: 'Do SEO tools check live websites?',
        answer:
          'Audit and formulation tools allow manual input previewing, while remote domain checks run through our verified backend gateway.',
      },
    ],
  },
  {
    id: 'cat-7',
    name: 'Developer Tools',
    slug: 'developer',
    description:
      'JSON formatters, Base64 encoders, UUID generators, regex testers, and color pickers.',
    longDescription:
      'Productivity boosters for software engineers and web developers. Format messy JSON, validate syntax, decode tokens, and test regular expressions.',
    icon: 'Code2',
    displayOrder: 7,
    isActive: true,
    toolCount: 5,
    faqs: [
      {
        question: 'Is my JSON or code saved?',
        answer:
          'No. Code snippets are formatted in your browser runtime and are never logged or stored.',
      },
    ],
  },
  {
    id: 'cat-8',
    name: 'AI Tools',
    slug: 'ai',
    description: 'Prompt formulation assistants, text summarizers, and outline generators.',
    longDescription:
      'Intelligent utilities designed to help structure ideas, brainstorm prompt engineering templates, and refine draft communications.',
    icon: 'Sparkles',
    displayOrder: 8,
    isActive: true,
    toolCount: 2,
  },
  {
    id: 'cat-9',
    name: 'Video Tools',
    slug: 'video',
    description: 'Aspect ratio calculators, video compression, and format conversion utilities.',
    longDescription:
      'Prepare video assets for social media and web deployment. Calculate bitrate requirements and preview dimension scaling ratios.',
    icon: 'Video',
    displayOrder: 9,
    isActive: true,
    toolCount: 2,
  },
  {
    id: 'cat-10',
    name: 'Audio Tools',
    slug: 'audio',
    description: 'Audio converters, volume normalizers, and audio file bitrate calculators.',
    longDescription:
      'Convert between MP3, WAV, and AAC formats, calculate storage requirements, and balance sound levels.',
    icon: 'Music',
    displayOrder: 10,
    isActive: true,
    toolCount: 2,
  },
  {
    id: 'cat-11',
    name: 'Security Tools',
    slug: 'security',
    description: 'Strong password generators, hash calculators, and cryptographic cipher tools.',
    longDescription:
      'Generate cryptographically secure passwords, calculate MD5/SHA256 checksums, and evaluate entropy safely in the client sandbox.',
    icon: 'ShieldCheck',
    displayOrder: 11,
    isActive: true,
    toolCount: 3,
  },
  {
    id: 'cat-12',
    name: 'Productivity Tools',
    slug: 'productivity',
    description: 'Pomodoro focus timers, checklist creators, and markdown note formatters.',
    longDescription:
      'Work smarter with streamlined tools for daily planning, interval focus sessions, and formatted note taking.',
    icon: 'CheckSquare',
    displayOrder: 12,
    isActive: true,
    toolCount: 3,
  },
];

export const TOOLS: ToolDetailData[] = [
  // 12 Popular Tools
  {
    id: 'tool-age-calc',
    slug: 'age-calculator',
    title: 'Age Calculator',
    description:
      'Calculate your exact age in years, months, weeks, days, hours, and minutes from your birth date.',
    category: 'calculators',
    executionType: 'client',
    componentKey: 'AgeCalculator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Calendar',
    tags: ['age', 'birthday', 'date', 'time', 'chronological'],
    metaTitle: 'Age Calculator — Exact Age in Years, Months, and Days',
    metaDescription:
      'Free online age calculator. Find out your exact age today in years, months, days, minutes, and seconds.',
    howToUse: [
      'Select your date of birth using the date picker.',
      'Optionally adjust the "Calculate Age As Of" date to determine past or future ages.',
      'Click "Calculate Age" to view your detailed chronological age breakdown.',
    ],
    aboutContent:
      'The Age Calculator computes the exact chronological duration between your birth date and any target date. It accounts for leap years, variable month lengths, and gives a multi-unit breakdown of your lifetime.',
    features: [
      'Instant client-side calculation with zero latency',
      'Breakdown in years, months, weeks, days, hours, and minutes',
      'Next birthday countdown indicator',
      'Leap year compensation built-in',
    ],
    faqs: [
      {
        question: 'Does the age calculator take leap years into account?',
        answer: 'Yes, full calendar leap years (366 days) are factored into the exact calculation.',
      },
      {
        question: 'Can I calculate what my age was on a past event date?',
        answer: 'Yes, simply set the "Calculate Age As Of" field to any date in the past.',
      },
    ],
  },
  {
    id: 'tool-pct-calc',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description:
      'Quickly solve percentage increases, decreases, differences, and fractions with step-by-step results.',
    category: 'calculators',
    executionType: 'client',
    componentKey: 'PercentageCalculator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Percent',
    tags: ['percentage', 'math', 'discount', 'increase', 'fraction'],
    metaTitle: 'Percentage Calculator — Quick Percent Increase & Decrease',
    metaDescription:
      'Calculate percentages, percentage differences, discounts, and tips with our fast online percentage calculator.',
    howToUse: [
      'Choose the calculation mode (What is X% of Y, Percentage Increase/Decrease, or X is what % of Y).',
      'Enter the numerical values into the respective input fields.',
      'The result updates automatically with the mathematical formula displayed.',
    ],
    aboutContent:
      'Percentages are vital for everyday financial decisions, shopping discounts, tax computations, and statistical evaluations. This utility provides an all-in-one solver for all common percentage tasks.',
    features: [
      'Supports percentage of a number, percentage increase, and percentage change',
      'Shows the exact formula and step-by-step arithmetic',
      'Live calculations as you type',
      'Copy results with one click',
    ],
  },
  {
    id: 'tool-bmi-calc',
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description:
      'Determine your Body Mass Index (BMI) and health category based on metric or imperial measurements.',
    category: 'calculators',
    executionType: 'client',
    componentKey: 'BmiCalculator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Activity',
    tags: ['bmi', 'health', 'fitness', 'weight', 'height', 'body'],
    metaTitle: 'BMI Calculator — Free Body Mass Index Calculator',
    metaDescription:
      'Calculate your Body Mass Index (BMI) easily with metric or imperial units. See your healthy weight range.',
    howToUse: [
      'Select Metric (kg/cm) or Imperial (lbs/inches) units.',
      'Enter your height and weight.',
      'View your BMI score alongside the standard World Health Organization category scale.',
    ],
    aboutContent:
      'Body Mass Index (BMI) is a standardized screening metric used by healthcare professionals to categorize weight relative to height. While useful as a general guide, it is an estimate and does not directly measure body fat percentage.',
    features: [
      'Supports Metric and Imperial unit systems',
      'Clear visual categorization: Underweight, Normal, Overweight, Obese',
      'Calculates recommended healthy weight range for your height',
    ],
  },
  {
    id: 'tool-loan-calc',
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    description:
      'Calculate monthly payments, total interest, and amortization estimates for mortgages and personal loans.',
    category: 'calculators',
    executionType: 'client',
    componentKey: 'LoanCalculator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Coins',
    tags: ['loan', 'mortgage', 'finance', 'interest', 'amortization', 'payment'],
    metaTitle: 'Loan Calculator — Monthly Payment & Interest Estimator',
    metaDescription:
      'Free online loan calculator. Compute monthly loan payments, interest charges, and loan payoff dates.',
    howToUse: [
      'Enter the total loan principal amount.',
      'Enter the annual interest rate (APR).',
      'Select the loan term in years or months.',
      'View the monthly installment, total interest payable, and total loan cost.',
    ],
    aboutContent:
      'Understanding the true cost of borrowing helps you make smarter financial decisions. This loan calculator applies standard compounding interest formulas to outline your monthly obligations and long-term interest cost.',
    features: [
      'Configurable payment frequency (Monthly, Bi-weekly)',
      'Total interest vs. principal distribution breakdown',
      'Supports extra payment simulations',
    ],
  },
  {
    id: 'tool-word-counter',
    slug: 'word-counter',
    title: 'Word Counter',
    description:
      'Count words, characters, sentences, paragraphs, and estimate reading time in real time.',
    category: 'text',
    executionType: 'client',
    componentKey: 'WordCounter',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'FileText',
    tags: ['words', 'characters', 'count', 'writing', 'reading time', 'text'],
    metaTitle: 'Word Counter — Real-Time Word & Character Count Tool',
    metaDescription:
      'Count words, characters, sentences, paragraphs, and reading time instantly with our free online word counter.',
    howToUse: [
      'Type or paste your text directly into the editing area.',
      'Live counters immediately display total words, characters (with and without spaces), and sentences.',
      'Check reading and speaking time estimates below the editor.',
    ],
    aboutContent:
      'Whether you are writing an essay with strict length limits, drafting an article, or preparing social media posts, this real-time word counter provides instantaneous statistics as you type.',
    features: [
      'Live character, word, sentence, and paragraph counts',
      'Estimated reading and speaking duration',
      'Keyword frequency analysis',
      'One-click clear and copy buttons',
    ],
  },
  {
    id: 'tool-json-formatter',
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description:
      'Prettify, format, validate, and minify JSON code with clear syntax error highlighting.',
    category: 'developer',
    executionType: 'client',
    componentKey: 'JsonFormatter',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Code2',
    tags: ['json', 'format', 'minify', 'prettify', 'developer', 'validator'],
    metaTitle: 'JSON Formatter & Validator — Clean & Prettify JSON Online',
    metaDescription:
      'Format, validate, beautify, and minify JSON data instantly in your browser. Spot syntax errors with line numbers.',
    howToUse: [
      'Paste your raw JSON into the input box.',
      'Click "Format JSON" for 2-space or 4-space indentation, or "Minify" for compressed output.',
      'Any JSON syntax errors will be highlighted with line and column positions.',
    ],
    aboutContent:
      'A must-have developer utility to make compact or unstructured API payloads human-readable. It runs completely client-side, ensuring your payload credentials and private payloads remain secure.',
    features: [
      'Strict JSON syntax validation with line indicator',
      'Configurable 2-space, 4-space, or tab indentation',
      'JSON Minification support',
      'Copy to clipboard with one click',
    ],
  },
  {
    id: 'tool-image-compressor',
    slug: 'image-compressor',
    title: 'Image Compressor',
    description:
      'Compress PNG, JPG, and WEBP images in your browser with adjustable quality levels.',
    category: 'image',
    executionType: 'client',
    componentKey: 'ImageCompressor',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Image',
    tags: ['image', 'compress', 'jpg', 'png', 'webp', 'optimize', 'file size'],
    metaTitle: 'Image Compressor — Reduce Image File Size Online',
    metaDescription:
      'Compress JPG, PNG, and WEBP images online without uploading to servers. Reduce image file size quickly.',
    howToUse: [
      'Drag and drop an image file into the dropzone.',
      'Adjust the compression quality slider to your desired balance.',
      'Preview before-and-after file sizes and download your optimized image.',
    ],
    aboutContent:
      'Heavy images slow down websites and consume storage. Our image compression tool utilizes browser canvas and WebAssembly compression to reduce file sizes without uploading files to remote servers.',
    features: [
      '100% private in-browser compression',
      'Real-time before-and-after size comparison',
      'Supports JPEG, PNG, and WebP images',
    ],
  },
  {
    id: 'tool-pdf-merger',
    slug: 'pdf-merger',
    title: 'PDF Merger',
    description:
      'Combine multiple PDF documents into a single organized file with custom page reordering.',
    category: 'pdf',
    executionType: 'client',
    componentKey: 'PdfMerger',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Layers',
    tags: ['pdf', 'merge', 'combine', 'documents', 'pages'],
    metaTitle: 'PDF Merger — Merge Multiple PDF Files into One Online',
    metaDescription:
      'Easily combine multiple PDF files into one document. Fast, safe, and free PDF merger tool.',
    howToUse: [
      'Select or drop two or more PDF files.',
      'Drag files up or down to arrange their sequence.',
      'Click "Merge PDFs" to generate your consolidated document.',
    ],
    aboutContent:
      'Merge multiple PDF invoices, book chapters, or reports into a single cohesive document. Pages are processed and assembled directly on your computer.',
    features: [
      'Drag-and-drop file reordering',
      'No file size restrictions within device memory',
      'Fast client-side document assembly',
    ],
  },
  {
    id: 'tool-qr-code',
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    description:
      'Generate high-resolution QR codes for websites, Wi-Fi passwords, text, and contact cards.',
    category: 'developer',
    executionType: 'client',
    componentKey: 'QrCodeGenerator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'QrCode',
    tags: ['qr', 'code', 'generator', 'barcode', 'link', 'wifi'],
    metaTitle: 'QR Code Generator — Create Custom QR Codes Online',
    metaDescription:
      'Free QR code generator. Create high-resolution QR codes for URLs, text, Wi-Fi networks, and contact details.',
    howToUse: [
      'Choose content type (URL, Plain Text, or Wi-Fi credentials).',
      'Enter the destination information.',
      'Customize size or error correction level and download the PNG or SVG.',
    ],
    aboutContent:
      'Create scannable 2D barcodes for marketing materials, restaurant menus, product labels, and quick Wi-Fi connections with configurable error tolerance.',
    features: [
      'High-resolution PNG and vector SVG export',
      'Custom error correction levels (L, M, Q, H)',
      'Pre-formatted Wi-Fi network and URL modes',
    ],
  },
  {
    id: 'tool-unit-converter',
    slug: 'unit-converter',
    title: 'Universal Unit Converter',
    description:
      'Convert length, weight, temperature, volume, area, and speed across metric and imperial systems.',
    category: 'converters',
    executionType: 'client',
    componentKey: 'UnitConverter',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'ArrowLeftRight',
    tags: ['unit', 'converter', 'length', 'weight', 'temperature', 'metric', 'imperial'],
    metaTitle: 'Unit Converter — Instant Length, Weight & Temperature Conversion',
    metaDescription:
      'Universal unit converter. Easily convert units of length, weight, volume, temperature, and speed.',
    howToUse: [
      'Select the measurement dimension (e.g., Length, Weight, Temperature).',
      'Choose your source and target units.',
      'Enter the source amount to see the instant converted result.',
    ],
    aboutContent:
      'Convert between kilometers and miles, Celsius and Fahrenheit, kilograms and pounds, and dozens of other units with standard high-precision factors.',
    features: [
      'Covers 6 major measurement categories',
      'Two-way interactive conversion',
      'Displays conversion formula and factor',
    ],
  },
  {
    id: 'tool-password-gen',
    slug: 'password-generator',
    title: 'Strong Password Generator',
    description:
      'Create cryptographically strong, random passwords with custom lengths and character rules.',
    category: 'security',
    executionType: 'client',
    componentKey: 'PasswordGenerator',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'KeyRound',
    tags: ['password', 'generator', 'security', 'random', 'entropy'],
    metaTitle: 'Password Generator — Create Strong & Secure Passwords',
    metaDescription:
      'Generate secure, random passwords with customizable lengths, numbers, symbols, and high entropy.',
    howToUse: [
      'Adjust password length with the slider (8 to 64 characters).',
      'Toggle uppercase, lowercase, numbers, and special symbols.',
      'Click "Generate Password" and copy your new credential securely.',
    ],
    aboutContent:
      'Weak and reused passwords are the leading cause of account breaches. This tool utilizes browser cryptographic APIs (crypto.getRandomValues) to ensure high randomness.',
    features: [
      'Cryptographically secure PRNG implementation',
      'Real-time password strength and entropy meter',
      'Exclude ambiguous characters option (e.g., 0, O, l, 1)',
    ],
  },
  {
    id: 'tool-color-picker',
    slug: 'color-picker',
    title: 'Color Picker & Converter',
    description:
      'Pick colors, convert between HEX, RGB, HSL, and CMYK, and explore complementary palettes.',
    category: 'developer',
    executionType: 'client',
    componentKey: 'ColorPicker',
    version: '1.0.0',
    isActive: true,
    isPopular: true,
    icon: 'Palette',
    tags: ['color', 'picker', 'hex', 'rgb', 'hsl', 'cmyk', 'palette', 'designer'],
    metaTitle: 'Color Picker & Converter — HEX, RGB, HSL Converter',
    metaDescription:
      'Inspect and convert colors between HEX, RGB, HSL, and CMYK formats. Free color utility for designers and developers.',
    howToUse: [
      'Select a color using the visual spectrum picker or type a HEX/RGB value.',
      'Instantly view and copy the value in HEX, RGB, HSL, and CMYK formats.',
      'Browse automatically generated color shade variations.',
    ],
    aboutContent:
      'Essential for web designers and front-end developers needing to harmonize color tokens, verify contrast ratios, and convert between CSS color representations.',
    features: [
      'Visual interactive spectrum picker',
      'Simultaneous HEX, RGB, and HSL conversions',
      'Tints, shades, and complementary palette suggestions',
    ],
  },

  // Additional tools across categories for realistic catalog depth
  {
    id: 'tool-meta-gen',
    slug: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description:
      'Create SEO-optimized HTML meta tags, Open Graph, and Twitter Cards for search engines and social media.',
    category: 'seo',
    executionType: 'client',
    componentKey: 'MetaTagGenerator',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'Search',
    tags: ['seo', 'meta', 'open graph', 'social', 'html'],
  },
  {
    id: 'tool-case-conv',
    slug: 'case-converter',
    title: 'Text Case Converter',
    description:
      'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    category: 'text',
    executionType: 'client',
    componentKey: 'CaseConverter',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'CaseSensitive',
    tags: ['case', 'text', 'camelCase', 'uppercase', 'lowercase'],
  },
  {
    id: 'tool-base64',
    slug: 'base64-encoder',
    title: 'Base64 Encoder & Decoder',
    description:
      'Encode plain text or binary data to Base64 format and decode Base64 strings safely.',
    category: 'developer',
    executionType: 'client',
    componentKey: 'Base64Encoder',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'Binary',
    tags: ['base64', 'encoder', 'decoder', 'developer'],
  },
  {
    id: 'tool-pdf-split',
    slug: 'pdf-splitter',
    title: 'PDF Splitter',
    description:
      'Extract specific pages or page ranges from a PDF document into a new independent file.',
    category: 'pdf',
    executionType: 'client',
    componentKey: 'PdfSplitter',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'Split',
    tags: ['pdf', 'split', 'extract', 'pages'],
  },
  {
    id: 'tool-aspect-ratio',
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio Calculator',
    description:
      'Calculate image and video dimensions while maintaining exact 16:9, 4:3, 1:1, or custom aspect ratios.',
    category: 'video',
    executionType: 'client',
    componentKey: 'AspectRatioCalculator',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'Video',
    tags: ['aspect ratio', 'video', 'dimensions', '16:9', 'resizing'],
  },
  {
    id: 'tool-pomodoro',
    slug: 'pomodoro-timer',
    title: 'Pomodoro Focus Timer',
    description:
      'Boost productivity with interval-based work sessions and restorative rest breaks.',
    category: 'productivity',
    executionType: 'client',
    componentKey: 'PomodoroTimer',
    version: '1.0.0',
    isActive: true,
    isPopular: false,
    icon: 'Timer',
    tags: ['pomodoro', 'focus', 'timer', 'productivity', 'study'],
  },
];

// Query Functions
export function getAllCategories(): CategoryDetailData[] {
  return [...CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryBySlug(slug: string): CategoryDetailData | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getAllTools(): ToolDetailData[] {
  return [...TOOLS];
}

export function getPopularTools(): ToolDetailData[] {
  return TOOLS.filter((t) => t.isPopular);
}

export function getToolsByCategory(categorySlug: string): ToolDetailData[] {
  return TOOLS.filter((t) => t.category === categorySlug);
}

export function getToolBySlug(slug: string): ToolDetailData | null {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function getRelatedTools(
  toolSlug: string,
  categorySlug: string,
  limit = 4
): ToolDetailData[] {
  return TOOLS.filter((t) => t.slug !== toolSlug && t.category === categorySlug).slice(0, limit);
}

export function searchTools(query: string, category?: string): ToolDetailData[] {
  const normalizedQuery = query.toLowerCase().trim();
  return TOOLS.filter((t) => {
    const matchesCategory = !category || category === 'all' || t.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const inTitle = t.title.toLowerCase().includes(normalizedQuery);
    const inDesc = t.description.toLowerCase().includes(normalizedQuery);
    const inTags = t.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ?? false;
    return inTitle || inDesc || inTags;
  });
}
