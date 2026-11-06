import z from '@deepseek-ai/schemastery'
import { createReadStream } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import { extname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'
import { normalize as normalizeTts } from '../plugins/dsh-tts/src/config.js'
import { registerSpeechRoutes } from '../plugins/dsh-tts/src/index.js'
import { createPetHandler, createPetManager, PET_PATH } from './pet-host.js'
import { applyShortcutIcon } from './app-icon.js'

export const name = 'deepseek-harness-kr'
export const inject = ['webServer', 'connection']

// 말풍선 음성(TTS). 설정 화면이 쓰는 값은 모두 volatile이어야 한다(Settings는 volatile 필드만 쓴다).
// 값의 범위·형식 검사는 요청마다 dsh-tts normalize가 맡고, 잘못된 값은 /dsh-tts/state가 이유를 알려 준다.
const live = (schema) => schema.volatile()
export const TtsConfig = z.object({
  enabled: live(z.boolean().default(false)),
  openai: z.object({
    baseUrl: live(z.string().default('')),
    model: live(z.string().default('')),
    voice: live(z.string().default('')),
    // API 키 자체가 아니라 credentials 참조 이름. 저장된 키가 먼저, 없으면 같은 이름의 환경변수.
    apiKeyEnv: live(z.string().role('credential-ref').default('DSH_TTS_API_KEY')),
    extraBody: live(z.dict(z.any()).default({})),
    headers: live(z.dict(z.string()).default({})),
    textPrefix: live(z.string().default('')),
    timeoutMs: live(z.number().min(1000).max(600000).step(1).default(30000)),
  }),
  stream: z.object({
    pcmSampleRate: live(z.number().min(8000).max(48000).step(1).default(24000)),
  }),
  voiceLines: z.object({
    reactions: live(z.boolean().default(true)),
    status: live(z.boolean().default(false)),
    mutters: live(z.boolean().default(false)),
    others: live(z.boolean().default(true)),
  }),
  cache: z.object({
    enabled: live(z.boolean().default(true)),
  }),
})

// volatile 참조(.get())가 섞인 설정을 그 시점의 평범한 값으로 바꾼다.
export function readLive(value) {
  if (value && typeof value.get === 'function') return structuredClone(value.get())
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, readLive(child)]))
}

export const Config = z.object({
  character: z.boolean().default(true).volatile(),
  theme: z.boolean().default(true).volatile(),
  translation: z.boolean().default(true).volatile(),
  // 소품·옷·체형 (데스크톱 펫의 "소품·옷" 메뉴와 같은 항목)
  glasses: z.boolean().default(false).volatile(),
  monocle: z.boolean().default(false).volatile(),
  skirt: z.boolean().default(false).volatile(),
  chestClothes: z.boolean().default(false).volatile(),
  shoesOff: z.boolean().default(false).volatile(),
  tailHide: z.boolean().default(false).volatile(),
  bodyType: z.union([z.const('default'), z.const('type1'), z.const('type2')]).default('default').volatile(),
  tts: TtsConfig,
  // 시작할 때 가운데에서 크게 인사하는 등장 연출 (끄면 처음부터 제자리에 뜬다)
  intro: z.boolean().default(true).volatile(),
  // 모바일(터치 전용) 화면에서도 캐릭터를 보여 줄지 (기본 표시)
  mobileCharacter: z.boolean().default(true).volatile(),
  // 앱 바로가기 아이콘을 DeepSeek짱 아이콘으로 (Windows만, 창·작업 표시줄 아이콘은 해당 없음)
  appIcon: z.boolean().default(true).volatile(),
  // 절전: 입력이 없으면 캐릭터가 화면 밖으로 나가 렌더링을 멈춤
  idleSleep: z.boolean().default(true).volatile(),
  idleSleepMinutes: z.number().min(0.5).max(60).default(1).volatile(),
  // 캐릭터 토글 단축키 (비워 두면 단축키 없음). 예: "Ctrl+Shift+D", "Alt+C"
  characterToggleKey: z.string().default('Ctrl+Shift+D').volatile(),
  // 캐릭터를 집어 옮길 때 누르고 있어야 하는 키 하나 (수식 키 또는 일반 키). 비우면 예전처럼 왼쪽·오른쪽 버튼을 함께 눌러야 한다.
  dragKey: z.string().default('Alt').volatile(),
  // 바깥 펫 창으로 내보내기·돌아오기 단축키 (비워 두면 단축키 없음). 예: "Ctrl+Shift+P"
  petToggleKey: z.string().default('Ctrl+Shift+P').volatile(),
  // 캔버스만 숨김/표시: 캐릭터를 내리지 않고 그리기만 멈춰 즉시 전환한다. 성능 부담이 있어 기본 꺼짐(원하는 사람만 켬).
  canvasToggle: z.boolean().default(false).volatile(),
  // 캔버스 숨김/표시 단축키 (canvasToggle이 켜져 있을 때만 동작, 비우면 없음). 예: "Ctrl+Shift+H"
  canvasToggleKey: z.string().default('Ctrl+Shift+H').volatile(),
})
export const ASSET_PATH = '/deepseek-harness-kr/assets'
const assets = fileURLToPath(new URL('../assets/', import.meta.url))
const types = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.moc3': 'application/octet-stream' }

