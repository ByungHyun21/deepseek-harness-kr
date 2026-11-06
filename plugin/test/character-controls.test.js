import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

// dsc.js의 순수 계산/상태 조각을 그대로 실행해 확인한다. DOM·캔버스 없이 돌 수 있게
// 필요한 값만 vm 컨텍스트에 넣고, 실제 소스 구간(문자열 경계)을 잘라 쓴다.
const source = await readFile(new URL('../../assets/dsc.js', import.meta.url), 'utf8')

const sliceBetween = (startText, endText) => {
  const start = source.indexOf(startText)
  const end = source.indexOf(endText, start)
  assert.ok(start >= 0, `소스에서 시작 지점을 찾지 못했습니다: ${startText}`)
  assert.ok(end > start, `소스에서 끝 지점을 찾지 못했습니다: ${endText}`)
  return source.slice(start, end)
}
const runScript = (script, context, expose) => vm.runInContext(`${script}\n${expose}`, vm.createContext(context))

test('말풍선 꼬리는 코에 맞추고, 화면 경계는 최소 여백만 남긴다', () => {
  // HOME_GAP·tailRight·tailLeft·BUBBLE_TAIL 이 함께 있는 구간 (homeLayout/bubbleLayout 정의는 실행하지 않는다)
  const slice = sliceBetween('const HOME_GAP = 8', 'let curK = 1, fleeX = 0;')
  const { tailRight, tailLeft, BUBBLE_TAIL } = runScript(slice, {}, '({ tailRight, tailLeft, BUBBLE_TAIL })')
  assert.equal(BUBBLE_TAIL, 55)

  // 꼬리(오른쪽 55px)의 중심이 정확히 코(noseX)에 온다: width - right - 55 === noseX
  const right = tailRight({ noseX: 300, width: 1000 })
  assert.equal(right, 645)
  assert.equal(1000 - right - 55, 300)

  // 코가 오른쪽 끝에 붙어도 오른쪽 여백(HOME_GAP=8px)보다 좁아지지 않는다
  assert.equal(tailRight({ noseX: 980, width: 1000 }), 8)
  assert.equal(tailRight({ noseX: 1200, width: 1000 }), 8)

  // 등장 연출(왼쪽 기준): 꼬리가 코에 오게 두고 화면 안으로 자른다
  assert.equal(tailLeft({ noseX: 300, bw: 200, width: 1000 }), 155)
  assert.equal(155 + 200 - 55, 300)
  // 오른쪽으로 넘치면 오른쪽 여백만 남기고 당긴다
  assert.equal(tailLeft({ noseX: 990, bw: 200, width: 1000 }), 1000 - 200 - 8)
  // 왼쪽으로 넘치면 왼쪽 여백으로 자른다
  assert.equal(tailLeft({ noseX: 20, bw: 300, width: 330 }), 8)
  // 말풍선 폭이 화면보다 넓으면 왼쪽 여백을 지킨다
  assert.equal(tailLeft({ noseX: 50, bw: 400, width: 330 }), 8)
})

test('터치 제스처: 가로 끌기는 집기, 세로 움직임은 쓰다듬기, 가만히 길게 누르면 집기', () => {
  const slice = sliceBetween('const TOUCH = {', 'document.addEventListener("pointermove"')
  const { touchGesture, TOUCH } = runScript(slice, {}, '({ touchGesture, TOUCH })')
  assert.equal(TOUCH.grabMs, 320)
  assert.equal(TOUCH.verticalPx, 8)

  assert.equal(touchGesture({ dx: 20, dy: 2 }), 'grab')       // 가로 끌기
  assert.equal(touchGesture({ dx: 20, dy: 10 }), 'grab')      // 가로 우세(1.2배 이상)
  assert.equal(touchGesture({ dx: 6, dy: 12 }), 'stroke')     // 세로 8px 초과 → 쓰다듬기 (길게 누르기 아님)
  assert.equal(touchGesture({ dx: 0, dy: 10, heldMs: 5000 }), 'stroke')   // 느린 세로 스트로크도 집기로 바뀌지 않는다
  assert.equal(touchGesture({ dx: 0, dy: 0, heldMs: 100 }), 'wait')
  assert.equal(touchGesture({ dx: 0, dy: 0, heldMs: 330 }), 'grab')       // 가만히 길게 누르면 집기
  assert.equal(touchGesture({ dx: 3, dy: 3, heldMs: 330 }), 'grab')
})

