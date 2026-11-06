// The original animation stays in assets/dsc.js; each feature owns its lifecycle here.
const ROOT = '/deepseek-harness-kr/assets/'
const PET_ROOT = '/deepseek-harness-kr/pet/'
const SLOT = '__deepseekHarnessKrDispose'
const ENTRY_ID = 'deepseek-harness-kr'
// 소품·옷 (데스크톱 펫 메뉴와 같은 항목, 세숫대야·앞으로 숙이기는 뺌)과 체형
const OUTFIT_FIELDS = [
  ['glasses', '뿔테 안경', 'Glasses'],
  ['monocle', '외눈 안경', 'Monocle'],
  ['skirt', '치마 길이 바꾸기', 'Change skirt length'],
  ['chestClothes', '가슴 옷 바꾸기', 'Change top'],
  ['shoesOff', '신발 벗기', 'Take off shoes'],
  ['tailHide', '꼬리 숨기기', 'Hide tail'],
  ['earHide', '동물귀 숨기기', 'Hide animal ears'],
]
const BODY_TYPES = [['default', '기본 체형', 'Default'], ['type1', '체형 1', 'Body type 1'], ['type2', '체형 2 (꼬마)', 'Body type 2 (chibi)']]
const React = require('react')
const sleepMinutes = (value) => {
  const n = Number(value ?? 1)
  return Number.isFinite(n) ? Math.min(60, Math.max(0.5, n)) : 1
}
// ---------- 단축키 ----------
// 설정 칸을 눌러 원하는 키 조합을 그대로 눌러 등록하고, 실제 입력도 같은 규칙으로 해석한다.
const SHORTCUT_HINT_ID = 'deepseek-harness-kr-shortcut-hint'
const PET_SHORTCUT_HINT_ID = 'deepseek-harness-kr-pet-shortcut-hint'
const DRAG_HINT_ID = 'deepseek-harness-kr-drag-hint'
const CANVAS_HINT_ID = 'deepseek-harness-kr-canvas-hint'
const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta', 'AltGraph', 'CapsLock'])
const MODIFIER_ALIASES = new Map([
  ['ctrl', 'ctrl'], ['control', 'ctrl'],
  ['shift', 'shift'],
  ['alt', 'alt'], ['option', 'alt'],
  ['meta', 'meta'], ['cmd', 'meta'], ['command', 'meta'], ['win', 'meta'], ['windows', 'meta'],
])
const isMacPlatform = () => /Mac|iPhone|iPad|iPod/i.test(typeof navigator === 'object' && navigator ? String(navigator.platform || navigator.userAgent || '') : '')
// 문자열 키를 저장·비교용 토큰으로: Space·+는 이름으로 바꿔 '+' 구분자와 겹치지 않게 한다.
const shortcutKeyToken = (key) => {
  const text = String(key ?? '')
  if (text === ' ') return 'space'
  if (text === '+') return 'plus'
  return text.toLowerCase()
}
// 저장된 문자열("Ctrl+Shift+D")을 비교용 조합으로. 키가 없으면(수식 키만) null.
function parseShortcut(value) {
  const combo = { ctrl: false, shift: false, alt: false, meta: false, key: '' }
  for (const raw of String(value ?? '').split('+')) {
    const token = raw.trim()
    if (!token) continue
    const modifier = MODIFIER_ALIASES.get(token.toLowerCase())
    if (modifier) combo[modifier] = true
    else combo.key = shortcutKeyToken(token)
  }
  return combo.key ? combo : null
}
// 실제 키 입력을 저장할 문자열로. 수식 키만 눌렀으면 ''.
function shortcutFromEvent(event) {
  const key = String(event?.key ?? '')
  if (!key || MODIFIER_KEYS.has(key)) return ''
  const parts = []
  if (event.ctrlKey) parts.push('Ctrl')
  if (event.altKey) parts.push('Alt')
  if (event.shiftKey) parts.push('Shift')
  if (event.metaKey) parts.push(isMacPlatform() ? 'Cmd' : 'Meta')
  parts.push(key === ' ' ? 'Space' : key === '+' ? 'Plus' : key.length === 1 ? key.toUpperCase() : key)
  return parts.join('+')
}
function matchesShortcut(value, event) {
  const combo = parseShortcut(value)
  if (!combo || !event) return false
  return combo.ctrl === !!event.ctrlKey && combo.alt === !!event.altKey && combo.shift === !!event.shiftKey
    && combo.meta === !!event.metaKey && combo.key === shortcutKeyToken(event.key)
}
const heldModifiers = (event) => {
  const parts = []
  if (event.ctrlKey) parts.push('Ctrl')
  if (event.altKey) parts.push('Alt')
  if (event.shiftKey) parts.push('Shift')
  if (event.metaKey) parts.push(isMacPlatform() ? 'Cmd' : 'Meta')
  return parts.join('+')
}
// 녹음 중 키 입력 하나를 동작으로 바꾼다. 화면 없이도 검사할 수 있게 순수 함수로 둔다.
// leave: 탭은 포커스를 옮기도록 그냥 둔다 · cancel: Esc · clear: Backspace/Delete · wait: 수식 키만 · save: 조합 완성
function shortcutKeyDown(event) {
  if (event.key === 'Tab') return { action: 'leave' }
  if (event.key === 'Escape') return { action: 'cancel' }
  if (event.key === 'Backspace' || event.key === 'Delete') return { action: 'clear' }
  const combo = shortcutFromEvent(event)
  return combo ? { action: 'save', combo } : { action: 'wait', held: heldModifiers(event) }
}

// 이동 키는 단일 키만 쓴다: 수식 키 하나는 떼는 순간(wait → keyup에서 저장), 그 밖의 키 하나는 누르는 순간 저장.
const MODIFIER_LABELS = new Map([['Control', 'Ctrl'], ['Alt', 'Alt'], ['Shift', 'Shift'], ['Meta', isMacPlatform() ? 'Cmd' : 'Meta']])
const DRAG_KEY_LABELS = new Map([[' ', 'Space'], ['+', 'Plus']])
function dragKeyDown(event) {
  if (event.key === 'Tab') return { action: 'leave' }
  if (event.key === 'Escape') return { action: 'cancel' }
  if (event.key === 'Backspace' || event.key === 'Delete') return { action: 'clear' }
  const modifier = MODIFIER_LABELS.get(event.key)
  if (modifier) return { action: 'wait', held: modifier }
  // 수식 키와 다른 키를 함께 누르면(조합) 이동 키로 쓰지 않는다 — 수식 키 하나만 떼어 저장하게 둔다
  if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return { action: 'wait', held: heldModifiers(event) }
  const key = String(event.key ?? '')
  if (!key) return { action: 'wait', held: '' }
  const label = DRAG_KEY_LABELS.get(key) ?? (key.length === 1 ? key.toUpperCase() : key)
  return { action: 'save', key: label }
}

function createLifetime() {
  let stopped = false
  const cleanups = []
  const timers = new Set(), intervals = new Set(), frames = new Set()
  const add = (cleanup) => { if (stopped) cleanup(); else cleanups.push(cleanup) }
  const timeout = (fn, ms, ...args) => {
    if (stopped) return 0
    const id = window.setTimeout(() => { timers.delete(id); if (!stopped) fn(...args) }, ms)
    timers.add(id); return id
  }
  const interval = (fn, ms, ...args) => {
    if (stopped) return 0
    const id = window.setInterval(() => { if (!stopped) fn(...args) }, ms)
    intervals.add(id); return id
  }
  const frame = (fn) => {
    if (stopped) return 0
    const id = window.requestAnimationFrame((time) => { frames.delete(id); if (!stopped) fn(time) })
    frames.add(id); return id
  }
  const listen = (target, type, fn, options) => {
    if (stopped) return
    target.addEventListener(type, fn, options)
    add(() => target.removeEventListener(type, fn, options))
  }
  const observe = (fn) => {
    const observer = new window.MutationObserver((...args) => { if (!stopped) fn(...args) })
    add(() => observer.disconnect())
    return observer
  }
  const own = (value, cleanup) => { add(() => cleanup(value)); return value }
  return {
    add, timeout, interval, frame, listen, observe, own,
    get stopped() { return stopped },
    dispose() {
      if (stopped) return
      stopped = true
      for (const id of timers) window.clearTimeout(id)
      for (const id of intervals) window.clearInterval(id)
      for (const id of frames) window.cancelAnimationFrame(id)
      for (const cleanup of cleanups.reverse()) {
        try { cleanup() } catch (error) { console.warn('DeepSeek짱 cleanup:', error) }
      }
    },
  }
}

