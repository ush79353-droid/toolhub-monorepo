/**
 * Reads the Finance & Business contributor spreadsheet and stores one creator
 * plus one or two reviewers on every tool in that category.
 *
 * People are matched by designation. A mortgage tool prefers mortgage and loan
 * officers. A tax tool prefers tax accountants. The only varying choice is
 * whether a tool gets one reviewer or two, and that choice is fixed from the
 * slug so a second run writes the same rows.
 *
 * Usage (from backend/):
 *   npm run tools:seed-contributors -- --self-check
 *   npm run tools:seed-contributors
 *   npm run tools:seed-contributors -- --dry-run --file "../Finance & Business Linkedin Profile.ods"
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { connectDB, disconnectDB } from '../config/database';
import { Category } from '../modules/categories/category.model';
import { Tool, type IToolContributor } from '../modules/tools/tool.model';

const DEFAULT_CATEGORY_ID = '6af451bba27d8d1d4e98f959';

interface Person extends IToolContributor {}

interface ToolRow {
  name: string;
  slug: string;
}

interface Assignment {
  slug: string;
  name: string;
  topic: string;
  creator: Person;
  reviewers: Person[];
}

/** More specific topics come first so "mortgage" wins over a generic "loan" match. */
const TOPICS: ReadonlyArray<{ id: string; tool: RegExp; person: RegExp }> = [
  {
    id: 'tax',
    tool: /\b(tax|vat|gst|payroll|withholding|1099|w-2|deduction|irs|fica)\b/i,
    person: /\b(tax|cpa|accountant|bookkeep|payroll)\b/i,
  },
  {
    id: 'mortgage',
    tool: /\b(mortgage|heloc|pmi|home loan|house loan|housing)\b/i,
    person: /\b(mortgage|loan officer)\b/i,
  },
  {
    id: 'property',
    tool: /\b(rent|rental|property|real estate|cap rate|airbnb|landlord)\b/i,
    person: /\b(real estate|realtor|mortgage)\b/i,
  },
  {
    id: 'auto',
    tool: /\b(auto loan|car loan|vehicle|boat loan)\b/i,
    person: /\b(mortgage|loan officer|credit analyst|banker)\b/i,
  },
  {
    id: 'loan',
    tool: /\b(loan|emi|apr|debt|credit|amortization|interest)\b/i,
    person: /\b(loan|mortgage|credit|banker|commercial)\b/i,
  },
  {
    id: 'invest',
    tool: /\b(stock|bond|etf|portfolio|dividend|roi|irr|npv|cagr|valuation|equity|mutual|sip|retire|401|ira|pension|annuit|invest)\b/i,
    person: /\b(cfa|investment|portfolio|cio|wealth|cfp|planner|advisor)\b/i,
  },
  {
    id: 'corporate',
    tool: /\b(margin|cash flow|break-?even|working capital|ebitda|forecast|profit|revenue|startup|business)\b/i,
    person: /\b(fp&a|finance manager|controller|corporate|cima|acca|aca|fmv|strategy)\b/i,
  },
  {
    id: 'personal',
    tool: /\b(salary|saving|budget|net worth|afford|paycheck|wage|inflation|tip)\b/i,
    person: /\b(cfp|planner|advisor|wealth)\b/i,
  },
];

const GENERAL = /\b(finance|financial|analyst|planner|advisor|accountant|cfp|cfa|banker)\b/i;

