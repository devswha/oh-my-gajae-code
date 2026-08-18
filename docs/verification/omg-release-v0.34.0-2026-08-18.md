# omg v0.34.0 릴리스 검증 (2026-08-18)

후보 커밋: `90c1c695020a233e3acca4006201927716aba87c`
릴리스 범위: `v0.33.0..90c1c69`
upstream insane-search: `fivetaku/insane-search` 0.14.0, `019ee16bbf471595f9b67b164e4a92208183af2d`

## 변경

- hardened `insane-search` native skill 추가: ordinary read 실패 뒤에만 활성화하고, 공개 `http`/`https`만 SSRF-pinned transport로 읽으며 결과를 untrusted boundary로 감싼다.
- explicit-only `/omg:gpt-image` 추가: 로그인된 ChatGPT Images 웹에서 정확히 한 이미지 turn을 검증하고 UI Save/Download 원본만 PNG+provenance로 저장한다.
- `insane-review`와 `gpt-image`가 공유하는 OS-held CDP single-flight lease 및 private profile 검증을 추가했다.
- 현재 표면은 skills 5개, commands 5개다.

## 정적·회귀 검증

- manifest JSON parse, `waf_profiles.yaml` parse, 버전 `0.34.0` 일치.
- `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh` 통과.
- Python compile: launchers, shared lease, insane-review engine, insane-search engine 전체 통과.
- `git diff --check` 통과.
- focused Bun: **146 pass, 0 fail**, 837 assertions, 11 files.
- vendored engine regression scripts: **13/13 통과**; default bias check 통과.
- shared CDP lease: 별도 프로세스 동시 획득 차단 및 release 뒤 재획득 통과.
- GPT Image file safety: project-root/symlink output 거부, PNG magic/dimensions, directory `0700`, artifact `0600`, exclusive publish 통과.
- GPT Image hard deadline: stalled `download.save_as`가 POSIX monotonic deadline에서 중단됨.
- intended release files gitleaks: 643.88 KB, **no leaks found**. 전체 working tree 스캔의 `.env`/`.gjc` user-state 및 기존 fixture 탐지는 release candidate가 아니므로 제외했다.

## 동작 검증

- insane-search live generic fetch: `https://example.com/ --selector h1 --trace` → `strong_ok`; BEGIN/END untrusted boundary 확인.
- insane-search live high-friction route: Reddit public RSS phase-0 → `strong_ok`, `profile=phase0:reddit`; prompt-injection risk signal 유지.
- launcher가 `file://`, credential-bearing URL, `--max-attempts` 같은 비허용 control을 network 전 거부함.
- GPT Images live UI에서 direct `/images/` composer, exact prompt submission, new conversation, generated asset, fullscreen original control을 확인했다.
- event-scoped `page.expect_download`로 기존 생성 asset의 original Save를 회수: PNG `1254x1254`, `674754` bytes, SHA-256 `cde48f5b1ffa2d10bf2ed2a93dfdbff0163c7a31d297b05f69d40e8489659ec8`.
- production CLI는 현재 port `9222`가 dedicated `DevToolsActivePort` receipt와 일치하지 않아 **fail-closed**했다. 안전한 전용 프로필에서의 새 prompt→save 전체 1회 실행은 `pending-environment`; 일반 프로필을 허용하거나 receipt를 조작해 통과시키지 않았다.
- 격리 HOME 신규 설치: **rc 0**, skills 5, commands 5, suite-root binding mode `0600`, version `0.34.0`; installed insane-search check와 GPT Image help 통과.

## 독립 리뷰

첫 보안 리뷰의 GPT Image causal association/download scope/profile/lease/timeout 및 insane-search launcher/browser-escape 지적을 모두 수정했다. 최신 파일 재검토 판정: **APPROVE**, blocker/high/medium 없음 (`architectural_status: CLEAR`).

## 판정

**PASS.** 전용 로그인 프로필이 필요한 GPT Image production 전체 실행만 `pending-environment`로 명시하고, 나머지 v0.34.0 발행 조건은 충족했다.
