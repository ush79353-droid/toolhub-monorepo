import type { ToolPageDetail } from '@/tools/page-detail';
import { VitaminAGuideArticle } from './VitaminAGuideArticle';
import { VITAMIN_A_FAQS, VITAMIN_A_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert vitamin A IU ↔ mcg RAE by source with NIH ODS factors, sum total RAE, and compare to age- and sex-specific RDA/AI values.',
  asideAriaLabel: 'Interactive Vitamin A Calculator',
  tocItems: VITAMIN_A_TOC_ITEMS,
  GuideArticle: VitaminAGuideArticle,
  faqs: VITAMIN_A_FAQS,
  countryRules: null,
};
