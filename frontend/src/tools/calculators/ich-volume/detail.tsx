import type { ToolPageDetail } from '@/tools/page-detail';
import { IchVolumeGuideArticle } from './IchVolumeGuideArticle';
import { ICH_VOLUME_FAQS, ICH_VOLUME_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational ABC/2 (or ABC/3) intracerebral hemorrhage volume estimate from CT diameters and slice count. Not planimetry.',
  asideAriaLabel: 'Interactive ICH Volume Calculator',
  tocItems: ICH_VOLUME_TOC_ITEMS,
  GuideArticle: IchVolumeGuideArticle,
  faqs: ICH_VOLUME_FAQS,
  countryRules: null,
};
