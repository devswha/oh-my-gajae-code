# omg v0.31.0 릴리스 검증 (2026-08-18)

후보 커밋: `07da34c2439deb3a1bbb7a17a328e27816078caa`
릴리스 범위: `v0.30.0..07da34c`

## 변경 범위

- 외부 `ouroboros-ai`의 설치 상태, GJC bridge, 최신 버전을 명시적으로 확인하는 `ouroboros` 스킬과 `/omg:ouroboros-setup` 커맨드를 추가했다.
- 최신 확인은 `ouroboros update --check`만 사용하고, 갱신은 사용자 승인 뒤 `ouroboros update --yes --runtime gjc`로만 수행한다.
- OMG는 Ouroboros 패키지, MCP, bridge, 상태, Seed, 실행 데이터를 설치·소유·삭제하지 않는다.
- Ouroboros 0.51.7의 GJC dispatcher가 다중 턴 interview handle과 Seed client-gate attestation을 전달하지 못하는 것을 확인해 `/omg:ouroboros-plan`은 출시하지 않았다. 계획에는 GJC native `deep-interview`/`ralplan`을 사용한다.
- 공개 표면은 스킬 7개, 커맨드 9개다.

## 필수 검증

- JSON parse: `.claude-plugin/marketplace.json`, `plugins/oh-my-gajae-code/.claude-plugin/plugin.json` 통과. 버전 `0.31.0` 일치.
- 구문 검사:
  - `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh plugins/oh-my-gajae-code/bin/omg-autoupdate.sh` 통과.
  - `python3 -m py_compile plugins/oh-my-gajae-code/bin/pack_and_ask.py` 통과.
  - `node --check plugins/oh-my-gajae-code/bin/multi-harness-research.mjs` 통과.
- 전체 테스트: `bun test plugins/oh-my-gajae-code/test` → **180 pass, 0 fail**, 1,437 assertions, 14 files.
- 신규 설치 재현: 격리된 HOME/XDG에서 `GJC_NOTIFICATIONS=0 GJC_SDK_DISABLE=1 bash install.sh --candidate-ref "$PWD"` → **rc 0**.
  - native skills: 7
  - native commands: 9
  - registry version: `0.31.0`
  - `ouroboros` skill과 `/omg:ouroboros-setup` 존재
  - 출시하지 않은 `/omg:ouroboros-plan` 부재
- targeted install/uninstall 재현: `install-skill.sh ouroboros user`가 skill+setup command를 함께 설치·제거하고, 외부 `~/.ouroboros`, 실제 GJC bridge 경로, never-owned `oh-my-gjc:ouroboros-setup.md`를 보존함.
- 상대 링크 검사: `README.md`, `docs/capabilities.md`, `INSTALLATION.md`, plugin README 통과.
- `git diff --check` 통과.
- gitleaks: `gitleaks git --redact --log-opts="origin/main..HEAD" --no-banner` → 2 commits, 27.40 KB, **no leaks found**.

## 독립 리뷰

- 초기 plan wrapper 리뷰에서 hidden dispatcher의 continuation handle 누락, Seed client-gate attestation 누락, legacy updater 검사 순서 문제를 발견했다.
- 동작하지 않는 plan surface를 전부 제거하고 native planning으로 fail-closed했다.
- targeted bundle 사전 검사와 역사적으로 실제 소유한 legacy alias의 폐쇄형 목록을 추가해 부분 설치와 never-owned alias 삭제를 막았다.
- 최종 재검토: **APPROVE**, blocker/high/medium finding 없음.

## 환경 제한

- 현재 머신의 기존 Ouroboros `0.33.0`은 native updater가 없어 live bridge setup을 실행하지 않았다. `/omg:ouroboros-setup`은 이 상태를 legacy로 분류하고 공식 재설치 안내 후 멈추도록 고정했다.
- 외부 Ouroboros 설치·업데이트와 provider 로그인은 OMG 릴리스 검증에서 자동 실행하지 않았다.

## 판정

**PASS.** main 병합, `v0.31.0` 태그 및 GitHub Release 발행 가능.