test('이동 키가 빈 문자열이면 드래그 보조 키가 꺼진다', () => {
  const slice = sliceBetween('const dragKeyRaw =', 'const TOUCH = {')
  const context = { window: {}, PET: false, link: { open: false }, linkPost() {}, addEventListener() {} }
  const { dragKeyToken, dragKeyHeld, rememberKey } = runScript(
    slice, context, '({ dragKeyRaw, dragKeyToken, dragKeyHeld, rememberKey })')
  const setKey = (key) => { context.window.__dscDrag = { key } }

  setKey('')
  assert.equal(dragKeyToken(), '')
  assert.equal(dragKeyHeld({ buttons: 1, altKey: true }), false)   // 빈 값이면 Alt 로 되돌아가지 않는다
  assert.equal(dragKeyHeld({ buttons: 1 }), false)
  setKey('None')
  assert.equal(dragKeyHeld({ buttons: 1 }), false)

  setKey('Alt')
  assert.equal(dragKeyToken(), 'alt')
  assert.equal(dragKeyHeld({ buttons: 1, altKey: true }), true)
  assert.equal(dragKeyHeld({ buttons: 1 }), false)                 // Alt 를 안 누르면 끌기 아님
  assert.equal(dragKeyHeld({ buttons: 0, altKey: true }), false)   // 왼쪽 버튼 없이는 끌기 아님

  setKey('F')                                                      // 일반 키 하나
  assert.equal(dragKeyHeld({ buttons: 1 }), false)
  rememberKey({ key: 'f' }, true)
  assert.equal(dragKeyHeld({ buttons: 1 }), true)
  rememberKey({ key: 'f' }, false)
  assert.equal(dragKeyHeld({ buttons: 1 }), false)
})

test('캔버스 숨김: 숨기면 그리기만 멈추고 칩을 남기며, 복구하면 제자리로 돌아온다', () => {
  const { setHidden, syncHideChip, hideChipVisible, hidden, chip } = runChipContext()
  assert.equal(hidden(), false)

  setHidden(true)
  assert.equal(hidden(), true)
  assert.equal(setHidden(true), true)          // 같은 값이면 아무 것도 하지 않는다
  assert.ok(chip(), '숨김 상태에서는 복구 칩이 있어야 한다')
  assert.equal(setHidden(false), false)
  assert.equal(chip(), null, '복구하면 칩을 지운다')
})

test('복구 칩은 모바일 숨김 설정이면 남지 않고, 설정을 되돌리면 다시 보인다', () => {
  const h = runChipContext()
  h.setHidden(true)
  assert.ok(h.chip())

  h.setMobileHidden(true)       // 설정에서 모바일 표시를 껐다 → 칩도 모바일에 남기지 않는다
  h.syncHideChip()
  assert.equal(h.chip(), null)
  assert.equal(h.hideChipVisible(), false)

  h.setMobileHidden(false)      // 설정을 되돌리면 다음 동기화에 칩이 다시 보인다 (복구 경로 유지)
  h.syncHideChip()
  assert.ok(h.chip())
  assert.equal(h.hideChipVisible(), true)

  h.setMobileHidden(true)
  h.setHidden(false)            // 칩 없이도 설정/단축키로 복구된다
  assert.equal(h.hidden(), false)
  assert.equal(h.chip(), null)
})

test('모바일 숨김 설정에서는 새 숨김에도 칩을 만들지 않는다', () => {
  const h = runChipContext()
  h.setMobileHidden(true)
  h.setHidden(true)
  assert.equal(h.hidden(), true)
  assert.equal(h.chip(), null)
  h.setHidden(false)
})

