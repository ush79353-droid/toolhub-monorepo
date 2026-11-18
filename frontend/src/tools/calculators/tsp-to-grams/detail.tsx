import type { ToolPageDetail } from '@/tools/page-detail';
import { TspToGramsGuideArticle } from './TspToGramsGuideArticle';
import { TSPG_FAQS, TSPG_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert teaspoons to grams with ingredient density. Defaults to granulated sugar at 845 kg/m³.',
  asideAriaLabel: 'Interactive tsp to grams converter',
  tocItems: TSPG_TOC_ITEMS,
  GuideArticle: TspToGramsGuideArticle,
  faqs: TSPG_FAQS,
  countryRules: null,
};
