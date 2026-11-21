import type { ToolPageDetail } from '@/tools/page-detail';
import { NaturalUnemploymentGuideArticle } from './NaturalUnemploymentGuideArticle';
import {
  NATURAL_UNEMPLOYMENT_FAQS,
  NATURAL_UNEMPLOYMENT_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Estimate the natural unemployment rate from frictional and structural unemployment relative to the labor force; simplified model, no cyclical component.',
  asideAriaLabel: 'Interactive Natural Rate of Unemployment Calculator',
  tocItems: NATURAL_UNEMPLOYMENT_TOC_ITEMS,
  GuideArticle: NaturalUnemploymentGuideArticle,
  faqs: NATURAL_UNEMPLOYMENT_FAQS,
  countryRules: null,
};
