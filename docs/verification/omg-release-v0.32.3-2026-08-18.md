# omg v0.32.3 릴리스 검증 (2026-08-18)

후보 커밋: `081efe9e066d2a46c84fb90a220f38911d880b75`
릴리스 범위: `v0.32.2..081efe9`

## 수정

README와 기능 문서의 Ouroboros 설명을 쉬운 표현으로 바꿨다. Ouroboros의 역할, OMG가 제공하는 범위가 설정 도우미뿐이라는 점, 필요한 버전과 업데이트 경계를 분리해 설명한다.

## 검증

- README와 `docs/capabilities.md`의 Ouroboros 설명 일치.
- marketplace/plugin manifest 버전 `0.32.3` 일치.
- 전체 테스트: **131 pass, 0 fail**, 775 assertions.
- 격리 신규 설치: **rc 0**, registry `0.32.3`, skills 4, commands 5.
- `git diff --check` 통과.
- gitleaks: 1 commit, 1.95 KB, **no leaks found**.

## 실환경 상태

현재 PC의 외부 Ouroboros는 `0.33.0`이며 `ouroboros update` 명령이 없다. OMG wrapper의 설치·fail-closed 경로는 검증됐지만, 요구 버전 `0.51.7` 이상의 live GJC setup은 아직 실행하지 않았다.

## 판정

**PASS.** 문서 수정 릴리스 가능. 현재 PC의 Ouroboros live 연결은 외부 도구 업그레이드 전까지 pending-environment다.
