import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceMission, createMission, featurePlaybook, validatePlaybook } from './playbook.ts';

test('requires ordered stages and preserves the input', () => {
  const mission = createMission(featurePlaybook);
  assert.throws(() => advanceMission(featurePlaybook, mission, 'test', []), /order/);
  const next = advanceMission(featurePlaybook, mission, 'context', [{ kind: 'brief', reference: 'DEMO-1', passed: true }]);
  assert.deepEqual(mission.completed, []);
  assert.deepEqual(next.completed, ['context']);
});
test('rejects missing, failing and empty evidence', () => {
  for (const evidence of [[], [{ kind: 'brief', reference: 'DEMO-1', passed: false }], [{ kind: 'brief', reference: ' ', passed: true }]]) {
    assert.throws(() => advanceMission(featurePlaybook, createMission(featurePlaybook), 'context', evidence), /evidence/);
  }
});
test('pins playbook version and rejects invalid history', () => {
  const mission = createMission(featurePlaybook);
  assert.throws(() => advanceMission({ ...featurePlaybook, version: 2 }, mission, 'context', []), /version/);
  assert.throws(() => advanceMission(featurePlaybook, { ...mission, completed: ['test'] }, 'plan', []), /history/);
});
test('completes a mission only with all required evidence', () => {
  let mission = createMission(featurePlaybook);
  for (const stage of featurePlaybook.stages) mission = advanceMission(featurePlaybook, mission, stage.id, stage.requires.map(kind => ({ kind, reference: `fixture:${kind}`, passed: true })));
  assert.equal(mission.completed.length, 5);
  assert.throws(() => advanceMission(featurePlaybook, mission, 'review', []), /order/);
});
test('rejects ambiguous stage definitions', () => {
  assert.throws(() => validatePlaybook({ ...featurePlaybook, stages: [featurePlaybook.stages[0], featurePlaybook.stages[0]] }));
});
