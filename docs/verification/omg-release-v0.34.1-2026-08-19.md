# omg v0.34.1 verification — 2026-08-19

Patch release: insane-review / gpt-image CDP 엔진이 Chrome 136+/145+ 환경에서 전면
불능이던 것을 복구했다. 사용자 보고("매번 크롬에서 로그인해야 함")의 실체는 로그인
만료가 아니라 **엔진의 3중 고장**이었다 — 로그인 세션은 한 번으로 유지되고 있었다.

## 근거 (전부 본 머신 실측, 2026-08-19)

1. **로그인은 유지되고 있었다** — `--check-env`: `STATUS ... browser=ok login=ok
   saved_browser=Chrome` (전용 프로필 `~/.insane-review/browser-profile`, 8/13 생성,
   브라우저 PID 2353886가 `--user-data-dir=…browser-profile --remote-debugging-port=9222`
   로 상시 구동). 매번 로그인이 필요한 구조가 아니다.

2. **고장 1 — CDP↔프로필 바인딩**: Chrome 145.0.7632.45는 `--remote-debugging-port`로
   띄워도 `DevToolsActivePort` 영수증을 user-data-dir에 남기지 않는다(신규 임시
   프로필 + headless/GUI 실구동으로 재현: CDP `/json/version` 응답, 영수증 부재 확인).
   영수증 유일 증명이던 `_cdp_matches_dedicated_profile()`이 매 실행 fail-closed →
   "port 9222의 브라우저가 전용 프로필과 일치하지 않음" → 매번 수동 종료/재기동 댄스.
   v0.34.0 검증 문서에 이미 이 실패가 관측됐었으나 원인 오인(브라우저 불일치로 기록).
   - 수정: **포트 리스너 프로세스 argv 증명**(Linux `/proc/net/tcp{,6}`+`/proc/*/fd`,
     macOS `lsof`, Windows `netstat`+CIM; `--user-data-dir`==전용프로필 +
     `--remote-debugging-port` 일치)을 주 증거로, 영수증은 구버전 Chromium용 보조
     증거로 유지. Chrome 145는 메인 프로세스 cmdline을 공백 결합 단일 문자열로
     재작성한다(NUL 1개) — `shlex` 정규화 추가.
   - `gpt_image_web.py`의 중복 검증은 공유 `cdp_binds_dedicated_profile`로 위임
     (해당 엔진은 subprocess 금지 계약이라 자체 구현 불가).
   - 실측: 라이브 9222에 대해 `True`, 다른 user-data-dir의 headless Chrome 9333에
     대해 `False`, argv 형식(`=`/공백)·포트·프로필 불일치 전부 거부.

3. **고장 2 — 모델/추론단계 선택**: 2026-08 ChatGPT UI에서 (a) 서브메뉴 라디오가
   React 재마운트로 `ElementHandle` 클릭 직전 탈착("Element is not attached to the
   DOM" 재현) + actionability 대기(stable)가 영구 불완료(locator click 8s timeout
   재현), (b) '추론 강도' 라디오 클릭은 전달돼도 조용히 무시됨(aria-checked 불변
   실측), (c) 실제 추론 컨트롤은 메뉴 최상단 '성능' 슬라이더(0..4 =
   즉시/중간/높음/매우 높음/Pro, ArrowRight 구동으로 pill이 'Pro'로 갱신됨을 실측).
   - 수정: `get_by_role` 접근성 매칭 + `force` 클릭, 라디오 선택은 aria-checked 실측
     확인 후 수용, 무시되면 슬라이더 폴백(기존 `_drive_effort_slider`).
   - 실측: `select_model(page,"pro","GPT-5.6 Sol")` → `(True, 'GPT-5.6 Sol (Pro)')`,
     pill `['Pro']`.

