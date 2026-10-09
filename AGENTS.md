## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues on `graasp/client`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Git workflow

Every change reaches `main` through a pull request; `main` only moves by merge. Before implementing a ticket, branch off an up-to-date `main` with the ticket name, `<issue-number>-<kebab-case-title>` (e.g. `290-public-folder-download-zip`), commit there, and open the PR against `main`.
