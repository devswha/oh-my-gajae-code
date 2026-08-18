# 기능 안내

`oh-my-gajae-code`는 스킬 6개와 커맨드 8개(`/omg` 및 `/omg:*` 7개)를 한 번에 설치합니다. 플러그인 관리는 터미널의 `gjc plugin ...` CLI에서만 하며, `gjc` 세션에 `/plugin` 커맨드는 없습니다.

## 공통 전제

`gjc`를 설치하고 필요한 공급자에 로그인합니다. 웹 검색 API 키 등 자격 증명은 프로젝트 `cwd/.env`가 아니라 신뢰할 수 있는 위치에 둡니다. 자세한 환경 설정은 [INSTALLATION.md](../INSTALLATION.md)와 [`.env.example`](../.env.example)를 확인합니다.

이 스위트는 커스텀 모델 프리셋을 더 이상 배포하지 않으며 `models.yml`을 수정하지 않습니다. GJC 내장 프리셋을 사용합니다.

## 스킬

### `adaptive-response`

`/omg:gate` 또는 `/omg:gate-always`로만 명시 적용합니다. 현재 작업과 사용자가 지정한 파일을 바탕으로 설명의 깊이와 승인 게이트 브리핑을 조절하지만, 안전장치·경고·승인 경계를 낮추거나 승인·반려를 대신 실행하지 않습니다. 추론한 페르소나 정보는 저장하지 않으며 홈, 브라우저, 자격 증명, private memory를 탐색하지 않습니다.

`/omg:gate-always`는 사용자 전역 `~/.gjc/agent/SYSTEM.md`의 자체 마커 블록에 재구성 절차만 보존하고, 변경 전 백업하며 마커 밖의 바이트를 보존합니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/adaptive-response/SKILL.md)

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

### `deep-onboarding`

`/omg:deep-onboarding [출력 경로 제안]`은 대상 저장소를 먼저 읽기 전용으로 분석하고, 확인할 수 없는 의도와 운영 맥락을 한 번에 하나씩 질문합니다. 프로젝트 맵, ADR 제안, 인수인계 초안을 미리 보여 준 뒤 사용자가 안전한 출력 디렉터리를 명시적으로 확인해야만 세 Markdown 파일을 작성합니다. 대상 저장소에 조용히 쓰거나 기존 파일을 덮어쓰지 않습니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/deep-onboarding/SKILL.md)

### `multi-harness-research`

`/omg:multi-harness` 또는 명시적인 스킬 호출에서만 실행합니다. 자연어 요청으로 자동 활성화하지 않습니다. 인자가 없으면 GJC 리더가 목표, 질문, 기대 산출물을 먼저 제시하고 확인을 받습니다.

Linux user namespace, 실행 가능한 `bwrap`, 지원되는 정확한 자격 증명 파일 배치, GJC·Codex·Claude의 기존 로그인이 필요합니다. 실행기는 공급자를 설치하거나 로그인하지 않고, 모델·effort·하니스를 대체하거나 fallback하지 않습니다. 현재 Codex OAuth 실응답은 `401 pending-environment`이며 성공으로 간주하지 않습니다.

정규화한 동일 과제를 네 개의 읽기 전용 하니스(`gjc-opus`, `gjc-sol`, `codex-sol`, `claude-ultracode`)에만 전달합니다. 대상과 `.gjc`, 변경 가능한 Git 상태는 격리하며, worker는 대상과 산출물에 쓸 수 없습니다. 산출물은 프로젝트 밖 `${XDG_DATA_HOME:-$HOME/.local/share}/oh-my-gajae-code/multi-harness/` 아래에 권한 `0700`/`0600`으로 보존합니다. 일부 레인이 실패해도 성공한 문서는 남기지만, 다섯째 모델이나 다수결·순위·최종 판정은 만들지 않습니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/multi-harness-research/SKILL.md)

## 커맨드

`/omg`, `/omg:setup`, `/omg:gate`, `/omg:gate-always`, `/omg:no-english`, `/omg:insane-review`, `/omg:deep-onboarding`, `/omg:multi-harness`를 제공합니다. 설치는 [README](../README.md)의 원샷 명령 또는 [INSTALLATION.md](../INSTALLATION.md)를 따릅니다.
