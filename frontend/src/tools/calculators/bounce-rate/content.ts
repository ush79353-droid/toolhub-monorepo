import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOUNCE_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bounce-rate', label: 'What Is Bounce Rate?' },
  { id: 'formula-and-calculation', label: 'Bounce Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'what-is-a-good-bounce-rate', label: 'What Is a Good Bounce Rate?' },
  { id: 'how-to-lower-bounce-rate', label: 'How to Lower Bounce Rate' },
  { id: 'bounce-rate-faq', label: 'Frequently Asked Questions' },
];

export const BOUNCE_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is bounce rate?',
    answer:
      'Bounce rate is the percentage of website visits (sessions) in which a visitor views only one page and then leaves without interacting further. It is a core engagement metric in web analytics.',
  },
  {
    question: 'How do you calculate bounce rate?',
    answer:
      'Divide the number of one-page visits by the total number of website visits, then multiply by 100. Example: 350 one-page visits ÷ 1,000 total visits × 100 = 35%.',
  },
  {
    question: 'Can bounce rate be zero?',
    answer:
      'Yes. If every visitor views more than one page, one-page visits are zero and bounce rate is 0%. A zero rate is uncommon on larger sites but mathematically valid.',
  },
  {
    question: 'Why can’t one-page visits exceed total visits?',
    answer:
      'Every one-page visit is also a website visit. One-page visits are a subset of total visits, so the count cannot be higher than the total.',
  },
  {
    question: 'Is a high bounce rate always bad?',
    answer:
      'Not always. Single-page destinations such as blog posts, contact pages, or landing pages can have high bounce rates while still meeting the visitor’s goal. Context and conversion goals matter more than the rate alone.',
  },
];
