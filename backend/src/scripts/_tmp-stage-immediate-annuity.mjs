/**
 * Stage Immediate Annuity only: apply Immediate keys onto HEAD shared files,
 * stage them, then restore the dirty working-tree copies (colleague WIP).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ia-stage-'));

const shared = [
  'frontend/src/tools/registry/keys.ts',
  'frontend/src/tools/registry/index.ts',
  'frontend/src/tools/registry/details.ts',
  'frontend/src/tools/registry/sitemap.ts',
  'frontend/src/tools/registry/tool.key.ts',
  'frontend/src/app/sitemap.ts',
  'frontend/src/app/(website)/tools/[slug]/page.tsx',
  'frontend/src/app/embed/[slug]/page.tsx',
  'backend/src/modules/tools/tool.key.ts',
];

function abs(rel) {
  return path.join(root, rel);
}

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

function applyImmediate(text, file) {
  let t = text;
  const hasKey = t.includes('ImmediateAnnuityCalculator') || t.includes('immediate-annuity-calculator');

  if (file.endsWith('keys.ts') || file.endsWith('tool.key.ts')) {
    if (!t.includes("'ImmediateAnnuityCalculator'")) {
      t = t.replaceAll(
        /([ \t]*)'ImpermanentLossCalculator',/g,
        "$1'ImmediateAnnuityCalculator',\n$1'ImpermanentLossCalculator',"
      );
    }
    if (
      file.includes('tool.key.ts') &&
      !t.includes("!isApprovedComponentKey('ImmediateAnnuityCalculator')")
    ) {
      t = t.replaceAll(
        /([ \t]*)!isApprovedComponentKey\('ImpermanentLossCalculator'\) \|\|/g,
        "$1!isApprovedComponentKey('ImmediateAnnuityCalculator') ||\n$1!isApprovedComponentKey('ImpermanentLossCalculator') ||"
      );
    }
  } else if (file.endsWith('index.ts') && file.includes('registry')) {
    if (!t.includes('ImmediateAnnuityCalculator')) {
      t = t.replace(
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
    }
  } else if (file.endsWith('details.ts')) {
    if (!t.includes('ImmediateAnnuityCalculator')) {
      t = t.replace(
        /ImpermanentLossCalculator: \(\) =>\r?\n\s*import\('@\/tools\/calculators\/impermanent-loss\/detail'\),/,
        `ImmediateAnnuityCalculator: () =>
    import('@/tools/calculators/immediate-annuity/detail'),
  ImpermanentLossCalculator: () =>
    import('@/tools/calculators/impermanent-loss/detail'),`
      );
    }
  } else if (file.includes('sitemap')) {
    if (!t.includes('immediate-annuity-calculator')) {
      t = t.replace(
        /([ \t]*)'impermanent-loss-calculator',/g,
        "$1'immediate-annuity-calculator',\n$1'impermanent-loss-calculator',"
      );
    }
  } else if (file.includes('[slug]/page.tsx')) {
    if (!t.includes('immediate-annuity-calculator')) {
      t = t.replace(
        /([ \t]*)'holding-period-return-calculator',/g,
        "$1'holding-period-return-calculator',\n$1'immediate-annuity-calculator',"
      );
    }
  }

  if (!hasKey) {
    const ok =
      t.includes('ImmediateAnnuityCalculator') ||
      t.includes('immediate-annuity-calculator');
    if (!ok) throw new Error(`failed to inject Immediate into ${file}`);
  }
  return t;
}

// 1) Snapshot dirty working trees
for (const rel of shared) {
  const src = abs(rel);
  const dest = path.join(tmp, rel.replace(/[\\/]/g, '__'));
  fs.copyFileSync(src, dest);
}

// 2) Reset shared files to HEAD, inject Immediate only, write
for (const rel of shared) {
  const head = git('show', `HEAD:${rel.replace(/\\/g, '/')}`);
  const next = applyImmediate(head, rel);
  fs.writeFileSync(abs(rel), next);
}

// 3) Stage Immediate module + assign + shared + brain pieces added separately
const toAdd = [
  ...shared,
  'frontend/src/tools/calculators/immediate-annuity',
  'backend/src/scripts/assign-immediate-annuity-tool.ts',
];
execFileSync('git', ['add', '--', ...toAdd], { cwd: root, stdio: 'inherit' });

// 4) Restore dirty working copies (colleague WIP returns unstaged)
for (const rel of shared) {
  const dest = path.join(tmp, rel.replace(/[\\/]/g, '__'));
  // Ensure Immediate remains in restored WIP too
  const dirty = applyImmediate(fs.readFileSync(dest, 'utf8'), rel);
  fs.writeFileSync(abs(rel), dirty);
}

console.log('staged Immediate Annuity shared files from HEAD+Immediate; working tree restored with Immediate + WIP');
console.log('tmp', tmp);
