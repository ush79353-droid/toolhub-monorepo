import type { ToolPageDetail } from '@/tools/page-detail';
import { HeroesGuideArticle } from './HeroesGuideArticle';
import { HEROES_FAQS, HEROES_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical, hypothetical estimate of the proposed May 2020 HEROES Act second stimulus check; not a current benefit and not claimable today.',
  asideAriaLabel: 'HEROES Act second stimulus calculator guide',
  tocItems: HEROES_TOC_ITEMS,
  GuideArticle: HeroesGuideArticle,
  faqs: HEROES_FAQS,
};
