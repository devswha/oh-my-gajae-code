---
description: oh-my-gajae-code 카탈로그 — 한 번의 설치로 들어온 omg 스킬·커맨드를 한눈에 보여준다. omz(oh-my-zsh) 관례의 단일 엔트리. 인자 없이 /omg 만 입력하면 전체 목록.
argument-hint: "(인자 없음 — 전체 카탈로그)"
---

# /omg — oh-my-gajae-code 카탈로그

oh-my-gajae-code 스위트의 단일 진입점(oh-my-zsh의 `omz` 관례 계승). 이 커맨드는 **읽기 전용
안내**다 — 아래 목록을 사용자에게 그대로 정리해 보여주고, 무엇을 쓸지 물어라. 아무것도
설치·실행·변경하지 않는다. **한 번의 설치로 아래가 전부 들어온다.**

## 전체 커맨드 (9)
- `/omg` — 이 카탈로그.
- `/omg:setup` — 셋업(전제조건 확인·상시 토글 안내). 멱등.
- `/omg:gate` (이번 세션) · `/omg:gate-always [on|off|status]` (항상) — 근거 기반 응답 수준 보정 + 승인 게이트 맞춤 브리핑.
- `/omg:no-english [on|off|status]` — 이번 세션의 한국어 우선 표현을 명시적으로 토글.
- `/omg:insane-review` — GPT-5.6 Sol Pro 웹 코드 리뷰. · 전제: ChatGPT 구독 + 크로미움 로그인
- `/omg:deep-onboarding [출력 경로]` — 문서가 부족한 저장소를 분석·인터뷰하고, 경로 재확인 뒤 프로젝트 맵·ADR 제안·인수인계를 생성.
- `/omg:multi-harness "<조사 과제>"` — 명시 전용 동일-과제 읽기 전용 조사: 정확히 `gjc-opus`, `gjc-sol`, `codex-sol`, `claude-ultracode` 네 하니스를 직접 실행. · 전제: Linux+`bwrap`+네 CLI의 기존 로그인+private user runtime binding
- `/omg:ouroboros-setup` — 외부 Ouroboros의 수동 설치·상태·업데이트 안내. OMG는 Ouroboros, MCP, bridge를 번들하지 않으며 설치·업데이트를 자동으로 하지 않는다. · 전제: upstream Ouroboros `0.51.7` 이상 + Python `3.12` 이상

> `insane-review`, `multi-harness`는 필요한 런타임·외부 환경이 없으면 안내하고 안전하게 멈춘다.
> 위의 `/omg:*`가 현재 공개 커맨드 전부다.

## 스킬 (7)
- `adaptive-response`(`/omg:gate*`에서만 명시 호출) · `no-english`(`/omg:no-english`에서만 명시 호출) · `extragoal`(외부 최종 리뷰 게이트) · `insane-review` · `deep-onboarding`(분석·인터뷰 후 확인된 경로에만 문서 생성) · `multi-harness-research`(`/omg:multi-harness`에서만 명시 호출; 프로젝트는 읽기 전용, 결과는 외부 XDG에만 기록) · `ouroboros`(`/omg:ouroboros-setup`에서만 명시 호출; 외부 upstream 소유)

Ouroboros는 OMG 밖에서 설치·소유·업데이트된다. setup/update는 절대 자동이 아니며, 최신 확인은
`ouroboros update --check`로만 한다. 사용자가 승인한 경우에만
`ouroboros update --yes --runtime gjc`를 실행한다. 계획에는 GJC native
`deep-interview`/`ralplan`을 사용한다.

## 문서
- 설치·자세히: 저장소 README. 원샷 설치: `install.sh`(curl 한 줄) / 에이전트용 `INSTALLATION.md`.
- 가재코드 가이드: https://gjc.vibetip.help/ko/docs
