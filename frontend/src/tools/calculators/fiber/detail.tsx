import type { ToolPageDetail } from '@/tools/page-detail';
import { FiberGuideArticle } from './FiberGuideArticle';
import { FIBER_FAQS, FIBER_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate daily fiber from the IOM 14 g per 1,000 kcal energy-density basis, with optional Mifflin–St Jeor maintenance calories and age/sex Adequate Intake lookup.',
  asideAriaLabel: 'Interactive Fiber Calculator',
  tocItems: FIBER_TOC_ITEMS,
  GuideArticle: FiberGuideArticle,
  faqs: FIBER_FAQS,
  countryRules: null,
};
