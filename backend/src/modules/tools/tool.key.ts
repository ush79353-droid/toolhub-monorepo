const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function toolNameKey(name: string): string {
  return name.trim().toLowerCase();
}

export function isToolSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('tool.key.ts');
if (isDirect) {
  if (toolNameKey('  Loan Calculator ') !== 'loan calculator') throw new Error('name key');
  if (!isToolSlug('loan-calculator') || isToolSlug('Loan') || isToolSlug('-loan')) {
    throw new Error('slug rule');
  }
  console.log('tool.key ok');
}
