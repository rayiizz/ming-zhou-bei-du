import type { EventId, StoryEvent } from "./types";

export const playableEventId: EventId = "yongle-shipwreck";

export const eventCatalog: StoryEvent[] = [
  {
    id: "yongle-shipwreck",
    title: "永乐号沉船案",
    subtitle: "漕粮北运中的徐州险段疑案",
    status: "playable",
    archiveOnly: false,
    typeLabel: "案件调查 / 漕粮北运",
    summary:
      "永乐十九年，承载皇粮北上的首船在徐州段沉没。玩家将问询多名 NPC，归档线索，判断沉船背后的多重原因。",
    knowledgeTags: ["明代漕运", "迁都北京", "徐州险段", "漕粮制度"],
    generatedFeatures: ["NPC 对话", "建议选项", "知识卡", "旅程总结"]
  },
  {
    id: "nanwang-water-divide",
    title: "南旺分水枢纽",
    subtitle: "一场关于水脉、闸坝与运河工程的推演",
    status: "expansion",
    archiveOnly: true,
    typeLabel: "工程治理 / 水利调度",
    summary: "以南旺分水为核心，展示大运河如何通过工程体系维持南北通航。",
    knowledgeTags: ["南旺分水", "会通河", "水利工程"],
    generatedFeatures: ["工程问答", "水势推演", "知识图鉴"]
  },
  {
    id: "linqing-customs",
    title: "临清钞关与运河商贸",
    subtitle: "码头、税关与南北物资流动",
    status: "playable",
    archiveOnly: false,
    typeLabel: "商贸流通 / 城市经济",
    summary: "沈砚在临清钞关整理一批异常税票，追查船单、私货与商号暗账背后的运河利益流动。",
    knowledgeTags: ["临清钞关", "码头经济", "南北贸易"],
    generatedFeatures: ["商贸谈判", "人物访谈", "疑账卷宗", "图鉴总结"]
  }
];
