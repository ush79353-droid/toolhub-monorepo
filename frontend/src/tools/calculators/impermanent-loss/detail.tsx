import type { ToolPageDetail } from '@/tools/page-detail';
import { ImpermanentLossGuideArticle } from './ImpermanentLossGuideArticle';
import { IMPERMANENT_LOSS_FAQS, IMPERMANENT_LOSS_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate constant-weight AMM impermanent loss versus holding the same starting allocation.',
  asideAriaLabel: 'Interactive impermanent loss calculator',
  tocItems: IMPERMANENT_LOSS_TOC_ITEMS,
  GuideArticle: ImpermanentLossGuideArticle,
  faqs: IMPERMANENT_LOSS_FAQS,
  countryRules: null,
};