test('티커는 상태가 바뀔 때만 시작/정지한다 (매 프레임 start/stop 반복 없음)', () => {
  const slice = sliceBetween('const setRender =', 'const place = () =>')
  const ticker = {
    started: true, starts: 0, stops: 0,
    start() { this.started = true; this.starts++ },
    stop() { this.started = false; this.stops++ },
  }
  const { setRender } = runScript(slice, { app: { ticker } }, '({ setRender })')
  setRender(true)
  setRender(true)
  assert.equal(ticker.starts, 0)
  setRender(false)
  setRender(false)
  setRender(false)
  assert.equal(ticker.stops, 1)
  setRender(true)
  assert.equal(ticker.starts, 1)
  assert.equal(ticker.started, true)
})

test('캔버스를 숨긴 동안 펫 창 단축키는 아무 것도 하지 않고, 복구하면 다시 열린다', () => {
  const slice = sliceBetween('const petOpenPose = () =>', 'window.__dscPetToggle = petToggle;')
  const context = {
    hidden: true,
    PET_URL: '/dsc-pet/',
    SLEEP: { state: 'active' },
    shown: { k: 0.8, x: 100, y: 200 },
    link: { open: false, follow: null, petState: 'none', opening: 0, seq: 0 },
    homePose: () => ({ k: 0.5, x: 0, y: 0 }),
    dockTarget: (home) => home,
    screenOf: (x, y) => ({ x: x + 10, y: y + 20 }),
    enterLink() {},
    performance: { now: () => 1234 },
    calls: [],
    linkPost(type, payload) { context.calls.push([type, payload]) },
  }
  const { petToggle } = runScript(slice, context, '({ petToggle })')
  petToggle()   // 숨김 상태: no-op (stale shown 포즈로 펫 창을 열지 않는다)
  assert.deepEqual(context.calls, [])
  assert.equal(context.link.opening, 0)

  context.hidden = false
  petToggle()   // 복구 후: 정상적으로 펫 창을 연다
  assert.equal(context.calls.length, 1)
  assert.equal(context.calls[0][0], 'open')
  assert.equal(context.link.opening, 1234)

  context.link.open = true
  context.calls.length = 0
  petToggle()   // 펫 창이 떠 있으면 창 안으로 되돌린다
  assert.equal(context.calls[0][0], 'hide')
})

test('동물귀 파트 lookup: Part159 인덱스를 찾고, 없으면 -1로 안전하게 넘긴다', () => {
  const slice = sliceBetween('const EAR_PART_ID = "Part159";', 'let basinUntil = 0, basinW = 0;')
  const cm = {
    parts: { ids: ['Part81', 'Part156', 'Part159'] },
    drawables: { count: 1, parentPartIndices: [2], opacities: [1], dynamicFlags: [1] },
  }
  const api = runScript(slice, { cm, window: {} }, `({
    earPartIndexFor, earPartIndex, earDrawables,
    earPartIndexMissing: earPartIndexFor(['Part81'], 'Part159'),
    earPartIndexNull: earPartIndexFor(null, 'Part159'),
  })`)
  assert.equal(api.earPartIndex, 2)
  assert.equal(api.earPartIndexMissing, -1)
  assert.equal(api.earPartIndexNull, -1)
  assert.deepEqual(Array.from(api.earDrawables), [0])
})

test('귀 파트 opacity만 바꾸고 다른 파트·기하(model.x/scale)는 건드리지 않는다', () => {
  const slice = sliceBetween('const EAR_PART_ID = "Part159";', 'let basinUntil = 0, basinW = 0;')
  const cm = { parts: { ids: ['Part159'], opacities: new Float32Array([1]) }, drawables: { count: 0, parentPartIndices: [], opacities: [], dynamicFlags: [] } }
  const model = { x: 12.5, y: -3, scale: { x: 0.42, y: 0.42 } }
  const { applyEarOpacity, earOpacityValue } = runScript(slice, { cm, window: {} }, '({ applyEarOpacity, earOpacityValue })')
  const parts = { opacities: new Float32Array([1, 1, 1, 1]) }
  const before = { x: model.x, y: model.y, sx: model.scale.x, sy: model.scale.y }
  assert.equal(applyEarOpacity(parts, 2, 1), true)
  assert.equal(parts.opacities[2], 0)
  assert.deepEqual([...parts.opacities], [1, 1, 0, 1])
  assert.equal(applyEarOpacity(parts, 2, 0.5), true)
  assert.equal(parts.opacities[2], earOpacityValue(0.5))
  assert.deepEqual(before, { x: model.x, y: model.y, sx: model.scale.x, sy: model.scale.y })
  // 없는 파트/빈 parts는 조용히 no-op (예외 없음)
  const untouched = new Float32Array([1, 1])
  assert.equal(applyEarOpacity({ opacities: untouched }, -1, 1), false)
  assert.equal(applyEarOpacity(null, 0, 1), false)
  assert.deepEqual([...untouched], [1, 1])
})

