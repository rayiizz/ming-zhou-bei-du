import { eventCatalog, playableEventId } from "./events";
import { npcProfiles } from "./npcs";
import type {
  ClueCardId,
  CaseConclusion,
  EventId,
  FinalJudgement,
  InvestigationState,
  KnowledgeCardId,
  NpcId,
  SuggestedChoice
} from "./types";

const firstNpcId: NpcId = "wang-huaiyuan";

const npcAfterwords: Record<NpcId, string> = {
  "wang-huaiyuan": "运河上的事从不是一句话能断清的。你若还要问，就把船、人、账一起看。",
  "zheng-chaosheng": "船上人说话不敢太满。水面上能看见的，往往只是最轻的一层。",
  "lin-wenqi": "图上的一条细线，落到人身上便是一段命数。你若再查，请别只看官文。",
  "su-xiuyun": "戏台上的词有板有眼，码头上的传言却没有。真相常藏在没人愿意唱出的那一句里。",
  "zhao-bingfeng": "账面越干净，越要问它为何干净。沉下去的不只是一条船，也可能是一串名字。"
};

const playerQuestionLines: Record<string, string> = {
  "wang-transport-pressure": "王大人，永乐号为何被催得这样急？徐州险段不是能靠一纸急令抢过去的水路。",
  "wang-departure-ledger": "我想再核一遍文书。扬州启运、徐州验报之间，哪一处最可能被人动过手脚？",
  "wang-night-sailing": "徐州水急滩险，夜行更是犯忌。是谁坚持让永乐号在那一夜继续北上？",
  "zheng-crew-food": "郑兄，我不问传闻，只问你亲眼所见：船员昏迷前，饭食里可有异味？",
  "zheng-grudge": "你提到怨气，我想听实话。漕兵怨的是这趟差，还是怨有人拿你们的命填期限？",
  "zheng-night-noise": "沉船前那阵异响，你再慢慢想一遍。它像撞上暗石，还是像船身里先裂开了？",
  "lin-route-fragment": "林姑娘，你兄长留下的路线图为何偏偏重标徐州？那不是寻常旅人会反复描的地方。",
  "lin-weaving-office": "织造府与漕粮看似两路，消息却都沿运河北上。你听到的牵连从哪里开始？",
  "lin-hidden-river": "这段被抹去的河路不像笔误。若永乐号走过这里，它是在避水，还是避人？",
  "su-back-door-guests": "苏姑娘，戏园后门来往杂乱。那几位船客里，谁最不像普通漕运人？",
  "su-medicine-source": "那味药从何处来？若不是戏班常用，卖药的人为何偏在沉船前后出现？",
  "su-wharf-rumor": "码头传言传得太快了。你听见最早那一句时，说话的人站在哪里？",
  "zhao-plank-ledger": "赵掌柜，账上写的是上等木料。可若船板真好，永乐号为何经不起徐州那一段水？",
  "zhao-merchant-ships": "官船不足便调商船，我能明白。可这批商船是谁点的名，又是谁从中拿了差价？",
  "zhao-repair-cost": "我不只问省下多少银子。若修船成本被压低，最后被压到水里的又是谁的命？",
  "wang-rush-plank-followup": "若急令和劣板撞在一起，就不只是天灾。王大人，你当时可见过船板验收记录？",
  "wang-route-pressure-followup": "北上路线每改一次，背后都有人催。催永乐号的人，是催粮，还是催某份账消失？",
  "zheng-drugged-crew-followup": "药渣和当夜饭食能对上。郑兄，谁负责分饭，谁又最先说这是水急惹的祸？",
  "zheng-plank-noise-followup": "你说老曹先听见异响。后来不许他再说话的人，是船上的，还是岸上的？",
  "lin-hidden-route-followup": "残图绕开常路，像是在绕开查验。你兄长若主动改道，他一定怕被谁看见？",
  "lin-family-stakes-followup": "你一路查到徐州，不只是寻亲。那半封信里，还有什么让你不敢停下？",
  "su-medicine-seller-followup": "卖药小贩天亮前离开，太巧了。苏姑娘，他往北码头去时，可有人接应？",
  "su-wharf-network-followup": "传言先替真相定了性，像有人提前写好台词。第一个放话的人，你还认得出吗？",
  "zhao-repair-ledger-followup": "修船账干净得过头。赵掌柜，若要藏一笔急修银，最容易藏在哪一栏？",
  "zhao-merchant-profit-followup": "商船急调里有差价，也有沉默。永乐号沉下去后，哪一笔账最先被抹平？",
  "ask-transport-pressure": "这趟漕粮为何非要急成这样？若只是误期，官府何至于逼船冒险？",
  "ask-hull-plank": "我想看船板与暗礁记录。若船身早有裂口，水势只是最后一推。",
  "ask-crew-food": "船员昏迷前到底吃过什么？若饭食有问题，沉船便不是单纯遇险。"
};

