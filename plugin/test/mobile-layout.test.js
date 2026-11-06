import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { Config, readLive } from '../host.js'

const root = new URL('../../', import.meta.url)
const source = await readFile(new URL('assets/dsc.js', root), 'utf8')

// 배치 계산은 캔버스·DOM과 분리된 순수 함수라, 소스에서 그 구간만 떼어 내 검증한다.
const slice = source.slice(source.indexOf('const HOME_GAP = 8'), source.indexOf('      let curK = 1, fleeX = 0;'))
const { homeLayout, bubbleLayout, SHOW_K } = vm.runInContext(slice + '\n({ homeLayout, bubbleLayout, SHOW_K })', vm.createContext({}))

const dims = { W: 300, visW: 300, H: 300, visH: 285 }

test('모바일 설정은 기본 표시(ON)이고 host Config에 있다', () => {
  assert.equal(readLive(Config({}).mobileCharacter), true)
  assert.equal(readLive(Config({ mobileCharacter: false }).mobileCharacter), false)
})

test('좁은 화면에서 컴포저가 폭을 다 쓰면 캐릭터를 컴포저 위로 올린다', () => {
  const vp = { w: 390, h: 844, top: 0, left: 0 }
  const r = { left: 0, right: 390, top: 560, bottom: 844 }
  const pose = homeLayout({ vp, r, maxK: 2, minK: 0.42, ...dims })
  assert.equal(pose.above, true)
  assert.ok(pose.y + 300 * pose.k <= r.top - 8, '캐릭터 하단이 컴포저 위에 있어야 함')
  assert.ok(pose.k >= 0.18)
})

test('모바일(컴포저 위)은 자동 맞춤 크기의 30%로 줄인다', () => {
  const vp = { w: 390, h: 844, top: 0, left: 0 }
  const r = { left: 0, right: 390, top: 560, bottom: 844 }
  const pose = homeLayout({ vp, r, maxK: 2, minK: 0.42, ...dims })
  const aboveRoom = (r.top - vp.top) - 8 - 78
  const aboveK = Math.min(2, aboveRoom / 300, (vp.w - 8) / dims.visW)
  assert.equal(pose.above, true)
  assert.ok(Math.abs(pose.k - aboveK * 0.3) < 0.01, '컴포저 위 크기는 자동 맞춤의 30%')
  assert.ok(pose.y >= vp.top)
  assert.equal(pose.y + 300 * pose.k, r.top - 8)
})

test('데스크톱 좁은 창은 컴포저 위로 올리지 않고 예전처럼 오른쪽 아래 구석을 유지한다', () => {
  const vp = { w: 420, h: 700, top: 0, left: 0 }
  const r = { left: 0, right: 420, top: 600, bottom: 700 }
  const pose = homeLayout({ vp, r, maxK: 2, minK: 0.42, allowAbove: false, ...dims })
  assert.equal(pose.above, false)
  assert.ok(pose.k < 0.42)   // dockTarget 이 데스크톱에서 SHOW_K 로 끌어올린다 (업스트림과 같은 구석 배치)
})

test('데스크톱처럼 컴포저 옆 여유가 있으면 기존처럼 오른쪽 아래에 둔다', () => {
  const vp = { w: 1280, h: 800, top: 0, left: 0 }
  const r = { left: 400, right: 880, top: 720, bottom: 800 }
  const pose = homeLayout({ vp, r, maxK: 2, minK: 0.42, ...dims })
  assert.equal(pose.above, false)
  assert.ok(pose.k >= 0.42)
  assert.ok(pose.y + 300 * pose.k <= vp.h + 0.5)
})

test('위쪽 공간도 없으면 최소 표시 크기로 오른쪽 아래에 둔다', () => {
  const vp = { w: 320, h: 480, top: 0, left: 0 }
  const r = { left: 0, right: 320, top: 30, bottom: 480 }
  const pose = homeLayout({ vp, r, maxK: 1, minK: 0.42, ...dims })
  assert.equal(pose.above, false)
  assert.equal(pose.k, 0.18)
  assert.equal(pose.noSafe, true)
})

test('말풍선은 뷰포트 안으로 잘리고, 머리 위가 기본이다', () => {
  const vp = { w: 390, h: 844, top: 0, left: 0 }
  const r = { left: 0, right: 390, top: 560, bottom: 844 }
  const bl = bubbleLayout({ vp, headX: 350, headTop: 260, bw: 200, bh: 40, r, above: true })
  assert.equal(bl.side, false)
  assert.equal(bl.left, 182)   // 오른쪽 끝 390-200-8
  assert.equal(bl.top, 210)
  const high = bubbleLayout({ vp, headX: 350, headTop: 30, bw: 200, bh: 40, r, above: true })
  assert.equal(high.top, 8)    // 위로 넘치지 않게 clamp
})

