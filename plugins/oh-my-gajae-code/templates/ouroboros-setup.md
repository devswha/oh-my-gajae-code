---
description: Explicitly check and set up an external Ouroboros installation for GJC without installing, updating, or repairing it automatically.
argument-hint: ""
---

# /omg:ouroboros-setup

Load and follow the `ouroboros` skill. This command is explicit-only: ordinary planning,
interview, specification, or implementation language must not activate it.

Treat `ouroboros-ai` as an external, upstream-owned prerequisite. Never vendor or copy its
engine, MCP server, bridge, or upstream skills. Require Python >=3.12 and `gjc`; report an absent
`ouroboros` executable without mutation. Never auto-install or auto-update.

Check `ouroboros update --help` before any update lookup. If it is absent or installation identity is
ambiguous, fail closed: show
`curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_RUNTIME=gjc bash`,
but do not execute it or repair automatically. The user must run it directly, restart or reload
GJC, and explicitly invoke `/omg:ouroboros-setup` again.

For a modern installation, use exactly `ouroboros update --check` as the only latest-version
check, then read `ouroboros --version` and require Ouroboros >=0.51.7. Do not scrape GitHub or
infer package ownership.

Only after an explicit user choice may the command `ouroboros update --yes --runtime gjc` run.
After a successful update, stop and require GJC restart or reload before continuing.

Before setup, inspect `gjc --help` and require `rpc` among the advertised `--mode` values.
Ouroboros 0.51.7 requires `gjc --mode rpc`; `text`, `json`, and `acp` are not substitutes. If
`rpc` is absent, report the installed GJC and Ouroboros versions as incompatible and stop. Do not
claim that an installed bridge proves runtime operation.

For a modern, unambiguous installation, run exactly `ouroboros setup --runtime gjc`. Use an
upstream-supported non-interactive option only when live `ouroboros setup --help` confirms it.
Verify the result and relay restart/reload guidance. Report setup as configuration success only;
actual interview operation remains unverified until a first-turn live call succeeds without a
GJC RPC protocol error.
