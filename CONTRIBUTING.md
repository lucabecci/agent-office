# Contributing

Open an issue with the problem, expected behavior and a small reproduction. Keep PRs focused and distinguish simulated behavior from live integrations.

Run `pnpm test:playbook` for workflow changes and `pnpm --filter web build` for web changes. Add tests for gates and failure recovery. Never contribute credentials, private tickets, company documentation or real session transcripts.

Use generic fixtures. Future runners must authenticate event sources, bind evidence to a mission and execution, and prevent replay. A client-submitted `passed: true` is not production evidence.

Keep upstream attribution and the MIT license. Upstream changes can be fetched from `https://github.com/longyangxi/OpenOffice.git`; review and test them before merging.