function mountCharacter(life) {
  const setTimeout = life.timeout, setInterval = life.interval, requestAnimationFrame = life.frame
  const addEventListener = (...args) => life.listen(window, ...args)
  function MutationObserver(fn) { return life.observe(fn) }
  /* ORIGINAL_CHARACTER */
}

function stylesheet(life, file) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'; link.href = ROOT + file
  document.head.appendChild(link)
  life.add(() => link.remove())
}

function mountLayout(life) {
  const owned = new Map()
  const mark = (node, name) => {
    if (node.classList.contains(name)) return
    node.classList.add(name)
    if (!owned.has(node)) owned.set(node, new Set())
    owned.get(node).add(name)
  }
  const tag = () => {
    document.querySelectorAll('[class*="_card"]').forEach((node) => {
      if (node.closest('[class*="_root"]') && node.querySelector('[class*="_input"]')) mark(node, 'dsc-composer')
    })
    document.querySelectorAll('button[aria-label="메시지 보내기"], button[aria-label="Send message"]').forEach((node) => mark(node, 'dsc-send'))
    document.querySelectorAll('button[class*="_newSession"]').forEach((node) => mark(node, 'dsc-newsession'))
  }
  tag()
  let queued = false
  life.observe(() => {
    if (queued) return
    queued = true
    life.frame(() => { queued = false; tag() })
  }).observe(document.body, { childList: true, subtree: true })
  life.add(() => { for (const [node, names] of owned) for (const name of names) node.classList.remove(name) })
}

function mountTheme(ctx, life) {
  stylesheet(life, 'theme.css')
  life.add(() => {
    if (ctx.theme.getTheme().active.colorScheme === 'dark') document.body.setAttribute('data-ds-dark-theme', '')
    else document.body.removeAttribute('data-ds-dark-theme')
  })
}

function mountTranslation(ctx, life) {
  if (!ctx.locale.getLocale().locales.some((locale) => locale.id.toLowerCase() === 'ko')) {
    life.add(ctx.locale.addLanguage({ id: 'ko', label: '한국어', fallback: 'en' }))
  }
  for (const [namespace, dictionary] of Object.entries(KOREAN_DICTIONARIES)) {
    life.add(ctx.locale.register(namespace, 'ko', dictionary))
  }
}

function startCharacter(life) {
  const previous = window.__dsc
  life.add(() => {
    if (window.__dsc !== previous) {
      if (previous === undefined) delete window.__dsc
      else window.__dsc = previous
    }
    document.documentElement.classList.remove('dsc-hover', 'dsc-grabbing')
  })
  stylesheet(life, 'character.css')
  // 캐릭터를 끄거나 플러그인이 내려가면 바깥 펫 창도 숨김 (이 화면에서 펫 창을 쓴 적이 있을 때만)
  life.add(() => {
    delete window.__dscPetToggle
    delete window.__dscCanvasToggle
    delete window.__dscCanvasHidden
    document.getElementById('dsc-hide-chip')?.remove()
    if (!window.__dscPetUsed) return
    delete window.__dscPetUsed
    try { window.fetch(PET_ROOT + 'hide', { method: 'POST', keepalive: true }).catch(() => {}) } catch {}
  })
  mountCharacter(life)
}

// ---------- 플러그인 업데이트 ----------
// 설치 주소(GitHub)의 package.json 버전과 설치된 버전을 비교하고, Harness 플러그인 관리자의
// installBundle(설치할 때와 같은 기능)을 같은 설치 주소로 다시 불러 최신 커밋을 받는다.

