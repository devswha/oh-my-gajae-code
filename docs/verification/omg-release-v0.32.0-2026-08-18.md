# omg v0.32.0 릴리스 검증 (2026-08-18)

후보 커밋: `cbc02ea4259e73cc23fef8e35b5f3b1e1dfd1a0e`
릴리스 범위: `v0.31.0..cbc02ea`
제거 커밋: `c798ba9f2f74536f3024712c1da6a7705211b922`

## 변경 범위

- 사용자 직접 요청으로 `adaptive-response`, `deep-onboarding`, `multi-harness-research`를 제거했다.
- 관련 `/omg:gate`, `/omg:gate-always`, `/omg:deep-onboarding`, `/omg:multi-harness`와 multi-harness native runtime 배포를 제거했다.
- 공개 표면은 스킬 4개(`no-english`, `extragoal`, `insane-review`, `ouroboros`)와 커맨드 5개(`/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`, `/omg:ouroboros-setup`)다.
- 삭제 소스 13개를 `docs/removed/`에 v0.31.0 원본 그대로 보관했다.

## 필수 검증

- JSON parse: marketplace/plugin manifest 통과. 버전 `0.32.0` 일치.
- 구문 검사:
  - `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh plugins/oh-my-gajae-code/bin/omg-autoupdate.sh` 통과.
  - `python3 -m py_compile plugins/oh-my-gajae-code/bin/pack_and_ask.py` 통과.
- 전체 테스트: `bun test plugins/oh-my-gajae-code/test` → **131 pass, 0 fail**, 773 assertions, 10 files.
- 신규 설치 재현: 격리된 HOME/XDG에서 `GJC_NOTIFICATIONS=0 GJC_SDK_DISABLE=1 bash install.sh --candidate-ref "$PWD"` → **rc 0**.
  - native skills: 4
  - native commands: 5
  - registry version: `0.32.0`
  - 제거된 세 skill, 네 command, multi-harness runtime 부재
- 삭제 아카이브: 13개 파일을 `v0.31.0` 원본과 SHA-256 비교하여 전부 일치. 아카이브 mode `0644`.
- 현재 PC native 설치: 제거된 세 skill, 네 command, multi-harness runtime 및 `gate-always` marker 부재 확인.
- `git diff --check` 통과.
- gitleaks: `gitleaks git --redact --log-opts="origin/main..HEAD" --no-banner` → 2 commits, 64.40 KB, **no leaks found**.

## 정리 안전성

- upgrade cleanup은 명시된 suite-owned native 파일만 제거한다.
- multi-harness runtime은 소유권·권한·binding marker를 검증한 `binding`과 `runner.mjs`만 삭제하고, 알 수 없는 child는 보존한다.
- 정상 `gate-always` marker는 백업 뒤 제거하며 마커 밖 바이트와 마지막 줄바꿈 상태를 보존한다. 손상·중복·중첩 marker는 수정하지 않는다.
- XDG 연구 산출물, credentials, auth/config, `models.yml`, Ouroboros 외부 상태와 무관한 사용자 파일을 보존한다.

## 독립 리뷰

- 1차 리뷰가 runtime 디렉터리 재귀 삭제와 marker 외부 마지막 줄바꿈 변경 가능성을 지적했다.
- 소유 파일만 삭제하고 빈 디렉터리만 `rmdir`하도록 수정했으며, Node 기반 raw-line 보존 제거기로 교체했다.
- 최종 재검토: **APPROVE**, blocker/high/medium finding 없음.

## 판정

**PASS.** main 병합, `v0.32.0` 태그 및 GitHub Release 발행 가능.
