# omg v0.30.0 릴리스 검증 (2026-08-18)

후보 커밋: `a26195f9d098f954b5cc89c68ef885107b7a97d3`
릴리스 범위: `origin/main..a26195f`

## 변경 범위

- `insane-review`의 GPT-5.6 Sol/Pro 선택을 현재 고급 메뉴와 effort slider에 맞게 보강하고, 전용 브라우저 프로필·CDP 소유권 검증을 강화했다.
- 거절 페이지와 프롬프트 echo를 성공 응답으로 저장하지 않으며, 새 응답 파일을 배타적으로 생성하고 권한 `0600`을 강제한다.
- `extragoal` 외부 리뷰어를 격리된 `openai-codex/gpt-5.6-sol:max` 원샷으로 갱신했다.
- portable lock과 macOS 경로 fixture를 보강하고 multi-harness 통합 테스트의 비현실적인 시간 제한을 안정화했다.
- 루트 README를 간소화하고 상세 기능·마이그레이션 내용을 `docs/`로 분리했다.

## 필수 검증

- JSON parse: `.claude-plugin/marketplace.json`, `plugins/oh-my-gajae-code/.claude-plugin/plugin.json` 통과. 버전 `0.30.0` 일치.
- 구문 검사:
  - `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh plugins/oh-my-gajae-code/bin/omg-autoupdate.sh` 통과.
  - `python3 -m py_compile plugins/oh-my-gajae-code/bin/pack_and_ask.py` 통과.
  - `node --check plugins/oh-my-gajae-code/bin/multi-harness-research.mjs` 통과.
- 전체 테스트: `bun test plugins/oh-my-gajae-code/test` → **172 pass, 0 fail**, 1,361 assertions, 13 files.
- 신규 설치 재현: 격리된 HOME/XDG에서 `bash install.sh --candidate-ref "$PWD"` → **rc 0**.
  - native commands: 8
  - native skills: 6
  - registry version: `0.30.0`
  - 제거된 `preset-pack` 없음.
- 문서 상대 링크 검사: `README.md`, `docs/capabilities.md`, `docs/migrations.md` 모두 통과.
- gitleaks: `gitleaks git --redact --log-opts="origin/main..HEAD" --no-banner` → 10 commits, 51.53 KB, **no leaks found**.

## 독립 리뷰

- PR #26의 브라우저 소유권, 모델 selector, 세션 격리, 테스트 누락 지적을 수정한 뒤 병합했다.
- sol-lane 선택 이식 리뷰에서 발견한 slider 오검증, 과도한 응답 차단, 파일 descriptor 정리, `--delete-pack` 순서 문제를 수정했다.
- `drive`, `serve`, 외부 sol-lane CLI와 전체 vendoring은 도입하지 않았다. 새 공개 스킬·커맨드·provider는 없다.

## 환경 제한

- 로그인된 ChatGPT Pro CDP 세션이 필요한 최종 웹 UI 실호출은 이번 릴리스 검증 환경에서 다시 실행하지 못했다. 모델·radio/slider·소유권·응답 차단 경로는 브라우저 없는 focused fixture로 검증했다.
- multi-harness 네 공급자 live 성공은 Codex OAuth `401 pending-environment` 상태라 미완료다. fixture 기반 격리·fail-closed 테스트는 통과했다.

## 판정

**PASS.** main 병합, `v0.30.0` 태그 및 GitHub Release 발행 가능.
