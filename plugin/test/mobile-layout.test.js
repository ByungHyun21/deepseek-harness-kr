import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { Config, readLive } from '../host.js'

const root = new URL('../../', import.meta.url)
const source = await readFile(new URL('assets/dsc.js', root), 'utf8')

// 배치 계산은 캔버스·DOM과 분리된 순수 함수라, 소스에서 그 구간만 떼어 내 검증한다.
const slice = source.slice(source.indexOf('const HOME_GAP = 8'), source.indexOf('      let curK = 1, fleeX = 0;'))
const { homeLayout, bubbleLayout } = vm.runInContext(slice + '\n({ homeLayout, bubbleLayout })', vm.createContext({}))

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
  assert.equal(pose.k, 0.18)   // dockTarget 이 데스크톱에서 SHOW_K 로 끌어올린다 (업스트림과 같은 구석 배치)
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
