window.__ModuleLoader__.load({ id: "deepseek-harness-kr", factory: (require) => {
const module = { exports: {} }; const exports = module.exports;
const PLUGIN_ID = "deepseek-harness-kr";
const KOREAN_DICTIONARIES = {"common":{"ok":"확인","cancel":"취소","close":"닫기","copy":"복사","copied":"복사됨","codeBlock.title":"코드 블록","codeBlock.wrap":"자동 줄바꿈","codeBlock.unwrap":"자동 줄바꿈 해제","copy.failed":"복사 실패","copy.value":"값 복사","copy.json":"JSON 복사","copy.path":"속성 경로 복사","copy.prettyJson":"서식 있는 JSON 복사","copy.compactJson":"압축 JSON 복사","copy.optionsHint":"{action}; 오른쪽 클릭으로 복사 방식을 고를 수 있습니다","retry":"다시 시도","loading":"불러오는 중…","load.failed":"불러오기 실패","submit":"제출","submitting":"제출 중…","next":"다음","previous":"이전","skip":"건너뛰기","delete":"삭제","edit":"편집","save":"저장","search":"검색","more":"더 보기","collapse":"접기","expand":"펼치기","back":"뒤로","brand.localBuild":"DSH 로컬 빌드","workspace.defaultName":"기본 작업 공간","unknown":"알 수 없음","none":"없음","truncated":"잘림","json.label":"JSON","markdown.footnotes":"각주","markdown.truncatedCharacters":"… 잘림, 총 {total}자","number.thousand":"{value}K","number.million":"{value}M"},"settings.locale":{"language.title":"언어"},"settings.agentPreset":{"modeExplanation":"모드 설명","howToUse":"사용 방법","guideSections":"도움말","guideExampleTask":"예시 작업","guideCopy":"복사","guideCopied":"복사됨","guideFootnotes":"각주","guideStandardIntro":"새 작업을 만들 때 ‘표준 모드’를 고르고, 무엇을 끝내야 하는지, 관련 파일이 어디 있는지, 작업이 끝났는지 어떻게 판단할지를 적어 주세요.","guideStandardExplanation":"### 작동 방식\n\n에이전트가 도구를 직접 호출해 파일을 읽고 쓰고, 자료를 찾고, 터미널 명령을 실행합니다. 스킬, 계획, 목표, 하위 에이전트, 워크플로, 컨텍스트 압축 같은 기능이 포함됩니다.\n\n### 언제 고르나\n\n일상적인 프로그래밍, 파일 처리, 자료 정리는 여기서 시작하면 됩니다. 표준 모드도 스크립트를 작성하고 파일을 일괄 처리할 수 있습니다. PTC는 도구 호출 방식이 다를 뿐, 일괄 작업에 꼭 PTC를 써야 하는 것은 아닙니다.","guideStandardUsage":"### 문제 하나 고치기\n\n> 검색 폼을 연속으로 두 번 제출하면 결과가 사라집니다. 원인을 찾아 고치고 관련 테스트를 실행한 뒤, 원인과 수정 내용을 설명해 주세요.\n\n예상 결과: 코드 수정, 관련 테스트 결과, 문제 원인 설명.\n\n### 프로젝트 자료 정리\n\n> 프로젝트의 Markdown 기록을 읽고, 이미 내린 결론과 아직 확인이 필요한 문제를 정리한 뒤 해당 파일 링크를 붙여 주세요.\n\n예상 결과: 출처가 달린 요약. 원문으로 돌아가 확인하기 쉽습니다.","guidePtcIntro":"새 작업을 만들 때 ‘PTC 모드’를 고르고, 입력 파일, 처리 규칙, 출력 형식을 적어 주세요. 코드는 에이전트가 작성합니다.","guidePtcExplanation":"### 도구를 호출하는 방식\n\nPTC는 Programmatic Tool Calling, 즉 프로그램으로 도구를 호출하는 방식입니다. 현재 기본 프리셋에서는 에이전트가 run_code로 TypeScript 프로그램을 작성하고, 생성된 도구 SDK로 호출합니다. 프로그램 안에서 반복, 조건 분기, 오류 처리, 동시에 실행하기 좋은 호출을 구성할 수 있습니다.\n\n### 어떤 결과가 모델에 전달되나\n\n도구가 돌려준 데이터는 먼저 프로그램으로 가서 걸러지거나 계산·병합된 뒤, 출력이나 반환값으로 모델에 전달됩니다. 이미지 결과는 따로 첨부됩니다. 프로그램 안의 도구 호출도 그대로 기록되고, 도구 권한도 똑같이 적용됩니다.\n\n### 표준 모드와의 차이\n\n두 모드 모두 프로그래밍과 파일 일괄 처리를 할 수 있습니다. 표준 모드는 각 도구를 모델에 직접 제공하고, PTC는 모델이 코드로 도구 호출을 구성합니다. 현재 PTC 프리셋에서는 workflow 도구가 꺼져 있습니다. 속도와 토큰 사용량은 작업 내용과 결과 처리 방식에 따라 달라집니다.","guidePtcUsage":"### 설정 파일 일괄 검사\n\n> configs/ 아래 모든 JSON 파일을 schema.json 기준으로 검사해 빠진 필드와 잘못된 값을 찾아 주세요. 문제마다 CSV 한 줄로 적고, 읽지 못한 파일도 보고서에 넣은 뒤 나머지 파일을 계속 검사하세요. 원본 파일은 그대로 두세요.\n\n예상 결과: 문제 요약과 CSV 보고서. 프로그램은 여러 파일에 같은 검사를 하고, 파일 하나가 실패해도 처리한 뒤 결과를 모읍니다.\n\n### 오류 로그 요약\n\n> logs/ 아래 로그를 분석해 서비스별·오류 유형별 횟수를 세고, 가장 많이 나온 오류 10가지를 유형마다 예시 하나씩과 함께 나열해 주세요. 전체 통계는 CSV로 따로 저장하세요.\n\n예상 결과: 자주 나는 오류 요약과 전체 통계표. 중간 데이터는 프로그램에서 먼저 모은 뒤 요약만 모델에 넘길 수 있습니다.","guideMinimalIntro":"새 작업을 만들 때 ‘최소 모드’를 고르세요. 비교 테스트를 할 때는 모델, 권한, 작업 입력, 작업 공간 시작 상태를 똑같이 맞추세요.","guideMinimalExplanation":"### 남아 있는 기능\n\n유지되는 셸과 read_image 도구를 제공하고, 고정된 시스템 프롬프트를 씁니다. 이미지를 읽으려면 이미지 입력을 지원하는 모델이 필요합니다. 컨텍스트가 한도에 가까워지면 오래된 기록을 자동으로 압축하고, 에이전트가 쉬고 있을 때 /compact로 직접 압축할 수 있습니다. 기본 프리셋은 스킬과 계획을 불러오지 않고, 표준 실행 컨텍스트도 넣지 않습니다.\n\n### 언제 고르나\n\n실험과 비교 테스트의 기준선으로 쓰기 좋습니다. 에이전트는 여전히 터미널 명령으로 파일을 읽고 쓰고 스크립트를 실행할 수 있지만, 긴 작업을 관리하는 내장 보조 기능은 없습니다. 도구가 적다고 초보자에게 더 쉬운 것은 아닙니다.","guideMinimalUsage":"### 기본 수정 능력 비교\n\n> 이 프로젝트의 테스트를 실행해 실패 원인을 찾고, 최소한으로 고친 뒤 관련 테스트를 다시 실행해 결과를 보고해 주세요.\n\n표준 모드와 최소 모드로 같은 작업 공간 상태에서 이 작업을 각각 실행해 완료 여부, 도구 호출, 최종 수정을 비교하세요. 최소 모드는 터미널 명령으로 이 작업들을 합니다.","guideCordisIntro":"새 작업을 만들 때 ‘창작 모드’를 고르고, 어떤 기능을 더하고 싶은지, 어디서 쓸지, 효과를 어떻게 확인할지 적어 주세요.","guideCordisExplanation":"### 무엇을 만들 수 있나\n\n창작 모드는 표준 작업 도구에 더해 실행 중 검사, 영구 플러그인 관리, Cordis 플러그인과 에이전트 프리셋 개발 안내를 제공합니다. 플러그인을 작성해 기능이나 화면을 추가할 수도 있고, 도구와 프롬프트를 조합해 특정 작업에 맞는 모드를 만들 수도 있습니다.\n\n### 플러그인과 모드의 관계\n\n플러그인은 DSH에 도구, 서비스 연결, 화면 진입점 같은 기능을 더합니다. 모드는 에이전트 프리셋 하나로, 작업에서 쓸 도구를 고르고 에이전트의 작업 방식을 정합니다. 직접 만든 플러그인을 사용자 모드에서 쓸 수도 있습니다.\n\n### 결과를 적용하는 방법\n\n에이전트에게 설치와 실제 동작 확인까지 맡길 수 있습니다. 수정 내용에 따라 플러그인이 바로 불러와질 수도 있고 재시작이 필요할 수도 있습니다. 새로 만든 모드는 새 작업을 만들 때 고릅니다.","guideCordisUsage":"### 화면 하나 추가하기\n\n> 사이드바에 ‘프로젝트 노트’ 메뉴를 추가하는 DSH 플러그인을 만들어 주세요. 현재 작업 공간의 Markdown 파일을 나열하고, 누르면 내용을 미리 볼 수 있게 해 주세요. 설치하고 페이지가 열리는지 확인까지 해 주세요.\n\n예상 결과: 사이드바 메뉴와 미리보기 페이지가 있는 플러그인, 그리고 적용하려면 남은 단계.\n\n### 도구 하나 추가하기\n\n> 프로젝트 테스트 보고서를 읽어 실패한 케이스를 요약하는 도구를 제공하는 플러그인을 만들어 주세요. 도구를 등록하고 예시 보고서로 호출 결과를 확인해 주세요.\n\n예상 결과: 호출할 수 있는 새 도구와 예시 호출 한 번의 확인 결과.\n\n### 나만의 모드 만들기\n\n> 표준 모드를 바탕으로 ‘코드 리뷰’ 모드를 만들어 주세요. 잠재적 오류와 빠진 테스트를 먼저 살피고, 파일과 줄 번호를 짚어 주고, 파일을 고치기 전에는 먼저 물어보게 해 주세요. 고를 수 있는 프리셋으로 저장해 주세요.\n\n예상 결과: 새 작업에서 고를 수 있는 사용자 모드. 리뷰 요구사항은 에이전트를 안내할 뿐이고, 실제로 할 수 있는 작업은 권한 설정이 정합니다.","builtInGroup":"기본 제공","customGroup":"사용자 지정","sectionIntro":"에이전트의 도구와 작업 방식을 고릅니다. 일상 작업은 ‘표준 모드’, DSH 기능 확장은 ‘창작 모드’를 쓰세요.","seatHint":"새 작업에 쓸 에이전트 프리셋 선택","headerHint":"이 작업의 에이전트 프리셋(작업 시작 때 정해짐)","nav":"에이전트 프리셋","setDefault":"새 작업 기본값으로 설정","view":"설정 보기","presetStandardName":"표준 모드","presetStandardDescription":"코드, 파일, 자료를 다루며 대부분의 작업에 맞습니다. 에이전트가 필요에 따라 검색, 편집, 터미널 같은 도구를 씁니다.","presetPtcName":"PTC 모드","presetPtcDescription":"표준 모드의 모든 기능을 포함하며, 도구를 대량으로 호출하고 결과를 거르고 정리하고 중복을 없애고 통계·요약하는 작업에 더 알맞습니다.","presetMinimalName":"최소 모드","presetMinimalDescription":"에이전트가 터미널과 이미지 읽기 도구만 쓰고 컨텍스트 압축을 지원합니다. 기본 성능을 시험하고 비교하기에 좋습니다.","presetCordisName":"창작 모드","presetCordisDescription":"대화로 DSH를 맞춤 설정합니다. 에이전트에게 플러그인을 만들게 해 새 기능이나 화면을 더하고, 도구와 프롬프트를 조합해 나만의 모드를 만들 수도 있습니다.","inUse":"새 작업 기본값","noDescription":"설명이 없습니다.","brokenBadge":"불러오기 실패","switchRefused":"‘{name}’(으)로 바꿀 수 없습니다: {reason}","standardUnavailable":"표준 모드를 쓸 수 없습니다. 이 모드를 복구하거나 쓸 수 있는 다른 모드를 고르세요.","close":"닫기","creatorDraft":"에이전트에게 프리셋 모드 만들기 맡기기","createPlugin":"에이전트에게 플러그인 만들기 맡기기","createPluginDescription":"창작 모드로 들어가 나만의 DSH 플러그인 만들기","createPluginChecking":"창작 모드를 쓸 수 있는지 확인하는 중","createPluginUnavailable":"잠시 쓸 수 없습니다. 메뉴를 다시 열어 시도하세요","createPluginMissing":"현재 설정에는 창작 모드가 없습니다"},"approval":{"waiting":"승인 대기 중","detail.aria":"승인 상세","escalation":"도구 {toolName}이(가) 권한 밖 실행을 요청합니다","reject":"거부","allowOnce":"한 번 허용"},"chat":{"message.stepProcess.thinking":"요청 분석 중","message.stepProcess.read":"파일 읽는 중","message.stepProcess.readImage":"이미지 읽는 중","message.stepProcess.write":"파일 쓰는 중","message.stepProcess.search":"코드 검색 중","message.stepProcess.edit":"파일 편집 중","message.stepProcess.commands":"명령 실행 중","message.stepProcess.code":"코드 실행 중","message.stepProcess.webSearch":"웹 검색 중","message.stepProcess.webFetch":"웹페이지 여는 중","message.stepProcess.subagents":"하위 에이전트 조율 중","message.stepProcess.plan":"계획 업데이트 중","message.stepProcess.questions":"사용자 조작을 기다리는 중","message.stepProcess.tools":"도구 호출 중","message.stepProcess.prepare.read":"파일 읽을 준비 중","message.stepProcess.prepare.readImage":"이미지 읽을 준비 중","message.stepProcess.prepare.write":"파일 쓸 준비 중","message.stepProcess.prepare.search":"코드 검색 준비 중","message.stepProcess.prepare.edit":"파일 편집 준비 중","message.stepProcess.prepare.commands":"명령 실행 준비 중","message.stepProcess.prepare.code":"코드 실행 준비 중","message.stepProcess.prepare.webSearch":"웹 검색 준비 중","message.stepProcess.prepare.webFetch":"웹페이지 열 준비 중","message.stepProcess.prepare.subagents":"하위 에이전트 조율 준비 중","message.stepProcess.prepare.plan":"계획 업데이트 준비 중","message.stepProcess.prepare.questions":"질문 준비 중","message.stepProcess.prepare.tools":"도구 호출 준비 중","message.stepProcess.done.thinking":"분석 완료","message.stepProcess.done.read":"파일 읽음","message.stepProcess.done.readImage":"이미지 읽음","message.stepProcess.done.write":"파일 씀","message.stepProcess.done.search":"코드 검색함","message.stepProcess.done.edit":"파일 수정함","message.stepProcess.done.commands":"명령 실행함","message.stepProcess.done.code":"코드 실행함","message.stepProcess.done.webSearch":"웹 검색함","message.stepProcess.done.webFetch":"웹페이지 열어 봄","message.stepProcess.done.subagents":"하위 에이전트 조율함","message.stepProcess.done.plan":"계획 업데이트함","message.stepProcess.done.questions":"사용자에게 질문함","message.stepProcess.done.tools":"도구 호출함","message.stepProcess.joinTwo":"{first}, {second}","message.stepProcess.comma":", ","message.stepProcess.sharedPrefix":"","message.stepProcess.more":"{title} 외","message.trigger.request":"실행 요청 받음","message.trigger.goal":"목표 계속 실행","message.trigger.agent":"작업 메시지 받음","message.trigger.team":"팀 메시지 받음","message.trigger.subagent":"하위 작업 상태 업데이트","message.trigger.github":"GitHub 이벤트 받음","message.trigger.webhook":"외부 이벤트 받음","message.trigger.schedule":"자동화 작업","message.trigger.job":"백그라운드 작업 상태 업데이트","message.trigger.plugin":"플러그인 상태 업데이트","message.trigger.explanation":"이 알림 때문에 이번 답변이 시작되었습니다.","message.turnProcess.worked":"완료","message.turnProcess.took":"완료, 소요 시간 ","message.turnProcess.failed":"처리 실패","view.chat":"대화","image.open":"크게 보기","image.loading":"이미지 불러오는 중…","image.failed":"이미지를 미리 볼 수 없습니다","image.dialog":"이미지 미리보기","image.close":"이미지 미리보기 닫기","number.groupSeparator":",","duration.compactSeconds":"{seconds}초","duration.compactMinutes":"{minutes}분 {seconds}초","duration.milliseconds":"{milliseconds}ms","stats.counts":"{turns}턴 {steps}단계","stats.cacheHit":"캐시 적중 {percent}%","stats.dialog.title":"세션 통계","stats.dialog.usageTitle":"토큰 사용량","stats.dialog.llmTime":"모델 소요 시간","stats.dialog.toolTime":"도구 호출 소요 시간","stats.dialog.ttft":"첫 토큰 평균(TTFT)","stats.dialog.speed":"출력 속도(TPS)","chat.loadingHistory":"기록 불러오는 중…","chat.loadError":"기록 불러오기 실패: {message}({code})","chat.loadOlder":"이전 기록 더 불러오기","chat.toBottom":"맨 아래로","chat.deepDiving":"생각하는 중","chat.deepDivingFor":"생각하는 중, {duration} 경과 ···","chat.turnNavigation.label":"턴 이동","chat.turnNavigation.jump":"{turn}번째 턴으로 이동","chat.turnNavigation.jumpLoad":"불러와서 {turn}번째 턴으로 이동","chat.turnNavigation.turn":"{turn}번째 턴","settings.performance.title":"성능과 사용량","settings.performance.description":"성능·사용량 정보를 얼마나 자세히 보여 줄지 선택","settings.performance.compact":"간단히","settings.performance.detailed":"자세히","settings.links.title":"웹 링크 기본 열기 방식","settings.links.description":"대화 속 웹 링크를 열 위치","settings.links.sidebar":"앱 안 사이드바","settings.links.newTab":"기본 브라우저","settings.transcript.title":"작업 단계 표시","settings.transcript.description":"도구 호출 내용을 얼마나 자세히 볼지 선택","settings.collapse.title":"작업 단계 접는 시점","settings.collapse.description":"작업 단계를 언제 자동으로 접을지 선택","settings.collapse.completion":"답변이 끝난 뒤","settings.collapse.nextInput":"다음 새 메시지가 올 때","settings.transcript.compact":"간단히","settings.transcript.standard":"표준","settings.transcript.detailed":"자세히","settings.transcript.verbose":"모두 펼치기","fileOpen.title":"파일을 열 수 없습니다","fileOpen.unknown":"이 파일을 열 수 없습니다","message.extraBlock":"추가 콘텐츠 블록","message.systemPrompt":"시스템 프롬프트","message.systemPromptUpdate":"시스템 프롬프트 업데이트","message.toolAdded":"도구 추가됨: {name}","message.toolRemoved":"도구 제거됨: {name}","message.toolsAdded":"추가: {names}","message.toolsAddedCount":"{count}개 추가","message.toolsChanged":"{added}개 추가, {removed}개 제거","message.toolsRemoved":"제거: {names}","message.toolsRemovedCount":"{count}개 제거","message.toolsUpdated":"도구가 업데이트됨","message.contextInjection":"컨텍스트 주입","message.contextRecall":"세션 간 불러오기","message.referenceSummary":"참조한 세션 · {labels}","message.referenceSeparator":"、","message.context.instructions.loaded":"불러옴","message.context.instructions.added":"추가됨","message.context.instructions.updated":"업데이트됨","message.context.instructions.removed":"제거됨","message.context.catalog.replaced":"목록 교체","message.context.catalog.more":"…{count}개 더 있음","message.context.snapshot.supersedes":"이전 스냅샷을 대체함","message.context.relay.from":"세션 {session}에서 가져옴","message.context.recall.counts":"{retained}개 유지 · {omitted}개 생략","message.context.recall.truncated":"잘림","message.compaction":"컨텍스트가 압축됨","message.compaction.running":"압축 중…","message.compaction.completed":"기록 {items}개 압축함(약 {tokens}토큰)","message.compaction.expand":"눌러서 압축 요약 보기","message.compaction.unavailable":"압축 요약을 볼 수 없습니다","message.compaction.commandTitle":"compact","message.think":"생각","message.unknownSurface":"알 수 없는 surface 이벤트: {type}","message.unknownBlock":"알 수 없는 콘텐츠 블록","message.turnProcess.toolCalls.one":"도구 호출 {count}회","message.turnProcess.toolCalls.other":"도구 호출 {count}회","message.turnProcess.messages.one":"메시지 {count}개","message.turnProcess.messages.other":"메시지 {count}개","message.turnProcess.subagents.one":"하위 에이전트 {count}개","message.turnProcess.subagents.other":"하위 에이전트 {count}개","message.turnProcess.thoughtForAWhile":"생각함","message.turnProcess.separator":" · ","message.stopped":"중지됨","message.branch":"새 대화로 분기","message.branchUnavailable":"완료된 턴의 마지막 메시지에서만 분기할 수 있습니다","message.retry.active":"모델 요청 다시 시도 중","message.retry.cancelled":"모델 요청 재시도 취소됨","message.retry.started":"모델 요청 다시 시도함","message.retry.scheduled":"모델 요청 재시도 대기 중","message.retry.status":"{label}（{retry}/{maximum}） · {seconds}s","message.retry.delay":"재시도 대기 시간: ","message.retry.failure":"실패 원인: ","message.failure.auth":"API 키가 올바르지 않습니다","message.taskStopped":"작업 중지됨","message.failure.accountSignedOut":"DeepSeek에서 로그아웃해 작업이 중지되었습니다.","message.failure.interrupted":"이번 턴이 끝나기 전에 DSH 프로세스가 종료되어(강제 종료, 충돌, 종료 시간 초과 등) 다시 시작한 뒤 이번 턴을 중단했습니다. 끝나지 않은 도구 호출의 결과는 알 수 없습니다.","message.failure.accountSignInRequired":"먼저 DeepSeek에 로그인하고, 요청 주소가 계정 인증을 지원하는지 확인하세요.","message.failure.quota":"현재 요청의 사용 한도를 모두 썼습니다","message.turnError":"이번 턴 실행 실패","message.maxTokens":"출력 토큰 한도에 도달했습니다","message.maxTokens.hint":"답변이 잘렸습니다. 나온 출력은 대화에 남아 있습니다. ‘계속’이라고 보내면 모델이 이어서 출력합니다.","message.tokensPerSecond":"{tps} tok/s","message.turnUsage.title":"이번 턴 사용량","message.turnUsage.consumed":"사용량 {total}","message.turnUsage.model":"공급자 / 모델","message.turnUsage.cacheHit":"캐시 적중","message.turnUsage.input":"캐시 안 된 입력","message.turnUsage.cacheRead":"캐시 읽기","message.turnUsage.cacheWrite":"캐시 쓰기","message.turnUsage.output":"출력","message.turnUsage.reasoning":"(그중 추론 {tokens})","message.turnUsage.count":"{count} tok","duration.secondUnit":"초","duration.minuteUnit":"분","duration.hourUnit":"시간","command.running":"실행 중…","command.failed":"명령 실패","command.done":"완료","command.title":"명령","row.running":"실행 중","row.failed":"실패","json.truncated":"… 잘림, 총 {total}자","clock.md":"{m}월 {d}일","clock.ymd":"{y}년 {m}월 {d}일"},"command":{"section.add":"추가","section.commands":"명령","label.goal":"목표","label.plan":"계획","label.feedback":"피드백","label.compact":"압축","label.permission":"권한","label.export":"로그 내려받기","description.goal":"장기 작업 목표 설정 또는 보기","description.plan":"계획 모드 들어가기/나가기","description.feedback":"현재 세션에 대한 피드백 보내기","description.compact":"위 대화 내용 압축","description.permission":"권한 프리셋 바꾸기(샌드박스 모드와 승인 정책)","description.export":"현재 세션 내용을 ZIP으로 내보내기","token.goal":"목표","token.plan":"계획","token.feedback":"피드백","token.compact":"압축","token.permission":"권한","token.export":"내보내기","search.placeholder":"검색…","search.aria":"옵션 필터","status.loading":"옵션 불러오는 중…","status.applying":"적용 중…","status.empty":"옵션 없음","overlay.aria":"/{command} 옵션","listbox.aria":"/{command} 일치 항목","notice.attachmentsUnsupported":"/{command}에는 첨부를 쓸 수 없습니다. 먼저 첨부를 빼 주세요"},"conversation":{"shortcut.newline":"줄바꿈","shortcut.complementary":"반대 방식(대기열/끼어들기)으로 보내기","shortcut.slash":"명령 메뉴 열기","shortcut.mention":"참조 메뉴 열기","hint.plan":"작업을 설명하면 계획을 만듭니다","hint.goal":"목표를 입력하면 에이전트가 계속 실행합니다","hint.goal.active":"현재 목표 진행 중. edit 수정 / pause 일시 중지 / resume 계속 / clear 지우기를 입력할 수 있습니다","placeholder.plan":"작업을 설명하면 계획을 만듭니다","placeholder.default":"메시지를 보내거나 작업을 만드세요. /로 명령, @로 파일이나 대화","placeholder.unavailable":"세션을 쓸 수 없습니다","placeholder.parentOffline":"상위 세션이 오프라인이라 더 보낼 수 없습니다. 현재 실행은 멈출 수 있습니다","placeholder.hero":"만들고 싶은 것을 설명하세요. /로 명령, @로 파일이나 대화","placeholder.workspace":"작업 공간을 골라 시작하세요","placeholder.steerQueue":"Cmd/Ctrl+Enter로 대기 중인 메시지를 모두 끼어들어 보내기","input.commands":"파일 추가 또는 명령 실행","input.file":"파일","input.stop":"생성 중지","input.send":"메시지 보내기","input.send.queue":"대기열에 넣어 보내기","input.send.steer":"끼어들어 보내기","attachment.pending":"보낼 첨부","attachment.scrollLeft":"첨부 왼쪽으로 스크롤","attachment.scrollRight":"첨부 오른쪽으로 스크롤","attachment.dropTitle":"파일이나 이미지를 여기로 끌어다 놓으면 추가됩니다","attachment.dropDesc":"이미지 제한: 최대 {count}장, 장당 {size}","attachment.dropBlocked":"지금은 파일이나 이미지를 추가할 수 없습니다","attachment.directoryDesktopOnly":"폴더 추가는 데스크톱 앱에서만 됩니다. 브라우저에서는 파일을 하나씩 추가하세요","attachment.pathUnavailable":"폴더 경로를 가져오지 못했습니다. 다시 끌어다 놓으세요","attachment.pathUnsupported":"경로에 참조할 수 없는 문자가 있습니다. 이름을 바꾼 뒤 다시 시도하세요","image.pending":"보낼 이미지","image.openOriginal":"원본 보기","image.openOriginalLabel":"{label}, 눌러서 원본 보기","image.remove":"이미지 {name} 제거","image.original":"원본","image.label":"이미지","image.loadFailed":"이미지를 불러오지 못했습니다. 눌러서 다시 시도","image.loading":"이미지 불러오는 중…","image.preview":"원본 미리보기","image.closePreview":"원본 미리보기 닫기","image.unsupportedType":"PNG, JPG, WebP, GIF 이미지만 지원합니다","image.tooMany":"메시지 하나에 이미지는 최대 {count}장까지 추가할 수 있습니다","image.fileTooLarge":"이미지 한 장은 {size}를 넘을 수 없습니다","image.totalTooLarge":"이미지 전체 크기가 {size}를 넘습니다. 일부 이미지를 빼 주세요","image.tooManyPixels":"이미지 해상도가 너무 큽니다. 줄인 뒤 다시 시도하세요","image.dimensionTooLarge":"이미지 가로·세로는 {size}px를 넘을 수 없습니다. 줄인 뒤 다시 시도하세요","image.modelUnsupported":"현재 모델은 이미지를 지원하지 않습니다. 이미지를 지원하는 모델로 바꾸세요","image.sendFailed":"이미지 보내기 실패({reason}). 이미지를 다시 추가한 뒤 시도하세요","file.pending":"보낼 파일","file.remove":"파일 {name} 제거","file.uploading":"올리는 중…","file.uploadFailed":"올리기 실패. 눌러서 다시 시도","file.retry":"{name} 다시 올리기","file.stillUploading":"파일을 올리는 중입니다. 끝난 뒤 보내 주세요","file.sessionUnavailable":"세션을 쓸 수 없어 파일을 올릴 수 없습니다","file.notStaged":"파일이 아직 올라가지 않았습니다. 다시 추가한 뒤 시도하세요","file.label":"파일","context.aria":"컨텍스트 {percent} 사용","context.used":"컨텍스트 사용량","context.system":"시스템 프롬프트","context.tools":"도구 정의","context.messages":"대화 메시지","settings.enter.title":"작업 중일 때 보내기 동작","settings.enter.description":"에이전트가 실행 중일 때 Enter 키와 보내기 버튼의 동작입니다. Cmd/Ctrl+Enter는 반대 동작을 씁니다","settings.enter.queue":"대기열에 넣어 보내기","settings.enter.steer":"끼어들어 보내기","hero.headline":"아직 가 보지 않은 곳을 탐험하세요","hero.preview":"미리보기판","hero.chooseWorkspace":"작업 공간 선택","session.hierarchy":"세션 계층","session.moreViews":"다른 세션 보기","todo.title":"작업","todo.progress.done":"{done}개 완료","todo.progress.active":"{active}개 진행 중","todo.progress.pending":"{pending}개 대기","todo.status.completed":"완료","todo.status.inProgress":"진행 중","todo.status.pending":"처리 대기","todo.rowTitle":"작업 목록 업데이트","tool.title.createGoal":"목표 만들기","tool.title.getGoal":"목표 보기","tool.title.updateGoal":"목표 업데이트","tool.preparing.content":"{kilobytes}KB","tool.title.createSchedule":"예약 작업 만들기","tool.title.listSchedules":"예약 작업 보기","tool.title.deleteSchedule":"예약 작업 삭제","tool.title.updateSchedule":"예약 작업 수정","detail.state":"상태","detail.todo.completed":"완료","detail.todo.in_progress":"진행 중","detail.todo.pending":"처리 대기","detail.todo.empty":"작업 목록이 비어 있습니다","todo.diff.initial":"첫 기록","todo.diff.compare":"지난 목록과 비교","todo.diff.unavailable":"이전 목록을 볼 수 없습니다","todo.diff.noChanges":"목록에 변화가 없습니다","todo.diff.added":"{count}개 추가","todo.diff.updated":"{count}개 업데이트","todo.diff.removed":"{count}개 제거","todo.diff.unchanged":"{count}개 변화 없음","todo.diff.addedItem":"추가","todo.diff.updatedItem":"상태 변경","todo.diff.movedItem":"순서 조정","todo.diff.removedItem":"제거","detail.goal.empty":"목표 없음","detail.goal.active":"진행 중","detail.goal.disarmed":"계속하기를 기다리는 중","detail.goal.paused":"일시 중지됨","detail.goal.blocked":"막힘","detail.goal.complete":"완료","detail.goal.rounds":"실행 턴","detail.goal.reason":"막힌 이유","detail.days":"{count}일","detail.hours":"{count}시간","detail.minutes":"{count}분","detail.seconds":"{count}초","detail.schedule.once":"한 번","detail.schedule.every":"{interval}마다","detail.schedule.when":"예정 시간","detail.schedule.frequency":"반복","detail.schedule.scheduled":"실행 대기 중","detail.schedule.overdue":"시간이 지났습니다. 세션이 다시 열리기를 기다리는 중","detail.schedule.empty":"예약 작업 없음","detail.schedule.deleted":"삭제됨","detail.schedule.count":"예약 작업 {count}개","detail.schedule.daily":"매일 {time}({zone})","detail.schedule.weekly":"매주 {days} {time}({zone})","detail.schedule.cron":"Cron {expression}（{zone}）","detail.weekday.1":"월","detail.weekday.2":"화","detail.weekday.3":"수","detail.weekday.4":"목","detail.weekday.5":"금","detail.weekday.6":"토","detail.weekday.7":"일","detail.weekday.join":"、","tool.title.inspectProviders":"검사 공급자 확인","tool.title.queryRuntime":"런타임 조회","tool.title.inspectPlugins":"동적 플러그인 확인","tool.title.workflow":"워크플로 실행","tool.title.ralph":"반복 워크플로 실행","tool.title.readEvent":"이벤트 읽기","tool.title.searchEvents":"이벤트 검색","tool.title.traceEvent":"이벤트 추적","tool.title.searchSessions":"세션 검색","tool.title.traceSession":"세션 추적","tool.title.listModels":"사용 가능한 모델 보기","tool.title.subagent":"하위 에이전트 만들기","tool.title.listAgents":"하위 에이전트 보기","tool.title.sendMessage":"메시지 보내기","tool.title.interruptAgent":"에이전트 중단","tool.title.listJobs":"백그라운드 작업 보기","tool.title.readJob":"작업 출력 읽기","tool.title.killJob":"백그라운드 작업 취소","tool.title.openTerminal":"터미널 만들기","tool.title.readTerminal":"터미널 읽기","tool.title.listTerminals":"터미널 보기","tool.title.signalTerminal":"터미널 신호 보내기","tool.title.closeTerminal":"터미널 닫기","tool.title.lsp":"코드 심볼 조회","tool.title.findDefinition":"정의 찾기","tool.title.findReferences":"참조 찾기","tool.title.findImplementation":"구현 찾기","tool.title.hoverSymbol":"심볼 정보 보기","tool.title.spawnTeammate":"팀원 만들기","tool.title.createTeamTask":"팀 작업 만들기","tool.title.getTeamTask":"팀 작업 읽기","tool.title.updateTeamTask":"팀 작업 업데이트","tool.title.listTeamTasks":"팀 작업 보기","tool.title.waitAgent":"하위 에이전트 기다리기","detail.recordedResult":"호출 결과","detail.empty":"결과 없음","detail.none":"없음","detail.yes":"예","detail.no":"아니요","detail.moreInInspect":"{count}개 더 있습니다. ‘보기’에서 읽을 수 있습니다","detail.status.running":"실행 중","detail.status.idle":"대기 중","detail.status.ready":"준비됨","detail.status.inactive":"실행 안 함","detail.status.provisioning":"준비 중","detail.status.failed":"실패","detail.status.completed":"완료","detail.status.deleted":"삭제됨","detail.status.killed":"취소됨","detail.status.accepted":"받음","detail.status.queued":"대기열에 들어감","detail.status.exited":"종료됨","detail.field.id":"ID","detail.field.revision":"버전","detail.field.platform":"플랫폼","detail.field.provider":"공급자","detail.field.model":"모델","detail.field.role":"역할","detail.field.context":"컨텍스트","detail.field.owner":"담당자","detail.field.ready":"시작 가능","detail.field.dependencies":"선행 작업","detail.field.writeScopes":"파일 범위","detail.field.warnings":"프롬프트","detail.field.diagnostics":"진단","detail.field.methods":"메서드","detail.field.inputSchema":"입력 스키마","detail.field.outputSchema":"출력 스키마","detail.field.currentPackage":"현재 패키지","detail.field.nextPackage":"실행 대기 패키지","detail.field.latestRun":"최근 실행","detail.field.packages":"버전 패키지","detail.field.registrations":"등록 항목","detail.field.props":"속성","detail.field.data":"데이터","detail.field.source":"출처","detail.field.content":"내용","detail.field.message":"메시지","detail.field.messageId":"메시지 ID","detail.field.root":"루트 노드","detail.field.pid":"프로세스 ID","detail.field.type":"유형","detail.field.time":"시간","detail.field.seq":"이벤트 번호","detail.field.turn":"턴","detail.field.step":"단계","detail.field.callId":"호출 ID","detail.field.agents":"시작한 에이전트 수","detail.field.result":"결과","detail.field.parent":"상위","detail.field.depth":"계층","detail.field.exitCode":"종료 코드","detail.field.signal":"신호","detail.field.previousStatus":"중단 전 상태","detail.field.agent":"에이전트 ID","detail.field.job":"작업 ID","detail.field.task":"작업 내용","detail.field.processGroup":"프로세스 그룹","detail.field.availability":"사용 가능 상태","detail.field.bestMatch":"가장 관련 있는 이벤트","detail.field.target":"대상 이벤트","detail.field.surface":"기록 상태","detail.agents.count":"에이전트 {count}개","detail.jobs.count":"백그라운드 작업 {count}개","detail.terminals.count":"터미널 {count}개","detail.tasks.count":"팀 작업 {count}개","detail.tasks.nextPage":"작업이 더 있습니다. 다음 페이지 위치: {cursor}","detail.locations.count":"위치 {count}곳","detail.location":"{line}행 {column}열","detail.receipt.delivered":"메시지 전달됨","detail.receipt.interrupt":"중단 요청함","detail.receipt.started":"시작됨","detail.receipt.cancel":"취소 요청함","detail.receipt.alreadyFinished":"작업 끝남","detail.receipt.signal":"신호 보냄","detail.receipt.closed":"꺼짐","detail.receipt.closing":"닫는 중","detail.wait.noProgress":"실행 중인 하위 에이전트가 없습니다","detail.wait.title":"하위 에이전트 상태","detail.wait.timeout":"대기 시간 초과","detail.wait.changed":"변화 감지됨","detail.agent.reply":"에이전트 응답","detail.models.title":"사용 가능한 모델","detail.output.lines":"{begin}–{end}행 / 전체 {total}행","detail.output.truncated":"출력이 잘림","detail.providers.count":"검사 공급자 {count}개","detail.plugins.count":"동적 플러그인 {count}개","detail.workflow.script":"워크플로 스크립트","detail.ralph.reportedComplete":"에이전트가 완료를 보고함","detail.ralph.reportedBlocker":"에이전트가 막힘을 보고함","detail.ralph.limit":"턴 한도에 도달함","detail.report.nextSteps":"남은 할 일","detail.trace.replacedBy":"다음으로 대체됨","detail.trace.replacementChain":"대체 체인","detail.trace.replaces":"대체된 이벤트","detail.trace.sources":"참조 출처","detail.trace.derived":"파생 이벤트","detail.trace.ancestors":"상위 세션","detail.trace.descendants":"하위 세션","detail.matches.count":"일치 {count}개","detail.matches.capped":"결과 한도에 도달했습니다. 검색 범위를 좁혀 보세요","detail.event.neighbors":"앞뒤 이벤트","todo.completed":"{done}/{total} 완료","command.attachmentsUnsupported":"/{command}에는 첨부를 쓸 수 없습니다. 먼저 첨부를 빼 주세요","ask.rowTitle":"질문","ask.waiting":"답변 기다리는 중","ask.pending":"작업을 계속하고 있습니다. 그래도 답할 수 있습니다","ask.pendingDetail":"대기 중인 질문은 입력창에서 계속 답할 수 있습니다","ask.reopen":"답변","ask.review":"답변 보기","ask.closed":"끝남","ask.closedDetail":"이 질문은 끝났습니다. 결과는 아래 대화를 보세요","ask.cancelled":"취소됨","ask.cancelledDetail":"이번 턴이 취소되어 답변을 제출하지 않았습니다","ask.interrupted":"중단됨","ask.interruptedDetail":"이번 턴이 중단되어 답변을 제출하지 않았습니다","ask.answered":"{answered}/{total} 답변함","ask.skipped":"답하지 않음","bash.running":"실행 중","bash.failed":"실패","bash.stopped":"중지됨","row.running":"실행 중","row.preparing":"호출 준비 중","row.failed":"실패","row.stopped":"중지됨","row.commandArguments":"명령 인자","row.input":"입력","row.output":"출력","row.inspect":"보기","row.imageSize":"{width}x{height}px, {bytes}바이트","row.imageSizeDownscaled":"{width}x{height}px({originalWidth}x{originalHeight}px에서 축소), {bytes}바이트","tool.title.search":"검색","tool.title.read":"읽기","tool.title.bash":"명령 실행","tool.title.write":"쓰기","tool.title.edit":"편집","tool.title.code":"코드","tool.title.generic":"도구 호출","tool.title.inspect":"Cordis 환경 조회","tool.title.runCordis":"Cordis 플러그인 실행","tool.title.stopCordis":"Cordis 플러그인 중지","tool.title.removeCordis":"Cordis 플러그인 제거","tool.title.pwsh":"명령 실행","tool.title.readImage":"이미지 읽기","tool.title.grep":"파일 내용 검색","tool.title.glob":"파일 찾기","tool.title.webSearch":"웹 검색","tool.title.webFetch":"웹페이지 가져오기","tool.autoReviewRejected":"Auto review가 거부함","tool.autoReviewNotExecuted":"도구를 실행하지 않았습니다. 이유: {reason}","tool.autoReviewReasonFallback":"Auto review가 이 작업을 허가하지 않았습니다","diff.collapseAria":"차이 접기","diff.expandAria":"나머지 차이 {count}줄 펼치기","diff.expandRest":"… 나머지 {count}줄","read.window":"{shown} / {total}줄 표시","read.collapseAria":"내용 접기","read.expandAria":"나머지 {count}줄 펼치기","read.expandRest":"… 나머지 {count}줄","search.paths":"경로 {shown}개","search.paths.truncated":"전체 {total}개 중 경로 {shown}개 표시","search.matches":"일치 {shown}곳 · 파일 {files}개","search.matches.truncated":"전체 {total}곳 중 {shown}곳 표시 · 파일 {files}개","search.noResults":"결과 없음","search.collapseAria":"결과 접기","search.expandAria":"나머지 결과 {count}줄 펼치기","search.expandRest":"… 나머지 {count}줄","web.noResults":"결과를 찾지 못했습니다","web.sourcesTruncated":"출처 목록이 잘림","web.http":"HTTP","web.contentTruncated":"내용이 잘림","details.running":"실행 중…","queue.count":"대기 중인 메시지 {n}개","queue.sending":"보내는 중…","queue.image":"대기 중인 메시지 이미지","queue.file":"대기 중인 파일 {name}","queue.edit":"대기 중인 메시지 편집","queue.edit.unsupported":"텍스트가 아닌 내용이 있어 아직 편집할 수 없습니다","queue.save":"대기 중인 메시지 저장","queue.cancelEdit":"편집 취소","queue.remove":"대기 중인 메시지 삭제","queue.steer":"끼어들어 보내기","queue.steer.unavailable":"실행 중일 때만 끼어들어 보낼 수 있습니다","error.sessionInUse":"현재 세션을 다른 곳에서 쓰고 있습니다. 다른 DSH(다른 dsh web, 데스크톱 앱 등)가 실행 중일 수 있으니 끈 뒤 다시 시도하세요.","queue.editFailed":"편집 실패: 이 메시지가 이미 보내지기 시작했을 수 있습니다.","queue.removeFailed":"삭제 실패: 이 메시지가 이미 보내지기 시작했을 수 있습니다.","queue.steerFailed":"끼어들어 보내기에 실패했습니다. 다시 시도하세요.","terminal.signal":"신호 {signal}","terminal.exitCode":"종료 코드 {code}","terminal.noExitCode":"정상적으로 종료되지 않음","terminal.commandLine":"명령 {n}번째 줄","terminal.running":"실행 중","terminal.failed":"실패","terminal.done":"완료","terminal.noOutput":"출력 없음","terminal.collapseAria":"출력 접기","terminal.expandAria":"나머지 출력 {n}줄 펼치기","terminal.expandRest":"… 나머지 {n}줄","terminal.sendInput":"(입력 보냄)","terminal.session":"터미널 {sessionId}"},"cordis":{"row.defineTitle":"Cordis 플러그인 등록","a11y.preparing":"Cordis 도구 호출 준비 중","row.runTitle":"Cordis 플러그인 실행","row.updateTitle":"Cordis 플러그인 업데이트","row.stopTitle":"Cordis 플러그인 중지","row.removeTitle":"Cordis 플러그인 제거","purpose.missing":"(용도 미입력)","status.idle":"활성화 대기","status.awaitingApproval":"승인 대기","status.failed":"실행 실패","status.clientPending":"클라이언트 활성화 대기","status.running":"실행 중","status.removed":"제거됨","status.superseded":"업데이트 있음","run.removed":"패키지가 더 이상 없습니다","run.superseded":"더 새로운 실행 카드가 있습니다. 아래를 보세요","panel.hint":"실행 제어는 왼쪽 아래 설정 위의 Cordis 패널에서 합니다","panel.plugins.aria":"Cordis 플러그인","panel.approvals.aria":"Cordis 승인","panel.trigger":"Cordis Plugin","panel.runningCount":"{count} running","panel.title":"Cordis 플러그인","panel.empty":"아직 정의한 플러그인이 없습니다","panel.loading":"읽는 중…","panel.readFailed":"플러그인 목록 읽기 실패: {message}","panel.group.current":"현재 세션","panel.group.others":"다른 세션","panel.version":"버전","panel.current":"현재: {packageId}","panel.next":"전환 대기: {packageId}","action.approve":"허용","action.approveOnce":"이 버전만 허용","action.approvePlugin":"이 플러그인의 이후 버전도 허용","action.decline":"거부","action.run":"실행","action.stop":"중지","action.remove":"제거","action.retry":"다시 시도","action.rollback":"되돌리기","action.inspect":"보기","render.failedAbdicated":"{slot} 렌더링 실패, 기본 화면으로 되돌렸습니다: ","render.failedHeld":"{slot} 렌더링 실패: ","a11y.defining":"플러그인 정의 중","a11y.failed":"정의 실패","a11y.stopped":"정의 중단됨","body.source":"플러그인 코드","body.hostCode":"Host","body.clientCode":"Client","body.output":"결과","body.copy":"복사","body.copied":"복사됨"},"deliverables":{"presented.nativeUnavailable":"이 파일은 쓸 수 있는 호스트 경로가 없습니다. 사이드바에서 미리 보세요","presented.revealError":"파일 탐색기에서 보여 줄 수 없습니다. 다시 시도하세요","presented.directoryError":"있는 폴더를 열 수 없습니다. 다시 시도하세요","presented.directoryOpening":"있는 폴더 여는 중…","presented.directoryOpened":"있는 폴더 열기를 요청했습니다","presented.revealed":"파일 탐색기에서 보여 주기를 요청했습니다","presented.revealing":"파일 탐색기에서 보여 주는 중…","presented.unavailable":"이 호스트에는 데스크톱이 없어 외부 프로그램으로 파일이나 폴더를 열 수 없습니다. 파일은 사이드바에서 미리 볼 수 있습니다","presented.retry":"다시 시도","presented.hostError":"호스트 데스크톱 정보를 읽을 수 없습니다","presented.preview":"사이드바에서 미리보기","presented.previewButton":"사이드바에서 {name} 열기","presented.previewCard":"사이드바에서 {name} 미리보기","presented.all":"전체 파일 {count}개","presented.expandAria":"결과 파일 {count}개 모두 펼치기","presented.collapse":"접기","presented.collapseAria":"결과 파일 목록 접기","presented.opening":"여는 중…","presented.opened":"열기 요청함","presented.error":"열기 실패. 눌러서 다시 시도","presented.file":"파일","row.title":"결과 파일","row.running":"전달 중","row.preparing":"전달 준비 중","row.ok":"전달됨","row.error":"전달 실패","row.stopped":"중단됨","row.inspect":"호출 보기","changes.title":"파일 {count}개 편집함","changes.singleTitle":"{name} 편집함","changes.added":"+{count}","changes.deleted":"-{count}","changes.binary":"바이너리","changes.openReview":"사이드바에서 이번 턴 변경 보기","changes.all":"전체 파일 {count}개","changes.expandAria":"변경된 파일 {count}개 모두 펼치기","changes.collapse":"접기","changes.collapseAria":"변경된 파일 목록 접기","changes.oversized":"너무 큼","changes.viewDiff":"{name}의 변경 보기","review.title":"{turn}번째 턴 변경","review.selectFile":"볼 파일 선택","review.split":"좌우 비교로 바꾸기","review.unified":"한 칸 비교로 바꾸기","review.splitAria":"좌우 비교","review.wrap":"자동 줄바꿈 켜기","review.nowrap":"자동 줄바꿈 끄기","review.wrapAria":"자동 줄바꿈","review.openFile":"사이드바에서 파일 전체 열기","review.openFileAria":"사이드바에서 {name} 열기","diff.loading":"변경 읽는 중…","diff.missing":"이번 턴의 변경 내용은 더 이상 볼 수 없습니다","diff.error":"변경을 읽을 수 없습니다","diff.binary":"바이너리 파일이라 변경을 보여 줄 수 없습니다","diff.oversized":"파일이 너무 커서 변경을 보여 줄 수 없습니다","diff.created":"이번 턴에 새로 만든 파일","diff.deleted":"이번 턴에 삭제한 파일","diff.unchanged":"양쪽 내용이 같습니다","diff.coarse":"줄 단위 비교 시간이 초과되어 파일 전체 교체로 표시합니다","diff.truncated":"앞쪽 {count}줄만 표시"},"entryCustomization":{"install":"플러그인 더 둘러보기","create":"나만의 플러그인 만들기","createPrompt.sidebar":"왼쪽 사이드바 메뉴가 있는 DSH 플러그인을 만들어 주세요.","createPrompt.conversation":"DSH 세션 보기 플러그인을 만들어 주세요.","createPrompt.rightbar":"오른쪽 사이드바 메뉴가 있는 DSH 플러그인을 만들어 주세요."},"goal":{"phase.active":"진행 중인 목표","phase.active.disarmed":"일시 중지된 목표","phase.paused":"일시 중지된 목표","phase.blocked":"막힌 목표","objective.aria":"목표 내용","commandInput.aria":"명령 입력","action.save":"목표 저장","action.cancel":"편집 취소","action.pause":"목표 일시 중지","action.resume":"목표 다시 시작","action.edit":"목표 편집","action.clear":"목표 지우기"},"slash.menu":{"command":"명령","skill":"스킬","subagent":"하위 에이전트","loading":"불러오는 중…","drill.aria":"폴더로 들어가기","drill.hint":"폴더로 들어가기","drill.key":"Tab","crumbs.aria":"폴더 이동","suggestions.aria":"추천 후보 띄우기"},"job":{"count.live.one":"백그라운드 작업 {count}개 실행 중","count.live.other":"백그라운드 작업 {count}개 실행 중","count.idle.one":"백그라운드 작업 {count}개","count.idle.other":"백그라운드 작업 {count}개","list.aria":"백그라운드 작업","section.live":"진행 중","section.settledCount":"{count}개 끝남","section.clear":"비우기","row.expandAria":"{label} 실시간 출력 펼치기","row.collapseAria":"{label} 실시간 출력 접기","kill.stop":"작업 {label} 중지","kill.confirm":"한 번 더 누르면 중지합니다","kill.confirmAction":"중지 확인","kill.failed":"중지 실패","status.running":"실행 중","status.stopping":"중지하는 중","status.completed":"완료","status.killed":"취소됨","status.failed":"실패함","duration.seconds":"{seconds}초","duration.minutes":"{minutes}분 {seconds}초","duration.hours":"{hours}시간 {minutes}분","duration.title.live":"{duration} 동안 실행 중","duration.title.done":"소요 시간 {duration}","output.gap":"……이전 출력은 버렸습니다……","output.error":"실시간 출력 스트림이 끊겼습니다: {error}","terminal.signal":"신호 {signal}","terminal.exitCode":"종료 코드 {code}","terminal.noExitCode":"정상적으로 종료되지 않음","terminal.commandLine":"명령 {n}번째 줄","terminal.running":"실행 중","terminal.failed":"실패함","terminal.done":"완료","terminal.copy":"복사","terminal.copied":"복사됨","terminal.noOutput":"(출력 없음)","terminal.collapse":"접기","terminal.collapseAria":"출력 접기","terminal.expand":"나머지 {n}줄 펼치기","terminal.expandAria":"접힌 출력 {n}줄 펼치기"},"shortcuts.layout":{"toggle":"왼쪽 사이드바 펼치기/접기"},"feedback":{"action.like":"좋은 답변","action.likeActive":"표시 취소","action.dislike":"문제 있는 답변","action.dislikeActive":"표시 취소","dialog.title":"피드백 보내기","dialog.categories":"피드백 분류","dialog.detail":"피드백 내용","dialog.hint":"더 나은 경험을 위해 자세히 적어 주세요. 보낸 내용에는 현재 대화의 로그가 포함됩니다","category.task-result":"작업 결과","category.instruction-following":"지시 이해와 수행","category.product-interaction":"제품 기능과 사용성","category.service-stability":"안정성과 속도","category.resource-cost":"자원 사용과 비용","category.security-privacy-permission":"보안·개인정보·권한","category.other":"기타","toast.recorded":"피드백 감사합니다","error.conflict":"이 피드백은 다른 곳에서 바뀌어 최신 상태로 보여 줍니다","error.load":"피드백 상태를 불러오지 못했습니다","error.generic":"피드백을 저장하지 못했습니다","error.noteTooLarge":"설명이 너무 깁니다. 줄인 뒤 보내 주세요"},"model":{"provider.account":"DeepSeek 계정","command.label":"모델","command.description":"이 세션에서 쓸 모델 선택","option.loadError":"목록 불러오기 실패: {message}","trigger.fallback":"모델을 고르세요","trigger.loading":"모델 불러오는 중…","trigger.selectAria":"모델을 고르세요","trigger.aria":"모델 선택, 현재 {model}","trigger.ariaEffort":"모델 선택, 현재 {model}, 추론 수준 {effort}","menu.aria":"모델과 추론 수준","menu.model":"모델","menu.effort":"추론 수준","effort.providerDefault":"Default","status.loading":"모델 목록 새로 고치는 중…","error.action":"모델 작업 실패: {message}","error.sessionInUse":"현재 세션을 다른 곳에서 쓰고 있습니다. 다른 DSH(다른 dsh web, 데스크톱 앱 등)가 실행 중일 수 있으니 끈 뒤 다시 시도하세요.","action.reload":"다시 불러오기","warning.groupLoad":"{name} 불러오기 실패: {message}","search.placeholder":"모델 검색…","search.clear":"검색 지우기","search.empty":"일치하는 모델이 없습니다.","empty.models":"쓸 수 있는 모델이 없습니다","empty.efforts":"현재 모델은 추론 수준을 제공하지 않습니다."},"open-in-app":{"open.title":"{app}(으)로 열기","path.appDefault":"{app}(기본)","path.appsError":"앱 목록을 가져올 수 없습니다","shortcut.busy":"작업 공간 여는 중","shortcut.unavailable":"현재 작업 공간이나 로컬 앱을 쓸 수 없습니다","open.tooltip":"로컬에서 열기","path.open":"열기","path.more":"다른 방법으로 열기","path.reveal":"파일 위치 보기","path.openError":"열기 실패. 다시 시도하세요","path.revealError":"파일 위치를 보여 줄 수 없습니다. 다시 시도하세요","app.cursor":"Cursor","app.vscode":"VS Code","app.vscodeinsiders":"VS Code Insiders","app.windsurf":"Windsurf","app.zed":"Zed","app.sublimetext":"Sublime Text","app.xcode":"Xcode","app.androidstudio":"Android Studio","app.intellij":"IntelliJ IDEA","app.pycharm":"PyCharm","app.webstorm":"WebStorm","app.phpstorm":"PhpStorm","app.goland":"GoLand","app.rider":"Rider","app.rustrover":"RustRover","app.fork":"Fork","app.sourcetree":"Sourcetree","app.github":"GitHub Desktop","app.tower":"Tower","app.gitkraken":"GitKraken","app.smartgit":"SmartGit","app.sublimemerge":"Sublime Merge","app.ghostty":"Ghostty","app.warp":"Warp","app.iterm":"iTerm2","app.kitty":"kitty","app.windowsterminal":"Windows Terminal","app.gitbash":"Git Bash","app.gnometerminal":"GNOME Terminal","app.konsole":"Konsole","app.finder":"Finder","app.explorer":"파일 탐색기","app.filemanager":"파일 관리자","app.terminal":"터미널"},"permission.access":{"mode":"접근 모드, 현재: {name}","close":"닫기","preset.readOnly":"보기만 가능","preset.workspaceWrite":"작업 공간 안에서 수정","preset.fullAccess":"전체 권한","confirm.title":"전체 권한을 켤까요?","confirm.description":"전체 권한을 켜면 에이전트의 확인 단계가 줄고, 민감한 작업, 파일 수정, 외부 명령을 포함해 더 많은 작업을 바로 실행할 수 있습니다. 현재 작업을 믿을 때만 쓰세요.","confirm.acknowledge":"위험을 이해했고 계속하겠습니다","confirm.cancel":"취소","confirm.enable":"전체 권한 켜기","auto.label":"자동 검토","auto.badge":"EXP","auto.description":"샌드박스 없이 실행합니다. 기본 도구 호출과 PTC 내부 호출마다 같은 모델이 먼저 실험적으로 검토합니다.","auto.confirm.title":"자동 검토(실험)를 켤까요?","auto.confirm.description":"자동 검토는 샌드박스를 쓰지 않습니다. 기본 도구 호출과 PTC 내부 호출마다 현재 에이전트와 같은 모델이 먼저 검토하고, 검토에서 거부된 호출은 사용자가 승인하거나 거부합니다. 아직 실험 기능이라 잘못 통과시키거나 잘못 거부할 수 있고, 토큰을 더 씁니다.","auto.confirm.acknowledge":"이 위험을 이해했고 계속하겠습니다","auto.confirm.enable":"자동 검토 켜기"},"settings.permission":{"title":"권한","description":"새 세션의 기본 권한 모드 선택","loading":"불러오는 중","unavailable":"쓸 수 없음","preset.readOnly":"보기만 가능","preset.workspaceWrite":"작업 공간 안에서 수정","preset.fullAccess":"전체 권한","confirm.title":"전체 권한을 켤까요?","confirm.description":"전체 권한을 켜면 새 세션에서 확인 단계가 줄고, 민감한 작업, 파일 수정, 외부 명령을 포함해 더 많은 작업을 바로 실행할 수 있습니다. 이어질 작업을 믿을 때만 쓰세요.","confirm.acknowledge":"위험을 이해했고 계속하겠습니다","confirm.cancel":"취소","confirm.enable":"전체 권한 켜기"},"plan":{"chip.label":"계획","preview.title":"계획","preview.document":"계획 · Markdown","preview.action":"열기","preview.open":"사이드바에서 계획 열기","preview.full":"전체 보기","preview.openNamed":"계획 열기: {title}","preview.loading":"계획 읽는 중…","preview.failed":"계획을 읽을 수 없습니다","preview.invalidAddress":"계획 주소가 올바르지 않습니다","preview.historyUnavailable":"세션 기록을 읽을 수 없습니다","preview.notFound":"이 계획을 찾지 못했습니다","preview.unavailable":"계획 미리보기를 쓸 수 없습니다","preview.expired":"임시 계획 미리보기가 만료되었습니다. 아직 승인을 기다리는 카드에서 다시 여세요.","chip.on.aria":"계획 모드가 켜져 있습니다. 누르면 끕니다","chip.on.title":"계획 모드 켜짐 — 눌러서 끄기(/plan off)","chip.exitFailed":"계획 모드를 끄지 못했습니다"},"pluginManager":{"panel":"플러그인","title":"플러그인","intro":"플러그인 설치, 활성화, 설정","infoLabel":"플러그인 설명","infoDescription":"여기서 공식 플러그인을 설정하고 다른 플러그인을 설치·관리합니다. 기본 제공 플러그인 목록과 실행 상태는 ‘설정 → 기본 제공 플러그인’에서 볼 수 있습니다","loading":"플러그인 읽는 중…","error":"네트워크 문제로 플러그인을 모두 읽지 못했을 수 있습니다","unavailable":"이 배포에는 관리할 프로필이 없어 플러그인을 설치하거나 켜고 끌 수 없습니다.","retry":"다시 시도","refresh":"새로 고침","refreshError":"새로 고침 실패. 다시 시도하세요","empty":"설치한 플러그인이 없습니다.","addPlugin":"플러그인 추가","chooseAddMethod":"플러그인 추가 방법 선택","installExisting":"서드파티 플러그인 설치","installExistingDescription":"npm 패키지, Git 저장소, 로컬 폴더를 지원합니다","restartNotice":"변경을 적용하려면 DSH를 다시 시작하세요. {reason}","restartReasonNoHmr":"이 프로필은 시작할 때만 변경을 적용합니다.","restartReasonPackageMoved":"설치된 플러그인 패키지가 다른 폴더를 가리키거나, 변경이 DSH 설치에 포함된 패키지를 대체했습니다. 다른 위치에서 설치하기 전에 먼저 제거하세요.","restartReasonHostModule":"변경이 DSH 자체가 불러온 모듈과 관련됩니다.","restartReasonUnmanagedPlugin":"변경이 플러그인 목록에서 관리하지 않는 플러그인과 관련됩니다.","restartReasonModuleComparison":"DSH가 불러온 플러그인을 디스크의 파일과 비교할 수 없습니다.","overriddenNotice":"{name}은(는) 저장됐지만 우선순위가 더 높은 설정에 덮여 지금은 적용되지 않습니다","bundlesTitle":"설치한 플러그인","basicTitle":"기본 제공 플러그인 설정","extensionsTitle":"실험적 플러그인","moreTitle":"실험적 플러그인","moreAction":"더 보기","tabsLabel":"플러그인 보기","installedTab":"설치됨","statusProblem":"이상","statusBeta":"실험적","reasonLabel":"원인","metadataError":"패키지 메타 정보 오류: {error}","previewAlt":"{name} 기능 미리보기","previewUnavailable":"기능 그림을 보여 줄 수 없습니다","versionTag":"v{version}","partsLabel":"포함된 구성 요소","sourceTitle":"출처 정보","sourceSpec":"코드 출처","sourceBuiltIn":"기본 제공","sourceVersion":"현재 버전","partsEmpty":"이 플러그인 패키지에는 구성 요소가 없습니다.","partsCountTotal":"총 {count}개","partsCountRunning":"{count}개 실행 중","partsCountOff":"{count}개 꺼짐","partOff":"꺼짐","partsCountFailed":"{count}개 이상","partsFilter":"구성 요소 필터","partsFilterEmpty":"일치하는 구성 요소가 없습니다.","partToggle":"구성 요소 {name} 켜기","rowPhasePending":"의존성 대기 중","rowPhaseLoading":"불러오는 중","rowPhaseActive":"실행 중","rowPhaseFailed":"이상","rowPhaseUnloading":"제거 중","enableToggle":"{name} 켜기","openDetail":"{name} 보기","backToList":"플러그인으로 돌아가기","crumbRoot":"플러그인","backToPackage":"{name}(으)로 돌아가기","configureRow":"{name} 설정","rowStateIdle":"실행 안 함","uninstall":"제거","uninstallLabel":"{name} 제거","installTitle":"플러그인 추가","installDescription":"플러그인 패키지 이름, GitHub 저장소 주소, 로컬 폴더 경로를 입력하세요.","installSpecLabel":"패키지 이름 또는 주소","installSpecPlaceholder":"예: dsh-plugin-whale-pet","installGuideToggle":"플러그인 설치 안내와 예시","installGuideHide":"안내 접기","installGuideIdTitle":"플러그인 npm 패키지 이름 입력","installGuideIdExample":"dsh-plugin-whale-pet","installGuideIdHint":"플러그인 패키지 이름은 npm 패키지 이름(dsh-xxx 또는 @작성자/플러그인이름)입니다. 커뮤니티 플러그인 README의 설치 명령에서 dsh plugin add 또는 pnpm add 뒤에 오는 부분입니다.","installGuideExampleLabel":"예시: ","installGitTemplateHint":"실제 Git 저장소 주소로 바꾸세요","installPathTemplateHint":"이 PC의 실제 플러그인 폴더 경로로 바꾸세요","installGuideFill":"예시 넣기","installGuideFillAria":"예시 {example} 넣기","installGuideSafety":"플러그인 출처를 믿을 수 있는지 확인하세요. 플러그인은 이 PC에서 사용자 권한으로 실행되며, 출처가 불분명한 플러그인은 DeepSeek Harness를 망가뜨리거나 데이터를 읽고 빼돌릴 수 있습니다.","installUpgradeNotice":"필요할 때 설치하는 공식 플러그인은 버전이 DSH와 다르면 ‘업데이트’가 나타납니다. 다른 플러그인은 먼저 제거한 뒤 새 버전을 설치하세요.","registryToggle":"설치 소스","registryLegend":"플러그인을 내려받을 npm 소스","registryDefault":"기본 설치 소스","registryOfficial":"npm 공식 소스","registryNpmmirror":"중국 본토 미러","registryCustom":"사용자 지정 주소","registryCustomPlaceholder":"https://npm.example.com/","registryCustomHint":"사내망이나 비공개 npm 소스 주소를 http:// 또는 https://로 시작해 입력하세요. 로그인이 필요한 소스라면 자격 증명은 이 PC의 ~/.npmrc에 넣으세요.","registryCustomInvalid":"http:// 또는 https://로 시작하는 주소를 입력하세요","registryListSeparator":"、","sentenceSeparator":"","installRun":"설치","installChecking":"확인하는 중…","installConfirmedTitle":"플러그인 설치","installConfirmedRefused":"이 플러그인을 설치할 수 없습니다","installProblemInvalid":"이 패키지 이름이나 주소를 알아볼 수 없습니다: {reason}","installProblemInstalled":"이미 설치된 플러그인입니다. 업그레이드하려면 제거한 뒤 다시 설치하세요","installProblemShipped":"이 플러그인은 DSH에 포함되어 있습니다. DSH를 업그레이드하면 새 버전이 들어옵니다","installProblemNotFound":"관련 플러그인을 찾지 못했습니다","installProblemNotPackage":"경로가 없거나 올바른 플러그인 패키지가 아닙니다","installProblemNotBundle":"이 패키지는 번들을 선언하지 않아 플러그인으로 설치할 수 없습니다: {reason}","installProblemNetwork":"플러그인 소스에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도하세요","installProblemNetworkAll":"모든 설치 소스에 연결할 수 없습니다(시도함: {registries}). 네트워크나 프록시 설정을 확인하거나 설치 소스를 바꾸세요","installProblemUnknown":"플러그인 정보를 가져올 수 없습니다: {reason}","installingTitle":"플러그인 설치 중…","installedTitle":"설치됨","statusNotInstalled":"설치 안 됨","statusMissingFiles":"패키지를 쓸 수 없음","statusUpdateAvailable":"업데이트 가능","sourceNotInstalled":"설치 안 됨","sourceTargetSpec":"현재 DSH에 맞는 출처","sourceTargetVersion":"현재 DSH에 맞는 버전","update":"업데이트","updateLabel":"{name} 업데이트","installFailedTitle":"플러그인 설치 실패","installGithubFailedTitle":"GitHub에 접속할 수 없습니다","installGithubTimeoutTitle":"GitHub 연결 시간 초과","installGithubFailedDescription":"다른 설치 출처를 시도해 보세요.","installUseGithubMirror":"중국 미러로 바꾸기","installTryAnotherWay":"다른 방법 시도","installPackageLabel":"플러그인 패키지 이름","installEdit":"편집","installEditAria":"편집으로 돌아가기","installCancelAndEdit":"설치 취소하고 편집으로 돌아가기","installApplyingCancellationError":"취소 요청이 확인되지 않았습니다. 설치가 마무리 단계에 들어갔으니 결과를 기다리세요. {reason}","installReconcile":"설치 상태 확인","installUnknownTitle":"설치 결과를 가져오지 못했습니다","installUnknownDescription":"백엔드에 이 설치 작업이 없습니다. 플러그인 목록을 확인한 뒤 다시 설치하세요.","installResultUnconfirmed":"설치 결과를 받지 못했습니다. 설치 상태를 확인하세요. {reason}","installAwaitingAcceptance":"백엔드가 설치 작업을 받기를 기다리는 중입니다. 확인되면 취소를 자동으로 다시 시도합니다.","installBackgroundUnknown":"설치 결과를 가져오지 못했습니다. 플러그인 목록을 확인하세요.","installCancel":"설치 취소","installCloseCancels":"설치 취소하고 닫기","installViewTask":"설치 작업 보기","installUnconfirmedTitle":"설치 상태가 아직 확인되지 않음","installBackgroundDone":"플러그인 설치가 끝났습니다. 설치 결과를 볼 수 있습니다.","installBackgroundFailed":"플러그인 설치에 실패했습니다. 설치 상세를 볼 수 있습니다.","installBackgroundUnconfirmed":"설치 상태가 아직 확인되지 않았습니다. 설치 작업에서 자세히 보세요.","installBackgroundApplying":"설치가 마무리 단계라 취소할 수 없습니다. 설치 진행 상황을 볼 수 있습니다.","installStarting":"설치 준비 중…","installCancelling":"설치 중지하는 중…","installApplying":"설정 적용 중입니다. 잠시 기다리세요…","installCancelledShort":"취소됨","installCancelled":"설치를 취소했습니다. 플러그인은 켜지지 않았고, 내려받은 파일은 남아 있을 수 있습니다","installCancelUnconfirmed":"설치가 멈췄는지 아직 확인되지 않았습니다. 취소를 다시 시도하거나 설치 결과를 기다리세요. {reason}","installEnableNow":"바로 켜기","installDetailsShow":"설치 상세 보기","installDetailsHide":"설치 상세 접기","installVersion":"버전 {version}","installSubjectPath":"로컬 폴더","installSubjectGit":"Git 저장소","installSubjectTarball":"압축 파일","installLocation":"설치 위치: {dir}","installRetry":"다시 시도","installChangeRegistry":"설치 소스 바꾸기","installAttempt":"{previous}을(를) 쓸 수 없어 {registry}(으)로 다시 시도합니다(소스 {total}개 중 {index}번째)","installAttemptBadge":"{index}번째 · {registry}","installFailureNetwork":"네트워크 연결 실패","installFailureNetworkAll":"모든 설치 소스에 연결할 수 없습니다(시도함: {registries}). 네트워크나 프록시 설정을 확인하거나 설치 소스를 바꾼 뒤 다시 시도하세요.","installFailureNetworkHost":"{host}에 연결할 수 없습니다. GitHub 주소와 .tgz 직접 링크는 설치 소스를 거치지 않으므로 이 PC에서 바로 접속되거나 프록시가 설정되어 있어야 합니다. 이 플러그인이 npm에도 올라와 있다면 패키지 이름을 대신 넣으세요.","installFailureNotFound":"관련 플러그인을 찾지 못했습니다","installFailureNoMatchingVersion":"일치하는 버전이 없습니다","installFailureDiskFull":"디스크 공간이 부족해 설치를 멈췄습니다","installFailurePermission":"쓰기 권한이 없어 설치할 수 없습니다","installFailureBuildBlocked":"의존성의 설치 스크립트를 허용해야 계속할 수 있습니다","installFailureBuildBlockedManual":"의존성의 설치 스크립트를 pnpm이 막았습니다. 프로필의 pnpm-workspace.yaml에 있는 allowBuilds에서 허용한 뒤 다시 시도하세요","installFailureIntegrity":"내려받은 설치 패키지 검증에 실패했습니다","installFailureTimeout":"설치 시간 초과","installFailurePnpmMissing":"pnpm을 찾지 못해 설치할 수 없습니다","installFailureGeneric":"설치 중 오류가 났습니다. 원인은 설치 상세를 보세요","terminalCommandLine":"명령 {n}번째 줄","terminalRunning":"실행 중","terminalFailed":"실패","terminalDone":"완료","terminalCopy":"복사","terminalCopied":"복사됨","terminalNoOutput":"출력 없음","terminalCollapseAria":"출력 접기","terminalCollapse":"접기","terminalExpandAria":"나머지 출력 {n}줄 펼치기","terminalExpand":"… 나머지 {n}줄","terminalExitCode":"종료 코드 {code}","terminalSignal":"신호 {signal}","terminalNoExitCode":"정상적으로 종료되지 않음","installDoneNothing":"설치 완료. 새로 추가된 의존성은 없습니다.","installDoneRestart":"설치했습니다. 불러오려면 DSH를 다시 시작하세요. {reason}","installDoneApproved":"설치 스크립트 실행을 허용함: {names}","installDoneOtherVersion":"pnpm 공급망 보안 정책(minimumReleaseAge)에 따라 공개된 지 정해진 기간이 지나지 않은 버전은 자동으로 설치하지 않습니다. 그래서 이번에는 최신 버전 {version}이 아니라 {installed}을(를) 설치했습니다. 새로 공개된 버전은 아직 관찰 기간을 거치지 않아 발견되지 않은 악성 코드나 결함이 있을 수 있습니다. 꼭 {version}이 필요하면 현재 버전을 제거한 뒤 {exact}로 버전을 지정해 설치하세요.","installApprovalTitle":"설치 스크립트 허용 필요","installApprovalDescription":"아래 패키지는 설치 스크립트를 선언했습니다. pnpm은 기본적으로 실행하지 않습니다.","installApprovalConsequence":"허용하면 스크립트가 이 PC에서 사용자 권한으로 실행됩니다. 허용은 현재 프로필에 저장되어 다시 묻지 않습니다.","installApprovalCaution":"이 패키지들을 믿을 때만 허용하세요.","installApproveAndRetry":"이 스크립트를 허용하고 다시 시도","installClose":"완료","close":"닫기","cancel":"취소","confirmUninstallTitle":"‘{name}’을(를) 제거할까요?","confirmUninstallDescription":"제거하면 이 플러그인이 제공하던 기능이 사라집니다.","confirmUninstall":"제거","failedEnable":"켜기 실패: {reason}","failedDisable":"끄기 실패: {reason}","failedUninstall":"제거 실패: {reason}","failedRowEnable":"구성 요소 켜기 실패: {reason}","failedRowDisable":"구성 요소 끄기 실패: {reason}","reasonManagementRequired":"플러그인 관리에 필요해 끄거나 제거할 수 없습니다","reasonUnaddressable":"현재 프로필의 패치로는 이 항목을 하나로 특정할 수 없습니다","reasonUnknownPlugin":"이 플러그인을 찾을 수 없습니다","reasonInvalidSpec":"올바른 패키지 이름이나 주소를 입력하세요","reasonAlreadyInstalled":"이미 설치된 패키지입니다. 다른 버전을 설치하려면 먼저 제거하세요","reasonAmbiguousInstall":"의존성 변경에서 어떤 패키지가 설치됐는지 알 수 없습니다","reasonNotBundle":"이 패키지는 번들을 선언하지 않아 플러그인으로 관리할 수 없습니다","reasonNotRemovable":"이 패키지는 현재 프로필에 속하지 않거나 플러그인 관리에 필요한 구성 요소입니다","reasonStopProfile":"이 프로필은 HMR이 꺼져 있습니다. 사용 중인 패키지는 멈춘 뒤 dsh plugin으로 제거하세요","reasonBundleInUse":"다른 설정에서 아직 이 번들의 구성 요소를 쓰고 있습니다. 먼저 그것들을 끄세요","reasonStaleApproval":"허용 대기 중인 설치 스크립트 목록이 바뀌었습니다. 새로 고치려면 다시 설치하세요","reasonIncompatibleVersion":"{plugin}은(는) DSH {runtime}과(와) 호환되지 않습니다(요구 사항: {requirements}). 실행하면 충돌하거나 데이터가 사라질 수 있습니다.","reasonIncompatibleVersionUnnamed":"이 플러그인은 현재 DSH 버전과 호환되지 않습니다. 실행하면 충돌하거나 데이터가 사라질 수 있습니다.","reasonIncompatibleInstall":"현재 DSH와 호환되는 플러그인 버전을 설치하세요.","reasonIncompatibleInstalled":"제거한 뒤 현재 DSH와 호환되는 버전을 다시 설치하세요.","reasonOperationError":"호스트가 오류를 보고했습니다"},"pluginMarket":{"title":"둘러보기","refresh":"새로 고침","loading":"색인 읽는 중","retry":"다시 시도","close":"닫기","cancel":"취소","emptyTitle":"아직 플러그인 마켓이 없습니다","emptyDescription":"플러그인 마켓 색인을 추가하면 여기서 플러그인을 둘러보고 설치할 수 있습니다","addFirstSource":"색인 소스 추가","sourcesFailed":"색인 소스를 읽을 수 없습니다","manageSources":"색인 소스 관리…","marketMenu":"플러그인 마켓 바꾸기, 현재 {market}","sourcesTitle":"색인 소스","sourcesDescription":"플러그인 마켓은 색인 파일의 URL로 제공됩니다. ‘둘러보기’는 여기 있는 색인에서 플러그인을 보여 줍니다","sourcesLabel":"추가한 색인 소스","sourceUrl":"색인 URL","sourcePlaceholder":"https://example.com/index.json","addSource":"추가","removeSource":"제거","removeSourceNamed":"{url} 제거","sourcesTrust":"색인은 제3자가 제공합니다. 믿을 수 있는 출처만 추가하세요. 그 안의 플러그인은 설치하면 사용자 권한으로 실행됩니다","sourceInvalid":"http 또는 https 주소를 쓰고, 사용자 이름, 비밀번호, # 조각은 넣지 마세요","sourceDuplicate":"이미 추가한 색인 소스입니다","sourceUnavailable":"현재 환경에서는 색인 소스를 저장할 수 없습니다","sourceFailed":"색인 소스를 저장할 수 없습니다","readFailed":"이 색인을 읽을 수 없습니다","readInvalid":"이 색인의 형식이 올바르지 않습니다","readChanged":"이 색인이 불러오는 도중에 바뀌었습니다","search":"플러그인 검색","filter":"태그","filterCount":"태그 · {count}","sortBy":"정렬: {sort}","sortRelevance":"가장 잘 맞는 순","sortDefault":"기본 순서","sortPublished":"공개일","switchToAscending":"오름차순으로","switchToDescending":"내림차순으로","categoriesLabel":"분류","allCategories":"전체","emptyIndex":"이 색인에는 플러그인이 없습니다","noMatches":"조건에 맞는 플러그인이 없습니다","showMore":"더 보기","entryMeta":"{version} · {date}","entryMetaAuthor":"{version} · {author} · {date}","openEntry":"{name} 보기","install":"설치","installTitle":"{name} 설치","installVersionTitle":"{name} {version} 설치","openInstalled":"설치됨에서 {name} 보기","statusInstalled":"설치됨","statusUpdate":"새 버전 있음","statusProvided":"DSH에 포함","incompatible":"이 버전은 현재 DSH {runtime}과(와) 호환되지 않습니다. DSH {range}가 필요합니다","noCompatibleVersion":"현재 DSH {runtime}과(와) 호환되는 버전이 없습니다","exempted":"이 버전은 현재 DSH와 호환되지 않지만, 호환성 예외를 설정해 두었습니다","backToList":"둘러보기","factSource":"출처","factPackage":"패키지","factRegistry":"레지스트리","factRepository":"저장소","factCommit":"제출","factDirectory":"폴더","factPublished":"공개일","factAuthor":"작성자","factHomepage":"홈페이지","factSourceCode":"소스 코드","factCategory":"분류","factLabels":"태그","factMarket":"플러그인 마켓","versionsTitle":"버전","versionsLabel":"{name}의 버전","versionDefault":"추천","versionInstalled":"현재 설치됨","versionIncompatible":"호환 안 됨","versionExempted":"예외 처리됨","versionPrerelease":"사전 공개","confirmTitle":"‘{name}’을(를) 설치할까요?","installTrust":"플러그인은 이 PC에서 사용자 권한으로 실행됩니다. 출처를 믿을 수 있는지 확인하세요"},"reference":{"section.files":"파일과 폴더","section.subagents":"하위 에이전트","section.sessions":"대화","candidate.noCwd":"(작업 폴더 없음)","crumb.root":"작업 공간","fileOpen.title":"파일을 열 수 없습니다","fileOpen.failed":"“{path}”을(를) 열 수 없습니다. 다시 시도하거나 이 안내를 닫으세요","fileOpen.close":"닫기","fileOpen.retry":"다시 시도","time.now":"방금","time.minutes":"{n}분","time.hours":"{n}시간","time.days":"{n}일","time.months":"{n}개월","time.years":"{n}년"},"schedule.catalog":{"trigger.label":"알림","list.loading":"알림 불러오는 중…","list.error":"알림을 불러올 수 없습니다.","list.retry":"다시 시도","delete.action":"삭제","delete.pending":"삭제하는 중…","delete.label":"알림 삭제: {title}","list.open":"알림 상세 열기: {title}","trigger.one":"알림 {count}개","trigger.other":"알림 {count}개","list.aria":"활성 알림","list.nextRun":"다음 실행","frequency.once":"한 번","frequency.every":"{value}{unit}마다 한 번","time.locale":"ko-KR","time.utcPrefix":"UTC","frequency.daily":"매일 {time}({timeZone})","frequency.dailyLocal":"매일 {time}","frequency.weekly":"매주 {weekdays} {time}({timeZone})","frequency.weeklyLocal":"매주 {weekdays} {time}","frequency.cron":"Cron {expression}（{timeZone}）","frequency.cronLocal":"Cron {expression}","frequency.cronRule":"{rule}（{timeZone}）","cron.list.join":"、","cron.part.join":" ","cron.weekday.name":"{weekday}요일","cron.weekday.range":"{from}~{to}","cron.months":"（{months}）","cron.day.every":"매일{months}","cron.day.weekdays":"{weekdays}{months}","cron.day.monthDays":"매월 {days}일{months}","cron.day.both":"매월 {days}일 또는 {weekdays}{months}","cron.day.bothStarred":"매월 {days}일이면서 {weekdays}{months}","cron.hours.range":"{from} ~ {to}","cron.hours.list":"{hours}","cron.time.everyMinute":"매분","cron.time.everyMinutes":"{step}분마다","cron.time.joinedEveryMinute":"매분","cron.time.joinedEveryMinutes":"{step}분마다","cron.time.everyHour":"매시간","cron.time.joinedEveryHour":"매시간","cron.time.everyNHours":"{count}시간마다","cron.time.joinedEveryNHours":"{count}시간마다","cron.time.hourlyAt":"매시 {minutes}분","cron.time.joinedHourlyAt":"매시 {minutes}분","cron.time.hoursEveryMinute":"{hours}시 매분","cron.time.hoursEveryMinutes":"{hours}시 동안 {step}분마다","cron.time.at":"{times}","cron.time.hoursAt":"{hours}시 {minutes}분","frequency.weekday.join":"、","frequency.weekday.1":"월","frequency.weekday.2":"화","frequency.weekday.3":"수","frequency.weekday.4":"목","frequency.weekday.5":"금","frequency.weekday.6":"토","frequency.weekday.7":"일","unit.day.one":"일","unit.day.other":"일","unit.hour.one":"시간","unit.hour.other":"시간","unit.minute.one":"분","unit.minute.other":"분","unit.second.one":"초","unit.second.other":"초","relative.now":"지금 실행 시각","relative.future":"{value}{unit} 후","relative.overdue":"{value}{unit} 지남","mark.aria":"자동화 작업 {count}개","hover.more":"작업 {count}개 더 있음"},"schedule.manager":{"panel":"자동화 작업","title":"자동화 작업","new.action":"새로 만들기","list.label":"작업 목록","list.nextPrefix":"다음 예정 시간: ","list.loading":"작업 불러오는 중…","list.error":"작업을 불러올 수 없습니다","list.retry":"다시 시도","list.empty":"아직 자동화 작업이 없습니다. 세션에서 만든 작업이 여기 표시됩니다","list.emptyInactive":"끝난 자동화 작업이 없습니다","list.noMatches":"일치하는 자동화 작업이 없습니다","search.label":"작업 검색","search.placeholder":"자동화 작업 검색","search.clear":"검색 지우기","empty.action":"새 자동화 작업","statusFilter.label":"작업 상태","statusFilter.all":"전체","status.active":"켜짐","status.inactive":"끝남","detail.label":"작업 상세","detail.close":"상세 닫기","detail.more":"자동화 작업 메뉴","detail.nextRun":"다음 실행","detail.tabs":"작업 상세 보기","detail.rule":"규칙","detail.records":"작업 실행 기록","delivery.empty":"작업 실행 기록이 없습니다","delivery.loading":"작업 실행 기록 불러오는 중…","delivery.error":"작업 실행 기록을 불러올 수 없습니다","delivery.notFound":"작업을 더 이상 쓸 수 없습니다","delivery.cursorError":"기록이 업데이트됨","delivery.retry":"다시 시도","delivery.refresh":"새로 고침","delivery.loadMore":"더 불러오기","delivery.expand":"펼치기","delivery.collapse":"접기","delivery.pruned":"이전 실행 기록은 정리되었습니다","delivery.retention":"보관 규칙","delivery.retentionBounds":"작업마다 최근 {days}일 안의 실행 기록을 최대 {records}개까지 보관합니다.","delivery.retentionExplanation":"새 기록이 생기면 범위를 벗어난 오래된 기록은 자동으로 정리됩니다. 기록을 정리해도 작업은 계속 실행됩니다.","detail.name":"자동화 작업 이름","detail.instruction":"자동화 작업 내용","detail.status":"상태","detail.next":"다음 예정 시간","detail.frequency":"알림 빈도","detail.id":"작업 ID","detail.session":"연결된 세션","detail.openSession":"연결된 세션: 원래 세션 열기","detail.openSessionTitle":"연결된 세션 {title}: 원래 세션 열기","detail.sessionLoading":"원래 세션 정보 불러오는 중","detail.sessionArchived":"원래 세션이 보관됨","detail.sessionUnavailable":"원래 세션을 지금 쓸 수 없습니다","detail.missing":"작업을 더 이상 쓸 수 없습니다. 삭제됐을 수 있습니다","delivery.label":"저장된 작업 실행 기록","frequency.once":"한 번만","frequency.every":"{value}{unit}마다","time.locale":"ko-KR","time.utcPrefix":"UTC","frequency.daily":"매일 {time}({timeZone})","frequency.dailyLocal":"매일 {time}","frequency.weekly":"매주 {weekdays} {time}({timeZone})","frequency.weeklyLocal":"매주 {weekdays} {time}","frequency.cron":"Cron {expression}（{timeZone}）","frequency.cronLocal":"Cron {expression}","frequency.cronRule":"{rule}（{timeZone}）","cron.list.join":"、","cron.part.join":" ","cron.weekday.name":"{weekday}요일","cron.weekday.range":"{from}~{to}","cron.months":"（{months}）","cron.day.every":"매일{months}","cron.day.weekdays":"{weekdays}{months}","cron.day.monthDays":"매월 {days}일{months}","cron.day.both":"매월 {days}일 또는 {weekdays}{months}","cron.day.bothStarred":"매월 {days}일이면서 {weekdays}{months}","cron.hours.range":"{from} ~ {to}","cron.hours.list":"{hours}","cron.time.everyMinute":"매분","cron.time.everyMinutes":"{step}분마다","cron.time.joinedEveryMinute":"매분","cron.time.joinedEveryMinutes":"{step}분마다","cron.time.everyHour":"매시간","cron.time.joinedEveryHour":"매시간","cron.time.everyNHours":"{count}시간마다","cron.time.joinedEveryNHours":"{count}시간마다","cron.time.hourlyAt":"매시 {minutes}분","cron.time.joinedHourlyAt":"매시 {minutes}분","cron.time.hoursEveryMinute":"{hours}시 매분","cron.time.hoursEveryMinutes":"{hours}시 동안 {step}분마다","cron.time.at":"{times}","cron.time.hoursAt":"{hours}시 {minutes}분","frequency.weekday.join":"、","frequency.weekday.1":"월","frequency.weekday.2":"화","frequency.weekday.3":"수","frequency.weekday.4":"목","frequency.weekday.5":"금","frequency.weekday.6":"토","frequency.weekday.7":"일","unit.day.one":"일","unit.day.other":"일","unit.hour.one":"시간","unit.hour.other":"시간","unit.minute.one":"분","unit.minute.other":"분","unit.second.one":"초","unit.second.other":"초","relative.now":"지금 실행 시각","relative.future":"{value}{unit} 후","relative.overdue":"{value}{unit} 지남","timing.date":"날짜","timing.time":"시간","timing.hour":"시","timing.minute":"분","timing.second":"초","timing.prevMonth":"지난달","timing.nextMonth":"다음 달","timing.zone":"시간대","timing.zoneSearch":"UTC 오프셋, IANA 식별자, 도시 검색","timing.zoneNoResults":"일치하는 시간대가 없습니다","timing.interval":"반복 간격","timing.intervalIncrease":"간격 늘리기","timing.intervalDecrease":"간격 줄이기","timing.unit.hour":"시간","timing.unit.minute":"분","timing.unit.second":"초","timing.intervalHint.hour":"최소 1시간. 간격은 작업을 만들거나 규칙을 마지막으로 고친 때부터 세며, 시간대와 상관없습니다","timing.intervalHint.minute":"최소 1분. 간격은 작업을 만들거나 규칙을 마지막으로 고친 때부터 세며, 시간대와 상관없습니다","timing.intervalHint.second":"최소 60초. 간격은 작업을 만들거나 규칙을 마지막으로 고친 때부터 세며, 시간대와 상관없습니다","timing.zoneNoStored":"한 번 실행 작업은 실행 시각만 저장하고 시간대는 저장하지 않습니다. 날짜와 시간은 고른 시간대로 환산합니다","timing.inactive":"끝난 작업은 읽기 전용이라 시간을 고칠 수 없습니다","timing.conflict":"편집하는 동안 작업이 바뀌어 초안은 남겨 두었습니다. 새로 고친 뒤 취소하고 편집기를 다시 열어 최신 규칙을 수정하세요","timing.notFound":"이 작업은 지금 쓸 수 없어 초안은 남겨 두었습니다. 취소해서 편집기를 닫으세요","timing.subagentSession":"이 세션은 하위 에이전트의 것이라 알림을 받지 못합니다","timing.invalid":"올바른 날짜와 시간을 입력하거나 시간 칸을 확인하세요","timing.invalidZone":"올바른 IANA 시간대를 입력하세요. 예: Asia/Seoul","timing.notFuture":"앞으로의 날짜와 시간을 고르세요","timing.invalidInterval":"1분 이상의 간격을 입력하세요","timing.invalidInterval.hour":"1시간 이상의 간격을 입력하세요","timing.invalidInterval.minute":"1분 이상의 간격을 입력하세요","timing.invalidInterval.second":"60초 이상의 간격을 입력하세요","timing.error":"시간 수정이 저장됐는지 확인할 수 없습니다. 초안은 남겨 두었으니 다시 시도하기 전에 작업을 확인하세요","rule.title":"실행 시간","rule.repeat":"반복","rule.weekday":"요일","rule.weekdayOption":"{weekday}요일","rule.unsaved":"저장하지 않은 수정이 있습니다","rule.save":"수정 저장","rule.saving":"저장 중…","rule.cancel":"취소","rule.invalidTitle":"작업 이름은 120자 이하로 입력하세요","rule.invalidPrompt":"작업 내용을 입력하세요","rule.once":"한 번만","rule.everyMinutes":"N분마다","rule.everyHours":"N시간마다","rule.everySeconds":"N초마다","rule.daily":"매일","rule.weekdays":"월~금","rule.weekly":"매주","rule.cron":"사용자 지정","rule.cronLabel":"Cron 표현식","rule.cronInvalid":"5개 필드로 된 cron 표현식을 입력하세요. 예: 0 9 * * 1-5","cronForm.frequency":"빈도","cronForm.monthly":"매월","cronForm.weekly":"매주","cronForm.daily":"매일","cronForm.dates":"다음 날짜에","cronForm.dateOption":"{day}일","cronForm.atMinute":"몇 분에","cronForm.minuteIncrease":"분 늘리기","cronForm.minuteDecrease":"분 줄이기","rule.zone.system":"(시스템)","rule.error.conflict":"저장하기 전에 작업이 바뀌었습니다. 저장된 규칙을 보여 주고 있으니 다시 시도하세요","rule.error.notFound":"이 작업은 지금 쓸 수 없습니다","rule.error.unknown":"규칙이 업데이트됐는지 확인할 수 없습니다. 저장된 규칙을 보여 주고 있습니다","delete.action":"작업 삭제","delete.title":"이 작업을 삭제할까요?","delete.description":"작업이 더 이상 실행되지 않고, 저장된 실행 기록도 함께 삭제됩니다. 원래 세션과 메시지는 남고, 이미 대기열에 들어간 메시지는 취소되지 않습니다.","delete.confirm":"삭제 확인","delete.cancel":"취소","delete.close":"삭제 확인 닫기","delete.pending":"삭제하는 중…","toast.deleted":"작업이 삭제됨","toast.deleteFailed":"작업을 삭제할 수 없습니다","card.open":"열기","card.openLabel":"작업 상세 열기: {title}","card.deleted":"삭제됨","tool.invoked":"{name} 호출함"},"secretMask":{"secret.reveal":"키 보기","secret.hide":"키 숨기기"},"settings.account":{"modelSignInRequired":"현재 모델을 쓸 수 없습니다. 로그인한 뒤 다시 시도하세요","sessionExpired":"로그인 정보가 만료되었습니다. 다시 로그인하세요","onboardingArtworkLocale":"zh","onboardingWelcome":"환영합니다","onboardingBrand":"DeepSeek Harness","onboardingIntroduction":"DeepSeek Harness는 로컬 폴더를 작업 공간으로 삼아, 여러 도구를 호출해 이 PC의 파일을 읽고 쓰며 자료 검색·정리, 문서·표 작성, 코드 작성, 문제 해결 같은 다양한 작업을 합니다.","onboardingStart":"설정 시작","onboardingCredit":"사용 한도 준비","onboardingCreditDescription":"DeepSeek Harness는 작업할 때 모델과 도구가 쓴 토큰 양만큼 한도를 차감합니다. 작업 도중 멈추지 않도록 미리 한도를 충전하세요. 잔액은 에이전트가 실제로 작업할 때만 쓰입니다.","onboardingTopUp":"충전하기","onboardingLater":"다음","onboardingFundedTopUp":"충전하기","onboardingPurposePrefix":"어떤 일을","onboardingPurposeSuffix":"도와드릴까요?","onboardingPurposeDescription":"선택에 따라 화면과 도구를 사용자의 작업 방식에 맞게 조정합니다.","onboardingOffice":"사무와 창작","onboardingOfficeDescription":"문서 편집, 데이터 정리, 프레젠테이션 만들기 등","onboardingDevelopment":"코드와 개발","onboardingDevelopmentDescription":"코드 수정, 문제 디버깅, 명령 실행, 프로젝트 파일 관리 등","onboardingContinue":"계속","onboardingProcess":"작업 과정을 얼마나 보고 싶으세요?","onboardingProcessDescription":"작업 과정을 보여 주는 방식만 바뀌고, DeepSeek Harness의 작업 능력에는 영향이 없습니다.","onboardingCompact":"결과 중심","onboardingCompactDescription":"결과만 보고 화면을 깔끔하게 유지","onboardingStandard":"핵심 내용","onboardingStandardDescription":"결과 우선, 중요한 단계와 핵심 작업만 표시","onboardingDetailed":"전체 과정","onboardingDetailedDescription":"작업 과정을 모두 보여 주어 디버깅과 문제 해결에 편리","onboardingEnter":"앱으로 들어가기","onboardingBack":"이전","onboardingSkip":"건너뛰기","onboardingSkipTitle":"설정을 건너뛸까요?","onboardingSkipDescription":"언제든 설정 → 일반 설정에서 작업 과정, 성능·사용량 표시 방식을 바꾸거나 코드 작업 도구를 켤 수 있습니다.","onboardingKeepSetting":"계속 설정","onboardingNoCreditTitle":"충전을 잠시 건너뛸까요?","onboardingNoCreditDescription":"사용할 수 있는 한도가 없으면 DeepSeek Harness는 새 작업을 시작할 수 없습니다. 나중에 설정 → 계정과 잔액에서 충전할 수 있습니다.","onboardingUnderstood":"알겠습니다","onboardingGoTopUp":"충전하러 가기","onboardingSaveFailed":"설정을 저장하지 못했습니다. 다시 시도하세요.","onboardingRetry":"다시 시도","onboardingLoading":"설정 불러오는 중…","close":"닫기","addApiKey":"API 키 추가","retry":"다시 로그인","loginTitle":"시작하기","loginDescription":"DeepSeek 계정에 로그인하거나 API 키를 추가하면 바로 쓸 수 있습니다. 프로젝트와 파일은 이 PC에 저장됩니다.","browserTitle":"로그인 기다리는 중","browserPrompt":"새 페이지가 자동으로 열리지 않았나요?","copyLink":"로그인 링크 복사","copiedLink":"링크 복사됨","copyFailed":"복사 실패","browserDescription":"한 뒤 로그인 페이지를 직접 열어 로그인하세요.","timeoutTitle":"로그인 시간 초과","timeoutDescription":"다시 로그인한 뒤 계속하세요.","failureTitle":"로그인 실패","platformFailed":"작업을 끝내지 못했습니다. 다시 시도하세요","platformRetry":"다시 시도","loading":"불러오는 중…","backToHarness":"DeepSeek Harness로 돌아가기","settings":"설정","contactUs":"의견 보내기","menu":"계정 메뉴","nav":"계정과 잔액","signedIn":"DeepSeek에 로그인됨","signedOut":"로그인 안 됨","signIn":"로그인","signOut":"로그아웃","signOutUnknownDescription":"지금은 작업 상태를 확인할 수 없습니다. 로그아웃하면 이 계정을 쓰는 작업이 중단될 수 있습니다. 계속할까요?","signOutDescription":"로그아웃해도 데이터는 사라지지 않고, 이 계정으로 다시 로그인할 수 있습니다.","signOutRunningDescription":"지금 실행 중인 작업이 있습니다. ‘로그아웃’을 누르면 작업이 중단됩니다. 바로 로그아웃할까요?","cancel":"취소","open":"브라우저 열기","initializing":"로그인 시작하는 중…","waiting":"브라우저에서 계속하세요","completing":"로그인 마무리하는 중…","expired":"로그인이 만료되었습니다. 다시 시도하세요.","failed":"작업을 끝내지 못했습니다. 다시 시도하세요.","noResponse":"작업을 끝내지 못했습니다. 네트워크 문제일 수 있으니 연결 상태를 확인한 뒤 다시 시도하세요","settingsSignedOutTitle":"DeepSeek Harness 계정에 로그인하지 않았습니다","settingsSignedOutDescription":"DeepSeek Harness 계정에 로그인해 전용 API 키 받기","signInDescription":"DeepSeek 계정에 로그인해 시작하세요","profileUnavailable":"계정 정보를 지금 볼 수 없습니다","balance":"충전 잔액","bonusBalance":"보너스 잔액","balanceUnavailable":"오픈 플랫폼에서 보기","balanceSignedOut":"로그인 후 보기","accountInfo":"계정 정보 더 보기","more":"더 보기","usage":"사용량 조회","topUp":"충전","quotaTitle":"사용할 수 있는 잔액이 없습니다","quotaDescription":"사용할 수 있는 한도가 없으면 DeepSeek Harness는 새 작업을 시작할 수 없습니다. 지금 충전할까요? 나중에 설정 → 계정과 잔액에서 충전할 수도 있습니다.","quotaTopUp":"충전하기","bonusNoticeTitle":"보너스가 들어왔습니다"},"settings.agentLoop":{"title":"에이전트 루프","description":"에이전트가 도구 호출을 내보내는 방식을 정합니다.","maxParallel":"병렬 도구 호출 수","maxParallelHint":"한 단계 안에서 병렬로 돌릴 수 있는 호출을 동시에 최대 몇 개까지 실행할지입니다.","overridden":"덮어씀","reset":"기본값 복원","readOnly":"이 배포의 설정은 읽기 전용입니다.","unavailable":"이 플러그인이 지금 불러와지지 않아 설정할 수 없습니다.","save":"저장","saving":"저장 중…","saveFailed":"이 배포가 이 값들을 받아들이지 않았습니다. 고칠 수 있도록 남겨 두었습니다.","invalidNumber":"숫자를 입력하세요. 비워 두면 기본값을 씁니다."},"settings":{"trigger":"설정","shortcut.open":"설정 열기","desktop.update.available":"새 버전","desktop.update.checking":"업데이트 확인 중…","desktop.update.progress":"{percent}%","desktop.update.verifying":"업데이트 파일 검증 중…","desktop.update.installing":"재시작 준비 중…","desktop.update.ready":"설치하고 재시작","desktop.update.retry":"업데이트 다시 시도","desktop.update.versionDetail":"{label}：{version}","desktop.update.downloadDetail":"업데이트 내려받는 중: {percent}%\n대상 버전: {version}","desktop.update.checkFailed":"업데이트 확인에 실패했습니다. 잠시 뒤 다시 시도하세요.","desktop.update.downloadFailed":"업데이트 내려받기에 실패했습니다. 다시 시도하세요.","desktop.update.installFailed":"업데이트 설치에 실패했습니다. 잠시 뒤 다시 시도하세요.","desktop.update.checkNetworkFailed":"업데이트 확인에 실패했습니다. 네트워크 연결을 확인한 뒤 다시 시도하세요.","desktop.update.downloadNetworkFailed":"업데이트 내려받기에 실패했습니다. 네트워크 연결을 확인한 뒤 다시 시도하세요.","desktop.update.installNetworkFailed":"업데이트 설치에 실패했습니다. 네트워크 연결을 확인한 뒤 다시 시도하세요.","desktop.update.stopFailed":"작업을 안전하게 멈추지 못해 업데이트를 설치하지 않았습니다. 잠시 뒤 다시 시도하세요.","desktop.update.tasksChanged":"새 작업이 실행되기 시작했습니다. 작업을 멈추고 업데이트할지 다시 확인하세요.","desktop.update.tasksUnavailable":"작업 상태를 확인할 수 없습니다. 작업 공간이 준비된 뒤 업데이트를 다시 시도하세요.","title":"설정","close":"닫기","openDocument":"설정 파일 열기","openDocument.error":"설정 파일을 열 수 없습니다","general.nav":"일반 설정","general.currentVersion":"현재 버전: {version}","developerTools.title":"코드 작업 보기 표시","developerTools.error":"저장 실패. 다시 시도하세요","developerTools.description":"켜면 실행 기록, 이번 턴 코드 차이를 보여 주고, 에이전트 프리셋 전체에서 고를 수 있습니다","connection.error":"연결 이상. 새로 고쳐 다시 시도","connection.connecting":"다시 연결하는 중","connection.connected":"연결됨","connection.reconnect":"연결 이상. 눌러서 바로 다시 연결","connection.restart":"연결이 끊겨 다시 시도하는 중. 눌러서 바로 다시 연결","hostRelease.title":"서비스 버전 변경","hostRelease.description":"서비스 버전이 바뀌어 이 페이지의 실시간 업데이트를 멈췄습니다. 새로 고치면 새 버전을 불러옵니다.","hostRelease.service":"서비스","hostRelease.page":"페이지","hostRelease.unknown":"확인 안 됨","hostRelease.reload":"새로 고쳐 새 버전 불러오기","hostRelease.later":"나중에"},"settings.models":{"nav":"모델","deepSeekAccount":"DeepSeek 계정","title":"모델","intro":"각 공급자의 API 키를 넣으면 그 모델을 쓸 수 있습니다.","edit":"편집","editProvider":"{provider} 편집","remove":"삭제","removeProvider":"{provider} 삭제","deleteTitle":"{provider}을(를) 삭제할까요?","deleteDescription":"{provider}을(를) 삭제하면 설정이 지워집니다. 쓰던 자격 증명(있다면)은 다른 곳에서 관리하므로 남습니다.","deleteDescriptionWithCredential":"{provider}을(를) 삭제하면 설정과 저장된 API 키가 지워집니다.","deleteConfirm":"{provider} 삭제","deleting":"{provider} 삭제하는 중…","add":"모델 공급자 추가","addMode":"추가 방법","addCatalog":"서드파티 모델 공급자","addCustom":"사용자 지정 모델 API","addCatalogHint":"기본 목록에서 OpenAI, Anthropic, Kimi 같은 공급자를 골라 API 키를 넣으면 바로 쓸 수 있습니다.","addCustomHint":"중계 서버, 직접 띄운 서버, 그 밖에 OpenAI / Anthropic 프로토콜과 호환되는 API에 연결합니다. API 주소, 프로토콜, 모델을 입력해야 합니다.","addCatalogExhausted":"목록의 공급자를 모두 추가했습니다.","addCustomUnavailable":"쓸 수 있는 API 프로토콜이 없습니다.","provider":"공급자","close":"닫기","cancel":"취소","apply":"저장","applying":"저장 중…","savedProvider":"{provider} 저장됨.","credentialConfigured":"API 키 설정됨","credentialMissing":"API 키 없음","accountSignedIn":"로그인됨","readOnly":"현재 배포의 설정 문서는 읽기 전용입니다.","loadFailed":"공급자 목록을 불러오지 못했습니다","conflict":"이 카드를 열어 둔 동안 다른 곳에서 설정이 바뀌었습니다. 닫았다가 다시 열어 현재 값으로 편집하세요.","retry":"다시 시도","keyInput":"API 키","keyReveal":"키 보기","keyHide":"키 숨기기","keyPlaceholder":"API 키 입력","keyPlaceholderFallback":"비워 두면 환경 인증 사용({hint})","keyPlaceholderSaved":"비워 두면 저장된 자격 증명 사용","keyFallbackMissing":"환경 변수를 찾지 못했습니다. API 키를 입력하거나 환경 변수 {hint}를 설정하세요.","keyFallbackDetected":"환경 변수 찾음({hint})","keyFallbackDetectedHidden":"환경 변수 찾음","keyFallbackUnchecked":"환경 자격 증명 상태를 아직 확인하지 못함","keyHelp":"저장된 자격 증명을 먼저 씁니다. 여기 보이는 환경 대체 값은 다음 순서입니다: {env}. 출처는 실행 환경, $cwd/.env, $DSH_HOME/.env 순입니다.","authHelp":"인증 안내","customized":"사용자 지정 설정","baseUrl":"API 주소","baseUrlDefault":"기본 주소 없음","baseUrlEnvironment":"공급자 주소 설정: {env}","baseUrlConfigured":"공급자가 주소를 설정","baseUrlPlaceholder":"{url}","deepSeekBaseUrl":"https://api.deepseek.com/anthropic(기본적으로 환경 변수 DEEPSEEK_BASE_URL 사용)","deepSeekEndpointHint":"Anthropic Messages 프로토콜과 호환되는 API 주소를 입력하세요.","models":"모델 목록","modelsInherited":"어댑터 기본 모델 사용 중","modelsCustomized":"모델 목록 사용자 지정됨","resetModels":"기본 모델 복원","model":"모델","modelId":"모델 ID","modelName":"표시 이름","modelNamePlaceholder":"비워 두면 모델 ID 사용","contextWindow":"컨텍스트 창","contextWindowPlaceholder":"공급자 기본값 사용","maxTokens":"최대 출력 토큰 수","maxTokensPlaceholder":"공급자 기본값 사용","modelAdvanced":"모델 옵션","modelInputTypes":"입력 유형","modelInputText":"텍스트","modelInputImage":"이미지","modelReasoning":"추론 수준","modelReasoningLevel":"단계","modelReasoningValue":"API 파라미터 값","modelReasoningHelp":"추론 수준 안내","modelReasoningHelpText":"API 파라미터 값은 요청의 추론 강도 필드(예: OpenAI의 reasoning_effort)에 들어가며, 기본값은 단계 이름과 같습니다. 다르다면 모델 공급자의 API 문서를 따르세요. Off는 생각을 끈다는 뜻이라 파라미터 값을 넣지 않아도 됩니다. 설정에 이미 적힌 값은 그대로 남아 전송됩니다.","modelReasoningNeedsLevel":"Off 말고 단계를 하나 이상 추가하세요. 생각이 필요 없으면 추론 수준을 끄세요.","modelReasoningValueRequired":"Off 외의 단계에는 모두 API 파라미터 값을 넣어야 하며, 빈 문자열은 안 됩니다.","modelReasoningAdd":"단계 추가","modelReasoningRemove":"단계 삭제","modelReasoningOffValuePlaceholder":"생각 끄기","addModel":"모델 추가","removeModel":"모델 삭제","modelsEmpty":"모델 선택기에 아무 모델도 표시되지 않습니다. 목록에 없는 ID도 직접 보낼 수는 있습니다.","keyBlank":"API 키를 입력하세요. 비워 두면 저장된 키를 그대로 씁니다.","keyBlankNew":"API 키를 입력하세요. 이 공급자가 다른 방식으로 인증한다면 비워 둬도 됩니다.","keyIllegalCharacters":"API 키 형식이 잘못되었습니다. 확인해 주세요.","modelIdRequired":"모델 ID는 비워 둘 수 없습니다.","modelIdDuplicate":"모델 ID가 중복될 수 없습니다.","modelNameInvalid":"표시 이름은 비워 둘 수 없습니다.","modelContextInvalid":"컨텍스트 창은 양수여야 합니다. 예: 131072, 256K, 1M.","modelMaxTokensInvalid":"최대 출력 토큰 수는 양수여야 합니다. 예: 8192, 64K, 1M.","advancedHint":"나머지 항목은 cordis.patch.yml에 있습니다. 해당 부분을 직접 편집하세요.","modelCapacityInvalid":"용량은 숫자여야 하며 K 또는 M을 붙일 수 있습니다.","modelDuplicate":"모델 ID는 한 번씩만 쓸 수 있습니다.","fetchModels":"사용 가능한 모델 가져오기","fetching":"공급자에게 묻는 중…","fetchNeedsBaseUrl":"먼저 API 주소를 입력한 뒤 가져오세요.","fetchEmpty":"이 공급자는 모델 목록을 주지 않았습니다. 직접 추가하세요.","fetchTitle":"추가할 모델 선택","fetchDescription":"모델 공급자가 제공하는 모델입니다. 추가할 모델에 체크하세요.","fetchSearch":"모델 검색","fetchNoMatches":"일치하는 모델이 없습니다.","fetchSelectAll":"모두 선택","fetchDeselectAll":"모두 선택 해제","fetchAdopt":"선택한 항목 추가","customTag":"사용자 지정","customRoute":"Provider ID","customRouteHint":"소문자로 시작하는 식별자로, 요청에서 이 공급자를 구분하고 자격 증명 이름을 만드는 데 쓰입니다.","customRouteInvalid":"소문자로 시작해야 하며, 그 뒤로 소문자, 숫자, 하이픈을 쓸 수 있습니다.","customRouteTaken":"이미 이 ID를 쓰는 공급자가 있습니다.","customDisplayName":"표시 이름","customApi":"API 프로토콜","customApiUnset":"선택 안 함","protocolOpenAiCompletions":"OpenAI Chat Completions","protocolOpenAiResponses":"OpenAI Responses","protocolAnthropicMessages":"Anthropic Messages","customNeedsBaseUrl":"사용자 지정 모델 API에는 API 주소가 필요합니다.","customBaseUrlInvalid":"올바른 HTTP 또는 HTTPS 주소를 입력하세요.","customNeedsModels":"사용자 지정 모델 API에는 모델이 하나 이상 있어야 합니다.","customBaseUrlPlaceholder":"https://gateway.example/v1","customAnthropicBaseUrlPlaceholder":"https://gateway.example","settingsPathUnresolvable":"설정 경로를 해석할 수 없습니다","create":"공급자 만들기","creating":"만드는 중…","welcomeTitle":"미리보기판 안내","welcomeBody":"DeepSeek Harness 0.2 버전은 아직 미리보기 단계로, 계속 다듬어야 할 부분이 많아 개발자와 사용자 여러분의 의견을 듣고자 합니다. 이번 새 데스크톱 앱은 일반 사용자를 대상으로 하며, 개발자용 고급 기능은 설정에서 켜서 쓸 수 있습니다. DeepSeek Harness의 기능과 플러그인 API는 앞으로도 빠르게 바뀌고 발전하다가 점차 안정될 예정입니다.\n\n오픈 소스이며 재사용하고 조합할 수 있는 기반 위에서 전 세계 사용자, 개발자와 함께 지능의 한계를 탐구하고 싶습니다. DeepSeek Harness로 아이디어를 현실로 만들고, 커뮤니티와 함께 플러그인 생태계를 넓혀 주세요.","welcomeContinue":"계속","welcomeError":"확인 상태를 지금 저장할 수 없습니다. 다시 시도하세요.","onboardingTitle":"API 키를 추가해 시작하세요","onboardingDescription":"DeepSeek 공식 모델을 설정하면 바로 쓸 수 있습니다.","onboardingLater":"나중에 설정","onboardingSave":"저장하고 계속","onboardingSaving":"저장 중…","keyRequired":"API 키를 입력한 뒤 계속하세요."},"settings.pluginInventory":{"tab":"플러그인 목록","loading":"플러그인 읽는 중…","clientSyncing":"이 페이지의 플러그인 동기화 중…","clientSyncFailed":"이 페이지의 플러그인을 동기화하지 못했습니다. 서버의 활성화 상태는 그대로입니다.","clientSyncRetry":"이 페이지 동기화 다시 시도","error":"지금은 플러그인을 읽을 수 없습니다.","metadataError":"패키지 메타 정보 오류: {error}","retry":"다시 시도","search":"플러그인 검색","empty":"플러그인이 없습니다.","emptySearch":"일치하는 플러그인이 없습니다.","presetTitle":"세션 플러그인","presetSubtitle":"에이전트 프리셋이 세션마다 구성","switcherLabel":"볼 에이전트 프리셋 선택","presetOptionDefault":"{name}(기본)","presetOptionBroken":"{name}(불러오기 실패)","globalTitle":"전역 플러그인","globalSubtitle":"시스템과 모든 세션이 함께 씀","presetProvidedDetail":"전역에서는 꺼져 있고, 에이전트 프리셋이 세션마다 제공","enabledIn":"켜진 곳","matchesInOtherPresets":"다른 프리셋에 일치하는 항목 {count}개 더: ","enabledTag":"켜짐","disabledTag":"꺼짐","conditionalTag":"조건부 켜짐","presetEnabledTag":"프리셋에서 켜짐","failedTag":"시작 실패","moduleLabel":"전체 이름","fromPreset":"출처","condition":"끄는 조건","configuration":"설정 상태","runtime":"실행 상태","unobserved":"실행 안 함","pending":"의존성 대기 중","loadingPhase":"불러오는 중","active":"실행 중","failed":"시작 실패","unloading":"제거 중"},"settings.plugins":{"nav":"기본 제공 플러그인","title":"기본 제공 플러그인","intro":"기본 배포에 포함된 플러그인 목록 보기","tabs":"플러그인 보기","empty":"이 배포에는 열려 있는 플러그인 보기가 없습니다."},"settings.sessionLog":{"title":"공식 모델 API를 쓸 때 세션 로그 올리기","description":"DeepSeek 모델과 제품 개선에 도움","saved":"설정 저장됨","failed":"설정을 저장할 수 없습니다"},"settings.shell":{"title":"터미널","description":"명령 하나가 최대 얼마나 오래 돌고 얼마나 많이 출력할지 제한합니다.","timeoutMs":"명령 시간 제한(밀리초)","timeoutMsHint":"명령 하나가 실행될 수 있는 시간입니다. 넘으면 종료합니다.","maxOutputBytes":"스트림당 출력 한도(바이트)","maxOutputBytesHint":"넘는 부분은 버리지 않고 임시 파일로 옮겨 저장합니다.","overridden":"덮어씀","reset":"기본값 복원","readOnly":"이 배포의 설정은 읽기 전용입니다.","unavailable":"이 플러그인이 지금 불러와지지 않아 설정할 수 없습니다.","save":"저장","saving":"저장 중…","saveFailed":"이 배포가 이 값들을 받아들이지 않았습니다. 고칠 수 있도록 남겨 두었습니다.","invalidNumber":"숫자를 입력하세요. 비워 두면 기본값을 씁니다."},"settings.subagent":{"overridden":"덮어씀","reset":"기본값 복원","readOnly":"이 배포의 설정은 읽기 전용입니다.","unavailable":"이 플러그인이 지금 불러와지지 않아 설정할 수 없습니다.","save":"저장","saving":"저장 중…","saveFailed":"이 배포가 이 값들을 받아들이지 않았습니다. 고칠 수 있도록 남겨 두었습니다.","subagentTitle":"하위 에이전트","subagentDescription":"하위 에이전트의 재귀 깊이, 개수, 모델을 설정합니다.","subagentLimitsTitle":"실행 제한","subagentMaxDepth":"최대 재귀 깊이","subagentDepthHelpLabel":"최대 재귀 깊이 안내","subagentDepthHelp":"에이전트가 하위 에이전트를 몇 단계까지 만들 수 있는지 제한합니다.","subagentDepthZero":"하위 에이전트 끄기","subagentDepthOne":"주 에이전트만 하위 에이전트를 만들 수 있음","subagentDepthOverride":"도구에 최대 재귀 깊이가 따로 설정되어 있으면 그 설정을 따릅니다.","subagentMaxActive":"하위 에이전트 동시 실행 한도","subagentCapacityHelpLabel":"하위 에이전트 동시 실행 한도 안내","subagentCapacityHelp":"같은 주 에이전트 아래에서 모든 단계에 걸쳐 동시에 살아 있는 하위 에이전트의 총수입니다(주 에이전트는 제외). 한도에 이르면 새 시작 요청은 거부됩니다.","subagentDepthInvalid":"0 이상의 정수를 입력하세요.","subagentCapacityInvalid":"1 이상의 정수를 입력하세요.","subagentModelSelectionTitle":"모델 선택","subagentModelSelectionToggle":"에이전트가 하위 에이전트의 모델을 고르도록 허용","subagentModelSelectionChoose":"켜면 에이전트가 아래 허용된 모델 중에서 하위 에이전트마다 공급자, 모델, 추론 강도를 고를 수 있습니다. 새 세션에만 적용됩니다.","subagentModelSelectionAllowed":"에이전트가 고를 수 있는 모델","subagentModelSelectionLoading":"모델 불러오는 중…","subagentModelSelectionLoadFailed":"모델을 불러올 수 없습니다.","subagentModelSelectionRetry":"다시 시도","subagentModelSelectionPartial":"일부 모델 공급자를 지금 불러올 수 없습니다. 저장된 선택은 지울 수 있습니다.","subagentModelSelectionUnavailable":"지금 쓸 수 없음","subagentModelSelectionUnavailableGroup":"저장됐지만 지금 쓸 수 없음","subagentModelSelectionEmpty":"지금 모델을 알려 주는 공급자가 없습니다.","subagentModelSelectionRequired":"저장하기 전에 모델을 하나 이상 고르세요.","subagentModelSelectionConflict":"다른 곳에서 설정이 바뀌었습니다. 수정을 버리고 다시 시도하세요.","subagentModelSelectionOff":"끄면 하위 에이전트는 설정된 기본 모델을 쓰거나 상위 에이전트의 모델을 물려받습니다. 고른 모델은 남아 있습니다."},"settings.webSearch":{"title":"웹 검색","description":"DeepSeek의 검색 공급자를 설정합니다.","useSearchApi":"새 웹 검색 API 사용","useSearchApiHint":"기본은 꺼져 있고, 검색은 DeepSeek Messages로 처리합니다. 새 웹 검색 API의 기능과 요금은 다음을 참고하세요: ","searchGuide":"웹 검색·가져오기 안내","searchGuideUrl":"https://api-docs.deepseek.com/zh-cn/guides/search","apiKey":"API Key","apiKeyHint":"설정 파일에 쓰지 않습니다. 비워 두면 현재 키를 유지합니다.","apiKeySet":"키가 설정되어 있습니다.","apiKeyUnset":"키가 설정되지 않았습니다. DeepSeek 계정 모델을 쓰는 대화만 기본 주소로 검색할 수 있습니다.","baseUrl":"Messages API 기본 주소","baseUrlHint":"API 접두어를 포함한 주소를 입력하세요(예: https://api.deepseek.com/anthropic/v1). 프로그램이 /messages를 붙이며, 비워 두면 기본값으로 돌아갑니다.","searchApiBaseUrl":"Search / Fetch API 기본 주소","searchApiBaseUrlHint":"API 접두어를 포함한 주소를 입력하세요(예: https://api.deepseek.com/v1/tools). 프로그램이 /search 또는 /fetch를 붙이며, 비워 두면 기본값으로 돌아갑니다.","maxUses":"요청당 최대 검색 횟수","maxUsesHint":"보조 모델이 Messages 요청 한 번에 할 수 있는 최대 검색 횟수입니다. Messages API에만 적용됩니다.","count":"검색당 결과 수","countHint":"검색어 하나당 돌려받는 결과 개수로, 1–50 사이 정수이며 기본값은 10입니다. 검색 호출 횟수를 정하지는 않습니다. web_search가 남기는 출처 수는 자체 결과 한도를 넘지 않습니다.","overridden":"덮어씀","reset":"기본값 복원","readOnly":"이 배포의 설정은 읽기 전용입니다.","unavailable":"이 플러그인이 지금 불러와지지 않아 설정할 수 없습니다.","save":"저장","saving":"저장 중…","saveFailed":"이 배포가 이 값들을 받아들이지 않았습니다. 고칠 수 있도록 남겨 두었습니다.","invalidNumber":"숫자를 입력하세요. 비워 두면 기본값을 씁니다.","invalidCount":"1–50 사이 정수를 입력하세요. 비워 두면 기본값을 씁니다."},"shortcuts":{"edit-label":"{command} 단축키 바꾸기","record":"단축키를 누르세요","record-help":"조합 키를 떼면 저장됩니다. Tab으로 작업 전환, Esc로 입력 끝내기.","web-help":"브라우저에서 쓸 수 있는 조합: Mod+/, Mod+Shift+,, Mod+Shift+.. Mod는 Mac에서 Command, 다른 시스템에서 Ctrl입니다.","unsupported-key":"이 키는 아직 지원하지 않습니다.","reserved":"이 조합은 시스템이나 텍스트 편집 동작이 쓰고 있습니다.","modifier-required":"Command, Ctrl, Alt 보조 키를 함께 누르세요.","too-many-keys":"보조 키가 아닌 키는 두 개까지만 함께 누를 수 있습니다. 뗀 뒤 다시 시도하세요.","macos-web-help":"Command+/, Command+,, Command+백슬래시, Control+백틱, Command+Option+키, Command+Shift+키로 설정할 수 있습니다. 서로 다른 보조 키 3~4개 조합도 됩니다. 브라우저나 시스템이 쓰는 조합은 페이지까지 전달되지 않을 수 있습니다.","windows-web-help":"Ctrl+/, Ctrl+,, Ctrl+Alt+키, Ctrl+Shift+키로 설정할 수 있습니다. 서로 다른 보조 키 3~4개 조합도 됩니다. 브라우저나 시스템이 쓰는 조합은 페이지까지 전달되지 않을 수 있습니다.","unsupported-browser":"이 브라우저는 이 조합을 아직 지원하지 않습니다.","conflict":"‘{commands}’이(가) 이미 쓰고 있음","saved":"바뀜","clear":"제거","retry-save":"저장 다시 시도","reset":"기본값 복원","reset-all":"모두 기본값으로","modified-count":"{count}개 사용자 지정됨","reset-title":"단축키를 모두 기본값으로 되돌릴까요?","reset-description":"현재 플랫폼의 기본 단축키로 되돌립니다. 바꾸거나 지운 단축키가 모두 돌아오며, 다른 플랫폼에는 영향이 없습니다.","cancel":"취소","reset-saved":"기본 단축키로 되돌렸습니다","close-confirmation":"확인 닫기","reset-failed":"기본값 복원에 실패했습니다. 원래 단축키는 그대로이니 다시 시도하세요.","review":"최신 설정을 확인했습니다","stale":"단축키 설정이나 쓸 수 있는 명령이 바뀌었습니다. 최신 키 배치를 확인한 뒤 저장하세요.","write-failed":"저장에 실패했습니다. 원래 단축키와 현재 초안은 그대로이니 다시 시도하세요.","not-ready":"단축키가 아직 준비되지 않았습니다. 잠시 뒤 다시 시도하세요.","read":"{location}을(를) 읽을 수 없습니다. 접근 권한을 확인한 뒤 {reload}하세요.","invalid":"{location}의 단축키 설정이 손상되었습니다. 먼저 백업하고 고친 뒤 {reload}하세요.","future":"{location}의 단축키 설정은 더 새로운 버전에서 만들어졌습니다. Harness를 업그레이드한 뒤 다시 시도하세요.","web-document":"현재 사이트 로컬 저장소의 dsh.keybindings.v1","desktop-document":"userData/keybindings.json","web-reload":"페이지 새로 고침","desktop-reload":"Harness 다시 시작","using-defaults":"지금은 기본 키 배치를 씁니다.","using-accepted":"마지막으로 읽어 온 키 배치를 계속 씁니다.","native-failed":"데스크톱 키 입력 보호를 켤 수 없습니다. 닫은 뒤 다시 시도하세요.","global-hint":"어디서나 불러와 보기","clear-search":"검색 지우기","title":"단축키","open":"단축키 빠른 보기","settings":"단축키","view":"단축키 편집","description":"지금 쓸 수 있는 단축키와 입력 동작 보기·편집","search":"단축키 검색","close":"단축키 닫기","application":"앱 동작","input":"메시지 입력","menus":"메뉴와 팝업","approval":"승인 영역","unbound":"단축키 없음","empty":"일치하는 단축키가 없습니다","move":"메뉴 선택 이동","select":"메뉴 항목 선택","dismiss":"메뉴나 맨 위 팝업 닫기"},"sidebar":{"session.new":"새 세션","session.new.label":"새 세션","toggle.open":"사이드바 열기","toggle.collapse":"사이드바 접기","panels.label":"전역 패널","panels.more":"더 보기"},"sidebarBrowser":{"type.label":"브라우저","guide.title":"브라우저","guide.description":"웹 둘러보기","shortcut.noSession":"먼저 세션을 여세요","address.placeholder":"HTTP(S) 주소 입력","address.changed":"URL이 바뀌었습니다","back":"뒤로","forward":"앞으로","reload":"새로 고침","go":"이동","external":"시스템 브라우저에서 열기","sandbox.disable":"샌드박스 제한 끄기","sandbox.enable":"샌드박스 제한 다시 켜기","sandbox.warning":"샌드박스 제한이 꺼졌습니다. 페이지가 앱 전체를 이동시키고, 다운로드, 모달 대화상자, 입력 잠금을 쓸 수 있습니다.","start":"HTTP(S) 주소를 입력해 둘러보기 시작","loading":"여는 중…","restore.previous":"마지막으로 연 곳","restore.action":"페이지 복원","error.empty":"주소를 입력하세요.","error.invalid":"주소가 올바르지 않거나 너무 깁니다.","error.protocol":"HTTP와 HTTPS 주소만 지원합니다. 로컬 파일은 문서 미리보기를 쓰세요.","error.credentials":"주소에 사용자 이름이나 비밀번호를 넣을 수 없습니다.","error.application-origin":"내장 브라우저에서 DSH 앱 자체를 열 수는 없습니다.","load.failed":"페이지를 불러오지 못했습니다. 새로 고쳐 다시 시도하거나 시스템 브라우저에서 여세요.","load.failed.detail":"페이지를 불러오지 못했습니다({code}): {description}","address.unknown":"페이지가 이동했습니다. 지금 방식으로는 새 URL을 읽을 수 없습니다."},"sidebarFiles":{"shortcut.noSession":"먼저 세션을 고르세요","type.label":"파일","guide.title":"작업 공간 파일","guide.description":"세션 작업 공간의 파일 둘러보기","loading":"읽는 중…","empty":"빈 폴더","truncated":"항목이 너무 많아 일부만 보여 줍니다.","noWorkspace":"이 세션에는 작업 공간 폴더가 없습니다.","reload":"다시 읽기","autoRefresh":"자동 새로 고침","autoRefresh.enable":"자동 새로 고침 켜기","autoRefresh.disable":"자동 새로 고침 끄기","entry.other":"파일이나 폴더가 아니라 열 수 없습니다.","error.notFound":"이 폴더가 없습니다. 옮겨졌거나 삭제됐을 수 있습니다.","error.outsideWorkspace":"이 폴더는 작업 공간 밖에 있어 사이드바에서 읽지 않습니다.","error.notDirectory":"폴더가 아닙니다.","error.unavailable":"읽기 실패: {message}"},"sidebarRight":{"command.close":"현재 페이지/창 닫기","command.refresh":"현재 페이지 새로 고침","command.noRefresh":"현재 페이지는 새로 고칠 수 없습니다","command.toggle":"오른쪽 사이드바 펼치기/접기","command.fullscreen":"패널 전체 화면/나가기","command.noSession":"먼저 세션을 고르세요","command.noFocus":"먼저 오른쪽 패널에 포커스를 두세요","command.stale":"페이지가 바뀌었습니다. 다시 포커스를 두세요","command.collapsed":"먼저 오른쪽 사이드바를 펼치세요","command.float":"떠 있는 패널에서는 이 동작을 할 수 없습니다","command.empty":"먼저 페이지를 여세요","command.budget":"최대 두 칸까지입니다","command.width":"폭이 좁습니다. 사이드바를 넓힌 뒤 나누세요","chrome.expand":"사이드바 열기","chrome.expandAria":"오른쪽 사이드바 열기","chrome.collapse":"사이드바 접기","chrome.collapseAria":"오른쪽 사이드바 접기","chrome.toFullscreen":"전체 화면","chrome.exitFullscreen":"전체 화면 나가기","dock.emptyPane":"빈 패널","dock.splitPane":"화면 나누기","dock.splitPaneDisabled":"최대 두 칸까지입니다","dock.splitPaneNarrow":"폭이 좁습니다. 사이드바를 넓힌 뒤 나누세요","dock.closeTab":"닫기","dock.addTab":"새 탭","dock.dockFloat":"사이드바로 되돌리기","dock.closeFloat":"닫기","dock.drop.center":"여기로 옮기기","dock.drop.left":"왼쪽으로 나누기","dock.drop.right":"오른쪽으로 나누기","dock.drop.top":"위로 나누기","dock.drop.bottom":"아래로 나누기","tab.guide.title":"시작","tab.guide.more":"도구 더 보기","tab.unavailable":"이런 내용은 아직 볼 방법이 없습니다."},"sidebarTerminal":{"shortcut.noSession":"먼저 세션을 고르세요","recoveryFailed":"터미널 복원 실패: {message}","retryRecovery":"터미널 복원 다시 시도","shell":"셸 선택","shellLoading":"셸 읽는 중…","shellEmpty":"쓸 수 있는 셸이 없습니다","description":"세션 작업 공간에서 명령 실행","title":"터미널","new":"새 터미널","loading":"터미널 환경 읽는 중…","creating":"시작하는 중…","connecting":"연결하는 중…","disconnected":"연결이 끊겼습니다.","reconnect":"다시 연결","readonly":"이 페이지는 지금 읽기 전용입니다.","control":"입력 가져오기","closed":"터미널이 닫혔습니다.","exited":"프로세스 종료({code})","failed":"터미널 오류: {message}","rename":"터미널 이름","unavailable":"쓸 수 없음","retry":"다시 시도","cleanupFailed":"터미널 ‘{title}’을(를) 끝내지 못했습니다: {message}","missingTerminal":"이 터미널은 더 이상 없습니다. 새 터미널을 여세요.","inputFull":"입력 버퍼가 가득 찼습니다. 다시 연결한 뒤 시도하세요.","attachmentEnded":"터미널 연결이 끝났습니다. 다시 연결하세요.","invalidOutput":"터미널 화면 전송에 문제가 있습니다. 다시 연결하세요.","terminalLimit":"터미널 개수 한도에 도달했습니다. 쓰지 않는 터미널을 닫은 뒤 다시 시도하세요. 종료된 터미널도 개수에 들어갑니다."},"skill":{"row.title":"스킬 불러오기","row.running":"스킬 불러오는 중","row.preparing":"스킬 불러올 준비 중","row.failed":"스킬 불러오기 실패","row.stopped":"스킬 불러오기 중단됨","row.instructions":"설명","row.inspect":"보기","menu.userOnly":"사용자 전용"},"subagent":{"duration.seconds":"{seconds}초","duration.minutes":"{minutes}분 {seconds}초","duration.hours":"{hours}시간 {minutes}분 {seconds}초","duration.days":"{days}일","duration.daysHours":"{days}일 {hours}시간","duration.months":"약 {months}개월","duration.monthsDays":"약 {months}개월 {days}일","duration.years":"약 {years}년","duration.yearsMonths":"약 {years}년 {months}개월","duration.exactDays":"{days}일 {hours}시간 {minutes}분 {seconds}초","duration.exactTitle":"총 활동 시간: {duration}","tokens.thousand":"{value}K","tokens.million":"{value}M","tokens.total":"{value} tok","loading.label":"하위 에이전트 불러오는 중…","load.error":"하위 에이전트를 불러올 수 없습니다","catalog.migrationRequired":"마이그레이션 필요","retry":"다시 시도","mode.external":"외부 작업","mode.oneShot":"일회성","mode.continuable":"이어서 가능","mode.unknown":"모드 알 수 없음","readonly.unknown.body":"하위 세션을 읽어야 이어서 할 수 있는지 알 수 있습니다.","activity.running":"실행 중","activity.completed":"완료","activity.inactive":"지금 실행 중 아님","branch.collapse":"{label}의 하위 에이전트 접기","branch.expand":"{label}의 하위 에이전트 펼치기","count.total.one":"하위 에이전트 {count}개","count.total.other":"하위 에이전트 {count}개","count.running.one":"하위 에이전트 {count}개, 실행 중","count.running.other":"하위 에이전트 {count}개, 실행 중","switcher.aria":"하위 에이전트 전환: {title}","tree.aria":"하위 에이전트 세션","open.sidebar":"사이드바에서 열기","open.sidebar.aria":"사이드바에서 {label} 열기","sidebar.chat":"채팅","readonly.oneShot.title":"일회성 하위 에이전트 기록","readonly.title":"이 하위 에이전트는 잠시 읽기 전용입니다","readonly.oneShot.body":"일회성 작업은 이어서 메시지를 보낼 수 없습니다. 여기서 전체 실행 기록을 볼 수 있습니다.","readonly.body":"상위 세션이 지금 온라인이 아닙니다. 상위 세션을 다시 열면 메시지를 계속 보낼 수 있습니다."},"settings.theme":{"appearance.title":"모양","appearance.light":"밝게","appearance.dark":"어둡게","appearance.system":"시스템 설정 따르기","fontSize.text.title":"글자 크기","fontSize.text.description":"세션 내용의 글자 크기에만 적용됩니다","fontSize.text.increase":"글자 크게","fontSize.text.decrease":"글자 작게","fontSize.code.title":"코드 글자 크기","fontSize.code.description":"코드 블록, 인라인 코드, 도구 출력에 쓰입니다","fontSize.code.increase":"코드 글자 크게","fontSize.code.decrease":"코드 글자 작게","fontSize.terminal.title":"터미널 글자 크기","fontSize.terminal.description":"사이드바 터미널에 쓰입니다","fontSize.terminal.increase":"터미널 글자 크게","fontSize.terminal.decrease":"터미널 글자 작게","fontSize.unit":"px","fontFamily.text.title":"본문 글꼴","fontFamily.text.description":"화면과 세션 본문에 쓰입니다. 여러 글꼴은 쉼표로 구분하고, 비워 두면 기본 글꼴을 씁니다","fontFamily.code.title":"코드 글꼴","fontFamily.code.description":"코드 블록, 인라인 코드, 도구 출력에 쓰입니다. 여러 글꼴은 쉼표로 구분하고, 비워 두면 기본 글꼴을 씁니다","fontFamily.terminal.title":"터미널 글꼴","fontFamily.terminal.description":"사이드바 터미널에 쓰입니다. 여러 글꼴은 쉼표로 구분하고, 비워 두면 기본 글꼴을 씁니다","fontFamily.placeholder":"기본","fontSize.more":"글꼴 설정 더 보기"},"trajectory":{"view.trajectory":"실행 기록","toolbar.aria":"실행 기록 도구 모음","toolbar.duration":"소요 시간","toolbar.useActualDuration":"실제 시간 비율로 보기","toolbar.useEqualWidth":"동작별 같은 폭으로 보기","toolbar.actualTime":"실제 시간","toolbar.turns":"턴","toolbar.expandTurns":"모든 턴 펼치기","toolbar.collapseTurns":"모든 턴 접기","toolbar.calls":"호출","toolbar.expandCalls":"모든 호출 펼치기","toolbar.collapseCalls":"모든 호출 접기","toolbar.search":"실행 기록 검색","toolbar.searchPlaceholder":"검색","kind.system":"시스템","kind.user":"사용자","kind.context":"컨텍스트","kind.compacted":"압축됨","kind.message":"메시지","kind.assistant":"어시스턴트","kind.tool":"도구","kind.subtool":"하위 도구","kind.sub":"하위 항목","column.input":"입력","column.output":"출력","column.think":"생각","column.time":"시간","column.model":"모델","column.tools":"도구","turn.label":"{turn}번째 턴","section.betweenTurns":"턴 사이","group.message":"메시지","group.step":"{step}단계","group.compaction":"압축 {seq}","status.failed":"실패","status.pending":"기다리는 중","status.completed":"완료","timing.notAvailable":"쓸 수 없음","timing.notRecorded":"기록 안 됨","timing.stepStartUnavailable":"단계 시작 시간 없음","timing.firstTokenUnavailable":"첫 토큰 시간 없음","timing.usageUnavailable":"사용량 없음","timing.outputTokensUnavailable":"출력 토큰 수 없음","timing.durationTooShort":"시간이 너무 짧음","timing.showLocalTime":"현지 시간 보기","timing.showUnixTimestamp":"Unix 타임스탬프 보기","timing.started":"시작 시간","timing.totalDuration":"총 소요 시간","timing.ttft":"첫 토큰 지연","timing.generation":"생성","timing.throughput":"처리량","timing.duration":"소요 시간","timing.source":"시간 측정 출처","timing.sessionTimestamps":"세션 타임스탬프","timing.sessionTimestampsRunning":"세션 타임스탬프(실행 중)","timing.request":"요청 시간 측정","unit.milliseconds":"{value}ms","unit.seconds":"{value}초","unit.tokens":"{value} tok","unit.tokensPerSecond":"{value} tok/s","usage.tokens":"Token","usage.reasoning":"추론","usage.content":"내용","usage.notReported":"사용량 보고 없음","usage.input":"입력","usage.cached":"캐시 읽기","usage.cacheCreated":"캐시 쓰기","usage.other":"기타","usage.output":"출력","usage.thisRequest":"이번 요청","usage.sessionCumulative":"세션 누적","options.notRecorded":"기록된 옵션 없음","options.json":"요청 옵션 JSON","source.unknown":"알 수 없음","source.user":"사용자","source.plugin":"플러그인","source.pluginNamed":"플러그인 · {plugin}","source.goal":"목표","source.goalRound":"목표 · {round}회차","source.notRecorded":"기록된 출처 없음","source.messageJson":"메시지 출처 JSON","tab.summary":"개요","tab.rawOutput":"원본 출력","tab.preview":"미리보기","tab.raw":"원본 내용","tab.source":"출처","tab.payload":"인자","tab.result":"결과","tab.schema":"Schema","tab.timing":"시간 측정","tab.diff":"차이","tab.systemPrompt":"시스템 프롬프트","tab.tools":"도구","tab.options":"옵션","tab.usage":"사용량","record.toolCallOnly":"(도구 호출만)","record.noContent":"내용 없음","record.noPayload":"인자를 잡지 못함","record.noResult":"결과를 잡지 못함","record.noOutput":"출력 없음","record.schemaUnavailable":"스키마를 쓸 수 없음","record.parameters":"인자","record.resultJson":"결과 JSON","record.json":"JSON","record.parametersJson":"인자 JSON","record.namedParametersJson":"{name} 인자 JSON","record.payloadJson":"인자 JSON","record.outputJson":"결과 JSON","record.thinking":"생각","record.wrapLines":"자동 줄바꿈","code.source":"코드","code.output":"출력","code.copySource":"코드 복사","code.copyOutput":"출력 복사","code.originalJson":"원본 JSON","code.running":"실행 중…","record.systemPromptMissing":"이번 요청에는 시스템 프롬프트가 없습니다","record.toolsMissing":"이번 요청에는 도구가 없습니다","record.systemPrompt":"시스템 프롬프트","record.tools":"도구","block.openSummary":"{index}번째 블록의 도구 호출 개요 열기","block.openSummaryTitle":"도구 호출 개요 열기","block.label":"블록 #{index} {type}","history.loadingTrajectory":"실행 기록 불러오는 중…","history.loadingEarlier":"이전 기록 불러오는 중…","history.loadingEarlierAria":"이전 기록 불러오는 중…","history.loadEarlier":"이전 기록 불러오기","history.clickToLoadEarlier":"눌러서 이전 기록 불러오기","request.label":"요청 #{request}","request.labelCompaction":"요청 #{request} · 압축","request.compaction":"압축 · {section}","request.compactionPurpose":"압축","request.retryProgress":"{retry}/{maximum}","request.collapsedSummary":"접힌 {kind} 개요, {summary}","request.collapsedTurn":"턴","request.collapsedAssistant":"어시스턴트","request.rowAria":"{request}{kind}，{content}","request.rowPrefix":"요청 {request}, ","request.rowAriaCompaction":"요청 {request}, 압축","request.noContent":"내용 없음","summary.toolCalls.one":"도구 호출 {count}개","summary.toolCalls.other":"도구 호출 {count}개","summary.steps.one":"단계 {count}개","summary.steps.other":"단계 {count}개","details.event":"이벤트 상세","details.resize":"이벤트 상세 너비 조정","details.resizeTitle":"끌어서 크기 조정, 더블클릭하면 기본값으로.","details.close":"상세 닫기","details.status":"상태","details.purpose":"용도","details.provider":"공급자","details.model":"모델","details.toolCalls":"도구 호출","details.subtoolCalls":"하위 도구 호출","details.error":"오류","details.lastAttemptError":"지난 시도 오류","details.failure.auth":"API 키가 올바르지 않습니다","details.retry":"다시 시도","details.retryDelay":"재시도 대기 시간","details.result":"결과","details.compacted":"압축됨","details.assistantMessage":"어시스턴트 메시지","details.source":"출처","details.hierarchy":"계층","details.toolCall":"도구 호출","timeline.aria":"실행 기록 타임라인","timeline.overviewAria":"타임라인 개요. 가로로 끌면 이벤트에 초점을 맞춥니다","timeline.noTimingData":"시간 데이터 없음","timeline.total":"총 {duration}","timeline.started":"{time} 시작","timeline.ttftDecoding":"첫 토큰 {ttft} · 디코딩 {decoding}","layout.compacting":"컨텍스트 압축 중…","layout.compactionFailed":"컨텍스트 압축 실패","layout.compacted":"컨텍스트가 압축됨","layout.toolCallOnly":"도구 호출만","attachment.list":"첨부","attachment.imageName":"이미지 {index}","layout.imageCount":"이미지 ×{count}","layout.fileAttachments":"파일 ×{count}","layout.initialSystemPrompt":"처음 시스템 프롬프트","layout.systemPromptUpdated":"시스템 프롬프트가 업데이트됨","layout.toolsUpdated":"도구가 업데이트됨","layout.toolAdded":"도구 추가됨: {name}","layout.toolRemoved":"도구 제거됨: {name}","layout.toolUpdateNotice":"도구가 업데이트됨","layout.toolsAdded":"추가: {names}","layout.toolsAddedCount":"{count}개 추가","layout.toolsChanged":"{added}개 추가, {removed}개 제거","layout.toolsRemoved":"제거: {names}","layout.toolsRemovedCount":"{count}개 제거","layout.systemPromptAndToolsUpdated":"시스템 프롬프트와 도구가 업데이트됨","layout.compactionInterrupted":"컨텍스트 압축이 끝나기 전에 중단되었습니다."},"question":{"error.incomplete":"먼저 이 질문을 끝내 주세요.","error.unanswered":"선택지를 고르거나 직접 답을 적어 주세요.","error.unavailable":"지금은 제출할 수 없습니다. 잠시 뒤 다시 시도하세요.","error.resubmit":"답변이 전달되지 않았고 작업은 계속되었습니다. 한 번 더 제출해 주세요.","status.sent":"답변은 보냈지만 패널을 닫지 못했습니다.","wait.takeTime":"천천히 답하기","wait.countdown":"{seconds}초 뒤 작업 계속","wait.paused":"일시 중지 · {seconds}초 남음","wait.held":"답할 때까지 계속 기다립니다","wait.continued":"작업을 계속하고 있습니다. 그래도 답할 수 있습니다","review.status":"답변함","review.skipped":"이 질문은 그때 건너뛰었습니다.","reply.label":"앞서 기다리던 질문에 답하기","reply.open":"질문 상세 펼치기","reply.close":"질문 상세 접기","reply.answerLabel":"답변: ","reply.skipped":"건너뜀","nav.prev":"이전 질문","nav.next":"다음 질문","nav.minimize":"질문 카드 접기","nav.maximize":"질문 카드 펼치기","nav.cancel":"질문 묶음 전체 포기","nav.close":"질문 패널 접기(도구 호출에서 다시 열 수 있음)","option.recommended":"추천","custom.placeholder":"답을 입력하세요","action.skip":"건너뛰기","action.next":"다음 질문","plan.header":"계획 검토 대기","plan.approve":"실행 동의","plan.decline":"거부","plan.discuss":"수정 요청"},"workflowRun":{"run.title":"{name}","run.members.one":"멤버 {count}명","run.members.other":"멤버 {count}명","run.empty":"시작한 멤버 없음","phase.unassigned":"단계 없음","phase.empty":"빈 단계 이름","statusCount.running":"{count}개 실행 중","statusCount.completed":"{count}개 완료","statusCount.failed":"{count}개 실패","statusCount.cancelled":"{count}개 취소","statusCount.interrupted":"{count}개 중단","member.empty":"빈 멤버 이름","member.open":"{name} 열기","status.running":"실행 중","status.completed":"완료","status.failed":"실패","status.cancelled":"취소됨","status.interrupted":"중단됨"},"workspace":{"defaultWorkspace.failed":"기본 작업 공간을 만들 수 없습니다. ‘작업 공간 선택’으로 폴더를 고르세요","draft.workspaceRequired":"먼저 작업 공간을 고르세요","draft.initializationFailed":"지금은 초안을 넣을 수 없습니다. 잠시 뒤 다시 시도하세요","group.ungrouped":"그룹 없음","session.new":"새 세션","session.untitled":"이름 없음","shortcut.noSession":"먼저 세션을 고르세요","shortcut.noPicker":"폴더 선택기를 쓸 수 없습니다","shortcut.directoryBusy":"작업 공간을 고르거나 추가하는 중","shortcut.noCompletedTurn":"현재 세션에는 끝난 턴이 없습니다","shortcut.forkFailed":"세션을 분기할 수 없습니다. 다시 시도하세요","section.workspaces":"작업 공간","section.sessions":"세션","viewOptions.label":"보기 옵션","groupBy.label":"그룹 방식","groupBy.workspace":"작업 공간별","groupBy.workspaceTree":"작업 공간 트리별","groupBy.flat":"한 목록","orderBy.label":"정렬 방식","orderBy.manual":"직접 정렬","orderBy.updated":"최근 업데이트순","filterBy.label":"세션 필터","viewOptions.hideArchived":"보관된 항목 숨기기","viewOptions.showArchived":"모든 대화(보관 포함)","viewOptions.onlyArchived":"보관된 항목만","sessions.expand":"나머지 세션 {n}개 펼치기","sessions.collapse":"접기","empty.none":"세션이 없습니다","empty.noneArchived":"보관된 세션이 없습니다","empty.viewOthers":"다른 세션 보기","empty.noMatches":"일치하는 결과 없음","workspace.add":"작업 공간 추가","search.sessions.aria":"세션 검색","search.placeholder":"세션 이름 검색","search.clear":"검색 지우기","search.results.aria":"검색 결과","search.pending":"세션 기록 검색 중…","search.noMatches":"일치하는 세션 없음","search.hasMore":"앞의 {n}개 결과만 보여 줍니다. 검색 범위를 좁혀 보세요.","menu.addWorkspace":"작업 공간 추가…","picker.loading":"작업 공간 불러오는 중…","conflict.named":"“{name}”이라는 작업 공간이 이미 있습니다.","folderError.title":"폴더를 열 수 없습니다","folderError.retry":"다시 고르기","rename":"이름 바꾸기","rename.workspace.title":"작업 공간 이름 바꾸기","rename.session.title":"세션 이름 바꾸기","field.workspaceName":"작업 공간 이름","field.sessionName":"세션 이름","delete.workspace":"작업 공간 삭제","delete.desc":"“{name}”을(를) 작업 공간 목록에서 뺍니다. 폴더와 세션 기록은 남고, 그 세션들은 ‘그룹 없음’ 아래에 표시됩니다.","delete.pending":"작업 공간 삭제하는 중…","menu.fork":"세션 분기","menu.archiveSession":"세션 보관","menu.unarchiveSession":"보관 해제","menu.deleteSession":"세션 삭제","delete.session.confirm":"“{title}” 세션을 삭제할까요?\n\n목록에서 바로 사라지고, 기록 파일은 다음에 Harness를 켤 때 휴지통으로 옮겨집니다.","menu.pinSession":"세션 고정","menu.unpinSession":"고정 해제","menu.sessionId":"세션 ID 복사","toast.sessionIdCopied":"세션 ID 복사됨","toast.sessionIdCopyFailed":"복사 실패. 다시 시도하세요","row.archived":"보관됨","row.pinned":"고정됨","toast.archivedNotOpenable":"보관된 대화는 지금 볼 수 없습니다. 보관을 해제한 뒤 보세요","toast.archived":"세션을 보관했습니다. ","toast.stoppedAndArchived":"중지하고 보관했습니다. ","archive.confirm.title":"이 세션을 중지하고 보관할까요?","archive.confirm.desc":"“{title}”에 아직 진행 중인 작업이 있습니다. 보관하면 먼저 이 작업들을 멈춥니다. 나중에 사이드바 필터 ‘모든 대화(보관 포함)’에서 세션을 되살릴 수 있지만, 멈춘 작업이 자동으로 다시 이어지지는 않습니다.","archive.confirm.activity":"멈출 작업","archive.confirm.turn":"진행 중인 턴","archive.confirm.subagents.one":"실행 중인 하위 에이전트 {n}개: {names}","archive.confirm.subagents.other":"실행 중인 하위 에이전트 {n}개: {names}","archive.confirm.jobs.one":"백그라운드 작업 {n}개: {names}","archive.confirm.jobs.other":"백그라운드 작업 {n}개: {names}","archive.confirm.schedules.one":"예약 알림 {n}개: {names}","archive.confirm.schedules.other":"예약 알림 {n}개: {names}","archive.confirm.other.one":"그 밖의 작업 {n}개({kind})","archive.confirm.other.other":"그 밖의 작업 {n}개({kind})","archive.confirm.listSeparator":"、","archive.confirm.action":"중지하고 보관","archive.confirm.pending":"중지하고 보관하는 중…","toast.archivedUndo":"실행 취소","toast.archivedOr":"또는","toast.archivedFilter":"보관된 세션 필터","toast.pinFailed":"고정 실패. 잠시 뒤 다시 시도하세요","toast.unpinFailed":"고정 해제 실패. 잠시 뒤 다시 시도하세요","toast.createFailed":"새 세션 만들기 실패: {message}","toast.forkRequiresOpen":"먼저 원래 세션을 열어 마이그레이션을 끝낸 뒤 분기하세요","toast.openForkSource":"원래 세션 열기","sessions.count.one":"세션 {n}개","sessions.count.other":"세션 {n}개","actions.workspace.aria":"작업 공간 “{name}” 메뉴","actions.session.aria":"세션 “{name}” 메뉴","actions.archive":"세션 보관","actions.unarchive":"보관 해제","actions.pin":"세션 고정","actions.unpin":"고정 해제","actions.newSession":"새 세션","actions.newSession.aria":"“{name}”에 새 세션 만들기","status.running":"진행 중","status.subagentsRunning.one":"하위 에이전트 {n}개 실행 중","status.subagentsRunning.other":"하위 에이전트 {n}개 실행 중","status.idle":"대기 중","status.waitingApproval":"승인 대기 중","status.planReview":"계획 검토 대기","status.waitingAnswer":"답변 기다리는 중","status.compact.approval":"승인 대기","status.compact.planReview":"계획 검토 대기","status.compact.answer":"답변 대기","status.completed":"완료","hover.created":"{time}에 만듦","hover.copied":"복사됨","date.ymd":"{y}년 {m}월 {d}일","time.now":"방금","time.minutes":"{n}분","time.hours":"{n}시간","time.days":"{n}일","time.months":"{n}개월","time.years":"{n}년","time.ago":"{t} 전"},"agent-team":{"trigger":"에이전트 팀","loading":"팀 불러오는 중…","unavailable":"팀을 지금 쓸 수 없습니다","failure":"팀 영구 기록이 올바르지 않습니다: {message}","empty":"공유 작업이 없습니다. 대화로 만들 수 있습니다","roster":"멤버","tasks":"공유 작업","model":"모델","open":"멤버 세션 열기","current":"현재 세션","owner":"Owner","unowned":"배정 안 됨","blockedBy":"의존성","writeScopes":"쓰기 범위","ready":"시작 가능","blocked":"의존성 때문에 막힘","task.expand":"펼치기","task.collapse":"접기","memberStatus.running":"실행 중","memberStatus.inactive":"실행 안 함","memberStatus.provisioning":"준비 중","memberStatus.failed":"실패","status.pending":"처리 대기","status.in_progress":"진행 중","status.completed":"완료"},"cotTranslation":{"provider":"번역 서비스","google":"Google","bing":"Bing","deepseekAccount":"DeepSeek Flash · 계정(유료)","deepseekOfficial":"DeepSeek Flash · 공식 API(유료)","providerUnavailableOption":"{provider} — 쓸 수 없음","providerUnavailable":"이 서비스는 지금 쓸 수 없습니다. DeepSeek 계정이나 공식 API를 설정하거나, 쓸 수 있는 번역 서비스를 고르세요","paidNotice":"캐시되지 않은 조각마다 고른 계정이나 공식 API 자격 증명으로 유료 DeepSeek Flash 요청을 한 번씩 보냅니다. 다시 펼치면 저장된 번역을 다시 쓰고, 서비스·언어·원문·요청 설정을 바꾸면 새 유료 요청이 나갈 수 있습니다","anonymousNotice":"Bing과 Google 번역은 따로 로그인이나 API 키가 필요 없지만, 익명 API라 요청을 거부하거나 제한할 수 있습니다","targetLanguage":"대상 언어","targetLanguageHint":"auto는 화면 언어를 씁니다. 언어 코드를 직접 넣을 수도 있습니다. 예: ko, en, ja","privacy":"펼친 생각 내용이 고른 번역 서비스로 전송되며, 비공개 코드나 대화 내용이 들어 있을 수 있습니다.","translation":"번역 보기","original":"원문 보기","retry":"다시 시도","failed":"번역을 쓸 수 없어 원문을 보여 줍니다","translating":"생각 내용 번역 중","invalidProvider":"번역 서비스를 고르세요","invalidLanguage":"auto 또는 언어 코드를 입력하세요. 예: ko, en, ja","overridden":"덮어씀","reset":"기본값 복원","unavailable":"번역 설정을 지금 쓸 수 없습니다","readOnly":"이 배포의 설정은 읽기 전용입니다","saveFailed":"이 배포가 이 값들을 받아들이지 않았습니다. 고칠 수 있도록 남겨 두었습니다","save":"저장","saving":"저장 중…","copy":"복사","copied":"복사됨","codeTitle":"코드 블록","wrap":"자동 줄바꿈","unwrap":"줄바꿈 안 함","footnotes":"각주"},"voice-input":{"dictate":"받아쓰기","setupPrompt.title":"음성 입력을 쓰려면 설치가 필요합니다","setupPrompt.body":"음성 입력 플러그인이 켜졌습니다. 처음 쓸 때는 이 PC에 인식 모델을 내려받아 준비해야 합니다. 플러그인 상세 페이지에서 필요한 공간, 메모리, 시간을 확인한 뒤 설치를 시작하세요.","setupPrompt.later":"나중에","setupPrompt.open":"설치하러 가기","setupPrompt.trigger":"음성 입력 안내 열기","setupPrompt.details":"음성 플러그인 설정으로 가기","setupPrompt.unavailableTitle":"음성 인식이 아직 준비되지 않았습니다","setupPrompt.unavailableBody":"음성 플러그인 상세 페이지에서 인식 서비스 상태, 준비 진행 상황, 오류 정보를 확인하세요","setup.local":"DSH가 실행되는 PC에 로컬 모델을 내려받습니다. Python이나 컴파일 도구는 필요 없습니다.","setup.disk":"디스크 공간","setup.diskValue":"모델, 런타임, 다운로드 캐시를 포함해 약 {gb}GB를 비워 두는 것이 좋습니다","setup.memory":"메모리","setup.memoryValue":"모델을 불러오면 약 {gb}GB, 인식할 때는 더 쓸 수 있습니다","setup.time":"첫 준비","setup.timeValue":"네트워크와 PC 성능에 따라 약 {min}–{max}분","setup.estimateNote":"위 값은 추정치이며 네트워크가 느리면 더 걸릴 수 있습니다. 내려받은 자료는 다시 쓰고, 기본적으로 쉬고 있으면 모델 메모리를 풀어 줍니다.","step.check":"로컬 자료 확인","step.model":"음성 인식 모델 준비","step.vad":"음성 감지 모델 준비","step.verify":"모델 파일 검증","step.load":"{name} 불러오기","stepStatus.pending":"시작 안 함","stepStatus.running":"진행 중","stepStatus.complete":"완료","stepStatus.failed":"실패","stepStatus.cancelled":"취소됨","short.downloading":"내려받는 중","short.failed":"준비 실패","retryRecording":"다시 녹음","preparationSteps":"준비 단계","prepare":"내려받아 준비","retryPrepare":"준비 다시 시도","cancelPrepare":"준비 취소","downloadProgress":"다운로드 진행","downloadBytes":"다운로드: {completed} / {total}MB, {percent}%","downloadUnknown":"{completed}MB 내려받음","elapsed":"{seconds}초 기다림","preparationFailed":"준비 실패: {message}","download.network":"{resource}을(를) 내려받을 수 없습니다: 다운로드 서버 연결 실패.","download.dns":"{resource}을(를) 내려받을 수 없습니다: 다운로드 주소를 해석할 수 없음.","download.timeout":"{resource} 다운로드 시간 초과.","download.certificate":"{resource}을(를) 내려받을 수 없습니다: 보안 연결 인증서 검증 실패.","download.http":"{resource}을(를) 내려받을 수 없습니다: 다운로드 서버가 HTTP {status}을(를) 반환함.","download.integrity":"{resource} 다운로드가 불완전하거나 파일 검증에 실패했습니다.","download.storage":"{resource}을(를) 저장할 수 없습니다: 디스크 공간이 부족하거나 쓰기 권한이 없습니다.","download.unknown":"{resource} 준비 실패.","downloadAdvice.network":"DSH가 실행되는 PC에서 다운로드 출처와 모델 다운로드 서버에 접속할 수 있는지 확인하세요. 프록시가 필요하면 그 PC에서 설정한 뒤 다시 시도하세요.","downloadAdvice.dns":"DSH가 실행되는 PC의 DNS와 프록시 설정을 확인하고, 다운로드 출처의 도메인을 해석할 수 있는지 확인한 뒤 다시 시도하세요.","downloadAdvice.timeout":"DSH가 실행되는 PC의 네트워크나 프록시 연결을 확인하고 잠시 뒤 다시 시도하세요. 내려받아 검증된 파일은 남아 있습니다.","downloadAdvice.certificate":"DSH가 실행되는 PC의 시스템 시간, 신뢰할 수 있는 인증서, 프록시 설정을 확인한 뒤 다시 시도하세요.","downloadAdvice.http":"다운로드 주소가 살아 있는지, 프록시가 다운로드 서버에 제대로 연결되는지 확인하거나 잠시 뒤 다시 시도하세요.","downloadAdvice.integrity":"다운로드를 다시 시도하세요. 끝나서 검증된 다른 파일은 남아 있습니다.","downloadAdvice.storage":"DSH가 실행되는 PC의 남은 디스크 공간과 모델 폴더의 쓰기 권한을 확인한 뒤 다시 시도하세요.","downloadAdvice.unknown":"DSH가 실행되는 PC의 네트워크, 디스크 공간, 모델 폴더 권한을 확인한 뒤 다시 시도하세요.","downloadSource":"다운로드 출처: {source}","sourceChoice":"모델 다운로드 소스","sourceAuto":"자동 선택(추천)","sourceHuggingFace":"Hugging Face","sourceMirror":"HF-Mirror(중국 미러)","sourceAutoHelp":"응답이 빠른 소스를 먼저 쓰고, 다운로드에 실패하면 다른 소스를 자동으로 시도합니다.","sourceManualHelp":"고른 소스에서만 내려받습니다. 내려받아 검증된 파일은 다시 씁니다.","downloadCode":"오류 코드: {code}","reconnecting":"음성 서비스에 연결하는 중…","preparation.unprepared":"처음 쓸 때는 로컬 인식 모델을 내려받아야 합니다.","preparation.checking":"로컬 자료 확인 중…","preparation.loading":"{name} 불러오는 중…","preparation.waking":"로컬 음성 깨우는 중…","preparation.ready":"로컬 음성이 준비되었습니다.","preparation.standby":"로컬 자료가 준비되었습니다. 녹음할 때 자동으로 깨어납니다.","preparation.cancelled":"준비를 취소했습니다. 끝난 다운로드는 남아 있습니다.","preparation.cancelling":"준비 취소하는 중…","cloudReady":"클라우드 음성 인식이 준비되었습니다.","discard":"인식한 글 버리기","transcribingShort":"인식 중…","wakingShort":"깨우는 중…","provider":"인식 서비스","language":"인식 언어","inputDevice":"입력 장치","systemMicrophone":"시스템 기본","systemMicrophoneNamed":"시스템 기본({name})","unnamedSelectedMicrophone":"마이크","unnamedMicrophone":"마이크 {number}","inputLevel":"마이크 입력 레벨","deviceUnavailable":"쓸 수 없음","deviceMissing":"마이크를 쓸 수 없습니다. 다른 입력 장치를 고르세요","auto":"자동 인식","zh":"한국어","en":"영어","yue":"광둥어","ja":"일본어","ko":"한국어","start":"녹음 시작","stop":"멈추고 인식","cancel":"취소","insert":"글 넣기","loading":"인식 서비스 읽는 중…","requesting":"마이크 사용을 허용해 주세요…","recording":"녹음 중…","interrupted":"녹음이 끊겼습니다. 다시 시도하세요.","local":"음성은 DSH가 실행되는 PC에서 인식합니다. 모델을 내려받아야 할 때는 그 PC에서 고른 다운로드 소스와 파일 서버에 접속할 수 있어야 합니다. 프록시가 필요하면 그 PC에서 설정하세요.","cloud":"음성이 고른 클라우드 서비스로 전송됩니다.","empty":"음성을 인식하지 못했습니다","cancelled":"음성 입력을 취소했습니다.","conflict":"초안이 바뀌었습니다. 인식한 글은 남겨 두었으니 지금 커서 위치에 넣을 수 있습니다.","failed":"음성 인식 실패: {message}","unavailable":"이 브라우저는 녹음을 지원하지 않습니다. 마이크를 지원하는 브라우저를 쓰세요.","permission":"마이크 권한이 꺼져 있습니다. 브라우저와 시스템 설정에서 허용하세요.","tooLarge":"녹음이 서비스 한도를 넘었습니다. 짧게 줄여 다시 시도하세요."},"session-inspector":{"tab.title":"세션 데이터 진단","tab.description":"사이드바에서 현재 세션의 원본 로그와 채팅 그룹 데이터 분석","view.presentation":"표시 형식","view.sessionLog":"원본 데이터","view.chatNode":"대화 그룹","picker.pick":"대화 패널에서 요소 고르기","picker.cancel":"고르기 취소(Esc)","picker.instructions":"왼쪽 채팅에 마우스를 올려 미리 보고, 눌러서 고릅니다. Esc로 취소.","picker.noMatch":"현재 표에 일치하는 기록이 없습니다. 다른 요소를 고르거나 Esc로 취소하세요.","picker.noChat":"먼저 메인 영역에서 현재 세션의 채팅을 여세요.","table.id":"번호","table.type":"유형","filter.title":"유형 필터","filter.input":"유형 키워드","filter.placeholder":"유형 일부를 입력하세요. 예: delta","filter.help":"기본은 포함 일치(*키워드*)입니다. Enter로 확인, Esc로 취소.","filter.candidates":"유형 후보","filter.loading":"후보 찾는 중…","filter.failed":"유형 후보를 가져올 수 없습니다.","filter.noCandidates":"일치하는 후보는 없지만 현재 키워드로 확인할 수 있습니다.","filter.clear":"비우기","filter.cancel":"취소","filter.apply":"필터 확인","filter.context":"일치한 기록의 상위 컨텍스트","table.location":"T/S","table.time":"시간(UTC)","table.data":"데이터","table.older":"이전 기록 더 불러오기","table.loading":"불러오는 중…","table.latest":"최신 따라가기","table.empty":"기록 없음","table.raw":"원본 데이터","table.rawError":"이 기록은 직렬화할 수 없습니다. 다른 기록을 골라 계속 보세요.","table.resizeDetails":"원본 데이터 패널 높이 조정","table.close":"닫기","table.expand":"하위 행 펼치기","table.collapse":"하위 행 접기","table.removed":"이 기록은 제거됐거나 정산되었습니다. 현재 기록을 고르세요.","object.node":"Node","object.nodeData":"Node Data","object.group":"Group","object.groupData":"Group Data","object.turn":"Turn","object.turnData":"Turn Data","object.step":"Step","object.stepData":"Step Data","object.accessor":"[Getter / Setter, 실행 안 함]","object.empty":"빈 값","object.absent":"[빈 슬롯]","object.properties":"기타 속성","object.more":"더 보기","object.navigation":"원본 데이터 이동"},"session-log-download":{"header.more":"작업 더 보기","menu.download":"세션 로그 내려받기","menu.feedback":"피드백","dialog.preparingTitle":"세션 내보내는 중","dialog.preparingDescription":"현재 세션, 하위 세션, 첨부를 담은 ZIP 파일을 준비하는 중입니다.","dialog.successTitle":"세션 내보내기 다운로드 시작","dialog.successDescription":"브라우저가 세션 ZIP 파일을 내려받는 중입니다.","dialog.errorTitle":"세션 내보내기 실패","dialog.close":"닫기","dialog.commandFailed":"세션 내보내기를 시작할 수 없습니다."}};
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
  // LOCAL PATCH: DeepSeek짱 — Harness 화면에 밝은 파스텔 테마와 Live2D 캐릭터(상반신)를 띄우고,
// 지금 열린 대화의 Harness 작업 상태(작업 중 / 도구 / 승인·질문 대기 / 완료 / 실패)에 반응한다.
// 바깥 신호는 받지 않는다(포트 없음). 제거: dist/index.html의 dsc 두 줄을 지우면 된다.
(() => {
  const BASE = ROOT;   // dsh-app://app/assets/dsc/
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
      for (const r of records) for (const n of r.addedNodes) scanAdded(n);
    }).observe(document.body, { childList: true, subtree: true });

    // ---------- Live2D ----------
    const load = (src) => new Promise((ok, no) => {
      const s = life.own(document.createElement("script"), (node) => node.remove()); s.src = BASE + src; s.onload = ok; s.onerror = () => no(new Error(src));
      document.head.appendChild(s);
    });
    (async () => {
      if (!window.Live2DCubismCore) await load("vendor/live2dcubismcore.min.js");
      if (!window.PIXI) await load("vendor/pixi.min.js");
      if (!window.PIXI.live2d) await load("vendor/cubism4.patched.js");
      if (life.stopped) return;

      const W = 300, H = 300;
      const canvas = life.own(document.createElement("canvas"), (node) => node.remove()); canvas.id = "dsc-stage";
      const bubble = life.own(document.createElement("div"), (node) => node.remove()); bubble.id = "dsc-bubble";
      document.body.append(canvas, bubble);
      const app = new PIXI.Application({ view: canvas, width: W, height: H, sharedTicker: false, backgroundAlpha: 0, antialias: true, autoDensity: true, resolution: (devicePixelRatio || 1) * 1.5 });   // 1.5배로 그려 줄여 보여 줌
      life.add(() => app.destroy(true, { children: true }));
      const model = await PIXI.live2d.Live2DModel.from(BASE + "model/model.model3.json", { autoUpdate: false, autoInteract: false, idleMotionGroup: "Idle" });
      if (life.stopped) { model.destroy(); return; }
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
        life.add(() => { try { w.terminate() } catch {} })
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
      if (life.stopped) return;
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
        if (el && PET && petPanelOpen && petPanel && petPanel.contains(el)) return false;   // 펫 설정 패널의 range/체크박스는 텍스트 입력이 아니다
        const tag = el && el.tagName ? el.tagName.toLowerCase() : "";
        if (el && el.isContentEditable) return true;
        if (tag === "textarea") return true;
        if (tag !== "input") return false;
        const type = String(el.type || "text").toLowerCase();
        return ["text", "search", "email", "url", "tel", "password", "number"].includes(type);   // 체크박스·라디오·range 등은 제외
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
      // 모바일에서만 시각 뷰포트(주소창·키보드)를 쓴다. 데스크톱은 예전처럼 창 크기로 계산한다.
      const layoutViewport = () => coarsePointer() ? viewport() : { w: innerWidth, h: innerHeight, top: 0, left: 0 };
      // 제자리 배치: 컴포저(입력 카드) 오른쪽·아래 여유가 있으면 오른쪽 아래(데스크톱),
      // 좁은 화면처럼 옆 여유가 없으면 컴포저 위로 올린다. 위쪽에는 말풍선 자리(BUBBLE_ROOM)를 남겨 두고,
      // 자동 크기일 때 컴포저 위 자리는 대화 내역을 덜 가리도록 조금 작게(MOBILE_ABOVE_SCALE) 둔다
      const HOME_GAP = 8, BUBBLE_ROOM = 78, SHOW_K = 0.42, MIN_SHOW_K = 0.18, MOBILE_ABOVE_SCALE = 0.3;
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
        const sideK = Math.min(maxK, Math.max((vp.w - (r.right - vp.left) - HOME_GAP) / visW, (vp.h - (r.bottom - vp.top) - (allowAbove ? 4 : 10)) / visH));
        // 데스크톱은 업스트림과 같은 계산을 그대로 쓴다 (작은 창에서도 붙을 자리는 dockTarget이 처리)
        if (!allowAbove) return { k: sideK, x: rightX(sideK), y: bottomY(sideK), above: false };
        const aboveRoom = (r.top - vp.top) - HOME_GAP - BUBBLE_ROOM;
        const aboveK = Math.min(maxK, aboveRoom / H, (vp.w - HOME_GAP) / visW);
        if (sideK >= Math.min(minK, maxK)) return fit(sideK, false);
        // 컴포저 위 배치(자동 크기의 30%)는 터치 화면에서만 쓴다
        if (aboveK >= MIN_SHOW_K) return fit(aboveK, true);
        const k = Math.min(maxK, MIN_SHOW_K);
        return { k, x: rightX(k), y: bottomY(k), above: false, noSafe: true };   // 컴포저 위·아래 어디에도 피할 자리가 없음 → 제자리에서는 숨긴다
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
      const free = { on: false, x: 0, y: 0, k: 1, anim: null, mode: null };
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
      // 자유 위치는 입력 모드별로 따로 기억한다. 같은 브라우저에서 터치 모드와 데스크톱 모드가
      // 서로의 자리를 덮어쓰지 않게 하기 위해서다.
      const FREE_KEY = "dsc-free-pos";
      const FREE_KEY_MOBILE = "dsc-free-pos-mobile";
      const freeMode = () => coarsePointer() ? "mobile" : "desktop";
      const freeStorageKey = (mode) => mode === "mobile" ? FREE_KEY_MOBILE : FREE_KEY;
      // 창 안 자유 위치는 창 크기 비율로 기억: 몸 가운데의 가로 비율(fx)·그림 아래 끝의 세로 비율(fy).
      // 창 크기가 바뀌면 같은 비율 자리로 옮겨 가서, 최대화를 풀어도 옛 픽셀 자리에 남아 화면 밖으로 밀리지 않음
      const freeToRatio = () => { free.fx = (free.x + W * free.k / 2) / innerWidth; free.fy = (free.y + H * free.k) / innerHeight; };
      if (!PET) try {
        const mode = freeMode();
        const s = JSON.parse(localStorage.getItem(freeStorageKey(mode)) || "null");
        // 예전 단일 키는 데스크톱 자리로 복원한다. 모바일은 새 키만 읽어 서로 덮어쓰지 않는다.
        if (s && isFinite(s.fx) && isFinite(s.fy) && s.k > 0 && (!s.mode || s.mode === mode)) {
          Object.assign(free, { on: true, fx: s.fx, fy: s.fy, k: s.k, mode });
        }
      } catch {}
      const saveFree = (fromPose = true) => {   // fromPose: 지금 x·y에서 비율을 다시 계산 (휠처럼 크기만 바꿀 땐 비율을 그대로 둠)
        if (PET) return;
        if (free.on && fromPose) freeToRatio();
        try {
          const mode = free.mode || freeMode();
          const key = freeStorageKey(mode);
          if (free.on) localStorage.setItem(key, JSON.stringify({ mode, fx: +free.fx.toFixed(4), fy: +free.fy.toFixed(4), k: +free.k.toFixed(3) }));
          else localStorage.removeItem(key);
        } catch {}
      };
      // 산책: 가끔 가까운 쪽 화면 밖으로 걸어 나갔다가 잠시 뒤 같은 쪽에서 걸어 들어옴 (phase: "" | ready | out | away | in, dir: -1 왼쪽 · 1 오른쪽)
      const walk = { phase: "", face: 0, dir: -1, out: 0, timers: [], slideId: 0, lastTouch: 0, next: performance.now() + (180 + Math.random() * 180) * 1000 };
      let walkCheck = null;
      // 시작 연출: 처음엔 화면 가운데에 크게 인사 → 본 화면이 뜨면 오른쪽 아래 제자리로 이동
      const DPR = (devicePixelRatio || 1) * 1.5;   // 1.5배로 그려 줄여 보여 줌 (윤곽선 매끄럽게)
      const intro = { phase: "center", start: performance.now(), moveStart: 0, from: null, kc: 1 };
      const veil = life.own(document.createElement("div"), (node) => node.remove());
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
        const vp = layoutViewport();
        const maxK = Math.min(PET_K_MAX / PET_HEAD_RATIO, (vp.h * 0.92) / visH);
        const r = card ? cardRect(card) : null;
        // 컴포저 오른쪽·아래 여유가 부족한 좁은 화면(모바일 세로 등)이면 컴포저 위로 올린다 (입력창·전송 버튼을 가리지 않게)
        const pose = homeLayout({ vp, r, maxK, W, visW, H, visH, minK: SHOW_K, allowAbove: coarsePointer() });
        return { k: pose.k, x: pose.x + fleeX, y: pose.y, card, r, above: pose.above, noSafe: !!pose.noSafe, vp };
      };
      const centerPose = () => {
        // 가운데 아래에 붙여 상반신이 화면 아래에서 올라온 모습 (잘린 선이 화면 중간에 뜨지 않게)
        const vp = layoutViewport();
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
      // 제자리 크기가 SHOW_K보다 작으면 입력창을 피할 자리가 없음 (SHOW_K는 위 HOME_GAP 줄에서 정의)
      // 붙을 자리 = 제자리. 창이 좁아 제자리 크기가 SHOW_K보다 작으면(예전엔 숨김) 보일 수 있는 가장 작은 크기로 오른쪽 아래 구석.
      // 컴포저 위로 올린 자리(above)는 그 자리를 그대로 쓴다 — 아래 구석으로 되돌리면 입력창을 다시 가린다.
      // 매 프레임 다시 계산하므로 창 크기가 바뀌면 붙어 있는 캐릭터의 크기·위치도 따라 바뀜
      const dockTarget = (home) => (home.k >= SHOW_K || home.above || home.noSafe ? home : { k: SHOW_K, x: innerWidth - 4 - (W + visW) / 2 * SHOW_K + fleeX, y: innerHeight - H * SHOW_K });
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
        const currentMode = freeMode();
        if (!PET && free.on && free.mode && free.mode !== currentMode) {
          // 다른 입력 모드에서 저장된 자리(예: 모바일 터치 드래그)는 이 화면에 적용하지 않는다.
          // 상태는 지우지 않아, 원래 모드로 돌아오면 그 자리를 그대로 다시 쓸 수 있게 한다.
          return dockTarget(home);
        }
        if (!free.on) return dockTarget(home);
        let q = free;
        if (!PET) {   // 창 크기 비율 자리, 크기는 지금 창에 들어가는 최대치까지만
          if (!isFinite(free.fx) || !isFinite(free.fy)) freeToRatio();
          // 모바일에서는 카드가 있을 때 자동 배치 크기(컴포저 위 = 자동 크기의 30%)를 따르고,
          // 카드가 잠깐 사라진 프레임에는 마지막 자유 크기를 써서 캐릭터가 갑자기 커지지 않게 한다.
          const floor = coarsePointer() ? MIN_SHOW_K : SHOW_K;
          const baseK = coarsePointer() && home.r ? home.k : free.k;
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
        if (mobileHidden()) {   // 설정에서 모바일 표시를 껐을 때
          skipIntro();   // 숨긴 상태에서 인트로를 대기시키지 않는다. 다시 켜도 가운데 인트로가 재생되지 않게 한다
          canvas.style.display = bubble.style.display = "none"; veil.style.opacity = 0; veil.style.pointerEvents = "none"; lastPlaceKey = ""; return;
        }
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
          if (!coarsePointer()) {   // 데스크톱은 예전처럼 가운데 머리 위에 둔다
            bubble.style.left = (x + W * k / 2 - bubble.offsetWidth / 2) + "px";
            bubble.style.top = Math.max(8, headTop - bubble.offsetHeight - 6) + "px";
            return;
          }
          const bw0 = bubble.offsetWidth, bh0 = bubble.offsetHeight;
          const clampX = (left) => Math.min(Math.max(vp.left + HOME_GAP, left), Math.max(vp.left + HOME_GAP, vp.left + vp.w - bw0 - HOME_GAP));
          const clampY = (top) => Math.min(Math.max(vp.top + HOME_GAP, top), Math.max(vp.top + HOME_GAP, vp.top + vp.h - bh0 - HOME_GAP));
          bubble.style.left = clampX(x + W * k / 2 - bw0 / 2) + "px";
          bubble.style.top = clampY(Math.max(vp.top + HOME_GAP, headTop - bh0 - 6)) + "px";
          return;
        }
        const card = home.card;
        if (!coarsePointer() && !home.above) {   // 데스크톱 말풍선은 기존 배치 그대로
          bubble.style.left = "auto";
          bubble.style.right = loose ? Math.max(10, innerWidth - (x + W * k / 2 + 55)) + "px" : "10px";   // 꼬리(말풍선 오른쪽 55px)를 머리 가운데에
          bubble.style.maxWidth = Math.max(150, visW * k * 1.1) + "px";
          bubble.style.top = Math.max(8, headTop - bubble.offsetHeight - 10) + "px";
          if (card && home.r) {
            const r = home.r, bl = bubble.offsetLeft, bt = bubble.offsetTop, b = { left: bl, top: bt, right: bl + bubble.offsetWidth, bottom: bt + bubble.offsetHeight };   // 등장 애니메이션(transform) 영향 없는 레이아웃 크기
            if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) {
              bubble.classList.add("side");
              bubble.style.maxWidth = "220px";
              bubble.style.right = innerWidth - (x + (W - visW) / 2 * k) + 8 + "px";
              const sideTop = Math.max(r.bottom + 8, headTop + 4);
              if (sideTop + bubble.offsetHeight <= innerHeight - HOME_GAP) bubble.style.top = sideTop + "px";
              else {
                // 컴포저가 화면 아래 끝까지 차지해 아래로 피할 자리가 없으면, 화면 밖으로 내리지 않고
                // 캐릭터에 붙인 right 기준을 유지한 채 위쪽으로만 clamp한다.
                bubble.classList.remove("side");
                bubble.style.maxWidth = Math.min(Math.max(150, visW * k * 1.1), innerWidth - 16) + "px";
                bubble.style.top = Math.max(8, Math.min(innerHeight - bubble.offsetHeight - HOME_GAP, headTop - bubble.offsetHeight - 10)) + "px";
              }
            }
          }
          return;
        }
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
            const c = life.own(document.createElement("canvas"), (node) => node.remove()); c.width = c.height = AN;
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
        const pot = life.own(document.createElement("div"), (node) => node.remove());
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
          const fs = Math.max(60, 130 * curK), fx = life.own(document.createElement("div"), (node) => node.remove());   // 글자 없이 만화식 충격 별 + 충격선
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
      life.listen(document, "pointerdown", (e) => {
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
      life.listen(document, "pointermove", (e) => {
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
          drag.on = true; drag.touch = e.pointerType === "touch" || !!(p && p.touchGrab); drag.samples = []; free.anim = null; free.k = shown.k; free.mode = freeMode(); petDocked = false;
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
      life.listen(document, "pointerup", (e) => {
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
      life.listen(document, "pointercancel", (e) => {
        if (chestFrom && e.pointerId === chestFrom.id) { const d = chestDragging; releaseChest(); if (d && PET) PET.press(false); }
        endDrag(e, true);
      }, true);
      for (const type of ["pointerup", "mousedown", "mouseup", "click", "dblclick"]) {
        life.listen(document, type, (e) => {
          if (!swallowClick) return;
          e.preventDefault(); e.stopPropagation();
          if (type === "click" || type === "dblclick") setTimeout(() => { if (!chestFrom) swallowClick = false; }, 0);
        }, true);
      }
      let hoverCheck = 0;
      life.listen(document, "mousemove", (e) => {   // 캐릭터 위에서는 손가락 커서
        const now = performance.now(); if (now - hoverCheck < 80) return; hoverCheck = now;
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) { document.documentElement.classList.remove("dsc-hover"); return; }
        const over = !walking() && !!hitAt(e.clientX, e.clientY);
        document.documentElement.classList.toggle("dsc-hover", over);
      }, { passive: true });
      // 우클릭은 집어 옮기기의 보조 버튼이라, 끄는 중에는 메뉴를 열지 않는다 (펫 창에서는 놓은 뒤에만 메뉴)
      life.listen(document, "contextmenu", (e) => {
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
      life.listen(document, "touchstart", (e) => { if (touchOnBody(e)) e.preventDefault(); }, { passive: false, capture: true });
      life.listen(document, "touchmove", (e) => {
        // 캐릭터에서 시작한 제스처만 막는다. 바깥에서 시작한 스크롤이 캐릭터를 지나가며 막히지 않게 한다.
        if (drag.on || drag.pending) e.preventDefault();
      }, { passive: false, capture: true });
      // 휠로 크기 조절: 몸 위에서 올리면 커지고 내리면 작아짐 (몸 아래 가운데를 기준으로). 들고 있을 때·움직이는 중·산책·도망 중엔 무시
      //   펫 창 = 0.45배 ~ 화면에 들어가는 크기 (넘겨받을 때는 HEAD_GAIN으로 머리 크기를 창 안과 맞춤)
      //   창 안 = 자유 위치일 때만 0.42배~그 창에 들어가는 최대치. 제자리에 붙어 있으면 크기는 자동이라 휠은 대화 스크롤 그대로
      life.listen(document, "wheel", (e) => {
        if (PET && petPanelOpen && petPanel && petPanel.contains(e.target)) return;   // 패널 안에서는 휠로 크기를 건드리지 않음
        if (!PET && coarsePointer()) return;   // 모바일에서는 캐릭터 위 휠이 대화 스크롤을 막지 않게 한다
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
        const root = life.own(document.createElement("div"), (node) => node.remove());
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
      if (life.stopped) return;
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
function createTtsClient() {
/**
 * Pure playback helpers for the dsh-tts client.
 *
 * Free of DOM and Web Audio globals so node:test can exercise byte alignment
 * and scheduling with a mocked AudioContext.
 * @module dsh-tts/client/core
 */

/** Convert little-endian PCM16 samples to floats in [-1, 1). */
function pcm16ToFloat32(int16) {
  const out = new Float32Array(int16.length)
  for (let index = 0; index < int16.length; index += 1) out[index] = int16[index] / 32768
  return out
}

/**
 * Join the carried byte with the next chunk and split off whole 16-bit samples.
 * A stream may split a sample across two reads; the odd byte is returned for
 * the next call.
 * @param prev - carried byte from the previous chunk (empty on the first call).
 * @param chunk - next raw byte chunk.
 * @returns whole samples and the trailing byte to carry.
 */
function carryOddByte(prev, chunk) {
  const head = prev instanceof Uint8Array ? prev : new Uint8Array(0)
  const tail = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)
  let bytes = tail
  if (head.length > 0) {
    bytes = new Uint8Array(head.length + tail.length)
    bytes.set(head, 0)
    bytes.set(tail, head.length)
  }
  const usable = bytes.length - (bytes.length % 2)
  const aligned = new Int16Array(usable / 2)
  const view = new DataView(bytes.buffer, bytes.byteOffset, usable)
  for (let index = 0; index < aligned.length; index += 1) aligned[index] = view.getInt16(index * 2, true)
  return { aligned, rest: bytes.subarray(usable) }
}

/**
 * Queue streamed PCM chunks back-to-back on one injected AudioContext.
 *
 * Each add() schedules its buffer at max(next, currentTime + lead): chunks that
 * arrive faster than playback start immediately after the previous one, while a
 * late chunk restarts with a small lead instead of playing in the past.
 */
class ChunkScheduler {
  constructor({ audioContext, destination, lead = 0.06 } = {}) {
    this.audioContext = audioContext
    this.destination = destination
    this.lead = lead
    this.sources = new Set()
    this.nextStart = 0
    this.stopped = false
    this.ended = false
    /** Called once every scheduled buffer has played out. */
    this.onIdle = null
  }

  /** Schedule whole PCM16 samples at sampleRate; returns their start time. */
  add(int16, sampleRate) {
    if (this.stopped || int16.length === 0) return null
    const buffer = this.audioContext.createBuffer(1, int16.length, sampleRate)
    buffer.getChannelData(0).set(pcm16ToFloat32(int16))
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.destination)
    const startAt = Math.max(this.nextStart, this.audioContext.currentTime + this.lead)
    source.start(startAt)
    this.nextStart = startAt + buffer.duration
    this.sources.add(source)
    source.onended = () => {
      this.sources.delete(source)
      if (this.ended && this.sources.size === 0) this.onIdle?.()
    }
    return startAt
  }

  /** Mark the stream ended; returns the time the last queued sample ends. */
  finish() {
    this.ended = true
    if (this.sources.size === 0) this.onIdle?.()
    return this.nextStart
  }

  /** Stop and forget every queued buffer (barge-in or teardown). */
  stop() {
    this.stopped = true
    for (const source of this.sources) {
      try {
        source.stop()
      } catch {
        // Already ended.
      }
      try {
        source.disconnect()
      } catch {
        // Already detached.
      }
    }
    this.sources.clear()
    this.nextStart = 0
  }

  /** Audio-clock time at which the last scheduled sample ends. */
  get endTime() {
    return this.nextStart
  }

  /** True while at least one scheduled buffer has not played out. */
  get active() {
    return this.sources.size > 0
  }
}

/**
 * Browser half of dsh-tts: speak the character's bubble lines and
 * drive the mouth from the audio level.
 *
 * One GET decides whether to attach. Disabled, or a 404 from an older host,
 * means no listener, no speech request and no AudioContext — the bubble keeps
 * its plain setTimeout timing. Every __dsc.voice call is optional-chained, so an
 * older dsc.js still plays audio without lipsync.
 * @module dsh-tts/client
 */

/** Contract: no client service dependencies. */
const inject = []

const STATE_ROUTE = '/dsh-tts/state'
const SPEAK_ROUTE = '/dsh-tts/speak'
const SAY_EVENT = 'dsc:say'
/** Keep the mouth alive between animation frames. */
const VOICE_FLOOR_MS = 250
/** Small lead so a chunk scheduled mid-frame is not played in the past. */
const LEAD_SECONDS = 0.06
/** Give up when no audio arrives before the bubble could still show it. */
const FIRST_CHUNK_LIMIT_MS = 1500
/** Sentinel that distinguishes a deadline expiry from a stream end. */
const TIMEOUT = Symbol('dsh-tts timeout')

/** Map one dsc:say kind to its voiceLines switch. */
function kindAllowed(lines, kind) {
  if (kind === 'reaction') return lines.reactions === true
  if (kind === 'status') return lines.status === true
  if (kind === 'mutter') return lines.mutters === true
  return lines.others === true
}

/** Read the state route once; null unless the host says enabled with a rate. */
async function readState() {
  try {
    const response = await fetch(STATE_ROUTE, { cache: 'no-store' })
    if (!response.ok) return null
    const state = await response.json()
    if (state?.enabled !== true || typeof state.pcmSampleRate !== 'number') return null
    return state
  } catch {
    return null
  }
}

/**
 * Read one chunk before deadline; null on stream end, and an abort on deadline.
 * The unused race branch keeps its rejection handled.
 */
async function readChunk(reader, deadline, controller) {
  let timer = 0
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(TIMEOUT), Math.max(0, deadline - performance.now()))
  })
  const read = reader.read().catch(() => ({ done: true, value: undefined }))
  const result = await Promise.race([read, timeout])
  clearTimeout(timer)
  if (result === TIMEOUT) {
    controller.abort()
    return null
  }
  return result.done ? null : result.value
}

async function apply(ctx) {
  const state = await readState()
  if (state === null) return

  let audioContext = null
  let playback = null

  /** Forward one voice state; the hook is optional and owned by dsc.js. */
  const voice = (value) => {
    try {
      window.__dsc?.voice?.(value)
    } catch {
      // A page hook that throws must not break playback.
    }
  }

  /** Lazily create the shared AudioContext; null when the API is missing. */
  const getAudioContext = () => {
    if (audioContext !== null) return audioContext
    const Ctor = globalThis.AudioContext ?? globalThis.webkitAudioContext
    if (typeof Ctor !== 'function') return null
    try {
      audioContext = new Ctor()
    } catch {
      audioContext = null
    }
    return audioContext
  }

  /** Cancel the rAF meter. */
  function clearMeter(session) {
    if (session.frame !== 0) cancelAnimationFrame(session.frame)
    session.frame = 0
  }

  /** Stop everything a session owns and detach its audio graph. */
  function teardown(session) {
    clearMeter(session)
    if (session.watchdog !== 0) {
      clearTimeout(session.watchdog)
      session.watchdog = 0
    }
    session.scheduler?.stop()
    session.scheduler = null
    try {
      session.analyser?.disconnect()
    } catch {
      // Already detached.
    }
    session.analyser = null
  }

  /** Barge-in: cancel the fetch, silence queued audio, reset the mouth. */
  function stopPlayback() {
    const session = playback
    if (session === null) return
    playback = null
    try {
      session.controller.abort()
    } catch {
      // abort() does not throw in practice.
    }
    teardown(session)
    voice(null)
  }

  /** Publish RMS as speaking state on every animation frame. */
  function startMeter(session) {
    const analyser = session.analyser
    const samples = new Float32Array(analyser.fftSize)
    const tick = () => {
      if (playback !== session) return
      let sum = 0
      analyser.getFloatTimeDomainData(samples)
      for (let index = 0; index < samples.length; index += 1) sum += samples[index] * samples[index]
      const level = Math.min(1, Math.sqrt(sum / samples.length) * 4)
      voice({ speaking: true, level, until: performance.now() + VOICE_FLOOR_MS })
      session.frame = requestAnimationFrame(tick)
    }
    session.frame = requestAnimationFrame(tick)
  }

  /** Playback finished: release the mouth and every audio resource it held. */
  function release(session) {
    if (playback !== session) return
    playback = null
    teardown(session)
    voice(null)
  }

  /**
   * Download finished, playback may not have. The mouth and the session stay
   * alive until the last scheduled buffer has actually played: ending the meter
   * here would freeze lip-sync while audio is still audible (fast/cached
   * responses), and dropping `playback` here would let the next line overlap
   * the still-playing one.
   */
  function endStream(session) {
    if (playback !== session) return
    const scheduler = session.scheduler
    scheduler.onIdle = () => release(session)
    if (!scheduler.active) {
      release(session)
      return
    }
    // Fallback for a blocked/suspended AudioContext, where no source ever ends.
    const remaining = Math.max(0, scheduler.endTime - session.audio.currentTime)
    session.watchdog = setTimeout(() => release(session), remaining * 1000 + 1000)
  }

  /** Fetch, align and schedule one utterance. Never retries. */
  async function speak(detail) {
    stopPlayback()
    const text = typeof detail.text === 'string' ? detail.text.trim() : ''
    if (text.length === 0) return
    const ms = Number(detail.ms) > 0 ? Number(detail.ms) : 0
    const startedAt = performance.now()
    const controller = new AbortController()
    const session = {
      controller,
      analyser: null,
      scheduler: null,
      audio: null,
      frame: 0,
      watchdog: 0,
      ms,
    }
    playback = session
    const deadline = startedAt + (ms > 0 ? Math.min(ms, FIRST_CHUNK_LIMIT_MS) : FIRST_CHUNK_LIMIT_MS)

    try {
      const response = await fetch(SPEAK_ROUTE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      })
      if (!response.ok || response.body === null) throw new Error('dsh-tts: speak failed with ' + response.status)
      const audio = getAudioContext()
      if (audio === null) throw new Error('dsh-tts: no AudioContext')
      session.audio = audio
      if (playback !== session) return
      try {
        await audio.resume()
      } catch {
        // Autoplay refusal is silent; scheduling still works once resumed.
      }
      // A newer line may have superseded this one while resume() was pending.
      if (playback !== session) return
      const analyser = audio.createAnalyser()
      analyser.fftSize = 512
      analyser.connect(audio.destination)
      const scheduler = new ChunkScheduler({ audioContext: audio, destination: analyser, lead: LEAD_SECONDS })
      session.analyser = analyser
      session.scheduler = scheduler

      const reader = response.body.getReader()
      let chunk = await readChunk(reader, deadline, controller)
      if (chunk === null) throw new Error('dsh-tts: no audio before the bubble deadline')
      let rest = new Uint8Array(0)
      let metered = false
      while (chunk !== null) {
        const split = carryOddByte(rest, chunk)
        rest = split.rest
        if (split.aligned.length > 0) {
          scheduler.add(split.aligned, state.pcmSampleRate)
          if (!metered) {
            metered = true
            startMeter(session)
          }
        }
        const next = await reader.read()
        chunk = next.done ? null : next.value
      }
      scheduler.finish()
      endStream(session)
    } catch {
      // Always release this session's own graph, even if a newer line replaced it.
      teardown(session)
      if (playback === session) {
        playback = null
        voice(null)
      }
    }
  }

  function onSay(event) {
    const detail = event?.detail
    if (!detail || typeof detail.text !== 'string') return
    if (!kindAllowed(state.voiceLines ?? {}, detail.kind)) return
    void speak(detail)
  }

  ctx.effect(() => {
    window.addEventListener(SAY_EVENT, onSay)
    return () => {
      window.removeEventListener(SAY_EVENT, onSay)
      stopPlayback()
      try {
        audioContext?.close()
      } catch {
        // A context already closed is fine.
      }
      audioContext = null
    }
  }, 'dsh-tts: speech playback')
}

return { apply }
}

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

function settingsPage(ctx, form, updater, keys) {
  return function FeatureSettings({ view }) {
    const state = React.useSyncExternalStore((fn) => form.subscribe(fn), () => form.getSnapshot(), () => form.getSnapshot())
    const locale = React.useSyncExternalStore((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getLocale(), () => ctx.locale.getLocale())
    React.useSyncExternalStore((fn) => updater.subscribe(fn), () => updater.getSnapshot(), () => updater.getSnapshot())
    const [error, setError] = React.useState('')
    const [pending, setPending] = React.useState(false)
    const [recordingShortcut, setRecordingShortcut] = React.useState(false)
    const [heldShortcut, setHeldShortcut] = React.useState('')
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
    // 칸을 눌러 켜 두면, 누른 키를 그대로 단축키로 저장한다. Esc 취소 · Backspace/Delete 지우기.
    const captureShortcut = (event) => {
      const action = shortcutKeyDown(event)
      const stopRecording = () => { setRecordingShortcut(false); setHeldShortcut('') }
      if (action.action === 'leave') { stopRecording(); return }
      event.preventDefault()
      event.stopPropagation()
      const target = event.currentTarget
      if (action.action === 'cancel') { stopRecording(); target.blur(); return }
      if (action.action === 'clear') { stopRecording(); void change('characterToggleKey', ''); target.blur(); return }
      if (action.action === 'wait') { setHeldShortcut(action.held); return }
      stopRecording(); void change('characterToggleKey', action.combo); target.blur()
    }
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
      React.createElement('section', { 'aria-label': ko ? '단축키' : 'Shortcut', style: { display: 'grid', gap: 10, borderTop: '1px solid rgba(127,127,127,.25)', paddingTop: 14 } },
        React.createElement('strong', null, ko ? '단축키' : 'Shortcut'),
        React.createElement('label', { style: row },
          React.createElement('span', null, ko ? '캐릭터 토글 단축키 (비우면 사용 안 함)' : 'Toggle character shortcut (empty to disable)'),
          React.createElement('input', {
            type: 'text',
            readOnly: true,
            'aria-label': ko ? '캐릭터 토글 단축키 입력' : 'Record toggle character shortcut',
            'aria-describedby': SHORTCUT_HINT_ID,
            placeholder: recordingShortcut ? (ko ? '키를 누르세요…' : 'Press keys…') : 'Ctrl+Shift+D',
            style: { width: 150, cursor: 'pointer', textAlign: 'center', borderColor: recordingShortcut ? '#7aa7ff' : undefined },
            value: recordingShortcut ? heldShortcut : shortcutValue,
            disabled: off,
            onFocus: () => { if (off) return; setRecordingShortcut(true); setHeldShortcut('') },
            onBlur: () => { setRecordingShortcut(false); setHeldShortcut('') },
            onKeyDown: captureShortcut,
          })),
        React.createElement('p', { id: SHORTCUT_HINT_ID, style: { margin: 0, opacity: 0.7 } },
          ko ? '칸을 누른 뒤 원하는 키 조합을 그대로 누르면 등록됩니다. Esc 취소, Backspace로 지우기'
            : 'Click the field, then press the keys you want. Esc cancels, Backspace clears.')),
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
    }
    life.add(() => { delete window.__dscOutfit; delete window.__dscSleep; delete window.__dscIntro; delete window.__dscMobile })
    life.add(form.subscribe(sync))
    // 단축키로 캐릭터 토글: 설정의 character 스위치를 뒤집는다 (설정 화면과 같은 저장소·같은 마운트/정리 경로)
    let heldToggleKey = '', togglePending = false
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
      if (heldToggleKey || togglePending || snapshot.status !== 'ready' || !snapshot.writable) return
      heldToggleKey = event.code || event.key.toLowerCase()
      togglePending = true
      try {
        if (!await form.set('character', snapshot.value?.character === false)) console.warn('캐릭터 설정 저장 실패')
      } catch { console.warn('캐릭터 설정 저장 실패') }
      finally { togglePending = false }
    }
    life.listen(window, 'keydown', toggleListener)
    life.listen(window, 'keyup', (event) => {
      if ((event.code || event.key.toLowerCase()) === heldToggleKey) heldToggleKey = ''
    })
    life.listen(window, 'blur', () => { heldToggleKey = '' })
    life.add(ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
      name: 'plugins.row.config', key: PLUGIN_ID + '#' + ENTRY_ID,
    }, settingsPage(ctx, form, updater, keys))))
    sync()
  } catch (error) { dispose(); throw error }
}

exports.inject = ['locale', 'theme', 'configForms', 'slots']
exports.apply = apply
// 테스트용
exports.internals = { githubSource, compareVersions, createUpdater, createKeyStore, ttsSignature, parseJsonObject, parseShortcut, shortcutFromEvent, shortcutKeyDown, matchesShortcut }

return module.exports;
} });
