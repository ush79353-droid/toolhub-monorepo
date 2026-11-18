import type { ToolPageDetail } from '@/tools/page-detail';
import { StoneToKgGuideArticle } from './StoneToKgGuideArticle';
import { ST_TO_KG_FAQS, ST_TO_KG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert stone to kilograms and kilograms to stone instantly — exact international avoirdupois stone (1 st = 6.35029318 kg).',
  asideAriaLabel: 'Interactive stone to kilograms converter',
  tocItems: ST_TO_KG_TOC_ITEMS,
  GuideArticle: StoneToKgGuideArticle,
  faqs: ST_TO_KG_FAQS,
  countryRules: null,
};
