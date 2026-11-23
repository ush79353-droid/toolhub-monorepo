import type { ToolPageDetail } from '@/tools/page-detail';
import { CerebralPerfusionPressureGuideArticle } from './CerebralPerfusionPressureGuideArticle';
import { CPP_FAQS, CPP_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational CPP = MAP − ICP worksheet. Optional MAP from SBP/DBP; age-band literature ranges only — not treatment targets.',
  asideAriaLabel: 'Interactive Cerebral Perfusion Pressure Calculator',
  tocItems: CPP_TOC_ITEMS,
  GuideArticle: CerebralPerfusionPressureGuideArticle,
  faqs: CPP_FAQS,
  countryRules: null,
};
