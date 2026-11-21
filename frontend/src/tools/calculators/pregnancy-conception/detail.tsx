import type { ToolPageDetail } from '@/tools/page-detail';
import { PregnancyConceptionGuideArticle } from './PregnancyConceptionGuideArticle';
import {
  PREGNANCY_CONCEPTION_FAQS,
  PREGNANCY_CONCEPTION_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate conception from due date, last period, or ultrasound using ACOG-style educational dating, plus an approximate intercourse window. Not medical advice and not proof of exact conception day.',
  asideAriaLabel: 'Interactive Pregnancy Conception Calculator',
  tocItems: PREGNANCY_CONCEPTION_TOC_ITEMS,
  GuideArticle: PregnancyConceptionGuideArticle,
  faqs: PREGNANCY_CONCEPTION_FAQS,
  countryRules: null,
};