4. **고장 3 — 프롬프트 주입**: 메뉴 조작 뒤 포커스가 composer pill에 남아
   `insert_text`가 허공에 떨어짐(activeElement 실측), 잔여 draft가 검증을 오염,
   `clear_composer`가 Linux에서 `Meta+a`(맥 전용, Linux는 Super키)라 전체선택 불가.
   - 수정: put_text가 composer 실제 클릭 후 진입, 입력 전 OS별 select-all
     (Darwin `Meta+a`/그 외 `Control+a`)로 clear+확인, 그 뒤 insert.
   - 실측: 잔여 draft('코드 수정 없이…') → clear → 정확히 프롬프트 입력,
     `composer_has_prompt` True.

## 검증 매트릭스

- `python3 -m py_compile` pack_and_ask.py / gpt_image_web.py — rc 0.
- `bun test`(plugins/oh-my-gajae-code) — **146 pass / 0 fail** (바인딩·메뉴 픽스처
  갱신 포함: 영수증 0644 수용, 리스너 argv 바인딩/거부, role-locator 클릭, 성능
  슬라이더 폴백).
- 라이브 풀레인 ① 프롬프트-only: `--model pro --require-model "GPT-5.6 Sol"` →
  `✓ CDP 브라우저 확인` → `✓ 최종 모델 검증: model=GPT-5.6 Sol, effort=Pro → OK`
  → 응답 `"LANE-OK"` 저장(`response_prompt_20260819_212244_*.md`, mode 0600).
- 라이브 풀레인 ② `--target`(repomix 패킹+파일첨부+모델검증+회수): 팩 ~404 tokens
  첨부 확인 → `GPT-5.6 Sol (Pro)` 응답 `"calc.py defines add(a, b) … (calc.py:1–2)"`
  저장(`response_ir-pack-target_20260819_212525_*.md`).
- `gpt_image_web.py --check-env` — `STATUS playwright=ok cdp=ok profile=ok`
  (v0.34.0에서 이 지점이 fail-closed였음).
- 음성: 다른 프로필 headless Chrome(포트 9333) 바인딩 거부, argv 포트/프로필 불일치
  거부, 영수증 불일치 거부, 증거 전무 시 fail-closed 유지.

## 비고

- v0.34.0 검증 문서의 "receipt 불일치로 fail-closed, 전체 실행 pending-environment"
  기록은 본 릴리스로 해소된다(원인은 Chrome 145의 영수증 미기록).
- 보안계약 불변: 전용 프로필 0700/소유 검증, 루프백 CDP만, 모델 미검증/첨부 미확인/
  잘린 프롬프트/빈 응답 fail-closed, 출력 0600 — 바인딩 증거만 커널 수준 argv로
  확장했을 뿐 완화 없음.

## 독립 리뷰
- 1차(`GJC_NOTIFICATIONS=0 GJC_SDK_DISABLE=1 gjc -p --no-session --model
  openai-codex/gpt-5.6-sol:max`): **REQUEST_CHANGES** — (C) 리스너 탐색이 포트만
  보고 루프백 주소 미검증, (H) 실행파일이 크로미움인지 미검증, (H) 중복 플래그
  임의 값 수용/`~`·상대경로 검증자측 해석, (H) gpt_image 위임으로 프로필 디렉토리
  경성 검증(소유/0700/심볼릭) 상실, (H) 증명 스냅숏 TOCTOU, (M) Windows
  CommandLine을 POSIX shlex로 파싱(백슬래시 오염).
- 수정(전부 반영): Linux `/proc/net/tcp{,6}` 로컬 주소를 `0100007F`/`::1` 정확
  매칭, macOS `lsof -iTCP@127.0.0.1|::1`, Windows netstat `127.0.0.1`/`[::1]`;
  리스너 실행파일(`proc/pid/exe`, `ps comm`, CIM ExecutablePath) 크로미움 계열만
  수용; 플래그는 **마지막 값만** 수용 + 절대경로 문자열만(확장 없음); 공유
  증명이 `_profile_dir_hardened`(소유/0700/심볼릭 없음, 생성 아닌 순수 검증)을
  강제 — gpt_image 위임 경로 복원; 리스너 증명을 최종 단계로 재배치해 TOCTOU 창
  축소(잔여: 동일 사용자 경계, 기존 영수증 설계와 동일); Windows 파싱
  `shlex(posix=False)`+따옴표 제거로 교체.