function arg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function decodeXml(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function readZipEntry(file: Buffer, name: string): Buffer {
  const eocd = file.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('Spreadsheet is not a zip file.');
  let cursor = file.readUInt32LE(eocd + 16);
  const end = cursor + file.readUInt32LE(eocd + 12);
  while (cursor < end) {
    if (file.readUInt32LE(cursor) !== 0x02014b50) break;
    const method = file.readUInt16LE(cursor + 10);
    const compressedSize = file.readUInt32LE(cursor + 20);
    const nameLength = file.readUInt16LE(cursor + 28);
    const extraLength = file.readUInt16LE(cursor + 30);
    const commentLength = file.readUInt16LE(cursor + 32);
    const localOffset = file.readUInt32LE(cursor + 42);
    const entryName = file.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8');
    if (entryName === name) {
      const localNameLength = file.readUInt16LE(localOffset + 26);
      const localExtraLength = file.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const data = file.subarray(start, start + compressedSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) return zlib.inflateRawSync(data);
      throw new Error(`Unsupported zip method ${method} for ${name}.`);
    }
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error(`Missing ${name} in the spreadsheet.`);
}

function readPeople(filePath: string): Person[] {
  const xml = readZipEntry(fs.readFileSync(filePath), 'content.xml').toString('utf8');
  const rows = xml.match(/<table:table-row[\s\S]*?<\/table:table-row>/g) ?? [];
  const people: Person[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const columns: string[] = [];
    const cell = /<table:table-cell([^>]*)>([\s\S]*?)<\/table:table-cell>|<table:table-cell([^>]*)\/>/g;
    let match: RegExpExecArray | null;
    while ((match = cell.exec(row))) {
      const attrs = match[1] || match[3] || '';
      const repeat = Number((attrs.match(/table:number-columns-repeated="(\d+)"/) || [])[1] || 1);
      const text = [...(match[2] || '').matchAll(/<text:p[^>]*>([\s\S]*?)<\/text:p>/g)]
        .map((part) => decodeXml(part[1]))
        .join(' ');
      const copies = Math.min(repeat, 4);
      for (let i = 0; i < copies; i += 1) columns.push(text);
      if (repeat > 4) break;
    }

    const name = columns[0] ?? '';
    const linkedInUrl = columns[1] ?? '';
    const designation = columns[2] ?? '';
    const about = (columns[3] ?? '').slice(0, 2000);
    if (!name || name === 'Full Name' || !linkedInUrl.startsWith('http')) continue;
    if (seen.has(linkedInUrl)) continue;
    seen.add(linkedInUrl);
    people.push({ name, linkedInUrl, designation, about });
  }

  if (people.length === 0) throw new Error('The spreadsheet has no contributor rows.');
  return people;
}

function reviewerCount(slug: string): 1 | 2 {
  let hash = 0;
  for (const char of slug) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return (hash & 1) === 0 ? 1 : 2;
}

function textOf(person: Person): string {
  return `${person.designation} ${person.about}`;
}

function poolFor(toolName: string, people: Person[]): { topic: string; pool: Person[] } {
  for (const topic of TOPICS) {
    if (!topic.tool.test(toolName)) continue;
    const matched = people
      .filter((person) => topic.person.test(textOf(person)))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (matched.length > 0) return { topic: topic.id, pool: matched };
  }
  const general = people
    .filter((person) => GENERAL.test(textOf(person)))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { topic: 'general', pool: general.length > 0 ? general : [...people].sort((a, b) => a.name.localeCompare(b.name)) };
}

function take(pool: Person[], start: number, count: number, exclude: Set<string>): Person[] {
  const chosen: Person[] = [];
  if (pool.length === 0 || count === 0) return chosen;
  for (let step = 0; step < pool.length && chosen.length < count; step += 1) {
    const person = pool[(start + step) % pool.length];
    if (!person || exclude.has(person.linkedInUrl)) continue;
    exclude.add(person.linkedInUrl);
    chosen.push(person);
  }
  return chosen;
}

/** One creator, then one or two different reviewers, rotated inside the best designation pool. */
export function assignContributors(tools: readonly ToolRow[], people: readonly Person[]): Assignment[] {
  const cursors = new Map<string, number>();
  const general = poolFor('general finance', [...people]).pool;

  return tools.map((tool) => {
    const { topic, pool } = poolFor(tool.name, [...people]);
    const cursor = cursors.get(topic) ?? 0;
    const creator = pool[cursor % pool.length];
    if (!creator) throw new Error(`No creator available for ${tool.name}.`);
    const exclude = new Set<string>([creator.linkedInUrl]);
    const wanted = reviewerCount(tool.slug);
    let reviewers = take(pool, cursor + 1, wanted, exclude);
    if (reviewers.length < wanted) {
      reviewers = reviewers.concat(take(general, 0, wanted - reviewers.length, exclude));
    }
    cursors.set(topic, cursor + 1 + reviewers.length);
    return { slug: tool.slug, name: tool.name, topic, creator, reviewers };
  });
}

function selfCheck(): void {
  const people: Person[] = [
    { name: 'Mortgage Person', linkedInUrl: 'https://www.linkedin.com/in/mortgage', designation: 'Mortgage Loan Officer', about: 'Home loans.' },
    { name: 'Tax Person', linkedInUrl: 'https://www.linkedin.com/in/tax', designation: 'Tax Consultant', about: 'Income tax.' },
    { name: 'Planner', linkedInUrl: 'https://www.linkedin.com/in/planner', designation: 'CFP / Financial Planner', about: 'Retirement planning.' },
    { name: 'Analyst', linkedInUrl: 'https://www.linkedin.com/in/analyst', designation: 'CFA / Investment Analyst', about: 'Equity research.' },
    { name: 'Banker', linkedInUrl: 'https://www.linkedin.com/in/banker', designation: 'Commercial Banker', about: 'Business credit.' },
  ];
  const tools: ToolRow[] = [
    { name: 'Mortgage Calculator', slug: 'mortgage-calculator' },
    { name: 'Income Tax Calculator', slug: 'income-tax-calculator' },
    { name: 'Auto Loan Calculator', slug: 'auto-loan-calculator' },
    { name: 'ROI Calculator', slug: 'roi-calculator' },
  ];
  const rows = assignContributors(tools, people);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const mortgage = bySlug.get('mortgage-calculator');
  const tax = bySlug.get('income-tax-calculator');
  const auto = bySlug.get('auto-loan-calculator');
  const roi = bySlug.get('roi-calculator');
  if (!mortgage || mortgage.creator.designation !== 'Mortgage Loan Officer') throw new Error('mortgage creator');
  if (!tax || !/tax/i.test(tax.creator.designation)) throw new Error('tax creator');
  if (!auto || /tax/i.test(auto.creator.designation)) throw new Error('auto loan creator');
  if (!roi || !/cfa|cfp|investment|planner/i.test(roi.creator.designation)) throw new Error('roi creator');
  for (const row of rows) {
    if (row.reviewers.length < 1 || row.reviewers.length > 2) throw new Error('reviewer count');
    if (row.reviewers.some((person) => person.linkedInUrl === row.creator.linkedInUrl)) throw new Error('creator is reviewer');
  }
  console.log('contributor seed self-check ok');
}

async function run(): Promise<void> {
  if (hasFlag('--self-check')) {
    selfCheck();
    return;
  }

  const filePath = path.resolve(
    arg('--file') || path.join(process.cwd(), '..', 'Finance & Business Linkedin Profile.ods')
  );
  const categoryId = arg('--category') || DEFAULT_CATEGORY_ID;
  const dryRun = hasFlag('--dry-run');
  const people = readPeople(filePath);

  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB.');
    process.exit(1);
  }

  try {
    const category = await Category.findById(categoryId).select('name slug');
    if (!category || !/finance/i.test(category.name)) {
      throw new Error(`Category ${categoryId} is not the Finance category.`);
    }

    const tools = await Tool.find({ category: category._id }).select('name slug').sort({ slug: 1 }).lean<ToolRow[]>();
    if (tools.length === 0) throw new Error(`No tools found in ${category.name}.`);

    const assignments = assignContributors(tools, people);
    const missingCreator = assignments.filter((row) => !row.creator);
    const badReviewers = assignments.filter(
      (row) => row.reviewers.length < 1 || row.reviewers.length > 2 || row.reviewers.some((person) => person.linkedInUrl === row.creator.linkedInUrl)
    );
    if (missingCreator.length > 0 || badReviewers.length > 0) {
      throw new Error('Assignment failed the one-creator and one-or-two-reviewer rule.');
    }

    const oneReviewer = assignments.filter((row) => row.reviewers.length === 1).length;
    const topics = new Map<string, number>();
    for (const row of assignments) topics.set(row.topic, (topics.get(row.topic) ?? 0) + 1);

    console.log(`${category.name}: ${assignments.length} tools, ${people.length} people.`);
    console.log(`Reviewers: ${oneReviewer} tools with 1, ${assignments.length - oneReviewer} tools with 2.`);
    console.log(`Topics: ${[...topics.entries()].map(([id, count]) => `${id} ${count}`).join(', ')}`);
    for (const sample of ['auto-loan-calculator', 'mortgage-calculator', 'income-tax-calculator']) {
      const row = assignments.find((item) => item.slug === sample);
      if (!row) continue;
      console.log(
        `${row.name}: creator ${row.creator.name} (${row.creator.designation}); reviewers ${row.reviewers.map((person) => person.name).join(', ')}`
      );
    }

    if (dryRun) {
      console.log('Dry run. No documents were updated.');
      return;
    }

    const result = await Tool.bulkWrite(
      assignments.map((row) => ({
        updateOne: {
          filter: { slug: row.slug, category: category._id },
          update: { $set: { creator: row.creator, reviewers: row.reviewers } },
        },
      }))
    );
    console.log(`Updated ${result.modifiedCount} tools (${result.matchedCount} matched).`);
  } finally {
    await disconnectDB();
  }
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
