# Agent Office

A local-first visual workspace for coding agents, with evidence-gated delivery playbooks.

**Early development preview.** Public fork of [Open Office](https://github.com/longyangxi/OpenOffice), licensed under MIT. The original office, gateway and agent adapters belong to the upstream contributors; see [upstream documentation](UPSTREAM_README.md). This fork adds the initial playbook core and an interactive mission explorer.

## What works in this fork

- Ordered, version-pinned playbooks with required evidence for each stage.
- Rejection of skipped stages, failed evidence and incompatible playbook versions.
- Responsive mission explorer at `/missions`, using explicitly synthetic fixtures.
- The inherited office and gateway remain available; their live integrations have not yet been validated in this fork.

## What is not implemented yet

Persistent missions, trusted runner-to-playbook events, Jira/Confluence connectors, cross-device mission state and a complete real feature delivery demo. Cursor support is experimental upstream. The mission explorer does not launch agents or approve real changes.

## Try the preview

Requires Node 22.6+ (Node 24 recommended) and pnpm.

```sh
git clone https://github.com/lucabecci/agent-office.git
cd agent-office
pnpm install --ignore-scripts --frozen-lockfile
pnpm test:playbook
pnpm dev:web
```

Open http://localhost:3000/missions. Try submitting failed evidence: the workflow must remain on the same stage. Demo state is in memory and resets on refresh. No account or credential is needed for this route.

For the inherited live office, use separate terminals for `pnpm dev:gateway` and `pnpm dev:web`, then visit `/pair`. Install and authenticate agent CLIs separately. Review the upstream setup before running agents against real repositories. The upstream postinstall is intentionally disabled above: it refers to an installer missing from this checkout.

## Roadmap

1. Validate a real Codex and Cursor task in an isolated example repository.
2. Persist mission state and ingest verified runner events and test exit codes.
3. Connect Jira issues and Confluence pages with explicit per-project configuration.
4. Map live mission stages to the pixel office and support authenticated mobile control.
5. Record a reproducible end-to-end demo and publish the first release.

Local-first refers to the application/runtime. Model providers and connected services may still receive data. Keep credentials and private playbooks outside Git. Do not expose an agent gateway directly to the public internet.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Focused improvements and reproducible bug reports are welcome. The current playbook is a generic example, not an internal company process.

## Attribution and license

MIT; original copyright retained in [LICENSE](LICENSE). Forked from Open Office at `5b0246c396aed041c5262ab0132623bf2b8b067b`. Upstream credits pixel art inspiration to [pixel-agents](https://github.com/pablodelucca/pixel-agents). No ownership of upstream assets is claimed.