test('귀 숨김은 부드럽게 0..1 사이로 보간되고, 끄면 원래대로 돌아온다', () => {
  const slice = sliceBetween('const EAR_PART_ID = "Part159";', 'let basinUntil = 0, basinW = 0;')
  const cm = { parts: { ids: ['Part159'] }, drawables: { count: 0, parentPartIndices: [], opacities: [], dynamicFlags: [] } }
  const { earOpacityStep, earOpacityValue, setEarW, getEarW } = runScript(slice, { cm, window: {} }, '({ earOpacityStep, earOpacityValue, setEarW: (v) => { earW = v }, getEarW: () => earW })')
  let w = 0
  w = earOpacityStep(w, true, 0.1)
  assert.ok(w > 0 && w < 1, '한 프레임에 1로 점프하지 않는다')
  for (let i = 0; i < 40; i++) w = earOpacityStep(w, true, 0.1)
  assert.equal(w, 1)
  assert.equal(earOpacityValue(w), 0)
  for (let i = 0; i < 40; i++) w = earOpacityStep(w, false, 0.1)
  assert.ok(Math.abs(w) < 1e-9, '끄면 0으로 돌아온다')
  assert.equal(earOpacityValue(0), 1)
  // dt가 커도 0..1 범위를 벗어나지 않는다
  assert.equal(earOpacityStep(0, true, 10), 1)
  assert.equal(earOpacityStep(1, false, 10), 0)
  setEarW(0.25)
  assert.equal(getEarW(), 0.25)
})

test('귀 터치 판정: earHide 감쇠 전 가시성을 유지하되, 다른 원인으로 숨은 귀는 되살리지 않는다', () => {
  const slice = sliceBetween('const EAR_PART_ID = "Part159";', 'let basinUntil = 0, basinW = 0;')
  const make = (opacities, flags) => {
    const cm = {
      parts: { ids: ['Part159'] },
      drawables: { count: 2, parentPartIndices: [0, 0], opacities: new Float32Array(opacities), dynamicFlags: new Uint8Array(flags) },
    }
    return { cm, api: runScript(slice, { cm, window: {} }, '({ earHitVisible, earBaseVisible, setEarW: (v) => { earW = v } })') }
  }
  const normal = make([1, 1], [1, 1])
  assert.equal(normal.api.earBaseVisible.get(0), true)
  normal.api.setEarW(0)
  assert.equal(normal.api.earHitVisible(0), true)
  // earHide가 꺼져 있으면 현재 상태 그대로: 다른 원인이 opacity/flag를 0으로 만들면 클릭 불가
  normal.cm.drawables.opacities[0] = 0
  normal.cm.drawables.dynamicFlags[0] = 0
  assert.equal(normal.api.earHitVisible(0), false, '다른 원인으로 숨은 귀를 클릭 가능하게 만들면 안 된다')
  // earHide로 감쇠 중(코어가 flag까지 끔)에는 감쇠 전 가시성으로 기존 터치 판정 유지
  normal.cm.drawables.opacities[0] = 0.4
  normal.cm.drawables.dynamicFlags[0] = 0
  normal.api.setEarW(0.6)
  assert.equal(normal.api.earHitVisible(0), true)
  // 감쇠 전에도 보이지 않던 drawable은 계속 제외
  const hiddenAtBase = make([1, 0], [1, 0])
  hiddenAtBase.api.setEarW(1)
  assert.equal(hiddenAtBase.api.earHitVisible(1), false)
})

