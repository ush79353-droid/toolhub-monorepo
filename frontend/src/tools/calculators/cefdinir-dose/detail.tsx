import type { ToolPageDetail } from '@/tools/page-detail';
import { CefdinirDoseGuideArticle } from './CefdinirDoseGuideArticle';
import {
  CEFDINIR_DOSE_FAQS,
  CEFDINIR_DOSE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'FDA-labeled Omnicef (cefdinir) dose and duration by age group and indication—educational only.',
  asideAriaLabel: 'Interactive Cefdinir Dose Calculator',
  tocItems: CEFDINIR_DOSE_TOC_ITEMS,
  GuideArticle: CefdinirDoseGuideArticle,
  faqs: CEFDINIR_DOSE_FAQS,
  countryRules: null,
};