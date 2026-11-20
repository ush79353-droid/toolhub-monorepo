import type { ToolPageDetail } from '@/tools/page-detail';
import { FibonacciRetracementGuideArticle } from './FibonacciRetracementGuideArticle';
import { FIB_FAQS, FIB_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Fibonacci retracement and extension price levels for uptrends and downtrends from a swing low and high.',
  asideAriaLabel: 'Interactive Fibonacci Retracement Calculator',
  tocItems: FIB_TOC_ITEMS,
  GuideArticle: FibonacciRetracementGuideArticle,
  faqs: FIB_FAQS,
  countryRules: null,
};