test('worker는 전달받은 parts opacities(귀 포함)를 Core 모델에 그대로 적용한다', async () => {
  const source = await readFile(new URL('../../assets/dsc-core-worker.js', import.meta.url), 'utf8')
  const P = 2, N = 2, partsCount = 3, earPart = 1
  const model = {
    parameters: { count: P, values: new Float32Array(P) },
    parts: { count: partsCount, opacities: new Float32Array(partsCount).fill(1) },
    updates: 0,
    update() { this.updates++ },
    drawables: {
      count: N,
      vertexPositions: [new Float32Array(6), new Float32Array(6)],
      opacities: new Float32Array(N).fill(1),
      drawOrders: new Int32Array(N),
      renderOrders: new Int32Array(N),
      multiplyColors: new Float32Array(N * 4).fill(1),
      screenColors: new Float32Array(N * 4),
      dynamicFlags: new Uint8Array(N).fill(1),
      resetDynamicFlags() {},
    },
  }
  const messages = []
  const context = {
    importScripts() {}, postMessage(message) { messages.push(message) }, onmessage: null, console,
    fetch: async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }),
    Live2DCubismCore: { Moc: { fromArrayBuffer: () => ({}) }, Model: { fromMoc: () => model } },
    ArrayBuffer, Uint8Array, Uint16Array, Int32Array, Float32Array, Math, Promise, setTimeout, clearTimeout, String,
  }
  vm.createContext(context)
  vm.runInContext(source, context, { filename: 'dsc-core-worker.js' })
  context.onmessage({ data: { type: 'init', url: 'memory://model.moc3' } })
  for (let i = 0; i < 50 && !messages.some((m) => m.type === 'ready'); i++) await new Promise((r) => setTimeout(r, 10))
  assert.ok(messages.some((m) => m.type === 'ready'), 'worker가 준비되어야 한다')
  const input = new Float32Array(P + partsCount)
  input[P] = 1
  input[P + earPart] = 0
  context.onmessage({ data: { type: 'frame', inp: input.buffer, out: null } })
  assert.ok(model.updates > 0)
  assert.equal(model.parts.opacities[earPart], 0, 'worker가 전달받은 귀 파트 opacity를 적용해야 한다')
  assert.equal(model.parts.opacities[0], 1, '다른 파트 opacity는 그대로')
})

test('좌우 버튼 코드: 첫 버튼 누른 채 150ms 이내 두 번째 버튼이면 grab, 떨어진 클릭/단일 버튼은 제외', () => {
  const slice = sliceBetween('const CHORD_GRACE_MS = 150;', 'document.addEventListener("pointerdown"')
  const { chordDown, chordWithinGrace, chordUp, CHORD_GRACE_MS } = runScript(slice, {}, '({ chordDown, chordWithinGrace, chordUp, CHORD_GRACE_MS })')
  assert.equal(CHORD_GRACE_MS, 150)
  const empty = { at: null, button: null, valid: false }

  // 좌 → 우: 첫 버튼을 누른 뒤 100ms/150ms(경계 포함)는 코드, 151ms는 코드 아님
  let c = chordDown(empty, 0, 1, 1000); c.valid = true
  assert.equal(chordWithinGrace(c, 2, 3, 1100), true)
  assert.equal(chordWithinGrace(c, 2, 3, 1150), true)
  assert.equal(chordWithinGrace(c, 2, 3, 1151), false)
  assert.equal(chordWithinGrace(c, 2, 3, 999), false, '첫 버튼보다 이른 시각은 코드가 아님')

  // 우 → 좌
  c = chordDown(empty, 2, 2, 5000); c.valid = true
  assert.equal(chordWithinGrace(c, 0, 3, 5100), true)
  assert.equal(chordWithinGrace(c, 0, 3, 5151), false)

  // 같은 버튼 반복(단일 버튼)은 코드가 아님
  assert.equal(chordWithinGrace(c, 2, 3, 5050), false)

  // 떨어진 두 클릭: 첫 버튼이 이미 떼어져 있으면(buttons 비트 없음) 코드 아님
  c = chordDown(empty, 0, 1, 0); c.valid = true
  assert.equal(chordWithinGrace(c, 2, 2, 100), false)

  // 캐릭터 밖에서 시작(valid=false)은 그레이스 대상 아님
  assert.equal(chordWithinGrace(chordDown(empty, 0, 1, 0), 2, 3, 50), false)

  // release/cancel: 모두 떼면 초기화, 한쪽이 남아 있으면 유지
  c = chordDown(empty, 0, 1, 0); c.valid = true
  assert.equal(chordUp(c, 0).valid, false)
  assert.equal(chordUp(c, 1).valid, true)
  // 두 번째 버튼을 눌러도 첫 버튼의 시각은 유지된다
  c = chordDown(empty, 0, 1, 100)
  assert.deepEqual(chordDown(c, 2, 3, 120), c)
})

