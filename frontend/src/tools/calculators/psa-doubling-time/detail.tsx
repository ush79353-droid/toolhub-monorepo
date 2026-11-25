import type { ToolPageDetail } from '@/tools/page-detail';
import { PsaDoublingTimeGuideArticle } from './PsaDoublingTimeGuideArticle';
import { PSA_DT_FAQS, PSA_DT_TOC } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate PSA doubling time from two dated PSA levels (ng/mL) with optional absolute velocity and log slope — educational kinetics only.',
  asideAriaLabel: 'Interactive PSA Doubling Time Calculator',
  tocItems: PSA_DT_TOC,
  GuideArticle: PsaDoublingTimeGuideArticle,
  faqs: PSA_DT_FAQS,
  countryRules: null,
};