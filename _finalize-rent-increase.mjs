import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const KEY = 'RentIncreaseCalculator';
const SLUG = 'rent-increase-calculator';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text);
  console.log('wrote', rel);
}
function eolOf(t) {
  return t.includes('\r\n') ? '\r\n' : '\n';
}
function ensureAfter(text, anchorLine, insertLine) {
  const eol = eolOf(text);
  const anchor = anchorLine + eol;
  const insert = insertLine + eol;
  if (text.includes(insertLine)) return { text, skipped: true };
  if (!text.includes(anchor)) throw new Error(`missing ${anchorLine}`);
  return { text: text.split(anchor).join(anchor + insert), skipped: false };
}
function ensureBefore(text, anchorStart, block, marker) {
  if (text.includes(marker)) return { text, skipped: true };
  if (!text.includes(anchorStart)) throw new Error(`missing ${anchorStart.slice(0, 50)}`);
  return { text: text.replace(anchorStart, block + anchorStart), skipped: false };
}

function patchKeys(rel) {
  let text = read(rel);
  if ((text.match(new RegExp(KEY, 'g')) || []).length >= 2) {
    console.log('skip keys');
    return;
  }
  for (const anchor of [
    "  'RealRateOfReturnCalculator',",
    "  'RateOfReturnCalculator',",
    "  'RoiCalculator',",
    "  'MarginInterestCalculator',",
  ]) {
    try {
      const r = ensureAfter(text, anchor, `  '${KEY}',`);
      text = r.text;
      const eol = eolOf(text);
      const dup = `  '${KEY}',${eol}  '${KEY}',${eol}`;
      text = text.split(dup).join(`  '${KEY}',${eol}`);
      write(rel, text);
      console.log('keys', (text.match(new RegExp(KEY, 'g')) || []).length);
      return;
    } catch {
      /* next */
    }
  }
  throw new Error('keys: no anchor');
}

function patchToolKey(rel) {
  let text = read(rel);
  if (text.includes(`'${KEY}'`)) {
    console.log('skip', rel);
    return;
  }
  let done = false;
  for (const anchor of [
    "  'RealRateOfReturnCalculator',",
    "  'RateOfReturnCalculator',",
    "  'RoiCalculator',",
    "  'MarginInterestCalculator',",
  ]) {
    try {
      text = ensureAfter(text, anchor, `  '${KEY}',`).text;
      done = true;
      break;
    } catch {
      /* next */
    }
  }
  if (!done) throw new Error(`${rel}: no list anchor`);
  for (const anchor of [
    "    !isApprovedComponentKey('RealRateOfReturnCalculator') ||",
    "    !isApprovedComponentKey('RateOfReturnCalculator') ||",
    "    !isApprovedComponentKey('RoiCalculator') ||",
    "    !isApprovedComponentKey('MarginInterestCalculator') ||",
  ]) {
    try {
      text = ensureAfter(text, anchor, `    !isApprovedComponentKey('${KEY}') ||`).text;
      break;
    } catch {
      /* next */
    }
  }
  write(rel, text);
}

function patchIndex() {
  const rel = 'frontend/src/tools/registry/index.ts';
  const block = `  ${KEY}: lazyTool(() =>
    import(
      '@/tools/calculators/rent-increase/RentIncreaseCalculator'
    ).then((mod) => ({
      default: mod.${KEY},
    })),
  ),
`;
  for (const anchor of [
    '  RealRateOfReturnCalculator: lazyTool(() =>',
    '  RateOfReturnCalculator: lazyTool(() =>',
    '  RoiCalculator: lazyTool(() =>',
    '  MarginInterestCalculator: lazyTool(() =>',
  ]) {
    try {
      const r = ensureBefore(read(rel), anchor, block, KEY);
      if (!r.skipped) write(rel, r.text);
      else console.log('skip index');
      return;
    } catch {
      /* next */
    }
  }
  throw new Error('index: no anchor');
}

function patchDetails() {
  const rel = 'frontend/src/tools/registry/details.ts';
  const block = `  ${KEY}: () =>
    import('@/tools/calculators/rent-increase/detail'),
`;
  for (const anchor of [
    '  RealRateOfReturnCalculator: () =>',
    '  RateOfReturnCalculator: () =>',
    '  RoiCalculator: () =>',
    '  MarginInterestCalculator: () =>',
  ]) {
    try {
      const r = ensureBefore(read(rel), anchor, block, KEY);
      if (!r.skipped) write(rel, r.text);
      else console.log('skip details');
      return;
    } catch {
      /* next */
    }
  }
  throw new Error('details: no anchor');
}

function patchSlug(rel, afterCandidates, beforeCandidates) {
  const text0 = read(rel);
  if (text0.includes(SLUG)) {
    console.log('skip', rel);
    return;
  }
  for (const a of afterCandidates) {
    try {
      write(rel, ensureAfter(text0, a, `  '${SLUG}',`).text);
      return;
    } catch {
      /* next */
    }
  }
  for (const a of beforeCandidates) {
    const eol = eolOf(text0);
    const anchor = a + eol;
    const insert = `  '${SLUG}',` + eol;
    if (text0.includes(anchor)) {
      write(rel, text0.replace(anchor, insert + anchor));
      return;
    }
  }
  throw new Error(`slug patch failed: ${rel}`);
}

patchKeys('frontend/src/tools/registry/keys.ts');
patchIndex();
patchDetails();
patchToolKey('backend/src/modules/tools/tool.key.ts');
patchToolKey('frontend/src/tools/registry/tool.key.ts');

for (const rel of [
  'frontend/src/app/sitemap.ts',
  'frontend/src/tools/registry/sitemap.ts',
]) {
  patchSlug(
    rel,
    [
      "  'real-rate-of-return-calculator',",
      "  'prorated-rent-calculator',",
      "  'gross-rent-multiplier-calculator',",
    ],
    ["  'roi-calculator',"]
  );
}

for (const rel of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  patchSlug(
    rel,
    [
      "  'prorated-rent-calculator',",
      "  'margin-interest-calculator',",
      "  'gross-rent-multiplier-calculator',",
    ],
    ["  'roi-calculator',"]
  );
}

const verify = {
  keys: (read('frontend/src/tools/registry/keys.ts').match(new RegExp(KEY, 'g')) || []).length,
  index: read('frontend/src/tools/registry/index.ts').includes(KEY),
  details: read('frontend/src/tools/registry/details.ts').includes(KEY),
  be: read('backend/src/modules/tools/tool.key.ts').includes(KEY),
  fe: read('frontend/src/tools/registry/tool.key.ts').includes(KEY),
  sitemap: read('frontend/src/app/sitemap.ts').includes(SLUG),
  regSitemap: read('frontend/src/tools/registry/sitemap.ts').includes(SLUG),
  fx: read('frontend/src/app/(website)/tools/[slug]/page.tsx').includes(SLUG),
  embed: read('frontend/src/app/embed/[slug]/page.tsx').includes(SLUG),
};
console.log('verify', JSON.stringify(verify));
if (
  verify.keys < 2 ||
  !verify.index ||
  !verify.details ||
  !verify.be ||
  !verify.sitemap ||
  !verify.fx
) {
  process.exit(1);
}