test('코드 그레이스는 기존 양쪽 hold(임의 간격) 판정을 150ms로 제한하지 않는다', async () => {
  const source = await readFile(new URL('../../assets/dsc.js', import.meta.url), 'utf8')
  assert.match(source, /if \(\(e\.buttons & 1\) && chordWithinGrace\(chord, e\.button, e\.buttons, nowDown\)\)/)
  assert.match(source, /const both = \(e\.buttons & 3\) === 3 \|\| touchGrab \|\| dragKeyHeld\(e\)/)
  assert.match(source, /chord = chordUp\(chord, e\.buttons\)/)
  assert.match(source, /chord = chordUp\(chord, 0\)/)   // blur/cancel 정리
  assert.match(source, /chord\.valid = true;   \/\/ 캐릭터 위에서 시작한 누름만/)
})

function runChipContext() {
  const context = {
    PET: false,
    mobileHiddenNow: false,
    placeCalls: 0,
    removed: 0,
    hiddenNow: false,
    document: {
      createElement() {
        return {
          id: '', textContent: '', type: '', listeners: [],
          addEventListener(type, fn) { this.listeners.push(fn) },
          remove() { context.removed++; this.removed = true },
        }
      },
      body: { append() {} },
      documentElement: { classList: { remove() {} } },
    },
    app: {
      ticker: {
        started: true, starts: 0, stops: 0,
        start() { this.started = true; this.starts++ },
        stop() { this.started = false; this.stops++ },
      },
    },
    SLEEP: { state: 'active', lastActive: 0 },
    drag: { pending: null, on: false },
    link: { open: false, follow: null, opening: 0 },
    hush() {},
    linkPost() {},
    requestAnimationFrame() {},
    setTimeout() { return 0 },
    clearTimeout() {},
    performance: { now: () => 0 },
    canvas: { style: {} },
    bubble: { style: {} },
    veil: { style: {} },
    out: {},
  }
  const preamble = [
    'let hidden = false;',
    'let sleepTimer = 0, cancelSleepSlide = null, fleeX = 0, strokeFrom = null, chestFrom = null, lastPlaceKey = "";',
    'const mobileHidden = () => mobileHiddenNow;',
    'const place = () => { placeCalls++ };',
  ].join('\n')
  const script = [
    preamble,
    sliceBetween('const hideChipVisible =', 'let placeErrorWarned'),
    sliceBetween('const setRender =', 'const place = () =>'),
    sliceBetween('let hideChip = null;', '      if (!PET) {'),
  ].join('\n')
  const api = runScript(script, context, `({
    setHidden, showHideChip, clearHideChip, syncHideChip, hideChipVisible, setRender,
    hidden: () => hidden,
    chip: () => hideChip,
    placeCalls: () => placeCalls,
    ticker: app.ticker,
    removed: () => removed,
    canvas: canvas.style, bubble: bubble.style, veil: veil.style,
  })`)
  // fragment 안에서 쓴 전역 헬퍼 접근용 (setMobileHidden 은 숨김 설정 토글)
  api.setMobileHidden = (on) => { context.mobileHiddenNow = on }
  return api
}
