# omg v0.34.3 verification — 2026-08-19

기능 릴리스: insane-review 실행 중 Chrome(웹 세션)에서 일어나는 일을 **gjc 세션에
실시간 중계**한다. 종전엔 포그라운드 bash가 끝나야 로그가 한 번에 보였다.

## 변경

1. **`--stream` 플래그** — 응답 대기 루프에서 생성 중인 assistant 텍스트를 stdout에
   증분 출력(`── 실시간 응답(생성 중) ──` 헤더 뒤 delta, `flush=True`). 재렌더로
   접두가 바뀌면 조용히 재동기화(중복 출력 방지). 완료 판정 로직은 불변(중계 전용).
2. **stdout/stderr 라인 버퍼링** — 파이프/리다이렉트에서도 진행 로그가 즉시
   흘러가게 `reconfigure(line_buffering=True)`.
3. **실행 패턴 문서화** — SKILL §3.2와 `/omg:insane-review` Step 3을 "백그라운드
   실행(`python3 -u … --stream > .insane-review/live.log 2>&1 &`) + 15~30s 로그
   폴링 증분 중계 + `[완료]` 후 회수" 패턴으로 교체.
4. **(수반 수정) 스위처 하이드레이션 플레이크** — 컴포저 pill이 하이드레이션 중
   `aria-haspopup`이 늦게 붙어 `_open_switcher`만 빗나가는 실측 원인(당일
   "시도 1 실패→재시도 성공" 패턴의 정체)을 광범위 폴백 셀렉터(`button.__composer-pill`)
   + 4회 재시도로 제거.

## 검증

- `py_compile` rc 0. `bun test` **147 pass / 0 fail**(신규 스트림 계약 테스트:
  `--stream` 플래그·라인 버퍼링·증분 헤더·호출 전달·SKILL/커맨드 패턴 문서화).
- 라이브(백그라운드+로그 폴링 재현): 시도 1 통과(하이드레이션 수정), t≈40s 시점
  로그에 진행 라인·`── 실시간 응답 ──`·생성 중 바다 문장 증분 확인, 28s 응답
  수신·`response_prompt_20260819_232616_*.md` 저장(0600), 미리보기 전문 일치.
- 스트리밍은 완료 판정에 무관함을 확인(검증·fail-closed 경로 동일).

## 크로스리뷰

- 생략(문서화): stdout 중계 추가 + 셀렉터 재시도 강화뿐으로 검증/보안 표면 변화
  없음(회수·판정 코드 불변). 증거는 위 라이브 실행.

## 릴리스 확정

- gitleaks `v0.34.2..dev`: 1커밋, 누출 없음.
- 격리 HOME 신규 설치 — rc 0, installed version 0.34.3(캐노니컬 원격).
- 태그 `v0.34.3`(main c691874), GitHub Release 게시.
