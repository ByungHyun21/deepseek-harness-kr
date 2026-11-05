// LOCAL PATCH: DeepSeek짱 — Harness 화면에 밝은 파스텔 테마와 Live2D 캐릭터(상반신)를 띄우고,
// 지금 열린 대화의 Harness 작업 상태(작업 중 / 도구 / 승인·질문 대기 / 완료 / 실패)에 반응한다.
// 바깥 신호는 받지 않는다(포트 없음). 제거: dist/index.html의 dsc 두 줄을 지우면 된다.
(() => {
  const BASE = new URL("./", document.currentScript.src).href;   // dsh-app://app/assets/dsc/
  const TEXT = {
    hello: "안녕하세요, 주인님! 오늘은… 저랑 뭐 해 볼까요?",
    start: "알겠어요! …잘 부탁드려요, 주인님",
    approval: "확인이 필요해요! …이거, 저 대신 눌러 주실 거죠?",
    question: "여쭤볼 게 있어요! …잠깐만 저만 봐 주세요",
    done: "다 했어요! …칭찬해 주실 거죠?",
    error: "앗, 문제가 생겼어요… …한 번만 더 봐 주세요",
  };
  // 도구 줄 제목(한국어 UI) → 말풍선
  const TOOLS = {
    "명령 실행": "명령 실행 중…", "코드": "코드 돌리는 중…", "읽기": "파일 읽는 중…", "이미지 읽기": "그림 보는 중…",
    "편집": "코드 고치는 중…", "쓰기": "파일 쓰는 중…", "검색": "찾아보는 중…", "파일 내용 검색": "찾아보는 중…",
    "파일 찾기": "파일 찾는 중…", "웹 검색": "검색하는 중…", "웹페이지 가져오기": "웹페이지 보는 중…",
    "하위 에이전트 만들기": "도우미 부르는 중…", "팀원 만들기": "도우미 부르는 중…", "워크플로 실행": "워크플로 돌리는 중…",
    // 영어 화면
    "Bash": "명령 실행 중…", "Pwsh": "명령 실행 중…", "Code": "코드 돌리는 중…", "Read": "파일 읽는 중…", "Read image": "그림 보는 중…",
    "Edit": "코드 고치는 중…", "Write": "파일 쓰는 중…", "Search": "찾아보는 중…", "Grep": "찾아보는 중…", "Glob": "파일 찾는 중…",
    "Fetch": "웹페이지 보는 중…", "Create subagent": "도우미 부르는 중…", "Create teammate": "도우미 부르는 중…", "Run workflow": "워크플로 돌리는 중…",
  };
  // Harness 화면 문구 (한국어 화면 / 영어 화면)
  const UI = {
    stop: 'button[aria-label="생성 중지"], button[aria-label="Stop generating"]',
    send: 'button[aria-label="메시지 보내기"], button[aria-label="Send message"]',
    approval: '[aria-label="승인 상세"], [aria-label="Approval details"]',
    turnError: ["이번 턴 실행 실패", "This turn failed"],
  };

  const ready = (fn) => (document.body ? fn() : addEventListener("DOMContentLoaded", fn, { once: true }));
  ready(() => {
    // ---------- 밝은 모드 고정 + 테마용 표시 ----------
    let tagQueued = false;
    const tag = () => {
      tagQueued = false;
      document.querySelectorAll('[class*="_card"]').forEach((e) => {
        if (!e.classList.contains("dsc-composer") && e.closest('[class*="_root"]') && e.querySelector('[class*="_input"]')) e.classList.add("dsc-composer");
      });
      document.querySelectorAll(UI.send.split(", ").map((s) => s + ":not(.dsc-send)").join(", ")).forEach((e) => e.classList.add("dsc-send"));
      document.querySelectorAll('button[class*="_newSession"]:not(.dsc-newsession)').forEach((e) => e.classList.add("dsc-newsession"));
    };
    tag();

    // ---------- 상태 감시 ----------
    let running = false, lastError = -1e9, lastToolSay = 0, waitingKind = null;
    const listeners = { tool: null };
    const scanAdded = (node) => {
      if (node.nodeType !== 1) return;
      const t = node.textContent || "";
      if (t.length < 400 && UI.turnError.some((w) => t.includes(w))) lastError = performance.now();
      if (running && listeners.tool && t.length < 200) {
        const leaves = node.children.length === 0 ? [node] : node.querySelectorAll("span, div");
        for (const el of leaves) {
          if (el.children.length) continue;
          const s = (el.textContent || "").trim();
          if (TOOLS[s]) { listeners.tool(TOOLS[s]); break; }
        }
      }
    };
    new MutationObserver((records) => {
      if (!tagQueued) { tagQueued = true; requestAnimationFrame(tag); }
      for (const r of records) for (const n of r.addedNodes) scanAdded(n);
    }).observe(document.body, { childList: true, subtree: true });

    // ---------- Live2D ----------
    const load = (src) => new Promise((ok, no) => {
      const s = document.createElement("script"); s.src = BASE + src; s.onload = ok; s.onerror = () => no(new Error(src));
      document.head.appendChild(s);
    });
    (async () => {
      if (!window.Live2DCubismCore) await load("vendor/live2dcubismcore.min.js");
      if (!window.PIXI) await load("vendor/pixi.min.js");
      if (!window.PIXI.live2d) await load("vendor/cubism4.patched.js");

      const W = 300, H = 300;
      const canvas = document.createElement("canvas"); canvas.id = "dsc-stage";
      const bubble = document.createElement("div"); bubble.id = "dsc-bubble";
      document.body.append(canvas, bubble);
      const app = new PIXI.Application({ view: canvas, width: W, height: H, sharedTicker: false, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: (devicePixelRatio || 1) * 1.5 });   // 1.5배로 그려 줄여 보여 줌
      const model = await PIXI.live2d.Live2DModel.from(BASE + "model/model.model3.json", { autoUpdate: false, autoInteract: false, idleMotionGroup: "Idle" });
      app.stage.addChild(model);
      // 전용 티커로 모델도 갱신하고 긴 프레임은 제한
      app.ticker.add(() => model.update(Math.min(app.ticker.deltaMS, 100)), undefined, PIXI.UPDATE_PRIORITY.HIGH);
      const im = model.internalModel, core = im.coreModel;
      im.eyeBlink = undefined; im.breath = undefined;
      const CHEST_DRAG_SIGN = 1;   // 화면에서 확인 후 -1로 바꿀 수 있음
      const dragLift = { x: 0, v: 0 };    // 위아래로 끌어올린 정도 (0~1)
      const dragShift = { x: 0, v: 0 };   // 좌우로 끌어당긴 정도 (-1~1)
      let chestFrom = null, chestDragging = false, chestTarget = 0, chestShiftTarget = 0;
      let chestLongTimer = 0;   // 3초 넘게 '흔들었을' 때 자극적인 대사로 넘어가는 감시 타이머
      const chestShake = { x: 0, y: 0, acc: 0, last: 0, next: 0 };   // acc = 흔든 양, last = 마지막으로 흔든 시각
      if (im.physics) {
        const evaluate = im.physics.evaluate;
        const param = (id) => {
          const i = core.getParameterIndex(id);
          if (i < 0) return null;
          const min = core.getParameterMinimumValue(i), max = core.getParameterMaximumValue(i);
          return Number.isFinite(min) && Number.isFinite(max) ? { id, min, max } : null;
        };
        const chestParams = ["ChestY1", "ChestY2", "ChestY3", "ChestY4"].map(param).filter(Boolean);   // 위아래
        const chestXParams = ["ChestX1", "ChestX2", "ChestX3"].map(param).filter(Boolean);              // 좌우
        im.physics.evaluate = function (...args) {
          const result = evaluate.apply(this, args);
          // 물리가 덮어쓴 뒤 가슴에만 더함 (파라미터 범위를 꽉 쓰고, 좌우는 방향 따라)
          const lift = dragLift.x * CHEST_DRAG_SIGN, shift = dragShift.x * CHEST_DRAG_SIGN;
          if (lift) for (const p of chestParams) core.addParameterValueById(p.id, lift * (lift > 0 ? p.max : -p.min));
          if (shift) for (const p of chestXParams) core.addParameterValueById(p.id, shift * (shift > 0 ? p.max : -p.min) * 0.9);
          return result;
        };
      }

      // 창 안 캐릭터는 상반신(머리 ~ 허리)만 캔버스에 담고 아래는 잘린다.
      // 바깥 펫 창(PET)은 다리·신발까지 전신이 보이도록 모델 전체를 캔버스에 맞춘다.
      const WHOLE_BODY = !!window.__dscPetMode;
      core.update();
      const cm = core.getModel();
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const each = (fn) => {
        for (let i = 0; i < cm.drawables.count; i++) {
          if (cm.drawables.opacities[i] < 0.01) continue;
          const v = im.getDrawableVertices(i);
          for (let k = 0; k < v.length; k += 2) fn(v[k], v[k + 1]);
        }
      };
      each((x, y) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
      const cutY = minY + (maxY - minY) * 0.47;
      let ux0 = Infinity, ux1 = -Infinity;
      each((x, y) => { if (y < cutY) { ux0 = Math.min(ux0, x); ux1 = Math.max(ux1, x); } });
      // 창 안(상반신 크롭) 배율. 펫 창은 전신을 담아 이보다 작게 그려지므로, 이 값과의 비율만큼 배율을 올려 머리 크기를 맞춘다
      const sBust = Math.min((W * 0.98) / (ux1 - ux0), (H * 0.95) / (cutY - minY));
      // 펫 창(전신) 배율과, 창 안↔펫 창의 머리 크기 비율 (붙을 때·넘길 때 같은 비율을 쓴다)
      const sFull = Math.min((W * 0.98) / (maxX - minX), (H * 0.95) / (maxY - minY));
      const PET_HEAD_RATIO = sBust / sFull;
      // 펫 창 배율 범위. 상한은 '화면에 들어가는 만큼'뿐이고, 창 크기는 캐릭터에 맞춰 스스로 바뀐다 (pet/main.cjs 의 fit)
      const PET_K_MIN = 0.45, PET_BUBBLE = 150;
      const PET_K_MAX = Math.max(1.2, ((typeof screen !== "undefined" && screen.availHeight ? screen.availHeight : 1080) - PET_BUBBLE) / H);
      // 허리(잘린 단면) 기준 정렬용 값. 펫 창과 창 안은 배율이 달라 캔버스 안 허리 높이도 다르다
      const BUST_CX = (ux0 + ux1) / 2, FULL_CX = (minX + maxX) / 2;   // 모델 좌표에서 상반신·전신의 가로 중심
      const WAIST_PET = H * 0.05 + (cutY - minY) * sFull;   // 펫 창 캔버스(k=1)에서 허리 y
      const WAIST_WIN = H * 0.05 + (cutY - minY) * sBust;   // 창 안 캔버스(k=1)에서 허리 y
      const WAIST_PCT = WAIST_PET / H * 100;                // 하반신 페이드를 시작할 높이(%)
      // 펫 창(전신): 모델 전체의 가로·세로를 캔버스에 맞추고 몸 가운데를 캔버스 가운데에 둔다
      const bw = WHOLE_BODY ? maxX - minX : ux1 - ux0;
      const bh = WHOLE_BODY ? maxY - minY : cutY - minY;
      const s = WHOLE_BODY ? sFull : sBust;
      // 화면상 크기는 모델 배율 × 캔버스 배율(k). HEAD_GAIN을 곱하면 펫 창의 머리 크기가 창 안과 같아진다
      const HEAD_GAIN = sBust / s;
      model.scale.set(s);
      model.x = W / 2 - ((WHOLE_BODY ? minX : ux0) + bw / 2) * s;
      model.y = H * 0.05 - minY * s;
      // 꼬마 모습(체형 2)은 몸 전체가 작아져 공중에 뜨므로, 그만큼 내려서 발이 화면 바닥에 닿게 한다 (데스크톱 펫과 같음)
      core.setParameterValueById("Clothes2", 1); core.update();
      let chibiMinY = Infinity, chibiMaxY = -Infinity;
      each((x, y) => { chibiMinY = Math.min(chibiMinY, y); chibiMaxY = Math.max(chibiMaxY, y); });
      core.setParameterValueById("Clothes2", 0); core.update();
      const baseY = model.y;
      const chibiDrop = Math.max(0, H * 0.99 - chibiMaxY * s - baseY);   // 꼬마일 때 내리는 거리 (캔버스 px)
      const chibiHeadDrop = (chibiMinY - minY) * s + chibiDrop;            // 꼬마일 때 머리 꼭대기가 내려가는 거리 (말풍선 위치용)
      // ---------- Core 계산을 Worker로 (결과는 1프레임 늦게 반영) ----------
      // 정점 변형(Core update)은 Worker의 같은 모델이 맡고, 메인은 받은 결과를 Core 배열에 복사만 한다.
      // 렌더러·터치 판정은 그대로 Core 배열을 읽는다. Worker를 못 쓰거나 실패하면 원래대로 메인에서 계산.
      (() => {
        const d = cm.drawables, N = d.count, localUpdate = () => Object.getPrototypeOf(cm).update.call(cm);
        let w;
        try { w = new Worker(BASE + "dsc-core-worker.js"); } catch { return; }
        let lo = Infinity, hi = 0;
        for (let i = 0; i < N; i++) { const a = d.vertexPositions[i]; lo = Math.min(lo, a.byteOffset); hi = Math.max(hi, a.byteOffset + a.byteLength); }
        const offs = Array.from(d.vertexPositions, (a) => a.byteOffset - lo).join();
        const vBytes = new Uint8Array(d.vertexPositions[0].buffer, lo, hi - lo);
        let ready = false, busy = false, result = null, spare = null;
        const stop = () => { ready = false; delete cm.update; try { w.terminate(); } catch {} };
        const apply = (buf) => {
          const u8 = new Uint8Array(buf); let o = 0;
          vBytes.set(u8.subarray(0, vBytes.length)); o += vBytes.length;
          d.opacities.set(new Float32Array(buf, o, N)); o += N * 4;
          d.drawOrders.set(new Int32Array(buf, o, N)); o += N * 4;
          d.renderOrders.set(new Int32Array(buf, o, N)); o += N * 4;
          d.multiplyColors.set(new Float32Array(buf, o, N * 4)); o += N * 16;
          d.screenColors.set(new Float32Array(buf, o, N * 4)); o += N * 16;
          d.dynamicFlags.set(u8.subarray(o, o + N));
        };
        w.onerror = stop;
        w.onmessage = (e) => {
          const m = e.data;
          if (m.type === "ready") {   // 같은 모델인지(개수·정점 배치) 확인한 뒤에만 넘김
            if (m.count === N && m.params === cm.parameters.count && m.parts === cm.parts.count && m.offs.join() === offs) ready = true; else stop();
          } else if (m.type === "frame") { result = m.buf; busy = false; }
          else if (m.type === "fail") stop();
        };
        cm.update = () => {
          if (!ready) return localUpdate();
          if (result) { apply(result); spare = result; result = null; }
          if (!busy) {   // 이전 결과가 오기 전엔 새로 보내지 않음 (밀리지 않게)
            const P = cm.parameters.count, inp = new Float32Array(P + cm.parts.count);
            inp.set(cm.parameters.values); inp.set(cm.parts.opacities, P);
            const tr = [inp.buffer]; if (spare) tr.push(spare);
            w.postMessage({ type: "frame", inp: inp.buffer, out: spare }, tr);
            spare = null; busy = true;
          }
        };
        w.postMessage({ type: "init", url: BASE + "model/model.moc3" });
      })();

      // 표정
      const exp = {};
      await Promise.all(["loading", "heart", "blush", "sweat", "dizzy", "tears", "squint", "smug", "dark"].map(async (f) => {
        try { exp[f] = (await (await fetch(`${BASE}model/exp/${f}.exp3.json`)).json()).Parameters || []; } catch { exp[f] = []; }
      }));
      const weight = {}, hold = {}, until = {};
      // 소품·옷: [설정 이름, 모델 파라미터, 켰을 때 값] (데스크톱 펫의 표정 파일과 같은 값)
      const OUTFIT_PARAMS = [["glasses", "key11", 1], ["monocle", "key12", 1], ["skirt", "Clothes1", -1], ["chestClothes", "Clothes3", 1], ["shoesOff", "Clothes4", 1], ["tailHide", "Clothes5", -1]];
      const OUTFIT_LINE = { glasses: "outfit_glasses", monocle: "outfit_glasses", skirt: "outfit_clothes", chestClothes: "outfit_clothes", shoesOff: "outfit_shoes", tailHide: "outfit_tail" };
      const BODY_VALUE = { type1: 0.4, type2: 1 };   // 체형 = Clothes2 (기본 0, 체형 1 0.4, 체형 2 꼬마 1)
      const outfitW = {};
      for (const [key] of OUTFIT_PARAMS) outfitW[key] = (window.__dscOutfit || {})[key] ? 1 : 0;   // 처음엔 저장된 모습 그대로 (서서히 나타나지 않게)
      let basinUntil = 0, basinW = 0;   // 세숫대야 (머리를 천천히 쓸어내리면)
      let bodyW = BODY_VALUE[(window.__dscOutfit || {}).bodyType] || 0, outfitPrev = null, outfitTalk = null;
      // ---------- 바깥 펫 창 ----------
      // PET: 이 코드가 바깥 펫 창 안에서 도는 중 (preload가 window.dscPet을 넣어 줌). 좌표 = 화면 px, 창이 캐릭터를 따라 움직임.
      // link: 창 안 캐릭터 쪽에서 펫 창이 열려 있으면 캐릭터를 숨기고, 반응(말·몸짓·표정)을 플러그인 호스트를 거쳐 펫 창으로 보냄.
      const PET = window.__dscPetMode ? window.dscPet : null;
      const PET_URL = PET ? null : (() => { try { return new URL("../pet/", new URL(BASE, location.href)).href; } catch { return null; } })();
      // follow: 끄는 도중 창 밖으로 나가 펫 창이 커서를 따라오는 중 ({ shown, pose, busy }), boot: 화면을 처음 불러온 뒤 첫 조회 전,
      // petState: 호스트가 알려 준 펫 프로세스 상태 (none | starting | hidden | shown),
      // seq: 펫 창을 열 때마다 올리는 회차 번호. 펫 창 알림에 같은 번호가 붙어 와서, 이전 회차에서 늦게 온 알림을 가려냄
      const link = { open: false, opening: 0, supported: false, queue: [], last: "", polling: false, voiceSent: null, home: null, follow: null, boot: true, petState: "none", peek: 0, seq: 0 };
      // 펫 창이 보이는 동안(따라오는 중 포함)만 반응을 모아 보냄
      const relay = (fn, args) => { if (link.open || link.follow?.shown) link.queue.push([fn, args]); };
      let linkPost = async () => null;   // 아래 연결 코드에서 채움
      const EYE_EXP = ["heart", "squint", "smug", "dizzy"];
      const clearOtherEyes = (name) => { if (EYE_EXP.includes(name)) for (const e of EYE_EXP) if (e !== name) { until[e] = 0; hold[e] = false; } };
      const setExp = (name, on) => { relay("setExp", [name, on]); if (on) clearOtherEyes(name); hold[name] = on; };
      const flashExp = (name, ms) => { relay("flashExp", [name, ms]); clearOtherEyes(name); until[name] = performance.now() + ms; };

      // 버튜버식 몸짓: 한 번씩 재생하는 동작(gesture) + 지금 상태에 따른 자세(mood)
      const gest = { name: null, start: 0, dur: 0, dir: 1 };
      // 왼손으로 가슴 가리기 (데스크톱 펫의 "가슴에 손" 값): Param59 위팔 원근, Param60 아래팔, Param61 손목, Param62 위팔, Movement2 = 몸 앞용 팔 그림
      const cover = { until: 0, start: -1e9, q: 0 };   // q: 0 = 팔 내림, 1 = 가슴을 가림
      const coverChest = (ms) => { const now = performance.now(); if (now >= cover.until) cover.start = now; cover.until = Math.max(cover.until, now + ms); };
      const play = (name, dur) => { relay("play", [name, dur]); gest.name = name; gest.start = performance.now(); gest.dur = dur; gest.dir = Math.random() < 0.5 ? -1 : 1; if (BOB_KICK[name]) bobKick(BOB_KICK[name]); };
      const BOB_KICK = { bounce: 60, laugh: 50, nod: -45 };   // 몸짓 시작 때 몸 튕김 세기
      let mood = "idle", moodUntil = 0, nextIdleGesture = performance.now() + 6000, talkUntil = 0;
      const setMood = (m, ms = 0) => { relay("setMood", [m, ms]); mood = m; moodUntil = ms ? performance.now() + ms : 0; };
      const pose = { lean: 0, headZ: 0, headY: 0, bodyY: 0, swayAmp: 0 };   // 부드럽게 따라가는 자세 값
      let shiverStarted = -1e9, touchLeanUntil = 0, touchLean = 0;
      let shiverBobAt = 0, shiverBobSign = 1;
      let happyMouthUntil = 0, happyMouth = 0;   // 가슴 터치 2번째부터 "헤~" 입   // 떨릴 때 가슴을 출렁이게 하는 위아래 툭툭
      // 머리를 계속 만지면 삐짐: 턱을 들고 고개를 홱 돌림. 삐진 동안 몇 번 사용자를 몰래 보다가 빠르게 다시 외면
      let stareUntil = 0, stareW = 0;   // 정면을 똑바로 보는 동안 (삐짐이 풀리며 한마디)
      let sulkStart = -1e9, sulkUntil = 0, sulkDir = 1, sulkPeeks = [], sulkYaw = 0, sulkRoll = 0;
      const SULK_CHIN = 10;                                        // 턱을 드는 정도 (AngleY, 위가 +)
      const PEEK_RISE = 550, PEEK_HOLD = 450, PEEK_SNAP = 150;     // 몰래 보기: 천천히 돌아봄 → 잠깐 봄 → 홱 외면 (ms)

      // 위치: 오른쪽 아래 구석, 입력창을 가리지 않는 가장 큰 크기
      const visW = bw * s, visH = H * 0.95;
      // 모바일(터치 전용) 화면에서 캐릭터를 숨기는 설정과, 브라우저 시각 뷰포트(주소창·키보드) 보정
      const coarsePointer = () => typeof matchMedia === "function" && matchMedia("(hover: none) and (pointer: coarse)").matches;
      const mobileHidden = () => !!window.__dscMobile && window.__dscMobile.enabled === false && coarsePointer();
      // 입력 중(모바일 키보드가 열린 상태)이면 캐릭터·말풍선을 잠시 숨긴다 — 입력창과 대화를 가리지 않고, 키보드가 화면을 밀 때 따라 올라가지도 않게
      const activeTextInput = () => {
        let el = document.activeElement;
        if (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;   // 입력창이 섀도 DOM 안에 있어도 찾는다
        const tag = el && el.tagName ? el.tagName.toLowerCase() : "";
        return !!el && (el.isContentEditable || tag === "textarea" || tag === "input");
      };
      const keyboardOpen = () => {
        const vv = typeof visualViewport !== "undefined" && visualViewport ? visualViewport : null;
        if (!vv || vv.scale !== 1) return false;
        // 크롬 안드로이드: 키보드가 비주얼 뷰포트를 줄이거나 화면을 위로 pan 한다 (innerHeight 는 그대로인 경우가 많다)
        return (innerHeight - vv.height) > 120 || vv.offsetTop > 4;
      };
      const typingActive = () => coarsePointer() && (activeTextInput() || keyboardOpen());
      const viewport = () => {
        const vv = typeof visualViewport !== "undefined" && visualViewport ? visualViewport : null;
        return vv ? { w: vv.width, h: vv.height, top: vv.offsetTop, left: vv.offsetLeft } : { w: innerWidth, h: innerHeight, top: 0, left: 0 };
      };
      // 제자리 배치: 컴포저(입력 카드) 오른쪽·아래 여유가 있으면 오른쪽 아래(데스크톱),
      // 좁은 화면처럼 옆 여유가 없으면 컴포저 위로 올린다. 위쪽에는 말풍선 자리(BUBBLE_ROOM)를 남겨 두고,
      // 자동 크기일 때 컴포저 위 자리는 대화 내역을 덜 가리도록 조금 작게(MOBILE_ABOVE_SCALE) 둔다
      const HOME_GAP = 8, BUBBLE_ROOM = 78, MIN_SHOW_K = 0.18, MOBILE_ABOVE_SCALE = 0.3;
      const homeLayout = ({ vp, r, maxK, W, visW, H, visH, minK, allowAbove = true }) => {
        const rightX = (k) => vp.left + vp.w - 4 - (W + visW) / 2 * k;
        const bottomY = (k) => vp.top + vp.h - H * k;
        const fit = (k, above) => {
          const cap = above ? Math.min(maxK, ((r.top - vp.top) - HOME_GAP) / H) : Math.min(maxK, (vp.w - HOME_GAP) / visW);
          const want = k * (above ? MOBILE_ABOVE_SCALE : 1);   // 컴포저 위(모바일 세로)는 자동 맞춤 크기의 30%로 줄인다
          const kk = Math.max(MIN_SHOW_K, Math.min(cap, want));
          return above
            ? { k: kk, x: rightX(kk), y: (r.top - vp.top) - HOME_GAP - H * kk, above: true }
            : { k: kk, x: rightX(kk), y: bottomY(kk), above: false };
        };
        if (!r) {
          const k = Math.min(maxK, Math.max(MIN_SHOW_K, maxK));
          return { k, x: rightX(k), y: bottomY(k), above: false };
        }
        const sideK = Math.min(maxK, Math.max((vp.w - (r.right - vp.left) - HOME_GAP) / visW, (vp.h - (r.bottom - vp.top) - 4) / visH));
        const aboveRoom = (r.top - vp.top) - HOME_GAP - BUBBLE_ROOM;
        const aboveK = Math.min(maxK, aboveRoom / H, (vp.w - HOME_GAP) / visW);
        if (sideK >= Math.min(minK, maxK)) return fit(sideK, false);
        // 컴포저 위 배치(자동 크기의 30%)는 터치 화면에서만 쓴다. 데스크톱 좁은 창은 예전처럼 오른쪽 아래 구석을 유지한다
        if (allowAbove && aboveK >= MIN_SHOW_K) return fit(aboveK, true);
        const k = Math.min(maxK, MIN_SHOW_K);
        return { k, x: rightX(k), y: bottomY(k), above: false };
      };
      // 말풍선 배치: 머리 위가 기본. 카드와 겹치면 옆/아래로 피하되, 뷰포트 밖으로 나가지 않게 자른다
      const bubbleLayout = ({ vp, headX, headTop, bw, bh, r, above }) => {
        const clampX = (left) => Math.min(Math.max(vp.left + HOME_GAP, left), Math.max(vp.left + HOME_GAP, vp.left + vp.w - bw - HOME_GAP));
        const clampY = (top) => Math.min(Math.max(vp.top + HOME_GAP, top), Math.max(vp.top + HOME_GAP, vp.top + vp.h - bh - HOME_GAP));
        const hit = (left, top) => r && left < r.right && left + bw > r.left && top < r.bottom && top + bh > r.top;
        const aboveTop = clampY(headTop - bh - 10);
        const aboveLeft = clampX(headX + 55 - bw);   // 꼬리(오른쪽 55px)가 머리 가운데에 오게
        if (!hit(aboveLeft, aboveTop) || above) return { left: aboveLeft, top: aboveTop, side: false };
        const below = r.bottom + HOME_GAP, sideLeft = clampX(vp.left + vp.w - bw - HOME_GAP);
        if (below + bh <= vp.top + vp.h - HOME_GAP) return { left: sideLeft, top: clampY(below), side: true };
        // 아래로도 자리가 없으면(모바일처럼 컴포저가 화면 끝까지 차지) 머리 위로 유지하고 뷰포트 안으로만 자른다
        return { left: aboveLeft, top: aboveTop, side: false };
      };
      let curK = 1, fleeX = 0;     // 현재 배율, 도망·산책으로 옆으로 비켜난 거리(px, + 오른쪽 · - 왼쪽)
      // 자유 위치: 끌어서 옮긴 자리 (창 안 = 창 좌표, 펫 창 = 화면 좌표). 제자리 근처에 놓으면 다시 붙음.
      const free = { on: false, x: 0, y: 0, k: 1, anim: null };
      const drag = { pending: null, on: false, x: 0, y: 0, samples: [] };
      const carry = { vx: 0, vy: 0 };              // 끄는 속도(px/초) → 몸이 관성으로 쏠리고 머리카락·치마가 흔들림
      const shown = { k: 1, x: 0, y: 0 };          // 지난 프레임에 그린 자리 (끌기 시작점)
      let touchHold = 0;   // 터치에서 길게 눌러 집기 모드로 들어가는 타이머 (오른쪽 버튼이 없는 화면용)
      let petDock = null, petDocked = false, snapP = 0;   // 펫 창: 붙을 자리(DSH 창의 제자리, 화면 좌표), 붙은 뒤, 붙는 진행도
      // 바깥 펫 창 전용: 우클릭 메뉴 상태 ↔ 설정 패널 ↔ 크기. 크기는 '기본(머리 크기 맞춤) 대비 배율'로,
      // 펫 창 프로필(localStorage)에 남겨 다시 켜도 기억한다.
      const PET_SIZE_KEY = "dsc-pet-size";
      let petPanel = null, petPanelOpen = false, petPanelWin = { w: 0, h: 0 };
      let petBaseK = 1, petPendingRatio = null, petSizeTimer = 0, petMenuSig = "";
      const FREE_KEY = "dsc-free-pos";
      // 창 안 자유 위치는 창 크기 비율로 기억: 몸 가운데의 가로 비율(fx)·그림 아래 끝의 세로 비율(fy).
      // 창 크기가 바뀌면 같은 비율 자리로 옮겨 가서, 최대화를 풀어도 옛 픽셀 자리에 남아 화면 밖으로 밀리지 않음
      const freeToRatio = () => { free.fx = (free.x + W * free.k / 2) / innerWidth; free.fy = (free.y + H * free.k) / innerHeight; };
      if (!PET) try {
        const s = JSON.parse(localStorage.getItem(FREE_KEY) || "null");
        if (s && isFinite(s.fx) && isFinite(s.fy) && s.k > 0) Object.assign(free, { on: true, fx: s.fx, fy: s.fy, k: s.k });
      } catch {}
      const saveFree = (fromPose = true) => {   // fromPose: 지금 x·y에서 비율을 다시 계산 (휠처럼 크기만 바꿀 땐 비율을 그대로 둠)
        if (PET) return;
        if (free.on && fromPose) freeToRatio();
        try { if (free.on) localStorage.setItem(FREE_KEY, JSON.stringify({ fx: +free.fx.toFixed(4), fy: +free.fy.toFixed(4), k: +free.k.toFixed(3) })); else localStorage.removeItem(FREE_KEY); } catch {}
      };
      // 산책: 가끔 가까운 쪽 화면 밖으로 걸어 나갔다가 잠시 뒤 같은 쪽에서 걸어 들어옴 (phase: "" | ready | out | away | in, dir: -1 왼쪽 · 1 오른쪽)
      const walk = { phase: "", face: 0, dir: -1, out: 0, timers: [], slideId: 0, lastTouch: 0, next: performance.now() + (180 + Math.random() * 180) * 1000 };
      let walkCheck = null;
      // 시작 연출: 처음엔 화면 가운데에 크게 인사 → 본 화면이 뜨면 오른쪽 아래 제자리로 이동
      const DPR = (devicePixelRatio || 1) * 1.5;   // 1.5배로 그려 줄여 보여 줌 (윤곽선 매끄럽게)
      const intro = { phase: "center", start: performance.now(), moveStart: 0, from: null, kc: 1 };
      const veil = document.createElement("div");
      veil.style.cssText = "position:fixed;inset:0;z-index:29;background:radial-gradient(circle at 50% 55%,var(--dsc-veil1,#ffffffd9),var(--dsc-veil2,#eef0ffcc) 70%);backdrop-filter:blur(8px);opacity:0;transition:none;cursor:pointer";
      document.body.append(veil);
      veil.addEventListener("pointerdown", () => { if (intro.phase === "center") intro.skip = true; });
      const setRes = (k) => { app.renderer.resolution = DPR * Math.max(1, k); app.renderer.resize(W, H); };
      const ease = (p) => (p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p));
      // 오른쪽 아래 제자리 (원래 배치)
      // 입력 카드 표시(dsc-composer)는 다음 프레임에 붙으므로, 세션 전환으로 카드가 새로 생긴 프레임에는 같은 조건으로 직접 찾는다
      // (못 찾으면 최대 크기로 한 프레임 커졌다가 돌아옴)
      const findCard = () => document.querySelector(".dsc-composer") ||
        [...document.querySelectorAll('[class*="_card"]')].find((e) => e.closest('[class*="_root"]') && e.querySelector('[class*="_input"]'));
      // 질문·승인 카드가 입력창 자리를 대신하면 입력 카드는 숨겨져 크기가 0이 되므로, 같은 자리에 뜬 카드로 잰다
      const cardRect = (card) => {
        const r = card.getBoundingClientRect();
        if (r.width) return r;
        const seat = card.closest('[class*="composerSeat"]');
        for (const alt of seat ? seat.querySelectorAll('[class*="_card"]') : []) {
          if (alt === card) continue;   // 표시가 붙기 전 프레임에도 자기 자신은 건너뜀
          const ar = alt.getBoundingClientRect();
          if (ar.width) return ar;
        }
        return null;
      };
      const homePose = () => {
        const card = findCard();
        // 창 여유 공간에 맞춰 커진다. 상한은 창 높이의 92%와, 펫 창이 그대로 따라갈 수 있는 배율(PET_K_MAX / PET_HEAD_RATIO) 중 작은 쪽
        //  (펫 창이 따라가지 못하는 크기로 키우면 창 밖으로 나갈 때 크기가 튀므로 그 선을 넘지 않게 한다)
        const vp = viewport();
        const maxK = Math.min(PET_K_MAX / PET_HEAD_RATIO, (vp.h * 0.92) / visH);
        const r = card ? cardRect(card) : null;
        // 컴포저 오른쪽·아래 여유가 부족한 좁은 화면(모바일 세로 등)이면 컴포저 위로 올린다 (입력창·전송 버튼을 가리지 않게)
        const pose = homeLayout({ vp, r, maxK, W, visW, H, visH, minK: SHOW_K, allowAbove: coarsePointer() });
        return { k: pose.k, x: pose.x + fleeX, y: pose.y, card, r, above: pose.above, vp };
      };
      const centerPose = () => {
        // 가운데 아래에 붙여 상반신이 화면 아래에서 올라온 모습 (잘린 선이 화면 중간에 뜨지 않게)
        const vp = viewport();
        const k = Math.min(vp.h * 0.74 / visH, vp.w * 0.55 / visW, 3.2);
        return { k, x: vp.left + vp.w / 2 - W * k / 2, y: vp.top + vp.h - H * k };
      };
      // 설정에서 '시작할 때 등장 연출'을 끄면 가운데 인사 없이 처음부터 제자리에 뜬다
      const introOff = !!window.__dscIntro && window.__dscIntro.enabled === false;
      if (!introOff) { intro.kc = centerPose().k; setRes(intro.kc); }
      // 펫 창이거나 이미 펫 창이 떠 있으면 시작 연출 없이 바로 제자리
      const skipIntro = () => {
        if (intro.phase === "done") return;
        intro.phase = "done"; setRes(1); veil.remove(); canvas.style.opacity = "";
        bubble.style.left = ""; bubble.style.fontSize = ""; bubble.style.padding = "";   // 시작 연출용 큰 말풍선 스타일 해제
      };
      if (PET || introOff) skipIntro();

      // ---------- 자유 위치 계산 ----------
      // 캔버스 왼쪽 위(x, y)·배율 k일 때 보이는 몸 영역 (양옆 빈 곳·머리 위 여백 제외). 커서가 몸 위인지 판정할 때 씀
      const bodyRect = (x, y, k) => { const side = (W - visW) / 2 * k; return { l: x + side, t: y + H * 0.05 * k, r: x + W * k - side, b: y + H * k }; };
      const easeOut = (p) => 1 - Math.pow(1 - p, 3);
      const easeBack = (p) => { const c = 1.25, q = p - 1; return 1 + (c + 1) * q * q * q + c * q * q; };   // 끝에서 살짝 넘쳤다 돌아옴 (자석에 붙는 느낌)
      const area = () => PET ? { l: screen.availLeft, t: screen.availTop, r: screen.availLeft + screen.availWidth, b: screen.availTop + screen.availHeight }
        : { l: 0, t: 0, r: innerWidth, b: innerHeight };
      const keepIn = (p) => {   // 보이는 몸이 영역 밖으로 다 나가지 않게
        const a = area(), side = (W - visW) / 2 * p.k;
        return { k: p.k, x: Math.min(Math.max(p.x, a.l - side), a.r - W * p.k + side), y: Math.min(Math.max(p.y, a.t - H * p.k * 0.05), a.b - H * p.k * 0.3) };
      };
      // 창 좌표 → 화면 좌표 (창 테두리·제목 표시줄 두께를 뺌)
      const screenOf = (x, y) => { const bx = (outerWidth - innerWidth) / 2; return { x: screenX + bx + x, y: screenY + Math.max(0, outerHeight - innerHeight - bx) + y }; };
      const SHOW_K = 0.42;   // 제자리 크기가 이보다 작으면 입력창을 피할 자리가 없음
      // 붙을 자리 = 제자리. 창이 좁아 제자리 크기가 SHOW_K보다 작으면(예전엔 숨김) 보일 수 있는 가장 작은 크기로 오른쪽 아래 구석.
      // 컴포저 위로 올린 자리(above)는 그 자리를 그대로 쓴다 — 아래 구석으로 되돌리면 입력창을 다시 가린다.
      // 매 프레임 다시 계산하므로 창 크기가 바뀌면 붙어 있는 캐릭터의 크기·위치도 따라 바뀜
      const dockTarget = (home) => (home.k >= SHOW_K || home.above ? home : { k: SHOW_K, x: innerWidth - 4 - (W + visW) / 2 * SHOW_K + fleeX, y: innerHeight - H * SHOW_K });
      // 보이는 몸이 창 밖에 있는지. 경계에서 판정이 왔다 갔다 하지 않게 회색 지대를 둠:
      //   넘어갈 때(entering) = 몸의 15%가 밖으로 나가야 함 (아래쪽은 제자리가 창 아래 끝에 붙어 있어 그림의 50%)
      //   이미 펫 창이 따라오는 중 = 몸이 거의 다 창 안으로 돌아와야(가장자리 2% 안쪽, 아래쪽은 20%만 남음) 창 안으로 봄
      const bodyOut = (q, entering = true) => {
        const side = (W - visW) / 2 * q.k, edge = visW * q.k * (entering ? 0.15 : -0.02), low = entering ? 0.5 : 0.8;
        return q.x + side < -edge || q.x + W * q.k - side > innerWidth + edge || q.y < -edge || q.y + H * q.k * low > innerHeight;
      };
      // 펫 창: 몸이 DSH 창(화면 좌표 w) 안으로 거의 다 들어왔는지 (가장자리 2% 안쪽, 아래쪽은 그림의 20%만 남음)
      const inWindow = (q, w) => {
        const side = (W - visW) / 2 * q.k, edge = visW * q.k * 0.02;
        return q.x + side >= w.l + edge && q.x + W * q.k - side <= w.r - edge && q.y >= w.t + edge && q.y + H * q.k * 0.8 <= w.b;
      };
      const dockPose = (home, now) => {
        snapP = 0;
        if (drag.on) return { k: free.k, x: drag.x, y: drag.y };
        const a = free.anim;
        if (a) {
          const p = Math.min(1, (now - a.t0) / a.ms), to = a.snap ? (PET ? petDock : dockTarget(home)) || a.from : a.to;
          const e = a.snap ? easeBack(p) : easeOut(p), ek = easeOut(p);
          const pose = { k: a.from.k + (to.k - a.from.k) * ek, x: a.from.x + (to.x - a.from.x) * e, y: a.from.y + (to.y - a.from.y) * e };
          if (a.snap) snapP = ek;
          if (p >= 1) {
            free.anim = null;
            if (a.snap && !PET) { free.on = false; saveFree(); }
            else { Object.assign(free, { on: true, x: to.x, y: to.y, k: to.k }); saveFree(); }
            if (a.snap && PET) { petDocked = true; PET.send({ type: "attach" }); }
            if (PET) { petSyncMenu(); renderPetPanel(); }   // 크기 애니메이션이 끝난 뒤 메뉴·슬라이더를 새 값으로
          }
          return pose;
        }
        if (!free.on) return dockTarget(home);
        let q = free;
        if (!PET) {   // 창 크기 비율 자리, 크기는 지금 창에 들어가는 최대치까지만
          if (!isFinite(free.fx) || !isFinite(free.fy)) freeToRatio();
          // 모바일에서는 크기를 자동 배치 규칙(컴포저 위 = 자동 크기의 40%)에 따르게 하고 위치만 기억한다.
          // 자유 크기 하한(SHOW_K = 0.42)이 모바일 자동 크기보다 커서, 끌어다 놓은 뒤에는 크기 설정이 무시되던 문제
          const floor = coarsePointer() ? MIN_SHOW_K : SHOW_K;
          const baseK = coarsePointer() ? home.k : free.k;
          const k = Math.max(floor, Math.min(baseK, Math.min(1.25, (innerHeight * 0.45) / visH)));
          q = { k, x: free.fx * innerWidth - W * k / 2, y: free.fy * innerHeight - H * k };
        }
        const p = keepIn(q);
        return { k: p.k, x: p.x + fleeX, y: p.y };
      };
      // 손을 놓을 때: 속도만큼 조금만 미끄러짐(GLIDE). 멈출 자리가 제자리(펫 창이면 DSH 창의 제자리) 근처면 자석으로 붙고, 창 밖이면 펫 창으로.
      const GLIDE = 0.066;   // 놓을 때 속도 × 이 시간(초)만큼 미끄러짐
      const release = (vx, vy, touch = false) => {
        const k = free.k, from = { k, x: drag.x, y: drag.y }, p = { k, x: from.x + vx * GLIDE, y: from.y + vy * GLIDE };
        const home = PET ? petDock : dockTarget(homePose());
        const mid = (q, kk) => [q.x + W * kk / 2, q.y + H * kk * 0.5];
        const [px, py] = mid(p, k);
        // 창 밖이 자석보다 먼저: 제자리는 창 구석에 붙어 있어 자석 범위가 창 밖까지 걸치므로, 순서가 반대면 구석에서 밖으로 던져도 다시 붙음
        const outside = !PET && bodyOut(p);
        // 펫 창은 몸이 DSH 창 안으로 거의 다 돌아왔을 때만 붙음 (창 밖 바로 옆, 제자리 근처에 놓았을 때 다시 붙지 않게. 창 안 쪽의 '나올 때' 기준과 같음)
        const backIn = !PET || !home?.win || inWindow(p, home.win);
        const snap = !touch && !outside && backIn && !!home && Math.hypot(px - mid(home, home.k)[0], py - mid(home, home.k)[1]) < Math.max(140, visW * k * 0.7);
        if (Math.hypot(vx, vy) > 2600) flashExp("dizzy", 1500);   // 세게 던지면 빙글빙글
        if (outside && link.supported) {
          const a = screenOf(from.x, from.y), b = screenOf(p.x, p.y);
          link.opening = performance.now();
          linkPost("open", { from: { k, x: a.x, y: a.y }, to: { k, x: b.x, y: b.y }, seq: ++link.seq });
        }
        free.on = true;
        if (snap) { free.anim = { t0: performance.now(), ms: 650, from, to: null, snap: true }; return; }
        const to = keepIn(p);   // 미끄러진 자리 (화면 밖으로 나간 부분은 살짝 당겨 들임)
        // 펫 창: 끌어낸 뒤에는 기억해 둔 배율로 맞춘다 (놓은 자리의 아래 가운데를 기준으로). 붙는 중이면 위에서 끝났다.
        let target = to;
        if (PET && petPendingRatio != null) { target = keepIn(petSizedPose(p, k, petPendingRatio)); petPendingRatio = null; }
        if (target.x !== from.x || target.y !== from.y || target.k !== from.k) free.anim = { t0: performance.now(), ms: 300, from, to: target, snap: false };
        else { free.anim = null; Object.assign(free, { x: from.x, y: from.y, k }); saveFree(); }
      };
      let lastPlaceKey = "";
      let lastClip = "";
      let lastMask = "", lastMaskComposite = "";
      const petWin = { x: NaN, y: NaN };
      let petWinSize = { w: 0, h: 0 };   // 펫 창: 캐릭터 크기에 맞춰 요청한 창 크기 (pet/main.cjs 가 실제로 조절)
      let petTracking = false, petGrab = null;   // petGrab: 따라오는 중 커서가 몸을 잡은 자리   // 펫 프로세스가 커서를 직접 따라 창을 옮기는 중 (이때 여기서 창을 옮기면 서로 밀어 끊김)
      let petBox = "";   // 펫 창: 마지막으로 알린 몸 영역
      const movePet = (pose) => {   // 펫 창: 캔버스는 창 아래 가운데, 창을 화면 좌표로 옮김
        const cx = (innerWidth - W * pose.k) / 2, cy = innerHeight - H * pose.k;
        const wx = Math.round(pose.x - cx), wy = Math.round(pose.y - cy);
        if (petTracking) petWin.x = petWin.y = NaN;   // 끝난 뒤 다시 계산한 자리로 옮기게
        else if (wx !== petWin.x || wy !== petWin.y) { petWin.x = wx; petWin.y = wy; PET.move(wx, wy); }
        return { x: cx, y: cy };
      };
      const place = () => {
        const now = performance.now();
        if (mobileHidden()) { canvas.style.display = bubble.style.display = "none"; veil.style.opacity = 0; veil.style.pointerEvents = "none"; lastPlaceKey = ""; return; }   // 설정에서 모바일 표시를 껐을 때
        if (typingActive()) {   // 입력 중(키보드 열림)에는 입력창·대화를 가리지 않게 잠시 숨김
          if (intro.phase === "center") intro.skip = true;   // 인트로 도중 입력을 시작했으면 클릭 없이 제자리로 보낸다
          canvas.style.display = bubble.style.display = "none"; veil.style.opacity = 0; veil.style.pointerEvents = "none"; lastPlaceKey = ""; return;
        }
        const home = homePose();
        if (link.open || link.follow?.shown) { link.home = home; canvas.style.display = bubble.style.display = "none"; lastPlaceKey = ""; return; }   // 펫 창이 대신 보여 줌
        const dock = dockPose(home, now);
        let { k, x, y } = dock;
        let introOn = intro.phase !== "done", vo = 0;
        if (introOn && !intro.begun) {   // 호스트 화면(입력 카드)이 뜨고 잠잠해진 뒤에 등장: 창이 막 떠서 메인 스레드가 바쁜 구간의 끊김을 안 보이게 (최대 8초 대기)
          if (home.card && !intro.cardAt) intro.cardAt = now;
          if (!(intro.cardAt && now - intro.cardAt > 300) && now - intro.start < 8000) { veil.style.opacity = 1; veil.style.pointerEvents = "none"; return; }   // 대기 중에는 아바타 없이 흐린 배경만
          intro.begun = true; intro.start = now;
        }
        if (introOn) {
          const c = centerPose();
          if (intro.phase === "center") {
            vo = 1;   // 대기 중에 이미 떠 있음
            k = c.k; x = c.x; y = c.y;
            if (intro.skip) { intro.phase = "move"; intro.moveStart = now; intro.from = c; }   // 빈 배경을 클릭해야만 제자리로 (저절로 넘어가지 않음)
          } else {
            const p = ease((now - intro.moveStart) / 900);
            vo = 1 - p;
            k = intro.from.k + (dock.k - intro.from.k) * p; x = intro.from.x + (dock.x - intro.from.x) * p; y = intro.from.y + (dock.y - intro.from.y) * p;
            if (p >= 1) { intro.phase = "done"; introOn = false; setRes(1); veil.remove(); bubble.style.left = ""; bubble.style.fontSize = ""; bubble.style.padding = ""; }
          }
          veil.style.opacity = vo; veil.style.pointerEvents = intro.phase === "center" ? "auto" : "none";
          canvas.style.opacity = intro.phase === "center" ? ease((now - intro.start) / 300) : "";   // 아바타는 흐린 배경 위에서 서서히 등장
        }
        const show = introOn || k >= SHOW_K || (home.above && k >= MIN_SHOW_K);   // 컴포저 위 자리는 최소 크기로도 보여 준다
        canvas.style.display = bubble.style.display = show ? "block" : "none";
        if (!show) return;
        // 배율이 바뀌면 그만큼 렌더 해상도를 올린다 (펫 창처럼 크게 그릴 때 버퍼가 모자라 뿌옇게 보이던 문제)
        if (curK !== k) { curK = k; setRes(k); }
        shown.k = k; shown.x = x; shown.y = y;
        const loose = PET || dock !== home;   // 자유 위치·펫 창: 말풍선 꼬리가 머리 위에 오게
        if (PET) {
          ({ x, y } = movePet(dock));
          // 창 크기를 캐릭터에 맞춘다 (배율 상한이 없으므로 화면에 들어가는 만큼 창도 커진다)
          const needW = Math.ceil(W * k) + 24, needH = Math.ceil(H * k) + PET_BUBBLE;
          // 설정 패널이 열려 있으면 패널이 들어갈 만큼은 창을 키운다 (캐릭터는 아래 가운데 그대로)
          const panelW = petPanelOpen && petPanel ? Math.ceil(petPanel.offsetWidth) + 24 : 0;
          const panelH = petPanelOpen && petPanel ? Math.ceil(petPanel.offsetHeight) + 24 : 0;
          const fitW = Math.max(needW, panelW), fitH = Math.max(needH, panelH);
          if (fitW !== petWinSize.w || fitH !== petWinSize.h) {
            petWinSize.w = fitW; petWinSize.h = fitH;
            PET.send({ type: "fit", w: fitW, h: fitH });
          }
          // 창 크기가 바뀌면(패널을 열거나 크기를 바꿀 때) 패널을 보이는 화면 안에 다시 놓는다
          if (petPanelOpen && (innerWidth !== petPanelWin.w || innerHeight !== petPanelWin.h)) {
            petPanelWin = { w: innerWidth, h: innerHeight };
            fitPetPanel();
          }
          // 클릭을 받을 몸 영역(창 안 좌표)을 펫 프로세스에 알려 줌. 커서가 이 안에 있는지는 펫 프로세스가 직접 확인 (산책·도망 중엔 없음)
          const r = bodyRect(x, y, k), body = walking() || fleeX !== 0 ? null : { l: Math.round(r.l), t: Math.round(r.t), r: Math.round(r.r), b: Math.round(r.b) };
          const b = petPanelBox(body);   // 설정 패널이 열려 있으면 패널 영역도 클릭을 받는다
          const sig = JSON.stringify(b);
          if (sig !== petBox) { petBox = sig; PET.send({ type: "hitbox", box: b }); }
        }
        // 승인·질문 카드가 입력 영역에 떠 있으면 캐릭터에서 카드 모양(둥근 모서리 포함)만 잘라 낸다.
        // 캐릭터는 계속 위(z=30)에 두므로 테마를 끈 상태의 불투명한 입력 영역 배경에도 몸이 가려지지 않는다.
        // (placeKey 비교보다 먼저: 입력창 위치가 그대로여도 카드가 뜨고 사라지거나 테마 전환으로 반지름이 바뀌면 갱신)
        const seat = !introOn && home.card && home.card.closest('[class*="composerSeat"]');
        const popup = seat && seat.querySelector('[class*="_card"]:not(.dsc-composer)');
        let clip = "";
        if (popup) {
          const pr = popup.getBoundingClientRect(), cs = getComputedStyle(popup), cw = W * k, ch = H * k;
          const l = pr.left - x, t = pr.top - y, rr = pr.right - x, bb = pr.bottom - y;
          if (rr > 0 && bb > 0 && l < cw && t < ch) {
            const rad = (v) => Math.min(parseFloat(v) || 0, pr.width / 2, pr.height / 2), f = (n) => +n.toFixed(2);
            const tl = rad(cs.borderTopLeftRadius), tr = rad(cs.borderTopRightRadius), br = rad(cs.borderBottomRightRadius), bl = rad(cs.borderBottomLeftRadius);
            clip = `path(evenodd, "M0 0H${f(cw)}V${f(ch)}H0Z M${f(l + tl)} ${f(t)}H${f(rr - tr)}A${f(tr)} ${f(tr)} 0 0 1 ${f(rr)} ${f(t + tr)}V${f(bb - br)}` +
              `A${f(br)} ${f(br)} 0 0 1 ${f(rr - br)} ${f(bb)}H${f(l + bl)}A${f(bl)} ${f(bl)} 0 0 1 ${f(l)} ${f(bb - bl)}V${f(t + tl)}A${f(tl)} ${f(tl)} 0 0 1 ${f(l + tl)} ${f(t)}Z")`;
          }
        }
        if (clip !== lastClip) { canvas.style.clipPath = clip; lastClip = clip; }
        // 배치에 쓰는 값이 그대로면 건너뜀: 매 프레임 side 클래스를 뗐다 붙이며 레이아웃을 3번씩 강제하던 것 방지
        // 허리 아래가 잘린 창 안 그림은 화면 아래에서 띄우면 띄운 만큼 아래쪽을 흐리게 (꼬마 모습은 발까지 그려져 안 흐림)
        // 펫 창은 전신을 그리지만, 제자리로 붙는 동안에는 하반신을 서서히 지워 도착할 때 창 안 상반신 그림과 이어지게 한다
        const lift = PET ? 0 : Math.max(0, innerHeight - (y + H * k));
        const fade = PET ? 0 : Math.round(Math.max(0, Math.min(lift, H * k * 0.18)) * (1 - Math.min(1, Math.max(0, bodyW))));
        const petFade = PET ? Math.min(1, Math.max(0, petDocked ? 1 : snapP)) : 0;   // 붙는 진행도 (0 = 전신 그대로, 1 = 하반신 완전히 사라짐)
        // 펫 창: DSH 창 안쪽은 또렷하게, 창 밖으로 나간 부분은 흐리게(반투명) — 창 영역을 기준으로 자른다
        const winBox = PET && petDock && petDock.win ? petDock.win : null;
        const vp = home.vp || viewport();
        const r0 = home.r;
        const placeKey = introOn ? "" : [k, x, y, vp.left, vp.top, vp.w, vp.h, fleeX, Math.round(bodyW * 40), r0 && r0.left, r0 && r0.right, r0 && r0.top, r0 && r0.bottom,
          home.above ? 1 : 0, bubble.textContent, bubble.className.replace(/\bside\b/g, "").trim(), fade, Math.round(petFade * 60), loose,
          winBox ? [winBox.l, winBox.t, winBox.r, winBox.b].join(",") : ""].join("|");
        if (placeKey && placeKey === lastPlaceKey) return;
        lastPlaceKey = placeKey;
        let mask = "";
        let maskComposite = "";
        if (winBox && petFade > 0.001) {
          // 복귀 중에만: DSH 창 안쪽은 또렷(불투명), 바깥으로 나간 부분은 진행도에 따라 흐려져 도착하면 완전히 사라진다.
          //  · 허리 기준 정렬 덕분에 도착 시 하반신이 창 아래 = 바깥에 놓이므로, 하반신이 자연스럽게 지워진다
          //  · 평소(복귀 아닐 때)에는 이 마스크를 쓰지 않아 캐릭터가 그대로 또렷하게 보인다
          const o = screenOf(0, 0), A = (1 - petFade).toFixed(3);
          const l = (winBox.l - o.x - x).toFixed(1), r = (winBox.r - o.x - x).toFixed(1);
          const t = (winBox.t - o.y - y).toFixed(1), b = (winBox.b - o.y - y).toFixed(1);
          mask = `linear-gradient(to right, rgba(0,0,0,${A}) 0 ${l}px, #000 ${l}px ${r}px, rgba(0,0,0,${A}) ${r}px 100%), `
            + `linear-gradient(to bottom, rgba(0,0,0,${A}) 0 ${t}px, #000 ${t}px ${b}px, rgba(0,0,0,${A}) ${b}px 100%)`;
          maskComposite = "intersect";
        } else if (petFade > 0.001) {
          // 펫 창 영역을 아직 받지 못했을 때의 대비: 허리 기준으로 페이드
          const alpha = (1 - petFade).toFixed(3), b0 = Math.max(0, WAIST_PCT - 2.5).toFixed(2), b1 = Math.min(100, WAIST_PCT + 2.5).toFixed(2);
          mask = `linear-gradient(to bottom, #000 0 ${b0}%, rgba(0,0,0,${alpha}) ${b1}% 100%)`;
        } else if (fade > 0) mask = `linear-gradient(to bottom, #000 calc(100% - ${fade}px), transparent)`;
        if (mask !== lastMask || maskComposite !== lastMaskComposite) {
          canvas.style.maskImage = canvas.style.webkitMaskImage = mask;
          canvas.style.maskComposite = maskComposite || "add";
          canvas.style.webkitMaskComposite = maskComposite === "intersect" ? "source-in" : "source-over";
          lastMask = mask; lastMaskComposite = maskComposite;
        }
        canvas.style.width = W * k + "px"; canvas.style.height = H * k + "px";
        if (fleeX !== 0) bubble.style.display = "none";
        canvas.style.left = x + "px"; canvas.style.top = y + "px";
        const headTop = y + (H * 0.05 + chibiHeadDrop * Math.min(1, Math.max(0, bodyW))) * k;   // 꼬마일 땐 내려간 머리 위에 말풍선
        bubble.classList.remove("side");
        if (introOn) {   // 가운데에선 머리 위에 큰 말풍선
          bubble.style.right = "auto"; bubble.style.fontSize = "22px"; bubble.style.padding = "14px 24px"; bubble.style.maxWidth = "560px";
          const bw0 = bubble.offsetWidth, bh0 = bubble.offsetHeight;
          const clampX = (left) => Math.min(Math.max(vp.left + HOME_GAP, left), Math.max(vp.left + HOME_GAP, vp.left + vp.w - bw0 - HOME_GAP));
          const clampY = (top) => Math.min(Math.max(vp.top + HOME_GAP, top), Math.max(vp.top + HOME_GAP, vp.top + vp.h - bh0 - HOME_GAP));
          bubble.style.left = clampX(x + W * k / 2 - bw0 / 2) + "px";
          bubble.style.top = clampY(Math.max(vp.top + HOME_GAP, headTop - bh0 - 6)) + "px";
          return;
        }
        const card = home.card;
        bubble.style.right = "auto";
        bubble.style.maxWidth = Math.min(Math.max(150, visW * k * 1.1), vp.w - 16) + "px";
        // 머리 위가 기본. 카드와 겹치면 옆/아래로 피하고, 뷰포트(주소창·키보드) 밖으로는 나가지 않게 자른다
        const bl = bubbleLayout({ vp, headX: x + W * k / 2, headTop, bw: bubble.offsetWidth, bh: bubble.offsetHeight, r: card && home.r ? home.r : null, above: home.above });
        bubble.style.left = bl.left + "px";
        bubble.style.top = bl.top + "px";
        if (bl.side && !home.above) bubble.classList.add("side");
      };
      const raf = () => { if (SLEEP.state !== "asleep") place(); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);

      // 말풍선
      let bubbleTimer;
      let lastSayAt = 0;
      let lastSayText = "";   // 말풍선에 마지막으로 띄운 문장 (연속 터치에서 같은 대사 반복 방지)
      // 숨김 타이머: 외부 음성이 재생 중이면(voiceState.speaking) 말풍선을 붙잡아 두고 250ms 뒤 다시 확인.
      // voiceState가 null(음성 없음)이면 예전처럼 setTimeout(ms) 한 번만 돌아 동작이 같다.
      const hideBubble = (delay) => {
        bubbleTimer = setTimeout(() => {
          if (voiceState?.speaking === true) { hideBubble(250); return; }
          bubble.classList.remove("show");
        }, delay);
      };
      const say = (text, ms = 3500, mutter = false, kind) => {
        relay("say", [text, ms, mutter, kind]);
        bubble.textContent = text; bubble.classList.add("show");
        lastSayText = text;
        bubble.classList.toggle("mutter", mutter);   // 혼잣말: 점선 말풍선 + 생각하는 시선
        lastSayAt = performance.now();
        startTalk(text, ms || 3000, mutter);   // 말하는 동안 글자 모음에 맞춰 입 움직임
        clearTimeout(bubbleTimer); if (ms) hideBubble(ms);
        // 바깥(자막·로깅·음성 엔진 등)이 대사를 알 수 있게 동기로 알린다. 실패해도 무시.
        kind = kind || (mutter ? "mutter" : "other");
        try { window.dispatchEvent(new CustomEvent("dsc:say", { detail: { text, ms, kind } })); } catch {}
      };
      const hush = () => { relay("hush", []); clearTimeout(bubbleTimer); bubble.classList.remove("show"); };

      // ---------- 버튜버식 움직임 (얼굴 추적처럼) ----------
      // 이 모델은 VBridger식 리깅: 머리 = AngleX/Y/Z, 몸 = PositionX/Y/Z·LeanInput(물리 엔진이 늦게 따라감),
      // 머리카락 물리 입력 = ParamAngleX/Y/Z, 귀 = 눈썹(ParamBrowLY/RY)을 따라 쫑긋. 입 = ParamA/I/U/E/O 모음.
      let mx = innerWidth / 2, my = innerHeight / 2, lastMove = 0;
      addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; lastMove = performance.now(); }, { passive: true });

      // 부드러운 잡음: 정수점마다 무작위 값을 두고 매끄럽게 잇기 (두 겹)
      const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
      const vnoise = (t) => { const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f); return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1; };
      const noise = (t, seed) => vnoise(t + seed * 17.31) * 0.72 + vnoise(t * 2.3 + seed * 5.17) * 0.28;
      // 스프링: 목표를 살짝 넘었다 돌아오며 따라감 (k 클수록 빠름, d 클수록 덜 출렁임)
      const S = () => ({ x: 0, v: 0 });
      // 프레임 간격이 길어도 흔들리지 않게 8ms 단위로 잘게 나눠 계산 (한 번에 계산하면 30fps 이하에서 눈동자가 매 프레임 튐)
      const spring = (s, target, dt, k, d) => { const n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n; for (let i = 0; i < n; i++) { s.v += ((target - s.x) * k - s.v * d) * h; s.x += s.v * h; } return s.x; };
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const hx = S(), hy = S(), ex = S(), ey = S();
      // 몸 위아래 튕김: 통통·웃음·끄덕임 몸짓을 시작할 때 살짝 차 주면 스프링이 출렁이며 돌아오고, 물리 엔진이 가슴을 한 박자 늦게 흔든다
      // (말할 때는 차지 않음: 몸 위아래 값은 머리도 함께 움직여 글자마다 얼굴이 떨려 보임)
      const bob = S();
      const bobKick = (v) => { bob.v += v; };
      let energy = 0.6;                                   // 움직임 크기 (상태마다 다름)
      const attn = { x: 0, y: 0.05, next: 0 };            // 지금 바라보는 곳 (-1~1, 캔버스 기준)

      // 바라볼 곳 고르기: 말할 땐 정면(시청자), 작업 중엔 대화창을 읽듯 왼쪽, 가끔 입력창·딴 곳
      const pickAttention = (now, talking) => {
        let p;
        const r = Math.random();
        if (talking) p = r < 0.85 ? [0, 0.05] : [-0.5, 0.1];
        else if (mood === "work") p = r < 0.55 ? [-0.75, 0.12] : r < 0.75 ? [-0.55, -0.3] : r < 0.9 ? [0, 0.05] : [0.35, 0.3];
        else if (mood === "wait") p = r < 0.7 ? [0, 0.05] : [-0.7, 0.05];
        else if (mood === "sad") p = r < 0.6 ? [0.1, -0.45] : [-0.3, -0.3];
        else p = r < 0.4 ? [0, 0.05] : r < 0.6 ? [-0.7, 0.1] : [(Math.random() - 0.5) * 1.2, (Math.random() - 0.4) * 0.7];
        attn.x = p[0] + (Math.random() - 0.5) * 0.12; attn.y = p[1] + (Math.random() - 0.5) * 0.1;
        attn.next = now + (talking ? 2500 : mood === "work" ? 1200 : 1500) + Math.random() * 3000;
        if (Math.random() < 0.35) blink.next = Math.min(blink.next, now + 60);   // 시선을 옮길 때 자주 깜빡임
        if (Math.random() < 0.3) browKick = Math.max(browKick, 0.25);
      };

      // ---- 말하기: 말풍선 글자의 모음으로 입 모양 ----
      // 한글 중성 21개 → 입 모양 (ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ)
      const JUNG = "AEAEOEOEOAEEOUOEIUUII";
      let talk = null;   // { syl: [{v, d, amp, stress}], t0, total, quiet }
      const startTalk = (text, ms, quiet) => {
        const syl = [];
        const words = String(text).split(/(\s+)/);
        for (const w of words) {
          if (/^\s+$/.test(w)) { syl.push({ v: null, d: 0.07 }); continue; }
          let first = true, prevVowel = false;
          for (const ch of w) {
            const c = ch.charCodeAt(0);
            if (c >= 0xac00 && c <= 0xd7a3) {
              syl.push({ v: JUNG[Math.floor(((c - 0xac00) % 588) / 28)], d: 0.15 + Math.random() * 0.05, amp: 0.65 + Math.random() * 0.35, stress: first });
              first = false;
            } else if (/[aeiouy]/i.test(ch)) {
              if (!prevVowel) { const l = ch.toLowerCase(); syl.push({ v: l === "a" ? "A" : l === "e" ? "E" : l === "o" ? "O" : l === "u" ? "U" : "I", d: 0.13 + Math.random() * 0.05, amp: 0.55 + Math.random() * 0.35, stress: first }); first = false; }
              prevVowel = true; continue;
            } else if (/[.,!?…~。，！？]/.test(ch)) syl.push({ v: null, d: ch === "," || ch === "，" ? 0.12 : 0.24 });
            else if (/[0-9]/.test(ch)) { syl.push({ v: "A", d: 0.12, amp: 0.7, stress: first }); first = false; }
            prevVowel = false;
          }
        }
        let total = syl.reduce((s, x) => s + x.d, 0);
        const limit = (ms || 3000) / 1000 * 0.92;
        if (total > limit && total > 0) { const k = limit / total; for (const x of syl) x.d *= k; total = limit; }   // 말풍선 시간 안에 끝나게
        talk = { syl, t0: performance.now(), total, quiet };
      };
      const VOW = ["A", "I", "U", "E", "O"];
      // 이 모델은 "이"·"에" 입 모양이 볼과 아래 눈꺼풀까지 올려 눈이 가늘어진다. 말할 때 눈 아래가 오르내리지 않게 약하게 씀
      const VOW_EYE_SAFE = { I: 0.45, E: 0.45 };
      const vowel = { A: 0, I: 0, U: 0, E: 0, O: 0 };
      let mouthOpen = 0, talkSway = 0, browKick = 0, browVal = 0, nodKick = 0, lastStressIdx = -1;   // browKick = 눈썹(귀) 목표, browVal = 실제로 부드럽게 따라가는 값
      let voiceState = null;   // 외부 음성 상태(선택): { speaking, level, vowels, until } | null — 없으면 예전 그대로

      const look = { x: 0, y: 0 };   // (터치·확인용으로 남겨 둔 값)
      const pose1 = { lean: 0, headZ: 0, headY: 0, bodyY: 0 };   // 자세 1단계 (S자 전환용)
      // 제스처 출력용 채널별 스프링. 게스처가 끝나거나 다른 반응으로 바뀌어도 그 순간의 속도를 이어받아 풀린다.
      //   머리(빠름) → 몸통(중간) → 팔·표정(늦음) 순으로 강성을 낮춰 시차를 만든다. 머리카락·꼬리는 모델 물리가 한 박자 늦게 따라온다.
      const gestS = {};
      const GEST_K = {
        yaw: [90, 19], pitch: [90, 19], roll: [90, 19],                 // 고개: 약 0.42초에 안정
        bodyX: [55, 14.8], bodyY: [55, 14.8], bodyZ: [55, 14.8], lean: [48, 13.8],   // 몸통: 약 0.5~0.6초
        smile: [40, 12.6], eyeSmile: [40, 12.6], eyeClose: [40, 12.6], mouth: [40, 12.6],   // 팔·표정: 약 0.65초
      };
      for (const ch in GEST_K) gestS[ch] = { x: 0, v: 0 };
      // 몸짓 곡선: 천천히 들어가서(0~35%) 머물렀다가(~70%) 천천히 돌아옴
      const sstep = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
      const holdCurve = (p, a = 0.35, b = 0.7) => (p < a ? sstep(p / a) : p > b ? sstep((1 - p) / (1 - b)) : 1);
      let blink = { next: performance.now() + 2000, start: -1e9, double: false }, lastT = performance.now();
      im.motionManager.expressionManager = {
        destroy() {},
        update() {
          const now = performance.now(), dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
          spring(dragLift, chestDragging ? chestTarget : 0, dt, chestDragging ? 820 : 200, chestDragging ? 40 : 6);   // 끄는 동안 민첩하게, 놓으면 출렁이며 잦아듦
          spring(dragShift, chestDragging ? chestShiftTarget : 0, dt, chestDragging ? 700 : 220, chestDragging ? 42 : 7);   // 좌우로 끌면 그 방향으로 따라가고, 놓으면 제자리로 출렁
          if (!chestDragging && Math.abs(dragShift.x) < 0.0001 && Math.abs(dragShift.v) < 0.001) dragShift.x = dragShift.v = 0;
          if (!chestDragging && Math.abs(dragLift.x) < 0.0001 && Math.abs(dragLift.v) < 0.001) dragLift.x = dragLift.v = 0;
          if (chestDragging) {
            flashExp("squint", 400); flashExp("blush", 400);
            walk.lastTouch = now;
          }
          const introCalm = intro.phase !== "done";   // 시작 화면(가운데에 크게): 눈·눈썹·귀를 차분하게
          const T = now / 1000;
          if (voiceState && voiceState.until && now > voiceState.until) voiceState = null;   // 만료된 음성 상태 비우기
          const talking = (voiceState?.speaking === true) || (bubble.classList.contains("show") && fleeX === 0);
          const muttering = talking && bubble.classList.contains("mutter");
          if (moodUntil && now > moodUntil) { mood = "idle"; moodUntil = 0; }

          // 움직임 크기: 대기 < 작업 < 말하기, 웃을 땐 크게, 시무룩하면 작게
          const laughing = gest.name === "laugh";
          const eTarget = (mood === "sad" ? 0.35 : mood === "wait" ? 0.55 : mood === "work" ? 0.75 : 0.6) + (talking && !muttering ? 0.35 : 0) + (laughing ? 0.5 : 0);
          energy += (eTarget - energy) * Math.min(1, dt * 1.5);

          // ---- 바라보는 곳 ----
          let tx, ty;
          if (now < stareUntil) { tx = 0; ty = 0.05; }                // 삐짐이 풀리며 한마디: 고개 고정, 눈 맞춤
          else if (muttering) { tx = 0.4; ty = 0.38; }                    // 혼잣말: 옆 위를 보며 생각
          else if (talking && introCalm) { tx = attn.x * 0.25; ty = 0.05 + attn.y * 0.2; }   // 시작 화면에서 말할 땐 보는 사람을 봄 (마우스·딴 곳을 따라가지 않음)
          else if (now - lastMove < 2500 && !talking) {             // 마우스를 움직이면 눈은 커서를, 고개는 반쯤
            const r = canvas.getBoundingClientRect();
            tx = clamp((mx - (r.left + r.width / 2)) / 600, -1, 1);
            ty = clamp(((r.top + r.height * 0.25) - my) / 500, -1, 1);
          } else {
            if (now > attn.next || (!introCalm && talking && Math.abs(attn.x) > 0.3 && Math.random() < dt * 2)) pickAttention(now, talking);
            tx = attn.x; ty = attn.y;
          }
          // 눈은 빠르게(휙), 고개는 천천히 따라감 → 눈이 먼저 가고 고개가 뒤따르는 버튜버 느낌
          const eyeK = introCalm ? 420 : 900, eyeD = introCalm ? 42 : 55;   // 시작 화면(크게 보일 때)은 눈이 튀지 않게 조금 부드럽게
          spring(ex, tx, dt, eyeK, eyeD); spring(ey, ty, dt, eyeK, eyeD);
          spring(hx, tx * 0.85, dt, 38, 9.5); spring(hy, ty * 0.8, dt, 38, 9.5);
          look.x = hx.x; look.y = hy.x;

          // ---- 말하기 (입 모양 · 고개 끄덕 · 눈썹) ----
          let open = 0;
          for (const k of VOW) vowel[k] *= Math.max(0, 1 - dt * 14);
          if (talk) {
            let t = (now - talk.t0) / 1000;
            if (t >= talk.total) talk = null;
            else {
              let i = 0; while (i < talk.syl.length && t > talk.syl[i].d) { t -= talk.syl[i].d; i++; }
              const s = talk.syl[i];
              if (s && s.v) {
                const p = t / s.d, env = Math.pow(Math.sin(Math.PI * Math.min(1, p)), 0.7);
                open = env * s.amp * (talk.quiet ? 0.3 : 1);
                vowel[s.v] = Math.max(vowel[s.v], open);
                if (s.stress && i !== lastStressIdx) {               // 낱말 첫소리: 눈썹 살짝(귀 쫑긋) + 가끔 끄덕
                  lastStressIdx = i;
                  if (!talk.quiet) { if (!introCalm) browKick = Math.max(browKick, 0.35 + Math.random() * 0.35); else if (Math.random() < 0.35) browKick = Math.max(browKick, 0.2 + Math.random() * 0.15); if (Math.random() < 0.45) nodKick = Math.max(nodKick, 0.6 + Math.random() * 0.5); }
                }
              }
            }
          }
          if (voiceState?.speaking) {   // 실제 재생 중이면 오디오 레벨·모음이 입 모양을 덮어쓴다
            open = clamp(voiceState.level, 0, 1) * 0.9;
            if (voiceState.vowels) for (const k of VOW) vowel[k] = Math.max(vowel[k] * 0.4, clamp(voiceState.vowels[k] || 0, 0, 1));
          }
          mouthOpen += (open - mouthOpen) * Math.min(1, dt * 16);   // 입은 조금 부드럽게 따라감 (너무 파닥거리지 않게)
          browKick *= Math.max(0, 1 - dt * (introCalm ? 2 : 3.5));
          browVal = introCalm ? browVal + (browKick - browVal) * Math.min(1, dt * 5) : browKick;   // 시작 화면에선 눈썹·귀가 툭 튀지 않고 부드럽게 오르내림
          nodKick *= Math.max(0, 1 - dt * 5);

          // ---- 상태별 자세 (작업 중 = 살짝 앞으로, 대기 = 숙이고 갸웃, 실패 = 고개 숙임) ----
          const goal = { lean: 0, headZ: 0, headY: 0, bodyY: 0 };
          if (mood === "work") { goal.lean = -7; goal.headY = -5; }          // 작업 중: 상체를 조금 내밀고 화면을 내려다봄
          if (mood === "wait") { goal.lean = -9; goal.headZ = 8; goal.headY = 3; }   // 대기: 다가와 갸웃하며 사용자를 올려다봄
          if (mood === "sad") { goal.headY = -10; goal.bodyY = -5; }
          const pk = Math.min(1, dt * 2.2);   // 두 단계로 따라가서 S자 곡선 (툭 끊기지 않게)
          for (const key in goal) { pose1[key] += (goal[key] - pose1[key]) * pk; pose[key] += (pose1[key] - pose[key]) * pk; }

          // ---- 고개 (AngleX/Y/Z): 시선 + 잔잔한 흔들림 + 말할 때 끄덕 ----
          let yaw = hx.x * 22 + noise(T * 0.33, 1) * 6 * energy;
          let pitch = hy.x * 13 + noise(T * 0.41, 2) * 4.5 * energy + pose.headY - nodKick * 4 - mouthOpen * 1.5;
          let roll = noise(T * 0.27, 3) * 7.5 * energy - hx.x * hy.x * 7 + pose.headZ;
          // 말하는 동안 고개를 천천히 좌우로 기울이고 살짝 돌림 (입만 움직이고 얼굴이 굳어 보이지 않게)
          stareW += ((now < stareUntil ? 1 : 0) - stareW) * Math.min(1, dt * 6);
          talkSway += ((talking && !muttering && now >= stareUntil ? 1 : 0) - talkSway) * Math.min(1, dt * 2.5);
          const swayYaw = Math.sin(T * Math.PI * 2 * 0.31 + 1.3) * 4.5 * talkSway, swayPitch = Math.sin(T * Math.PI * 2 * 0.47 + 0.6) * 1.5 * talkSway;
          if (talkSway > 0.01) { roll += Math.sin(T * Math.PI * 2 * 0.55) * 4 * talkSway; yaw += swayYaw; pitch += swayPitch; }
          // ---- 몸 (PositionX/Y/Z·LeanInput → 물리가 몸통을 늦게 따라 움직임) ----
          let bodyX = hx.x * 8 + noise(T * 0.17, 4) * 5 * energy;
          let bodyZ = roll * 0.5 + noise(T * 0.21, 5) * 3 * energy;
          spring(bob, 0, dt, 70, 6);   // 살짝 덜 감쇠: 한두 번 출렁이다 멈춤
          let bodyY = pose.bodyY + Math.sin(T * 2 * Math.PI / 3.6) * 1.8 + clamp(bob.x, -14, 14);   // 숨쉬기 + 튕김
          let lean = pose.lean, smile = 0, eyeSmileAdd = 0, eyeClose = 0, mouthAdd = 0;
          if (mood === "work") bodyZ += Math.sin(T * 2.1) * 1.2;        // 작업 중엔 리듬 타기

          // 제스처 출력은 바로 더하지 않고 채널별 스프링을 거쳐 더한다.
          //   반응이 끝나거나 다른 반응으로 바뀌어도 그 순간의 자세·속도에서 이어지고, 0.5~0.8초에 걸쳐 대기 자세로 풀린다.
          const GO = { yaw: 0, pitch: 0, roll: 0, bodyX: 0, bodyY: 0, bodyZ: 0, lean: 0, smile: 0, eyeSmile: 0, eyeClose: 0, mouth: 0 };
          if (gest.name) {
            const p = (now - gest.start) / gest.dur;
            if (p >= 1) {
              gest.name = null;
              nextIdleGesture = Math.max(nextIdleGesture, now + 2500 + Math.random() * 3500);   // 복귀 직후 대기 몸짓이 곧바로 붙어 다시 움직이지 않게
            } else {
              const env = Math.sin(Math.PI * p), d = gest.dir;
              switch (gest.name) {
                case "nod": GO.pitch -= Math.abs(Math.sin(p * Math.PI * 4)) * 11 * env; GO.bodyY -= Math.abs(Math.sin(p * Math.PI * 4)) * 3 * env; break;   // 끄덕끄덕 (몸도 살짝 따라 숙임)
                case "tilt": GO.roll += 15 * env * d; GO.bodyZ += 6 * env * d; GO.smile += env; break;                    // 고개 갸웃
                case "lean": { const h = holdCurve(p, 0.3, 0.72); GO.lean -= 12 * h; GO.pitch += 4 * h; GO.roll += 8 * h * d; GO.bodyX += 4 * h * d; GO.smile += 0.7 * h; break; }   // 다가와 들여다보기: 몸은 앞으로, 턱은 살짝 들어 화면을 봄
                case "sway": GO.bodyZ += Math.sin(p * Math.PI * 6) * 9 * env; GO.roll += Math.sin(p * Math.PI * 6) * 6 * env; GO.bodyX += Math.sin(p * Math.PI * 6) * 5 * env; GO.smile += env; break;   // 흔들흔들 (몸도 좌우로 → 가슴·머리카락 좌우 출렁임)
                case "bounce": GO.bodyY += Math.abs(Math.sin(p * Math.PI * 4)) * 8 * env; GO.bodyZ += Math.sin(p * Math.PI * 4) * 6 * env; GO.smile += env; break;   // 신나서 통통
                case "droop": GO.pitch -= 14 * env; GO.bodyY -= 6 * env; break;
                case "flinch": { const k = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85; GO.pitch -= 7 * k; GO.bodyY -= 3 * k; break; }   // 움찔
                case "bonk": { const k = p < 0.08 ? p / 0.08 : Math.pow(1 - (p - 0.08) / 0.92, 2); GO.pitch -= 22 * k; GO.bodyY -= 9 * k; GO.roll += 7 * k * d; GO.eyeClose += 0.6 * k; break; }   // 냄비에 맞음: 순간 푹 숙였다가 천천히 고개를 듦
                case "laugh":                                                                                      // ^^ 눈웃음 + 어깨 들썩
                  GO.eyeSmile += env; GO.eyeClose += env * 0.85; GO.smile += env;
                  { const hb = holdCurve(p, 0.25, 0.65), hh = holdCurve(Math.max(0, p - 0.08) / 0.92, 0.3, 0.6);   // 몸이 먼저, 고개가 조금 늦게
                    GO.lean -= 10 * hb; GO.pitch -= 9 * hh - (p > 0.7 ? 3 * Math.sin(Math.PI * (p - 0.7) / 0.3) : 0); GO.roll += 7 * hb * d; }
                  GO.bodyY += Math.abs(Math.sin(p * Math.PI * 7)) * 7 * env; GO.mouth += 0.45 * env;   // 어깨 들썩 (가슴도 같이 출렁)
                  break;
              }
            }
          }
          // 스프링을 거친 게스처 출력을 더한다 (게스처가 없을 땐 목표가 0이라 현재 속도에서 감속하며 대기 자세로 돌아간다)
          for (const ch in GO) { const gk = GEST_K[ch]; spring(gestS[ch], GO[ch], dt, gk[0], gk[1]); }
          yaw += gestS.yaw.x; pitch += gestS.pitch.x; roll += gestS.roll.x;
          bodyX += gestS.bodyX.x; bodyY += gestS.bodyY.x; bodyZ += gestS.bodyZ.x; lean += gestS.lean.x;
          smile += gestS.smile.x; eyeSmileAdd += gestS.eyeSmile.x; eyeClose += gestS.eyeClose.x; mouthAdd += gestS.mouth.x;
          if (!gest.name && mood === "idle" && now > nextIdleGesture && now >= sulkUntil) {   // 가만히 있을 때 가끔 몸짓 (삐진 동안은 안 함)
            const r = Math.random();
            const pick = r < 0.3 ? "tilt" : r < 0.5 ? "sway" : r < 0.72 ? "lean" : r < 0.88 ? "nod" : "laugh";
            play(pick, pick === "lean" ? 2600 : pick === "sway" ? 2300 : pick === "laugh" ? 1500 : 1800);
            nextIdleGesture = now + 7000 + Math.random() * 9000;
          }
          touchLean += ((now < touchLeanUntil ? -30 : 0) - touchLean) * Math.min(1, dt * 4);   // 가슴 터치 때 가끔 앞으로 숙임
          lean += touchLean;
          const se = (now - shiverStarted) / 1000;                   // 부끄러워 떨기 (5초에 걸쳐 잦아듦)
          if (se >= 0 && se < 5) {
            const tr = Math.sin(se * Math.PI * 2 * 8) * Math.min(1, se / 0.2) * Math.pow(1 - se / 5, 1.5);
            bodyZ -= tr * 3; roll += tr * 2;
            // 떨림은 너무 빨라 가슴 물리가 따라오지 못하므로, 0.2초 안팎으로 몸을 위아래로 툭툭 쳐서 가슴이 그 박자에 출렁이게 함 (잦아들면 같이 약해짐)
            if (now > shiverBobAt) { bobKick((shiverBobSign = -shiverBobSign) * 40 * Math.pow(1 - se / 5, 1.5)); shiverBobAt = now + 170 + Math.random() * 90; }
          }
          if (fleeX !== 0 && !walk.phase) bodyZ += Math.sin(T * 16) * 8;   // 도망가며 종종걸음
          // 산책: 걸어가는 쪽으로 몸을 돌리고 통통 걸음 (walk.face: -1 = 왼쪽을 봄, 1 = 오른쪽을 봄). 돌아올 땐 반대쪽을 봄
          const faceTo = walk.phase === "out" ? walk.dir : walk.phase === "in" ? -walk.dir : 0;
          walk.face += (faceTo - walk.face) * Math.min(1, dt * 5);
          const wa = Math.abs(walk.face);
          if (wa > 0.01) {
            const ph = T * Math.PI * 2 * 1.8, wf = walk.face;
            yaw = yaw * (1 - wa) + 22 * wf; pitch -= 2 * wa; roll += Math.sin(ph) * 2.5 * wa;
            bodyX += 6 * wf; bodyY += Math.abs(Math.sin(ph)) * 6 * wa; bodyZ += Math.sin(ph) * 4 * wa;
          }
          if (walkCheck) walkCheck(now);
          // 끌기·던지기: 움직이는 반대쪽으로 몸이 쏠리고(관성) 머리카락·치마·리본은 물리로 따라 흔들림. 손을 멈추거나 놓으면 잦아듦
          const lastSample = drag.samples.length ? drag.samples[drag.samples.length - 1][0] : 0;
          if (!drag.on || now - lastSample > 60) { const f = Math.max(0, 1 - dt * 5); carry.vx *= f; carry.vy *= f; }
          const cvx = clamp(carry.vx / 1600, -1, 1), cvy = clamp(carry.vy / 1600, -1, 1);
          if (Math.abs(cvx) + Math.abs(cvy) > 0.002) {
            bodyX -= cvx * 16; bodyZ -= cvx * 14; roll -= cvx * 12; yaw += cvx * 8;
            bodyY -= cvy * 12; pitch += cvy * 10;
          }
          // 삐짐: 0.35초에 턱을 들고 고개를 홱 돌리고, 끝나기 1.2초 전부터 천천히 돌아옴
          const sk = now < sulkUntil ? Math.min(sstep((now - sulkStart) / 350), sstep((sulkUntil - now) / 1200)) : 0;
          let peek = 0;   // 몰래 보기 정도 (0 = 외면, 1 = 사용자 쪽을 봄)
          if (sk > 0) {
            const ts = now - sulkStart;
            for (const p of sulkPeeks) {
              const u = ts - p.at;
              if (u < 0 || u > PEEK_RISE + PEEK_HOLD + PEEK_SNAP) continue;
              if (u >= PEEK_RISE + PEEK_HOLD && !p.done) { p.done = true; if (p.flip) sulkDir = -sulkDir; }   // 다시 외면할 때 60% 확률로 반대쪽으로
              peek = u < PEEK_RISE ? sstep(u / PEEK_RISE) : u < PEEK_RISE + PEEK_HOLD ? 1 : 1 - sstep((u - PEEK_RISE - PEEK_HOLD) / PEEK_SNAP);
            }
            const away = 1 - 0.75 * peek, k = Math.min(1, dt * 14);   // 고개는 빠르게 따라가서 방향을 바꿀 때 홱 돌아감
            sulkYaw += (-24 * sulkDir * away - sulkYaw) * k;
            sulkRoll += (-8 * sulkDir * away - sulkRoll) * k;
            yaw = yaw * (1 - sk) + sulkYaw * sk; roll = roll * (1 - sk) + sulkRoll * sk;
            pitch = pitch * (1 - sk) + SULK_CHIN * (1 - 0.6 * peek) * sk;
            bodyX = bodyX * (1 - sk) + sulkYaw / 6 * sk; smile *= 1 - sk; eyeSmileAdd *= 1 - sk;
          }
          const sulkEye = sulkDir * (-0.45 + 0.85 * Math.min(1, peek * 1.8));   // 외면할 땐 눈도 피하고, 몰래 볼 땐 눈이 먼저 사용자 쪽으로

          if (stareW > 0.01) { const k = 1 - stareW * 0.92; yaw = hx.x * 22 * (1 - stareW) + (yaw - hx.x * 22) * k; pitch *= k; roll *= k; bodyX *= k; bodyZ *= k; }   // 눈 맞춤 동안 얼굴·몸 흔들림을 거의 멈춤
          yaw = clamp(yaw, -30, 30); pitch = clamp(pitch, -30, 30); roll = clamp(roll, -30, 30);
          for (const [id, v] of [["AngleX", yaw], ["AngleY", pitch], ["AngleZ", roll], ["ParamAngleX", yaw], ["ParamAngleY", pitch], ["ParamAngleZ", roll],
            ["PositionX", clamp(bodyX, -30, 30)], ["PositionY", clamp(bodyY, -30, 30)], ["PositionZ", clamp(bodyZ, -30, 30)], ["LeanInput", clamp(lean, -30, 30)]]) core.addParameterValueById(id, v);

          // ---- 눈: 눈동자는 고개보다 먼저 (머리 기준 상대 위치) ----
          // 눈동자는 작게만 (크게 움직이면 흰자가 드러나 곁눈질처럼 보임)
          core.addParameterValueById("ParamEyeBallX", clamp(((ex.x - hx.x) * 0.9 + hx.x * 0.2) * 0.6, -0.45, 0.45) * (1 - sk) + sulkEye * sk - swayYaw / 30 * (1 - sk));   // 말하며 고개를 돌려도 눈동자는 정면을 봄
          core.addParameterValueById("ParamEyeBallY", clamp(((ey.x - hy.x) * 0.9 + hy.x * 0.2) * 0.6 - swayPitch / 30, -0.3, 0.3));
          core.setParameterValueById("ParamBreath", 0.5 + 0.5 * Math.sin(T * 2 * Math.PI / 3.6));

          // ---- 눈썹 (귀가 따라 움직임) ----
          const brow = browVal + noise(T * 0.5, 7) * 0.12 + (mood === "wait" ? 0.25 : mood === "sad" ? -0.3 : 0) - 0.15 * happyMouth;
          if (happyMouth > 0.01) core.addParameterValueById("BrowInnerUp", 0.55 * happyMouth);   // 곤란한 눈썹 (안쪽 끝이 올라감)
          core.addParameterValueById("ParamBrowLY", clamp(brow, -1, 1));
          core.addParameterValueById("ParamBrowRY", clamp(brow + noise(T * 0.6, 8) * 0.06, -1, 1));
          if (browVal > 0.15) core.addParameterValueById("BrowInnerUp", Math.min(1, browVal * 0.6));

          // ---- 입: 모음 모양 + 늘 살짝 웃는 입꼬리 ----
          const openNow = clamp(mouthOpen + mouthAdd + 0.14 * happyMouth, 0, 1);   // 살짝 벌린 입
          if (openNow > 0.01) {
            core.setParameterValueById("ParamMouthOpenY", openNow * 0.9);
            core.addParameterValueById("JawOpen", openNow * 0.45);
            core.setParameterValueById("ParamSilence", 1 - openNow);
            for (const k of VOW) if (vowel[k] > 0.01) core.addParameterValueById("Param" + k, Math.min(1, vowel[k]) * (VOW_EYE_SAFE[k] || 1));
            if (mouthAdd > 0.01) core.addParameterValueById("ParamA", mouthAdd * 0.8);
          }
          happyMouth += ((now < happyMouthUntil ? 1 : 0) - happyMouth) * Math.min(1, dt * 5);
          const baseSmile = (mood === "sad" ? 0 : mood === "wait" ? 0.15 : 0.35) * (1 - sk) + 0.2 * happyMouth;   // 부끄럽지만 좋아서 입꼬리가 조금 올라감 (곤란함이 섞여 크게는 안 웃음)
          if (sk > 0.01) for (const [id, eased] of [["CheeckPuff", 0.5], ["Mouthpucker", 0.3], ["Angry", 0.5], ["Angry2", 0.5]]) core.addParameterValueById(id, sk * (1 - eased * peek));   // 볼 부풀리기·입 삐죽·찡그린 눈썹 (몰래 볼 땐 조금 풀림)
          core.addParameterValueById("ParamMouthForm", clamp(baseSmile + smile * 0.4, -1, 1));
          core.addParameterValueById("MouthSmile_L", clamp(baseSmile + smile * 0.5 + 0.3 * happyMouth, 0, 1));   // 한쪽만 더 올라간 어색한 웃음
          core.addParameterValueById("MouthSmile_R", clamp(baseSmile + smile * 0.5 + noise(T * 0.3, 9) * 0.05, 0, 1));
          const eSmile = clamp((mood === "sad" ? 0 : 0.12) + smile * 0.35 + eyeSmileAdd, 0, 1);
          if (eSmile > 0.01) core.addParameterValueById("EyeSmile", eSmile);

          // ---- 눈 깜빡임: 2~6초 불규칙, 가끔 두 번 ----
          if (now >= blink.next && !laughing) {
            blink.start = now;
            blink.next = blink.double ? now + 2000 + Math.random() * 4000 : (Math.random() < 0.18 ? now + 260 : now + 2000 + Math.random() * 4000);
            blink.double = !blink.double && blink.next - now < 400;
          }
          const bt = (now - blink.start) / 1000;
          const blinkClose = bt < 0.07 ? bt / 0.07 : bt < 0.1 ? 1 : bt < 0.22 ? 1 - (bt - 0.1) / 0.12 : 0;
          const eyeOpen = clamp((mood === "work" ? 0.92 : 0.97) * (1 - blinkClose) * (1 - eyeClose), 0, 1.2);
          core.setParameterValueById("ParamEyeLOpen", eyeOpen); core.setParameterValueById("ParamEyeROpen", eyeOpen);

          for (const [name, params] of Object.entries(exp)) {
            const target = hold[name] || (until[name] || 0) > now ? 1 : 0;
            // 하트·><·얄미운·빙글빙글 눈은 눈 그림 자체를 바꾸므로 한 번에 바꾸고, 그 순간 깜빡여 감춤
            const EYE_SWAP = name === "heart" || name === "squint" || name === "smug" || name === "dizzy";
            if (EYE_SWAP && (weight[name] > 0.5) !== (target > 0.5)) { blink.start = now - 0.07 * 1000; blink.next = Math.max(blink.next, now + 1500); }
            const w = weight[name] = EYE_SWAP ? target : (weight[name] || 0) + (target - (weight[name] || 0)) * Math.min(1, dt * 6);
            if (w < 0.01) continue;
            for (const p of params) {
              if (p.Blend === "Multiply") core.multiplyParameterValueById(p.Id, p.Value, w);
              else if (p.Blend === "Add") core.addParameterValueById(p.Id, p.Value, w);
              else core.setParameterValueById(p.Id, p.Value, w);
            }
          }
          // ---- 왼손 가슴 가리기 ----
          // 몸 앞 팔 그림은 아래팔 0.15~0.7 구간에서 손이 몸 바깥으로 크게 돌아 나가게 그려져 있어,
          // 그 구간은 짧게(전체의 20%) 지나가고 가슴 근처(0.7 이후)에서 천천히 다가가 살짝 넘쳤다 자리 잡게 한다. 내릴 땐 같은 길을 거꾸로
          {
            const leaning = now < touchLeanUntil || touchLean < -2;   // 앞으로 숙이는 동안엔 손을 움직이지 않음
            const want = now >= cover.start && now < cover.until && bodyW < 0.5 && fleeX === 0 && !leaning;   // 꼬마·산책·도망 중에도 안 함
            const q0 = cover.q;
            cover.q = clamp(cover.q + (want ? 1 : -1) * dt / 0.38, 0, 1);   // 올리는 데 0.38초
            if (cover.q > 0) {
              const q = cover.q, seg = (a, b, x) => clamp((x - a) / (b - a), 0, 1);
              // 아래팔: 0~25% 살짝 들기(→0.15), 25~45% 바깥 구간 빠르게(→0.7), 45~80% 가슴으로(→0.89), 80~100% 자리 잡기(→0.86)
              const fore = q < 0.25 ? 0.15 * sstep(q / 0.25) : q < 0.45 ? 0.15 + 0.55 * seg(0.25, 0.45, q) : q < 0.8 ? 0.7 + 0.19 * sstep(seg(0.45, 0.8, q)) : 0.89 - 0.03 * sstep(seg(0.8, 1, q));
              const breath = Math.sin(T * Math.PI * 2 * 0.4) * 0.02 * sstep(seg(0.8, 1, q));   // 가린 채로도 미세하게 움직임
              const vel = (cover.q - q0) / Math.max(dt, 1e-3);   // 움직이는 중에만 손목이 늦게 따라오며 꺾임
              core.setParameterValueById("Movement2", 1);   // 몸 앞용 팔 그림 (손이 다 내려올 때까지 유지)
              core.addParameterValueById("Param62", 0.034 * sstep(q));
              core.addParameterValueById("Param59", 0.48 * sstep(seg(0, 0.6, q)));   // 위팔 원근은 아래팔보다 먼저
              core.addParameterValueById("Param60", fore + breath);
              core.addParameterValueById("Param61", clamp(vel * 0.06, -0.2, 0.2) * Math.sin(Math.PI * q));
            }
          }
          // ---- 소품·옷·체형 (플러그인 설정 → window.__dscOutfit) ----
          const of = window.__dscOutfit || {};
          for (const [key, id, v] of OUTFIT_PARAMS) {
            const w = outfitW[key] = (outfitW[key] || 0) + ((of[key] ? 1 : 0) - (outfitW[key] || 0)) * Math.min(1, dt * 6);
            if (w > 0.005) core.addParameterValueById(id, v * w);
          }
          const walkingBody = walk.phase === "out" || walk.phase === "away" || walk.phase === "in" || SLEEP.state === "leaving" || SLEEP.state === "waking";   // 산책은 꼬마 모습으로 (데스크톱 펫과 같음)
          basinW += ((now < basinUntil ? 1 : 0) - basinW) * Math.min(1, dt * 4);   // 세숫대야는 천천히 씌우고 천천히 벗음
          if (basinW > 0.005) core.addParameterValueById("key10", basinW);
          bodyW += ((walkingBody ? 1 : BODY_VALUE[of.bodyType] || 0) - bodyW) * Math.min(1, dt * 4);   // 체형은 조금 천천히 바뀜
          if (bodyW > 0.002) core.addParameterValueById("Clothes2", bodyW);
          model.y = baseY + chibiDrop * clamp(bodyW, 0, 1);
          if (outfitPrev && outfitTalk) {   // 켜는 순간 한마디 (처음 불러올 때는 말 안 함)
            for (const [key] of OUTFIT_PARAMS) if (of[key] && !outfitPrev[key]) outfitTalk(OUTFIT_LINE[key]);
            if ((of.bodyType || "default") !== (outfitPrev.bodyType || "default")) outfitTalk("body_" + (of.bodyType || "default"));
          }
          outfitPrev = { ...of };
        },
      };

      // ---------- 터치 (데스크톱 펫과 같은 부위 판정) ----------
      // 대사: 펫 코드(lines.js)에 든 기본 대사 + 기본 대사가 없는 상황만 짧게 채움. [표정] 꼬리표로 표정 지정.
      const LINES = {
        head: [
          "[어두운, 얄미운] …거긴, 그렇게 쓰다듬지 마세요. 버릇 들면 어쩌려고요.",
          "[어두운, 얄미운] …주인님, 그 손… 계속 두실 생각이세요?",
          "[어두운, 얄미운] …한 번만 봐드리는 거예요.",
          "[어두운, 얄미운] …머리카락 엉키면, 내일 아침에 빗겨 주셔야 해요.",
          "[어두운, 얄미운] …손 놓으세요. 그렇게 보시면… 저도 참아야 하잖아요.",
          "[어두운, 얄미운] …이번엔 그냥 넘어갈게요. 착한 척은 여기까지예요.",
        ],
        head_sulk: [
          "[홍조] 흥! 그럼 오늘은 안아 드리지 않을 거예요!",
          "[홍조] 흥, 나중에 후회하실 거예요…!",
          "[홍조] …만질 거면, 아예 달래 주시던가요.",
          "[홍조] 흥! 등 돌리고 있을 거예요. …곁에 있으면 안 되지만.",
          "[홍조] …한 번만 더 그러시면, 진짜 삐질 거예요.",
        ],
        head_after: [
          "[홍조] …이번만 봐주는 거예요. 다음엔… 각오하세요.",
          "[홍조] …다음엔 진짜, 책임지셔야 해요.",
          "[홍조] 후… 이제 됐어요. …손은 아직 놓지 마시고요.",
          "[홍조] …이번 일은 비밀로 해 드릴게요. 대신, 나중에.",
          "[홍조] …주인님 나쁜 손. 오늘은 그렇게 기억해 둘게요.",
        ],
        // 소품·옷·체형을 바꿨을 때 (데스크톱 펫 대사.md와 같은 대사)
        outfit_glasses: [
          "안경 쓴 비서… 오늘 밤은 엄격하게 굴어 드릴까요, 주인님?",
          "이런 지적인 얼굴… 마음에 드세요? 렌즈 너머로 다 보여요♪",
          "주인님 취향이… 이런 쪽이었나요? 메모해 둘게요♪",
          "안경 쓴 채로 보는 얼굴… 꽤 위험한데요. 감당하시겠어요?",
          "선생님, 숙제 다 했어요. …칭찬은 어떻게 해 주실 거예요?",
        ],
        outfit_shoes: [
          "주인님 앞에서 신발까지 벗다니… 이제 도망칠 데도 없네요",
          "[홍조] 앗… 맨발을 그렇게 보시면… 발끝이 저려요…",
          "바닥이 차가워요… 안아 올려 주실 거죠?",
          "[얄미운] 발끝만 보시는 거예요? …조금 서운한데요.",
        ],
        outfit_tail: [
          "꼬리 숨기니… 기분을 들키지 않겠네요♪ …입꼬리는 못 숨기지만요",
          "쉿, 이건 주인님만 아는 거예요~",
          "[얄미운] 꼬리로 감으면… 붙잡히지 않을 자신 있는데요?",
          "꼬리 끝까지 다 보이니까… 이제 숨기는 건 없네요.",
        ],
        outfit_clothes: [
          "[홍조] 앗… 이 옷, 생각보다 몸에 붙어서… 시선이 어디 가는지 아시죠?",
          "에헤헤, 좋다면… 조금 더 가까이 가도 돼요…",
          "[><, 홍조] 주, 주인님… 눈이 너무 노골적이세요…!",
          "[하트] 이 정도면… 만족하실 수 있어요? 아니면… 더?",
          "[홍조] 움직일 때마다… 느껴져서, 조금 곤란해요…",
          "[얄미운] 굳이 안 벗어도 괜찮죠. …필요하시면 말씀하시고요♪",
        ],
        body_default: [
          "익숙한 몸으로 돌아왔네요… 이게 제일 좋으시죠? 다 보이는데요",
          "원래 모습으로 복귀 완료! …다시 유혹해 볼까요♪",
          "역시 익숙한 게 좋으세요? …손이 먼저 움직이시네요.",
          "이 모습이 가장 편하다고… 그렇게 말씀하셨죠? 잘 기억해요.",
        ],
        body_type1: [
          "어라… 몸매가 달라 보이지 않나요, 주인님? …어디가요?",
          "평소보다 색다른 느낌인데… 직접 확인하실 거예요?",
          "이 몸엔… 주인님 시선이 더 붙는 것 같네요. 기분 탓인가요?",
          "[얄미운] 어느 쪽이 마음에 드세요? …정직하게 말해 주세요.",
        ],
        body_type2: [
          "앗, 작아졌어요! …안아 주시면 커질지도 몰라요♪",
          "[하트] 꼬마 모습이 됐어요… 무릎에 앉혀 주세요~",
          "작아도… 할 일은 다 할 수 있어요. 믿어 주세요♪",
          "[하트] 이 모습, 귀여우세요? …아니면 다른 게 좋으세요?",
          "작은 손으로도… 주인님 옷자락은 잘 잡아요.",
        ],
        basin_on: [
          "[하트] 밥 먹을 시간이에요? …입 벌려 주세요♪",
          "[얄미운] 세숫대야 쓴 채로 먹는 거… 생각보다 불편해요.",
          "잘 먹을게요. …다 먹으면 칭찬해 주세요.",
        ],
        pot_guard: [
          "[얄미운] 후훗, 이 정도는… 주인님 손길보다 약해요~",
          "[얄미운] 후훗, 제가 막을 줄 몰랐죠? 칭찬해 주세요♪",
          "[하트] 방어 성공이에요! 이번 판은 제 승리네요.",
          "[얄미운] 냄비보다 가벼운 손길이었어요. 아쉽네요♪",
          "[하트] 막았으니까… 이제 쓰다듬어 주실 차례죠?",
        ],
        pot_hit: [
          "[눈물] 아야야…! 머리 아파요…",
          "[눈물] 으앗! 별이 보여요…",
          "[눈물] …방금 그거 냄비였죠?!",
          "[눈물] 이마가… 좀 부풀었죠? 나중에 불어 주세요…",
          "[눈물] 아파서 그래요… 잠깐만 안아 주세요. 진짜로.",
        ],
        walk_out: [
          "산책 좀 다녀올게요~ …따라오시면 안 돼요♪",
          "잠깐 바람 쐬고 올게요! 몸 좀 풀고요",
          "다리 좀 풀고 올게요~ 금방 올게요",
          "혼자 걷는 게 좋아요. …돌아올 땐 옆에 있어 주세요.",
          "바람이 좋아서요. 이 기분, 같이 나누고 싶네요.",
        ],
        walk_back: [
          "다녀왔어요! …기다리셨죠? 얼굴에 쓰여 있어요♪",
          "산책 끝! 그새 보고 싶으셨어요?",
          "[하트] 다녀왔어요~ 안아 주세요.",
          "금방 다녀왔는데… 왜 벌써 반가운 거예요.",
          "[홍조] 발이 차가워졌어요… 손 좀 잡아 주시겠어요?",
        ],
        body: [
          "[하트] 불렀어요? …손, 잡아 주세요.",
          "[홍조] 왜요… 그렇게 빤히 보시면 더 부끄러운데.",
          "[얄미운] 흐응~? 만지고 싶으신 거죠?",
          "[식은땀] 앗, 깜짝이야! …놀라면 심장에 안 좋아요.",
          "[하트, 홍조] 오늘도 화이팅이에요! …조금 가까이 있어도 돼요?",
          "[얄미운] 그렇게 부르시면… 거절할 수 없잖아요.",
          "[홍조] 옆에 있으면 마음이 놓여요. …그러니까 계속 있어 주세요.",
          "[하트] 한 번 불러 주시면… 하루 종일 기분이 좋아요.",
        ],
        arm: [
          "[홍조] 손 잡고 싶으신 거예요? …놓치면 안 돼요.",
          "[홍조] 팔은 왜요~? …팔찌라도 채워 주실 거예요?",
          "[얄미운] 그렇게 붙잡으면… 도망칠 맘도 없어지잖아요.",
          "손끝이 따뜻해요… 조금만 더 있어 주세요.",
          "[홍조] 팔에 힘이 들어오시는데… 저, 이러면 못 움직여요.",
        ],
        leg: [
          "[식은땀, 홍조] 다, 다리는… 아직 안 돼요…!",
          "[식은땀, 홍조] 거기 만지면… 힘이 확 풀려요…!",
          "[홍조, ><] 으… 무릎은… 그렇게 안아 주시면 안 돼요…!",
          "[식은땀, 홍조] 서 있는 것도 벅차요… 놓아 주세요…",
          "[홍조, 하트] 거기, 감각이 예민하다니까요…",
        ],
        chest1: [
          "[홍조, 얄미운] 앗… 거긴… 그렇게 세게 하면 안 돼요.",
          "[홍조, 얄미운] 제 반응이 그렇게 궁금하세요…? 나쁜 주인님.",
          "[홍조, ><] 잠깐… 거기, 옷 위로도 다 느껴져요…",
          "[홍조, 얄미운] 손끝이… 너무 정확하신데요…?",
          "[홍조, 얄미운] 한 번은 봐드릴게요… 딱 한 번만이에요.",
          "[홍조, ><] 아… 그렇게 갑자기 만지시면… 숨이 멈춰요…",
          "[홍조, 얄미운] 앗…! 아직 마음의 준비도 안 했는데요…",
          "[홍조, ><] 손… 손이 너무 빨라요…!",
          "[홍조, 얄미운] 그렇게 놀라게 하시면… 반응이 다 보이잖아요.",
          "[홍조, ><] 잠깐… 여기, 사람 있는 데서는…",
          "[홍조, 하트] 지금… 일부러 그러신 거죠?",
          "[홍조, 얄미운] 옷 위로도 이렇게 느껴지는데… 어쩌죠?",
          "[홍조, ><] 앗… 그 손가락, 거기 두지 마세요…",
          "[홍조, 식은땀] 하… 갑자기 숨이 막혀서…",
          "[홍조, 얄미운] 주인님은… 이런 거 잘 아시네요.",
          "[홍조, 하트] 한 번만… 정말 한 번만이라고 했는데.",
          "[홍조, ><] 으… 이거, 웃으면서 넘길 일이 아니에요…",
          "[홍조, 얄미운] 거기, 손끝이 아직도 남아 있는데요…",
          "[홍조, 식은땀] 숨… 조금만 정리하게 해 주세요.",
          "[홍조, ><] 아… 아직 마음 준비가…",
          "[홍조, 하트] 그렇게 만지시면… 저, 나중에 못 참아요.",
          "[홍조, 얄미운] 한 번 더 하시면… 저도 방법을 생각해 볼게요.",
          "[홍조, ><] 앗, 거긴… 옷이 얇아서…",
          "[홍조, 식은땀] 잠깐만… 손 좀 내려 주세요… 아니, 그대로…",
          "[홍조, 하트] 지금 그 표정… 마음에 들어요.",
          "[홍조, 얄미운] …이번 건, 나중에 청구할 거예요.",
        ],
        chest2: [
          "[하트, 홍조] 자꾸 그러면… 숨소리가 이상해지잖아요!",
          "[하트, 홍조] 으으… 장난치지 말아 주세요… 손에 힘이 없어져요…",
          "[하트, 홍조] 하아… 그렇게 만지작거리면… 저도 모르게 몸이…",
          "[홍조, 식은땀] 잠깐… 이거, 그만두실 생각 없으시죠…?",
          "[하트, 홍조] 주인님 손… 너무 따뜻해서 자꾸 기대게 돼요…",
          "[하트, ><] 으… 소리 내면 안 되는데… 참는 게 더 힘들어요…",
          "[하트, 홍조] 제가… 이상한 표정 짓고 있죠? 보지 마세요…",
          "[홍조, 식은땀] 손 떼 주세요… 이대로면 제가 먼저 무너져요…",
          "[하트, 홍조] 하아… 이제… 자꾸 손이 가잖아요…",
          "[하트, ><] 으… 숨소리, 주인님한테 다 들려요…",
          "[하트, 홍조] 잠깐만… 저, 지금 표정 관리가 안 돼요…",
          "[홍조, 식은땀] 하… 거기, 계속 만지면… 무릎 힘이…",
          "[하트, 홍조] 주인님 손, 왜 이렇게 따뜻해요…",
          "[하트, ><] 으으… 이러면 저, 아무 말도 못 해요…",
          "[하트, 홍조] 자꾸 그러시면… 제가 먼저 손을 잡을지도 몰라요.",
          "[홍조, 식은땀] 하아… 이거, 장난이 아니잖아요…",
          "[하트, 홍조] 소리… 소리 내면 안 되는데…",
          "[하트, ><] 잠깐… 살짝만… 천천히…",
          "[홍조, 하트] 저… 지금 얼굴, 보지 마세요…",
          "[하트, 홍조] 심장이 너무 뛰어서… 주인님 손에 다 느껴질 거예요.",
          "[하트, ><] 으… 옷자락 좀… 정리하게 해 주세요…",
          "[홍조, 식은땀] 하아… 이대로 있으면… 저, 이상해져요…",
          "[하트, 홍조] 주인님… 이거, 언제 멈추실 거예요…?",
          "[하트, ><] 아… 아직… 마음 준비 안 됐다니까요…",
          "[홍조, 하트] 손끝이 움직일 때마다… 저도 따라 움직여요…",
          "[하트, 식은땀] 잠깐… 숨 좀… 쉬게 해 주세요…",
          "[하트, 홍조] 이런 거… 익숙해지면 안 되는데…",
          "[홍조, ><] 주인님… 웃지 마세요… 지금 제가 우습죠…?",
        ],
        chest3: [
          "[하트, 홍조] 이제… 진짜 부끄러우니까 잠깐만요!",
          "[홍조, 식은땀] 더 하시면… 저, 가만히 못 있어요…!",
          "[하트, 눈물] 그만… 그만해 주세요… 심장이 터질 것 같아요…",
          "[하트, 홍조] 주인님… 이러다 정말… 되돌릴 수 없게 돼요…",
          "[홍조, ><] 으으… 이제 팔에 힘이 안 들어가요…",
          "[홍조, 식은땀] 이제… 정말 그만해 주세요…!",
          "[하트, 눈물] 으으… 저, 이제 한계예요…",
          "[홍조, ><] 더 하시면… 쓰러질지도 몰라요…",
          "[하트, 식은땀] 잠깐… 잠깐만… 숨이…",
          "[홍조, 눈물] 주인님… 이러다 진짜…!",
          "[하트, ><] 으아… 이제 팔에 힘이…",
          "[홍조, 식은땀] 그만… 부탁이에요… 이러다간…",
          "[하트, 눈물] 저… 눈물 날 것 같아요…",
          "[홍조, ><] 잠깐… 이건… 너무해요…",
          "[하트, 식은땀] 하아… 아직… 끝난 것도 아닌데…",
          "[홍조, 눈물] 주인님… 손… 놓아 주세요… 아니, 그대로…",
          "[하트, ><] 으으… 이제… 아무 생각도 안 나요…",
          "[홍조, 식은땀] 잠깐만… 머리가… 어지러워요…",
          "[하트, 눈물] 이러다… 저, 울어 버릴 것 같아요…",
          "[홍조, ><] 제발… 조금만 쉬게 해 주세요…",
          "[하트, 식은땀] 하아… 지금 제 얼굴… 부끄러워요…",
          "[홍조, 눈물] 주인님은… 진짜… 못 말리겠어요…",
          "[하트, ><] 으으… 이제… 제가 뭘 하는지도…",
          "[홍조, 식은땀] 이제… 정말 안아 주세요… 그만하고…",
          "[하트, 눈물] …이번엔, 제가 먼저 항복할게요…",
        ],
        chest_calm: [
          "[하트, 홍조] 후우… 심장이 아직도 두근거려요.",
          "[홍조, 얄미운] …이제 진정됐어요. 다음엔 각오하세요.",
          "[하트, 홍조] 이런 얼굴… 처음 보여 드리는 거예요.",
          "[홍조] …잠깐만 이대로 있게 해 주세요. 아직 다리가 후들거려요.",
          "[하트, 홍조] 후… 아직… 다리 힘이 안 들어오네요.",
          "[홍조] …조금만 더 이렇게 있어 주세요.",
          "[하트, 홍조] 이제… 말할 수 있을 것 같아요. …아니, 아직.",
          "[홍조, 얄미운] …다음엔, 제가 먼저 할지도 몰라요.",
          "[하트] 자꾸 생각나요… 아까 그 느낌.",
          "[홍조] …지금 얼굴 보이면 안 되는데, 늦었죠.",
          "[하트, 홍조] 숨은 돌아왔는데… 마음이 안 진정돼요.",
          "[홍조, 얄미운] …주인님 손, 인제 다 알겠네요.",
          "[하트] 이런 거… 자주 하면 저 먼저 지치는 거 아닐까요.",
          "[홍조] …앉아 있을게요. 잠깐만.",
          "[하트, 홍조] 손, 아직 떼지 마세요… 아니, 떼 주세요…",
          "[홍조, 얄미운] …오늘 일은, 저만 아는 걸로 해 둘게요.",
          "[하트] 심장… 아직도 응원 소리 같아요.",
          "[홍조] …다음에 또 그러실 거죠? 대답 안 하셔도 알아요.",
          "[하트, 홍조] 이제 제 눈 똑바로 못 보세요, 주인님.",
          "[홍조, 얄미운] …손끝, 기억났어요. 이 정도면 됐죠?",
          "[하트] 잠깐… 웃음이 안 멈춰요. 이상하죠.",
          "[홍조] …저 더워요. 창문 좀…",
          "[하트, 홍조] 이제 조금… 진정되었어요. 조금만요.",
          "[홍조, 얄미운] …다음엔 안 봐드릴 거예요. 진짜로.",
        ],
        chest_pull: [
          "[홍조, ><] 아흣…?! 그, 그쪽은…!",
          "[홍조, ><] 히잇…! 거기 잡으면… 몸이 이상해져요…!",
          "[홍조, 하트] 으으… 거긴… 예민한 데라고요…",
          "[홍조, ><] 자, 잠깐… 그렇게 당기면… 모양이…!",
          "[홍조, 식은땀] 하앗…! 손… 힘 좀 빼 주세요… 숨이…",
          "[홍조, 하트] 으… 그렇게 만지면… 몸에 힘이 하나도 안 들어가요…",
          "[홍조, ><] 주, 주인님…! 이런 건… 밤에 하세요…!",
          "[홍조, 하트] 하아… 일부러 그러시죠… 재미있으세요…?",
          "[홍조, ><] 엇…! 거기, 위로… 그렇게 끌어올리면…!",
          "[홍조, 식은땀] 으으으… 손대지 마세요… 아니, 놓지도 마시고요…",
          "[홍조, ><] 주인님 손가락… 너무 정확해요… 그런 데까지…",
          "[홍조, 하트] 숨이… 잘 안 쉬어져요… 조금만 천천히…",
          "[홍조, ><] 으앗…! 그렇게 한 번에…!",
          "[홍조, 식은땀] 하앗… 거기, 힘 빼면 안 돼요…",
          "[홍조, ><] 앗… 손이… 손이 떨려서…",
          "[홍조, 하트] 그만… 위로 올리지 마세요…",
          "[홍조, ><] 으으… 이거, 생각보다…!",
          "[홍조, 식은땀] 잠깐… 숨이… 안 쉬어져요…",
          "[홍조, ><] 아… 옷이… 옷이 걸려서…",
          "[홍조, 하트] 주인님… 조금만… 살살요…",
          "[홍조, ><] 으… 거긴 잡는 게 아니에요…",
          "[홍조, 식은땀] 하아… 이러다 진짜…",
          "[홍조, ><] 손가락… 하나씩 다 느껴져요…",
          "[홍조, 하트] 잠깐만… 마음 준비…",
          "[홍조, ><] 아앗… 조금만 천천히…!",
          "[홍조, 식은땀] 으으… 저, 소리 낼 것 같아요…",
          "[홍조, ><] 주인님… 이거, 놀이가 아니죠…?",
          "[홍조, 하트] 그렇게 당기시면… 몸이 따라올라와요…",
          "[홍조, ><] 잠깐… 손이 미끄러져요…!",
          "[홍조, 식은땀] 하… 하아… 조금만 쉬게…",
          "[홍조, ><] 거기… 정말 예민하다니까요…",
          "[홍조, 하트] …계속 이러시면, 저도… 각오할게요.",
        ],
        chest_pull_long: [
          "[홍조, 하트] 하아… 아직도… 놓지 않으실 거예요…?",
          "[홍조, ><] 으으… 이러다간… 제가 먼저… 이상해져요…",
          "[홍조, 하트] 잠깐… 그만… 몸에 힘이 풀려서… 녹아내릴 것 같아요…",
          "[홍조, 식은땀] 하앗… 손 떼 주세요… 이러다… 소리 낼지도 몰라요…",
          "[홍조, 하트] 주인님… 너무해요… 이런 건… 반칙이라고요…",
          "[홍조, ><] 히으… 계속 그러시면… 저… 참을 수 없어요…",
          "[홍조, 하트] 으… 머리가… 하얘져서… 아무것도 안 보여요…",
          "[홍조, 얄미운] 하아… 이렇게까지 하실 거면서… 놀리기만 하시고…",
          "[홍조, 하트] 하아… 이거… 언제까지 하실 거예요…?",
          "[홍조, ><] 저… 이미… 참는 게 한계예요…",
          "[홍조, 하트] 제발… 조금만… 아니, 조금만 더…",
          "[홍조, ><] 주인님… 이러다 제가 먼저 손을… 아니에요, 아무것도 아니에요…",
          "[홍조, 하트] 하아… 아직… 계속하시는 거예요…?",
          "[홍조, ><] 으응… 이제… 어지러워요… 기분 좋게…",
          "[홍조, 하트] 잠깐… 저… 지금 제 목소리 이상하죠…",
          "[홍조, 식은땀] 하앗… 손가락 힘… 조금만 빼 주세요…",
          "[홍조, ><] 으으… 이러다간… 진짜 소리 질러요…",
          "[홍조, 하트] 주인님… 저… 이상해요… 몸이…",
          "[홍조, ><] 히으… 머리가… 자꾸 새하얘져요…",
          "[홍조, 식은땀] 잠깐만… 이대로면… 제가 먼저 손을 뻗어요…",
          "[홍조, 하트] 흔들지 마세요… 그럼… 더…",
          "[홍조, ><] 으… 그만… 아니, 아직…",
          "[홍조, 하트] 하아… 이제 정말… 한계에 가까워요…",
          "[홍조, ><] 주인님… 이러다 저… 참지 못해요…",
          "[홍조, 식은땀] 손… 손을… 놓을 수가 없잖아요…",
          "[홍조, 하트] 하앗… 이거… 오래 하시면 저… 녹아요…",
          "[홍조, ><] 으으… 숨… 숨이 안 나와요…",
          "[홍조, 하트] 이제… 조금만 더하면… 저…",
          "[홍조, ><] 잠깐… 눈물 날 것 같아요… 이상하게…",
          "[홍조, 식은땀] 하아… 주인님… 이거… 정말 반칙이에요…",
          "[홍조, 하트] …계속 이러시면, 오늘 밤 못 자요…",
          "[홍조, ><] 으… 이제… 그만… 정말로 그만…",
        ],
        chest_pull_dizzy: [
          "[어지럼, 홍조] 으으… 자꾸 흔들면… 어지러워요…",
          "[어지럼, 홍조] 잠깐… 세상이… 빙글빙글 돌아요…",
          "[어지럼, 하트] 아이… 머리가 핑 돌아서… 못 서겠어요…",
          "[어지럼, 식은땀] 하아… 그만… 눈앞이 흔들려요…",
          "[어지럼, 홍조] 으… 어지러워서… 잠깐만 기대도 돼요…?",
        ],
        chest_drop: [
          "[홍조, ><] 꺅!",
          "[홍조, 눈물] 꺅…! 이, 이건 반칙이에요…!",
          "[홍조, 하트] 하아… 갑자기 놓으면… 몸이 아직… 어지러워요…",
          "[홍조, 식은땀] 아… 아직… 감각이 안 돌아와요…",
          "[홍조, ><] 으으… 다리 힘이… 풀려 버렸잖아요…",
          "[홍조, 하트] 잠깐만… 심장이 너무 뛰어서… 숨 좀 돌릴게요…",
          "[홍조, 눈물] 부, 부끄러워서… 얼굴을 못 들겠어요…",
          "[홍조, 얄미운] …이번엔 봐드린 거예요… 다음엔… 각오하세요…",
          "[홍조, 하트] 아… 아직 거기… 감각이 남아 있어요…",
          "[홍조, 식은땀] 이 상태로 일어나면… 다리에 힘이 안 들어가요…",
          "[홍조, ><] 주인님… 이거… 책임지실 거죠…?",
          "[홍조, 눈물] 하아… 창피해서 어디 숨고 싶어요…",
          "[홍조, ><] 하앗…!",
          "[홍조, 눈물] 아… 아직… 아직 거기…",
          "[홍조, 하트] 으으… 갑자기 놓으면… 몸이 휘청…",
          "[홍조, 식은땀] 하아… 다리에 힘 안 들어가요…",
          "[홍조, ><] 잠깐… 숨… 돌릴 시간…",
          "[홍조, 하트] 주인님… 손 좀… 놓지 마세요…",
          "[홍조, 눈물] 이제… 이제 된 거예요…?",
          "[홍조, ><] 으으… 아직… 여운이…",
          "[홍조, 식은땀] 하아… 이러면… 일할 수가 없어요…",
          "[홍조, 하트] 잠깐만… 마음이… 안 정리돼요…",
          "[홍조, ><] 아… 아직 감각이… 남아 있어요…",
          "[홍조, 눈물] 부끄러워… 부끄러워요…",
          "[홍조, 식은땀] 이제… 제 얼굴… 다 보였죠…?",
          "[홍조, 하트] 놓고 나니까… 더… 이상해요…",
          "[홍조, ><] 으으… 다리… 풀렸어요…",
          "[홍조, 눈물] 주인님… 이거… 저만 아는 거예요…",
          "[홍조, 식은땀] 하아… 물 좀… 마실 수 있게…",
          "[홍조, ><] 잠깐… 그 자리에… 서 있을게요…",
          "[홍조, 하트] …이번엔, 제가 진 거네요…",
          "[홍조, 눈물] …다음엔, 조용한 데서 해요… 제발요…",
        ],
        lower1: [
          "[홍조, 식은땀] 거, 거기는… 치마는 안 돼요…!",
          "[홍조, 식은땀] 거기 만지면… 정말 화낼 거예요…!",
          "[홍조, ><] 으… 치마 자락… 놓아 주세요…!",
          "[홍조, 식은땀] 거긴… 스스로도 함부로 안 만지는 데예요…",
          "[홍조, ><] 주인님… 그 손, 지금 위험한 거 아세요…?",
        ],
        lower2: [
          "[홍조, ><] 진짜… 이러시면 오늘 밤은 안 자요…!",
          "[홍조, ><] 그만해 주세요… 제발…!",
          "[홍조, 식은땀] 으으… 이러다 진짜 소리 질러요…!",
          "[홍조, ><] 한 번만 더 하시면… 정말로 삐질 거예요…",
          "[홍조, 눈물] 주인님… 지금 표정… 무서워요… 아니, 좋아요…",
        ],
        lower3: [
          "[><, 식은땀] 히익…!",
          "[><, 눈물] 으아…! 이제 진짜…!",
          "[><, 식은땀] 잠깐…! 거기… 진짜 안 돼요…!",
        ],
        lower_after: [
          "[홍조, 눈물] …다시는 그러지 마세요. 진짜예요.",
          "[홍조, 눈물] 흥… 이번만 봐준 거예요.",
          "[홍조] …나중에, 조용한 데서 다시 얘기해요.",
          "[홍조, 얄미운] 이번 일은… 둘만 아는 걸로 해요.",
          "[홍조, 눈물] 흥… 이제 저 멀리 가 있을 거예요.",
        ],
        spam: [
          "[어두운, 얄미운] …그만 좀 눌러요. 반응 다 보이잖아요.",
          "[어두운, 얄미운] …주인님, 손가락이 너무 성실하시네요.",
          "[어두운, 얄미운] …부탁인데, 잠깐만 쉬어 주세요.",
        ],
        makeup: [
          "[홍조] …이제 안 누르실 거죠? 약속하세요.",
          "[홍조] …이번엔 넘어갈게요. 대신 기억해 둘게요.",
          "[홍조] …이제 진정하셨어요? 저는 아직인데.",
        ],
        working: [
          "[식은땀] 지금 일하는 중이에요~ …나중에 하세요, 나중에♪",
          "[식은땀] 잠깐만요… 지금 집중해야 하는데… 손이 자꾸…",
          "[식은땀] 일 끝나면… 그때 만져 주세요. 약속하시고요.",
          "[식은땀] 으… 지금 그러시면 작업이 안 끝나요…",
        ],
        sleep_out: [
          "잠깐 쉬고 올게요~ …그리워하시면 금방 와요♪",
          "절전 모드 들어갑니다~ 불러 주시면 바로요!",
          "좀 쉬었다 올게요, 주인님♪ …꿈에서 봬요.",
          "눈 좀 붙이고 올게요. …몰래 보고 계시면 안 돼요.",
          "충전하러 갑니다~ 다녀오면 안아 주세요.",
        ],
        sleep_back: [
          "다녀왔어요! …보고 싶으셨죠?",
          "돌아왔어요! 기다리게 해서 죄송해요♪",
          "[하트] 부르셨죠? …이리 와요.",
          "푹 잤더니… 얼굴이 좋아 보이세요, 주인님.",
          "[홍조] 자는 동안… 계속 곁에 있으셨어요?",
        ],
      };
      const EXP_NAME = { "홍조": "blush", "><": "squint", "하트": "heart", "얄미운": "smug", "식은땀": "sweat", "어두운": "dark", "눈물": "tears", "어지럼": "dizzy" };
      const lastLine = {};
      const speak = (key, ms = 3500) => {
        const list = LINES[key]; if (!list) return;
        // 연속 터치에서 같은 대사가 또 나오지 않게: 화면에 떠 있던 직전 문장과 같은 후보는 뺀다
        const candidates = [];
        for (let i = 0; i < list.length; i++) {
          if (list.length > 1 && i === lastLine[key]) continue;   // 같은 상황의 직전 대사도 제외
          const raw = list[i], m = raw.match(/^\[([^\]]+)\]\s*/);
          const text = m ? raw.slice(m[0].length) : raw;
          if (text === lastSayText) continue;                     // 방금 띄운 문장과 겹치면 제외
          candidates.push({ i, text, exp: m ? m[1] : "" });
        }
        if (!candidates.length) return;                           // 새로 할 말이 없으면 조용히 넘어감 (같은 대사 반복 방지)
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        lastLine[key] = pick.i;
        for (const n of pick.exp.split(",")) { const e = EXP_NAME[n.trim()]; if (e) flashExp(e, ms); }
        const text = pick.text;
        say(text, ms);
      };
      outfitTalk = (key) => { if (fleeX === 0 && performance.now() >= sulkUntil) speak(key, 4000); };   // 도망·산책·삐진 중에는 말 안 함

      const PART_REGION = {
        Part99: "head", Part47: "head", Part155: "head", Part156: "head", Part161: "head", Part64: "head", Part66: "head", Part10: "head", Part8: "head",
        Part127: "arm", Part94: "arm", Part68: "arm", Part93: "arm", Part117: "arm", Part54: "arm", Part42: "arm",
        Part114: "leg", Part97: "lower", Part107: "lower", Part125: "lower", Part126: "lower",
        Part89: "waist", Part85: "chestpart", Part88: "chestpart", Part136: "tail",
      };
      const DR = cm.drawables, PT = cm.parts;
      const drawRegion = Array.from({ length: DR.count }, (_, i) => {
        for (let p = DR.parentPartIndices[i]; p >= 0; p = PT.parentIndices[p]) if (PART_REGION[PT.ids[p]]) return PART_REGION[PT.ids[p]];
        return null;
      });
      const chestDraw = [];
      for (let i = 0; i < DR.count; i++) for (let p = DR.parentPartIndices[i]; p >= 0; p = PT.parentIndices[p]) if (PT.ids[p] === "Part88" || PT.ids[p] === "Part86") { chestDraw.push(i); break; }
      const chestCenter = () => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const i of chestDraw) {
          if (DR.opacities[i] < 0.05) continue;
          const v = im.getDrawableVertices(i);
          for (let k = 0; k < v.length; k += 2) { x0 = Math.min(x0, v[k]); x1 = Math.max(x1, v[k]); y0 = Math.min(y0, v[k + 1]); y1 = Math.max(y1, v[k + 1]); }
        }
        return x0 === Infinity ? null : { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
      };
      const chestBase = chestCenter();
      const B = { minX, minY, w: maxX - minX, h: maxY - minY };   // 전신 그림 영역 (펫과 같은 기준)
      const AN = 512;
      let alphaMaps = null;
      const buildAlpha = () => {
        alphaMaps = model.textures.map((t) => {
          try {
            const c = document.createElement("canvas"); c.width = c.height = AN;
            const g = c.getContext("2d", { willReadFrequently: true });
            g.drawImage(t.baseTexture.resource.source, 0, 0, AN, AN);
            const d = g.getImageData(0, 0, AN, AN).data, a = new Uint8Array(AN * AN);
            for (let k = 0; k < a.length; k++) a[k] = d[k * 4 + 3];
            return a;
          } catch { return null; }
        });
      };
      const alphaAt = (tex, u, v) => {
        const a = alphaMaps[tex]; if (!a) return 255;
        return a[Math.min(AN - 1, Math.max(0, Math.floor((1 - v) * AN))) * AN + Math.min(AN - 1, Math.max(0, Math.floor(u * AN)))];
      };
      const pickDrawable = (x, y) => {   // x, y: 캔버스(배율 1) 좌표
        if (!alphaMaps) buildAlpha();
        const px = (x - model.x) / model.scale.x, py = (y - model.y) / model.scale.y;
        let best = -1, bestOrder = -Infinity;
        for (let i = 0; i < DR.count; i++) {
          if (DR.opacities[i] < 0.05 || !(DR.dynamicFlags[i] & 1)) continue;
          const order = DR.renderOrders[i];
          if (order <= bestOrder) continue;
          const v = im.getDrawableVertices(i);
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          for (let k = 0; k < v.length; k += 2) { if (v[k] < x0) x0 = v[k]; if (v[k] > x1) x1 = v[k]; if (v[k + 1] < y0) y0 = v[k + 1]; if (v[k + 1] > y1) y1 = v[k + 1]; }
          if (px < x0 || px > x1 || py < y0 || py > y1) continue;
          const idx = DR.indices[i], uv = DR.vertexUvs[i];
          for (let k = 0; k < idx.length; k += 3) {
            const a = idx[k] * 2, b = idx[k + 1] * 2, c = idx[k + 2] * 2;
            const d = (v[b + 1] - v[c + 1]) * (v[a] - v[c]) + (v[c] - v[b]) * (v[a + 1] - v[c + 1]);
            if (Math.abs(d) < 1e-9) continue;
            const l1 = ((v[b + 1] - v[c + 1]) * (px - v[c]) + (v[c] - v[b]) * (py - v[c + 1])) / d;
            const l2 = ((v[c + 1] - v[a + 1]) * (px - v[c]) + (v[a] - v[c]) * (py - v[c + 1])) / d;
            const l3 = 1 - l1 - l2;
            if (l1 < 0 || l2 < 0 || l3 < 0) continue;
            if (alphaAt(DR.textureIndices[i], l1 * uv[a] + l2 * uv[b] + l3 * uv[c], l1 * uv[a + 1] + l2 * uv[b + 1] + l3 * uv[c + 1]) > 40) { best = i; bestOrder = order; break; }
          }
        }
        return best;
      };
      const touchRegion = (x, y, d) => {
        if (bodyW > 0.5) {   // 꼬마 모습(체형 2): 가슴 반응 없이 머리(위쪽 45%)·몸만 구분 (데스크톱 펫과 같음)
          let y0 = Infinity, y1 = -Infinity;
          for (let i = 0; i < DR.count; i++) {
            if (DR.opacities[i] < 0.05) continue;
            const v = im.getDrawableVertices(i);
            for (let k = 1; k < v.length; k += 2) { if (v[k] < y0) y0 = v[k]; if (v[k] > y1) y1 = v[k]; }
          }
          return ((y - model.y) / model.scale.y - y0) / (y1 - y0) < 0.45 ? "head" : "body";
        }
        const sc = model.scale.x, cc = chestCenter();
        const shiftX = cc && chestBase ? cc.x - chestBase.x : 0, shiftY = cc && chestBase ? cc.y - chestBase.y : 0;
        const rx = (x - model.x - (B.minX + shiftX) * sc) / (B.w * sc);
        const ry = (y - model.y - (B.minY + shiftY) * sc) / (B.h * sc);
        const inChest = Math.pow((rx - 0.45) / 0.13, 2) + Math.pow((ry - 0.295) / 0.045, 2) <= 1;
        let r = drawRegion[d];
        if (r === "head" && ry > 0.3) r = null;
        if (r === "arm" && cover.q > 0.3 && ry < 0.45) return "chest";   // 왼손으로 가슴을 가린 동안엔 그 손을 눌러도 가슴 터치로 (반응이 이어지게)
        if (r === "arm" || r === "leg" || r === "head") return r;
        if (inChest) return "chest";
        if (r === "lower") return "lower";
        if (r === "waist") return ry > 0.4 ? "lower" : "chest";
        if (r === null && ry < 0.3) return "head";
        return ry < 0.4 ? "chest" : "body";
      };
      // 화면 좌표 → 캔버스 좌표, 캐릭터 위면 [x, y, 메시 번호]
      // 버튼·입력 요소와 입력 영역의 카드(승인·질문 팝업)는 아바타와 겹쳐도 클릭이 그대로 통하게
      const UI_HIT = 'button, a[href], input, textarea, select, summary, [contenteditable="true"], [class*="composerSeat"] [class*="_card"]';
      const hitAt = (cx, cy) => {
        if (canvas.style.display === "none" || fleeX !== 0) return null;
        const r = canvas.getBoundingClientRect();
        if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
        if (document.elementFromPoint(cx, cy)?.closest(UI_HIT)) return null;
        const x = (cx - r.left) / curK, y = (cy - r.top) / curK;
        const d = pickDrawable(x, y);
        return d >= 0 ? [x, y, d] : null;
      };

      let clicks = [], headClicks = [], spamAt = -1e9, inputLockedUntil = 0;
      const shy = { count: 0, last: -1e9, cooldownUntil: 0 }, low = { count: 0, last: -1e9, cooldownUntil: 0 };
      const onChest = (now) => {
        if (now < shy.cooldownUntil || now - shy.last < 180) return;
        if (now - shy.last > 8000) shy.count = 0;
        shy.last = now; shy.count++;
        if (shy.count <= 4) {
          if (now < touchLeanUntil || Math.random() < 0.16) touchLeanUntil = now + 3000;   // 가끔 앞으로 숙임, 숙인 동안 누르면 3초 연장
          speak(shy.count <= 1 ? "chest1" : "chest2", 4000);
          if (shy.count >= 2) happyMouthUntil = now + 4000;   // 2번째부터: 입꼬리 올리고 살짝 벌린 "헤~"
          if (shy.count >= 3) coverChest(2600);   // 3~4번째: 왼손으로 가슴을 가림
        } else {
          touchLeanUntil = 0; shy.count = 0;
          shy.cooldownUntil = inputLockedUntil = now + 6000;   // 진정할 때까지 터치 안 받음
          shiverStarted = now;
          speak("chest3", 3000);
          happyMouthUntil = now + 6000;
          coverChest(6000);   // 마지막: 진정할 때까지 가린 채로
          setTimeout(() => speak("chest_calm", 2800), 3000);
        }
      };
      // 가까운 쪽 화면 끝(-1 = 왼쪽, 1 = 오른쪽)과 그쪽으로 완전히 나가는 거리. 높이는 그대로 두고 좌우로만 움직임.
      const nearSide = () => { const a = area(), c = shown.x - fleeX + W * curK / 2; return c - a.l < a.r - c ? -1 : 1; };
      const outDistance = (dir) => { const a = area(), x = shown.x - fleeX; return dir < 0 ? -(x + W * curK - a.l + 20) : a.r - x + 20; };
      // 도망
      //  · 창 안: 창 경계 밖으로 걸어 나가 사라졌다가 10초 뒤 같은 쪽에서 돌아옴 (원래 동작)
      //  · 펫 창: 멀티 모니터에서는 '화면 끝'이 다른 모니터라 지워지지 않으므로, 일정 거리 이동 + 페이드로 확실히 사라지게 한다
      const FLEE_DIST = 300, FLEE_OUT_MS = 700, FLEE_IN_MS = 900, FLEE_HIDE_MS = 10000;
      let fleeFade = 1;   // 도망 중 캔버스 불투명도 (1 = 평소)
      const fleeSlide = (from, to, ms, done) => {
        const t0 = performance.now();
        const step = () => {
          const p = Math.min(1, (performance.now() - t0) / ms), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          fleeX = from + (to - from) * e;
          if (p < 1) requestAnimationFrame(step); else done && done();
        };
        requestAnimationFrame(step);
      };
      const flee = () => {
        if (drag.pending || drag.on || link.open || link.follow) return;   // 예약된 사이 집었거나 펫 창으로 넘어갔으면 취소
        hush();
        if (!PET) {   // 창 안: 화면(창) 경계 밖으로 나가면 그림이 잘려 자연스럽게 사라진다
          const off = outDistance(nearSide());
          fleeSlide(Math.sign(off) * 0.01, off, 700, () => setTimeout(() => fleeSlide(off, 0, 1100, () => {
            fleeX = 0; setTimeout(() => speak("lower_after", 4000), 400);
          }), 10000));
          return;
        }
        // 펫 창: 거리 이동 + 페이드
        const dist = nearSide() * Math.max(FLEE_DIST, W * curK * 0.5);     // 캐릭터가 클수록 조금 더 멀리
        const finish = () => { fleeX = 0; fleeFade = 1; canvas.style.opacity = ""; setTimeout(() => speak("lower_after", 4000), 400); };
        const runIn = () => {   // 사라진 자리에서 제자리까지 서서히 나타나며 돌아옴 (끌기 시작하면 즉시 복귀)
          const t0 = performance.now();
          const step = () => {
            if (drag.pending || drag.on) return finish();
            const p = Math.min(1, (performance.now() - t0) / FLEE_IN_MS);
            fleeX = dist * (1 - p * p * (3 - 2 * p));
            fleeFade = p * p * (3 - 2 * p);
            canvas.style.opacity = String(Math.min(1, fleeFade));
            if (p < 1) requestAnimationFrame(step); else finish();
          };
          requestAnimationFrame(step);
        };
        const t0 = performance.now();
        const runOut = () => {
          const p = Math.min(1, (performance.now() - t0) / FLEE_OUT_MS);
          fleeX = dist * (1 - Math.pow(1 - p, 3));                       // 빠르게 출발해 끝에서 감속
          fleeFade = Math.max(0, 1 - Math.pow(p, 1.5));                  // 갈수록 빠르게 옅어져 도착하면 완전히 투명
          canvas.style.opacity = String(fleeFade);
          if (p < 1) requestAnimationFrame(runOut);
          else setTimeout(runIn, FLEE_HIDE_MS);
        };
        requestAnimationFrame(runOut);
      };
      // ---------- 산책 ----------
      const WALK_SPEED = 320;   // 걷는 속도 (px/초)
      const walkEase = (p) => { const a = 0.12, m = 2 * a * (1 - a); return p < a ? p * p / m : p > 1 - a ? 1 - (1 - p) * (1 - p) / m : (p - a / 2) / (1 - a); };   // 출발·도착만 부드럽게, 중간은 일정한 속도
      // 산책의 예약 타이머와 걷기 애니메이션은 walk.timers·walk.slideId로 묶어, 집어 들면 한 번에 멈춘다
      const walkLater = (fn, ms) => { const id = setTimeout(() => { walk.timers = walk.timers.filter((t) => t !== id); fn(); }, ms); walk.timers.push(id); return id; };
      const slide = (from, to, done) => {
        const t0 = performance.now(), ms = Math.abs(to - from) / WALK_SPEED * 1000, id = ++walk.slideId;
        let cancelled = false;
        const step = () => {
          if (cancelled || id !== walk.slideId) return;   // 멈춤
          const p = ms ? Math.min(1, (performance.now() - t0) / ms) : 1;
          fleeX = from + (to - from) * walkEase(p);
          if (p < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
        return () => { cancelled = true; };
      };
      const cancelWalk = () => {   // 출발 전(말하는 중)에 집어 들면 산책을 취소. 출발한 뒤에는 제자리에 올 때까지 집을 수 없음
        if (walk.phase !== "ready") return;
        for (const t of walk.timers) clearTimeout(t);
        walk.timers = []; walk.slideId++; walk.phase = "";
      };
      const walkBack = () => {   // 반대쪽(오른쪽) 화면 밖에서 원래 자리까지 걸어 들어옴
        if (walk.phase !== "away") return;
        for (const t of walk.timers) clearTimeout(t);
        walk.timers = []; walk.phase = "in"; walk.dir = 1;   // 오른쪽에서 들어와 왼쪽으로 걸어옴
        slide(outDistance(1), 0, () => {
          fleeX = 0; walk.phase = "";
          walkLater(() => { if (!walk.phase) speak("walk_back", 3500); }, 450);   // 정면으로 돌아선 뒤 인사
        });
      };
      const startWalk = () => {   // 말하고 → 가까운 쪽으로 돌아서 → 화면 밖까지 걸어감(높이 그대로) → 8~14초 뒤 같은 쪽으로 돌아옴
        if (SLEEP.state !== "active") return;
        walk.phase = "ready"; walk.dir = -1;   // 연출: 항상 왼쪽으로 걸어 나갔다가 오른쪽에서 들어온다
        speak("walk_out", 2200);
        walkLater(() => {
          walk.phase = "out"; hush();
          walkLater(() => { walk.out = outDistance(walk.dir); slide(0, walk.out, () => {
            walk.phase = "away";
            walkLater(walkBack, 8000 + Math.random() * 6000);
          }); }, 700);   // 꼬마 모습으로 바뀐 뒤 출발
        }, 2300);
      };
      walkCheck = (now) => {
        if (SLEEP.state !== "active") return;   // 절전 중에는 산책하지 않음
        if (walk.phase === "away" && running) return walkBack();   // 나가 있는 동안 작업이 시작되면 바로 돌아옴
        if (walk.phase || now < walk.next) return;
        walk.next = now + 30000;   // 지금은 갈 때가 아니면 30초 뒤 다시 확인
        if (intro.phase !== "done" || mood !== "idle" || running || waitingKind || now < sulkUntil || now < inputLockedUntil || fleeX !== 0) return;
        if (drag.pending || drag.on || free.anim || link.open || link.opening || link.follow) return;   // 누르거나 들고 있을 때·움직이는 중·펫 창으로 넘긴 동안은 산책 안 함 (펫 창이 대신 산책)
        if (bubble.classList.contains("show") || now - walk.lastTouch < 60000 || now - lastSayAt < 15000 || document.hidden) return;
        walk.next = now + (240 + Math.random() * 240) * 1000;   // 다음 산책은 4~8분 뒤
        startWalk();
      };
      // ---------- 절전(슬립): 입력이 없으면 말 한마디 후 오른쪽 화면 밖으로 나가 렌더링(티커)을 멈춤 ----------
      const SLEEP = { enabled: true, minutes: 1, lastActive: performance.now(), state: "active" };   // active → leaving → asleep → waking
      let sleepTimer = 0, cancelSleepSlide = null;
      const SLEEP_OFF = () => innerWidth - (canvas.getBoundingClientRect().left - fleeX) + 40;   // 화면 오른쪽 밖 좌표
      const startWake = () => {
        if (SLEEP.state !== "asleep" && SLEEP.state !== "leaving") return;
        clearTimeout(sleepTimer); sleepTimer = 0;
        cancelSleepSlide?.(); cancelSleepSlide = null;
        if (link.open || link.follow?.shown) { SLEEP.state = "active"; fleeX = 0; return; }
        hush();
        SLEEP.state = "waking";
        app.ticker.start();
        place();
        slide(fleeX, 0, () => {
          fleeX = 0; SLEEP.state = "active"; SLEEP.lastActive = performance.now();
          if (!running && !waitingKind) speak("sleep_back", 3500);
        });
      };
      const sleepActivity = () => {
        SLEEP.lastActive = performance.now();
        startWake();
      };
      for (const t of (PET ? [] : ["pointerdown", "pointermove", "mousedown", "keydown", "wheel", "touchstart"])) addEventListener(t, sleepActivity, { passive: true, capture: true });
      const sleepGo = () => {
        if (PET || drag.on || drag.pending || free.anim || SLEEP.state !== "active" || intro.phase !== "done" || fleeX !== 0 || walk.phase) return;
        if (link.open || link.follow?.shown) { SLEEP.lastActive = performance.now(); return; }   // 펫 창으로 밖에 꺼내 둔 동안엔 절전 안 함
        SLEEP.state = "leaving";
        speak("sleep_out", 2600);
        sleepTimer = setTimeout(() => {
          sleepTimer = 0;
          if (SLEEP.state !== "leaving") return;
          hush();
          cancelSleepSlide = slide(fleeX, SLEEP_OFF(), () => {
            cancelSleepSlide = null;
            SLEEP.state = "asleep";
            canvas.style.display = bubble.style.display = "none";
            app.ticker.stop();   // 렌더·모션 업데이트·Worker 프레임 전부 멈춤
          });
        }, 2500);
      };
      const onLower = (now) => {
        if (fleeX !== 0 || now < low.cooldownUntil || now - low.last < 180) return;
        if (now - low.last > 8000) low.count = 0;
        low.last = now; low.count++;
        if (low.count <= 2) speak("lower1", 4000);
        else if (low.count <= 4) speak("lower2", 4000);
        else {
          low.count = 0;
          low.cooldownUntil = now + 14000;
          shiverStarted = now;
          speak("lower3", 900);
          setTimeout(flee, 900);
        }
      };
      // ---------- 냄비: 위에서 떨어져 머리를 "쾅" 치고 튕겨 나감 ----------
      const POT_SVG = '<svg viewBox="0 0 140 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="dscPotBody" x1="0" x2="1"><stop offset="0" stop-color="#7d8794"/><stop offset=".35" stop-color="#e3e8ee"/><stop offset=".6" stop-color="#b8c0ca"/><stop offset="1" stop-color="#6c7580"/></linearGradient></defs>' +
        '<rect x="2" y="34" width="26" height="10" rx="5" fill="#3d434b"/><rect x="112" y="34" width="26" height="10" rx="5" fill="#3d434b"/>' +
        '<path d="M22 30 H118 V78 Q118 96 100 96 H40 Q22 96 22 78 Z" fill="url(#dscPotBody)" stroke="#4b525b" stroke-width="3"/>' +
        '<ellipse cx="70" cy="30" rx="50" ry="10" fill="#d7dde4" stroke="#4b525b" stroke-width="3"/>' +
        '<ellipse cx="70" cy="30" rx="40" ry="6" fill="#59616b"/><path d="M38 48 Q44 70 40 86" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55" fill="none"/></svg>';
      // 충격 그림: 별 모양 터짐 + 바깥 충격선 (막았을 땐 은색 반짝임)
      const impactSvg = (guarded) => {
        const pts = [];
        for (let i = 0; i < 20; i++) { const r = i % 2 ? 22 : 46, a = (i / 20) * Math.PI * 2 - Math.PI / 2; pts.push((50 + Math.cos(a) * r).toFixed(1) + "," + (50 + Math.sin(a) * r).toFixed(1)); }
        const fill = guarded ? "#f1f5f9" : "#ffe14d", stroke = guarded ? "#64748b" : "#ea580c", core = guarded ? "#ffffff" : "#fff7c2";
        let rays = "";
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.2, c = Math.cos(a), sn = Math.sin(a); rays += `<line x1="${(50 + c * 50).toFixed(1)}" y1="${(50 + sn * 50).toFixed(1)}" x2="${(50 + c * 62).toFixed(1)}" y2="${(50 + sn * 62).toFixed(1)}" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>`; }
        return `<svg viewBox="-14 -14 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${rays}<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="12" fill="${core}"/></svg>`;
      };
      // 효과음 (파일 없이 합성): 맞으면 둔탁한 "통", 세숫대야로 막으면 금속이 울리는 "깡~"
      let audioCtx = null;
      const impactSound = (guarded) => {
        try {
          audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
          const ac = audioCtx, t = ac.currentTime, out = ac.createGain();
          out.gain.value = 0.22; out.connect(ac.destination);
          const tone = (f, dur, vol, type = "sine", drop = 1) => {
            const o = ac.createOscillator(), g = ac.createGain();
            o.type = type; o.frequency.setValueAtTime(f, t); if (drop !== 1) o.frequency.exponentialRampToValueAtTime(f * drop, t + dur);
            g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02);
          };
          const noise = (dur, vol, hp) => {   // 부딪히는 순간의 "탁"
            const b = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate), d = b.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
            const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
            src.buffer = b; f.type = "highpass"; f.frequency.value = hp; g.gain.value = vol;
            src.connect(f); f.connect(g); g.connect(out); src.start(t);
          };
          if (guarded) { noise(0.05, 0.7, 2500); for (const [f, d, v] of [[640, 1.1, 0.5], [1370, 0.9, 0.35], [2230, 0.7, 0.25], [3150, 0.5, 0.15]]) tone(f, d, v, "sine", 0.995); }
          else { noise(0.07, 0.8, 900); tone(190, 0.28, 0.9, "triangle", 0.45); tone(470, 0.35, 0.35, "sine", 0.9); tone(1130, 0.22, 0.18, "sine", 0.95); }
        } catch {}
      };
      const potHit = (x, y) => {
        const now = performance.now();
        walk.lastTouch = now; clicks = []; headClicks = [];
        const guarded = now < basinUntil;   // 세숫대야를 쓰고 있으면 막아 냄
        inputLockedUntil = now + (guarded ? 1200 : 3200);   // 맞고 정신 차릴 때까지 터치 안 받음
        const w = Math.max(64, 150 * curK), h = w * 100 / 140;
        const pot = document.createElement("div");
        pot.style.cssText = `position:fixed;left:${x - w / 2}px;top:${y - h * 0.9}px;width:${w}px;height:${h}px;z-index:40;pointer-events:none;will-change:transform,opacity`;
        pot.innerHTML = POT_SVG;
        document.body.append(pot);
        const fall = y + h + 20, T = 1250;
        const anim = pot.animate([
          { transform: `translateY(${-fall}px) rotate(-14deg)`, offset: 0, easing: "cubic-bezier(.5,0,1,.6)" },
          { transform: "translateY(0) rotate(0deg) scale(1.12,.86)", offset: 0.4, easing: "ease-out" },   // 쾅
          guarded ? { transform: `translate(${w * 0.45}px,${-h * 1.6}px) rotate(60deg)`, offset: 0.66, easing: "ease-in" }   // 세숫대야에 튕겨 더 높이
                  : { transform: `translate(${w * 0.25}px,${-h * 0.6}px) rotate(32deg)`, offset: 0.62, easing: "ease-in" },
          { transform: `translate(${w * 0.7}px,${h * 0.9}px) rotate(85deg)`, opacity: 0, offset: 1 },
        ], { duration: T, fill: "forwards" });
        anim.onfinish = () => pot.remove();
        setTimeout(() => {   // 부딪히는 순간
          const fs = Math.max(60, 130 * curK), fx = document.createElement("div");   // 글자 없이 만화식 충격 별 + 충격선
          fx.style.cssText = `position:fixed;left:${x - fs / 2}px;top:${y - h * 0.9 - fs / 2}px;width:${fs}px;height:${fs}px;z-index:41;pointer-events:none`;
          fx.innerHTML = impactSvg(guarded);
          document.body.append(fx);
          fx.animate([{ transform: "scale(.2) rotate(-20deg)", opacity: 0 }, { transform: "scale(1.15) rotate(5deg)", opacity: 1, offset: 0.25 }, { transform: "scale(1.3) rotate(10deg)", opacity: 0 }], { duration: 620, fill: "forwards" }).onfinish = () => fx.remove();
          impactSound(guarded);
          if (guarded) { play("flinch", 600); speak("pot_guard", 3000); return; }   // 막아 냄: 살짝 움찔하고 의기양양
          play("bonk", 1100); shiverStarted = performance.now();
          speak("pot_hit", 3000);
          flashExp("dizzy", 2800);   // 빙글빙글 눈 (말풍선 꼬리표의 눈물과 함께)
        }, T * 0.4);
      };
      // ---------- 세숫대야: 머리를 천천히 쓸어내리면 살며시 씌우고 10초 뒤 벗음 ----------
      const putBasin = () => {
        const now = performance.now();
        walk.lastTouch = now; clicks = []; headClicks = [];
        basinUntil = now + 10000;
        speak("basin_on", 3800);
      };
      const HEAD_SULK_AT = 3, SULK_MS = 15000;   // 머리 1~2번째 = 정색, 3번째 = 삐져서 15초 동안 터치 안 받음
      const sulk = (now) => {
        clicks = []; headClicks = [];
        until.dark = until.smug = 0;   // 정색 표정을 지우고 삐진 얼굴로
        gest.name = null;
        sulkStart = now; sulkUntil = inputLockedUntil = now + SULK_MS;
        sulkDir = Math.random() < 0.5 ? 1 : -1; sulkYaw = sulkRoll = 0;
        // 15초 동안 몰래 보기 3번 (약 3초·7초·11초, 조금씩 어긋나게)
        sulkPeeks = [0, 1, 2].map((i) => ({ at: 2800 + i * 4000 + (Math.random() - 0.5) * 1000, flip: Math.random() < 0.6, done: false }));
        speak("head_sulk", 4000);
        flashExp("blush", SULK_MS);
        setTimeout(() => { stareUntil = performance.now() + 4300; speak("head_after", 4000); }, SULK_MS);   // 풀리며 한마디 할 땐 정면을 똑바로 봄
      };
      const onTouch = (x, y, d) => {
        const now = performance.now();
        if (now < inputLockedUntil) return;
        walk.lastTouch = now;
        const region = touchRegion(x, y, d);
        if (region === "chest") { clicks = []; headClicks = []; low.count = 0; return onChest(now); }
        if (region === "lower") { clicks = []; headClicks = []; shy.count = 0; return onLower(now); }
        shy.count = 0; low.count = 0;
        clicks = clicks.filter((t) => now - t < 3000); clicks.push(now);
        if (clicks.length >= 6) { clicks = []; headClicks = []; spamAt = now; return speak("spam", 3000); }
        if (running && Math.random() < 0.5) return speak("working");
        if (region === "head") {
          if (now - spamAt < 10000) { spamAt = -1e9; return speak("makeup"); }
          headClicks = headClicks.filter((t) => now - t < 8000); headClicks.push(now);
          if (headClicks.length >= HEAD_SULK_AT) return sulk(now);
          return speak("head");
        }
        if (region === "arm") return speak("arm");
        if (region === "leg") return speak("leg");
        play("sway", 1600);
        speak("body");
      };
      // 캔버스는 클릭을 통과시키므로, 문서 단계에서 캐릭터 위 클릭만 가로챔 (투명한 곳은 뒤 화면으로 그대로)
      // 짧게 눌렀다 떼면 터치, 누른 채 6px 넘게 움직이면 집어 들어 옮김
      // 머리에서 아래로 쓸어내리면 끌기 대신 냄비(빠르게)·세숫대야(천천히)
      const POT_MS = 130;   // 머리에서 이 시간(ms) 안에 55px 넘게 쓸어내리면 냄비, 아니면 세숫대야
      let swallowClick = false, strokeFrom = null;   // strokeFrom: 머리를 누른 채 쓸어내리는지 지켜보는 중
      const pt = (e) => PET ? [e.screenX, e.screenY] : [e.clientX, e.clientY];   // 창 안 = 창 좌표, 펫 창 = 화면 좌표
      // 몸 전체 영역(캔버스 양옆 빈 곳·머리 위 여백 제외). 펫 창은 클릭을 통과시키다 이 안에 커서가 오면 받기 시작하므로,
      // 반투명한 머리카락 끝처럼 그림 판정이 빗나가는 곳도 집을 수 있게 이 영역으로 판단한다
      const overBody = (cx, cy) => {
        if (canvas.style.display === "none" || fleeX !== 0) return false;
        const c = canvas.getBoundingClientRect(), r = bodyRect(c.left, c.top, curK);
        return cx >= r.l && cx <= r.r && cy >= r.t && cy <= r.b;
      };
      const walking = () => walk.phase === "out" || walk.phase === "away" || walk.phase === "in";   // 출발한 뒤 ~ 제자리 도착 전
      // 가슴 끌기는 놓은 직후 부끄러워 떠는 동안에도 바로 다시 잡을 수 있다 (inputLockedUntil은 머리 터치에만 적용)
      const canPullChest = (now) => bodyW <= 0.5 && fleeX === 0 && !walk.phase && intro.phase === "done" && !drag.on && !link.opening && now >= sulkUntil;
      // 3초 넘게 잡은 채로 '흔들어야' 더 자극적인 대사가 나온다 (잡고만 있으면 나오지 않음)
      // 4초를 넘겨 계속 흔들면 어지러워하는 대사로 바뀐다
      const armChestLong = () => {
        clearInterval(chestLongTimer);
        const startedAt = performance.now();
        chestShake.acc = 0; chestShake.last = 0; chestShake.next = startedAt + 3000;
        chestLongTimer = setInterval(() => {
          if (!chestDragging) { clearInterval(chestLongTimer); chestLongTimer = 0; return; }
          const now = performance.now();
          if (now < chestShake.next) return;                                   // 최소 3초는 잡고 있어야
          if (now - chestShake.last > 500 || chestShake.acc < 30) return;      // 그 사이 흔들지 않았으면 대사 없음
          // 4초를 넘기면 멀미(어지럼) 대사, 그 전에는 자극적인 대사
          speak(now - startedAt >= 4000 ? "chest_pull_dizzy" : "chest_pull_long", 4000);
          chestShake.acc = 0; chestShake.next = now + 3000;                    // 계속 흔들면 3초마다 한 번씩
        }, 300);
      };
      const releaseChest = () => {
        chestFrom = null;
        if (!chestDragging) return;
        chestDragging = false; chestTarget = 0; chestShiftTarget = 0;
        clearInterval(chestLongTimer);   // 더 이상 붙잡고 있지 않으니 자극적인 대사 감시도 끔
        const now = performance.now();
        const dropped = Math.max(0, dragLift.x);
        dragLift.v = Math.min(0, dragLift.v) - dropped * 2.5;   // 놓는 순간 끌어올린 만큼 아래로 탄력이 붙어 크게 출렁인 뒤 잦아듦
        speak("chest_drop", 3500); shiverStarted = now;
        coverChest(3000); inputLockedUntil = now + 2500; walk.lastTouch = now;
      };
      document.addEventListener("pointerdown", (e) => {
        if (chestFrom) { e.preventDefault(); e.stopPropagation(); swallowClick = true; return; }
        if (e.button !== 0) return;   // 왼쪽 버튼만 받음 (오른쪽 버튼은 집어 옮기기의 보조 버튼이라 여기서 처리하지 않음)
        swallowClick = false; strokeFrom = null;
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) return;   // 패널 안 조작은 끌기·터치로 보지 않음
        if (walking()) return;   // 산책을 떠난 뒤에는 돌아올 때까지 클릭을 받지 않음 (뒤 화면으로 통과)
        const h = hitAt(e.clientX, e.clientY);
        if (!h && !(PET && overBody(e.clientX, e.clientY))) return;
        e.preventDefault(); e.stopPropagation(); swallowClick = true;
        const head = !!h && performance.now() >= inputLockedUntil && touchRegion(h[0], h[1], h[2]) === "head";
        if (head) strokeFrom = { x: e.clientX, y: e.clientY, t: performance.now(), h };
        // 가슴을 누르면 위로 끄는지 지켜봄 (위로 끌면 가슴 끌기, 옆·아래로 움직이면 평소처럼 집어 옮김)
        else if (h && canPullChest(performance.now()) && touchRegion(h[0], h[1], h[2]) === "chest") chestFrom = { x: e.clientX, y: e.clientY, id: e.pointerId, h };
        if (intro.phase !== "done" || fleeX !== 0 || link.opening) { if (h && !head) onTouch(h[0], h[1], h[2]); return; }   // 시작 연출·도망·펫 창 여는 중엔 끌기 없음 (머리는 떼는 순간 터치)
        const [px, py] = pt(e);
        drag.pending = { id: e.pointerId, sx: px, sy: py, h, ox: px - shown.x, oy: py - shown.y };
        // 터치 화면에는 오른쪽 버튼이 없으니, 길게 누르면 집기 모드로 바꾼다 (그 뒤 움직이면 옮겨짐, 그냥 떼면 터치 반응)
        if (e.pointerType === "touch") {
          clearTimeout(touchHold);
          touchHold = setTimeout(() => {
            if (!drag.pending || drag.pending.id !== e.pointerId) return;
            drag.pending.touchGrab = true;
            strokeFrom = null; chestFrom = null;   // 길게 눌렀으면 쓰다듬기·가슴 끌기 판정은 취소
            if (PET) PET.press(true);
          }, 320);
        }
        if (PET) PET.press(true);   // 누르고 있는 동안은 커서가 몸 밖으로 벗어나도 클릭을 계속 받음
        if (link.supported && link.petState === "none") linkPost("warm");   // 끌 수도 있으니 누르는 순간 펫 창을 숨긴 채 미리 띄움
        else if (!PET && link.petState === "shown" && !link.open && !link.follow) linkPost("hide");   // 붙은 직후 아직 남은 펫 창이 있으면 바로 숨김
      }, true);
      // 빠르면 냄비, 느리면 세숫대야 (확실히 빠르게 쓸어야 냄비, 짧고 조금 비스듬해도 세숫대야)
      const strokeKind = (st, e) => {
        const dy = e.clientY - st.y, dx = Math.abs(e.clientX - st.x);
        if (performance.now() - st.t < POT_MS) return dy > 55 && dy > dx * 1.2 ? "pot" : null;
        return dy > 40 && dy > dx * 0.8 ? "basin" : null;
      };
      document.addEventListener("pointermove", (e) => {
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) return;   // 패널 안 조작은 캐릭터 끌기로 이어지지 않음
        // 터치: 가로로 끌면 길게 누르기를 기다리지 않고 바로 집기로 본다 (세로 제스처는 쓰다듬기·가슴 끌기로 남김)
        if (e.pointerType === "touch" && drag.pending && !drag.pending.touchGrab && e.pointerId === drag.pending.id) {
          const dx = e.clientX - drag.pending.sx, dy = e.clientY - drag.pending.sy;
          if (Math.hypot(dx, dy) > 14) {
            clearTimeout(touchHold);   // 길게 누르기 전에 크게 움직였으면 제스처로 넘김
            if (Math.abs(dx) > Math.abs(dy) * 1.2) drag.pending.touchGrab = true;
          }
        }
        // 터치에서 길게 누르거나 가로로 끌어 집기 모드가 되면 오른쪽 버튼을 누른 것처럼 취급한다
        const touchGrab = !!(drag.pending && drag.pending.touchGrab && e.pointerId === drag.pending.id);
        // 왼쪽·오른쪽을 함께 누른 채 움직이면 곧바로 집어 옮긴다. 머리 쓰다듬기·가슴 끌기 판정과 6px 기준을 거치지 않는다
        const both = (e.buttons & 3) === 3 || touchGrab;
        if (chestFrom && !both && e.pointerId === chestFrom.id) {
          const dy = e.clientY - chestFrom.y, dx = e.clientX - chestFrom.x, now = performance.now();
          if (!chestDragging) {
            if (dy < -12 && Math.abs(dy) > Math.abs(dx) && canPullChest(now)) {
              chestDragging = true; shy.count = 0; headClicks = []; clicks = [];
              cover.until = 0;   // 다시 잡았으면 가슴을 가리던 팔을 내린다 (떠는 중 재입력 대응)
              drag.pending = null;   // 가슴 끌기로 넘어가면 집어 옮기기는 취소 (펫 창은 놓을 때까지 클릭을 계속 받음)
              walk.lastTouch = now; speak("chest_pull", 3000);
              armChestLong();   // 3초 넘게 붙잡고 있으면 자극적인 대사로
              flashExp("squint", 400); flashExp("blush", 400);
            } else if (Math.hypot(dx, dy) >= 6 && !(dy < 0 && Math.abs(dy) > Math.abs(dx))) chestFrom = null;   // 위가 아닌 쪽으로 움직이면 평소 끌기
            else { e.preventDefault(); return; }
          }
          if (chestDragging) {
            const up = Math.max(0, -dy / curK);
            chestTarget = 1 - Math.exp(-up / 85);   // 조금만 끌어올려도 크게 반응
            // 마우스를 좌우로 움직이면 그 방향으로 가슴이 끌려간다 (끌어올린 만큼 좌우로도 크게)
            chestShiftTarget = clamp(dx / (curK * 110), -1, 1) * (0.45 + 0.55 * Math.min(1, chestTarget * 1.4));
            // 흔든 양을 누적 (잡고만 있는 것과 구분 — 이 값이 있어야 3초 뒤 긴 대사가 나온다)
            const moved = Math.hypot(dx - chestShake.x, dy - chestShake.y);
            chestShake.x = dx; chestShake.y = dy;
            if (moved > 1) { chestShake.acc += moved; chestShake.last = now; }
            e.preventDefault(); e.stopPropagation(); swallowClick = true;
            return;
          }
        }
        if (strokeFrom && !both) {
          const st = strokeFrom, kind = strokeKind(st, e);
          if (kind) { strokeFrom = null; if (drag.pending) { drag.pending = null; if (PET) PET.press(false); } return kind === "pot" ? potHit(st.x, st.y) : putBasin(); }
          const dy = e.clientY - st.y, dx = Math.abs(e.clientX - st.x);
          // 아직 6px 안 움직였거나 아래로 쓸어내리는 중일 수 있으면 끌기 시작을 미룸, 끌 수 없는 때(시작 연출·도망 중)는 떼는 순간 터치
          if (!drag.pending || Math.hypot(dx, dy) < 6 || (dy > 0 && dy > dx * 0.8)) return;
          strokeFrom = null;
        }
        const p = drag.pending;
        if (!p || e.pointerId !== p.id) return;
        // 손을 뗀 이벤트(pointerup)를 놓쳤으면 버튼 상태로 알아채고 그 자리에서 놓음 (펫 창이 커서 아래로 따라오며 다시 그려질 때 등)
        if (e.buttons === 0) return endDrag(e, false);
        // 집어 옮기기는 왼쪽·오른쪽 버튼을 함께 눌렀을 때만. 한쪽만 누른 채 끌면 예전처럼 터치·머리 쓰다듬기·가슴 끌기로 남는다
        if (!both) { if (drag.on) endDrag(e, false); return; }
        strokeFrom = null; chestFrom = null;   // 좌우 함께 = 무조건 집어 옮기기 (남아 있던 제스처 예약을 버림)
        const [px, py] = pt(e), now = performance.now();
        if (!drag.on) {
          cancelWalk();   // 산책 가려고 말하던 중이면 취소
          drag.on = true; drag.touch = e.pointerType === "touch" || !!(p && p.touchGrab); drag.samples = []; free.anim = null; free.k = shown.k; petDocked = false;
          try { document.documentElement.setPointerCapture(e.pointerId); } catch {}
          document.documentElement.classList.add("dsc-grabbing");
          until.sweat = Infinity;   // 들고 있는 동안 식은땀
          walk.lastTouch = now;
          if (PET) {   // 펫 창을 직접 끌 때도 창은 펫 프로세스가 커서를 읽는 즉시 옮김 (이벤트 → 페이지 계산 → 되돌려 받는 왕복은 몇 프레임 늦고 끊김)
            petGrab = { x: p.ox, y: p.oy }; petTracking = true;
            drag.x = px - p.ox; drag.y = py - p.oy; drag.samples = [[now, px, py]];
            PET.send({ type: "track", on: true, grab: petGrab, off: { x: (innerWidth - W * free.k) / 2, y: innerHeight - H * free.k } });
          }
        }
        if (PET && petTracking) { e.preventDefault(); return; }   // 이후 위치·속도는 펫 프로세스가 보내는 cursor 메시지로 갱신
        drag.x = px - p.ox; drag.y = py - p.oy;
        drag.samples.push([now, px, py]);
        while (drag.samples.length > 2 && now - drag.samples[0][0] > 100) drag.samples.shift();
        const [t0, x0, y0] = drag.samples[0], dt = Math.max(16, now - t0) / 1000;
        carry.vx += ((px - x0) / dt - carry.vx) * 0.5; carry.vy += ((py - y0) / dt - carry.vy) * 0.5;
        if (!PET) followPet(now);
        e.preventDefault();
      }, true);
      // 끄는 도중 몸이 창 밖으로 나가면 같은 자리에 펫 창을 띄워 커서를 따라오게 함 (창 안 그림은 창 경계에서 잘리므로)
      // 펫 창이 준비된 뒤에만 따라붙고, 위치는 한 번에 하나만 보냄 (여러 요청이 겹치면 도착 순서가 뒤섞여 예전 자리로 튐)
      const followPet = (now) => {
        if (!link.supported || link.open) return;
        const k = free.k;
        // 몸의 15% 넘게 창 밖으로 나가야 넘김 (제자리는 창 오른쪽 끝에서 4px 안쪽이라 살짝만 끌어도 넘어가던 것 방지)
        const out = bodyOut({ k, x: drag.x, y: drag.y });
        const s = screenOf(drag.x, drag.y), pose = { k, x: s.x, y: s.y };
        if (!link.follow) {
          if (!out) return;
          if (link.petState !== "hidden") {   // 아직 준비 중이면 상태만 다시 확인 (그동안은 창 안에서 끄는 그대로)
            if (now - link.peek > 250) { link.peek = now; if (link.petState === "none") linkPost("warm"); else poll(); }
            return;
          }
          link.follow = { shown: false }; link.last = "";
          linkPost("open", { from: pose, to: pose, follow: true, grab: { x: drag.pending?.ox ?? 0, y: drag.pending?.oy ?? 0 }, seq: ++link.seq });   // grab: 커서가 몸을 잡은 자리 (몸 위치 = 커서 − grab)
        }
        // 열린 뒤 위치는 보내지 않음: 펫 프로세스가 커서를 직접 읽어 따라옴 (HTTP 왕복은 수십~수백 ms 걸려 끌 때 끊김)
      };
      // 손을 놓을 때 펫 창이 따라오던 중이면: 창 밖이면 펫 창이 이어받고, 창 안으로 돌아왔으면 펫 창을 숨기고 창 안에서 이어 감
      const finishFollow = (vx, vy) => {
        const f = link.follow;
        link.follow = null; link.queue = []; lastPlaceKey = "";   // 숨김으로 끝날 수도 있으니 이번 회차 반응은 버림 (이어받으면 syncPet이 다시 맞춤)
        // 놓을 때도 끌어낼 때와 같은 기준 (몸 가운데로 보면 일부만 밖으로 끌고 놓았을 때 창 안으로 처리돼 다시 붙었음)
        // 미끄러진 뒤 자리 기준. 펫 창이 이미 보이면 나올 때 기준, 아직 안 떴으면 release와 같은 넘어갈 때 기준 (둘 사이에서 놓쳐 둘로 보이지 않게)
        const outside = bodyOut({ k: free.k, x: drag.x + vx * GLIDE, y: drag.y + vy * GLIDE }, !f.shown);
        if (outside && f.shown) { linkPost("send", { list: [["release", [vx, vy]]] }); enterLink(); return true; }
        if (!outside) linkPost("hide");
        return false;   // 아직 안 떴으면 평소처럼 놓기 (창 밖이면 펫 창을 다시 열어 미끄러짐)
      };
      const endDrag = (e, cancel) => {
        clearTimeout(touchHold);
        const p = drag.pending;
        if (!p || e.pointerId !== p.id) return;
        drag.pending = null; strokeFrom = null;
        if (PET) PET.press(false);
        if (!drag.on) { if (!cancel && p.h) onTouch(p.h[0], p.h[1], p.h[2]); return; }   // 끌지 않고 뗌 = 터치 (그림 위에서 눌렀을 때만)
        drag.on = false;
        if (PET && petTracking) { petTracking = false; petGrab = null; PET.send({ type: "track", on: false }); }   // 이제부터 창 이동은 다시 페이지가 맡음 (놓은 뒤 미끄러짐·붙기)
        try { document.documentElement.releasePointerCapture(e.pointerId); } catch {}
        document.documentElement.classList.remove("dsc-grabbing");
        until.sweat = performance.now() + 400;
        const moving = performance.now() - drag.samples[drag.samples.length - 1][0] < 80;   // 멈췄다가 놓으면 던지지 않음
        const vx = moving ? carry.vx : 0, vy = moving ? carry.vy : 0;
        if (link.follow && finishFollow(vx, vy)) return;
        release(vx, vy, drag.touch);
      };
      document.addEventListener("pointerup", (e) => {
        if (chestFrom && e.pointerId === chestFrom.id) {
          const dragged = chestDragging;
          releaseChest();
          if (dragged) { if (PET) PET.press(false); return; }   // 끌지 않고 뗐으면 아래 endDrag가 원래 가슴 터치 반응
        }
        const st = strokeFrom; strokeFrom = null;
        clearTimeout(touchHold);   // 집기 준비 중에 떼면 터치 반응으로 마무리
        if (drag.pending) return endDrag(e, false);
        if (st) onTouch(st.h[0], st.h[1], st.h[2]);   // 쓸어내리지 않고 떼면 원래 머리 터치 반응
      }, true);
      addEventListener("blur", () => { releaseChest(); if (drag.pending) endDrag({ pointerId: drag.pending.id }, !drag.on); });   // 창 포커스를 잃으면 끄기를 끝냄
      document.addEventListener("pointercancel", (e) => {
        if (chestFrom && e.pointerId === chestFrom.id) { const d = chestDragging; releaseChest(); if (d && PET) PET.press(false); }
        endDrag(e, true);
      }, true);
      for (const type of ["pointerup", "mousedown", "mouseup", "click", "dblclick"]) {
        document.addEventListener(type, (e) => {
          if (!swallowClick) return;
          e.preventDefault(); e.stopPropagation();
          if (type === "click" || type === "dblclick") setTimeout(() => { if (!chestFrom) swallowClick = false; }, 0);
        }, true);
      }
      let hoverCheck = 0;
      document.addEventListener("mousemove", (e) => {   // 캐릭터 위에서는 손가락 커서
        const now = performance.now(); if (now - hoverCheck < 80) return; hoverCheck = now;
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) { document.documentElement.classList.remove("dsc-hover"); return; }
        const over = !walking() && !!hitAt(e.clientX, e.clientY);
        document.documentElement.classList.toggle("dsc-hover", over);
      }, { passive: true });
      // 우클릭은 집어 옮기기의 보조 버튼이라, 끄는 중에는 메뉴를 열지 않는다 (펫 창에서는 놓은 뒤에만 메뉴)
      document.addEventListener("contextmenu", (e) => {
        if (drag.pending || drag.on) { e.preventDefault(); e.stopPropagation(); return; }
        if (!PET) {   // 터치 화면에서 캐릭터를 길게 누를 때 뜨는 브라우저 메뉴·선택을 막는다 (집기가 풀리던 원인). 데스크톱 우클릭은 그대로 둔다
          if (coarsePointer() && overBody(e.clientX, e.clientY)) { e.preventDefault(); e.stopPropagation(); }
          return;
        }
        e.preventDefault();
        if (!petPanelOpen && !walking() && overBody(e.clientX, e.clientY)) PET.menu();
      }, true);
      // 터치에서 캐릭터를 잡고 있는 동안 손가락 움직임이 페이지 스크롤로 해석되면 pointercancel이 와서 집기가 풀린다.
      // touch-action 대신 터치 이벤트에서 직접 기본 동작을 막는다 (스크롤이 시작되기 전에 취소해야 함)
      const touchOnBody = (e) => {
        const t = e.touches && e.touches[0];
        return !!t && !PET && hitAt(t.clientX, t.clientY) !== null;
      };
      document.addEventListener("touchstart", (e) => { if (touchOnBody(e)) e.preventDefault(); }, { passive: false, capture: true });
      document.addEventListener("touchmove", (e) => {
        if (drag.on || drag.pending || (e.touches && e.touches[0] && hitAt(e.touches[0].clientX, e.touches[0].clientY))) e.preventDefault();
      }, { passive: false, capture: true });
      // 휠로 크기 조절: 몸 위에서 올리면 커지고 내리면 작아짐 (몸 아래 가운데를 기준으로). 들고 있을 때·움직이는 중·산책·도망 중엔 무시
      //   펫 창 = 0.45배 ~ 화면에 들어가는 크기 (넘겨받을 때는 HEAD_GAIN으로 머리 크기를 창 안과 맞춤)
      //   창 안 = 자유 위치일 때만 0.42배~그 창에 들어가는 최대치. 제자리에 붙어 있으면 크기는 자동이라 휠은 대화 스크롤 그대로
      document.addEventListener("wheel", (e) => {
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) return;   // 패널 안에서는 휠로 크기를 건드리지 않음
        if (intro.phase !== "done" || !free.on || !overBody(e.clientX, e.clientY)) return;
        e.preventDefault(); e.stopPropagation();   // 캐릭터 위에서는 대화 스크롤 대신 크기 조절
        if (drag.on || free.anim || walk.phase || fleeX !== 0) return;
        const kMin = PET ? PET_K_MIN : SHOW_K, kMax = PET ? PET_K_MAX : Math.min(1.25, (innerHeight * 0.45) / visH);
        const k0 = Math.min(free.k, kMax), k = Math.min(kMax, Math.max(kMin, k0 * Math.exp(-e.deltaY * 0.0012)));
        if (k === k0) return;
        if (PET) { free.x += W * (k0 - k) / 2; free.y += H * (k0 - k); }   // 창 안은 비율 자리(몸 가운데·아래 끝)라 그대로 둬도 아래 가운데 기준
        free.k = k;
        if (!PET) saveFree(false);
        else { petRememberRatio(petRatio()); petSyncMenu(); renderPetPanel(); }   // 펫 창: 메뉴·패널과 같은 배율을 함께 쓴다
      }, { capture: true, passive: false });

      // ---------- 바깥 펫 창: 설정 패널 (우클릭 메뉴의 설정/크기에서 연다) ----------
      // 패널은 펫 창 안에만 만든다. 클릭이 통과되는 창이라, 패널이 열려 있는 동안에는 패널 영역도 클릭을 받도록
      // place()가 hitbox에 패널 사각형을 더하고, 패널이 들어갈 만큼 창도 키운다.
      const PET_OUTFIT_ROWS = [["glasses", "뿔테 안경"], ["monocle", "외눈 안경"], ["skirt", "치마 길이 바꾸기"], ["chestClothes", "가슴 옷 바꾸기"], ["shoesOff", "신발 벗기"], ["tailHide", "꼬리 숨기기"]];
      const PET_BODY_ROWS = [["default", "기본 체형"], ["type1", "체형 1"], ["type2", "체형 2 (꼬마)"]];
      function petKFit() {   // 펫 창이 화면에 들어가며 그릴 수 있는 최대 배율
        return Math.min(PET_K_MAX, (screen.availHeight - PET_BUBBLE) / H, (screen.availWidth - 40) / W);
      }
      function petClampK(k) {
        const n = Number(k);
        return Number.isFinite(n) ? Math.min(petKFit(), Math.max(PET_K_MIN, n)) : null;
      }
      function petRatio() { return petBaseK > 0 ? free.k / petBaseK : 1; }   // 기본(머리 맞춤) 크기 대비 배율
      function petRatioBounds() {
        const minR = Math.max(0.05, PET_K_MIN / petBaseK);
        return { minR, maxR: Math.max(minR + 0.01, petKFit() / petBaseK) };
      }
      function petLoadRatio() {
        if (!PET) return 1;
        try {
          const n = parseFloat(localStorage.getItem(PET_SIZE_KEY) || "");
          return Number.isFinite(n) && n >= 0.1 && n <= 8 ? n : 1;
        } catch { return 1; }
      }
      function petRememberRatio(r) {
        if (!PET || !Number.isFinite(r) || r <= 0) return;
        clearTimeout(petSizeTimer);
        petSizeTimer = setTimeout(() => { try { localStorage.setItem(PET_SIZE_KEY, String(+r.toFixed(3))); } catch {} }, 250);
      }
      function petSizedPose(pose, fromK, ratio) {   // 아래 가운데를 기준으로 크기만 바꾼 자리
        if (ratio == null) return pose;
        const k = petClampK(petBaseK * ratio);
        if (k == null || Math.abs(k - fromK) < 1e-3) return pose;
        return { k, x: pose.x + W * (fromK - k) / 2, y: pose.y + H * (fromK - k) };
      }
      function petSyncMenu() {   // 우클릭 메뉴 체크 표시용 상태 (펫 프로세스가 메뉴를 만들 때 씀)
        if (!PET) return;
        const outfit = window.__dscOutfit || {};
        const sig = JSON.stringify([+petRatio().toFixed(3), outfit]);
        if (sig === petMenuSig) return;
        petMenuSig = sig;
        PET.send({ type: "state", value: { size: +petRatio().toFixed(3), outfit } });
      }
      function petPanelBox(body) {
        if (!PET || !petPanelOpen || !petPanel) return body;
        const r = petPanel.getBoundingClientRect();
        const box = { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) };
        return body ? { l: Math.min(body.l, box.l), t: Math.min(body.t, box.t), r: Math.max(body.r, box.r), b: Math.max(body.b, box.b) } : box;
      }
      function petSetRatio(ratio, ms) {   // 메뉴·슬라이더에서 크기 변경 (아래 가운데 기준)
        const k = petClampK(petBaseK * ratio);
        if (k == null || drag.on) return;
        const from = free.on && shown.k ? { k: shown.k, x: shown.x, y: shown.y } : { k: free.k, x: free.x, y: free.y };
        if (Math.abs(k - from.k) >= 1e-3) {
          const x = from.x + W * (from.k - k) / 2, y = from.y + H * (from.k - k);
          if (free.on) {
            if (ms > 0) free.anim = { t0: performance.now(), ms, from, to: { k, x, y }, snap: false };
            else { free.anim = null; free.x = x; free.y = y; free.k = k; }
          } else free.k = k;
        }
        petRememberRatio(k / petBaseK);
        petSyncMenu();
        renderPetPanel();
      }
      function renderPetPanel() {
        if (!petPanel) return;
        const { minR, maxR } = petRatioBounds();
        const minPct = Math.max(5, Math.ceil(minR * 100)), maxPct = Math.max(minPct + 1, Math.floor(maxR * 100));
        const pct = Math.min(maxPct, Math.max(minPct, Math.round(petRatio() * 100)));
        const slider = petPanel.querySelector("[data-size-slider]");
        if (slider) {
          if (slider.min !== String(minPct)) slider.min = String(minPct);
          if (slider.max !== String(maxPct)) slider.max = String(maxPct);
          if (slider.value !== String(pct)) slider.value = String(pct);
        }
        const out = petPanel.querySelector("[data-size-value]");
        if (out) out.textContent = pct + "%";
        const outfit = window.__dscOutfit || {};
        for (const input of petPanel.querySelectorAll("[data-outfit]")) input.checked = outfit[input.dataset.outfit] === true;
        const body = outfit.bodyType || "default";
        for (const input of petPanel.querySelectorAll("[data-body]")) input.checked = input.value === body;
      }
      function createPetPanel() {
        const root = document.createElement("div");
        root.id = "dsc-pet-panel";
        root.setAttribute("role", "dialog");
        root.setAttribute("aria-label", "캐릭터 설정");
        root.innerHTML = [
          '<div class="dsc-panel-head"><strong>설정</strong><button type="button" class="dsc-panel-close" data-close aria-label="닫기">×</button></div>',
          '<section class="dsc-panel-section"><div class="dsc-panel-row"><span>크기 <small>기본 대비</small></span><output data-size-value>100%</output></div>',
          '<input type="range" min="50" max="200" step="1" data-size-slider aria-label="캐릭터 크기"></section>',
          '<section class="dsc-panel-section"><div class="dsc-panel-sub">소품·옷</div>',
          ...PET_OUTFIT_ROWS.map(([key, label]) => `<label class="dsc-panel-check"><input type="checkbox" data-outfit="${key}"> ${label}</label>`),
          '</section>',
          '<section class="dsc-panel-section"><div class="dsc-panel-sub">체형</div>',
          ...PET_BODY_ROWS.map(([value, label]) => `<label class="dsc-panel-check"><input type="radio" name="dsc-pet-body" value="${value}" data-body> ${label}</label>`),
          '</section>',
          '<section class="dsc-panel-section dsc-panel-actions"><button type="button" data-hide>캐릭터 잠시 숨기기</button></section>',
        ].join("");
        document.body.append(root);
        root.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closePetPanel(); });
        const slider = root.querySelector("[data-size-slider]");
        slider.addEventListener("input", () => petSetRatio(Number(slider.value) / 100, 0));
        for (const input of root.querySelectorAll("[data-outfit]")) input.addEventListener("change", () => PET.send({ type: "config", list: [[input.dataset.outfit, input.checked]] }));
        for (const input of root.querySelectorAll("[data-body]")) input.addEventListener("change", () => { if (input.checked) PET.send({ type: "config", list: [["bodyType", input.value]] }); });
        root.querySelector("[data-hide]").addEventListener("click", () => { closePetPanel(); PET.send({ type: "config", list: [["character", false]] }); });
        return root;
      }
      function fitPetPanel() {   // 창이 화면 밖으로 걸쳐 있어도 패널은 보이는 화면 안에 놓는다
        if (!petPanel) return;
        const r = petPanel.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const l = Math.max(0, screen.availLeft - screenX), t = Math.max(0, screen.availTop - screenY);
        const rr = Math.min(innerWidth, screen.availLeft + screen.availWidth - screenX);
        const bb = Math.min(innerHeight, screen.availTop + screen.availHeight - screenY);
        const x = Math.max(l + 4, Math.min(rr - r.width - 4, (l + rr - r.width) / 2));
        const y = Math.max(t + 4, Math.min(bb - r.height - 4, (t + bb - r.height) / 2));
        petPanel.style.left = Math.round(x) + "px";
        petPanel.style.top = Math.round(y) + "px";
        petPanel.style.transform = "none";
      }
      function openPetPanel(focus) {
        if (!PET) return;
        if (!petPanel) petPanel = createPetPanel();
        renderPetPanel();
        petPanel.classList.add("show");
        petPanelOpen = true;
        petPanelWin = { w: innerWidth, h: innerHeight };
        fitPetPanel();
        const slider = focus === "size" && petPanel.querySelector("[data-size-slider]");
        if (slider) slider.focus({ preventScroll: true });
        petSyncMenu();
      }
      function closePetPanel() {
        if (!petPanel) return;
        petPanelOpen = false;
        petPanelWin = { w: 0, h: 0 };
        petPanel.classList.remove("show");
      }

      // ---------- Harness 상태 → 반응 ----------
      listeners.tool = (text) => {
        const now = performance.now();
        if (waitingKind || now - lastToolSay < 1500) return;
        lastToolSay = now; say(text, 0, false, "status");
      };
      // 추론 혼잣말: 작업 중 화면의 추론 요약 줄(방금 끝난 문단의 첫 줄)이 바뀌면, 한국어·영어 문장을 가끔 중얼거림
      let lastThought = "", lastMutterAt = 0;
      const thoughtLine = (s) => {
        const t = s.replace(/[*_`#>]+/g, "").replace(/\s+/g, " ").trim()
          .replace(/^(?:[-•]|\d+[.)])\s+/, "")            // 목록 기호 (- • 1. 1))
          .replace(/^\([^)]{1,30}\):?\s*/, "");          // (Self-Correction): 같은 머리말
        const hangul = (t.match(/[가-힣]/g) || []).length;
        const latin = (t.match(/[A-Za-z]/g) || []).length;
        const first = (t.match(/^.{4,}?[.!?。…](\s|$)/) || [t])[0].trim();   // 첫 문장
        if (hangul >= 4 && latin <= hangul * 0.35)                          // 한국어가 대부분인 문장
          return first.length > 42 ? first.slice(0, 40).trim() + "…" : first;
        // 영어 문장: 낱말 3개 이상, 한글은 거의 없고, 코드·경로처럼 기호가 많은 줄은 뺌
        const words = first.split(" ").filter((w) => /[A-Za-z]{2,}/.test(w)).length;
        const symbols = (first.match(/[{}()\[\];=<>\/\\|$@]/g) || []).length;
        if (latin < 12 || words < 3 || hangul > latin * 0.1 || symbols > first.length * 0.04 || first.includes("://")) return null;
        let line = vtuberize(first);
        const hmm = Math.random() < 0.3 ? "Hmm… " : "";                    // 가끔 생각하는 소리
        const max = 64 - hmm.length;
        if (line.length > max) {
          const cut = line.slice(0, max - 2), sp = cut.lastIndexOf(" ");    // 낱말 중간에서 자르지 않음
          line = (sp > 30 ? cut.slice(0, sp) : cut).replace(/[\s,;:]+$/, "") + "…";
        }
        if ((line.match(/"/g) || []).length % 2) line = line.slice(0, line.lastIndexOf('"')).replace(/[\s,;:]+$/, "") + "…";   // 따옴표 짝 맞추기
        return hmm + line;
      };
      // 버튜버 말투: 추론 속 "the user"를 시청자에게 말하듯 "you"로 (동사도 맞춤)
      const VERB = { is: "are", was: "were", has: "have", wants: "want", needs: "need", asks: "ask", asked: "asked",
        said: "said", says: "say", likes: "like", prefers: "prefer", seems: "seem", mentioned: "mentioned", requested: "requested" };
      const vtuberize = (s) => s
        .replace(/\b(the|this) user's\b/gi, (m) => (m[0] === "T" ? "Your" : "your"))
        .replace(/\b(the|this) user (\w+)/gi, (m, d, v) => {
          const you = d[0] === d[0].toUpperCase() ? "You" : "you";
          return you + " " + (VERB[v.toLowerCase()] || v);
        })
        .replace(/\b(the|this) user\b/gi, (m) => (m[0] === m[0].toUpperCase() ? "You" : "you"));
      const readThought = () => {
        // 요약 줄은 진짜 줄 + 늘 비어 있는 숨은 사본이 함께 있어서, 글자가 있는 마지막 줄을 고름
        const live = [...document.querySelectorAll('[class*="VJlF5q_summary"][data-streaming]')].map((e) => (e.textContent || "").trim()).filter(Boolean).pop();
        if (live) return live;
        // 추론이 진행 묶음 안에 접혀 있으면 요약 줄이 안 그려짐 → 묶음 제목("요청 분석 중 · <지금 문단 첫 줄>")의 뒷부분을 읽음
        //   진행 중인 묶음만 data-shimmer 가 붙고, 그 안의 두 번째 span 은 반짝이 효과용 사본이라 첫 span 만 읽음
        const live2 = [...document.querySelectorAll('button[data-process-activity="thinking"][aria-expanded="false"] [data-shimmer] > span:first-child')].pop();
        if (live2) {
          const t = live2.textContent || "", i = t.indexOf(" · ");
          if (i >= 0 && t.slice(i + 3).trim()) return t.slice(i + 3).trim();
        }
        const body = [...document.querySelectorAll('[class*="VJlF5q_thinkBody"]')].pop();   // 펼쳐 둔 경우: 마지막으로 끝난 문단
        if (!body) return "";
        const paras = (body.innerText || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        return paras.length > 1 ? paras[paras.length - 2].split("\n")[0] : "";
      };
      const mutterCheck = () => {
        const raw = readThought();
        if (!raw || raw === lastThought) return;
        lastThought = raw;
        const now = performance.now();
        if (now - lastMutterAt < 6000 || now - lastSayAt < 2500) return;
        const line = thoughtLine(raw);
        if (!line) return;
        lastMutterAt = now;
        say(line, Math.min(5200, Math.max(3800, 1500 + line.length * 55)), true);
        if (Math.random() < 0.35) play("tilt", 1600);
      };

      // 시작 인사 (가운데 연출 중): 0.7초 뒤 5.8초 동안
      if (!PET) setTimeout(() => { if (!link.open) { say(TEXT.hello, 5800, false, "reaction"); play("sway", 2300); } }, 700);
      window.__dsc = { say, play, setMood, flashExp, sulking: () => performance.now() < sulkUntil, sulkPeeks: () => sulkPeeks.map((p) => ({ at: Math.round(p.at), flip: p.flip })), walk: () => { if (!walk.phase && fleeX === 0) startWalk(); return walk.phase; }, walking: () => walk.phase, sleep: () => SLEEP.state, regionAt: (cx, cy) => { const h = hitAt(cx, cy); return h && touchRegion(h[0], h[1], h[2]); }, fleeX: () => fleeX, bubble: () => bubble.classList.contains("show") ? bubble.textContent : "", lines: TEXT, voice: (s) => { voiceState = s && s.speaking !== false ? s : null; } };   // 확인용

      // ---------- 바깥 펫 창 연결 (창 안 캐릭터 쪽) ----------
      // 플러그인 호스트가 /deepseek-harness-kr/pet/ 아래에서 펫 프로세스를 띄우고 메시지를 이어 줌 (ASAR 패치 방식에는 없어서 꺼짐)
      linkPost = (path, body = {}) => {
        window.__dscPetUsed = true;   // 플러그인이 내려갈 때 펫 창을 숨길지 판단
        return fetch(PET_URL + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
          .then((r) => (r.ok ? r.json() : null)).then((s) => { if (s?.state) link.petState = s.state; return s; }).catch(() => null);
      };
      // 펫 창이 보이기 시작할 때 지금 표정·자세를 한 번에 맞춤 (따라오는 동안·숨어 있는 동안 바뀐 것, 예: 작업이 끝나 로딩 표정이 꺼짐)
      const syncPet = () => {
        const left = moodUntil ? Math.max(1, moodUntil - performance.now()) : 0;
        link.queue.push(...Object.keys(hold).map((name) => ["setExp", [name, !!hold[name]]]), ["setMood", [mood, left]]);
        if (!bubble.classList.contains("show")) link.queue.push(["hush", []]);
      };
      const enterLink = () => {   // 펫 창이 보이기 시작함 → 창 안 캐릭터는 숨기고 그리기를 멈춤
        const already = !!link.follow?.shown;
        link.open = true; link.opening = 0; link.last = ""; window.__dscPetUsed = true;
        skipIntro(); free.anim = null; drag.pending = null; drag.on = false;
        if (!already) syncPet();
        try { app.ticker.stop(); } catch {}
      };
      const leaveLink = () => {   // 펫 창이 제자리에 붙었거나 닫힘 → 창 안 제자리로
        if (!link.open) { link.opening = 0; return; }   // 아직 안 떴으면 창 안 캐릭터는 그대로
        link.open = false; link.opening = 0; link.queue = [];
        SLEEP.state = "active"; SLEEP.lastActive = performance.now();
        free.on = false; free.anim = null; saveFree(); lastPlaceKey = "";   // 제자리로 (창이 좁으면 구석, 매 프레임 다시 계산)
        // 창 안 캐릭터가 다시 그려지는 프레임에 바로 펫 창을 숨김 (펫 창이 스스로 숨을 때까지 둘이 겹쳐 보이던 것 방지)
        requestAnimationFrame(() => { if (!link.open && !link.follow) linkPost("hide"); });
        try { app.ticker.start(); } catch {}
      };
      const poll = () => {
        if (link.polling) return;
        link.polling = true;
        fetch(PET_URL + "poll", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((s) => {
          link.polling = false;
          if (!s) return;
          link.supported = !!s.supported; link.petState = s.state || "none";
          if (link.boot && Number.isInteger(s.seq)) link.seq = Math.max(link.seq, s.seq);   // 새로 불러온 화면은 회차 번호를 이어받음
          for (const ev of s.events || []) {
            if (ev.seq !== undefined && ev.seq !== link.seq) continue;   // 이전 회차(붙고 숨은 뒤 늦게 남은) 알림은 버림
            // 보임: 이쪽이 연(따라오게 했거나 던져서 연) 경우만 받음. 이미 숨기라고 한 뒤 늦게 온 알림은 무시
            if (ev.type === "shown") { if (link.follow) { if (!link.follow.shown) { link.follow.shown = true; syncPet(); } } else if (link.opening) enterLink(); }
            // 붙음·닫힘·오류: 창 안 캐릭터로 돌아옴. 숨음: 펫 창이 맡고 있던 때만 (방금 이쪽이 숨긴 따라오기 창이면 무시)
            else if (ev.type === "attach" || ev.type === "closed" || ev.type === "error") { link.follow = null; leaveLink(); }
            else if (ev.type === "hidden" && link.open) leaveLink();
            else if (ev.type === "hidden" && link.follow?.shown) link.follow.shown = false;   // 따라오던 펫 창이 숨음 → 창 안 캐릭터가 다시 보이게
            else if (ev.type === "config" && Array.isArray(ev.list)) {   // 펫 창 우클릭 메뉴·설정 패널에서 바꾼 값
              for (const pair of ev.list) if (Array.isArray(pair) && pair.length === 2 && typeof pair[0] === "string") {
                try { window.__dscSetConfig?.(pair[0], pair[1]); } catch {}
              }
            }
          }
          // 이 화면을 새로 불러왔는데 펫 창이 떠 있음 (처음 한 번만: 붙은 직후 잠깐 남은 펫 창 때문에 다시 숨으면 안 됨)
          if (link.boot && s.state === "shown" && !link.open) { if (Number.isInteger(s.seq)) link.seq = s.seq; enterLink(); }
          link.boot = false;
        }).catch(() => { link.polling = false; });
      };
      if (PET_URL) {
        poll();
        // 처음 끌 때 펫 프로세스가 준비되길 기다리지 않게(약 2.5초, 그동안 창 밖에서 캐릭터가 잘리다 튐), 화면이 자리 잡고 한가할 때 숨긴 채 미리 띄워 둠.
        // 시작 인사·작업 중·창이 안 보일 때는 미루고, 한가한 때(requestIdleCallback)에 한 번만. 시작하는 동안은 호스트가 낮은 우선순위로 돌림
        const warmUp = (tries = 0) => {
          if (link.open || link.follow || (link.supported && link.petState !== "none")) return;
          if (!link.supported) { poll(); if (tries < 8) setTimeout(() => warmUp(tries + 1), 3000); return; }   // 호스트가 늦게 뜨면 처음 조회가 실패했을 수 있어 다시 물어봄 (지원 안 하면 포기)
          if (intro.phase !== "done" || running || document.hidden) { setTimeout(() => warmUp(tries), 3000); return; }
          (window.requestIdleCallback || ((f) => setTimeout(f, 0)))(() => { if (link.petState === "none") linkPost("warm"); }, { timeout: 5000 });
        };
        setTimeout(warmUp, 5000);
        setInterval(() => {
          if (link.opening && performance.now() - link.opening > 15000) link.opening = 0;   // 펫 창이 끝내 안 뜨면 포기
          if (!link.open && !link.opening && !link.follow) return;
          if (link.open || link.follow) {   // 붙을 자리(DSH 창의 제자리, 창이 좁으면 구석)와 소품·옷을 펫 창에 알려 줌
            const h = dockTarget(link.home || homePose()), d = screenOf(h.x - fleeX, h.y);
            // 붙는 순간 창 안 상반신 그림과 정확히 겹치도록, 허리(잘린 단면)와 가슴 중심을 기준으로 자리를 잡는다.
            //  · 창 안: 허리는 캔버스 y = WAIST_WIN, 상반신 가로 중심은 캔버스 가운데
            //  · 펫 창: 같은 허리·중심이 그 지점에 오도록 배율(PET_HEAD_RATIO)과 위치를 역산
            const k2 = h.k * PET_HEAD_RATIO;
            const wx = d.x + W * h.k / 2;              // 창 안 상반신 가로 중심 (화면)
            const wy = d.y + h.k * WAIST_WIN;          // 창 안 허리 (화면)
            const tl = screenOf(0, 0), br = screenOf(innerWidth, innerHeight);   // DSH 창 영역 (펫 창이 다시 붙을지 판단)
            const dock = {
              k: +k2.toFixed(3),
              x: Math.round(wx - k2 * (W / 2 + (BUST_CX - FULL_CX) * sFull)),
              y: Math.round(wy - k2 * WAIST_PET),
              win: { l: Math.round(tl.x), t: Math.round(tl.y), r: Math.round(br.x), b: Math.round(br.y) },
            }, outfit = window.__dscOutfit || {};
            const sig = JSON.stringify([dock, outfit]);
            if (sig !== link.last) { link.last = sig; link.queue.push(["dock", [dock]], ["outfit", [outfit]]); }
            if (link.queue.length) { const list = link.queue; link.queue = []; linkPost("send", { list }); }
          }
          poll();
        }, 150);
        // 입 모양(외부 음성 상태)은 따로 자주 보냄
        setInterval(() => {
          if (!link.open || voiceState === link.voiceSent) return;
          link.voiceSent = voiceState;
          linkPost("send", { list: [["voice", [voiceState]]] });
        }, 60);
      }

      // ---------- 펫 창 쪽: 창 안 캐릭터가 보낸 반응을 그대로 재생 ----------
      if (PET) {
        const local = { say, play, setMood, flashExp, setExp, hush };
        PET.on((m) => {
          if (m.type === "cursor") {   // 따라오는 중 커서 (화면 좌표). 몸 위치 = 커서 − 잡은 자리
            if (!drag.on || !petGrab) return;
            const now = performance.now();
            drag.x = m.x - petGrab.x; drag.y = m.y - petGrab.y;
            drag.samples.push([now, m.x, m.y]);
            while (drag.samples.length > 2 && now - drag.samples[0][0] > 100) drag.samples.shift();
            const [t0, x0, y0] = drag.samples[0], dt = Math.max(16, now - t0) / 1000;
            carry.vx += ((m.x - x0) / dt - carry.vx) * 0.5; carry.vy += ((m.y - y0) / dt - carry.vy) * 0.5;
          } else if (m.type === "power") {   // 창이 숨으면 그리기를 멈춰 CPU·GPU를 쓰지 않음 (숨은 창도 백그라운드 제한이 꺼져 있어 계속 그려짐)
            if (!m.on) { petTracking = false; petGrab = null; closePetPanel(); }
            try { m.on ? app.ticker.start() : app.ticker.stop(); } catch {}
          } else if (m.type === "panel") {   // 우클릭 메뉴: 설정(또는 크기) 패널 열기
            openPetPanel(m.focus);
          } else if (m.type === "size") {   // 우클릭 메뉴: 정해진 배율로 (기본 대비)
            petSetRatio(Number(m.ratio), 220);
          } else if (m.type === "open") {   // 창 밖으로 던진 자리에서 나타나 남은 거리만큼 미끄러짐. follow면 놓을 때까지 창 안 커서를 따라옴
            try { app.ticker.start(); } catch {}
            // 이전 회차에 남은 상태(끄는 중·식은땀·산책·도망)를 모두 지우고 시작
            for (const t of walk.timers) clearTimeout(t);
            walk.timers = []; walk.slideId++; walk.phase = ""; fleeX = 0; drag.pending = null; PET.press(false);
            closePetPanel();
            petDocked = false; free.on = true; Object.assign(free, m.from);
            petGrab = m.follow ? (m.grab || { x: 0, y: 0 }) : null; petTracking = !!m.follow;
            // 펫 창은 전신이라 같은 배율이면 머리가 작아진다. 창 안 배율과의 비율(HEAD_GAIN)만큼 키워 머리 크기를 맞추고,
            // 창(과 화면)에 들어가는 크기로 자른다. 아래 가운데를 고정한 채 배율만 바꾼다
            const kFrom = Number(m.from.k) || 1;
            const kBase = Math.min(petKFit(), Math.max(PET_K_MIN, kFrom * HEAD_GAIN));   // 기본(머리 맞춤) 크기
            petBaseK = kBase;
            // 기억해 둔 배율: 따라오는 중에는 놓을 때(release)에 맞추고, 바로 나타날 때는 미끄러지며 맞춘다
            const ratio = petLoadRatio();
            petPendingRatio = m.follow ? ratio : null;
            const kApply = m.follow ? kBase : petClampK(kBase * ratio);
            if (kApply !== kFrom) {
              const dk = kFrom - kApply;
              free.x += W * dk / 2; free.y += H * dk; free.k = kApply;
              if (petGrab) petGrab = { x: petGrab.x * kApply / kFrom, y: petGrab.y * kApply / kFrom };
            }
            const pose = { k: free.k, x: free.x, y: free.y }, to = { k: kApply, x: m.to.x + W * (kFrom - kApply) / 2, y: m.to.y + H * (kFrom - kApply) };
            PET.send({ type: "track", on: !!m.follow, grab: petGrab, off: { x: (innerWidth - W * pose.k) / 2, y: innerHeight - H * pose.k } });   // 따라오기: 펫 프로세스가 커서를 따라 창을 옮기고 커서를 보내 줌
            drag.on = !!m.follow; drag.x = pose.x; drag.y = pose.y; drag.samples = [[performance.now(), pose.x + (petGrab?.x ?? 0), pose.y + (petGrab?.y ?? 0)]];
            free.anim = m.follow ? null : { t0: performance.now(), ms: 300, from: pose, to: keepIn(to), snap: false };
            until.sweat = m.follow ? Infinity : 0;
            movePet(pose); PET.send({ type: "placed" });
            petSyncMenu();
          } else if (m.type === "home") {   // 우클릭 메뉴: 창으로 돌아가기
            closePetPanel();   // 붙을 자리(원래 크기)로 애니메이션되고 펫 창은 닫힌다
            if (petDock) free.anim = { t0: performance.now(), ms: 650, from: { ...shown }, to: null, snap: true };
            else PET.send({ type: "attach" });
          } else if (m.type === "cmd") {
            for (const [fn, a] of m.list || []) {
              if (fn === "outfit") { window.__dscOutfit = a[0]; renderPetPanel(); petSyncMenu(); }
              else if (fn === "dock") petDock = a[0];
              else if (fn === "voice") voiceState = a[0];
              else if (fn === "release" && drag.on) {   // 창 밖에서 놓음 → 여기서 이어서 미끄러지거나 붙음
                petGrab = null; petTracking = false; PET.send({ type: "track", on: false });
                drag.on = false; until.sweat = performance.now() + 400; release(a[0], a[1]);
              } else if (Object.hasOwn(local, fn) && Array.isArray(a)) local[fn](...a);
            }
          }
        });
        try { app.ticker.stop(); } catch {}   // 처음엔 숨은 채 대기 (open 이 오면 그리기 시작)
        PET.send({ type: "ready" });
      }
      setInterval(() => {
        const nowRunning = !!document.querySelector(UI.stop);
        const kind = document.querySelector(UI.approval + ', [class*="Zf6DNq_card"]') ? "approval"
          // 질문 카드 클래스명은 셸 빌드마다 해시가 바뀌어 곧 죽은 셀렉터가 된다. 셸이 안정적으로 내보내는
          // data 속성을 먼저 보고, 구버전 셸을 위해 기존 해시도 함께 남긴다.
          : document.querySelector('[data-question-reply], [data-question-key], [class*="Nksazq_card"], [class*="wnLwla_card"]') ? "question" : null;
        const cfg = window.__dscSleep || {};
        SLEEP.enabled = !PET && cfg.enabled !== false;
        const cfgMin = Number(cfg.minutes);
        SLEEP.minutes = Number.isFinite(cfgMin) ? Math.min(60, Math.max(0.5, cfgMin)) : 1;
        // 잠든 동안에도 대기 카드를 확인하고 기존 반응으로 이어감
        if (nowRunning || kind || !SLEEP.enabled) sleepActivity();
        if (SLEEP.state === "asleep") return;
        if (nowRunning && !waitingKind && !kind) mutterCheck();
        if (kind !== waitingKind) {
          waitingKind = kind;
          setExp("sweat", kind === "approval");
          setExp("squint", kind === "question");
          if (kind) { say(TEXT[kind], 0, false, "reaction"); setMood("wait"); play("tilt", 1800); }
          else { setMood(running ? "work" : "idle"); if (running) hush(); }
        }
        if (nowRunning && !running) {
          running = true; lastError = -1e9;
          setExp("loading", true);
          if (!waitingKind) { say(TEXT.start, 2500, false, "reaction"); setMood("work"); play("nod", 1300); }
        } else if (!nowRunning && running) {
          running = false;
          setExp("loading", false);
          setTimeout(() => {   // 실패 문구가 늦게 그려질 수 있어 잠깐 기다림
            if (running) return;
            if (performance.now() - lastError < 8000) { flashExp("tears", 5000); flashExp("dizzy", 2500); say(TEXT.error, 5000, false, "reaction"); setMood("sad", 5000); play("droop", 2000); }
            else { flashExp("heart", 4000); flashExp("blush", 4000); say(TEXT.done, 4000, false, "reaction"); setMood("idle"); play("laugh", 1700); }
          }, 600);
        }
        // 절전 판정: 설정된 시간 동안 입력·작업·대기·화면 전환이 없으면 잠시 쉬러 감
        if (SLEEP.enabled && SLEEP.state === "active" && !running && !waitingKind && !document.hidden &&
            performance.now() - SLEEP.lastActive > SLEEP.minutes * 60000 &&
            performance.now() - lastSayAt > 5000 && !bubble.classList.contains("show"))
          sleepGo();
      }, 400);
    })().catch((e) => console.warn("DeepSeek짱 캐릭터 로드 실패:", e));
  });
})();
