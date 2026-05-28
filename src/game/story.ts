import { resolveEnding } from "./ending";
import type { GameState, StoryNode } from "./types";

export const firstNodeId = "hangzhou-start";

export const storyNodes: Record<string, StoryNode> = {
  "hangzhou-start": {
    id: "hangzhou-start",
    actTitle: "第一幕：杭州粮仓｜江南起运",
    routeLabel: "杭州粮仓 → 苏州水驿",
    location: "杭州粮仓",
    background: "granary",
    leftCharacter: "沈砚",
    rightCharacter: "老仓吏周伯",
    activeSpeaker: "老仓吏周伯",
    dialogue: "沈小官人，账册是清白的。可漕船走水，走的从来不只是粮。",
    choices: [
      { id: "check-ledger", label: "仔细核对账册", nextNodeId: "hangzhou-ledger-found", evidenceAward: "hangzhou-ledger" },
      { id: "ask-zhou", label: "私下追问周伯", nextNodeId: "hangzhou-rumor-found", evidenceAward: "zhou-rumor" },
      { id: "depart", label: "按期起运，先不深究", nextNodeId: "suzhou-start" }
    ]
  },
  "hangzhou-ledger-found": {
    id: "hangzhou-ledger-found",
    actTitle: "第一幕：杭州粮仓｜江南起运",
    routeLabel: "杭州粮仓 → 苏州水驿",
    location: "杭州粮仓",
    background: "granary",
    leftCharacter: "沈砚",
    rightCharacter: "老仓吏周伯",
    activeSpeaker: "沈砚",
    dialogue: "账册末页有三处补笔，字迹压得很轻。若不是急着改，便是怕人看出改过。",
    choices: [{ id: "go-suzhou-ledger", label: "收好账册，起运北上", nextNodeId: "suzhou-start" }]
  },
  "hangzhou-rumor-found": {
    id: "hangzhou-rumor-found",
    actTitle: "第一幕：杭州粮仓｜江南起运",
    routeLabel: "杭州粮仓 → 苏州水驿",
    location: "杭州粮仓",
    background: "granary",
    leftCharacter: "沈砚",
    rightCharacter: "老仓吏周伯",
    activeSpeaker: "老仓吏周伯",
    dialogue: "你若真想问，就去苏州水驿看封绳。绳子不会说谎，人会。",
    choices: [{ id: "go-suzhou-rumor", label: "记下周伯的话，起运北上", nextNodeId: "suzhou-start" }]
  },
  "suzhou-start": {
    id: "suzhou-start",
    actTitle: "第二幕：苏州水驿｜江南段",
    routeLabel: "苏州水驿 → 扬州码头",
    location: "苏州水驿",
    background: "water-station",
    leftCharacter: "沈砚",
    rightCharacter: "船工阿七",
    activeSpeaker: "船工阿七",
    dialogue: "小官人，坏了。袋数是一袋没少，可这几袋米轻得不对劲，封绳也不像杭州来的。",
    choices: [
      { id: "inspect-rope", label: "检查封绳", nextNodeId: "suzhou-rope-found", evidenceAward: "suzhou-seal-rope" },
      { id: "question-aqi", label: "询问阿七夜里见过什么", nextNodeId: "suzhou-aqi-found", evidenceAward: "aqi-testimony" },
      { id: "go-yangzhou", label: "先压下此事，继续北上", nextNodeId: "yangzhou-start" }
    ]
  },
  "suzhou-rope-found": {
    id: "suzhou-rope-found",
    actTitle: "第二幕：苏州水驿｜江南段",
    routeLabel: "苏州水驿 → 扬州码头",
    location: "苏州水驿",
    background: "water-station",
    leftCharacter: "沈砚",
    rightCharacter: "船工阿七",
    activeSpeaker: "沈砚",
    dialogue: "这些绳结不是仓里惯用的打法。有人在粮船离开杭州后重新封过袋。",
    choices: [{ id: "go-yangzhou-rope", label: "带着封绳证据前往扬州", nextNodeId: "yangzhou-start" }]
  },
  "suzhou-aqi-found": {
    id: "suzhou-aqi-found",
    actTitle: "第二幕：苏州水驿｜江南段",
    routeLabel: "苏州水驿 → 扬州码头",
    location: "苏州水驿",
    background: "water-station",
    leftCharacter: "沈砚",
    rightCharacter: "船工阿七",
    activeSpeaker: "船工阿七",
    dialogue: "我只瞧见夜里有小船贴过来，来人穿官靴，却不许点灯。",
    choices: [{ id: "go-yangzhou-aqi", label: "记下证言，前往扬州", nextNodeId: "yangzhou-start" }]
  },
  "yangzhou-start": {
    id: "yangzhou-start",
    actTitle: "第三幕：扬州码头｜盐船与漕船交汇处",
    routeLabel: "扬州码头 → 淮安漕署",
    location: "扬州码头",
    background: "wharf",
    leftCharacter: "沈砚",
    rightCharacter: "盐商陆惟安",
    activeSpeaker: "陆惟安",
    dialogue: "沈大人一路辛苦。若只是几袋亏空，扬州有人能替你补得天衣无缝。",
    choices: [
      { id: "banquet-slip", label: "赴宴套话", nextNodeId: "yangzhou-seal-found", evidenceAward: "yangzhou-private-seal" },
      { id: "check-cargo", label: "拒宴查码头货单", nextNodeId: "yangzhou-cargo-found", evidenceAward: "yangzhou-cargo-note" },
      { id: "accept-replacement", label: "接受补粮，先保住差事", nextNodeId: "huaian-start", setFlag: { acceptedReplacementGrain: true } }
    ]
  },
  "yangzhou-seal-found": {
    id: "yangzhou-seal-found",
    actTitle: "第三幕：扬州码头｜盐船与漕船交汇处",
    routeLabel: "扬州码头 → 淮安漕署",
    location: "扬州码头",
    background: "wharf",
    leftCharacter: "沈砚",
    rightCharacter: "盐商陆惟安",
    activeSpeaker: "沈砚",
    dialogue: "陆惟安席间失言，提到一艘不该出现在漕运账里的私印粮船。",
    choices: [{ id: "go-huaian-seal", label: "带着私印线索前往淮安", nextNodeId: "huaian-start" }]
  },
  "yangzhou-cargo-found": {
    id: "yangzhou-cargo-found",
    actTitle: "第三幕：扬州码头｜盐船与漕船交汇处",
    routeLabel: "扬州码头 → 淮安漕署",
    location: "扬州码头",
    background: "wharf",
    leftCharacter: "沈砚",
    rightCharacter: "码头牙人",
    activeSpeaker: "码头牙人",
    dialogue: "这批米不入官仓，可船号却跟漕船靠得太近。小官人，你别问是我说的。",
    choices: [{ id: "go-huaian-cargo", label: "收起货单前往淮安", nextNodeId: "huaian-start" }]
  },
  "huaian-start": {
    id: "huaian-start",
    actTitle: "第四幕：淮安漕署｜漕运枢纽",
    routeLabel: "淮安漕署 → 临清闸口",
    location: "淮安漕署",
    background: "office",
    leftCharacter: "沈砚",
    rightCharacter: "漕署经历赵衡",
    activeSpeaker: "赵衡",
    dialogue: "北边催得紧。几袋潮损不值得误期，你只管把船押到通州。",
    choices: [
      { id: "inspect-side-ledger", label: "查漕署副账", nextNodeId: "huaian-ledger-found", evidenceAward: "huaian-side-ledger" },
      { id: "question-crew", label: "审问船工", nextNodeId: "huaian-crew-misled" },
      { id: "obey-zhao", label: "服从催期，继续北上", nextNodeId: "linqing-start" }
    ]
  },
  "huaian-ledger-found": {
    id: "huaian-ledger-found",
    actTitle: "第四幕：淮安漕署｜漕运枢纽",
    routeLabel: "淮安漕署 → 临清闸口",
    location: "淮安漕署",
    background: "office",
    leftCharacter: "沈砚",
    rightCharacter: "赵衡",
    activeSpeaker: "沈砚",
    dialogue: "副账里有夜间过船记录，船号与扬州私印能对上。",
    choices: [{ id: "go-linqing-ledger", label: "抄下副账，赶往临清", nextNodeId: "linqing-start" }]
  },
  "huaian-crew-misled": {
    id: "huaian-crew-misled",
    actTitle: "第四幕：淮安漕署｜漕运枢纽",
    routeLabel: "淮安漕署 → 临清闸口",
    location: "淮安漕署",
    background: "office",
    leftCharacter: "沈砚",
    rightCharacter: "赵衡",
    activeSpeaker: "赵衡",
    dialogue: "赵衡将话头引向船工偷米。这个说法省事，却解释不了扬州私印。",
    choices: [{ id: "go-linqing-misled", label: "带着疑心继续北上", nextNodeId: "linqing-start" }]
  },
  "linqing-start": {
    id: "linqing-start",
    actTitle: "第五幕：临清闸口｜北上咽喉",
    routeLabel: "临清闸口 → 通州审粮",
    location: "临清闸口",
    background: "lock",
    leftCharacter: "沈砚",
    rightCharacter: "民夫林三娘",
    activeSpeaker: "林三娘",
    dialogue: "我弟弟被人拉去搬粮，一夜没回。那船不是官船，却走的是官闸。",
    choices: [
      { id: "help-sanniang", label: "帮林三娘找人", nextNodeId: "linqing-witness-found", evidenceAward: "linqing-witness" },
      { id: "pay-passage", label: "付钱过闸，先到通州", nextNodeId: "tongzhou-review" },
      { id: "threaten-gang", label: "威胁船帮交代", nextNodeId: "tongzhou-review", evidenceAward: "false-boat-gang-lead", setFlag: { trustedFalseLead: true } }
    ]
  },
  "linqing-witness-found": {
    id: "linqing-witness-found",
    actTitle: "第五幕：临清闸口｜北上咽喉",
    routeLabel: "临清闸口 → 通州审粮",
    location: "临清闸口",
    background: "lock",
    leftCharacter: "沈砚",
    rightCharacter: "民夫林三娘",
    activeSpeaker: "林三娘",
    dialogue: "林三娘认出了船号。那艘私船在扬州装粮，在淮安过账，又在临清夜开官闸。",
    choices: [{ id: "go-tongzhou-witness", label: "带证人前往通州", nextNodeId: "tongzhou-review" }]
  },
  "tongzhou-review": {
    id: "tongzhou-review",
    actTitle: "第六幕：通州审粮｜北运终点",
    routeLabel: "通州审粮",
    location: "通州",
    background: "review",
    leftCharacter: "沈砚",
    rightCharacter: "审粮官顾承",
    activeSpeaker: "顾承",
    dialogue: "粮数亏空已成事实。沈砚，你手里若有证据，现在便该呈上。",
    choices: [{ id: "submit-evidence", label: "呈上证据，接受审查", nextNodeId: "ending-auto" }]
  },
  "ending-auto": {
    id: "ending-auto",
    actTitle: "终局：案卷落印",
    routeLabel: "通州审粮",
    location: "通州",
    background: "review",
    leftCharacter: "沈砚",
    rightCharacter: "审粮官顾承",
    activeSpeaker: "顾承",
    dialogue: "案卷合上，河声仍在。你的选择，将决定这趟北渡留下什么名声。",
    choices: []
  }
};

export function nodeForEnding(state: GameState): StoryNode {
  const endingId = resolveEnding(state.collectedEvidence, state.flags);
  return { ...storyNodes["ending-auto"], endingId };
}
