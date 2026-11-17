import fs from 'node:fs';
import path from 'node:path';

const root = 'd:\\Project\\ToolHub';

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function patch(rel, pairs) {
  const file = path.join(root, rel);
  const original = fs.readFileSync(file, 'utf8');
  const useCrlf = original.includes('\r\n');
  let text = normalizeNewlines(original);
  for (const [fromRaw, toRaw] of pairs) {
    const from = normalizeNewlines(fromRaw);
    const to = normalizeNewlines(toRaw);
    if (!text.includes(from)) {
      throw new Error(`Missing pattern in ${rel}: ${JSON.stringify(from).slice(0, 140)}`);
    }
    if (text.includes("'GrossMarginCalculator'") && from.includes('GoogleAdsenseCalculator')) {
      // already has key — skip duplicate insert for key pairs only when Gross already present after Google
      const idx = text.indexOf("'GoogleAdsenseCalculator'");
      const window = text.slice(idx, idx + 120);
      if (window.includes("'GrossMarginCalculator'")) {
        console.log(`skip already-patched ${rel}`);
        continue;
      }
    }
    const count = text.split(from).length - 1;
    text = text.split(from).join(to);
    console.log(`patched ${rel} x${count}`);
  }
  const out = useCrlf ? text.replace(/\n/g, '\r\n') : text;
  fs.writeFileSync(file, out);
}

const keyFrom = "  'GoogleAdsenseCalculator',\n  'HedgeRatioCalculator',";
const keyTo =
  "  'GoogleAdsenseCalculator',\n  'GrossMarginCalculator',\n  'HedgeRatioCalculator',";

const guardFrom =
  "    !isApprovedComponentKey('GoogleAdsenseCalculator') ||\n    !isApprovedComponentKey('HedgeRatioCalculator') ||";
const guardTo =
  "    !isApprovedComponentKey('GoogleAdsenseCalculator') ||\n    !isApprovedComponentKey('GrossMarginCalculator') ||\n    !isApprovedComponentKey('HedgeRatioCalculator') ||";

patch('frontend/src/tools/registry/keys.ts', [[keyFrom, keyTo]]);
patch('frontend/src/tools/registry/tool.key.ts', [
  [keyFrom, keyTo],
  [guardFrom, guardTo],
]);
patch('backend/src/modules/tools/tool.key.ts', [
  [keyFrom, keyTo],
  [guardFrom, guardTo],
]);

patch('frontend/src/tools/registry/index.ts', [
  [
    `  GoogleAdsenseCalculator: lazyTool(() =>
    import('@/tools/calculators/google-adsense/GoogleAdsenseCalculator').then((mod) => ({
      default: mod.GoogleAdsenseCalculator,
    })),
  ),
  HedgeRatioCalculator:`,
    `  GoogleAdsenseCalculator: lazyTool(() =>
    import('@/tools/calculators/google-adsense/GoogleAdsenseCalculator').then((mod) => ({
      default: mod.GoogleAdsenseCalculator,
    })),
  ),
  GrossMarginCalculator: lazyTool(() =>
    import('@/tools/calculators/gross-margin/GrossMarginCalculator').then((mod) => ({
      default: mod.GrossMarginCalculator,
    })),
  ),
  HedgeRatioCalculator:`,
  ],
]);

patch('frontend/src/tools/registry/details.ts', [
  [
    `  GoogleAdsenseCalculator: () =>
    import('@/tools/calculators/google-adsense/detail'),
  HedgeRatioCalculator:`,
    `  GoogleAdsenseCalculator: () =>
    import('@/tools/calculators/google-adsense/detail'),
  GrossMarginCalculator: () =>
    import('@/tools/calculators/gross-margin/detail'),
  HedgeRatioCalculator:`,
  ],
]);

for (const rel of [
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/app/sitemap.ts',
]) {
  patch(rel, [
    ["  'google-adsense-calculator',", "  'google-adsense-calculator',\n  'gross-margin-calculator',"],
  ]);
}

for (const rel of [
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
]) {
  patch(rel, [
    [
      "  'google-adsense-calculator',\n  'high-low-method-calculator',",
      "  'google-adsense-calculator',\n  'gross-margin-calculator',\n  'high-low-method-calculator',",
    ],
  ]);
}

console.log('all ok');
