import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function abs(rel) {
  return path.join(root, rel);
}

function patch(file, replacer, label) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  if (text.includes(label)) {
    console.log('skip (exists):', path.relative(root, file));
    return;
  }
  text = replacer(text);
  if (text === before) {
    console.error('no change:', path.relative(root, file));
    process.exitCode = 1;
    return;
  }
  if (!text.includes(label)) {
    console.error('label missing after patch:', path.relative(root, file), label);
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(file, text);
  console.log('patched:', path.relative(root, file));
}

patch(
  abs('frontend/src/tools/registry/keys.ts'),
  (t) =>
    t.replaceAll(
      /([ \t]*)'ImpermanentLossCalculator',/g,
      "$1'ImmediateAnnuityCalculator',\n$1'ImpermanentLossCalculator',"
    ),
  'ImmediateAnnuityCalculator'
);

patch(
  abs('backend/src/modules/tools/tool.key.ts'),
  (t) =>
    t
      .replaceAll(
        /([ \t]*)'ImpermanentLossCalculator',/g,
        "$1'ImmediateAnnuityCalculator',\n$1'ImpermanentLossCalculator',"
      )
      .replaceAll(
        /([ \t]*)!isApprovedComponentKey\('ImpermanentLossCalculator'\) \|\|/g,
        "$1!isApprovedComponentKey('ImmediateAnnuityCalculator') ||\n$1!isApprovedComponentKey('ImpermanentLossCalculator') ||"
      ),
  'ImmediateAnnuityCalculator'
);

patch(
  abs('frontend/src/tools/registry/tool.key.ts'),
  (t) =>
    t
      .replaceAll(
        /([ \t]*)'ImpermanentLossCalculator',/g,
        "$1'ImmediateAnnuityCalculator',\n$1'ImpermanentLossCalculator',"
      )
      .replaceAll(
        /([ \t]*)!isApprovedComponentKey\('ImpermanentLossCalculator'\) \|\|/g,
        "$1!isApprovedComponentKey('ImmediateAnnuityCalculator') ||\n$1!isApprovedComponentKey('ImpermanentLossCalculator') ||"
      ),
  'ImmediateAnnuityCalculator'
);

patch(
  abs('frontend/src/tools/registry/index.ts'),
  (t) => {
    if (t.includes('ImmediateAnnuityCalculator')) return t;
    return t.replace(
      '  ImpermanentLossCalculator: lazyTool(() =>',
      `  ImmediateAnnuityCalculator: lazyTool(() =>
    import(
      '@/tools/calculators/immediate-annuity/ImmediateAnnuityCalculator'
    ).then((mod) => ({
      default: mod.ImmediateAnnuityCalculator,
    })),
  ),
  ImpermanentLossCalculator: lazyTool(() =>`
    );
  },
  'ImmediateAnnuityCalculator'
);

patch(
  abs('frontend/src/tools/registry/details.ts'),
  (t) =>
    t.replace(
      /ImpermanentLossCalculator: \(\) =>\r?\n\s*import\('@\/tools\/calculators\/impermanent-loss\/detail'\),/,
      `ImmediateAnnuityCalculator: () =>
    import('@/tools/calculators/immediate-annuity/detail'),
  ImpermanentLossCalculator: () =>
    import('@/tools/calculators/impermanent-loss/detail'),`
    ),
  'ImmediateAnnuityCalculator'
);

patch(
  abs('frontend/src/tools/registry/sitemap.ts'),
  (t) =>
    t.replace(
      /([ \t]*)'impermanent-loss-calculator',/g,
      "$1'immediate-annuity-calculator',\n$1'impermanent-loss-calculator',"
    ),
  'immediate-annuity-calculator'
);

patch(
  abs('frontend/src/app/sitemap.ts'),
  (t) =>
    t.replace(
      /([ \t]*)'impermanent-loss-calculator',/g,
      "$1'immediate-annuity-calculator',\n$1'impermanent-loss-calculator',"
    ),
  'immediate-annuity-calculator'
);

patch(
  abs('frontend/src/app/(website)/tools/[slug]/page.tsx'),
  (t) =>
    t.replace(
      /([ \t]*)'holding-period-return-calculator',/g,
      "$1'holding-period-return-calculator',\n$1'immediate-annuity-calculator',"
    ),
  'immediate-annuity-calculator'
);

patch(
  abs('frontend/src/app/embed/[slug]/page.tsx'),
  (t) =>
    t.replace(
      /([ \t]*)'holding-period-return-calculator',/g,
      "$1'holding-period-return-calculator',\n$1'immediate-annuity-calculator',"
    ),
  'immediate-annuity-calculator'
);

console.log('done');
