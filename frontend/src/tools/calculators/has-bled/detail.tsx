import type { ToolPageDetail } from '@/tools/page-detail';
import { HasBledGuideArticle } from './HasBledGuideArticle';
import { HAS_BLED_FAQS, HAS_BLED_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational HAS-BLED major-bleeding score (0–9) for atrial fibrillation risk review. Reports Pisters 2010 incidence rates — does not order anticoagulation.',
  asideAriaLabel: 'Interactive HAS-BLED Calculator',
  tocItems: HAS_BLED_TOC_ITEMS,
  GuideArticle: HasBledGuideArticle,
  faqs: HAS_BLED_FAQS,
  countryRules: null,
};
