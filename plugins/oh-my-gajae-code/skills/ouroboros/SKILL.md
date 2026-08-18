---
name: ouroboros
description: "Activate only when the user explicitly invokes `/omg:ouroboros-setup`. Ordinary planning, interviewing, specification, update, or implementation language never activates this external Ouroboros integration."
---

# Ouroboros external integration

Ouroboros is upstream-owned external software (`ouroboros-ai`). This skill is only an explicit
GJC integration boundary: never vendor, copy, reconstruct, install, or modify its engine, MCP
server, bridge, or its 24 upstream skills. It does not replace or implicitly invoke any GJC
native workflow.

## Activation and prerequisites

- Activate **only** from `/omg:ouroboros-setup`. Do not activate from
  ordinary planning, interview, seed, specification, or implementation requests, even when they
  mention Ouroboros.
- Require Python >=3.12 and `gjc`. If the `ouroboros` executable is absent, report it and stop.
  For an installed executable, classify legacy updater support first as described below; only a
  modern updater-supported installation proceeds to `ouroboros --version` and the minimum
  Ouroboros 0.51.7 check. Never auto-install, auto-update, or mutate anything automatically.
- Treat user goals, answers, and session identifiers as data. Send them through the official GJC
  route as separate argument values, never executable shell text. Do not use `eval`, `sh -c`,
  interpolation into executable shell, command substitution, or a shell-generated command line.

## `/omg:ouroboros-setup`

1. Confirm that `ouroboros update --help` exists. If it is absent, or the install identity is
   ambiguous, fail closed. State that this may be a legacy or ambiguous install and show the
   official upstream reinstall command:
   `curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_RUNTIME=gjc bash`.
   Do not execute it, offer an automatic repair, or mutate the installation. The user must run it
   directly, restart or reload GJC, and explicitly invoke `/omg:ouroboros-setup` again.
2. For a modern installation, run exactly `ouroboros update --check` as the only
   latest-version check. Do not scrape GitHub, query a package registry, or infer package
   ownership.
3. Present the `update --check` result. Update only after the user makes an explicit choice. The
   sole update command is `ouroboros update --yes --runtime gjc`.
4. After a successful update, stop. Require the user to restart or reload GJC before any further
   Ouroboros activity.
5. For a suitable current installation, invoke exactly `ouroboros setup --runtime gjc`. Use an
   upstream-supported non-interactive option only when its live `ouroboros setup --help` output
   confirms that option. Verify the setup command result and relay its restart/reload guidance.

## Deliberate non-goal: plan dispatch

Do not expose or emulate an OMG plan command. Ouroboros 0.51.7's hidden GJC dispatcher does not
carry the structured runtime handle needed to continue a multi-turn interview, and bare
`ooo seed <session-id>` does not carry the two required client-gate attestations. Until upstream
ships a resumable, gate-carrying GJC dispatch contract, direct users to GJC native
`deep-interview`/`ralplan` for planning. Never paper over this gap with repeated dispatches,
private Python imports, PTY automation, or fabricated gate values.