const playerReflectionLines: Record<string, string> = {
  "wang-transport-pressure": "急令能解释催逼，却不能替沉船脱罪。我得把期限、船况和验报放在一起看。",
  "wang-departure-ledger": "文书越齐整，越像有人提前替自己留了退路。这一页不能只按官样读。",
  "wang-night-sailing": "夜行本身就是破绽。若没人担责，便说明有人把风险推给了整条船。",
  "zheng-crew-food": "饭食这一节若坐实，船员失手就不是懈怠，而是有人先夺了他们的力气。",
  "zheng-grudge": "怨气不是证据，但它能指出谁长期被压着说不出话。",
  "zheng-night-noise": "船尾异响比水声更要紧。它可能是永乐号沉下去前留下的最后一句话。",
  "lin-route-fragment": "路线图不是游记。它标出的不是风景，是有人刻意经过或刻意避开的地方。",
  "lin-weaving-office": "织造府若卷入漕粮，案子便不止在码头，也在北上的消息链里。",
  "lin-hidden-river": "被抹掉的河段比写出来的更响。我要查它连接了谁的码头。",
  "su-back-door-guests": "戏园后门像一处暗渡口。来客身份若能对上，传言就有了源头。",
  "su-medicine-source": "药材来路不能放过。银钱给得急，往往说明买的不是药，是闭嘴。",
  "su-wharf-rumor": "传言跑在证据前面，通常不是巧合。有人想先替案子定个说法。",
  "zhao-plank-ledger": "账上写上等，水里露劣痕。我要看的不是字面，是字面后面的差价。",
  "zhao-merchant-ships": "商船被临时拉进官差，这里面最容易藏人情，也最容易藏账。",
  "zhao-repair-cost": "省下的银子若换来一条沉船，就不是小贪，是拿人命抵账。",
  "wang-rush-plank-followup": "急令与劣板互相印证，这条线已经不能再按意外处理。",
  "wang-route-pressure-followup": "路线变动若服务于某个期限，期限背后就一定有人得利。",
  "zheng-drugged-crew-followup": "饭食、药渣和昏迷能连起来。接下来要找的是递碗的人。",
  "zheng-plank-noise-followup": "老曹听见的不是小事。有人堵住他的嘴，便是在堵船身的裂口。",
  "lin-hidden-route-followup": "绕开查验的路线，往往不是为了快，而是为了不被看见。",
  "lin-family-stakes-followup": "这不是旁观者的证词。她把自己的家事也押进了案卷里。",
  "su-medicine-seller-followup": "小贩走得太准，像被人安排在消息散开之前离场。",
  "su-wharf-network-followup": "先放话的人也许不在船上，却可能最早知道船会怎样沉。",
  "zhao-repair-ledger-followup": "账不怕脏，怕太干净。干净到没有人名，就一定有人名被擦掉。",
  "zhao-merchant-profit-followup": "差价不是沉船原因，却可能解释为什么有人愿意让船带病出发。",
  "ask-transport-pressure": "催运只是外壳，真正要查的是谁借这道急令省了该省不得的步骤。",
  "ask-hull-plank": "船板若有旧伤，暗礁便不是唯一凶手。",
  "ask-crew-food": "饭食这条线要和船员证词放在一起，不然只会变成又一桩传闻。"
};

const npcAfterwordLines: Record<string, string> = {
  "wang-transport-pressure": "你问到急处了。可急令从来不亲自下水，真正推船的人，还在文书后面。",
  "wang-departure-ledger": "若你要查文书，就别只查落款。查谁催、谁批、谁最后验了这条船。",
  "wang-night-sailing": "夜里水声能吞掉许多话。可吞不掉的，总会在第二日的账册里露头。",
  "zheng-crew-food": "我只怕你查到最后，又有人说漕兵胡言乱语。可那晚倒下的人，不止我一个。",
  "zheng-grudge": "我们怨归怨，还没疯到拿整条船陪葬。真要找狠人，去找敢把烂事当小事的人。",
  "zheng-night-noise": "那声音我这辈子忘不了。水一压上来，人才知道木头早就替人受过罪。",
  "lin-route-fragment": "兄长画图极细。他若重标徐州，必是那里有人要他记住，也有人要他忘掉。",
  "lin-weaving-office": "运河载粮，也载命令。越靠近北方，话传得越轻，人命却越重。",
  "lin-hidden-river": "若这条线真被人抹去，抹去它的人一定熟悉河道，也熟悉查验。",
  "su-back-door-guests": "看戏的人爱换脸，跑船的人也会。你若只看衣着，便看不见谁在替谁传话。",
  "su-medicine-source": "那药味我不敢认死，可给钱的人急得很，像怕天亮以后就买不到沉默。",
  "su-wharf-rumor": "码头的话像风，风从哪边起，得看谁先点了灯。",
  "zhao-plank-ledger": "账房的人最懂遮丑。字写得越稳，手也许抖得越厉害。",
  "zhao-merchant-ships": "官船、商船一混，银子就有了水路。水路弯，账路也弯。",
  "zhao-repair-cost": "你问成本，便问到了疼处。船坏了能补，人沉了，账上却只剩一行损耗。"
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function npcById(npcId: NpcId) {
  const npc = npcProfiles.find((item) => item.id === npcId);
  if (!npc) {
    throw new Error(`NPC ${npcId} not found`);
  }
  return npc;
}

function splitNpcReply(reply: string): string[] {
  const sentences = reply.match(/[^。？！]+[。？！」]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [reply];
  if (sentences.length <= 1) {
    return [reply];
  }

  const midpoint = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, midpoint).join(""), sentences.slice(midpoint).join("")].filter(Boolean);
}

