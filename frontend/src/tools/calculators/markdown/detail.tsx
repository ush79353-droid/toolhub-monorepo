import type { ToolPageDetail } from '@/tools/page-detail';
import { MarkdownGuideArticle } from './MarkdownGuideArticle';
import { MARKDOWN_FAQS, MARKDOWN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate retail markdown amounts and percentages from original and actual selling prices — or work the formulas in reverse.',
  asideAriaLabel: 'Interactive Markdown Calculator',
  tocItems: MARKDOWN_TOC_ITEMS,
  GuideArticle: MarkdownGuideArticle,
  faqs: MARKDOWN_FAQS,
  countryRules: null,
};
