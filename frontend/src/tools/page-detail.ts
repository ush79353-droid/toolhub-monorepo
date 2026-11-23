import type { ComponentType } from 'react';
import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { ToolDetailSidebarCountryRules } from '@/components/shared/ToolDetailSidebar';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

/** One person credited on a tool page. Photos and bios arrive with the record. */
export interface ToolContributor {
  name: string;
  /** Public photo. Omitted records show initials. */
  imageUrl?: string;
  linkedInUrl?: string;
  bio: string;
  /** Full profile page. Omitted records hide “See full profile”. */
  profileHref?: string;
}

/** Creators and reviewers for one tool. Omitted tools render no credit block. */
export interface ToolCredits {
  creators: readonly ToolContributor[];
  reviewers: readonly ToolContributor[];
  editorialPolicyHref: string;
}

/** Tool-specific page copy. The shared `/tools/[slug]` shell renders this. */
export interface ToolPageDetail {
  subtitleLead: string;
  asideAriaLabel: string;
  tocItems: readonly TableOfContentsItem[];
  GuideArticle: ComponentType;
  faqs: readonly FAQItem[];
  /** Optional; omitted tools render with no country-rules sidebar block. */
  countryRules?: ToolDetailSidebarCountryRules | null;
  /** Optional; only tools that pass credits show the creator and reviewer block. */
  credits?: ToolCredits;
}
