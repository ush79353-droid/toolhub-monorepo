import type { ToolPageDetail } from '@/tools/page-detail';
import { AdrenalWashoutGuideArticle } from './AdrenalWashoutGuideArticle';
import { ADRENAL_WASHOUT_FAQS, ADRENAL_WASHOUT_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate absolute and relative CT washout from pre-contrast, enhanced, and 15-minute delayed HU — educational imaging support, not a diagnosis.',
  asideAriaLabel: 'Interactive Adrenal Washout Calculator',
  tocItems: ADRENAL_WASHOUT_TOC,
  GuideArticle: AdrenalWashoutGuideArticle,
  faqs: ADRENAL_WASHOUT_FAQS,
  countryRules: null,
};
