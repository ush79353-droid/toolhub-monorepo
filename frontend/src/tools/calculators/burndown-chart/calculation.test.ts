import assert from 'node:assert/strict';
import { calculateBurndown, formatPoints } from './calculation';
import { validateBurndownDraft, createDefaultDraft } from './validation';

{
  const res = calculateBurndown(
    { sprintDuration: 10, totalStoryPoints: 100, dailyBurn: Array(10).fill(0) },
    0
  );
  assert.ok(res);
  assert.equal(res.points[0]?.idealRemaining, 100);
  assert.equal(res.points[0]?.actualRemaining, 100);
  assert.equal(res.points[10]?.idealRemaining, 0);
  assert.equal(res.points[5]?.actualRemaining, null);
}

{
  const burns = [10, 10, 10, 0, 0, 0, 0, 0, 0, 0];
  const res = calculateBurndown(
    { sprintDuration: 10, totalStoryPoints: 100, dailyBurn: burns },
    3
  );
  assert.ok(res);
  assert.equal(res.totalBurned, 30);
  assert.equal(res.remainingPoints, 70);
  assert.equal(res.points[3]?.actualRemaining, 70);
  assert.equal(res.points[3]?.idealRemaining, 70);
  assert.equal(res.points[4]?.actualRemaining, null);
}

{
  assert.equal(
    calculateBurndown(
      { sprintDuration: 5, totalStoryPoints: 10, dailyBurn: [3, 3, 3, 3, 3] },
      5
    ),
    null
  );
}

{
  const draft = createDefaultDraft();
  draft.totalStoryPoints = '50';
  draft.dailyBurn[0] = '10';
  draft.progressThroughDay = 1;
  const v = validateBurndownDraft(draft);
  assert.equal(v.isValid, true);
  assert.equal(v.parsed?.totalStoryPoints, 50);
}

{
  assert.equal(formatPoints(70), '70');
  assert.equal(formatPoints(33.333), '33.33');
}

console.log('burndown-chart calculation.test ok');
