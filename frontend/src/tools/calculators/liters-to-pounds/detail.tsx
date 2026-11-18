import type { ToolPageDetail } from '@/tools/page-detail';
import { LitersToPoundsGuideArticle } from './LitersToPoundsGuideArticle';
import { LITERS_TO_POUNDS_FAQS, LITERS_TO_POUNDS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert liters to pounds and pounds to liters using substance density. Default water at 1000 kg/m³ (≈ 1 kg/L).',
  asideAriaLabel: 'Interactive liters to pounds calculator',
  tocItems: LITERS_TO_POUNDS_TOC_ITEMS,
  GuideArticle: LitersToPoundsGuideArticle,
  faqs: LITERS_TO_POUNDS_FAQS,
  countryRules: null,
};
