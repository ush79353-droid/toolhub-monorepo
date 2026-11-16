import type { ToolPageDetail } from '@/tools/page-detail';
import { CuMToTonGuideArticle } from './CuMToTonGuideArticle';
import { CU_M_TO_TON_FAQS, CU_M_TO_TON_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert cubic meters to metric tonnes, US short tons, or UK long tons using material density. Default fresh water ≈ 1000 kg/m³.',
  asideAriaLabel: 'Interactive cubic meter to ton converter',
  tocItems: CU_M_TO_TON_TOC_ITEMS,
  GuideArticle: CuMToTonGuideArticle,
  faqs: CU_M_TO_TON_FAQS,
  countryRules: null,
};
