import type { ToolPageDetail } from '@/tools/page-detail';
import { ComparativeAdvantageGuideArticle } from './ComparativeAdvantageGuideArticle';
import {
  COMPARATIVE_ADVANTAGE_FAQS,
  COMPARATIVE_ADVANTAGE_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Compare productivity and opportunity costs between two countries to identify comparative and absolute advantages in producing two goods.',
  asideAriaLabel: 'Interactive Comparative Advantage Calculator',
  tocItems: COMPARATIVE_ADVANTAGE_TOC_ITEMS,
  GuideArticle: ComparativeAdvantageGuideArticle,
  faqs: COMPARATIVE_ADVANTAGE_FAQS,
  countryRules: null,
};
