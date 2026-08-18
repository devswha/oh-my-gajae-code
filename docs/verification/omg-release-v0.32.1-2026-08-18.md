# omg v0.32.1 릴리스 검증 (2026-08-18)

후보 커밋: `2888ee6954d5e15e7517b67c67207b61041f94ac`
릴리스 범위: `v0.32.0..2888ee6`

## 수정

v0.32.0 설치 완료 안내에 남아 있던 제거된 `gate always-on` 설명을 삭제했다. `/omg:setup`은 읽기 전용 전제조건 확인만 안내한다.

## 검증

- marketplace/plugin manifest JSON parse 및 버전 `0.32.1` 일치.
- `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh` 통과.
- 전체 테스트: **131 pass, 0 fail**, 775 assertions, 10 files.
- 격리 신규 설치: **rc 0**, skills 4, commands 5, registry `0.32.1`.
- 설치 출력에 `(Optional: /omg:setup checks prerequisites.)`가 있고 `gate always-on`이 없음을 테스트로 고정.
- `git diff --check` 통과.
- gitleaks: 1 commit, 377 bytes, **no leaks found**.

## 판정

**PASS.** v0.32.0의 제거 동작은 그대로 유지하며 v0.32.1 fix-forward 발행 가능.
