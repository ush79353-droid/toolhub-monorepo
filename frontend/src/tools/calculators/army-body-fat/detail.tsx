import type { ToolPageDetail } from '@/tools/page-detail';
import { ArmyBodyFatGuideArticle } from './ArmyBodyFatGuideArticle';
import { ARMY_BODY_FAT_FAQS, ARMY_BODY_FAT_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate U.S. Army body-fat percent with the authorized one-site abdomen method (since 9 June 2023) or a labeled legacy multi-site circumference model—educational only.',
  asideAriaLabel: 'Interactive Army Body Fat Calculator',
  tocItems: ARMY_BODY_FAT_TOC_ITEMS,
  GuideArticle: ArmyBodyFatGuideArticle,
  faqs: ARMY_BODY_FAT_FAQS,
  countryRules: null,
};
