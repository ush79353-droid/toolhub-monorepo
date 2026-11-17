import { execSync } from 'node:child_process';
import fs from 'node:fs';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

const path = 'brain/CURRENT_STATE.md';
const backup = fs.readFileSync(path, 'utf8');

// Clear any concurrent staged noise
sh('git reset HEAD');

let text = sh(`git show HEAD:${path}`).replace(/\r\n/g, '\n');
if (!text.includes('Annuity Payout Calculator')) {
  console.error('HEAD CURRENT_STATE missing Annuity Payout entry');
  process.exit(1);
}

const next =
  '> **Primary Agent Starting Point.** Last verified: **2026-11-17** (Annuity Payout Calculator live at `/tools/annuity-payout-calculator` with FX; Auto Loan remains master Tool Detail Page).';
text = text.replace(/^> \*\*Primary Agent Starting Point\.\*\*[^\n]*/m, next);
fs.writeFileSync(path, text);

sh(`git add -- "${path}"`);
const staged = sh('git diff --cached --name-only')
  .split(/\r?\n/)
  .filter(Boolean);
if (staged.length !== 1 || !staged[0].endsWith('CURRENT_STATE.md')) {
  console.error('unexpected staged set:', staged);
  fs.writeFileSync(path, backup);
  sh('git reset HEAD');
  process.exit(1);
}

sh('git commit -m "feat(calculator): implement annuity payout calculator with FX"');
const hash = sh('git rev-parse HEAD').trim();
const subject = sh('git log -1 --format=%s').trim();

fs.writeFileSync(path, backup);

if (!/annuity payout calculator with FX/i.test(subject)) {
  console.error('wrong subject', subject);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, hash, subject, codeCommit: 'd257a3af' }, null, 2));