test('카드와 겹치고 아래 공간이 있으면 옆으로 피한다', () => {
  const vp = { w: 1280, h: 800, top: 0, left: 0 }
  const r = { left: 600, right: 900, top: 50, bottom: 200 }
  const bl = bubbleLayout({ vp, headX: 800, headTop: 200, bw: 200, bh: 60, r, above: false })
  assert.equal(bl.side, true)
  assert.equal(bl.left, 1072)
  assert.equal(bl.top, 208)
})

test('모바일처럼 카드 아래 공간이 없으면 side 대신 머리 위로 폴백하고 뷰포트 안에 둔다', () => {
  const vp = { w: 390, h: 844, top: 0, left: 0 }
  const r = { left: 0, right: 390, top: 500, bottom: 844 }
  const bl = bubbleLayout({ vp, headX: 350, headTop: 520, bw: 200, bh: 60, r, above: false })
  assert.equal(bl.side, false)
  assert.ok(bl.top + 60 <= 844 - 8)
})

test('터치 드래그와 모바일 숨김 코드가 들어 있다', () => {
  assert.match(source, /const mobileHidden = /)
  assert.match(source, /const touchGrab = /)
  assert.match(source, /drag\.pending\.touchGrab = true/)
  assert.match(source, /e\.pointerType === "touch" && drag\.pending/)   // 가로 끌기 즉시 집기는 터치에서만
  assert.match(source, /const keyboardOpen = /)   // 키보드 열림을 visualViewport 로도 감지
})

test('데스크톱은 세로 모니터와 작은 창에서도 오른쪽 아래 구석을 유지한다', () => {
  const cases = [
    { w: 1080, h: 1920, r: { left: 400, right: 880, top: 1840, bottom: 1920 } },
    { w: 1200, h: 1920, r: { left: 420, right: 900, top: 1840, bottom: 1920 } },
    { w: 500, h: 400, r: { left: 60, right: 440, top: 340, bottom: 400 } },
    { w: 700, h: 500, r: { left: 200, right: 500, top: 440, bottom: 500 } },
    { w: 320, h: 480, r: { left: 0, right: 320, top: 30, bottom: 480 } },
  ]
  for (const { w, h, r } of cases) {
    const pose = homeLayout({ vp: { w, h, top: 0, left: 0 }, r, maxK: 2.58, W: 300, visW: 300, H: 300, visH: 285, minK: SHOW_K, allowAbove: false })
    assert.equal(pose.above, false)
    assert.ok(Math.abs(pose.y + 300 * pose.k - h) < 0.01, `${w}x${h}: 아래 끝이 창 아래에 붙어야 함`)
    assert.ok(Math.abs(pose.x + 300 * pose.k - (w - 4)) < 0.01, `${w}x${h}: 오른쪽 끝이 창 오른쪽에 붙어야 함`)
  }
})

test('자유 위치는 입력 모드별 키로 분리되어 서로 덮어쓰지 않는다', () => {
  const local = new Map()
  const localStorage = {
    getItem: (key) => local.has(key) ? local.get(key) : null,
    setItem: (key, value) => local.set(key, String(value)),
    removeItem: (key) => local.delete(key),
  }
  const block = source.slice(source.indexOf('// 자유 위치는 입력 모드별로'), source.indexOf('// 산책:'))
  assert.ok(block.includes('dsc-free-pos-mobile'))
  const load = (mobile) => {
    const ctx = vm.createContext({
      PET: false, innerWidth: 390, innerHeight: 844, W: 300, H: 300, SHOW_K, localStorage,
      coarsePointer: () => mobile,
    })
    return vm.runInContext(`const free = { on: false, x: 0, y: 0, k: 1, anim: null, mode: null };\n${block}\n({ free, saveFree, freeStorageKey })`, ctx)
  }

  // 예전 단일 키에 남아 있는 데스크톱 자리는 그대로 복원한다 (자동 삭제하지 않는다).
  local.set('dsc-free-pos', JSON.stringify({ fx: 0.5, fy: 0.9, k: 0.3 }))
  let desktop = load(false)
  assert.equal(desktop.free.on, true)
  assert.equal(desktop.free.mode, 'desktop')
  assert.equal(local.has('dsc-free-pos'), true)

  // 모바일에서 터치로 저장한 자리는 모바일 키에만 쓰고, 데스크톱 키는 건드리지 않는다.
  local.clear()
  const mobile = load(true)
  mobile.free.on = true
  mobile.free.x = 100; mobile.free.y = 500; mobile.free.k = 0.3; mobile.free.mode = 'mobile'
  mobile.saveFree()
  assert.equal(local.has('dsc-free-pos-mobile'), true)
  assert.equal(local.has('dsc-free-pos'), false)
  assert.equal(JSON.parse(local.get('dsc-free-pos-mobile')).mode, 'mobile')

  // 같은 저장소로 데스크톱을 다시 열어도 모바일 키는 읽지 않는다.
  desktop = load(false)
  assert.equal(desktop.free.on, false)

  // 데스크톱에서 저장한 자유 위치는 다음 저장 때 모드 표시를 붙인다.
  local.clear()
  local.set('dsc-free-pos', JSON.stringify({ fx: 0.7, fy: 0.95, k: 0.8 }))
  desktop = load(false)
  assert.equal(desktop.free.on, true)
  assert.equal(desktop.free.mode, 'desktop')
  desktop.saveFree(false)
  assert.equal(JSON.parse(local.get('dsc-free-pos')).mode, 'desktop')

  // 반대로 데스크톱 키가 모바일 로드에 쓰이지 않는다.
  local.clear()
  local.set('dsc-free-pos', JSON.stringify({ mode: 'desktop', fx: 0.7, fy: 0.95, k: 0.8 }))
  assert.equal(load(true).free.on, false)
})

