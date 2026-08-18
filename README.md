# oh-my-gajae-code

Gajae Code (`gjc`)에 한국어 우선 표현과 외부 코드 리뷰를 더하는 단일 플러그인 스위트입니다.

## 설치

터미널에서 한 번 실행합니다.

```sh
curl -fsSL https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/install.sh | bash
```

`gjc` 세션에서는 다음 프롬프트를 사용합니다.

```text
Install oh-my-gajae-code by following https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/INSTALLATION.md — run the steps, verify, and report.
```

한 번 설치하면 스킬 3개와 커맨드 4개(`/omg` 및 `/omg:*` 3개)가 모두 설치됩니다. 업그레이드할 때는 원샷 설치 명령을 다시 실행합니다.

설치가 안 되면 저장소를 받은 뒤 같은 설치 프로그램을 실행합니다.

```sh
git clone --depth 1 https://github.com/devswha/oh-my-gajae-code.git oh-my-gajae-code
bash oh-my-gajae-code/install.sh
```

플러그인 관리는 터미널의 `gjc plugin ...` CLI에서만 합니다. `gjc`에는 `/plugin` 슬래시 커맨드가 없습니다.

## 구성

### `no-english`

`/omg:no-english [on|off|status]`로 현재 세션에서만 제어합니다. 일반 한국어 대화나 자연어 언어 요청으로 자동 활성화하지 않습니다. 한국어 응답의 불필요한 영어 혼용을 줄이되 코드 식별자, 명령, 경로, API·프로토콜 이름, 정확한 라벨, 로그, 인용문과 안전 경계는 보존합니다.

### `extragoal`

완료된 변경을 독립적인 교차 세션 GJC 리뷰와 `insane-review`의 AND 게이트로 재검토합니다. 판정 누락, 형식 오류, 시간 초과는 승인으로 처리하지 않으며, 외부로 나가는 검토에서는 시크릿 스캔을 반드시 수행합니다.

### `insane-review`

`/omg:insane-review`는 관련 코드를 repomix로 묶어 로그인된 ChatGPT 웹 세션에 CDP로 전달하고 GPT-5.6 Sol Pro 리뷰를 회수합니다. ChatGPT 구독, chatgpt.com에 로그인한 전용 프로필의 Chromium 계열 브라우저와 CDP `:9222`가 필요하며 로그인은 자동화하지 않습니다.

검증하지 못한 모델, 첨부되지 않은 패킹 파일, 잘린 프롬프트, 시간 초과, 빈 응답에서는 실패로 종료합니다. 결과 파일은 프로젝트 `.insane-review/`에 저장되며 외부 웹 서비스로 코드를 보낼 수 있으므로 개인 구독 용도로만 사용합니다.

커맨드: `/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`

각 기능의 활성 조건, 안전 경계, 전제 조건은 [기능 안내](./docs/capabilities.md)를 확인합니다.

## 전제 조건

- `gjc`를 설치하고 필요한 모델 공급자에 로그인합니다.
- `insane-review`는 ChatGPT 구독과 chatgpt.com에 로그인한 Chromium 계열 브라우저의 CDP `:9222`가 필요합니다.

설치와 환경 설정은 [INSTALLATION.md](./INSTALLATION.md), 상세 기능은 [기능 안내](./docs/capabilities.md), 식별자 변경과 제거 이력은 [마이그레이션 안내](./docs/migrations.md), 삭제된 소스 기록은 [보관 목록](./docs/removed/README.md)을 참고합니다.

## 라이선스

[MIT](./LICENSE)
