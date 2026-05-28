import { knowledgeCards } from "./knowledge";
import { npcProfiles } from "./npcs";
import type { ClueCardId, InvestigationState, NpcId, SuggestedChoice } from "./types";

export interface AiReply {
  mode: "online" | "offline";
  npcReply: string;
  suggestions: SuggestedChoice[];
  triggeredKnowledge: string[];
  triggeredClues: string[];
}

type FetchLike = typeof fetch;
type PseudoTopic = "hull" | "drug" | "transport" | "route" | "rumor" | "general";

interface TopicResponse {
  clue?: ClueCardId;
  textByNpc: Partial<Record<NpcId, string>>;
  shallow: string;
  deep: string;
  suggestions: SuggestedChoice[];
}

function activeNpc(state: InvestigationState) {
  const npc = npcProfiles.find((item) => item.id === state.activeNpcId);
  if (!npc) {
    throw new Error(`NPC ${state.activeNpcId} not found`);
  }
  return npc;
}

export function buildAiPayload(state: InvestigationState, playerText: string) {
  const npc = activeNpc(state);
  return {
    event: "永乐号沉船案",
    phase: state.phase,
    npc,
    playerText,
    unlockedKnowledge: state.unlockedKnowledge,
    unlockedClues: state.unlockedClues,
    knowledgeContext: knowledgeCards
      .filter((card) => state.unlockedKnowledge.includes(card.id))
      .map((card) => `${card.title}: ${card.summary}`),
    rules: [
      "回答必须保持历史情境和角色口吻",
      "不得提前泄露完整沉船原因",
      "涉及史实优先依据知识卡",
      "知识库没有明确内容时说明案卷未明言"
    ]
  };
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyPseudoTopic(playerText: string): PseudoTopic {
  if (includesAny(playerText, ["船板", "木料", "修船", "漏水", "暗礁", "船底", "坏"])) {
    return "hull";
  }
  if (includesAny(playerText, ["药", "饭", "昏迷", "困", "吃", "药渣"])) {
    return "drug";
  }
  if (includesAny(playerText, ["漕粮", "急令", "误期", "北上", "期限", "运粮"])) {
    return "transport";
  }
  if (includesAny(playerText, ["路线", "残图", "换船", "水口", "暗线", "河段"])) {
    return "route";
  }
  if (includesAny(playerText, ["戏园", "码头", "传闻", "后门", "商号", "流言"])) {
    return "rumor";
  }
  return "general";
}

const topicResponses: Record<PseudoTopic, TopicResponse> = {
  hull: {
    clue: "broken-hull-plank",
    shallow: "案卷尚未把船板问题钉死，但这条线值得追。",
    deep: "案卷里已有船板异常的线索，这时再问船体，证人的话会比先前松一些。",
    textByNpc: {
      "wang-huaiyuan": "王淮远压低声音：“船板若早有旧伤，急令便不只是催船，也是把病船推进险水。”",
      "zheng-chaosheng": "郑潮生望向舱底：“船尾那声响不像撞石，倒像旧板被水顶开。老船户听得出那种闷裂声。”",
      "lin-wenqi": "林文绮指向残图边角：“若船体本就撑不住，偏又选急水河段，路线与船况便不能分开看。”",
      "su-xiuyun": "苏岫云轻合折扇：“码头人说那船沉得巧，可巧事多半藏着先前没人肯说的旧伤。”",
      "zhao-bingfeng": "赵秉丰拨了下算盘：“好木料不会凭空变薄。若船板有问题，账上一定有人把旧板写成新料。”"
    },
    suggestions: [
      {
        id: "pseudo-hull-ledger",
        label: "追问船板旧伤从何而来",
        reply: "若要查旧伤，便要把修船账、验船人和催运文书放在一处看。",
        unlockClues: ["broken-hull-plank"]
      },
      {
        id: "pseudo-hull-xuzhou",
        label: "追问为何仍入徐州险段",
        reply: "徐州段水势急，病船不该夜入。若仍被催行，压力就不只在船上。",
        unlockKnowledge: ["xuzhou-danger-section"]
      },
      {
        id: "pseudo-hull-account",
        label: "查看修船账目是否体面",
        reply: "账面越体面，越要看木料、验收和实际船况能否对上。",
        unlockClues: ["broken-hull-plank"]
      }
    ]
  },
  drug: {
    clue: "drug-residue",
    shallow: "饭食与药味还只是传闻，不能先把罪名写死。",
    deep: "案卷里已有药渣线索，船员失力就不再只是风浪中的偶然。",
    textByNpc: {
      "wang-huaiyuan": "王淮远皱眉：“若真有人在饭食里动手，便是借急运遮住船上的乱。”",
      "zheng-chaosheng": "郑潮生咬着字：“那晚有人饭后眼皮沉得不对，撑篙的人手一软，船就不听人了。”",
      "lin-wenqi": "林文绮轻声说：“药不是答案本身，却能解释为什么船在最要命的时候没人稳住。”",
      "su-xiuyun": "苏岫云避开窗外：“那股药味我在后门闻过，不像戏班常备的东西。”",
      "zhao-bingfeng": "赵秉丰淡淡道：“药从哪来，要看谁有银子买，也要看谁需要船上少几个清醒人。”"
    },
    suggestions: [
      {
        id: "pseudo-drug-food",
        label: "追问船员饭食来源",
        reply: "饭食若由外人经手，药味便可能从码头带上船。",
        unlockClues: ["drug-residue"]
      },
      {
        id: "pseudo-drug-witness",
        label: "核对漕兵证词",
        reply: "漕兵口供能补上饭后昏沉、船尾响动与失控时辰。",
        unlockClues: ["soldier-testimony"]
      },
      {
        id: "pseudo-drug-wharf",
        label: "追查码头药贩",
        reply: "药贩天未亮便北走，像是早知道不能久留。",
        unlockKnowledge: ["yangzhou-wharf"]
      }
    ]
  },
  transport: {
    clue: "grain-transport-order",
    shallow: "急运压力已经露头，但还要找谁把期限压过验船。",
    deep: "案卷里已有运粮文书，急令与船况之间的关系可以继续压问。",
    textByNpc: {
      "wang-huaiyuan": "王淮远把文书按住：“误期不是小过。上头催得越急，下面越容易把验船、候潮、换班都省掉。”",
      "zheng-chaosheng": "郑潮生冷笑：“皇粮要紧这句话，我们一路听到耳朵生茧。可船上人的命，从没人催着查。”",
      "lin-wenqi": "林文绮说：“迁都以后，北上的不只是粮，还有文书、贡品和许多不能慢的消息。”",
      "su-xiuyun": "苏岫云低声道：“码头最怕一个急字。急起来，坏船能装好船，传闻也能先替真相开路。”",
      "zhao-bingfeng": "赵秉丰微笑：“急令一下，官船不够便调商船。谁先知道急，谁就先能在账上动手。”"
    },
    suggestions: [
      {
        id: "pseudo-transport-order",
        label: "追问急令是谁压下来的",
        reply: "急令从官署来，但真正执行时会层层变形。",
        unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
        unlockClues: ["grain-transport-order"]
      },
      {
        id: "pseudo-transport-check",
        label: "核对验船为何被压后",
        reply: "验船若被急令挤掉，沉船便不是单纯水急。",
        unlockClues: ["broken-hull-plank"]
      },
      {
        id: "pseudo-transport-profit",
        label: "追问谁从急运中获利",
        reply: "急运让调船、修船和补价都有了可操作的缝隙。"
      }
    ]
  },
  route: {
    clue: "canal-route-fragment",
    shallow: "路线残缺还不能单独定案，但它说明永乐号可能走过不该走的水路。",
    deep: "案卷里已有残缺路线图，可以把沉船与暗线调度放在一起追。",
    textByNpc: {
      "wang-huaiyuan": "王淮远迟疑道：“若船队改过线，官文上未必写全。水路上的便宜，常藏在空白处。”",
      "zheng-chaosheng": "郑潮生说：“老船户认水口。那夜若有人换过路线，船上的人未必都知道。”",
      "lin-wenqi": "林文绮把残图推近：“这不是普通行船图，被略去的河段才是它最想说的地方。”",
      "su-xiuyun": "苏岫云轻声说：“码头后巷传得最快的，从来不是戏词，是哪条船今晚不走常路。”",
      "zhao-bingfeng": "赵秉丰说：“路线一变，账也会变。换船、水口、停泊，处处都有能藏银子的地方。”"
    },
    suggestions: [
      {
        id: "pseudo-route-fragment",
        label: "追问残图缺失河段",
        reply: "残图缺失处贴近换船水口，像是有人刻意避开查验。",
        unlockClues: ["canal-route-fragment"],
        unlockKnowledge: ["huitong-river"]
      },
      {
        id: "pseudo-route-switch",
        label: "追问是否有人换船",
        reply: "换船若发生在夜里，最容易让货、人和文书分开。",
        unlockKnowledge: ["huitong-river"]
      },
      {
        id: "pseudo-route-pressure",
        label: "联系急运与暗线",
        reply: "越急的行程，越容易让暗线披上公事的外衣。"
      }
    ]
  },
  rumor: {
    clue: "soldier-testimony",
    shallow: "码头传闻不能直接当证据，但能告诉你谁提前准备了说法。",
    deep: "案卷里已有漕兵证词，传闻和口供可以互相校验。",
    textByNpc: {
      "wang-huaiyuan": "王淮远摇头：“传闻上不了公文，却常比公文早一步到码头。”",
      "zheng-chaosheng": "郑潮生说：“船沉前后，岸上的话比水声还乱。乱得太快，反倒像有人先排过。”",
      "lin-wenqi": "林文绮低声道：“流言若只为遮羞，会散；若为定罪，便会朝同一个方向走。”",
      "su-xiuyun": "苏岫云抬眼：“戏园后门听来的话未必干净，可谁夜里来过，谁天亮前走了，总有人记得。”",
      "zhao-bingfeng": "赵秉丰笑道：“传闻也有价。谁能让码头先信一个说法，谁就能让账本晚一点被翻开。”"
    },
    suggestions: [
      {
        id: "pseudo-rumor-backdoor",
        label: "追问戏园后门来客",
        reply: "后门来客身份混杂，鞋底、袖口和传话对象比姓名更可靠。",
        unlockKnowledge: ["yangzhou-wharf"],
        unlockClues: ["soldier-testimony"]
      },
      {
        id: "pseudo-rumor-script",
        label: "辨认流言是否被安排",
        reply: "若同一种说法从不同人嘴里同时出现，它更像提前备好的词。",
        unlockClues: ["soldier-testimony"]
      },
      {
        id: "pseudo-rumor-merchant",
        label: "追问商号传信人",
        reply: "商号传信人不听戏，只借后门避人，说明他等的是消息不是锣鼓。"
      }
    ]
  },
  general: {
    shallow: "这个问题案卷未明言，只能先从已知人物、证据和水路背景里找近处的线。",
    deep: "案卷里已有几条线索，但这句话还需要落到船板、药渣、急令、残图或码头传闻之一。",
    textByNpc: {
      "wang-huaiyuan": "王淮远沉吟片刻：“案卷不能凭一句话定局。你若要问，先把它落到文书、船况或押运时辰上。”",
      "zheng-chaosheng": "郑潮生说：“我只说船上亲眼见过的。问得太远，我怕又成了别人写好的口供。”",
      "lin-wenqi": "林文绮说：“这话可以问，但最好先找一件能压住它的证据。”",
      "su-xiuyun": "苏岫云说：“码头话多，真话少。你把问题问窄些，我才知道该回哪一段。”",
      "zhao-bingfeng": "赵秉丰笑了笑：“宽泛的问题最容易被人拿来做账。你若指一笔，我便能算一笔。”"
    },
    suggestions: [
      {
        id: "pseudo-general-transport",
        label: "转问急令与漕粮压力",
        reply: "急令压在衙门头上，许多风险便被写成了不得不办。",
        unlockKnowledge: ["ming-grain-transport"],
        unlockClues: ["grain-transport-order"]
      },
      {
        id: "pseudo-general-evidence",
        label: "转问已有证据能说明什么",
        reply: "证据要互相照应，单独一件只会把人带偏。"
      },
      {
        id: "pseudo-general-witness",
        label: "转问证人亲眼所见",
        reply: "先问亲眼所见，再问谁让他不敢说。"
      }
    ]
  }
};

function choosePseudoResponse(state: InvestigationState, topic: PseudoTopic) {
  const npc = activeNpc(state);
  const response = topicResponses[topic];
  const hasMatchingClue = response.clue ? state.unlockedClues.includes(response.clue) : state.unlockedClues.length > 0;
  const depthLine = hasMatchingClue ? response.deep : response.shallow;
  const npcLine = response.textByNpc[npc.id] ?? topicResponses.general.textByNpc[npc.id] ?? npc.fallbackReplies[0];

  return `${npcLine}${depthLine}`;
}

export function buildFallbackAiReply(state: InvestigationState, playerText: string): AiReply {
  const topic = classifyPseudoTopic(playerText);
  const response = topicResponses[topic];
  const text = choosePseudoResponse(state, topic);

  return {
    mode: "offline",
    npcReply: text,
    suggestions: response.suggestions,
    triggeredKnowledge: response.suggestions.flatMap((choice) => choice.unlockKnowledge ?? []),
    triggeredClues: response.suggestions.flatMap((choice) => choice.unlockClues ?? [])
  };
}

function isSuggestedChoice(value: unknown): value is SuggestedChoice {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Partial<SuggestedChoice>;
  return typeof item.id === "string" && typeof item.label === "string" && typeof item.reply === "string";
}

function normalizeAiReply(value: unknown): AiReply | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const item = value as Partial<AiReply>;
  if (typeof item.npcReply !== "string" || !Array.isArray(item.suggestions)) {
    return undefined;
  }
  const suggestions = item.suggestions.filter(isSuggestedChoice).slice(0, 5);
  if (suggestions.length === 0) {
    return undefined;
  }
  return {
    mode: "online",
    npcReply: item.npcReply,
    suggestions,
    triggeredKnowledge: Array.isArray(item.triggeredKnowledge) ? item.triggeredKnowledge : [],
    triggeredClues: Array.isArray(item.triggeredClues) ? item.triggeredClues : []
  };
}

export async function requestAiReply(
  state: InvestigationState,
  playerText: string,
  fetchImpl: FetchLike = fetch
): Promise<AiReply> {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT ?? "/api/ai/dialogue";
  const fallback = buildFallbackAiReply(state, playerText);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildAiPayload(state, playerText))
    });
    if (!response.ok) {
      return fallback;
    }
    const data = normalizeAiReply(await response.json());
    return data ?? fallback;
  } catch {
    return fallback;
  }
}
