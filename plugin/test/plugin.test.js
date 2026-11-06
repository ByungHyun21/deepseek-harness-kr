import { createRequire } from 'node:module'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
const require = createRequire(import.meta.url)
import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import { apply as hostApply, createAssetHandler, ASSET_PATH, Config, readLive } from '../host.js'
import { PET_PATH } from '../pet-host.js'

const packageName = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8')).name
const bundle = await readFile(new URL('../../lib/client.js', import.meta.url), 'utf8')

test('source build preserves sleep code and matches the committed bundle', async () => {
  execFileSync(process.execPath, ['plugin/build.mjs'], { cwd: fileURLToPath(new URL('../../', import.meta.url)) })
  assert.equal(await readFile(new URL('../../lib/client.js', import.meta.url), 'utf8'), bundle)
  assert.match(bundle, /sleep_out:/)
  assert.match(bundle, /sleep_back:/)
  assert.match(bundle, /'절전' : 'Power saving'/)
  assert.match(bundle, /sharedTicker: false/)
  assert.match(bundle, /autoUpdate: false/)
  assert.match(bundle, /model.update\(Math.min\(app.ticker.deltaMS, 100\)\)/)
})

test('sleep cancels departures, protects intro and wakes for waiting cards', async () => {
  const source = await readFile(new URL('../../assets/dsc.js', import.meta.url), 'utf8')
  for (const code of [source, bundle]) {
    let now = 100000, timerId = 0, poll, stopped = false, card = null, working = false
    const timers = new Map(), frames = [], events = new Map(), lines = []
    const context = vm.createContext({
      performance: { now: () => now }, innerWidth: 1000,
      setTimeout: (fn) => { timers.set(++timerId, fn); return timerId },
      clearTimeout: (id) => timers.delete(id),
      requestAnimationFrame: (fn) => frames.push(fn), setInterval: (fn) => { poll = fn },
      addEventListener: (type, fn, options) => { assert.equal(options.capture, true); events.set(type, fn) },
      canvas: { style: {}, getBoundingClientRect: () => ({ left: 700 }) },
      bubble: { style: {}, classList: { contains: () => false } },
      app: { ticker: { start: () => { stopped = false }, stop: () => { stopped = true } } },
      document: { hidden: false, querySelector: (selector) => selector === 'stop' ? working : selector.includes(card) && card },
      window: { __dscSleep: { enabled: true, minutes: 0.5 } },
      PET: false, drag: {}, free: {}, link: {},
      UI: { stop: 'stop', approval: 'approval' }, intro: { phase: 'center' }, walk: { phase: '', slideId: 0, timers: [] },
      speak: (line) => lines.push(line), say: (line) => lines.push(line), hush() {}, place() {},
      setExp() {}, setMood() {}, play() {}, mutterCheck() {}, flashExp() {},
      TEXT: { approval: 'approval', question: 'question' },
    })
    vm.runInContext('let fleeX = 0, running = false, waitingKind = null, lastSayAt = 0, lastError = 0;', context)
    vm.runInContext(code.slice(code.indexOf('      const WALK_SPEED'), code.indexOf('      const walkBack')), context)
    vm.runInContext(code.slice(code.indexOf('      const SLEEP ='), code.indexOf('      const onLower')), context)
    const pollStart = code.lastIndexOf('      setInterval(() => {')
    vm.runInContext(code.slice(pollStart, code.indexOf('      }, 400);', pollStart) + '      }, 400);'.length), context)
    const read = (s) => vm.runInContext(s, context)
    const frame = () => { now += 500; frames.splice(0).forEach((fn) => fn()) }
    const depart = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach((fn) => fn()) }
    read('sleepGo()'); assert.equal(read('SLEEP.state'), 'active')
    read('intro.phase = "done"; sleepGo()'); assert.equal(timers.size, 1)
    events.get('pointerdown')(); assert.equal(timers.size, 0)
    frame(); assert.equal(read('SLEEP.state'), 'active'); assert.equal(read('fleeX'), 0)
    read('sleepGo()'); depart(); frame()
    const halfway = read('fleeX'); assert(halfway > 0)
    events.get('pointermove')(); assert.equal(read('fleeX'), halfway)
    frame(); frame(); assert.equal(read('fleeX'), 0); assert.equal(read('SLEEP.state'), 'active')
    for (const trigger of ['work', 'disable', 'approval', 'data-question-reply']) {
      read('sleepGo()')
      if (trigger === 'work') working = true
      else if (trigger === 'disable') context.window.__dscSleep.enabled = false
      else card = trigger
      poll(); assert.equal(read('SLEEP.state'), 'waking')
      assert.equal(timers.size, 0)
      frame(); working = false; card = null; context.window.__dscSleep.enabled = true; poll()
      timers.clear()
    }
    for (const waiting of ['approval', 'data-question-reply']) {
      read('sleepGo()'); depart(); frame(); frame(); frame(); frame()
      assert.equal(read('SLEEP.state'), 'asleep'); assert.equal(stopped, true)
      card = waiting; poll()
      assert.equal(read('SLEEP.state'), 'waking'); assert.equal(stopped, false)
      const expected = waiting === 'approval' ? 'approval' : 'question'
      assert.equal(read('waitingKind'), expected); assert.equal(lines.at(-1), expected)
      frame(); frame(); frame(); frame()
      assert.equal(lines.at(-1), expected)
      card = null; poll()
    }
  }
})