function buildSuggestedExchange(state: InvestigationState, npcName: string, choice: SuggestedChoice) {
  const playerQuestion =
    choice.playerQuestion ?? playerQuestionLines[choice.id] ?? `我想问清楚：${choice.label.replace(/^追问/, "")}。`;
  const playerFollowUp =
    choice.playerReflection ?? playerReflectionLines[choice.id] ?? "这句话先落在案卷里。下一步要看它能不能和证据互相咬合。";
  const npcAfterword = choice.npcAfterword ?? npcAfterwordLines[choice.id] ?? npcAfterwords[state.activeNpcId];
  const npcReplyMessages = splitNpcReply(choice.reply).map((text, index) => ({
    id: index === 0 ? `reply-${choice.id}` : `reply-${choice.id}-${index + 1}`,
    speaker: npcName,
    text,
    source: "npc" as const
  }));

  return [
    {
      id: `choice-${choice.id}`,
      speaker: "案卷整理者",
      text: playerQuestion,
      source: "player" as const
    },
    ...npcReplyMessages,
    {
      id: `choice-${choice.id}-press`,
      speaker: "案卷整理者",
      text: playerFollowUp,
      source: "player" as const
    },
    {
      id: `reply-${choice.id}-after`,
      speaker: npcName,
      text: npcAfterword,
      source: "npc" as const
    }
  ];
}

export function createInvestigationState(): InvestigationState {
  return {
    view: "home",
    activeNpcId: firstNpcId,
    phase: "intake",
    messages: [],
    unlockedKnowledge: [],
    unlockedClues: [],
    unlockedInsights: [],
    aiMode: "offline"
  };
}

export function enterEventArchive(state: InvestigationState, eventId: EventId): InvestigationState {
  const event = eventCatalog.find((item) => item.id === eventId);
  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  return {
    ...state,
    view: "archive",
    selectedEventId: eventId,
    activeNpcId: firstNpcId,
    phase: eventId === playableEventId ? "intake" : "summary",
    messages: []
  };
}

export function enterStory(state: InvestigationState): InvestigationState {
  const npc = npcById(state.activeNpcId);
  return {
    ...state,
    view: "story",
    phase: "interviews",
    messages: [
      {
        id: `${npc.id}-opening`,
        speaker: npc.name,
        text: npc.openingLine,
        source: "npc"
      }
    ]
  };
}

export function selectNpc(state: InvestigationState, npcId: NpcId): InvestigationState {
  const npc = npcById(npcId);
  return {
    ...state,
    activeNpcId: npcId,
    messages: [
      ...state.messages,
      {
        id: `${npc.id}-${state.messages.length}`,
        speaker: npc.name,
        text: npc.openingLine,
        source: "npc"
      }
    ]
  };
}

export function submitPlayerMessage(state: InvestigationState, text: string): InvestigationState {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: `player-${state.messages.length}`,
        speaker: "案卷整理者",
        text,
        source: "player"
      }
    ]
  };
}

export function submitSuggestedChoice(state: InvestigationState, choice: SuggestedChoice): InvestigationState {
  const npc = npcById(state.activeNpcId);
  const exchange = buildSuggestedExchange(state, npc.name, choice);
  return {
    ...state,
    messages: [...state.messages, ...exchange],
    unlockedKnowledge: unique([...state.unlockedKnowledge, ...((choice.unlockKnowledge ?? []) as KnowledgeCardId[])]),
    unlockedClues: unique([...state.unlockedClues, ...((choice.unlockClues ?? []) as ClueCardId[])])
  };
}

const legacyConclusions: Record<FinalJudgement, CaseConclusion> = {
  sabotage: {
    directCause: "crew-incapacitated",
    drivingForce: "merchant-ledger",
    keyEvidence: "drug-residue"
  },
  "bad-plank": {
    directCause: "hull-failure",
    drivingForce: "transport-deadline",
    keyEvidence: "broken-hull-plank"
  },
  "multi-factor": {
    directCause: "hull-failure",
    drivingForce: "transport-deadline",
    keyEvidence: "grain-transport-order"
  },
  "political-risk": {
    directCause: "night-risk",
    drivingForce: "hidden-route",
    keyEvidence: "canal-route-fragment"
  }
};

export function completeInvestigation(
  state: InvestigationState,
  conclusion: FinalJudgement | CaseConclusion
): InvestigationState {
  const caseConclusion = typeof conclusion === "string" ? legacyConclusions[conclusion] : conclusion;
  return {
    ...state,
    view: "summary",
    phase: "summary",
    finalJudgement: typeof conclusion === "string" ? conclusion : undefined,
    caseConclusion
  };
}
