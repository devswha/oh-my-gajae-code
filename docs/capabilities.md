# 기능 안내

`oh-my-gajae-code`는 스킬 4개와 커맨드 5개(`/omg` 및 `/omg:*` 4개)를 한 번에 설치합니다. 플러그인 관리는 터미널의 `gjc plugin ...` CLI에서만 하며, `gjc` 세션에 `/plugin` 커맨드는 없습니다.

## 공통 전제

`gjc`를 설치하고 필요한 공급자에 로그인합니다. 웹 검색 API 키 등 자격 증명은 프로젝트 `cwd/.env`가 아니라 신뢰할 수 있는 위치에 둡니다. 자세한 환경 설정은 [INSTALLATION.md](../INSTALLATION.md)와 [`.env.example`](../.env.example)를 확인합니다.

이 스위트는 커스텀 모델 프리셋을 더 이상 배포하지 않으며 `models.yml`을 수정하지 않습니다. GJC 내장 프리셋을 사용합니다.

## 스킬

### `no-english`

`/omg:no-english [on|off|status]`로 현재 세션에서만 제어합니다. 일반 한국어 대화나 자연어 언어 요청으로 자동 활성화하지 않습니다. 한국어 응답의 불필요한 영어 혼용을 줄이되 코드 식별자, 명령, 경로, API·프로토콜 이름, 정확한 라벨, 로그, 인용문과 안전 경계는 보존합니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/no-english/SKILL.md)

### `extragoal`

완료된 변경을 독립적인 교차 세션 GJC 리뷰와 `insane-review`의 AND 게이트로 재검토합니다. 판정 누락, 형식 오류, 시간 초과는 승인으로 처리하지 않으며, 외부로 나가는 검토에서는 시크릿 스캔을 반드시 수행합니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/extragoal/SKILL.md)

### `insane-review`

`/omg:insane-review`는 관련 코드를 repomix로 묶어 로그인된 ChatGPT 웹 세션에 CDP로 전달하고 GPT-5.6 Sol Pro 리뷰를 회수합니다. ChatGPT 구독, chatgpt.com에 로그인한 전용 프로필의 Chromium 계열 브라우저와 CDP `:9222`가 필요하며 로그인은 자동화하지 않습니다.

검증하지 못한 모델, 첨부되지 않은 패킹 파일, 잘린 프롬프트, 시간 초과, 빈 응답에서는 실패로 종료합니다. 결과 파일은 프로젝트 `.insane-review/`에 저장되며 외부 웹 서비스로 코드를 보낼 수 있으므로 개인 구독 용도로만 사용합니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/insane-review/SKILL.md)

### `ouroboros`

외부 upstream `ouroboros-ai` >=0.51.7와 Python >=3.12, `gjc`가 있어야 하는 얇은 명시적 bridge입니다. OMG 설치는 bridge skill·command wrapper만 복사하고 Ouroboros를 설치하거나 갱신하지 않습니다.

`/omg:ouroboros-setup`은 설치와 GJC bridge를 검사한 뒤 native `ouroboros update --check`만 수행합니다. 갱신은 사용자 승인 뒤에만 `ouroboros update --yes --runtime gjc`로 실행합니다. Ouroboros 0.51.7의 GJC dispatcher는 다중 턴 인터뷰 continuation과 Seed client-gate attestation을 전달하지 못하므로 OMG plan wrapper는 제공하지 않습니다. 계획에는 GJC native `deep-interview`/`ralplan`을 사용합니다. bare `ooo ...`는 upstream Ouroboros 명령이며 OMG slash command가 아닙니다.

OMG uninstall은 자체 skill·template만 제거하고 외부 Ouroboros package, `~/.ouroboros`, GJC bridge extension, MCP state, Seeds, runs를 보존합니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/ouroboros/SKILL.md)

## 커맨드

`/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`, `/omg:ouroboros-setup`을 제공합니다. 설치는 [README](../README.md)의 원샷 명령 또는 [INSTALLATION.md](../INSTALLATION.md)를 따릅니다.
