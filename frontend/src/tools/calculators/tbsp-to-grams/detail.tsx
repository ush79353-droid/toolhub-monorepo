import type { ToolPageDetail } from '@/tools/page-detail';
import { TbspToGramsGuideArticle } from './TbspToGramsGuideArticle';
import { TBSP_TO_G_FAQS, TBSP_TO_G_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert US tablespoons to grams using ingredient density; butter, flour, sugar, honey, and more.',
  asideAriaLabel: 'Interactive tablespoons to grams ingredient converter',
  tocItems: TBSP_TO_G_TOC_ITEMS,
  GuideArticle: TbspToGramsGuideArticle,
  faqs: TBSP_TO_G_FAQS,
  countryRules: null,
};
