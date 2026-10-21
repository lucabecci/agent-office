/** Pure workflow core. Evidence must be supplied by a trusted runner, never inferred from chat. */
export type Stage = { id: string; title: string; owner: string; requires: string[] };
export type Playbook = { id: string; version: number; stages: Stage[] };
export type Evidence = { kind: string; reference: string; passed: boolean };
export type Mission = { playbookId: string; playbookVersion: number; completed: string[]; evidence: Record<string, Evidence[]> };

export const featurePlaybook: Playbook = {
  id: 'feature-delivery', version: 1, stages: [
    { id: 'context', title: 'Understand the mission', owner: 'Planner', requires: ['brief'] },
    { id: 'plan', title: 'Approve the plan', owner: 'Human', requires: ['approval'] },
    { id: 'implement', title: 'Build the feature', owner: 'Codex / Cursor', requires: ['diff'] },
    { id: 'test', title: 'Verify the behavior', owner: 'Runner', requires: ['tests'] },
    { id: 'review', title: 'Review the delivery', owner: 'Human', requires: ['review'] },
  ],
};

export function validatePlaybook(book: Playbook): void {
  if (!book.id || !Number.isInteger(book.version) || book.version < 1 || !book.stages.length) throw new Error('Invalid playbook');
  const ids = new Set<string>();
  for (const stage of book.stages) {
    if (!stage.id || ids.has(stage.id) || !stage.title || !stage.owner || !stage.requires.length || stage.requires.some(r => !r.trim()) || new Set(stage.requires).size !== stage.requires.length) throw new Error('Invalid or duplicate stage');
    ids.add(stage.id);
  }
}

export function createMission(book: Playbook): Mission {
  validatePlaybook(book);
  return { playbookId: book.id, playbookVersion: book.version, completed: [], evidence: {} };
}

export function advanceMission(book: Playbook, mission: Mission, stageId: string, evidence: Evidence[]): Mission {
  validatePlaybook(book);
  if (mission.playbookId !== book.id || mission.playbookVersion !== book.version) throw new Error('Playbook version mismatch');
  if (mission.completed.length > book.stages.length || mission.completed.some((id, index) => id !== book.stages[index].id)) throw new Error('Invalid mission history');
  const stage = book.stages[mission.completed.length];
  if (!stage || stage.id !== stageId) throw new Error('Stages must complete in order');
  for (const requirement of stage.requires) {
    const matching = evidence.filter(item => item.kind === requirement);
    if (!matching.length || matching.some(item => item.passed !== true || !item.reference.trim())) throw new Error(`Missing or failed evidence: ${requirement}`);
  }
  return { ...mission, completed: [...mission.completed, stageId], evidence: { ...mission.evidence, [stageId]: evidence.map(item => ({ ...item })) } };
}
