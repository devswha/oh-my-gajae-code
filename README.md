# oh-my-gajae-code

Gajae Code (`gjc`)에 명시적 안전 게이트와 심층 조사를 더하는 단일 플러그인 스위트입니다.

## 설치

터미널에서 한 번 실행합니다.

```sh
curl -fsSL https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/install.sh | bash
```

`gjc` 세션에서는 다음 프롬프트를 사용합니다.

```text
Install oh-my-gajae-code by following https://raw.githubusercontent.com/devswha/oh-my-gajae-code/main/INSTALLATION.md — run the steps, verify, and report.
```

한 번 설치하면 스킬 6개와 커맨드 8개(`/omg` 및 `/omg:*` 7개)가 모두 설치됩니다. 업그레이드할 때는 원샷 설치 명령을 다시 실행합니다.

설치가 안 되면 저장소를 받은 뒤 같은 설치 프로그램을 실행합니다.

```sh
git clone --depth 1 https://github.com/devswha/oh-my-gajae-code.git oh-my-gajae-code
bash oh-my-gajae-code/install.sh
```

플러그인 관리는 터미널의 `gjc plugin ...` CLI에서만 합니다. `gjc`에는 `/plugin` 슬래시 커맨드가 없습니다.

## 구성

스킬: `adaptive-response`, `no-english`, `extragoal`, `insane-review`, `deep-onboarding`, `multi-harness-research`

커맨드: `/omg`, `/omg:setup`, `/omg:gate`, `/omg:gate-always`, `/omg:no-english`, `/omg:insane-review`, `/omg:deep-onboarding`, `/omg:multi-harness`

각 기능의 활성 조건, 안전 경계, 전제 조건은 [기능 안내](./docs/capabilities.md)를 확인합니다.

## 전제 조건

- `gjc`를 설치하고 필요한 모델 공급자에 로그인합니다.
- `insane-review`는 ChatGPT 구독과 chatgpt.com에 로그인한 Chromium 계열 브라우저의 CDP `:9222`가 필요합니다.
- `multi-harness-research`는 Linux, `bwrap`, 지원되는 자격 증명 파일 배치, 네 공급자의 기존 로그인이 필요합니다.

설치와 환경 설정은 [INSTALLATION.md](./INSTALLATION.md), 상세 기능은 [기능 안내](./docs/capabilities.md), 식별자 변경과 제거 이력은 [마이그레이션 안내](./docs/migrations.md), 삭제된 소스 기록은 [보관 목록](./docs/removed/README.md)을 참고합니다.

## 라이선스

[MIT](./LICENSE)