- 재검증: bun 146/146(신규 음성 케이스: 비(非)크로미움 실행파일, 중복 플래그
  선행/후행, 상대경로, 느슨한 프로필 모드 거부), 라이브 9222 바인딩 True, 타
  프로필 9333 False, `gpt-image --check-env` 통과.
- 2차 재리뷰 판정: REQUEST_CHANGES — (H) `--flag value`/값 없는 중복 등장의
  Chromium 파싱 차이, (H) 리스너 탐색이 127.0.0.1과 ::1을 합치며 fetch/attach
  주소(127.0.0.1)와 불일치 — '::1의 정당 크롬이 IPv4의 다른 프로세스를 증명'
  조합 가능, (M) `/proc/net/tcp6`의 `::1` 인코딩 오타(워드 단위 little-endian),
  (M) `shlex(posix=False)`≠CommandLineToArgvW(공백 포함 경로).
- 2차 수정: 리스너 증명 주소를 fetch/attach 주소인 **127.0.0.1로 한정**(tcp6
  조회 삭제로 인코딩 이슈도 소멸, macOS lsof/Windows netstat 동일), 값 없는
  플래그 등장(후행/'-' 시작 토큰)은 해석 모호로 전체 거부(fail-closed),
  Windows 파서는 부분 파서임을 명시(이상 형태는 절대경로 검증에서 자동 거부).
  재검증: bun 146/146(값 없는 후행/'-' 후속 형태 거부 케이스 추가), 라이브
  바인딩 True, gpt-image --check-env 통과.
- 2026-08-19 저녁 UI 회전(추가): 당일 메뉴가 3회 이상 바뀜 — 'Pro' 라디오가
  'Light…최대/울트라'로, '고급' 토글 행이 사라지고 모델/추론 행 기본 노출 +
  '기본값으로 재설정' 항목 추가, 모든 포인터 기반 라디오 조작(normal/force/좌표)
  무시. 대응: `EFFORT_ALIASES`(pro → pro/최대/울트라/ultra/max 그룹, 검증 전
  지점 후보 수용), 라디오는 접근성 role locator + `dispatch_event('click')`
  (유일하게 동작하는 경로), 모델/추론 행이 이미 보이면 토글 없이 성공, 이미
  목표 조합이면 조작 생략(fast-path, 행 텍스트로만 검증). 실측: fast-path
  통과(GPT-5.6 Sol/최대), Terra로 perturb 후 복구·검증 OK, 프롬프트-only
  풀레인 응답 `LANE-OK-FINAL` 저장. bun 146/146.
- 3차 재리뷰 판정: REQUEST_CHANGES — 주소 한정 수정 **확인**. 신규: (H) argv
  파싱이 Chromium과 불일치(값은 '=' 형태만, 값 없는 등장은 부울, '--' 이후
  파싱 중단 — 공백 형태 수용은 우리 오류), (H) 최종 검증이 행 부재 시
  selected_model/selected_effort(요청값)로 폴백(fail-open), (R) 별칭 그룹 전부에
  슬라이더 max 요구. 전부 수정: '=' 형태만·bare 등장 거부·'--' 중단 반영,
  최종 행 증거 없으면 fail-closed(요청값 폴백 제거), max 요구는 최상위 그룹
  (pro/max/ultra/최대/울트라)만. 재검증: bun 146/146(공백 형태·'--' 이후 거부
  케이스로 교체), 라이브 바인딩 True(실제 argv는 '=' 형태),
  `select_model → (True, 'GPT-5.6 Sol (최대)')`.

