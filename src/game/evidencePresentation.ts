import { clueCards } from "./knowledge";
import { npcProfiles } from "./npcs";
import type { ClueCardId, InvestigationState, KnowledgeCardId, NpcId } from "./types";

interface EvidenceReaction {
  reply: string;
  replyLines?: string[];
  cue?: string;
  unlockKnowledge?: KnowledgeCardId[];
  unlockClues?: ClueCardId[];
}

const reactions: Partial<Record<NpcId, Partial<Record<ClueCardId, EvidenceReaction>>>> = {
  "wang-huaiyuan": {
    "grain-transport-order": {
      reply:
        "这份文书确是急令。误期不是小过，沿途官署自然会逼着船队赶路。若船体本就有隐患，急令便是压在船底的一块石。",
      replyLines: [
        "这份文书确是急令。误期不是小过，沿途官署自然会逼着船队赶路。",
        "若船体本就有隐患，急令便是压在船底的一块石。你若继续查，别只查谁签了字，也要查谁明知船旧还催它入险段。"
      ],
      cue: "王淮远的语气松了一些，终于不再只把话压在官文后面。",
      unlockKnowledge: ["ming-grain-transport"]
    },
    "broken-hull-plank": {
      reply: "船板若真如你所说新旧不一，那便不是一句水急可以遮过去的。督运只看期限，修船的人却未必看人命。",
      replyLines: [
        "船板若真如你所说新旧不一，那便不是一句水急可以遮过去的。",
        "督运只看期限，修船的人却未必看人命。若账房、船坞、催运三处都装作没看见，这案子就不是一处漏洞。"
      ],
      cue: "王淮远避开你的目光，话里多了几分迟疑。"
    }
  },
  "zheng-chaosheng": {
    "drug-residue": {
      reply: "你拿这药渣来问我，我便不能只说风浪了。那夜有人吃过东西便发晕，撑篙的人手一软，船就再也不听话。",
      replyLines: [
        "你拿这药渣来问我，我便不能只说风浪了。",
        "那夜有人吃过东西便发晕，撑篙的人手一软，船就再也不听话。若不是巧合，便是有人算准了入险段的时辰。"
      ],
      cue: "郑潮生攥紧了袖口，像是终于等到有人把话问到船上。",
      unlockClues: ["soldier-testimony"]
    },
    "soldier-testimony": {
      reply: "这份口供里有些话是真的。船尾那阵响动，我听见了，只是不敢在官面前先开口。",
      replyLines: [
        "这份口供里有些话是真的。船尾那阵响动，我听见了。",
        "只是官面前先开口的人，往往先成替罪的人。你若愿意把我这句也写进去，我便再想想那夜谁离过舱。"
      ],
      cue: "郑潮生的戒备退了半步，声音仍低，却不再躲闪。"
    }
  },
  "lin-wenqi": {
    "canal-route-fragment": {
      reply: "这残图不是普通行船图。被圈出的河段绕开了常路，像是在避人耳目，也像是在替某些货物找更快的北上路径。",
      replyLines: [
        "这残图不是普通行船图。被圈出的河段绕开了常路，像是在避人耳目。",
        "也像是在替某些货物找更快的北上路径。若永乐号走过这条线，沉船便可能是有人急着抹掉一段行程。"
      ],
      cue: "林文绮把残图推近了些，默认你已经看见了她不敢明说的部分。",
      unlockKnowledge: ["huitong-river", "capital-move-beijing"]
    }
  },
  "su-xiuyun": {
    "drug-residue": {
      reply: "这种药味我在戏园后门闻过。不是台上常用的醒神药，更像码头小贩私下带来的东西。",
      replyLines: [
        "这种药味我在戏园后门闻过。不是台上常用的醒神药。",
        "更像码头小贩私下带来的东西。那人不看戏，只等人传话，像是早知道船上会有人需要它。"
      ],
      cue: "苏秀云收起笑意，扇骨轻轻抵住掌心。",
      unlockKnowledge: ["yangzhou-wharf"]
    },
    "soldier-testimony": {
      reply: "漕兵说的话，码头人未必敢写进文书。可夜里谁来过，谁从后巷走，戏园总能听见些风声。",
      replyLines: [
        "漕兵说的话，码头人未必敢写进文书。",
        "可夜里谁来过，谁从后巷走，戏园总能听见些风声。你若查后门，就别只问唱戏的人。"
      ],
      cue: "苏秀云看向门外，像是在提醒你隔墙也有耳。"
    }
  },
  "zhao-bingfeng": {
    "broken-hull-plank": {
      reply: "这船板若摆在账房里，便是一笔省下的银子；摆在河里，便是一条压不住的命。你要问谁省了这笔钱，可别只问船工。",
      replyLines: [
        "这船板若摆在账房里，便是一笔省下的银子；摆在河里，便是一条压不住的命。",
        "你要问谁省了这笔钱，可别只问船工。真正会把旧板写成新料的人，多半坐在干净的屋子里。"
      ],
      cue: "赵秉丰的笑意薄了，话却比方才锋利。",
      unlockKnowledge: ["xuzhou-danger-section"]
    },
    "grain-transport-order": {
      reply: "急令一下，官船不够便调商船，商船又急着补差价。船旧不旧、板薄不薄，账面上都能写得体面。",
      replyLines: [
        "急令一下，官船不够便调商船，商船又急着补差价。",
        "船旧不旧、板薄不薄，账面上都能写得体面。急字一落，许多不该省的钱就都有了名目。"
      ],
      cue: "赵秉丰拨算盘的手停了一瞬，像是被你按住了账眼。"
    }
  }
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function getNpcName(npcId: NpcId) {
  return npcProfiles.find((npc) => npc.id === npcId)?.name ?? "证人";
}

function getClueTitle(clueId: ClueCardId) {
  return clueCards.find((clue) => clue.id === clueId)?.title ?? clueId;
}

export function presentEvidenceToNpc(state: InvestigationState, clueId: ClueCardId): InvestigationState {
  const npcName = getNpcName(state.activeNpcId);
  const reaction = reactions[state.activeNpcId]?.[clueId];
  const reply =
    reaction?.reply ??
    "这件证据我一时对不上。若要追问，还是拿与我所见之事更近的案卷来。";
  const replyLines = reaction?.replyLines ?? [reply];
  const mood = reaction ? "softened" : "guarded";
  const lastCue =
    reaction?.cue ??
    `${npcName}的语气收紧了些，似乎觉得这件证据离自己的所见还太远。`;

  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: `present-${clueId}-${state.messages.length}`,
        speaker: "案卷整理者",
        text: `出示证据：${getClueTitle(clueId)}`,
        source: "player"
      },
      ...replyLines.map((line, index) => ({
        id: `reaction-${state.activeNpcId}-${clueId}-${state.messages.length + 1 + index}`,
        speaker: npcName,
        text: line,
        source: "npc" as const
      }))
    ],
    unlockedKnowledge: unique([...state.unlockedKnowledge, ...(reaction?.unlockKnowledge ?? [])]),
    unlockedClues: unique([...state.unlockedClues, ...(reaction?.unlockClues ?? [])]),
    npcPressure: {
      ...state.npcPressure,
      [state.activeNpcId]: {
        mood,
        lastCue
      }
    }
  };
}