test('sleep preserves free placement, blocks dragging and never sleeps while the pet is outside', async () => {
  const code = await readFile(new URL('../../assets/dsc.js', import.meta.url), 'utf8')
  for (const petPage of [false, true]) {
    let now = 0, stopped = false, listeners = 0
    const frames = [], timers = [], lines = []
    const context = vm.createContext({
      PET: petPage, innerWidth: 1000, innerHeight: 800, W: 200, H: 400, SHOW_K: 0.1, visH: 400, MIN_SHOW_K: 0.18, coarsePointer: () => false, freeMode: () => 'desktop',
      performance: { now: () => now }, requestAnimationFrame: (fn) => frames.push(fn),
      setTimeout: (fn) => { timers.push(fn); return timers.length }, clearTimeout() {},
      addEventListener() { listeners++ },
      drag: {}, free: { on: true, k: 0.8, fx: 0.3, fy: 0.6, applied: true }, link: {},
      walk: { phase: '', timers: [], slideId: 0 }, intro: { phase: 'done' },
      canvas: { style: {}, getBoundingClientRect: () => ({ left: 220 }) }, bubble: { style: {} },
      app: { ticker: { start() { stopped = false }, stop() { stopped = true } } },
      keepIn: (q) => q, speak: (line) => lines.push(line), hush() {}, place() {},
    })
    const run = (s) => vm.runInContext(s, context)
    run('let fleeX = 0, running = false, waitingKind = null, snapP = 0;')
    run(code.slice(code.indexOf('      const WALK_SPEED'), code.indexOf('      const walkBack')))
    run(code.slice(code.indexOf('      const SLEEP ='), code.indexOf('      const onLower')))
    run(code.slice(code.indexOf('      const dockPose ='), code.indexOf('      const GLIDE =')))
    assert.equal(listeners, petPage ? 0 : 6)
    if (petPage) { run('sleepGo()'); assert.equal(run('SLEEP.state'), 'active'); assert.equal(stopped, false); continue }
    for (const guard of ['drag.on', 'drag.pending', 'free.anim']) {
      run(guard + ' = true; sleepGo()'); assert.equal(run('SLEEP.state'), 'active'); run(guard + ' = false')
    }
    const before = JSON.stringify(context.free), home = run('JSON.stringify(dockPose({}, 0))')
    run('sleepGo()'); timers.splice(0).forEach((fn) => fn())
    now += 5000; frames.splice(0).forEach((fn) => fn())
    assert.equal(run('SLEEP.state'), 'asleep'); assert.equal(stopped, true)
    assert.ok(run('dockPose({}, 0).x') > 1000)
    run('sleepActivity()'); now += 5000; frames.splice(0).forEach((fn) => fn())
    assert.equal(run('SLEEP.state'), 'active'); assert.equal(stopped, false)
    assert.equal(run('JSON.stringify(dockPose({}, 0))'), home); assert.equal(JSON.stringify(context.free), before)
    const count = lines.length
    run('link.open = true; sleepGo()'); assert.equal(stopped, false); assert.equal(run('SLEEP.state'), 'active')   // 펫 창으로 꺼내 둔 동안엔 절전 안 함
    assert.equal(lines.length, count); assert.equal(timers.length, 0)
  }
})

test('disabling the character during dragging clears grabbing state', () => {
  const h = clientHarness()
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    h.dom.window.document.documentElement.classList.add('dsc-grabbing', 'dsc-hover')
    h.form.update({ character: false })
    assert.equal(h.dom.window.document.documentElement.classList.contains('dsc-grabbing'), false)
    assert.equal(h.dom.window.document.documentElement.classList.contains('dsc-hover'), false)
    ctx.dispose()
  } finally { h.dom.window.close() }
})

function clientHarness(initial = {}, status = 'ready') {
  const dom = new JSDOM('<!doctype html><html><head></head><body data-ds-dark-theme></body></html>', { url: 'http://127.0.0.1/', runScripts: 'outside-only', pretendToBeVisual: true })
  let client, resolveModel, appDestroyed = 0, appCreated = 0
  const pending = new Promise((resolve) => { resolveModel = resolve })
  dom.window.Live2DCubismCore = {}
  dom.window.PIXI = {
    Application: class { constructor() { appCreated++ } destroy() { appDestroyed++ } },
    live2d: { Live2DModel: { from: () => pending } },
  }
  dom.window.__ModuleLoader__ = { load({ id, factory }) { assert.equal(id, packageName, 'browser module ID must match its package name'); client = factory(require) } }
  dom.window.eval(bundle)
  const languages = new Map([['en', {}], ['zh', {}]])
  const dictionaries = new Map()
  let selected = 'en'
  const subscriptions = new Set(), pages = new Map()
  let snapshot = { status, value: initial, writable: true, revision: 0 }
  const mutations = []
  const form = {
    getSnapshot: () => snapshot,
    subscribe(fn) { subscriptions.add(fn); return () => subscriptions.delete(fn) },
    update(value, status = 'ready') { snapshot = { ...snapshot, status, value, revision: snapshot.revision + 1 }; for (const fn of [...subscriptions]) fn() },
    async set(field, value) { form.update({ ...snapshot.value, [field]: value }); return true },
    async mutate(ops) {
      const next = structuredClone(snapshot.value ?? {})
      for (const op of ops) {
        mutations.push(op)
        const parent = op.path.slice(0, -1).reduce((node, key) => (node[key] ??= {}), next)
        parent[op.path.at(-1)] = op.value
      }
      form.update(next); return true
    },
  }
  const ctx = () => {
    const cleanups = []
    return {
      effect(fn) { const cleanup = fn(); cleanups.push(cleanup); return cleanup },
      configForms: { get(id) { assert.equal(id, 'deepseek-harness-kr'); return form } },
      slots: {
        inject(name, fn) { assert.equal(name, 'plugins.row.config'); return fn() },
        register(definition, component) {
          pages.set(definition.key, component)
          return () => { if (pages.get(definition.key) === component) pages.delete(definition.key) }
        },
      },
      locale: {
        subscribe() { return () => {} },
        getLocale: () => ({ active: selected, locales: [...languages.keys()].map((id) => ({ id })) }),
        addLanguage({ id }) { languages.set(id, {}); return () => languages.delete(id) },
        register(ns, id, dictionary) {
          const key = ns + '/' + id
          if (dictionaries.has(key)) throw new Error('duplicate ' + key)
          dictionaries.set(key, dictionary)
          return () => dictionaries.delete(key)
        },
        setLocale(id) { selected = id },
      },
      theme: { getTheme: () => ({ active: { colorScheme: 'dark' } }) },
      dispose() { for (const cleanup of cleanups.reverse()) cleanup() },
    }
  }
  return { dom, client, ctx, languages, dictionaries, resolveModel, form, mutations, pages, get appCreated() { return appCreated }, get appDestroyed() { return appDestroyed }, get selected() { return selected } }
}