// GitHub 설치 주소 → { owner, repo, ref }. GitHub이 아니면 null.
function githubSource(spec) {
  if (typeof spec !== 'string') return null
  const text = spec.trim()
  const short = text.match(/^github:([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:#(.+))?$/i)
  const full = text.match(/^(?:git\+)?(?:https?:\/\/|ssh:\/\/git@|git@)github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?(?:#(.+))?$/i)
  const m = short || full
  return m ? { owner: m[1], repo: m[2], ref: m[3] || null } : null
}

// "1.2.3" 형식 비교. 앞이 크면 양수. 뒤에 붙은 -rc 등은 같은 번호의 정식 버전보다 낮게 본다.
function compareVersions(a, b) {
  const parse = (v) => {
    const [core, pre] = String(v ?? '').trim().replace(/^v/i, '').split('-', 2)
    return { nums: core.split('.').map((n) => parseInt(n, 10) || 0), pre: pre ?? null }
  }
  const x = parse(a), y = parse(b)
  for (let i = 0; i < Math.max(x.nums.length, y.nums.length, 3); i++) {
    const d = (x.nums[i] ?? 0) - (y.nums[i] ?? 0)
    if (d) return d
  }
  if (x.pre === y.pre) return 0
  if (x.pre === null) return 1
  if (y.pre === null) return -1
  return x.pre < y.pre ? -1 : 1
}

const PENDING_KEY = 'deepseek-harness-kr:update'
const browserStorage = {
  read() { try { return JSON.parse(window.localStorage.getItem(PENDING_KEY) || 'null') } catch { return null } },
  write(value) { try { window.localStorage.setItem(PENDING_KEY, JSON.stringify(value)) } catch {} },
  clear() { try { window.localStorage.removeItem(PENDING_KEY) } catch {} },
}

function createUpdater({ fetch: fetchImpl = (...args) => window.fetch(...args), storage = browserStorage, now = () => Date.now() } = {}) {
  const listeners = new Set()
  let manager = null, generation = 0
  let snapshot = { phase: 'unavailable' }
  const set = (patch) => { snapshot = { ...snapshot, ...patch }; for (const fn of [...listeners]) fn() }
  const message = (error) => (error && (error.message || error.code || String(error))) || ''
  const failure = (value) => [value?.error?.code, value?.error?.diagnostic].filter(Boolean).join(': ') || 'failed'
  // 이전 화면이 시작한 업데이트(자기 자신을 지웠다 다시 설치)가 끝나 새 버전이 뜬 경우 결과를 이어받는다.
  const resume = async (mine) => {
    const pending = storage.read()
    if (!pending || typeof pending.requestId !== 'string') return false
    if (now() - (pending.at || 0) > 15 * 60 * 1000) { storage.clear(); return false }
    if (snapshot.current && pending.to && compareVersions(snapshot.current, pending.to) >= 0) {
      storage.clear(); set({ phase: 'updated', from: pending.from, error: '' }); return true
    }
    const waited = await manager.waitForInstall?.(pending.requestId)
    if (mine !== generation) return true
    if (waited?.ok && waited.value) {
      storage.clear()
      const v = waited.value
      set(v.application === 'failed' ? { phase: 'update-failed', error: failure(v) } : { phase: 'updated', from: pending.from, error: '' })
      return true
    }
    storage.clear()
    return false
  }
  const check = async () => {
    const mine = ++generation
    if (!manager) { set({ phase: 'unavailable' }); return }
    set({ phase: 'checking', error: '' })
    try {
      const listed = await manager.listBundles()
      if (mine !== generation) return
      if (!listed?.ok) throw new Error(message(listed?.error) || 'listBundles failed')
      const row = listed.value.find((item) => item.name === PLUGIN_ID)
      const current = row?.version ?? null, source = row?.source ?? null
      const gh = githubSource(source)
      if (!gh) { set({ phase: 'unsupported', current, latest: null, source }); return }
      if (gh.ref && /^[0-9a-f]{7,40}$/i.test(gh.ref)) { set({ phase: 'pinned', current, latest: null, source }); return }
      const url = `https://raw.githubusercontent.com/${gh.owner}/${gh.repo}/${encodeURIComponent(gh.ref || 'HEAD')}/package.json`
      const response = await fetchImpl(url, { cache: 'no-store' })
      if (mine !== generation) return
      if (!response.ok) throw new Error('HTTP ' + response.status)
      const latest = (await response.json())?.version
      if (mine !== generation) return
      if (typeof latest !== 'string') throw new Error('no version in package.json')
      set({ current, latest, source })
      if (await resume(mine)) return
      if (mine !== generation) return
      set({ phase: compareVersions(latest, current) > 0 ? 'available' : 'current' })
    } catch (error) {
      if (mine === generation) set({ phase: 'check-failed', error: message(error) })
    }
  }
  const settle = (value) => {
    if (value.application === 'applied' || value.application === 'overridden') set({ phase: 'updated', from: snapshot.current })
    else if (value.application === 'restart-required') set({ phase: 'restart' })
    else if (value.application === 'cancelled') set({ phase: 'available', error: 'cancelled' })
    else set({ phase: 'update-failed', error: failure(value) })
  }
  // 1단계: 확인 요청
  const update = () => { if (manager && snapshot.phase === 'available' && snapshot.source) set({ phase: 'confirm', error: '' }) }
  const cancel = () => { if (snapshot.phase === 'confirm') set({ phase: 'available' }) }
  // 2단계: 실제 업데이트. 먼저 같은 주소로 다시 설치하고, Harness가 '이미 설치됨'으로 막으면
  // 공식 플러그인 업데이트와 같은 방식(제거 → 다시 설치)으로 진행한다. 설정은 프로필에 따로 남는다.
  const confirm = async () => {
    if (!manager || snapshot.phase !== 'confirm' || !snapshot.source) return
    const mine = ++generation, pm = manager, source = snapshot.source
    const requestId = PLUGIN_ID + '-update-' + now()
    set({ phase: 'updating', error: '' })
    try {
      let result = await pm.installBundle(source, { enabled: true, requestId })
      if (!result?.ok) throw new Error(message(result?.error) || 'installBundle failed')
      if (result.value.application === 'failed' && result.value.error?.code === 'already-installed') {
        storage.write({ requestId, from: snapshot.current, to: snapshot.latest, source, at: now() })
        const removed = await pm.removeBundle(PLUGIN_ID)
        if (!removed?.ok) throw new Error(message(removed?.error) || 'removeBundle failed')
        if (removed.value.application === 'failed' || removed.value.error) { storage.clear(); throw new Error(failure(removed.value)) }
        // 이 시점에 이 화면은 내려갔을 수 있다. 설치 요청은 그대로 보낸다.
        result = await pm.installBundle(source, { enabled: true, requestId })
        if (!result?.ok) throw new Error(message(result?.error) || 'installBundle failed')
      }
      storage.clear()
      if (mine === generation) settle(result.value)
    } catch (error) {
      if (mine === generation) set({ phase: 'update-failed', error: message(error) })
    }
  }
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
    getSnapshot: () => snapshot,
    attach(next) { manager = next; check() },
    detach() { manager = null; generation++; set({ phase: 'unavailable' }) },
    check,
    update,
    cancel,
    confirm,
  }
}

// ---------- 말풍선 음성 (TTS) ----------
// 재생·입 모양 코드는 plugins/dsh-tts/src/client 원본을 빌드 때 그대로 넣는다.
/* TTS_CLIENT */

const DEFAULT_KEY_REF = 'DSH_TTS_API_KEY'

// 이 기능이 붙어 있는 동안만 dsc:say를 듣는다. 늦게 끝난 초기화는 feature.add가 바로 정리한다.
function mountTts(feature) {
  createTtsClient().apply({ effect: (fn) => feature.add(fn()) })
    .catch((error) => console.warn('DeepSeek짱 음성:', error))
}

// 설정이 바뀌면 다시 붙일지 정하는 값. 캐릭터가 꺼져 있으면 읽을 말풍선이 없다.
function ttsSignature(value) {
  const tts = value.tts
  if (value.character === false || tts?.enabled !== true || !tts.openai?.baseUrl) return null
  return JSON.stringify([tts.openai.baseUrl, tts.stream?.pcmSampleRate, tts.voiceLines])
}

// API 키는 Harness credentials에 저장한다. 화면은 "설정됨" 여부만 알고 값은 받지 않는다.
function createKeyStore() {
  const listeners = new Set()
  let remote = null, ref = DEFAULT_KEY_REF, generation = 0
  let snapshot = { available: false, configured: false, source: null }
  const set = (next) => { snapshot = next; for (const fn of [...listeners]) fn() }
  const refresh = async () => {
    const mine = ++generation
    if (!remote || !ref) { set({ available: !!remote, configured: false, source: null }); return }
    try {
      const response = await remote.describe([ref])
      if (mine !== generation) return
      const view = response?.ok ? response.value?.[ref] : undefined
      set({ available: true, configured: view?.configured === true, source: view?.source ?? null })
    } catch { if (mine === generation) set({ available: true, configured: false, source: null }) }
  }
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
    getSnapshot: () => snapshot,
    get ref() { return ref },
    setRef(next) { const name = typeof next === 'string' ? next : DEFAULT_KEY_REF; if (name !== ref) { ref = name; refresh() } },
    attach(next) { remote = next; refresh() },
    detach() { remote = null; generation++; set({ available: false, configured: false, source: null }) },
    changed(name) { if (name === ref) refresh() },
    async save(value) {
      if (!remote || !ref) return false
      const response = await remote.set(ref, value)
      await refresh()
      return response?.ok !== false
    },
  }
}

const sectionStyle = { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 }
const fieldStyle = { display: 'grid', gap: 4 }
const inputStyle = { width: '100%', boxSizing: 'border-box' }

// 입력 중에는 초안을 들고 있다가, 포커스를 벗어나거나 Enter를 누르면 저장한다.
function TtsField({ label, hint, value, placeholder, disabled, multiline, type, min, max, step, commit }) {
  const shown = value ?? ''
  const [draft, setDraft] = React.useState(shown)
  const [error, setError] = React.useState('')
  React.useEffect(() => { setDraft(shown); setError('') }, [shown])
  const save = async () => {
    if (draft === shown) return
    const problem = await commit(draft)
    setError(problem || '')
  }
  const onKeyDown = (event) => { if (!multiline && event.key === 'Enter') event.currentTarget.blur() }
  const input = React.createElement(multiline ? 'textarea' : 'input', {
    style: inputStyle, value: draft, placeholder, disabled, type: multiline ? undefined : (type || 'text'), rows: multiline ? 3 : undefined,
    min, max, step, spellCheck: false, onChange: (event) => setDraft(event.target.value), onBlur: save, onKeyDown,
  })
  return React.createElement('label', { style: fieldStyle },
    React.createElement('span', null, label),
    input,
    hint ? React.createElement('small', { style: { opacity: 0.7 } }, hint) : null,
    error ? React.createElement('small', { role: 'alert' }, error) : null)
}

// JSON 칸: 객체만 받는다. 빈 칸은 {}.
function parseJsonObject(text, ko) {
  const trimmed = text.trim()
  if (trimmed === '') return { value: {} }
  try {
    const value = JSON.parse(trimmed)
    if (value && typeof value === 'object' && !Array.isArray(value)) return { value }
  } catch {}
  return { error: ko ? '{ "이름": 값 } 형태의 JSON 객체를 넣어 주세요.' : 'Enter a JSON object such as { "name": value }.' }
}

function TtsKeyField({ keys, ko, disabled }) {
  const key = React.useSyncExternalStore((fn) => keys.subscribe(fn), () => keys.getSnapshot(), () => keys.getSnapshot())
  const [draft, setDraft] = React.useState('')
  const [message, setMessage] = React.useState('')
  const t = (k, e) => (ko ? k : e)
  const status = !key.available ? t('Harness 자격 증명 저장소에 연결되지 않았습니다.', 'The Harness credential store is unavailable.')
    : key.configured ? t('저장됨', 'Saved') + (key.source ? ' (' + key.source + ')' : '')
      : t('저장된 키 없음 · 키가 필요 없는 로컬 서버는 비워 두기', 'No key saved · leave empty for local servers that need none')
  const save = async () => {
    if (!draft.trim()) return
    setMessage('')
    try { setMessage(await keys.save(draft.trim()) ? '' : t('키를 저장하지 못했습니다.', 'Could not save the key.')) } catch { setMessage(t('키를 저장하지 못했습니다.', 'Could not save the key.')) }
    setDraft('')
  }
  return React.createElement('label', { style: fieldStyle },
    React.createElement('span', null, t('API 키', 'API key')),
    React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
      React.createElement('input', { type: 'password', autoComplete: 'off', style: { ...inputStyle, flex: '1 1 auto', minWidth: 0 }, value: draft, disabled: disabled || !key.available || !keys.ref, placeholder: key.configured ? '••••••••' : '', onChange: (event) => setDraft(event.target.value) }),
      React.createElement('button', { type: 'button', style: { flex: '0 0 auto', whiteSpace: 'nowrap' }, disabled: disabled || !key.available || !draft.trim(), onClick: save }, t('저장', 'Save'))),
    React.createElement('small', { role: 'status', style: { opacity: 0.7 } }, status),
    message ? React.createElement('small', { role: 'alert' }, message) : null)
}

const VOICE_LINES = [
  ['reactions', '반응 (인사·시작·완료·오류)', 'Reactions (greeting, start, done, error)'],
  ['status', '도구 사용 상태', 'Tool status'],
  ['mutters', '혼잣말 (추론 요약이 섞일 수 있음)', 'Mutters (may include reasoning summaries)'],
  ['others', '그 밖의 대사 (터치 반응 등)', 'Other lines (touch reactions, …)'],
]

const groupStyle = { display: 'grid', gap: 10, borderTop: '1px dashed rgba(127,127,127,.2)', paddingTop: 10 }
const groupTitleStyle = { fontSize: '0.85em', fontWeight: 600, opacity: 0.75 }
const toggleRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }

// 소제목과 구분선으로 묶은 한 덩어리.
function ttsGroup(title, ...children) {
  return React.createElement('div', { role: 'group', 'aria-label': title, style: groupStyle },
    React.createElement('span', { style: groupTitleStyle }, title), ...children)
}

function TtsSection({ form, keys, ko, writable, tts }) {
  const [error, setError] = React.useState('')
  const t = (k, e) => (ko ? k : e)
  const v = tts ?? {}, openai = v.openai ?? {}
  const off = !writable || typeof form.mutate !== 'function'
  const write = async (path, value) => {
    setError('')
    try {
      if (await form.mutate([{ op: 'set', path: ['tts', ...path], value }])) return ''
    } catch {}
    const failed = t('설정을 저장하지 못했습니다.', 'Could not save settings.')
    setError(failed)
    return failed
  }
  const text = (path, label, extra = {}) => React.createElement(TtsField, { key: path.join('.'), label, disabled: off, commit: (draft) => write(path, draft.trim()), ...extra })
  const json = (path, label, value, placeholder, hint) => text(path, label, {
    multiline: true, placeholder, hint, value: value && Object.keys(value).length ? JSON.stringify(value, null, 2) : '',
    commit: (draft) => { const parsed = parseJsonObject(draft, ko); return parsed.error ? parsed.error : write(path, parsed.value) },
  })
  const number = (path, label, value, min, extra = {}) => text(path, label, {
    type: 'number', min, max: extra.max, step: 1, value: value === undefined ? '' : String(value), ...extra,
    commit: (draft) => { const n = Number(draft); return Number.isInteger(n) && n >= min && n <= (extra.max ?? Infinity) ? write(path, n) : t(min + '~' + extra.max + ' 범위의 정수를 넣어 주세요.', 'Enter a whole number from ' + min + ' to ' + extra.max + '.') },
  })
  // 화면에서는 초, 저장은 ms.
  const seconds = (path, label, ms) => text(path, label, {
    type: 'number', min: 1, max: 600, step: 0.001, value: ms === undefined ? '' : String(ms / 1000),
    commit: (draft) => { const n = Number(draft); return Number.isFinite(n) && n >= 1 && n <= 600 ? write(path, Math.round(n * 1000)) : t('1~600초로 넣어 주세요.', 'Enter 1 to 600 seconds.') },
  })
  const check = (path, label, checked) => React.createElement('label', { key: path.join('.'), style: toggleRow },
    React.createElement('span', null, label),
    React.createElement('input', { type: 'checkbox', checked, disabled: off, onChange: (event) => write(path, event.target.checked) }))
  const serverDefault = t('비우면 서버 기본값', 'Empty = server default')
  return React.createElement('section', { 'aria-label': t('말풍선 음성', 'Speech bubble voice'), style: sectionStyle },
    React.createElement('div', { style: toggleRow },
      React.createElement('strong', null, t('말풍선 음성', 'Speech bubble voice')),
      React.createElement('input', { type: 'checkbox', 'aria-label': t('말풍선을 소리 내어 읽기', 'Read speech bubbles aloud'), checked: v.enabled === true, disabled: off, onChange: (event) => write(['enabled'], event.target.checked) })),
    v.enabled === true && !openai.baseUrl ? React.createElement('p', { role: 'status', style: { margin: 0 } }, t('API 주소를 넣어야 소리가 납니다.', 'Enter an API address to hear speech.')) : null,
    ttsGroup(t('연결', 'Connection'),
      text(['openai', 'baseUrl'], t('API 주소', 'API address'), { value: openai.baseUrl, placeholder: 'https://api.openai.com/v1', hint: t('/v1까지 입력 (OpenAI 호환 TTS)', 'Up to /v1 (OpenAI-compatible TTS)') }),
      React.createElement(TtsKeyField, { key: 'key', keys, ko, disabled: off })),
    ttsGroup(t('목소리', 'Voice'),
      text(['openai', 'model'], t('모델', 'Model'), { value: openai.model, placeholder: serverDefault }),
      text(['openai', 'voice'], t('목소리 ID', 'Voice ID'), { value: openai.voice, placeholder: serverDefault }),
      number(['stream', 'pcmSampleRate'], t('샘플레이트 (Hz)', 'Sample rate (Hz)'), v.stream?.pcmSampleRate, 8000, { max: 48000, hint: t('서버가 보내는 오디오와 같아야 함 (OpenAI 24000 · Fish 44100)', 'Must match the audio the server sends (OpenAI 24000 · Fish 44100)') })),
    ttsGroup(t('읽을 대사', 'Lines to read'),
      ...VOICE_LINES.map(([field, koLabel, enLabel]) => check(['voiceLines', field], ko ? koLabel : enLabel, v.voiceLines?.[field] === true))),
    React.createElement('details', { style: groupStyle },
      React.createElement('summary', { style: groupTitleStyle }, t('고급', 'Advanced')),
      React.createElement('div', { style: { display: 'grid', gap: 10, paddingTop: 4 } },
        json(['openai', 'extraBody'], t('추가 요청 값 (JSON)', 'Extra request values (JSON)'), openai.extraBody, '{ "speed": 1.1 }',
          t('요청 본문에 합쳐집니다. input·response_format·stream_format은 플러그인이 정하고, 위 모델·목소리 ID가 우선합니다.', 'Merged into the request body. The plugin sets input, response_format and stream_format; the model and voice ID above win.')),
        json(['openai', 'headers'], t('추가 헤더 (JSON)', 'Extra headers (JSON)'), openai.headers, '{ "X-Example": "value" }'),
        text(['openai', 'textPrefix'], t('대사 앞 문구', 'Line prefix'), { value: openai.textPrefix, placeholder: '[밝고 장난스럽게] ', hint: t('모든 대사 앞에 붙습니다 (예: Drama 3 연기 지시)', 'Prepended to every line (e.g. Drama 3 directions)') }),
        seconds(['openai', 'timeoutMs'], t('응답 대기 시간 (초)', 'Response timeout (seconds)'), openai.timeoutMs),
        check(['cache', 'enabled'], t('같은 대사 다시 쓰기 (캐시)', 'Reuse audio for repeated lines (cache)'), v.cache?.enabled !== false),
        text(['openai', 'apiKeyEnv'], t('API 키 저장 이름', 'API key name'), { value: openai.apiKeyEnv ?? DEFAULT_KEY_REF, hint: t('저장된 키를 먼저 쓰고, 없으면 같은 이름의 환경변수를 씁니다. 비우면 인증 없이 요청합니다.', 'A saved key is used first, then the environment variable of the same name. Empty sends no authorization.') }))),
    React.createElement('p', { style: { margin: 0, opacity: 0.7 } }, t('AI가 만든 음성입니다. 켜면 대사가 위 주소로 전송되고, 서비스에 따라 요금이 나올 수 있습니다.', 'This is an AI-generated voice. When on, lines are sent to the address above, and the service may charge for them.')),
    error ? React.createElement('p', { role: 'alert' }, error) : null)
}

function updateSection(updater, ko) {
  const s = updater.getSnapshot()
  const t = (k, e) => (ko ? k : e)
  const versions = [s.current && t('현재 ' + s.current, 'Installed ' + s.current), s.latest && t('최신 ' + s.latest, 'Latest ' + s.latest)].filter(Boolean).join(' · ')
  const text = {
    unavailable: t('Harness 플러그인 관리자에 연결되지 않아 업데이트를 확인할 수 없습니다.', 'Plugin manager is unavailable, so updates cannot be checked.'),
    checking: t('업데이트를 확인하는 중입니다…', 'Checking for updates…'),
    current: t('최신 버전입니다.', 'You are up to date.'),
    available: t('새 버전이 있습니다.', 'A new version is available.'),
    confirm: t('업데이트하는 동안 이 플러그인이 잠시 꺼졌다가 새 버전으로 다시 켜집니다. 설정은 그대로 남습니다. 혹시 실패하면 Plugins의 + Add plugin에서 같은 GitHub 주소로 다시 추가하세요.',
      'The plugin turns off briefly and comes back as the new version. Settings are kept. If it fails, add the same GitHub address again from Plugins → + Add plugin.'),
    updating: t('업데이트하는 중입니다… 창을 닫지 마세요.', 'Updating… keep this window open.'),
    updated: t('업데이트했습니다.' + (s.from ? ' (' + s.from + ' → ' + (s.current || s.latest) + ')' : ''), 'Updated.' + (s.from ? ' (' + s.from + ' → ' + (s.current || s.latest) + ')' : '')),
    restart: t('업데이트했습니다. Harness를 다시 시작하면 새 버전이 적용됩니다.', 'Updated. Restart Harness to use the new version.'),
    unsupported: t('GitHub 주소로 설치한 경우에만 여기서 업데이트할 수 있습니다.', 'Updates here work only for plugins installed from a GitHub address.'),
    pinned: t('특정 커밋에 고정해 설치해서 여기서는 업데이트하지 않습니다.', 'This install is pinned to a commit, so it is not updated here.'),
    'check-failed': t('업데이트를 확인하지 못했습니다.', 'Could not check for updates.'),
    'update-failed': t('업데이트하지 못했습니다.', 'Update failed.'),
  }[s.phase] ?? ''
  const busy = s.phase === 'checking' || s.phase === 'updating'
  const button = (label, onClick, disabled) => React.createElement('button', { type: 'button', onClick, disabled }, label)
  return React.createElement('section', { 'aria-label': t('업데이트', 'Updates'), style: { display: 'grid', gap: 8, paddingTop: 12, borderTop: '1px solid #8881' } },
    React.createElement('strong', null, t('업데이트', 'Updates')),
    versions ? React.createElement('span', { style: { opacity: 0.7 } }, versions) : null,
    React.createElement('p', { role: 'status', style: { margin: 0 } }, text, s.error ? ' (' + s.error + ')' : ''),
    React.createElement('div', { style: { display: 'flex', gap: 8 } },
      s.phase === 'available' ? button(t('업데이트', 'Update'), () => updater.update(), busy) : null,
      s.phase === 'confirm' ? button(t('계속', 'Continue'), () => updater.confirm(), false) : null,
      s.phase === 'confirm' ? button(t('취소', 'Cancel'), () => updater.cancel(), false) : null,
      !['unavailable', 'updated', 'restart', 'confirm', 'updating'].includes(s.phase)
        ? button(t('다시 확인', 'Check again'), () => updater.check(), busy) : null))
}

// 단축키 입력 칸: 칸을 눌러 두면 누른 키 조합을 그대로 저장한다. Esc 취소 · Backspace/Delete 지우기 · Tab은 포커스 이동.
function ShortcutField({ label, control, hintId, hint, value, placeholder, ariaLabel, ko, disabled, inactive, onChange }) {
  const [recording, setRecording] = React.useState(false)
  const [held, setHeld] = React.useState('')
  const capture = (event) => {
    const action = shortcutKeyDown(event)
    const stop = () => { setRecording(false); setHeld('') }
    if (action.action === 'leave') { stop(); return }
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget
    if (action.action === 'cancel') { stop(); target.blur(); return }
    if (action.action === 'clear') { stop(); void onChange(''); target.blur(); return }
    if (action.action === 'wait') { setHeld(action.held); return }
    stop(); void onChange(action.combo); target.blur()
  }
  return React.createElement(React.Fragment, null,
    React.createElement(control ? 'div' : 'label', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, rowGap: 8 } },
      React.createElement('span', { style: { opacity: inactive ? 0.55 : 1 } }, label),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' } },
        control ?? null,
        React.createElement('input', {
          type: 'text',
          readOnly: true,
          'aria-label': ariaLabel,
          'aria-describedby': hintId,
          placeholder: recording ? (ko ? '키를 누르세요…' : 'Press keys…') : placeholder,
          style: { width: 150, cursor: disabled ? 'default' : 'pointer', textAlign: 'center', borderColor: recording ? '#7aa7ff' : undefined, opacity: inactive ? 0.45 : 1 },
          value: recording ? held : (value ?? ''),
          disabled,
          onFocus: () => { if (disabled) return; setRecording(true); setHeld('') },
          onBlur: () => { setRecording(false); setHeld('') },
          onKeyDown: capture,
        }))),
    hint ? React.createElement('p', { id: hintId, style: { margin: 0, opacity: inactive ? 0.45 : 0.7 } }, hint) : null)
}

