import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// 패키지 tarball(npm pack, git 의존성 설치)에 실제로 무엇이 들어가는지 검사한다.
// npm은 files 화이트리스트 밖의 파일을 tarball에서 빼므로, 엔트리에서 상대 import로
// 도달하는 파일이 목록에 없으면 설치본이 ERR_MODULE_NOT_FOUND로 죽는다(이슈 #18).
const root = fileURLToPath(new URL('../../', import.meta.url))

// npm은 files 목록과 무관하게 package.json을 항상 넣는다(README/LICENSE도 마찬가지).
const alwaysIncluded = new Set(['package.json'])

const posix = (path) => path.split(sep).join('/')
const stripDot = (path) => path.replace(/^\.\//, '')

/** files 항목 하나가 패키지 기준 상대 경로를 덮는지. 디렉터리(`assets/`)와 정확한 파일을 모두 처리한다. */
export function isListed(relPath, files) {
  const target = posix(stripDot(relPath))
  return files.some((item) => {
    const entry = posix(stripDot(String(item)))
    if (!entry) return false
    if (entry.endsWith('/')) return target.startsWith(entry)
    if (!entry.includes('*')) return target === entry
    // npm files는 glob도 받는다. 검사에 필요한 만큼만 흉내 낸다.
    const pattern = entry
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '\u0000')
      .replace(/\*/g, '[^/]*')
      .replace(/\u0000/g, '.*')
    return new RegExp('^' + pattern + '$').test(target)
  })
}

// 정적 import/export만 본다. 동적 import()나 require는 이 저장소의 엔트리 경로에 없다.
const staticImport = /^[ \t]*(?:import|export)\b[^'"]*?['"](\.{1,2}\/[^'"]*)['"]/gm

async function relativeImports(file) {
  const source = await readFile(file, 'utf8')
  return [...source.matchAll(staticImport)].map((match) => match[1])
}

/** main과 exports가 가리키는 로컬 파일들(패키지 기준 상대 경로). */
function entryFiles(pkg) {
  const specs = []
  const visit = (value) => {
    if (typeof value === 'string') { if (value.startsWith('./')) specs.push(stripDot(value)); return }
    if (Array.isArray(value)) { for (const item of value) visit(item); return }
    if (value && typeof value === 'object') for (const child of Object.values(value)) visit(child)
  }
  visit(pkg.main)
  visit(pkg.exports)
  return [...new Set(specs.map((spec) => posix(spec)))]
}

/** 엔트리에서 상대 import를 따라 도달하는 모든 파일(패키지 기준 상대 경로). */
async function reachable(files) {
  const seen = new Set()
  const queue = [...entryFiles(JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')))]
  while (queue.length) {
    const rel = queue.shift()
    if (seen.has(rel)) continue
    seen.add(rel)
    if (rel === 'package.json') continue
    const absolute = resolve(root, rel)
    const info = await stat(absolute).catch(() => null)
    assert.ok(info?.isFile(), `패키지 엔트리가 가리키는 파일이 없습니다: ${rel}`)
    for (const specifier of await relativeImports(absolute)) {
      queue.push(posix(relative(root, resolve(dirname(absolute), specifier))))
    }
  }
  return seen
}

/** files 화이트리스트가 덮지 못하는 도달 파일 목록. */
async function missingFiles(files) {
  const reached = await reachable(files)
  return { reached, missing: [...reached].filter((rel) => !alwaysIncluded.has(rel) && !isListed(rel, files)) }
}

test('files 화이트리스트가 엔트리에서 도달하는 모든 상대 import를 덮는다', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  const files = pkg.files
  assert.ok(Array.isArray(files), 'package.json에 files 배열이 있어야 한다')
  const { reached, missing } = await missingFiles(files)
  assert.deepEqual(missing, [], `tarball에서 빠질 파일:\n${missing.join('\n')}`)
  // 이슈 #18: host.js가 정적으로 가져오는 파일들(재귀 포함)이 실제로 검사 대상인지 확인한다.
  for (const expected of [
    'plugin/host.js',
    'plugin/app-icon.js',
    'plugin/pet-host.js',
    'plugins/dsh-tts/src/config.js',
    'plugins/dsh-tts/src/index.js',
    'plugins/dsh-tts/src/host.js',
    'plugins/dsh-tts/src/cache.js',
  ]) assert.ok(reached.has(expected), `검사 그래프에 ${expected}가 없습니다`)
  // plugin/client.js는 번들 소스(build.mjs가 읽는다)라 import 그래프에는 안 잡히지만 같이 배포해야 한다.
  assert.ok(isListed('plugin/client.js', files), 'plugin/client.js가 files에 없습니다')
})

test('files에서 plugin/app-icon.js를 빼면 회귀를 잡는다', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  const broken = pkg.files.filter((item) => posix(stripDot(item)) !== 'plugin/app-icon.js')
  const { missing } = await missingFiles(broken)
  assert.deepEqual(missing, ['plugin/app-icon.js'])
})

test('화이트리스트 매칭: 디렉터리 항목과 정확한 파일 항목', () => {
  assert.equal(isListed('assets/dsc/dsc.js', ['assets/']), true)
  assert.equal(isListed('assets/app-icon.ico', ['assets/']), true)
  assert.equal(isListed('assets-other/app-icon.ico', ['assets/']), false)
  assert.equal(isListed('plugin/host.js', ['plugin/host.js']), true)
  assert.equal(isListed('./plugin/host.js', ['plugin/host.js']), true)
  assert.equal(isListed('plugin/app-icon.js', ['plugin/host.js']), false)
  assert.equal(isListed('plugin/host.js', ['plugin/']), true)
  assert.equal(isListed('plugin/host.js', []), false)
})