test('shortcut handles repeats, matching keyup, blur, permissions, failures and disposal', async () => {
  const h = clientHarness({ character: false, theme: false, translation: false })
  try {
    let calls = 0, mode = 'ok', writable = true
    const snapshot = h.form.getSnapshot
    h.form.getSnapshot = () => ({ ...snapshot(), writable })
    h.form.set = async () => {
      calls++
      if (mode === 'throw') throw new Error('save failed')
      return mode !== 'false'
    }
    let warnings = 0
    h.dom.window.console.warn = () => { warnings++ }
    const ctx = h.ctx(); h.client.apply(ctx)
    const key = async (type = 'keydown', extra = {}, target = h.dom.window) => {
      const event = new h.dom.window.KeyboardEvent(type, { key: 'D', code: 'KeyD', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true, ...extra })
      target.dispatchEvent(event)
      await new Promise((resolve) => setImmediate(resolve))
      return event
    }
    assert.equal((await key()).defaultPrevented, true); assert.equal(calls, 1)
    await key('keyup', { key: 'Shift', code: 'ShiftLeft' })
    await key(); assert.equal(calls, 1)
    await key('keyup')
    await key('keydown', { repeat: true }); assert.equal(calls, 1)
    await key(); assert.equal(calls, 2)
    h.dom.window.dispatchEvent(new h.dom.window.Event('blur'))
    await key(); assert.equal(calls, 3)
    await key('keyup')
    writable = false; await key(); assert.equal(calls, 3)
    writable = true
    h.form.update({}, 'loading'); await key(); assert.equal(calls, 3)
    h.form.update({ character: false, theme: false, translation: false })
    const input = h.dom.window.document.createElement('input')
    h.dom.window.document.body.append(input)
    await key('keydown', {}, input); assert.equal(calls, 3)
    await key('keydown', { metaKey: true }); assert.equal(calls, 3)
    for (mode of ['false', 'throw']) { await key(); await key('keyup') }
    assert.equal(warnings, 2)
    let resolveSave
    h.form.set = () => { calls++; return new Promise((resolve) => { resolveSave = resolve }) }
    await key(); const pendingCalls = calls
    await key('keyup'); await key(); assert.equal(calls, pendingCalls)
    resolveSave(true); await new Promise((resolve) => setImmediate(resolve))
    await key(); assert.equal(calls, pendingCalls + 1)
    resolveSave(true); await new Promise((resolve) => setImmediate(resolve))
    ctx.dispose()
    await key('keyup'); h.dom.window.dispatchEvent(new h.dom.window.Event('blur'))
    await key(); assert.equal(calls, pendingCalls + 1)
    assert.equal(h.dom.window.__dscSleep, undefined)
  } finally { h.dom.window.close() }
})

test('shortcut parsing and key capture share one spelling', () => {
  const h = clientHarness({ character: false, theme: false, translation: false })
  try {
    const { parseShortcut, shortcutFromEvent, matchesShortcut } = h.client.internals
    // 같은 키워드로 만든 객체라도 평가한 창(jsdom)이 달라 프로토타입이 다르므로 이쪽 창 객체로 옮겨 비교한다.
    const combo = (value) => ({ ...parseShortcut(value) })
    assert.deepEqual(combo('Ctrl+Shift+D'), { ctrl: true, shift: true, alt: false, meta: false, key: 'd' })
    assert.deepEqual(combo('shift+alt+f1'), { ctrl: false, shift: true, alt: true, meta: false, key: 'f1' })
    assert.deepEqual(combo(' Cmd + Space '), { ctrl: false, shift: false, alt: false, meta: true, key: 'space' })
    assert.equal(parseShortcut('Ctrl+Shift'), null, 'modifier keys alone are not a shortcut')
    assert.equal(parseShortcut(''), null)
    assert.equal(shortcutFromEvent({ key: 'd', ctrlKey: true, shiftKey: true }), 'Ctrl+Shift+D')
    assert.equal(shortcutFromEvent({ key: 'F1', altKey: true }), 'Alt+F1')
    assert.equal(shortcutFromEvent({ key: ' ', ctrlKey: true }), 'Ctrl+Space')
    assert.equal(shortcutFromEvent({ key: '+', ctrlKey: true }), 'Ctrl+Plus')
    assert.equal(shortcutFromEvent({ key: 'Control', ctrlKey: true }), '')
    assert.equal(shortcutFromEvent({}), '')
    assert.match(shortcutFromEvent({ key: 'd', metaKey: true }), /^(Cmd|Meta)\+D$/)
    const pressed = (key, extra = {}) => ({ key, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, ...extra })
    assert.equal(matchesShortcut('Ctrl+Shift+D', pressed('D', { ctrlKey: true, shiftKey: true })), true)
    assert.equal(matchesShortcut('Ctrl+Shift+D', pressed('d', { ctrlKey: true, shiftKey: true })), true)
    assert.equal(matchesShortcut('Ctrl+Shift+D', pressed('D', { ctrlKey: true })), false)
    assert.equal(matchesShortcut('Ctrl+Shift+D', pressed('D', { ctrlKey: true, shiftKey: true, altKey: true })), false)
    assert.equal(matchesShortcut('cmd+d', pressed('d', { metaKey: true })), true)
    assert.equal(matchesShortcut('Ctrl+Space', pressed(' ', { ctrlKey: true })), true)
    assert.equal(matchesShortcut('Ctrl+Plus', pressed('+', { ctrlKey: true })), true)
    assert.equal(matchesShortcut('', pressed('d')), false)
    assert.equal(matchesShortcut('Ctrl+Shift', pressed('Shift', { ctrlKey: true, shiftKey: true })), false)
  } finally { h.dom.window.close() }
})

