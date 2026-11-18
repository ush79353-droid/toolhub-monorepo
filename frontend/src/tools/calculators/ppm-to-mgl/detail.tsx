import type { ToolPageDetail } from '@/tools/page-detail';
import { PpmToMglGuideArticle } from './PpmToMglGuideArticle';
import { PPM_MGL_FAQS, PPM_MGL_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert mass-based ppm ↔ mg/L with solution density, and optionally to molarity with solute molar mass.',
  asideAriaLabel: 'Interactive PPM to mg/L converter',
  tocItems: PPM_MGL_TOC_ITEMS,
  GuideArticle: PpmToMglGuideArticle,
  faqs: PPM_MGL_FAQS,
  countryRules: null,
};
