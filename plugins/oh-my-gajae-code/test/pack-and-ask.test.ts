import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const pluginRoot = resolve(import.meta.dir, "..");
const engine = join(pluginRoot, "bin/pack_and_ask.py");
const extragoal = join(pluginRoot, "skills/extragoal/SKILL.md");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function runAdvancedMenuFixture(
  modelLabel: string,
  reasoningLabel: string,
  selectedModel = "GPT-5.6 Sol",
  requiredModel = "GPT-5.6 Sol",
): string {
  const script = `
import importlib.util
import sys

spec = importlib.util.spec_from_file_location("pack_and_ask", ${JSON.stringify(engine)})
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.time.sleep = lambda _: None

class Row:
    def __init__(self, label, text=None, expanded=None):
        self.label = label
        self.text = text if text is not None else label
        self.expanded = expanded
        self.clicked = False
    def get_attribute(self, name):
        if name == "aria-label": return self.label
        if name == "aria-expanded": return self.expanded
        return None
    def inner_text(self): return self.text
    def click(self): self.clicked = True

class Keyboard:
    def press(self, key): pass

class Page:
    def __init__(self):
        self.advanced = Row("Advanced", "Advanced", "true")
        self.model = Row(${JSON.stringify(modelLabel)}, ${JSON.stringify(`${modelLabel}\n${selectedModel}`)})
        self.reasoning = Row(${JSON.stringify(reasoningLabel)}, ${JSON.stringify(`${reasoningLabel}\nPro`)})
        self.radios = [Row(${JSON.stringify(requiredModel)}), Row("Pro")]
        self.keyboard = Keyboard()
    def query_selector_all(self, selector):
        if selector == '[role="menuitem"]': return [self.advanced, self.model, self.reasoning]
        if selector == '[role="menuitemradio"], [role="option"]': return self.radios
        return []
    def query_selector(self, selector):
        return object() if selector == '[role="menu"]' else None

result = module._select_advanced_model_and_effort(Page(), "Pro", ${JSON.stringify(requiredModel)})
print(repr(result))
`;
  const result = spawnSync("python3", ["-c", script], { encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  return result.stdout;
}

describe("pack_and_ask security and advanced-menu contracts", () => {
  test("uses the verified isolated GJC reviewer selector", () => {
    const contract = read(extragoal);
    expect(contract).toContain("env -u GJC_SESSION_ID GJC_NOTIFICATIONS=0 GJC_SDK_DISABLE=1 gjc -p --no-session --model openai-codex/gpt-5.6-sol:max --tools read,search,find");
    expect(contract).toContain("- `openai-codex/gpt-5.6-sol:max` (네이티브, 기본 ON)");
    expect(contract).not.toContain("withfox/gpt-5.6-sol:max");
  });

  test("does not override native credential storage or close browsers", () => {
    const source = read(engine);
    for (const forbidden of ["--password-store=basic", "--use-mock-keychain", "Browser.close", "atexit", "close_started_browser", "_kill_profile_browsers", "pkill"]) {
      expect(source).not.toContain(forbidden);
    }
  });

  test("keeps the browser profile private and CDP localhost-bound", () => {
    const source = read(engine);
    expect(source).toContain('"--remote-debugging-address=127.0.0.1"');
    expect(source).toContain('os.chmod(BROWSER_PROFILE_DIR, 0o700)');
    expect(source).toContain('if os.name != "nt":');
    expect(source).toContain('popen_kwargs["start_new_session"] = True');
  });

  test("fails before browser launch when private profile setup fails", () => {
    const script = `
import importlib.util
import pathlib
import tempfile
spec = importlib.util.spec_from_file_location("pack_and_ask", ${JSON.stringify(engine)})
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.BROWSER_PROFILE_DIR = pathlib.Path(tempfile.mkdtemp()) / "profile"
module.os.chmod = lambda *_: (_ for _ in ()).throw(PermissionError("denied"))
called = []
module.subprocess.Popen = lambda *_args, **_kwargs: called.append(True)
print(module.launch_browser_exe("/browser"), bool(called))
`;
    const result = spawnSync("python3", ["-c", script], { encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim().split("\n").at(-1)).toBe("False False");
  });

  test("accepts CDP only when Chrome's private profile receipt matches", () => {
    const script = `
import importlib.util
import io
import json
import pathlib
import tempfile
spec = importlib.util.spec_from_file_location("pack_and_ask", ${JSON.stringify(engine)})
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.BROWSER_PROFILE_DIR = pathlib.Path(tempfile.mkdtemp())
(module.BROWSER_PROFILE_DIR / "DevToolsActivePort").write_text("9222\\n/devtools/browser/owned\\n")
module.urllib.request.urlopen = lambda *_args, **_kwargs: io.BytesIO(json.dumps({
    "webSocketDebuggerUrl": "ws://127.0.0.1:9222/devtools/browser/owned"
}).encode())
print(module._cdp_matches_dedicated_profile())
(module.BROWSER_PROFILE_DIR / "DevToolsActivePort").write_text("9222\\n/devtools/browser/other\\n")
print(module._cdp_matches_dedicated_profile())
`;
    const result = spawnSync("python3", ["-c", script], { encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim().split("\n")).toEqual(["True", "False"]);
  });

  test("selects and verifies Korean advanced model and reasoning rows", () => {
    expect(runAdvancedMenuFixture("모델", "추론 강도")).toContain("(True, 'GPT-5.6 Sol (Pro)')");
  });

  test("selects and verifies English advanced model and reasoning rows", () => {
    expect(runAdvancedMenuFixture("Model", "Reasoning effort")).toContain("(True, 'GPT-5.6 Sol (Pro)')");
  });

  test("fails closed when advanced rows are absent", () => {
    const script = `
import importlib.util
spec = importlib.util.spec_from_file_location("pack_and_ask", ${JSON.stringify(engine)})
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
class Page:
    def query_selector_all(self, selector): return []
print(repr(module._select_advanced_model_and_effort(Page(), "Pro", "GPT-5.6 Sol")))
`;
    const result = spawnSync("python3", ["-c", script], { encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim()).toBe("None");
  });

  test("rejects a different GPT-5.6 model variant", () => {
    expect(
      runAdvancedMenuFixture("Model", "Reasoning effort", "GPT-5.6 Thinking"),
    ).toContain("(False, None)");
  });
});
