import type { ToolPageDetail } from '@/tools/page-detail';
import { BraSizeGuideArticle } from './BraSizeGuideArticle';
import { BRA_SIZE_FAQS, BRA_SIZE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate bra band and cup size from underbust and bust measurements, explore sister sizes, and compare US, UK, EU, AU/NZ, and FR/ES labels.',
  asideAriaLabel: 'Interactive Bra Size Calculator',
  tocItems: BRA_SIZE_TOC_ITEMS,
  GuideArticle: BraSizeGuideArticle,
  faqs: BRA_SIZE_FAQS,
  countryRules: null,
};