// 이동 키 입력 칸: 수식 키 하나 또는 일반 키 하나를 그대로 등록한다. Esc 취소 · Backspace/Delete 지우기 · Tab은 포커스 이동.
function DragKeyField({ label, hintId, hint, value, ariaLabel, ko, disabled, inactive, onChange }) {
  const [recording, setRecording] = React.useState(false)
  const [held, setHeld] = React.useState('')
  const stop = () => { setRecording(false); setHeld('') }
  const capture = (event) => {
    const action = dragKeyDown(event)
    if (action.action === 'leave') { stop(); return }
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget
    if (action.action === 'cancel') { stop(); target.blur(); return }
    if (action.action === 'clear') { stop(); void onChange(''); target.blur(); return }
    if (action.action === 'wait') { setHeld(action.held); return }
    stop(); void onChange(action.key); target.blur()
  }
  const release = (event) => {   // 수식 키는 떼는 순간 저장 (다른 키와 조합하지 않는 단일 키)
    const modifier = MODIFIER_LABELS.get(event.key)
    if (!modifier || !recording) return
    stop(); void onChange(modifier); event.currentTarget.blur()
  }
  return React.createElement(React.Fragment, null,
    React.createElement('label', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, rowGap: 8 } },
      React.createElement('span', { style: { opacity: inactive ? 0.55 : 1 } }, label),
      React.createElement('input', {
        type: 'text',
        readOnly: true,
        'aria-label': ariaLabel,
        'aria-describedby': hintId,
        placeholder: recording ? (ko ? '키를 누르세요…' : 'Press a key…') : '',
        style: { width: 150, cursor: disabled ? 'default' : 'pointer', textAlign: 'center', borderColor: recording ? '#7aa7ff' : undefined, opacity: inactive ? 0.45 : 1 },
        value: recording ? held : (value ?? ''),
        disabled,
        onFocus: () => { if (disabled) return; setRecording(true); setHeld('') },
        onBlur: () => { setRecording(false); setHeld('') },
        onKeyDown: capture,
        onKeyUp: release,
      })),
    React.createElement('p', { id: hintId, style: { margin: 0, opacity: inactive ? 0.45 : 0.7 } }, hint))
}

