import type { ToolPageDetail } from '@/tools/page-detail';
import { RomanNumeralsGuideArticle } from './RomanNumeralsGuideArticle';
import { ROMAN_FAQS, ROMAN_TOC_ITEMS } from './content';

export const toolPageDetail: ToolPageDetail = {
  subtitleLead:
    'Convert Arabic numbers to Roman numerals and Roman numerals back to numbers, with strict canonical validation for 1–3999.',
  asideAriaLabel: 'Interactive Roman numerals converter',
  tocItems: ROMAN_TOC_ITEMS,
  GuideArticle: RomanNumeralsGuideArticle,
  faqs: ROMAN_FAQS,
  countryRules: null,
};
