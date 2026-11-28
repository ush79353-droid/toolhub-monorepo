import type { ToolPageDetail } from '@/tools/page-detail';
import { SpeedometerGearGuideArticle } from './SpeedometerGearGuideArticle';
import { SG_FAQS, SG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Calculate mechanical speedometer driven gear teeth from tire diameter, axle ratio, and driving gear specifications.',
  asideAriaLabel: 'Interactive Speedometer Gear Calculator',
  tocItems: SG_TOC_ITEMS,
  GuideArticle: SpeedometerGearGuideArticle,
  faqs: SG_FAQS,
  countryRules: null,
};
