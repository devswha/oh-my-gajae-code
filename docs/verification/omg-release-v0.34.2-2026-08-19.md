# omg v0.34.2 verification — 2026-08-19

후속 패치: v0.34.1 1차 크로스리뷰(artifact 전문)에서 확인이 늦은 2건 + 경성 잔여 1건.

## 배경

v0.34.1 출시 당시 1차 크로스리뷰 verdict 파일 꼬리(5건)만 반영했고, 전문의
6번 지적과 5번 세부(fail-open 슬랙)는 뒤늦게 확인됨. 본 패치는 그 직접 구현이다.

## 변경

1. **컴포저 fail-open 제거(지적 #5)** — `clear_composer`가 '비었음'을 읽어 확인한
   뒤에만 True(3회 재시도), `put_text`는 클리어 미확인 시 `RuntimeError`로 중단.
   `composer_has_prompt`는 정규화 후 **정확 동일성**만 통과 — 기존 1.5배(+20자)
   여유 슬랙은 짧은 잔여 draft가 긴 프롬프트 앞에 붙어 통과·전송되는 구멍이었음.
2. **라디오 선택 서브메뉴 닫힘 대응(지적 #6)** — 성공 선택이 서브메뉴를 닫아
   라디오가 사라진 UI에서 기존 checked 검증이 거짓 거부되던 것을, 메뉴 재오픈 후
   **상위 '추론' 행 값**(`_effort_row_shows`)으로도 검증하도록 보강.
3. **영수증 O_NOFOLLOW 읽기(지적 #2 잔여)** — `lstat→read_text` 경합(심볼릭링크
   스왑)을 `os.open(O_NOFOLLOW)`+`fstat`+동일 fd 읽기로 제거.

## 검증

- `py_compile` rc 0. `bun test` **146 pass / 0 fail**.
- 라이브 풀레인(프롬프트-only): `✓ 이미 목표 조합(GPT-5.6 Sol/최대)` → 전송 →
  응답 `LANE-OK-342` 저장 — **정확 동일성 검증이 정상 실행을 깨지 않음** 실증.
- 음성(드래프트 오염): '감초 잔여 드래프트…'를 시드 후 `put_text("REAL PROMPT ONLY")`
  → 컴포저에 잔여 없이 정확히 교체, `composer_has_prompt` True, '감초' 미포함.
- 라이브 바인딩(영수증 O_NOFOLLOW 경로 포함 간접): `--check-env`류 경로 유지.

## 크로스리뷰

- 생략(문서화): 본 변경은 1차 리뷰(gpt-5.6-sol:max) 지적 #5/#6/#2-잔여의 직접
  구현이며 전부 **강화 방향**(완화 없음). 릴리스 규칙상 크로스리뷰는 blocking이
  아니므로 생략하고 근거를 여기에 기록한다.

## 릴리스 확정 (2026-08-19)

- gitleaks `v0.34.1..dev`: 1커밋 스캔, 누출 없음.
- 격리 HOME 신규 설치 — **rc 0, installed version 0.34.2**(캐노니컬 원격).
- 태그 `v0.34.2`(main 424015d), GitHub Release 게시.