test('shortcut recorder turns each recorded key into one action', () => {
  const h = clientHarness({ character: false, theme: false, translation: false })
  try {
    const { shortcutKeyDown } = h.client.internals
    const action = (event) => ({ ...shortcutKeyDown(event) })
    assert.deepEqual(action({ key: 'Tab' }), { action: 'leave' }, 'Tab moves focus instead of becoming a shortcut')
    assert.deepEqual(action({ key: 'Escape' }), { action: 'cancel' })
    assert.deepEqual(action({ key: 'Backspace' }), { action: 'clear' })
    assert.deepEqual(action({ key: 'Delete' }), { action: 'clear' })
    assert.deepEqual(action({ key: 'd', ctrlKey: true, shiftKey: true }), { action: 'save', combo: 'Ctrl+Shift+D' })
    assert.deepEqual(action({ key: ' ', ctrlKey: true }), { action: 'save', combo: 'Ctrl+Space' })
    assert.deepEqual(action({ key: 'Control', ctrlKey: true }), { action: 'wait', held: 'Ctrl' })
    assert.deepEqual(action({ key: 'Shift', ctrlKey: true, shiftKey: true }), { action: 'wait', held: 'Ctrl+Shift' })
  } finally { h.dom.window.close() }
})

test('settings page records the shortcut by pressing keys instead of typing it', () => {
  const h = clientHarness({ character: false, theme: false, translation: false, characterToggleKey: 'Ctrl+Shift+D' })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const Page = h.pages.get(packageName + '#deepseek-harness-kr')
    const html = renderToStaticMarkup(React.createElement(Page, { view: 'page' }))
    assert.match(html, /aria-label="Record toggle character shortcut"/)
    assert.match(html, /readonly=""/)
    assert.match(html, /value="Ctrl\+Shift\+D"/)
    assert.match(html, /id="deepseek-harness-kr-shortcut-hint"/)
    assert.match(html, /Click the field, then press the keys you want/)
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('sleep minutes are bounded in schema and client settings', () => {
  assert.equal(Config.dict.idleSleepMinutes.meta.min, 0.5)
  assert.equal(Config.dict.idleSleepMinutes.meta.max, 60)
  assert.equal(Config.dict.idleSleepMinutes.meta.default, 1)
  const h = clientHarness({ character: false, theme: false, translation: false })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    for (const [value, expected] of [[undefined, 1], [NaN, 1], [Infinity, 1], [-1, 0.5], [0.5, 0.5], [60, 60], [100, 60]]) {
      h.form.update({ character: false, theme: false, translation: false, idleSleepMinutes: value })
      assert.equal(h.dom.window.__dscSleep.minutes, expected)
    }
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('client registers Korean independently, mounts once, and rolls back on disable during model load', async () => {
  const h = clientHarness()
  try {
    const first = h.ctx()
    h.client.apply(first)
    assert(h.languages.has('ko'))
    assert.equal(h.selected, 'en', 'installation must not overwrite the user language')
    assert.equal(h.dictionaries.size, 54)
    assert.equal(h.dictionaries.get('settings.theme/ko')['appearance.title'], '모양')
    assert.equal(h.dom.window.document.querySelectorAll('#dsc-stage').length, 1)
    assert.equal(h.dom.window.document.querySelectorAll('link').length, 2)
    first.dispose()
    assert.equal(h.dom.window.document.querySelectorAll('#dsc-stage, #dsc-bubble, link').length, 0)
    assert.equal(h.dictionaries.size, 0)
    assert(!h.languages.has('ko'))
    assert(h.dom.window.document.body.hasAttribute('data-ds-dark-theme'))
    assert.equal(h.appDestroyed, 1)
    let modelDestroyed = 0
    h.resolveModel({ destroy() { modelDestroyed++ } })
    await new Promise((resolve) => setImmediate(resolve))
    assert.equal(modelDestroyed, 1, 'late model completion must be disposed')
    assert.equal(h.dom.window.__dsc, undefined)
  } finally { h.dom.window.close() }
})

test('reinjection takes over without duplicate dictionaries or stale disposer removing the new instance', () => {
  const h = clientHarness()
  try {
    const first = h.ctx(), second = h.ctx()
    h.client.apply(first)
    h.client.apply(second)
    first.dispose()
    assert.equal(h.dom.window.document.querySelectorAll('#dsc-stage').length, 1)
    assert.equal(h.dictionaries.size, 54)
    second.dispose()
    assert.equal(h.dom.window.document.querySelectorAll('#dsc-stage').length, 0)
    assert.equal(h.dictionaries.size, 0)
  } finally { h.dom.window.close() }
})

test('a conflicting dictionary fails cleanly without removing someone else\'s language or translation', () => {
  const h = clientHarness()
  try {
    h.languages.set('ko', {})
    h.dictionaries.set('common/ko', { external: true })
    assert.throws(() => h.client.apply(h.ctx()), /duplicate/)
    assert(h.languages.has('ko'))
    assert.equal(h.dictionaries.size, 1)
    assert.equal(h.dom.window.document.querySelectorAll('link, #dsc-stage').length, 0)
  } finally { h.dom.window.close() }
})

test('Host asset route serves only its files and unregisters with the plugin', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-kr-test-'))
  let server
  try {
    await mkdir(join(root, 'assets'))
    await writeFile(join(root, 'assets', 'model.json'), '{"ok":true}')
    await writeFile(join(root, 'outside.json'), '{"secret":true}')
    server = createServer(createAssetHandler(join(root, 'assets')))
    server.listen(0, '127.0.0.1'); await once(server, 'listening')
    const url = 'http://127.0.0.1:' + server.address().port
    const asset = await fetch(url + ASSET_PATH + '/model.json')
    assert.equal(asset.status, 200)
    assert.deepEqual(await asset.json(), { ok: true })
    assert.equal((await fetch(url + ASSET_PATH + '/model.json', { method: 'HEAD' })).headers.get('content-length'), '11')
    // 조건부 요청: 같은 자산을 다시 받을 때 304로 본문을 생략한다(파일이 바뀌면 200).
    const etag = asset.headers.get('etag')
    assert.match(etag, /^"[0-9a-f]+-[0-9a-f]+"$/)
    const notModified = await fetch(url + ASSET_PATH + '/model.json', { headers: { 'if-none-match': etag } })
    assert.equal(notModified.status, 304)
    assert.equal(await notModified.text(), '')
    assert.equal((await fetch(url + ASSET_PATH + '/model.json', { headers: { 'if-none-match': '"0-0"' } })).status, 200)
    assert.equal((await fetch(url + ASSET_PATH + '/%2e%2e%2foutside.json')).status, 404)
    assert.equal((await fetch(url + ASSET_PATH + '/..%5coutside.json')).status, 404)
    assert.equal((await fetch(url + ASSET_PATH + '/model.json', { method: 'POST' })).status, 405)
    assert.equal((await fetch(url + ASSET_PATH + '/%zz')).status, 400)
    const registrations = new Map(), disposers = []
    hostApply({ effect(fn) { disposers.push(fn()) }, webServer: { register(route) { registrations.set(route.path, route); return () => registrations.delete(route.path) } } })
    assert.equal(registrations.get(ASSET_PATH).kind, 'prefix')
    assert.deepEqual([...registrations.keys()].sort(), [ASSET_PATH, PET_PATH, '/dsh-tts/speak', '/dsh-tts/state'].sort())
    for (const dispose of disposers) dispose()
    assert.equal(registrations.size, 0)
  } finally {
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)) }
    assert(resolve(root).startsWith(resolve(tmpdir()) + '\\') || resolve(root).startsWith(resolve(tmpdir()) + '/'))
    await rm(root, { recursive: true, force: true })
  }
})

