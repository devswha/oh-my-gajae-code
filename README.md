# oh-my-gajae-code

Gajae Code (`gjc`)에 한국어 우선 표현, 외부 코드 리뷰, Ouroboros 연동 안내를 더하는 단일 플러그인 스위트입니다.

## 설치

터미널에서 한 번 실행합니다.

```sh
curl -fsSL https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/install.sh | bash
```

`gjc` 세션에서는 다음 프롬프트를 사용합니다.

```text
Install oh-my-gajae-code by following https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/INSTALLATION.md — run the steps, verify, and report.
```

한 번 설치하면 스킬 4개와 커맨드 5개(`/omg` 및 `/omg:*` 4개)가 모두 설치됩니다. 업그레이드할 때는 원샷 설치 명령을 다시 실행합니다. 이 설치는 Ouroboros 연동 wrapper만 복사하며 Ouroboros를 설치하지 않습니다.

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

### `ouroboros`

Ouroboros는 만들고 싶은 것을 인터뷰로 구체화해 작업 명세(`Seed`)로 만들고, 그 명세를 기준으로 개발 과정을 관리하는 외부 도구입니다. OMG에 포함된 프로그램이 아니므로 별도로 설치해야 합니다.

OMG의 `/omg:ouroboros-setup`은 설치 여부와 버전을 확인하고 GJC 연결을 설정하는 도우미입니다. Ouroboros를 자동으로 설치하거나 갱신하지 않으며, 현재는 인터뷰·계획·구현을 대신 실행하지 않습니다.

사용하려면 Python 3.12 이상, `gjc`, `ouroboros-ai` 0.51.7 이상이 필요합니다. 최신 버전 확인은 `ouroboros update --check`, 사용자가 승인한 갱신은 `ouroboros update --yes --runtime gjc`로 수행합니다. 계획은 GJC 기본 `deep-interview`/`ralplan`을 사용합니다.

OMG를 제거해도 외부 Ouroboros 프로그램과 설정, `Seed`, 실행 기록은 삭제하지 않습니다.

커맨드: `/omg`, `/omg:setup`, `/omg:no-english`, `/omg:insane-review`, `/omg:ouroboros-setup`

각 기능의 활성 조건, 안전 경계, 전제 조건은 [기능 안내](./docs/capabilities.md)를 확인합니다.

## 전제 조건

- `gjc`를 설치하고 필요한 모델 공급자에 로그인합니다.
- `insane-review`는 ChatGPT 구독과 chatgpt.com에 로그인한 Chromium 계열 브라우저의 CDP `:9222`가 필요합니다.
- Ouroboros bridge는 Python >=3.12, `gjc`, 외부 `ouroboros-ai` >=0.51.7이 필요합니다. OMG는 연동 wrapper만 제공하며 설치·업데이트·계획 실행 경계는 [기능 안내](./docs/capabilities.md#ouroboros)를 따릅니다.

설치와 환경 설정은 [INSTALLATION.md](./INSTALLATION.md), 상세 기능은 [기능 안내](./docs/capabilities.md), 식별자 변경과 제거 이력은 [마이그레이션 안내](./docs/migrations.md), 삭제된 소스 기록은 [보관 목록](./docs/removed/README.md)을 참고합니다.

## 라이선스

[MIT](./LICENSE)
