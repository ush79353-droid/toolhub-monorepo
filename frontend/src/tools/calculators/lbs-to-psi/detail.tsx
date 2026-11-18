import type { ToolPageDetail } from '@/tools/page-detail';
import { LbsToPsiGuideArticle } from './LbsToPsiGuideArticle';
import { LBS_TO_PSI_FAQS, LBS_TO_PSI_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert pounds-force per square foot (psf) to PSI and back using the exact factor 1 psi = 144 psf. Force alone is not pressure without an area.',
  asideAriaLabel: 'Interactive lbs to PSI converter',
  tocItems: LBS_TO_PSI_TOC_ITEMS,
  GuideArticle: LbsToPsiGuideArticle,
  faqs: LBS_TO_PSI_FAQS,
  countryRules: null,
};