export function createAssetHandler(root = assets) {
  return async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return
    }
    try {
      // Decode before resolving; both lexical traversal and symlink escapes fail closed.
      const path = decodeURIComponent((req.url || '').split('?')[0])
      if (!path.startsWith(ASSET_PATH + '/')) { res.writeHead(404); res.end(); return }
      const suffix = path.slice(ASSET_PATH.length + 1)
      if (!suffix || suffix.includes('\\') || suffix.includes('\0')) { res.writeHead(404); res.end(); return }
      const base = await realpath(root)
      const target = await realpath(resolve(base, suffix))
      const rel = relative(base, target)
      if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) { res.writeHead(404); res.end(); return }
      const type = types[extname(target)]
      const info = await stat(target)
      if (!type || !info.isFile()) { res.writeHead(404); res.end(); return }
      // 자산 파일명은 고정이라, 캐시를 막아 두면 새로고침마다 무거운 자산을 통째로 다시 받는다.
      // 크기·수정시각으로 ETag를 만들고 If-None-Match와 같으면 304로 본문 없이 끝낸다.
      // 파일이 바뀌면 값도 바뀌므로 갱신은 그대로 반영된다.
      const etag = `"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`
      const validators = { 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff', etag }
      if (req.headers['if-none-match'] === etag) { res.writeHead(304, validators); res.end(); return }
      res.writeHead(200, { 'content-type': type, 'content-length': info.size, ...validators })
      if (req.method === 'HEAD') res.end()
      else await pipeline(createReadStream(target), res)
    } catch (error) {
      if (!res.headersSent) { res.writeHead(error instanceof URIError ? 400 : 404); res.end() }
      else if (!res.destroyed) res.destroy(error)
    }
  }
}

export function apply(ctx, config) {
  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: ASSET_PATH, handler: createAssetHandler() }), 'deepseek-harness-kr: assets')
  // 말풍선 음성: 설정 화면에서 바꾼 값(volatile)을 요청마다 다시 읽는다. 꺼져 있으면 404.
  registerSpeechRoutes(ctx, () => normalizeTts(readLive(config?.tts)))
  ctx.effect(() => {
    const pet = createPetManager({ assets })
    const rejection = (req) => { const c = ctx.connection; return typeof c?.requestRejection === 'function' ? c.requestRejection(req) : 503 }
    const unregister = ctx.webServer.register({ kind: 'prefix', path: PET_PATH, handler: createPetHandler(pet, rejection) })
    return () => { unregister?.(); pet.dispose() }
  }, 'deepseek-harness-kr: pet')
  // 앱 바로가기 아이콘(Windows): 켜면 시작할 때·플러그인 업데이트 후에 적용하고, 끄면 원래 아이콘으로 되돌린다.
  // 설정은 volatile이라 몇 초마다 확인해 바뀐 경우에만 실행한다(같은 값이면 아무 것도 하지 않음).
  ctx.effect(() => {
    let last = null, stopped = false
    const sync = () => {
      if (stopped) return
      const enabled = readLive(config?.appIcon) !== false
      if (enabled === last) return
      last = enabled
      applyShortcutIcon({ assetsDir: assets, enabled }).catch(() => {})
    }
    sync()
    const timer = setInterval(sync, 4000)
    timer.unref?.()
    return () => { stopped = true; clearInterval(timer) }
  }, 'deepseek-harness-kr: app icon')
}
