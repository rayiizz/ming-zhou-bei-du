import type { Evidence, EvidenceId } from "./types";

export const evidenceCatalog: Record<EvidenceId, Evidence> = {
  "hangzhou-ledger": {
    id: "hangzhou-ledger",
    title: "杭州粮仓账册疑点",
    type: "account",
    source: "杭州粮仓｜江南起运",
    reliability: "可信",
    description: "末页三处补笔墨色较新，袋数无误但记录像是起运前匆忙改过。"
  },
  "zhou-rumor": {
    id: "zhou-rumor",
    title: "周伯含糊证言",
    type: "witness",
    source: "杭州粮仓｜江南起运",
    reliability: "含糊",
    description: "周伯称“有些粮到不了通州，却也不会沉在河底”。"
  },
  "suzhou-seal-rope": {
    id: "suzhou-seal-rope",
    title: "异色封绳",
    type: "physical",
    source: "苏州水驿｜江南段",
    reliability: "可信",
    description: "几袋漕粮的封绳颜色偏新，绳结手法也不同于杭州粮仓。"
  },
  "aqi-testimony": {
    id: "aqi-testimony",
    title: "阿七夜船证言",
    type: "witness",
    source: "苏州水驿｜江南段",
    reliability: "可信",
    description: "阿七说夜里有小船贴近粮船，来人穿着官靴却不点灯。"
  },
  "yangzhou-cargo-note": {
    id: "yangzhou-cargo-note",
    title: "扬州码头货单",
    type: "account",
    source: "扬州码头｜盐船与漕船交汇处",
    reliability: "可信",
    description: "货单上有一批米粮没有官仓编号，却与漕船袋数相近。"
  },
  "yangzhou-private-seal": {
    id: "yangzhou-private-seal",
    title: "陆氏私印船号",
    type: "key",
    source: "扬州码头｜盐船与漕船交汇处",
    reliability: "关键",
    description: "私印船号同时出现在盐商货单和淮安副账上。"
  },
  "huaian-side-ledger": {
    id: "huaian-side-ledger",
    title: "淮安漕署副账",
    type: "account",
    source: "淮安漕署｜漕运枢纽",
    reliability: "关键",
    description: "副账记录了几次不入正册的夜间过船。"
  },
  "linqing-witness": {
    id: "linqing-witness",
    title: "林三娘证言",
    type: "witness",
    source: "临清闸口｜北上咽喉",
    reliability: "关键",
    description: "林三娘的弟弟被拉去搬运私粮，地点与私印船号能对上。"
  },
  "false-boat-gang-lead": {
    id: "false-boat-gang-lead",
    title: "船帮假线索",
    type: "witness",
    source: "临清闸口｜北上咽喉",
    reliability: "可疑",
    description: "船帮把亏粮责任推给无名水匪，但细节无法与账册对上。"
  }
};
