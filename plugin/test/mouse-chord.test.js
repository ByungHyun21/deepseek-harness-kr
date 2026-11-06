import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

// Pointer Events는 첫 버튼에만 pointerdown을 주므로, 두 번째 버튼은 mousedown으로 들어온다.
// 이 테스트는 dsc.js에서 실제 등록된 mousedown/mouseup handler 코드와 chord helper를 그대로 잘라
// 이벤트 시퀀스를 주입해 pending 생성/차단을 검증한다. (pointermove grab 자체는 소스 배선으로 확인)
const source = await readFile(new URL('../../assets/dsc.js', import.meta.url), 'utf8')
const chordBlock = source.slice(source.indexOf('const CHORD_GRACE_MS = 150;'), source.indexOf('document.addEventListener("pointerdown"'))
const mouseStart = source.indexOf('// 마우스 좌우 버튼 코드 보완')
const mouseEnd = source.indexOf('\n', source.indexOf('document.addEventListener("mouseup"', mouseStart))
const mouseBlock = source.slice(mouseStart, mouseEnd)

function harness() {
  const listeners = new Map()
  const context = {
    hidden: false, PET: false, petPanelOpen: false, petPanel: null,
    rightPress: null, chord: { at: null, button: null, valid: false },
    drag: { pending: null, on: false, x: 0, y: 0, samples: [] },
    shown: { k: 1, x: 0, y: 0 },
    strokeFrom: null, chestFrom: null, chestDragging: false, chestTarget: 0, chestShiftTarget: 0, chestLongTimer: 0,
    swallowClick: false,
    clock: 1000, hit: true, prevented: 0, stopped: 0,
    walking: () => false, intro: { phase: 'done' }, fleeX: 0, link: { opening: 0 },
    performance: { now: () => context.clock },
    hitAt: () => (context.hit ? [1, 2, 3] : null),
    overBody: () => false,
    pt: (event) => [event.clientX, event.clientY],
    clearInterval: () => {},
    document: {
      addEventListener(type, fn, options) { listeners.set(type, { fn, options }) },
    },
  }
  const script = `let rightPress = null, mouseButtons = 0;\n${chordBlock}\n${mouseBlock}\n({
    state: () => ({ rightPress, mouseButtons, chord, drag, strokeFrom, chestFrom, chestDragging, swallowClick }),
    seed: (value) => { rightPress = value.rightPress ?? rightPress; mouseButtons = value.mouseButtons ?? mouseButtons; chord = value.chord ?? chord; drag.pending = value.pending ?? drag.pending; strokeFrom = value.strokeFrom ?? strokeFrom },
    moved: (event, now) => chordButtonsMoved(event, now),
    start: (event) => rightStart(event),
  })`
  context.listeners = listeners
  const api = vm.runInContext(script, vm.createContext(context))
  const event = (type, button, buttons, pointerId = 1) => ({
    type, button, buttons, clientX: 150, clientY: 150, pointerId, target: null,
    preventDefault() { context.prevented++ }, stopPropagation() { context.stopped++ },
  })
  return { context, listeners, api, event }
}

test('실제 mousedown handler: 우→좌 시퀀스가 pending을 만들고 캡처로 UI 클릭을 막는다', () => {
  const h = harness()
  const down = h.listeners.get('mousedown')
  assert.ok(down, 'mousedown handler must be registered')
  assert.ok(down.options === true || down.options?.capture === true, 'chord capture must beat UI handlers')
  down.fn(h.event('mousedown', 2, 2))   // 첫 오른쪽: pending 없음
  assert.equal(h.api.state().drag.pending, null)
  assert.ok(h.api.state().rightPress)
  down.fn(h.event('mousedown', 0, 3))   // 왼쪽 합류
  const state = h.api.state()
  assert.ok(state.drag.pending, '우→좌에서 pending이 생겨야 pointermove의 both 판정으로 grab 가능')
  assert.equal(state.drag.pending.id, 1, 'mousedown fallback도 실제 pointerId를 쓴다')
  assert.equal(state.drag.pending.h, null)
  assert.equal(state.chord.valid, true)
  assert.equal(h.context.prevented, 1, '코드 성립 시에만 기본 동작을 막는다')
})

