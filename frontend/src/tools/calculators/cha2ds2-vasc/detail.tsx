import type { ToolPageDetail } from '@/tools/page-detail';
import { Cha2ds2VascGuideArticle } from './Cha2ds2VascGuideArticle';
import { CHA2DS2_VASC_FAQS, CHA2DS2_VASC_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CHA₂DS₂-VASc score with Friberg 2012 annual stroke rates for nonvalvular AF. Not a therapy order.',
  asideAriaLabel: 'Interactive CHA2DS2-VASc Calculator',
  tocItems: CHA2DS2_VASC_TOC_ITEMS,
  GuideArticle: Cha2ds2VascGuideArticle,
  faqs: CHA2DS2_VASC_FAQS,
  countryRules: null,
};
