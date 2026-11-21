import type { ToolPageDetail } from '@/tools/page-detail';
import { RoicGuideArticle } from './RoicGuideArticle';
import { ROIC_FAQS, ROIC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate Return on Invested Capital (ROIC) from EBIT, tax rate, equity, and debt — with optional average invested capital — to measure after-tax operating returns on capital.',
  asideAriaLabel: 'Interactive ROIC Calculator',
  tocItems: ROIC_TOC_ITEMS,
  GuideArticle: RoicGuideArticle,
  faqs: ROIC_FAQS,
  countryRules: null,
};
