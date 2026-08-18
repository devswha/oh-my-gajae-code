# omg v0.32.4 릴리스 검증 (2026-08-18)

후보 커밋: `c4f72f78c4088e05891b3f0cd824d2772e349f04`
릴리스 범위: `v0.32.3..c4f72f7`

## 수정

Ouroboros 0.51.7과 GJC 0.14.0의 live 연결 실패를 반영했다. `/omg:ouroboros-setup`은 GJC가 필요한 `--mode rpc`를 광고하는지 먼저 검사하고, 없으면 설정 성공을 주장하지 않고 중단한다.

## 실환경 증거

- 외부 Ouroboros 공식 재설치: 성공, 버전 `0.51.7`.
- `ouroboros update --check`: 최신 `0.51.7` 확인.
- `ouroboros setup --runtime gjc --non-interactive`: bridge 파일 설치 확인.
- 현재 GJC: `0.14.0`; `gjc --help`의 mode는 `text`, `json`, `acp`이며 `rpc` 없음.
- 첫 interview dispatch: 실패. `Malformed JSONL from GJC RPC`; GJC의 일반 배너 `Red-claw AI coding assistant`를 JSONL로 해석하다 중단.
- 결론: bridge 파일 설치는 성공했지만 live interview runtime은 호환되지 않음.

## 검증

- 전체 테스트: **132 pass, 0 fail**, 789 assertions.
- RPC 미지원 환경에서 fail-closed하는 skill/template 계약 테스트 추가.
- 격리 신규 설치: **rc 0**, registry `0.32.4`, skills 4, commands 5.
- manifest JSON, `bash -n`, `git diff --check` 통과.
- gitleaks: 1 commit, 6.62 KB, **no leaks found**.

## 판정

**PASS.** 호환되지 않는 Ouroboros 연결을 성공으로 표시하지 않는 v0.32.4 발행 가능. 실제 Ouroboros GJC 연결은 upstream/GJC RPC 계약이 맞을 때까지 pending-environment다.
