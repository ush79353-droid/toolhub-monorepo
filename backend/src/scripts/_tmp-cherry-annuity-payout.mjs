import { execSync } from 'node:child_process';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

sh('git stash push -m "tmp-annuity-payout-cherry" -- brain/CURRENT_STATE.md');
try {
  sh('git cherry-pick f2edb583be81509dfc94f189f295dfb0889bde60');
} catch (err) {
  try {
    sh('git cherry-pick --abort');
  } catch {
    // ignore
  }
  try {
    sh('git stash pop');
  } catch {
    // ignore
  }
  console.error(String(err.stderr || err));
  process.exit(1);
}

const hash = sh('git rev-parse HEAD').trim();
const subject = sh('git log -1 --format=%s').trim();

try {
  sh('git stash pop');
} catch {
  // conflict on pop is ok — leave stash if needed
}

if (!/annuity payout calculator with FX/i.test(subject)) {
  console.error('wrong subject after cherry-pick', subject, hash);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, hash, subject }, null, 2));