test('모드가 다른 자유 위치는 현재 화면에 적용하지 않는다', () => {
  assert.match(source, /free\.mode && free\.mode !== currentMode/)
  assert.match(source, /free\.mode = freeMode\(\)/)
})

test('데스크톱 말풍선은 예전 right 배치를 유지하고, 아래 공간이 없으면 캐릭터 기준을 유지한 채 위로 clamp한다', () => {
  assert.match(source, /if \(!coarsePointer\(\) && !home\.above\)/)
  assert.match(source, /bubble\.style\.right = loose/)
  assert.match(source, /sideTop \+ bubble\.offsetHeight <= innerHeight - HOME_GAP/)
  assert.match(source, /bubble\.style\.top = Math\.max\(8, Math\.min\(innerHeight - bubble\.offsetHeight - HOME_GAP/)
})

test('카드 아래 공간이 없을 때 말풍선은 뷰포트 안에 남는다', () => {
  const vp = { w: 960, h: 1080, top: 0, left: 0 }
  const r = { left: 0, right: 960, top: 1000, bottom: 1080 }
  const pos = bubbleLayout({ vp, headX: 940, headTop: 900, bw: 150, bh: 40, r, above: false })
  assert.ok(pos.top >= vp.top + 8)
  assert.ok(pos.top + 40 <= vp.top + vp.h - 8)
})

test('텍스트 입력이 아닌 range·체크박스는 키보드 숨김 대상이 아니다', () => {
  const fnSource = source.slice(source.indexOf('const activeTextInput'), source.indexOf('const keyboardOpen'))
  const run = (el, pet = false) => {
    const ctx = vm.createContext({
      document: { activeElement: el },
      PET: pet,
      petPanelOpen: pet,
      petPanel: pet ? { contains: () => true } : null,
    })
    return vm.runInContext(fnSource + '\nactiveTextInput()', ctx)
  }
  const input = (type) => ({ tagName: 'INPUT', type, isContentEditable: false, shadowRoot: null })
  assert.equal(run(input('text')), true)
  assert.equal(run(input('search')), true)
  assert.equal(run(input('range')), false)
  assert.equal(run(input('checkbox')), false)
  assert.equal(run({ tagName: 'TEXTAREA', isContentEditable: false, shadowRoot: null }), true)
  assert.equal(run({ tagName: 'DIV', isContentEditable: true, shadowRoot: null }), true)
  assert.equal(run(input('range'), true), false, '펫 설정 패널 조작은 텍스트 입력이 아니다')
})

test('캐릭터 바깥에서 시작한 터치 스크롤을 캐릭터 위에서 막지 않는다', () => {
  const touchMove = source.slice(source.indexOf('document.addEventListener("touchmove"'), source.indexOf('document.addEventListener("wheel"'))
  assert.match(touchMove, /drag\.on \|\| drag\.pending/)
  assert.doesNotMatch(touchMove, /hitAt/)
})

test('모바일 숨김 상태에서는 시작 인트로를 끝내 다시 켜도 재생하지 않는다', () => {
  const hidden = source.slice(source.indexOf('if (mobileHidden())'), source.indexOf('if (typingActive())'))
  assert.match(hidden, /skipIntro\(\)/)
})

test('입력 모드가 바뀌어도 세션의 자유 위치 상태를 지우지 않는다', () => {
  const guard = source.slice(source.indexOf('const currentMode = freeMode()'), source.indexOf('if (!free.on) return dockTarget(home);'))
  assert.match(guard, /free\.mode !== currentMode/)
  assert.doesNotMatch(guard, /free\.on = false/)
})

test('모바일 자유 위치는 카드가 잠깐 없을 때 저장된 크기로 안정된다', () => {
  assert.match(source, /coarsePointer\(\) && home\.r \? home\.k : free\.k/)
  assert.match(source, /!PET && coarsePointer\(\)\) return;.*모바일에서는 캐릭터 위 휠/)
})

test('피할 자리가 없는 제자리는 SHOW_K로 끌어올리지 않는다', () => {
  assert.match(source, /home\.k >= SHOW_K \|\| home\.above \|\| home\.noSafe/)
})
