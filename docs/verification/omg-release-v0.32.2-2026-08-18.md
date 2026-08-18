# omg v0.32.2 릴리스 검증 (2026-08-18)

후보 커밋: `348b737704f3352365dab45bbf7f26f11a528fa8`
릴리스 범위: `v0.32.1..348b737`

## 수정

루트 README의 `no-english`, `extragoal`, `insane-review`, `ouroboros` 설명을 상세 기능 문서와 동일한 내용으로 복원했다. 설치·커맨드 목록과 상세 문서 링크는 유지했다.

## 검증

- README의 네 스킬 설명이 `docs/capabilities.md` 본문과 정확히 일치함을 검사.
- marketplace/plugin manifest JSON parse 및 버전 `0.32.2` 일치.
- 전체 테스트: **131 pass, 0 fail**, 775 assertions, 10 files.
- 격리 신규 설치: **rc 0**, skills 4, commands 5, registry `0.32.2`.
- `bash -n`과 `git diff --check` 통과.
- gitleaks: 1 commit, 2.38 KB, **no leaks found**.

## 판정

**PASS.** v0.32.2 문서 복원 릴리스 발행 가능.