test('all eight combinations mount only the selected features', () => {
  for (const character of [false, true]) for (const theme of [false, true]) for (const translation of [false, true]) {
    const h = clientHarness({ character, theme, translation })
    try {
      const ctx = h.ctx(); h.client.apply(ctx)
      const doc = h.dom.window.document
      assert.equal(!!doc.querySelector('#dsc-stage'), character)
      assert.equal(!!doc.querySelector('link[href$="character.css"]'), character)
      assert.equal(!!doc.querySelector('link[href$="theme.css"]'), theme)
      assert.equal(h.languages.has('ko'), translation)
      assert.equal(h.dictionaries.size, translation ? 54 : 0)
      assert.equal(doc.body.hasAttribute('data-ds-dark-theme'), true, 'theme and character keep the app dark mode')
      assert.equal(h.pages.size, 1, 'settings remain available even when every feature is off')
      ctx.dispose()
    } finally { h.dom.window.close() }
  }
})

test('live changes preserve unrelated features and dispose character resources independently', async () => {
  const h = clientHarness()
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const doc = h.dom.window.document, canvas = doc.querySelector('#dsc-stage')
    await h.form.set('theme', false)
    assert.equal(doc.querySelector('#dsc-stage'), canvas)
    assert(doc.body.hasAttribute('data-ds-dark-theme'))
    assert.equal(h.appDestroyed, 0)
    await h.form.set('translation', false)
    assert.equal(h.dictionaries.size, 0)
    assert.equal(doc.querySelector('#dsc-stage'), canvas)
    await h.form.set('character', false)
    assert.equal(h.appDestroyed, 1)
    assert.equal(doc.querySelectorAll('link, #dsc-stage, #dsc-bubble').length, 0)
    await h.form.set('theme', true)
    assert(!doc.querySelector('#dsc-stage'))
    assert(doc.querySelector('link[href$="theme.css"]'))
    assert.equal(h.appCreated, 1)
    await h.form.set('character', true)
    assert(doc.querySelector('#dsc-stage'))
    assert.equal(h.appCreated, 2)
    ctx.dispose()
    assert.equal(h.pages.size, 0)
  } finally { h.dom.window.close() }
})

