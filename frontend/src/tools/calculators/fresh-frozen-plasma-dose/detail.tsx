import type { ToolPageDetail } from '@/tools/page-detail';
import { FreshFrozenPlasmaDoseGuideArticle } from './FreshFrozenPlasmaDoseGuideArticle';
import { FFP_DOSE_FAQS, FFP_DOSE_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate FFP volume from weight × mL/kg and equivalent units from bag volume—educational only.',
  asideAriaLabel: 'Interactive Fresh Frozen Plasma Dose Calculator',
  tocItems: FFP_DOSE_TOC_ITEMS,
  GuideArticle: FreshFrozenPlasmaDoseGuideArticle,
  faqs: FFP_DOSE_FAQS,
  countryRules: null,
};
