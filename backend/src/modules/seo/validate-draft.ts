import { countDraftWords, type SeoContent } from './content';

export interface DraftIssue {
  code: string;
  message: string;
  severity: 'block' | 'flag';
}

export interface DraftValidation {
  ok: boolean;
  issues: DraftIssue[];
}

export interface ValidateDraftInput {
  content: SeoContent;
  allowedKeywords: readonly string[];
  lockedPrimary: string;
  allowedSlugs: ReadonlyMap<string, string>;
  duplicatePrimary: boolean;
}

function block(issues: DraftIssue[], code: string, message: string) {
  issues.push({ code, message, severity: 'block' });
}

export function validateDraft(input: ValidateDraftInput): DraftValidation {
  const issues: DraftIssue[] = [];
  const { content } = input;
  const allowed = new Set(input.allowedKeywords.map((keyword) => keyword.toLowerCase()));

  if (content.metaTitle.trim().length === 0 || content.metaTitle.length > 70) {
    block(issues, 'title_length', 'Meta title must be 1–70 characters.');
  }
  if (content.metaDescription.trim().length === 0 || content.metaDescription.length > 160) {
    block(issues, 'description_length', 'Meta description must be 1–160 characters.');
  }
  if (content.keywords.trim().length === 0 || content.keywords.length > 200) {
    block(issues, 'keywords_length', 'Keywords must be 1–200 characters.');
  }
  if (!allowed.has(content.primaryKeyword.toLowerCase())) {
    block(issues, 'primary_not_in_research', 'Primary keyword was not returned by DataForSEO.');
  } else if (
    input.lockedPrimary.trim() &&
    content.primaryKeyword.toLowerCase() !== input.lockedPrimary.trim().toLowerCase()
  ) {
    block(
      issues,
      'primary_mismatch',
      `Primary keyword must stay ${input.lockedPrimary}, the keyword the SERP was fetched for.`
    );
  }
  if (content.faqs.length < 4 || content.faqs.length > 8) {
    block(issues, 'faq_count', 'Include 4–8 FAQs.');
  }
  if (content.disclaimer.trim().length === 0) {
    block(issues, 'disclaimer_missing', 'A finance disclaimer is required.');
  }
  if (content.links.length < 3 || content.links.length > 6) {
    block(issues, 'link_count', 'Include 3–6 links to live sibling calculators.');
  }
  for (const link of content.links) {
    if (!input.allowedSlugs.has(link.slug)) {
      block(issues, 'dead_slug', `Link slug “${link.slug}” is not a live Finance & Business calculator.`);
    }
  }
  if (input.duplicatePrimary) {
    block(issues, 'duplicate_primary', 'Another draft in this campaign already uses this primary keyword.');
  }

  const words = countDraftWords(content);
  if (words < 1200 || words > 1700) {
    block(issues, 'word_count', `Guide is ${words} words. Visible educational copy must be 1,200–1,700 words.`);
  } else if (words < 1500) {
    issues.push({
      code: 'word_count',
      message: `Guide is ${words} words. 1,500–1,700 is the target. 1,200–1,499 is a warning and can still be approved.`,
      severity: 'flag',
    });
  }
  if (content.sections.some((section) => section.formula.trim().length > 0)) {
    issues.push({
      code: 'formula_unverified',
      message: 'A formula is present. Confirm it against the calculator before publishing.',
      severity: 'flag',
    });
  }

  return { ok: !issues.some((issue) => issue.severity === 'block'), issues };
}