test('stored disabled values do not flash features while configuration is loading', () => {
  const h = clientHarness(undefined, 'loading')
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    assert.equal(h.dom.window.document.querySelectorAll('link, #dsc-stage').length, 0)
    h.form.update({ character: false, theme: false, translation: false })
    assert.equal(h.appCreated, 0)
    assert.equal(h.dictionaries.size, 0)
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('plugin settings page exposes feature and power saving switches', () => {
  const h = clientHarness({ character: true, theme: false, translation: false })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const Page = h.pages.get(packageName + '#deepseek-harness-kr')
    assert(Page)
    const html = renderToStaticMarkup(React.createElement(Page, { view: 'page' }))
    assert.equal((html.match(/role="switch"/g) || []).length, 7)
    assert.equal((html.match(/<input type="checkbox" role="switch" checked=""/g) || []).length, 5)
    assert.match(html, /Character and speech bubbles/)
    assert.match(html, /Show character on mobile/)
    assert.match(html, /Intro on startup/)
    assert.match(html, /App shortcut icon/)
    assert.match(html, /Pastel theme/)
    assert.match(html, /Korean language pack/)
    assert.match(html, /aria-label="Power saving"/)
    assert.match(html, /aria-label="Shortcut"/)
    assert.match(html, /min="0.5" max="60"/)
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('settings page offers accessories, outfit and body type, and shares them with the character', async () => {
  const h = clientHarness({ character: false, theme: false, translation: false, glasses: true, bodyType: 'type2' })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const Page = h.pages.get(packageName + '#deepseek-harness-kr')
    const html = renderToStaticMarkup(React.createElement(Page, { view: 'page' }))
    assert.match(html, /aria-label="Accessories and outfit"/)
    for (const label of ['Glasses', 'Monocle', 'Change skirt length', 'Change top', 'Take off shoes', 'Hide tail']) assert.match(html, new RegExp(label))
    assert.doesNotMatch(html, /basin|Lean forward/i)
    assert.equal((html.match(/type="radio"/g) || []).length, 3)
    assert.match(html, /type="radio" name="deepseek-harness-kr-body" checked=""[^>]*\/><span>Body type 2 \(chibi\)/)
    assert.deepEqual({ ...h.dom.window.__dscOutfit }, { glasses: true, monocle: false, skirt: false, chestClothes: false, shoesOff: false, tailHide: false, bodyType: 'type2' })
    await h.form.set('bodyType', 'type1')
    assert.equal(h.dom.window.__dscOutfit.bodyType, 'type1')
    ctx.dispose()
    assert.equal(h.dom.window.__dscOutfit, undefined)
  } finally { h.dom.window.close() }
})

test('core worker is registered for termination when the plugin unloads', () => {
  assert.match(bundle, /new Worker\(BASE \+ "dsc-core-worker\.js"\); \} catch \{ return; \}\s*life\.add\(\(\) => \{ try \{ w\.terminate\(\) \} catch \{\} \}\)/)
})

test('update source parsing and version comparison', () => {
  const h = clientHarness()
  const { compareVersions } = h.client.internals
  const githubSource = (spec) => { const r = h.client.internals.githubSource(spec); return r && { ...r } }
  assert.deepEqual(githubSource('git+https://github.com/noire113-dev/deepseek-harness-kr.git'), { owner: 'noire113-dev', repo: 'deepseek-harness-kr', ref: null })
  assert.deepEqual(githubSource('github:someone/fork#dev'), { owner: 'someone', repo: 'fork', ref: 'dev' })
  assert.deepEqual(githubSource('git+ssh://git@github.com/a/b.git#v1'), { owner: 'a', repo: 'b', ref: 'v1' })
  assert.equal(githubSource('C:/plugins/deepseek-harness-kr'), null)
  assert.equal(githubSource('git+file:///C:/x/y'), null)
  assert.equal(githubSource(undefined), null)
  assert(compareVersions('0.1.3', '0.1.2') > 0)
  assert(compareVersions('0.2.0', '0.1.10') > 0)
  assert.equal(compareVersions('0.1.2', '0.1.2'), 0)
  assert(compareVersions('0.1.2', '0.1.3') < 0)
  assert(compareVersions('0.1.3', '0.1.3-rc.1') > 0)
  h.dom.window.close()
})

function fakeManager({ version = '0.1.2', source = 'git+https://github.com/noire113-dev/deepseek-harness-kr.git', install, remove } = {}) {
  const calls = []
  return {
    calls,
    async listBundles() { return { ok: true, value: [{ name: 'other', version: '9.9.9' }, { name: 'deepseek-harness-kr', version, source }] } },
    async installBundle(spec, options) { calls.push(['install', spec, options]); return install ? install(spec, options, calls) : { ok: true, value: { application: 'restart-required', restartReason: 'no-hmr', changed: true } } },
    async removeBundle(name) { calls.push(['remove', name]); return remove ? remove(name) : { ok: true, value: { application: 'applied', changed: true } } },
    async waitForInstall() { return { ok: true, value: null } },
  }
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))
const memoryStorage = () => { let v = null; return { read: () => v, write: (x) => { v = x }, clear: () => { v = null }, get value() { return v } } }
const remoteVersion = (version) => async () => ({ ok: true, status: 200, json: async () => ({ version }) })

test('updater asks for confirmation, then updates through installBundle with the installed source', async () => {
  const h = clientHarness(); after(() => h.dom.window.close())
  const { createUpdater } = h.client.internals
  const urls = []
  const updater = createUpdater({ storage: memoryStorage(), fetch: async (url) => { urls.push(url); return { ok: true, status: 200, json: async () => ({ version: '0.1.3' }) } } })
  const manager = fakeManager()
  updater.attach(manager); await settle()
  assert.deepEqual(urls, ['https://raw.githubusercontent.com/noire113-dev/deepseek-harness-kr/HEAD/package.json'])
  assert.equal(updater.getSnapshot().phase, 'available')
  assert.equal(updater.getSnapshot().current, '0.1.2')
  assert.equal(updater.getSnapshot().latest, '0.1.3')
  updater.update()
  assert.equal(updater.getSnapshot().phase, 'confirm')
  assert.equal(manager.calls.length, 0, 'nothing runs before confirmation')
  updater.cancel()
  assert.equal(updater.getSnapshot().phase, 'available')
  updater.update(); await updater.confirm()
  assert.deepEqual(manager.calls.map((c) => c[0]), ['install'])
  assert.equal(manager.calls[0][1], 'git+https://github.com/noire113-dev/deepseek-harness-kr.git')
  assert.equal(manager.calls[0][2].enabled, true)
  assert.equal(updater.getSnapshot().phase, 'restart')
  updater.update(); await updater.confirm()
  assert.equal(manager.calls.length, 1, 'no second install after the update finished')
})

test('updater removes and reinstalls when Harness refuses to reinstall an installed bundle', async () => {
  const h = clientHarness(); after(() => h.dom.window.close())
  const { createUpdater } = h.client.internals
  const storage = memoryStorage(), seen = []
  const manager = fakeManager({
    install: async (spec, options, calls) => {
      seen.push(storage.value)
      return calls.filter((c) => c[0] === 'install').length === 1
        ? { ok: true, value: { application: 'failed', error: { code: 'already-installed' } } }
        : { ok: true, value: { application: 'applied', changed: true } }
    },
  })
  const updater = createUpdater({ storage, fetch: remoteVersion('0.1.3') })
  updater.attach(manager); await settle()
  updater.update(); await updater.confirm()
  assert.deepEqual(manager.calls.map((c) => c[0]), ['install', 'remove', 'install'])
  assert.equal(manager.calls[1][1], 'deepseek-harness-kr')
  assert.equal(manager.calls[0][2].requestId, manager.calls[2][2].requestId)
  assert.equal(seen[1]?.to, '0.1.3', 'pending update is saved before the bundle is removed')
  assert.equal(storage.value, null)
  assert.equal(updater.getSnapshot().phase, 'updated')
  const stopped = createUpdater({ storage: memoryStorage(), fetch: remoteVersion('0.1.3') })
  const blocked = fakeManager({ install: async () => ({ ok: true, value: { application: 'failed', error: { code: 'already-installed' } } }), remove: async () => ({ ok: true, value: { application: 'failed', error: { code: 'stop-profile' } } }) })
  stopped.attach(blocked); await settle(); stopped.update(); await stopped.confirm()
  assert.deepEqual(blocked.calls.map((c) => c[0]), ['install', 'remove'], 'a refused removal does not reinstall')
  assert.equal(stopped.getSnapshot().phase, 'update-failed')
  assert.match(stopped.getSnapshot().error, /stop-profile/)
})

test('a reloaded plugin picks up the result of the update the previous instance started', async () => {
  const h = clientHarness(); after(() => h.dom.window.close())
  const { createUpdater } = h.client.internals
  const storage = memoryStorage()
  storage.write({ requestId: 'r1', from: '0.1.0', to: '0.1.2', source: 'x', at: Date.now() })
  const updater = createUpdater({ storage, fetch: remoteVersion('0.1.2') })
  updater.attach(fakeManager({ version: '0.1.2' })); await settle()
  assert.equal(updater.getSnapshot().phase, 'updated')
  assert.equal(updater.getSnapshot().from, '0.1.0')
  assert.equal(storage.value, null)
  const stale = memoryStorage()
  stale.write({ requestId: 'r2', from: '0.1.0', to: '0.1.2', source: 'x', at: Date.now() - 60 * 60 * 1000 })
  const later = createUpdater({ storage: stale, fetch: remoteVersion('0.1.2') })
  later.attach(fakeManager({ version: '0.1.0' })); await settle()
  assert.equal(later.getSnapshot().phase, 'available', 'an old pending record is ignored')
  assert.equal(stale.value, null)
})

test('updater reports current, unsupported, pinned, failures and a missing manager without installing', async () => {
  const h = clientHarness(); after(() => h.dom.window.close())
  const { createUpdater } = h.client.internals
  const run = async (options, manager) => { const u = createUpdater({ storage: memoryStorage(), ...options }); u.attach(manager); await settle(); return u }
  assert.equal((await run({ fetch: remoteVersion('0.1.2') }, fakeManager())).getSnapshot().phase, 'current')
  assert.equal((await run({ fetch: remoteVersion('0.1.1') }, fakeManager())).getSnapshot().phase, 'current', 'older remote is not an update')
  assert.equal((await run({ fetch: remoteVersion('9.0.0') }, fakeManager({ source: 'C:/local/deepseek-harness-kr' }))).getSnapshot().phase, 'unsupported')
  assert.equal((await run({ fetch: remoteVersion('9.0.0') }, fakeManager({ source: 'git+https://github.com/a/b.git#6675ac2616c3' }))).getSnapshot().phase, 'pinned')
  const offline = await run({ fetch: async () => ({ ok: false, status: 404 }) }, fakeManager())
  assert.equal(offline.getSnapshot().phase, 'check-failed')
  assert.match(offline.getSnapshot().error, /404/)
  const failing = await run({ fetch: remoteVersion('0.1.3') }, fakeManager({ install: async () => ({ ok: true, value: { application: 'failed', error: { code: 'network', diagnostic: 'offline' } } }) }))
  failing.update(); await failing.confirm()
  assert.equal(failing.getSnapshot().phase, 'update-failed')
  assert.match(failing.getSnapshot().error, /network: offline/)
  const none = createUpdater({ storage: memoryStorage(), fetch: remoteVersion('9.0.0') })
  await none.check(); none.update(); await none.confirm()
  assert.equal(none.getSnapshot().phase, 'unavailable')
  const detached = await run({ fetch: remoteVersion('0.1.3') }, fakeManager())
  detached.detach(); detached.update(); await detached.confirm()
  assert.equal(detached.getSnapshot().phase, 'unavailable')
})

test('settings page shows the update section and still works without the plugin manager', () => {
  const h = clientHarness({ character: true, theme: true, translation: true })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const Page = h.pages.get(packageName + '#deepseek-harness-kr')
    const html = renderToStaticMarkup(React.createElement(Page, { view: 'page' }))
    assert.match(html, /aria-label="Updates"/)
    assert.match(html, /Plugin manager is unavailable/)
    assert.equal((html.match(/role="switch"/g) || []).length, 7)
    ctx.dispose()
  } finally { h.dom.window.close() }
})

