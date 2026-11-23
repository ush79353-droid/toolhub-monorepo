import type { ToolPageDetail } from '@/tools/page-detail';
import { AlbuminGlobulinRatioGuideArticle } from './AlbuminGlobulinRatioGuideArticle';
import {
  ALBUMIN_GLOBULIN_RATIO_FAQS,
  ALBUMIN_GLOBULIN_RATIO_TOC_ITEMS,
} from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Derive globulin and the albumin/globulin ratio from albumin and total protein in g/dL — educational only.',
  asideAriaLabel: 'Interactive Albumin Globulin Ratio Calculator',
  tocItems: ALBUMIN_GLOBULIN_RATIO_TOC_ITEMS,
  GuideArticle: AlbuminGlobulinRatioGuideArticle,
  faqs: ALBUMIN_GLOBULIN_RATIO_FAQS,
  countryRules: null,
};