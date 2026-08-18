import { describe, expect, test } from "bun:test";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const pluginRoot = join(import.meta.dir, "..");
const skillPath = join(pluginRoot, "skills/ouroboros/SKILL.md");
const setupPath = join(pluginRoot, "templates/ouroboros-setup.md");
const installerPath = join(pluginRoot, "bin/install-skill.sh");
const reinstallCommand =
  "curl -fsSL https://raw.githubusercontent.com/Q00/ouroboros/main/scripts/install.sh | OUROBOROS_INSTALL_RUNTIME=gjc bash";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Ouroboros explicit external-integration contract", () => {
  test("has exactly one thin skill and one explicit setup command", () => {
    const skill = read(skillPath);
    const setup = read(setupPath);

    expect(readdirSync(dirname(skillPath))).toEqual(["SKILL.md"]);
    expect(skill).toMatch(/^---\nname: ouroboros\ndescription: "Activate only when the user explicitly invokes `\/omg:ouroboros-setup`\./);
    expect(skill).toContain("Ordinary planning, interviewing, specification, update, or implementation language never activates");
    expect(setup).toContain("# /omg:ouroboros-setup");
    expect(setup).toContain("Load and follow the `ouroboros` skill.");
    expect(existsSync(join(pluginRoot, "templates/ouroboros-plan.md"))).toBe(false);
  });

  test("keeps Ouroboros upstream-owned and verifies only documented prerequisites", () => {
    const skill = read(skillPath);

    expect(skill).toContain("external software (`ouroboros-ai`)");
    expect(skill).toContain("never vendor, copy, reconstruct");
    expect(skill).toContain("engine, MCP");
    expect(skill).toContain("bridge, or its 24 upstream skills");
    expect(skill).toContain("Python >=3.12 and `gjc`");
    expect(skill).toMatch(/minimum\s+Ouroboros 0\.51\.7 check/);
    expect(skill).toContain("`ouroboros --version`");
    expect(skill).toMatch(/Never auto-install, auto-update, or mutate anything automatically/i);
  });

  test("uses the native updater and fails closed for legacy installs", () => {
    const skill = read(skillPath);
    const setup = read(setupPath);

    for (const text of [skill, setup]) {
      expect(text).toContain("`ouroboros update --help`");
      expect(text).toContain("`ouroboros update --check`");
      expect(text).toMatch(/only\s+latest-version\s+check/);
      expect(text).toContain("fail closed");
      expect(text).toContain(reinstallCommand);
      expect(text).toContain("`ouroboros update --yes --runtime gjc`");
      expect(text).toMatch(/explicit user choice|user makes an explicit choice/);
      expect(text).toMatch(/restart or reload GJC|GJC restart or reload/);
      expect(text).toContain("`ouroboros setup --runtime gjc`");
      expect(text).toContain("`ouroboros setup --help`");
    }
    expect(skill.indexOf("`ouroboros update --help`")).toBeLessThan(
      skill.indexOf("`ouroboros update --check`"),
    );
    expect(skill).toContain("Do not scrape GitHub");
    expect(skill).toMatch(/infer package\s+ownership/);
    expect(skill).toContain("Verify the setup command result");
  });

  test("does not claim a broken plan wrapper", () => {
    const skill = read(skillPath);
    expect(skill).toContain("Deliberate non-goal: plan dispatch");
    expect(skill).toContain("does not\ncarry the structured runtime handle");
    expect(skill).toContain("does not carry the two required client-gate attestations");
    expect(skill).toContain("GJC native\n`deep-interview`/`ralplan`");
    expect(skill).toContain("Never paper over this gap");
  });

  test("targeted native install and uninstall own only the skill and setup command", () => {
    const installer = read(installerPath);
    expect(installer).toContain('[ "$target" = "ouroboros" ] || [ "$target" = "ouroboros-setup" ]');
    expect(installer).toContain('install_skill ouroboros "$mode"');
    expect(installer).toContain('install_command ouroboros-setup "$mode"');
    expect(installer).toContain('uninstall_skill ouroboros "$scope"');
    expect(installer).toContain('uninstall_command ouroboros-setup "$scope"');
    expect(installer).toContain(
      "never installs, updates, or removes its package, state, bridge, Seeds, or execution data",
    );
  });

  test("fails an incomplete targeted bundle before installing any Ouroboros surface", () => {
    const root = mkdtempSync(join(tmpdir(), "omg-ouroboros-incomplete-"));
    const plugin = join(root, "plugin");
    const home = join(root, "home");
    try {
      mkdirSync(join(plugin, "bin"), { recursive: true });
      mkdirSync(join(plugin, "skills/ouroboros"), { recursive: true });
      mkdirSync(join(plugin, "templates"), { recursive: true });
      copyFileSync(installerPath, join(plugin, "bin/install-skill.sh"));
      writeFileSync(join(plugin, "skills/ouroboros/SKILL.md"), "skill");
      // templates/ouroboros-setup.md is deliberately absent.
      const result = spawnSync("bash", [join(plugin, "bin/install-skill.sh"), "ouroboros", "user"], {
        encoding: "utf8",
        env: { ...process.env, HOME: home },
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("templates/ouroboros-setup.md");
      expect(existsSync(join(home, ".gjc/agent/runtimes/oh-my-gajae-code/root"))).toBe(false);
      expect(existsSync(join(home, ".gjc/agent/skills/ouroboros/SKILL.md"))).toBe(false);
      expect(existsSync(join(home, ".gjc/agent/commands/omg:ouroboros-setup.md"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