test('실제 mousedown handler: 우클릭 단독/빈 곳 시작/떨어진 클릭은 pending을 만들지 않는다', () => {
  const h = harness()
  const down = h.listeners.get('mousedown')
  down.fn(h.event('mousedown', 2, 2))
  h.listeners.get('mouseup').fn(h.event('mouseup', 2, 0))   // 오른쪽 먼저 뗌
  down.fn(h.event('mousedown', 0, 1))                       // 이후 왼쪽 단독
  assert.equal(h.api.state().drag.pending, null)
  assert.equal(h.context.prevented, 0, '단독 우클릭은 메뉴를 막지 않는다')

  const empty = harness()
  empty.context.hit = false
  empty.listeners.get('mousedown').fn(empty.event('mousedown', 2, 2))
  empty.listeners.get('mousedown').fn(empty.event('mousedown', 0, 3))
  assert.equal(empty.api.state().drag.pending, null, '캐릭터 밖에서 시작한 코드는 grab 아님')
})

test('실제 mousedown handler: 좌→우 150ms grace가 pointerdown 없이도 예약을 되살린다', () => {
  const h = harness()
  h.api.seed({ pending: { id: 7, sx: 150, sy: 150, h: null, ox: 0, oy: 0 }, chord: { at: 900, button: 0, valid: true }, strokeFrom: { x: 1, y: 2, t: 900, h: [1, 2, 3] } })
  h.context.clock = 1000
  h.listeners.get('mousedown').fn(h.event('mousedown', 2, 3))   // 왼쪽을 누른 채 오른쪽 합류
  const state = h.api.state()
  assert.ok(state.drag.pending)
  assert.equal(state.drag.pending.id, 7, '이미 있던 pending의 pointerId를 유지한다')
  assert.equal(state.strokeFrom, null, '쓰다듬기 예약을 버리고 grab으로 넘긴다')
  assert.equal(h.context.prevented, 1)
  // 150ms를 넘긴 합류는 grace 대상이 아니지만, pending이 남아 있으면 기존 both 동작으로 grab된다.
  const late = harness()
  late.api.seed({ pending: { id: 1, sx: 150, sy: 150, h: null, ox: 0, oy: 0 }, chord: { at: 0, button: 0, valid: true } })
  late.context.clock = 1000
  late.listeners.get('mousedown').fn(late.event('mousedown', 2, 3))
  assert.ok(late.api.state().drag.pending)
  assert.equal(late.api.state().chord.valid, true)
})

test('실제 pointermove transition: 우→좌 두 번째 버튼 합류를 pointerdown 없이 pending으로 만든다', () => {
  const h = harness()
  h.api.seed({ rightPress: { at: 900, hit: true, id: 7 }, mouseButtons: 2 })
  const engaged = h.api.moved(h.event('pointermove', -1, 3), 1000)
  assert.equal(engaged, true)
  const state = h.api.state()
  assert.ok(state.drag.pending)
  assert.equal(state.drag.pending.id, 7, '첫 오른쪽 pointerdown의 pointerId를 그대로 쓴다')
  assert.equal(state.chord.valid, true)
  assert.equal(h.context.prevented, 1)
})