// ---------- 말풍선 음성 (TTS) ----------

test('voice settings default to off with no endpoint, model or voice', () => {
  const tts = readLive(Config({}).tts)
  assert.equal(tts.enabled, false)
  assert.deepEqual([tts.openai.baseUrl, tts.openai.model, tts.openai.voice], ['', '', ''])
  assert.equal(tts.openai.apiKeyEnv, 'DSH_TTS_API_KEY')
  assert.equal(tts.stream.pcmSampleRate, 24000)
  assert.deepEqual(tts.voiceLines, { reactions: true, status: false, mutters: false, others: true })
})

test('Host speech routes read live settings and stay 404 while disabled', async () => {
  const live = (value) => ({ get: () => value, set(next) { value = next } })
  const enabled = live(false), baseUrl = live(''), rate = live(24000)
  const routes = new Map()
  hostApply({ connection: { requestRejection: () => undefined }, effect(fn) { fn() }, webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } } },
    { tts: { enabled, openai: { baseUrl, apiKeyEnv: live('') }, stream: { pcmSampleRate: rate } } })
  const server = createServer((req, res) => (routes.get(req.url) ?? ((_, r) => r.writeHead(404).end()))(req, res))
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  const url = 'http://127.0.0.1:' + server.address().port
  try {
    assert.equal((await fetch(url + '/dsh-tts/state')).status, 404)
    enabled.set(true)
    assert.equal((await (await fetch(url + '/dsh-tts/state')).json()).enabled, false, 'on without a URL stays detached')
    baseUrl.set('http://127.0.0.1:9/v1'); rate.set(44100)
    assert.deepEqual(await (await fetch(url + '/dsh-tts/state')).json(), { enabled: true, pcmSampleRate: 44100, voiceLines: { reactions: true, status: false, mutters: false, others: true } })
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)) }
})

function voiceFetch(h) {
  const calls = []
  h.dom.window.fetch = async (url, init) => {
    calls.push(init?.body ? [url, JSON.parse(init.body).text] : [url])
    if (url === '/dsh-tts/state') return { ok: true, status: 200, json: async () => ({ enabled: true, pcmSampleRate: 24000, voiceLines: { reactions: true, others: true } }) }
    return { ok: false, status: 503, body: null }
  }
  return calls
}

