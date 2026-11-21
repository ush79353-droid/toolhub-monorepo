import type { ToolPageDetail } from '@/tools/page-detail';
import { HealsHeroesUnemploymentBenefitGuideArticle } from './HealsHeroesUnemploymentBenefitGuideArticle';
import {
  HEALS_HEROES_UNEMPLOYMENT_FAQS,
  HEALS_HEROES_UNEMPLOYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Historical notice comparing the 2020 HEALS and HEROES unemployment proposals. Not a current benefit calculator. Use the Annual Salary Calculator for yearly and hourly wage conversion.',
  asideAriaLabel: 'HEALS Act vs HEROES Act unemployment benefit historical notice',
  tocItems: HEALS_HEROES_UNEMPLOYMENT_TOC_ITEMS,
  GuideArticle: HealsHeroesUnemploymentBenefitGuideArticle,
  faqs: HEALS_HEROES_UNEMPLOYMENT_FAQS,
  countryRules: null,
};
