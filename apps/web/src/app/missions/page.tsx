'use client';

import Link from 'next/link';
import { useState } from 'react';
import { advanceMission, createMission, featurePlaybook } from '../../../../../packages/shared/src/playbook';

export default function Missions() {
  const [mission, setMission] = useState(() => createMission(featurePlaybook));
  const [failure, setFailure] = useState(false);
  const [message, setMessage] = useState('Select the next stage to inspect its evidence gate.');
  const current = featurePlaybook.stages[mission.completed.length];
  function advance() {
    if (!current) return;
    try {
      setMission(advanceMission(featurePlaybook, mission, current.id, current.requires.map(kind => ({ kind, reference: `demo-fixture:${kind}`, passed: !failure }))));
      setMessage(`${current.title}: sample evidence accepted.`);
    } catch (error) { setMessage((error as Error).message); }
  }
  return <main className="mx-auto h-screen max-w-6xl overflow-y-auto px-5 py-10 md:py-16">
    <nav className="mb-12 flex flex-wrap justify-between gap-4 text-sm text-slate-400"><Link href="/">AGENT OFFICE / LAB</Link><Link href="/office">Open agent office ↗</Link></nav>
    <div className="mb-5 text-xs uppercase tracking-widest text-emerald-400">Playbook explorer · v0.1 preview</div>
    <h1 className="mb-5 text-4xl font-semibold md:text-6xl">One mission.<br/>Every step accounted for.</h1>
    <p className="mb-8 max-w-2xl text-lg text-slate-400">Turn a feature into an ordered delivery process. Inspect who owns each step and what evidence unlocks the next one.</p>
    <div className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">Interactive demo — synthetic evidence only. No agents run here, no Jira or Confluence account is connected, and refreshing resets the mission.</div>
    <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
      <section aria-label="Playbook stages" className="space-y-3">
        {featurePlaybook.stages.map((stage, index) => {
          const done = mission.completed.includes(stage.id), active = current?.id === stage.id;
          return <article key={stage.id} className={`rounded-xl border p-5 ${active ? 'border-emerald-400/60 bg-emerald-400/5' : 'border-slate-800 bg-slate-900/50'}`}>
            <div className="mb-2 flex justify-between gap-3"><h2 className="font-medium">{String(index + 1).padStart(2, '0')} / {stage.title}</h2><span className="text-xs text-emerald-300">{done ? 'Complete' : active ? 'Ready' : 'Locked'}</span></div>
            <p className="text-sm text-slate-400">{stage.owner} · Requires: {stage.requires.join(', ')}</p>
          </article>;
        })}
      </section>
      <aside className="space-y-6">
        <section className="rounded-xl border border-slate-800 p-6"><p className="mb-3 text-xs uppercase tracking-widest text-slate-500">Sample mission · DEMO-1</p><h2 className="mb-4 text-xl">Add a project activity filter</h2><p className="text-sm text-slate-400">Acceptance: filter activity by agent; preserve the unfiltered view; verify empty results.</p><div className="mt-5 border-t border-slate-800 pt-4 text-sm">{mission.completed.length} / {featurePlaybook.stages.length} stages complete</div></section>
        <section className="rounded-xl border border-slate-800 p-6"><h2 className="mb-4 font-medium">Try the evidence gate</h2><label className="mb-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simulate failing evidence</label><button disabled={!current} onClick={advance} className="w-full rounded-lg bg-emerald-300 px-4 py-3 font-medium text-slate-950 disabled:opacity-40">{current ? 'Submit sample evidence' : 'Mission complete'}</button><p role="status" className="mt-4 text-sm text-slate-400">{message}</p><button className="mt-5 text-sm text-slate-400 underline" onClick={() => { setMission(createMission(featurePlaybook)); setFailure(false); setMessage('Demo reset.'); }}>Reset demo</button></section>
        <p className="text-xs leading-relaxed text-slate-500">Built on Open Office. Live runner evidence, persistent missions and Atlassian connections are planned, not enabled in this preview.</p>
      </aside>
    </div>
  </main>;
}
