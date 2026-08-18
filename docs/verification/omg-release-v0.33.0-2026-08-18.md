# omg v0.33.0 릴리스 검증 (2026-08-18)

후보 커밋: `61bb1ed936b6f9d199164f58374d5af5c4ec7973`
제거 커밋: `4dc72c8`
릴리스 범위: `v0.32.4..61bb1ed`

## 변경

사용자 직접 요청으로 OMG의 `ouroboros` wrapper skill과 `/omg:ouroboros-setup` command를 제거했다. 외부 upstream Ouroboros 0.51.7 package, `~/.ouroboros`, marketplace/plugin, GJC extension/MCP state, Seeds, runs, auth/config는 OMG 소유가 아니므로 보존한다.

현재 표면:

- skills: `no-english`, `extragoal`, `insane-review`
- commands: `/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`

## 검증

- manifest JSON parse 및 버전 `0.33.0` 일치.
- `bash -n install.sh plugins/oh-my-gajae-code/bin/install-skill.sh` 통과.
- 전체 테스트: **123 pass, 0 fail**, 732 assertions, 9 files.
- 격리 신규 설치: **rc 0**, skills 3, commands 4, registry `0.33.0`; removed wrapper 부재.
- 현재 PC native OMG wrapper skill/command 제거 확인.
- 외부 Ouroboros preservation sentinels가 user/project cleanup 뒤 byte-identical함을 테스트.
- 삭제 아카이브 3개 파일이 v0.32.4 원본과 정확히 일치하고 mode `0644`.
- 독립 리뷰: **APPROVE**, blocker/high/medium 없음.
- `git diff --check` 통과.
- gitleaks: 2 commits, 9.16 KB, **no leaks found**.

## 판정

**PASS.** v0.33.0 발행 가능.