test('voice attaches with the character, a URL and the switch, and follows setting changes', async () => {
  const h = clientHarness({ tts: { enabled: false, openai: { baseUrl: 'http://tts/v1' } } })
  try {
    const calls = voiceFetch(h)
    const ctx = h.ctx(); h.client.apply(ctx)
    const say = (text) => h.dom.window.dispatchEvent(new h.dom.window.CustomEvent('dsc:say', { detail: { text, ms: 0, kind: 'reaction' } }))
    await settle()
    assert.equal(calls.length, 0, 'nothing is requested while the switch is off')
    await h.form.mutate([{ op: 'set', path: ['tts', 'enabled'], value: true }])
    await settle()
    assert.deepEqual(calls, [['/dsh-tts/state']])
    say('안녕'); await settle()
    assert.deepEqual(calls.at(-1), ['/dsh-tts/speak', '안녕'])
    await h.form.mutate([{ op: 'set', path: ['tts', 'stream', 'pcmSampleRate'], value: 44100 }])
    await settle()
    assert.equal(calls.filter(([url]) => url === '/dsh-tts/state').length, 2, 'a playback setting change re-reads the state')
    await h.form.mutate([{ op: 'set', path: ['tts', 'openai', 'model'], value: 'x' }])
    await settle()
    assert.equal(calls.filter(([url]) => url === '/dsh-tts/state').length, 2, 'request-only settings need no reattach')
    await h.form.set('character', false)
    const before = calls.length
    say('들리면 안 됨'); await settle()
    assert.equal(calls.length, before, 'no character, no voice')
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('voice disposed before its state arrives never starts listening', async () => {
  const h = clientHarness({ tts: { enabled: true, openai: { baseUrl: 'http://tts/v1' } } })
  try {
    let release
    const calls = []
    h.dom.window.fetch = (url) => { calls.push(url); return url === '/dsh-tts/state' ? new Promise((resolve) => { release = resolve }) : Promise.resolve({ ok: false, status: 503, body: null }) }
    const ctx = h.ctx(); h.client.apply(ctx)
    ctx.dispose()
    release({ ok: true, status: 200, json: async () => ({ enabled: true, pcmSampleRate: 24000, voiceLines: { reactions: true } }) })
    await settle(); await settle()
    h.dom.window.dispatchEvent(new h.dom.window.CustomEvent('dsc:say', { detail: { text: 'late', ms: 0, kind: 'reaction' } }))
    await settle()
    assert.deepEqual(calls, ['/dsh-tts/state'])
  } finally { h.dom.window.close() }
})

test('settings page shows the voice section without needing a YAML edit', () => {
  const h = clientHarness({ tts: { enabled: true, openai: { baseUrl: '', extraBody: { speed: 1.1 }, timeoutMs: 30000 } } })
  try {
    const ctx = h.ctx(); h.client.apply(ctx)
    const Page = h.pages.get(packageName + '#deepseek-harness-kr')
    const html = renderToStaticMarkup(React.createElement(Page, { view: 'page' }))
    assert.match(html, /aria-label="Speech bubble voice"/)
    for (const label of ['Read speech bubbles aloud', 'API address', 'API key', 'Model', 'Voice ID', 'Sample rate \\(Hz\\)', 'Extra request values \\(JSON\\)', 'Advanced', 'Extra headers \\(JSON\\)', 'Line prefix', 'Response timeout \\(seconds\\)', 'API key name']) assert.match(html, new RegExp(label))
    for (const group of ['Connection', 'Voice', 'Lines to read']) assert.match(html, new RegExp('role="group" aria-label="' + group + '"'))
    assert.match(html, /min="8000" max="48000" step="1"/)
    assert.match(html, /min="1" max="600" step="0.001"/)
    assert.match(html, /Response timeout \(seconds\)<\/span><input[^>]*value="30"/, 'timeout is shown in seconds')
    assert.ok(html.indexOf('Extra request values') > html.indexOf('<summary'), 'extra request values live under Advanced')
    assert.match(html, /Enter an API address to hear speech/)
    assert.match(html, /&quot;speed&quot;: 1.1/)
    assert.match(html, /AI-generated voice/)
    assert.match(html, /credential store is unavailable/)
    assert.match(html, /type="password"/)
    assert.equal((html.match(/role="switch"/g) || []).length, 7, 'feature, mobile, intro, icon and sleep switches are present')
    ctx.dispose()
  } finally { h.dom.window.close() }
})

test('voice helpers: JSON objects only, attach signature, and a key store that never holds the value', async () => {
  const h = clientHarness(); after(() => h.dom.window.close())
  const { parseJsonObject, ttsSignature, createKeyStore } = h.client.internals
  assert.deepEqual({ ...parseJsonObject('  ', false).value }, {})
  assert.equal(parseJsonObject('{"speed":1.2}', false).value.speed, 1.2)
  for (const bad of ['[1]', '"x"', '{bad', 'null']) assert.ok(parseJsonObject(bad, false).error, bad)
  const on = { tts: { enabled: true, openai: { baseUrl: 'http://a' } } }
  assert.notEqual(ttsSignature(on), null)
  assert.equal(ttsSignature({ ...on, character: false }), null)
  assert.equal(ttsSignature({ tts: { enabled: true, openai: { baseUrl: '' } } }), null)
  assert.equal(ttsSignature({ tts: { ...on.tts, enabled: false } }), null)
  const stored = new Map()
  const remote = {
    async describe(refs) { return { ok: true, value: Object.fromEntries(refs.map((ref) => [ref, { configured: stored.has(ref), source: stored.has(ref) ? 'store' : undefined, writable: true }])) } },
    async set(ref, value) { stored.set(ref, value); return { ok: true } },
  }
  const keys = createKeyStore()
  assert.equal(keys.getSnapshot().available, false)
  assert.equal(await keys.save('sk-1'), false, 'no store, nothing saved')
  keys.attach(remote); await settle()
  assert.equal(keys.getSnapshot().configured, false)
  assert.equal(await keys.save('sk-secret'), true)
  assert.deepEqual({ ...keys.getSnapshot() }, { available: true, configured: true, source: 'store' })
  assert.equal(stored.get('DSH_TTS_API_KEY'), 'sk-secret')
  assert.doesNotMatch(JSON.stringify(keys.getSnapshot()), /sk-secret/)
  keys.setRef('OTHER_KEY'); await settle()
  assert.equal(keys.getSnapshot().configured, false)
  keys.detach()
  assert.equal(keys.getSnapshot().available, false)
})
