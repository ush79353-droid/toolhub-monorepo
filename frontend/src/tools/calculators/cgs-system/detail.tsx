import type { ToolPageDetail } from '@/tools/page-detail';
import { CgsSystemGuideArticle } from './CgsSystemGuideArticle';
import { CGS_FAQS, CGS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mechanical CGS and SI units; dynes, ergs, baryes, gals, poise, stokes, and more. Default quantity: acceleration.',
  asideAriaLabel: 'Interactive CGS system of units converter',
  tocItems: CGS_TOC_ITEMS,
  GuideArticle: CgsSystemGuideArticle,
  faqs: CGS_FAQS,
  countryRules: null,
};
