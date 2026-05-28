import type { ClueCardId, InsightId, InvestigationState, NpcId, SuggestedChoice } from "./types";

interface FollowUpChoice extends SuggestedChoice {
  npcId: NpcId;
  requiresClues?: ClueCardId[];
  requiresInsights?: InsightId[];
}

const followUpChoices: FollowUpChoice[] = [
  {
    id: "wang-rush-plank-followup",
    npcId: "wang-huaiyuan",
    label: "追问急令是否掩盖船板问题",
    reply:
      "王怀远抬眼看你，像终于承认你问到了最难遮的地方：“若只说急令，我还能以职责相辩；若急令压着劣板同行，那便是把人命交给了期限。督运衙门怕误期，也怕这层账被翻出来。船板验收若真有问题，所有催字都成了遮羞布，遮住的不是一块木头，是整条运粮路上的侥幸。”",
    requiresInsights: ["rush-and-rotten-plank"],
    unlockKnowledge: ["xuzhou-danger-section"]
  },
  {
    id: "wang-route-pressure-followup",
    npcId: "wang-huaiyuan",
    label: "追问北上路线是否另有催逼",
    reply:
      "他把路线图往灯下推近，语气比方才更慢：“迁都之后，北上粮道不只是粮道，也是朝廷的脸面。路线上每一次改动，都有人说是权宜；可权宜多了，便像一张网。永乐号若被临时改入某段水路，未必是为避险，也可能是为避开某处查验、某双眼睛，或者某份不该出现的账。”",
    requiresInsights: ["hidden-route-pressure"],
    unlockKnowledge: ["capital-move-beijing", "huitong-river"]
  },
  {
    id: "zheng-drugged-crew-followup",
    npcId: "zheng-chaosheng",
    label: "追问药渣与当夜饭食",
    reply:
      "郑潮生的手指紧紧扣住船沿：“那夜饭食不是人人都吃了。撑篙和看缆的几个吃得最多，偏偏也是最先脚软的人。若说没人挑过碗，我是不信的。饭是从同一锅里盛出来的，可分到谁手里、谁吃得多、谁被催着快些吃完，这些小事只有船上人记得。等官府来问，许多人已经不敢说了。”",
    requiresInsights: ["drugged-crew"],
    unlockClues: ["soldier-testimony"]
  },
  {
    id: "zheng-plank-noise-followup",
    npcId: "zheng-chaosheng",
    label: "追问船尾异响是谁先听见",
    reply:
      "他压低声音，像怕老曹的名字再惹祸：“先听见的是老曹。他说那声不像撞石，更像木头被水一顶，里面早有裂口。可他说完就被人拉走，不许再嚷。老曹一辈子在船上讨命，什么是水撞船、什么是船自己裂，他听得出来。若连他的口也要堵，那船尾那一下，怕就不是小响动。”",
    requiresClues: ["broken-hull-plank"],
    unlockClues: ["soldier-testimony"]
  },
  {
    id: "lin-hidden-route-followup",
    npcId: "lin-wenqi",
    label: "追问残图为何绕开常路",
    reply:
      "林文绮把指尖停在残图空白处，眼神很冷：“常路有驿、有闸、有眼睛。残图绕开的不是水道，而是查验。兄长若真循此北上，便说明他不是偶然卷入沉船案。他在信里从不写无用之事，若他画下这条路，多半是知道有人借运河传递东西，而那东西不能在官道上露面。”",
    requiresInsights: ["hidden-route-pressure"],
    unlockKnowledge: ["huitong-river"]
  },
  {
    id: "lin-family-stakes-followup",
    npcId: "lin-wenqi",
    label: "追问她为何执意查到徐州",
    reply:
      "她的声音第一次有些发颤：“家中只收到半封信，墨迹被水洇开，只剩‘粮船’与‘夜渡’两词。我来徐州，不为断案，只为知道他是否还活着。可一路查到这里，我才明白，兄长也许不是失踪那么简单。他若看见了不该看见的账，画下了不该画的路，那永乐号沉没，可能也沉着他的消息。”",
    requiresClues: ["canal-route-fragment"],
    unlockKnowledge: ["capital-move-beijing"]
  },
  {
    id: "su-medicine-seller-followup",
    npcId: "su-xiuyun",
    label: "追问卖药小贩的去向",
    reply:
      "苏秀云轻轻摇头：“他第二日天亮前便走了，往北码头去。戏园的人记得他的包袱上沾着米糠，像刚从粮船边挤出来。一个卖药小贩，若只是走街串巷，身上该有药味，不该有粮仓味。更怪的是，他走前还向后门张望了好几次，像在等人，又像怕等不到人。”",
    requiresClues: ["drug-residue"],
    unlockClues: ["soldier-testimony"]
  },
  {
    id: "su-wharf-network-followup",
    npcId: "su-xiuyun",
    label: "追问码头传言背后是谁放话",
    reply:
      "她把扇子抵在唇边，慢慢说道：“传言总要有人先开口。那晚先说‘水急沉船’的人，既不是船工，也不是漕兵，倒像替某个账房省口舌。他说得太稳了，稳得不像听来的，倒像早就背熟。码头人爱传话，可第一句话从哪里来，才最要紧。”",
    requiresInsights: ["rush-and-rotten-plank"],
    unlockKnowledge: ["yangzhou-wharf"]
  },
  {
    id: "zhao-repair-ledger-followup",
    npcId: "zhao-bingfeng",
    label: "追问修船账为何写得过于干净",
    reply:
      "赵秉丰把账页合上，脸色终于不那么从容：“账太干净，有时比账乱更可疑。可你要知道，商船被急调时，修船银从哪里出、谁来验，往往没人愿写细。写细了，就要有人承认船没修好；写不细，便只剩一笔笼统开销。账房最会把活人的手脚，写成死板的数目。”",
    requiresInsights: ["rush-and-rotten-plank"],
    unlockKnowledge: ["yangzhou-wharf"]
  },
  {
    id: "zhao-merchant-profit-followup",
    npcId: "zhao-bingfeng",
    label: "追问商船急调里的差价",
    reply:
      "他苦笑了一声：“差价不是一个人吞的。官船不够，商船补上，催得越急，账上越好做文章。有人吃租价，有人吃修船，有人吃临时换料，层层分下去，每个人都说自己只拿一点。永乐号沉下去，倒把许多账也沉了；可水能盖住船，盖不住那些银子流过的痕迹。”",
    requiresClues: ["grain-transport-order"],
    unlockKnowledge: ["ming-grain-transport"]
  }
];

function includesAll<T>(available: T[], required: T[] = []) {
  return required.every((item) => available.includes(item));
}

export function getFollowUpChoices(state: InvestigationState): SuggestedChoice[] {
  return followUpChoices.filter((choice) => {
    return (
      choice.npcId === state.activeNpcId &&
      includesAll(state.unlockedClues, choice.requiresClues) &&
      includesAll(state.unlockedInsights, choice.requiresInsights)
    );
  });
}
