/**
 * Repair ONE calculator registration in live files.
 * Usage: node _tmp_repair_one.mjs --key LoanInterestCalculator --slug loan-interest-calculator --dir loan-interest --export LoanInterestCalculator [--fx] [--no-keys] [--lazy-only] [--sitemap-only] [--fe-tool-key] [--app-sitemap-only]
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('..');

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function has(flag) {
  return process.argv.includes(flag);
}

const key = arg('--key');
const slug = arg('--slug');
const dir = arg('--dir');
const exportName = arg('--export') || key;
const needFx = has('--fx');
const feToolKey = has('--fe-tool-key');
const lazyOnly = has('--lazy-only');
const sitemapOnly = has('--sitemap-only');
const appSitemapOnly = has('--app-sitemap-only');
const fxOnly = has('--fx-only');

if (!key || !slug) {
  console.error('Need --key and --slug');
  process.exit(1);
}

const changes = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content);
  changes.push(rel);
}

function insertKeyInList(src, listName, keyName) {
  const re = new RegExp(
    `((?:export )?const ${listName} = \\[[\\s\\S]*?)(\\n\\] as const)`,
  );
  const m = src.match(re);
  if (!m) throw new Error(`list ${listName} not found`);
  const body = m[1];
  if (body.includes(`'${keyName}'`)) return { src, changed: false };
  const entries = [...body.matchAll(/\n  '([^']+)'/g)].map((x) => x[1]);
  let insertAt = entries.findIndex(
    (e) => e.toLowerCase() > keyName.toLowerCase(),
  );
  if (insertAt < 0) insertAt = entries.length;
  const before = insertAt === 0 ? null : entries[insertAt - 1];
  const after = insertAt < entries.length ? entries[insertAt] : null;
  let next;
  if (after) {
    next = body.replace(`\n  '${after}'`, `\n  '${keyName}',\n  '${after}'`);
  } else if (before) {
    next = body.replace(`\n  '${before}'`, `\n  '${before}',\n  '${keyName}'`);
  } else {
    next = body + `\n  '${keyName}'`;
  }
  if ((next.match(new RegExp(`'${keyName}'`, 'g')) || []).length !== 1) {
    throw new Error(`duplicate/missing insert for ${keyName} in ${listName}`);
  }
  const out = src.replace(re, `${next}${m[2]}`);
  return { src: out, changed: true };
}

function insertAssert(src, keyName) {
  if (src.includes(`isApprovedComponentKey('${keyName}')`)) {
    return { src, changed: false };
  }
  // insert before EvilEval or before last assert block end
  const evil = `isApprovedComponentKey('EvilEval')`;
  if (src.includes(evil)) {
    return {
      src: src.replace(
        evil,
        `!isApprovedComponentKey('${keyName}') ||\n    ${evil}`,
      ),
      changed: true,
    };
  }
  // fallback: before closing of if (
  const marker = `isApprovedComponentKey('SecondStimulus900BillionCalculator')`;
  if (src.includes(marker)) {
    return {
      src: src.replace(
        `!${marker} ||`,
        `!${marker} ||\n    !isApprovedComponentKey('${keyName}') ||`,
      ),
      changed: true,
    };
  }
  throw new Error('assert insertion point not found');
}

function insertLazy(src, keyName, folder, exp) {
  if (new RegExp(`${keyName}\\s*:`).test(src)) {
    return { src, changed: false };
  }
  const block = `  ${keyName}: lazyTool(() =>
    import(
      '@/tools/calculators/${folder}/${exp}'
    ).then((mod) => ({
      default: mod.${exp},
    })),
  ),
`;
  // Prefer insert before a known neighbor that exists, else before closing `};` of calculators
  // Find keys in file and pick alphabetical insert neighbor present in map
  const existing = [...src.matchAll(/\n  ([A-Z][A-Za-z0-9]+): lazyTool/g)].map(
    (m) => m[1],
  );
  let insertBefore = existing.find((e) => e.toLowerCase() > keyName.toLowerCase());
  if (insertBefore) {
    const needle = `  ${insertBefore}: lazyTool`;
    if (!src.includes(needle)) throw new Error('lazy neighbor missing');
    return {
      src: src.replace(needle, `${block}${needle}`),
      changed: true,
    };
  }
  // append before final `};` of calculators const - last lazyTool entry
  const last = existing[existing.length - 1];
  const re = new RegExp(
    `(  ${last}: lazyTool\\([\\s\\S]*?\\),\\n)(\\};\\n\\nexport function getToolComponent)`,
  );
  if (!re.test(src)) throw new Error('lazy append point not found');
  return { src: src.replace(re, `$1${block}$2`), changed: true };
}

function insertDetails(src, keyName, folder) {
  if (new RegExp(`${keyName}\\s*:`).test(src)) {
    return { src, changed: false };
  }
  const block = `  ${keyName}: () =>\n    import('@/tools/calculators/${folder}/detail'),\n`;
  const existing = [...src.matchAll(/\n  ([A-Z][A-Za-z0-9]+): \\(\\) =>/g)].map(
    (m) => m[1],
  );
  // simpler: match `  Key: () =>`
  const keys = [...src.matchAll(/\n  ([A-Z][A-Za-z0-9]+): \(\) =>/g)].map(
    (m) => m[1],
  );
  let insertBefore = keys.find((e) => e.toLowerCase() > keyName.toLowerCase());
  if (insertBefore) {
    const needle = `  ${insertBefore}: () =>`;
    return {
      src: src.replace(needle, `${block}${needle}`),
      changed: true,
    };
  }
  const last = keys[keys.length - 1];
  const re = new RegExp(
    `(  ${last}: \\(\\) =>[\\s\\S]*?,\\n)(\\};\\n\\nexport async function loadToolPageDetail)`,
  );
  if (!re.test(src)) throw new Error('details append point not found');
  return { src: src.replace(re, `$1${block}$2`), changed: true };
}

function insertSlugList(src, listName, slugName) {
  const re = new RegExp(`(const ${listName} = \\[[\\s\\S]*?)(\\n\\] as const)`);
  const m = src.match(re);
  if (!m) throw new Error(`slug list ${listName} not found`);
  const body = m[1];
  if (body.includes(`'${slugName}'`)) return { src, changed: false };
  const entries = [...body.matchAll(/\n  '([^']+)'/g)].map((x) => x[1]);
  let insertAt = entries.findIndex((e) => e > slugName);
  if (insertAt < 0) insertAt = entries.length;
  const after = insertAt < entries.length ? entries[insertAt] : null;
  const before = insertAt > 0 ? entries[insertAt - 1] : null;
  let next = body;
  if (after) {
    next = body.replace(`\n  '${after}'`, `\n  '${slugName}',\n  '${after}'`);
  } else if (before) {
    next = body.replace(`\n  '${before}'`, `\n  '${before}',\n  '${slugName}'`);
  } else {
    next = body + `\n  '${slugName}'`;
  }
  if ((next.match(new RegExp(`'${slugName}'`, 'g')) || []).length !== 1) {
    throw new Error(`slug insert failed for ${slugName}`);
  }
  return { src: src.replace(re, `${next}${m[2]}`), changed: true };
}

function insertFxSlug(src, slugName) {
  if (src.includes(`'${slugName}'`)) return { src, changed: false };
  const re =
    /(const CURRENCY_CONVERSION_SLUGS = new Set\(\[[\s\S]*?)(\n\]\))/;
  const m = src.match(re);
  if (!m) throw new Error('CURRENCY_CONVERSION_SLUGS not found');
  const body = m[1];
  const entries = [...body.matchAll(/\n  '([^']+)'/g)].map((x) => x[1]);
  let insertAt = entries.findIndex((e) => e > slugName);
  if (insertAt < 0) insertAt = entries.length;
  const after = insertAt < entries.length ? entries[insertAt] : null;
  let next;
  if (after) {
    next = body.replace(`\n  '${after}'`, `\n  '${slugName}',\n  '${after}'`);
  } else {
    const before = entries[entries.length - 1];
    next = body.replace(`\n  '${before}'`, `\n  '${before}',\n  '${slugName}'`);
  }
  return { src: src.replace(re, `${next}${m[2]}`), changed: true };
}

const done = [];

if (fxOnly) {
  let page = read('frontend/src/app/(website)/tools/[slug]/page.tsx');
  const r = insertFxSlug(page, slug);
  if (r.changed) {
    write('frontend/src/app/(website)/tools/[slug]/page.tsx', r.src);
    done.push('fx');
  }
  console.log(JSON.stringify({ key, slug, done, changes }));
  process.exit(0);
}

if (appSitemapOnly) {
  let appSm = read('frontend/src/app/sitemap.ts');
  const r = insertSlugList(appSm, 'IMPLEMENTED_TOOL_SLUGS', slug);
  if (r.changed) {
    write('frontend/src/app/sitemap.ts', r.src);
    done.push('app-sitemap');
  }
  console.log(JSON.stringify({ key, slug, done, changes }));
  process.exit(0);
}

if (!lazyOnly && !sitemapOnly) {
  // keys.ts both lists
  let keys = read('frontend/src/tools/registry/keys.ts');
  let r1 = insertKeyInList(keys, 'APPROVED_COMPONENT_KEYS', key);
  keys = r1.src;
  let r2 = insertKeyInList(keys, 'REGISTERED_COMPONENT_KEYS', key);
  keys = r2.src;
  if (r1.changed || r2.changed) {
    write('frontend/src/tools/registry/keys.ts', keys);
    done.push('keys');
  }

  // backend tool.key
  let be = read('backend/src/modules/tools/tool.key.ts');
  let b1 = insertKeyInList(be.replace('export const APPROVED', 'export const APPROVED'), 'APPROVED_COMPONENT_KEYS', key);
  // backend uses export const APPROVED_COMPONENT_KEYS
  be = b1.src;
  let b2 = insertAssert(be, key);
  be = b2.src;
  if (b1.changed || b2.changed) {
    write('backend/src/modules/tools/tool.key.ts', be);
    done.push('backend-tool-key');
  }

  if (feToolKey) {
    let fe = read('frontend/src/tools/registry/tool.key.ts');
    let f1 = insertKeyInList(fe, 'APPROVED_COMPONENT_KEYS', key);
    fe = f1.src;
    let f2 = insertAssert(fe, key);
    fe = f2.src;
    if (f1.changed || f2.changed) {
      write('frontend/src/tools/registry/tool.key.ts', fe);
      done.push('frontend-tool-key');
    }
  }
}

if (!sitemapOnly) {
  if (!dir) {
    console.error('Need --dir for lazy/details');
    process.exit(1);
  }
  let index = read('frontend/src/tools/registry/index.ts');
  let i1 = insertLazy(index, key, dir, exportName);
  if (i1.changed) {
    write('frontend/src/tools/registry/index.ts', i1.src);
    done.push('lazy');
  }

  if (!lazyOnly) {
    let details = read('frontend/src/tools/registry/details.ts');
    let d1 = insertDetails(details, key, dir);
    if (d1.changed) {
      write('frontend/src/tools/registry/details.ts', d1.src);
      done.push('details');
    }
  }
}

if (!lazyOnly) {
  let regSm = read('frontend/src/tools/registry/sitemap.ts');
  let s1 = insertSlugList(regSm, 'IMPLEMENTED_TOOL_SLUGS', slug);
  if (s1.changed) {
    write('frontend/src/tools/registry/sitemap.ts', s1.src);
    done.push('registry-sitemap');
  }

  let appSm = read('frontend/src/app/sitemap.ts');
  let s2 = insertSlugList(appSm, 'IMPLEMENTED_TOOL_SLUGS', slug);
  if (s2.changed) {
    write('frontend/src/app/sitemap.ts', s2.src);
    done.push('app-sitemap');
  }

  if (needFx) {
    let page = read('frontend/src/app/(website)/tools/[slug]/page.tsx');
    let f = insertFxSlug(page, slug);
    if (f.changed) {
      write('frontend/src/app/(website)/tools/[slug]/page.tsx', f.src);
      done.push('fx');
    }
  }
}

console.log(JSON.stringify({ key, slug, done, changes }, null, 2));
