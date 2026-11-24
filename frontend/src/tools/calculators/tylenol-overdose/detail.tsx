import type { ToolPageDetail } from '@/tools/page-detail';
import { TylenolOverdoseGuideArticle } from './TylenolOverdoseGuideArticle';
import { TYLENOL_OVERDOSE_FAQS, TYLENOL_OVERDOSE_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Educational Rumack–Matthew acetaminophen timing worksheet — not a treatment order or safe-at-home determination.',
  asideAriaLabel: 'Interactive Tylenol Overdose Calculator',
  tocItems: TYLENOL_OVERDOSE_TOC,
  GuideArticle: TylenolOverdoseGuideArticle,
  faqs: TYLENOL_OVERDOSE_FAQS,
  countryRules: null,
};
