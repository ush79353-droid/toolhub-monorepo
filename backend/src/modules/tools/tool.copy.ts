const STOP_WORDS = new Set(['a', 'an', 'the', 'of', 'and', 'to', 'for', 'with', 'in', 'on', 'vs', 'per']);

export interface ToolCopyInput {
  name: string;
  slug: string;
  category: string;
  pillar: string | null;
  subPillar: string | null;
}

export interface ToolCopy {
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
}

function fit(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > 24 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

function placement(input: ToolCopyInput): string {
  if (input.subPillar && input.pillar) return `${input.subPillar}, part of ${input.pillar}`;
  if (input.pillar && input.pillar.toLowerCase() !== input.name.toLowerCase()) return input.pillar;
  return input.category;
}

export function buildToolCopy(input: ToolCopyInput, origin: string): ToolCopy {
  const where = placement(input);
  const shortDescription = fit(
    `${input.name} is a free ${input.category} tool on Omega Calculators, grouped with ${where}.`,
    500
  );
  const metaDescription = fit(
    `Use ${input.name} online. A free ${input.category} tool from Omega Calculators, ready in the browser.`,
    160
  );
  const ogDescription = fit(
    `${shortDescription} Open it on Omega Calculators and get a result without creating an account.`,
    200
  );

  const words = [input.name, input.category, input.pillar, input.subPillar]
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  const unique: string[] = [];
  for (const word of words) {
    if (!unique.includes(word)) unique.push(word);
  }
  let keywords = '';
  for (const word of unique) {
    const next = keywords ? `${keywords}, ${word}` : word;
    if (next.length > 200) break;
    keywords = next;
  }

  const base = origin.replace(/\/$/, '');
  return {
    shortDescription,
    metaTitle: fit(`${input.name} | Omega Calculators`, 70),
    metaDescription,
    canonicalUrl: `${base}/tools/${input.slug}`,
    ogTitle: fit(input.name, 70),
    ogDescription,
    keywords,
  };
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('tool.copy.ts');
if (isDirect) {
  const copy = buildToolCopy(
    {
      name: 'Economic Injury Disaster Loan Emergency Advance Calculator',
      slug: 'economic-injury-disaster-loan-emergency-advance-calculator',
      category: 'Finance & Business',
      pillar: 'Loan Calculator',
      subPillar: null,
    },
    'http://localhost:3000'
  );
  const limits: Record<string, number> = {
    shortDescription: 500,
    metaTitle: 70,
    metaDescription: 160,
    canonicalUrl: 300,
    ogTitle: 70,
    ogDescription: 200,
    keywords: 200,
  };
  for (const [field, max] of Object.entries(limits)) {
    const value = copy[field as keyof ToolCopy];
    if (!value || value.length > max) throw new Error(`${field} length ${value.length}`);
  }
  if (!copy.canonicalUrl.startsWith('http://localhost:3000/tools/')) throw new Error('canonical');
  const direct = buildToolCopy(
    { name: 'Tax Calculator', slug: 'tax-calculator', category: 'Finance & Business', pillar: null, subPillar: null },
    'http://localhost:3000'
  );
  if (!direct.shortDescription.includes('Finance & Business')) throw new Error('category placement');
  console.log('tool.copy ok');
}
