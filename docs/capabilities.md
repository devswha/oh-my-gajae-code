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

Ouroboros는 만들고 싶은 것을 인터뷰로 구체화해 작업 명세(`Seed`)로 만들고, 그 명세를 기준으로 개발 과정을 관리하는 외부 도구입니다. OMG에 포함된 프로그램이 아니므로 별도로 설치해야 합니다.

OMG의 `/omg:ouroboros-setup`은 설치 여부, 버전, GJC 연결 호환성을 확인하는 도우미입니다. Ouroboros를 자동으로 설치하거나 갱신하지 않으며, 현재는 인터뷰·계획·구현을 대신 실행하지 않습니다.

사용하려면 Python 3.12 이상, `ouroboros-ai` 0.51.7 이상과 `--mode rpc`를 지원하는 GJC가 필요합니다. 현재 확인한 GJC 0.14.0에는 이 모드가 없어 Ouroboros 인터뷰가 실패합니다. 따라서 지금은 연결을 정상 작동한다고 볼 수 없으며, `/omg:ouroboros-setup`도 호환되지 않는 환경으로 보고 멈춥니다. 계획은 GJC 기본 `deep-interview`/`ralplan`을 사용합니다.

OMG를 제거해도 외부 Ouroboros 프로그램과 설정, `Seed`, 실행 기록은 삭제하지 않습니다.

원문: [`SKILL.md`](../plugins/oh-my-gajae-code/skills/ouroboros/SKILL.md)

## 커맨드

`/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`, `/omg:ouroboros-setup`을 제공합니다. 설치는 [README](../README.md)의 원샷 명령 또는 [INSTALLATION.md](../INSTALLATION.md)를 따릅니다.