// 캔버스만 숨김 상태를 설정 화면에도 보여 준다 — 설정(캐릭터와 말풍선)이 꺼진 것과 혼동하지 않게.
function CanvasHiddenNotice({ ko }) {
  const read = () => (typeof window !== 'undefined' && window.__dscCanvasHidden?.() === true)
  const [hidden, setHidden] = React.useState(read)
  React.useEffect(() => {
    const id = setInterval(() => setHidden(read()), 600)
    return () => clearInterval(id)
  }, [])
  if (!hidden) return null
  return React.createElement('div', { role: 'status', style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, opacity: 0.9 } },
    React.createElement('span', null, ko ? '지금 캔버스가 숨겨져 있습니다(캐릭터 설정은 켜져 있음).' : 'The canvas is hidden right now (the character setting is still on).'),
    React.createElement('button', { type: 'button', onClick: () => { try { window.__dscCanvasToggle?.() } catch {} setHidden(false) } },
      ko ? '다시 표시' : 'Show again'))
}

function settingsPage(ctx, form, updater, keys) {
  return function FeatureSettings({ view }) {
    const state = React.useSyncExternalStore((fn) => form.subscribe(fn), () => form.getSnapshot(), () => form.getSnapshot())
    const locale = React.useSyncExternalStore((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getLocale(), () => ctx.locale.getLocale())
    React.useSyncExternalStore((fn) => updater.subscribe(fn), () => updater.getSnapshot(), () => updater.getSnapshot())
    const [error, setError] = React.useState('')
    const [pending, setPending] = React.useState(false)
    const ko = locale.active.toLowerCase().startsWith('ko')
    if (view === 'summary') return React.createElement('span', null, ko ? '캐릭터 · 테마 · 한국어' : 'Character · Theme · Korean')
    if (state.status !== 'ready') return React.createElement('p', { role: 'status' }, ko ? '설정을 불러오는 중입니다.' : 'Loading settings…')
    const fields = [
      ['character', ko ? '캐릭터와 말풍선' : 'Character and speech bubbles'],
      ['mobileCharacter', ko ? '모바일에서도 캐릭터 표시' : 'Show character on mobile'],
      ['intro', ko ? '시작할 때 등장 연출' : 'Intro on startup'],
      ['appIcon', ko ? '앱 바로가기 아이콘 (Windows)' : 'App shortcut icon (Windows)'],
      ['theme', ko ? '파스텔 테마' : 'Pastel theme'],
      ['translation', ko ? '한국어 언어팩' : 'Korean language pack'],
    ]
    const change = async (field, checked) => {
      const current = form.getSnapshot()
      if (current.status !== 'ready' || !current.writable) return
      setError(''); setPending(true)
      try {
        if (!await form.set(field, checked)) setError(ko ? '설정을 저장하지 못했습니다.' : 'Could not save settings.')
      } catch { setError(ko ? '설정을 저장하지 못했습니다.' : 'Could not save settings.') }
      finally { setPending(false) }
    }
    const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }
    const off = !state.writable || pending
    const outfitSwitch = ([field, label]) => React.createElement('label', { key: field, style: row },
      React.createElement('span', null, label),
      React.createElement('input', { type: 'checkbox', checked: state.value?.[field] === true, disabled: off, onChange: (event) => change(field, event.target.checked) }))
    const bodyType = state.value?.bodyType || 'default'
    const shortcutValue = state.value?.characterToggleKey ?? 'Ctrl+Shift+D'
    const petShortcutValue = state.value?.petToggleKey ?? 'Ctrl+Shift+P'
    const characterOn = state.value?.character !== false
    const canvasToggle = state.value?.canvasToggle === true
    const canvasKeyValue = state.value?.canvasToggleKey ?? 'Ctrl+Shift+H'
    const dragKey = state.value?.dragKey ?? 'Alt'
    return React.createElement('div', { style: { display: 'grid', gap: 16 } },
      ...fields.map(([field, label]) => React.createElement('label', { key: field, style: row },
        React.createElement('span', null, label),
        React.createElement('input', { type: 'checkbox', role: 'switch', checked: state.value?.[field] !== false, disabled: off, onChange: (event) => change(field, event.target.checked) }))),
      React.createElement('p', { style: { opacity: 0.7 } }, ko ? '변경 사항은 바로 적용되고 저장됩니다. 한국어는 Settings → General → Language에서 선택할 수 있습니다.' : 'Changes apply and save immediately. Select Korean under Settings → General → Language.'),
      React.createElement('section', { 'aria-label': ko ? '소품·옷' : 'Accessories and outfit', style: { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 } },
        React.createElement('strong', null, ko ? '소품·옷' : 'Accessories and outfit'),
        ...OUTFIT_FIELDS.map(([field, koLabel, enLabel]) => outfitSwitch([field, ko ? koLabel : enLabel]))),
      React.createElement('section', { 'aria-label': ko ? '체형' : 'Body type', style: { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 } },
        React.createElement('strong', null, ko ? '체형' : 'Body type'),
        ...BODY_TYPES.map(([value, koLabel, enLabel]) => React.createElement('label', { key: value, style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('input', { type: 'radio', name: 'deepseek-harness-kr-body', checked: bodyType === value, disabled: off, onChange: () => change('bodyType', value) }),
          React.createElement('span', null, ko ? koLabel : enLabel)))),
      React.createElement('section', { 'aria-label': ko ? '절전' : 'Power saving', style: { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 } },
        React.createElement('strong', null, ko ? '절전' : 'Power saving'),
        React.createElement('label', { style: row },
          React.createElement('span', null, ko ? '입력이 없으면 잠시 쉬기 (화면 밖으로 나가 렌더링을 멈춤)' : 'Rest when idle (leaves the screen and stops rendering)'),
          React.createElement('input', { type: 'checkbox', role: 'switch', checked: state.value?.idleSleep !== false, disabled: off, onChange: (event) => change('idleSleep', event.target.checked) })),
        React.createElement('label', { style: row },
          React.createElement('span', null, ko ? '쉬기 전 대기 시간 (분)' : 'Idle minutes before resting'),
          React.createElement('input', { type: 'number', min: 0.5, max: 60, step: 0.5, style: { width: 90 }, value: sleepMinutes(state.value?.idleSleepMinutes), disabled: off, onChange: (event) => change('idleSleepMinutes', sleepMinutes(event.target.value)) }))),
      React.createElement('section', { 'aria-label': ko ? '단축키 - 캐릭터와 말풍선' : 'Shortcuts - Character and speech bubbles', style: { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 } },
        React.createElement('strong', null, ko ? '단축키 - 캐릭터와 말풍선' : 'Shortcuts - Character and speech bubbles'),
        React.createElement('p', { id: SHORTCUT_HINT_ID, style: { margin: 0, opacity: 0.7 } },
          ko ? '칸을 누른 뒤 원하는 키 조합을 그대로 누르면 등록됩니다. Esc 취소, Backspace로 지우기'
            : 'Click the field, then press the keys you want. Esc cancels, Backspace clears.'),
        React.createElement(ShortcutField, {
          label: ko ? '캐릭터와 말풍선 설정 토글 단축키 (비우면 사용 안 함)' : 'Character and speech bubbles setting toggle shortcut (empty to disable)',
          hintId: characterOn ? SHORTCUT_HINT_ID : SHORTCUT_HINT_ID + '-off',   // 꺼짐 안내는 별도 id (문서에 같은 id 두 개 금지)
          hint: characterOn ? '' : (ko ? '캐릭터와 말풍선이 꺼져 있어도 이 단축키로 다시 켤 수 있습니다.' : 'This shortcut still turns the character back on while it is off.'),
          value: shortcutValue,
          placeholder: 'Ctrl+Shift+D',
          ariaLabel: ko ? '캐릭터와 말풍선 설정 토글 단축키 입력' : 'Record character and speech bubbles toggle shortcut',
          ko, disabled: off,
          onChange: (combo) => change('characterToggleKey', combo),
        }),
        React.createElement(DragKeyField, {
          label: ko ? '캐릭터 이동 키 (누른 채 끌기)' : 'Move character key (hold while dragging)',
          hintId: DRAG_HINT_ID,
          hint: !characterOn
            ? (ko ? '캐릭터와 말풍선이 꺼져 있을 때는 사용할 수 없습니다.' : 'Unavailable while the character and speech bubbles are off.')
            : (ko ? '캐릭터를 집어 옮길 때 누르고 있어야 하는 키입니다. 수식 키(Alt·Ctrl·Shift·Cmd) 하나 또는 일반 키 하나를 등록합니다. 비우면 좌우 버튼을 함께 눌러야 합니다.'
              : 'Hold this key while dragging to move the character. Record one modifier (Alt, Ctrl, Shift, Cmd) or one other key. Empty needs both buttons.'),
          value: dragKey,
          ariaLabel: ko ? '캐릭터 이동 키 입력' : 'Record drag key',
          ko, disabled: off || !characterOn, inactive: !characterOn,
          onChange: (key) => change('dragKey', key),
        }),
        // 캔버스만 숨김/표시: 캐릭터 설정을 끄는 것이 아니라 그리기만 멈춘다. 스위치를 단축키 칸 바로 왼쪽에 둔다.
        React.createElement(ShortcutField, {
          label: ko ? '캔버스만 숨김/표시 단축키 (비우면 사용 안 함)' : 'Hide/show canvas shortcut (empty to disable)',
          control: React.createElement('input', {
            type: 'checkbox', role: 'switch',
            'aria-label': ko ? '캔버스만 숨김/표시 사용' : 'Enable canvas hide/show',
            checked: canvasToggle,
            disabled: off || !characterOn,
            onChange: (event) => change('canvasToggle', event.target.checked),
          }),
          hintId: CANVAS_HINT_ID,
          hint: !characterOn
            ? (ko ? '캐릭터와 말풍선이 꺼져 있을 때는 사용할 수 없습니다. 캐릭터를 켜면 다시 쓸 수 있습니다.'
              : 'Unavailable while the character and speech bubbles are off. Turn the character on to use it again.')
            : (ko ? '왼쪽 스위치는 이 단축키를 켜고 끕니다. 단축키는 캐릭터와 말풍선 설정을 끄는 것이 아니라, 캔버스만 잠시 숨기고 다시 표시합니다(그리기만 멈춤).'
              : 'The switch enables this shortcut. The shortcut does not turn the character or speech-bubble setting off; it only hides and shows the canvas by pausing drawing.'),
          value: canvasKeyValue,
          placeholder: 'Ctrl+Shift+H',
          ariaLabel: ko ? '캔버스 숨김/표시 단축키 입력' : 'Record canvas hide/show shortcut',
          ko, disabled: off || !canvasToggle || !characterOn, inactive: !canvasToggle || !characterOn,
          onChange: (combo) => change('canvasToggleKey', combo),
        }),
        React.createElement(CanvasHiddenNotice, { ko }),
        React.createElement(ShortcutField, {
          label: ko ? '펫 창 내보내기·돌아오기 단축키 (비우면 사용 안 함)' : 'Pet window shortcut (empty to disable)',
          hintId: PET_SHORTCUT_HINT_ID,
          hint: !characterOn
            ? (ko ? '캐릭터와 말풍선이 꺼져 있을 때는 사용할 수 없습니다.' : 'Unavailable while the character and speech bubbles are off.')
            : (ko ? '캐릭터를 바깥 펫 창으로 내보내고 다시 불러옵니다.'
              : 'Moves the character out to the pet window and back.'),
          value: petShortcutValue,
          placeholder: 'Ctrl+Shift+P',
          ariaLabel: ko ? '펫 창 단축키 입력' : 'Record pet window shortcut',
          ko, disabled: off || !characterOn, inactive: !characterOn,
          onChange: (combo) => change('petToggleKey', combo),
        })),
      error ? React.createElement('p', { role: 'alert' }, error) : null,
      React.createElement(TtsSection, { form, keys, ko, writable: state.writable, tts: state.value?.tts }),
      updateSection(updater, ko))
  }
}

function apply(ctx) {
  window[SLOT]?.()
  const life = createLifetime()
  const features = new Map()
  const reconcile = (name, enabled, mount) => {
    if (enabled === features.has(name)) return
    if (!enabled) { features.get(name).dispose(); features.delete(name); return }
    const feature = createLifetime()
    features.set(name, feature)
    try { mount(feature) } catch (error) { feature.dispose(); features.delete(name); throw error }
  }
  life.add(() => { for (const feature of [...features.values()].reverse()) feature.dispose(); features.clear() })
  const dispose = () => {
    if (window[SLOT] !== dispose) return
    life.dispose()
    delete window[SLOT]
  }
  window[SLOT] = dispose
  ctx.effect(() => dispose, 'deepseek-harness-kr: client')
  try {
    const form = ctx.configForms.get(ENTRY_ID)
    const updater = createUpdater()
    const keys = createKeyStore()
    // 바깥 펫 창의 우클릭 메뉴·설정 패널이 보내는 값을 설정에 반영한다. 이 플러그인이 아는 키만 받는다.
    const PET_CONFIG_KEYS = new Set([...OUTFIT_FIELDS.map(([field]) => field), 'bodyType', 'character'])
    const applyPetConfig = (key, value) => {
      if (typeof key !== 'string' || !PET_CONFIG_KEYS.has(key)) return
      const next = key === 'bodyType'
        ? (BODY_TYPES.some(([type]) => type === value) ? value : null)
        : (typeof value === 'boolean' ? value : null)
      if (next === null) return
      try {
        const result = form.set(key, next)
        if (result && typeof result.catch === 'function') result.catch(() => {})
      } catch {}
    }
    window.__dscSetConfig = applyPetConfig
    life.add(() => { if (window.__dscSetConfig === applyPetConfig) delete window.__dscSetConfig })
    // 플러그인 관리자는 선택적으로 연결: 없어도 캐릭터·테마·번역은 그대로 동작한다.
    if (typeof ctx.inject === 'function') {
      ctx.inject(['remote', 'remote.pluginManager'], (scope) => {
        updater.attach(scope.remote.pluginManager)
        scope.effect(() => () => updater.detach(), 'deepseek-harness-kr: updater')
      })
      // 음성 API 키 저장소도 선택적: 없으면 키 칸만 비활성화된다.
      ctx.inject(['remote', 'remote.credentials'], (scope) => {
        keys.attach(scope.remote.credentials)
        const off = typeof scope.remote.$on === 'function' ? scope.remote.$on('credentials/reference-updated', (ref) => keys.changed(ref)) : null
        scope.effect(() => () => { off?.(); keys.detach() }, 'deepseek-harness-kr: voice key')
      })
    }
    life.add(() => updater.detach())
    life.add(() => keys.detach())
    let ttsKey = null
    const syncTts = (value) => {
      const next = ttsSignature(value)
      if (next === ttsKey) return
      ttsKey = next
      reconcile('tts', false)
      if (next !== null) reconcile('tts', true, mountTts)
    }
    const sync = () => {
      const snapshot = form.getSnapshot()
      if (snapshot.status !== 'ready') return
      const value = snapshot.value ?? {}
      reconcile('translation', value.translation !== false, (feature) => mountTranslation(ctx, feature))
      reconcile('layout', value.character !== false || value.theme !== false, mountLayout)
      reconcile('theme', value.theme !== false, (feature) => mountTheme(ctx, feature))
      reconcile('character', value.character !== false, startCharacter)
      // 캐릭터는 매 프레임 이 값을 읽어 소품·옷·체형을 바로 바꾼다 (다시 띄우지 않음)
      window.__dscOutfit = Object.fromEntries([...OUTFIT_FIELDS.map(([field]) => [field, value[field] === true]), ['bodyType', value.bodyType || 'default']])
      keys.setRef(value.tts?.openai?.apiKeyEnv ?? DEFAULT_KEY_REF)
      syncTts(value)
      // 절전 설정도 실시간으로 전달 (캐릭터의 상태 감시 인터벌이 읽음)
      window.__dscSleep = { enabled: value.idleSleep !== false, minutes: sleepMinutes(value.idleSleepMinutes) }
      // 시작 등장 연출 여부: 캐릭터가 처음 뜰 때 읽는다 (끄면 가운데 인사 없이 바로 제자리에)
      window.__dscIntro = { enabled: value.intro !== false }
      // 모바일(터치 전용) 화면에서 캐릭터를 숨길지: 캐릭터가 매 프레임 읽는다 (기본 표시)
      window.__dscMobile = { enabled: value.mobileCharacter !== false }
      // 캐릭터 이동 보조 키: 캐릭터가 포인터 이벤트마다 읽는다 (다시 띄우지 않음). 빈 문자열이면 '이동 키 없음'.
      window.__dscDrag = { key: value.dragKey ?? 'Alt' }
      // 캔버스 숨김 기능을 끄면 숨겨 둔 캔버스를 다시 표시 (기능을 되돌렸을 때)
      if (value.canvasToggle !== true && window.__dscCanvasHidden?.() === true) window.__dscCanvasToggle?.()
    }
    life.add(() => { delete window.__dscOutfit; delete window.__dscSleep; delete window.__dscIntro; delete window.__dscMobile; delete window.__dscDrag })
    life.add(form.subscribe(sync))
    // 단축키로 캐릭터 토글: 설정의 character 스위치를 뒤집는다 (설정 화면과 같은 저장소·같은 마운트/정리 경로)
    // 키를 떼는 이벤트를 놓쳐도 다음 누름이 막히지 않도록, 누른 시각 기준으로만 연타를 막는다.
    let lastToggleAt = -Infinity, togglePending = false
    const toggleListener = async (event) => {
      if (event.repeat) return
      const snapshot = form.getSnapshot()
      const combo = snapshot.value?.characterToggleKey ?? 'Ctrl+Shift+D'
      if (!parseShortcut(combo)) return
      // 텍스트 입력 중엔 발동하지 않게 (글자를 지우는 Shift+화살표 같은 조합 보호)
      const el = event.target
      if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return
      if (!matchesShortcut(combo, event)) return
      event.preventDefault()
      if (togglePending || snapshot.status !== 'ready' || !snapshot.writable) return
      const now = Number(event.timeStamp) || performance.now()
      if (now - lastToggleAt < 150) return
      lastToggleAt = now
      togglePending = true
      try {
        if (!await form.set('character', snapshot.value?.character === false)) console.warn('캐릭터 설정 저장 실패')
      } catch { console.warn('캐릭터 설정 저장 실패') }
      finally { togglePending = false }
    }
    life.listen(window, 'keydown', toggleListener)
    // 단축키로 바깥 펫 창으로 내보내기·돌아오기 (창 안 캐릭터가 노출한 토글을 부른다)
    let lastPetToggleAt = -Infinity
    const petToggleListener = (event) => {
      if (event.repeat) return
      const snapshot = form.getSnapshot()
      const combo = snapshot.value?.petToggleKey ?? 'Ctrl+Shift+P'
      const toggle = window.__dscPetToggle
      if (!toggle || !parseShortcut(combo)) return
      // 텍스트 입력 중엔 발동하지 않게 (글자를 지우는 Shift+화살표 같은 조합 보호)
      const el = event.target
      if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return
      if (!matchesShortcut(combo, event)) return
      event.preventDefault()
      if (snapshot.status !== 'ready') return
      const now = Number(event.timeStamp) || performance.now()
      if (now - lastPetToggleAt < 150) return
      lastPetToggleAt = now
      try { toggle() } catch { console.warn('펫 창 토글 실패') }
    }
    life.listen(window, 'keydown', petToggleListener)
    // 캔버스만 숨김/표시 단축키: 설정에서 켠 사람만 동작한다. 입력창에 포커스가 있어도 수식 키 조합이면 실행한다(글자를 쓰지 않음).
    // 키를 떼는 이벤트(keyup)를 놓쳐도 다음 누름이 막히지 않도록, 누른 시각 기준으로만 연타를 막는다.
    let lastCanvasToggleAt = -Infinity
    const canvasToggleListener = (event) => {
      if (event.repeat) return
      const snapshot = form.getSnapshot()
      if (snapshot.status !== 'ready' || snapshot.value?.canvasToggle !== true) return
      const combo = snapshot.value?.canvasToggleKey ?? 'Ctrl+Shift+H'
      const toggle = window.__dscCanvasToggle
      const parsed = parseShortcut(combo)
      if (!toggle || !parsed) return
      if (!matchesShortcut(combo, event)) return
      const el = event.target
      const inInput = el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))
      if (inInput && !(parsed.ctrl || parsed.alt || parsed.meta)) return
      event.preventDefault()
      const now = Number(event.timeStamp) || performance.now()
      if (now - lastCanvasToggleAt < 150) return   // 같은 누름의 중복/아주 빠른 연타만 무시
      lastCanvasToggleAt = now
      try { toggle() } catch { console.warn('캔버스 숨김 토글 실패') }
    }
    life.listen(window, 'keydown', canvasToggleListener)
    life.add(ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
      name: 'plugins.row.config', key: PLUGIN_ID + '#' + ENTRY_ID,
    }, settingsPage(ctx, form, updater, keys))))
    sync()
  } catch (error) { dispose(); throw error }
}

exports.inject = ['locale', 'theme', 'configForms', 'slots']
exports.apply = apply
// 테스트용
exports.internals = { githubSource, compareVersions, createUpdater, createKeyStore, ttsSignature, parseJsonObject, parseShortcut, shortcutFromEvent, shortcutKeyDown, dragKeyDown, matchesShortcut }
