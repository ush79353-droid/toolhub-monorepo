import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function gitShow(rel) {
  return execFileSync('git', ['show', `HEAD:${rel}`], {
    cwd: root,
    encoding: 'utf8',
  });
}

const changelogEntry = `### 2026-11-17 — Immediate Annuity Calculator (Screenshot-First + FX)
- **Summary:** Shipped Immediate Annuity Calculator on existing catalog slug \`immediate-annuity-calculator\` (\`ImmediateAnnuityCalculator\`, catalog \`6af46f0fa27d8d1d4e98ffad\`). Five solve modes (withdraw default, invest, duration, rate, remain); payment frequency; beginning/end timing; start date; optional compounding; optional remaining balance + withdrawal growth; yearly schedule; independent Phase 2 FX. Activated.
- **Formulas:** Reuses shared annuity engine — period rate \`i = (1 + r/m)^(m/q) − 1\` (default m = payment frequency); ordinary/due withdrawal schedule; inverse solves for PV/PMT/n/r/FV; totals and last withdrawal date from full-precision schedule.
- **FX:** Independent currencies on amount to invest, withdrawal amount, and optional remaining balance; normalize into invest currency before solving. Rates, lengths, growth percents, and dates never convert. Stale/missing rate handling via \`CURRENCY_CONVERSION_SLUGS\`.
- **Example:** 100,000 PKR / 10y / 1.5% / monthly / beginning → PMT ≈ 896.79; 120 withdrawals; total ≈ 107,615.28; return ≈ 7,615.28.
- **Important Files:** \`frontend/src/tools/calculators/immediate-annuity/*\`, registries, sitemap, \`CURRENCY_CONVERSION_SLUGS\`, \`backend/src/modules/tools/tool.key.ts\`, \`backend/src/scripts/assign-immediate-annuity-tool.ts\`, \`brain/*\`.
- **Verification:** Catalog verified undeveloped before coding. Math self-check ≈ Omni. MongoDB activated. Lint/builds/browser/automated tests omitted per user. No push/pull/sync.

`;

const taskRow =
  '| `TOOL-373` | Implement Immediate Annuity Calculator on existing slug `immediate-annuity-calculator` with five solve modes, ordinary/due timing, yearly schedule, independent FX, guide/SEO/embed, and verified activation | Cursor | Completed | `frontend/src/tools/calculators/immediate-annuity/*`, registry, sitemap, `CURRENCY_CONVERSION_SLUGS`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-immediate-annuity-tool.ts`, `brain/*` | `TOOL-372` |';

const frontendBullet =
  "- `src/tools/calculators/immediate-annuity/`: Immediate Annuity Calculator (`ImmediateAnnuityCalculator`, slug `immediate-annuity-calculator`). Five solve modes; payment frequency; beginning/end; start date; optional compounding/remaining/growth; yearly schedule; independent Phase 2 FX on three money fields; guide in `detail.tsx`.\n";

// CHANGELOG: prepend after any leading title block if present, else at top of content after convention
let changelog = gitShow('brain/CHANGELOG.md');
if (!changelog.includes('Immediate Annuity Calculator')) {
  // Insert before first ### dated entry if Growing is first, or at very top after header
  const marker = '### 2026-11-17 — Growing Annuity Calculator';
  if (changelog.includes(marker)) {
    changelog = changelog.replace(marker, `${changelogEntry}${marker}`);
  } else {
    const firstDated = changelog.indexOf('\n### 20');
    if (firstDated >= 0) {
      changelog =
        changelog.slice(0, firstDated + 1) +
        changelogEntry +
        changelog.slice(firstDated + 1);
    } else {
      changelog = changelogEntry + changelog;
    }
  }
}
fs.writeFileSync(path.join(root, 'brain/CHANGELOG.md'), changelog);

let tasks = gitShow('brain/TASKS.md');
if (!tasks.includes('TOOL-373')) {
  if (tasks.includes('TOOL-372')) {
    tasks = tasks.replace(
      /(\| `TOOL-372` \|[^\n]+\n)/,
      `$1${taskRow}\n`
    );
  } else {
    tasks = tasks.replace(
      '## Completed\n',
      `## Completed\n\n${taskRow}\n`
    );
  }
}
fs.writeFileSync(path.join(root, 'brain/TASKS.md'), tasks);

let frontend = gitShow('brain/FRONTEND.md');
if (!frontend.includes('immediate-annuity')) {
  frontend = frontend.replace(
    "- `src/tools/calculators/annuity-payout/`",
    `${frontendBullet}- \`src/tools/calculators/annuity-payout/\``
  );
  if (!frontend.includes('immediate-annuity')) {
    frontend = frontend.replace(
      "- `src/tools/calculators/growing-annuity/`",
      `${frontendBullet}- \`src/tools/calculators/growing-annuity/\``
    );
  }
}
fs.writeFileSync(path.join(root, 'brain/FRONTEND.md'), frontend);

let current = gitShow('brain/CURRENT_STATE.md');
if (!current.includes('Immediate Annuity Calculator')) {
  current = current.replace(
    /> \*\*Primary Agent Starting Point\.\*\* Last verified:.*$/,
    '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Immediate Annuity Calculator live at `/tools/immediate-annuity-calculator` with FX; Auto Loan remains master Tool Detail Page).'
  );
  const insertAfter = current.indexOf('### Implemented (Verified End-to-End)');
  if (insertAfter >= 0) {
    const bullet =
      "- **Immediate Annuity Calculator (`/tools/immediate-annuity-calculator`):** Live client-side immediate annuity (`componentKey: 'ImmediateAnnuityCalculator'`, catalog `6af46f0fa27d8d1d4e98ffad`). Five solve modes (withdraw/invest/duration/rate/remain); payment frequency; beginning/end; start date; optional compounding and more-params (remaining balance, withdrawal growth); yearly schedule; independent Phase 2 FX on invest/withdrawal/remaining. Example: 100,000 PKR / 10y / 1.5% monthly due → ≈ 896.79. Activated.\n";
    // Insert after first Auto Loan bullet block start — place near other annuity tools if present
    if (current.includes('Growing Annuity Calculator')) {
      current = current.replace(
        /- \*\*Growing Annuity Calculator[^\n]+\n/,
        (m) => `${m}${bullet}`
      );
    } else {
      const lineEnd = current.indexOf('\n', insertAfter);
      current =
        current.slice(0, lineEnd + 1) + bullet + current.slice(lineEnd + 1);
    }
  }
}
fs.writeFileSync(path.join(root, 'brain/CURRENT_STATE.md'), current);

console.log('brain updated from HEAD + Immediate Annuity');
