import type { ArchiveCard, ClueCardId, KnowledgeCardId } from "./types";

export const knowledgeCards: ArchiveCard<KnowledgeCardId>[] = [
  {
    id: "ming-grain-transport",
    category: "knowledge",
    title: "明代漕运",
    tag: "制度",
    summary: "明代通过漕运将江南粮食输往北方，维系京师和军政供给。迁都北京后，漕运的重要性进一步上升。",
    source: "大运河知识库"
  },
  {
    id: "capital-move-beijing",
    category: "knowledge",
    title: "迁都北京与漕粮北运",
    tag: "政治",
    summary: "永乐时期迁都北京，使南粮北运成为稳定北方军政体系的重要基础，大运河由此成为朝廷命脉。",
    source: "大运河知识库"
  },
  {
    id: "xuzhou-danger-section",
    category: "knowledge",
    title: "徐州险段",
    tag: "地理",
    summary: "徐州一带水势复杂，自古为交通要道，也常因河道、暗礁和水患成为航运风险集中之处。",
    source: "大运河知识库"
  },
  {
    id: "huitong-river",
    category: "knowledge",
    title: "会通河",
    tag: "河道",
    summary: "会通河是元明运河体系的重要段落，明前期的重开和整修使南北漕运重新通畅。",
    source: "大运河知识库"
  },
  {
    id: "nanwang-water-divide",
    category: "knowledge",
    title: "南旺分水",
    tag: "工程",
    summary: "南旺分水枢纽通过调配水源维系会通河通航，是大运河工程智慧的重要代表。",
    source: "大运河知识库"
  },
  {
    id: "yangzhou-wharf",
    category: "knowledge",
    title: "扬州码头",
    tag: "城市",
    summary: "扬州因运河而成为重要商贸与转运节点，粮食、药材、戏班和各色人物都在码头交汇。",
    source: "大运河知识库"
  }
];

export const clueCards: ArchiveCard<ClueCardId>[] = [
  {
    id: "broken-hull-plank",
    category: "clue",
    title: "船板异常",
    tag: "物证",
    summary: "打捞残片显示船板新旧不一，部分材料质量可疑，说明沉船可能不只因水势。",
    source: "徐州府打捞记录"
  },
  {
    id: "drug-residue",
    category: "clue",
    title: "迷药残渣",
    tag: "物证",
    summary: "船员昏迷症状与药渣线索相互印证，提示船上饮食可能被人动过手脚。",
    source: "医士验看记录"
  },
  {
    id: "grain-transport-order",
    category: "clue",
    title: "运粮文书",
    tag: "文书",
    summary: "急令要求入冬前补运皇粮，时间压力使征粮、调船和护运都处在紧绷状态。",
    source: "漕运衙门文书"
  },
  {
    id: "soldier-testimony",
    category: "clue",
    title: "漕兵证词",
    tag: "人证",
    summary: "漕兵提到船上夜间动静和士卒怨言，显示底层人员对漕运秩序并非全然信服。",
    source: "问询札记"
  },
  {
    id: "canal-route-fragment",
    category: "clue",
    title: "运河路线图残片",
    tag: "关键",
    summary: "残片疑似与运河路线和隐秘传递有关，牵出迁都、锦衣卫和漕运政治风险。",
    source: "林文绮案卷"
  }
];
