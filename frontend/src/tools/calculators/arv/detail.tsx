import type { ToolPageDetail } from '@/tools/page-detail';
import { ArvGuideArticle } from './ArvGuideArticle';
import { ARV_FAQS, ARV_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate after-repair value from as-is price or area comps, apply an investor purchase rule for a maximum bid, and review a simplified gross ROI; renovation cost and renovation value stay separate.',
  asideAriaLabel: 'Interactive ARV Calculator – After Repair Value',
  tocItems: ARV_TOC_ITEMS,
  GuideArticle: ArvGuideArticle,
  faqs: ARV_FAQS,
  countryRules: null,
};