test('실제 pointermove transition: 좌→우 150ms grace와 중복 이벤트 방지', () => {
  const h = harness()
  h.api.seed({ mouseButtons: 1, pending: { id: 9, sx: 150, sy: 150, h: null, ox: 0, oy: 0 }, chord: { at: 900, button: 0, valid: true }, strokeFrom: { x: 1, y: 2, t: 900, h: [1, 2, 3] } })
  assert.equal(h.api.moved(h.event('pointermove', -1, 3), 1000), true)
  const state = h.api.state()
  assert.equal(state.drag.pending.id, 9)
  assert.equal(state.strokeFrom, null)
  assert.equal(h.api.moved(h.event('pointermove', -1, 3), 1001), false, '이미 3이면 중복 처리하지 않는다')
  // 150ms를 넘긴 합류는 grace 대상이 아니지만, pending이 남아 있으면 기존 both로 grab된다.
  const late = harness()
  late.api.seed({ mouseButtons: 1, pending: { id: 9, sx: 150, sy: 150, h: null, ox: 0, oy: 0 }, chord: { at: 0, button: 0, valid: true } })
  assert.equal(late.api.moved(late.event('pointermove', -1, 3), 1000), false)
  assert.ok(late.api.state().drag.pending)
})

test('실제 pointermove transition: right start 가드/빈 곳은 pending을 만들지 않는다', () => {
  const bad = harness()
  bad.api.seed({ rightPress: { at: 900, hit: false, id: 7 }, mouseButtons: 2 })
  assert.equal(bad.api.moved(bad.event('pointermove', -1, 3), 1000), false)
  assert.equal(bad.api.state().drag.pending, null)

  const empty = harness()
  empty.context.hit = false
  assert.equal(empty.api.start(empty.event('pointerdown', 2, 2)), null)
  empty.context.walking = () => true
  empty.context.hit = true
  assert.equal(empty.api.start(empty.event('pointerdown', 2, 2)), null, 'walking 중에는 코드 시작 불가')
  empty.context.walking = () => false
  empty.context.intro = { phase: 'center' }
  assert.equal(empty.api.start(empty.event('pointerdown', 2, 2)), null, '시작 연출 중에는 코드 시작 불가')
})

test('rightStart id 보존: mousedown은 pointerdown의 id를 유지하고, id 없는 fallback은 no-op 후 pointermove가 처리한다', () => {
  const h = harness()
  h.api.seed({ rightPress: { at: 900, hit: true, id: 7 } })
  // MouseEvent에는 pointerId가 없다. 기존 rightPress의 id를 보존해야 한다.
  const kept = h.api.start(h.event('mousedown', 2, 2, null))
  assert.ok(kept)
  assert.equal(kept.id, 7)

  h.listeners.get('mousedown').fn(h.event('mousedown', 2, 2, null))
  assert.equal(h.api.state().rightPress.id, 7, 'mousedown이 pointerdown id를 덮어쓰지 않는다')

  // id를 알 수 없는 합성 mouse fallback은 pending을 만들지 않고, pointermove가 실제 pointerId로 만든다.
  const synthetic = harness()
  synthetic.api.seed({ rightPress: { at: 900, hit: true, id: undefined }, mouseButtons: 2 })
  synthetic.listeners.get('mousedown').fn(synthetic.event('mousedown', 0, 3, null))
  assert.equal(synthetic.api.state().drag.pending, null, 'id 없는 fallback은 safe no-op')
  assert.equal(synthetic.api.moved(synthetic.event('pointermove', -1, 3, 7), 1000), true)
  assert.equal(synthetic.api.state().drag.pending.id, 7)
})

test('pointermove grab 배선: pending이 있고 두 버튼이 함께 눌리면 both로 grab한다', () => {
  assert.match(source, /const both = \(e\.buttons & 3\) === 3 \|\| touchGrab \|\| dragKeyHeld\(e\)/)
  assert.match(source, /const p = drag\.pending;\s*\n\s*if \(!p \|\| e\.pointerId !== p\.id\) return;/)
  assert.match(source, /if \(!both\) \{ if \(drag\.on\) endDrag\(e, false\); return; \}/)
  assert.match(source, /if \(!drag\.on\) \{[\s\S]*?drag\.on = true;/)
})
