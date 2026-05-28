export type LinqingNpcId = "gu-chenghuai" | "luo-wanzhou" | "ma-san" | "xu-yingnian";
export type LinqingEvidenceId = "tax-ticket" | "altered-manifest" | "night-cargo" | "merchant-ledger" | "customs-seal";
export type LinqingConclusionCause = "low-tax" | "private-cargo" | "clerical-error";
export type LinqingConclusionProof = "tax-ticket" | "merchant-ledger" | "night-cargo";

export interface LinqingNpc {
  id: LinqingNpcId;
  name: string;
  role: string;
  opening: string;
  sceneClass: string;
  portraitClass: string;
  backgroundLabel: string;
}

export interface LinqingEvidence {
  id: LinqingEvidenceId;
  title: string;
  tag: string;
  summary: string;
}

export interface LinqingChoice {
  id: string;
  npcId: LinqingNpcId;
  label: string;
  playerLine: string;
  replyLines: string[];
  unlockEvidence?: LinqingEvidenceId[];
}

export interface LinqingConclusion {
  cause: LinqingConclusionCause;
  proof: LinqingConclusionProof;
}

export interface LinqingChapterMessage {
  id: string;
  speaker: string;
  text: string;
  source: "npc" | "player" | "system";
}

export interface LinqingPressureCue {
  tone: "softened" | "guarded";
  text: string;
}

export interface LinqingChapterSnapshot {
  activeNpcId: LinqingNpcId;
  messages: LinqingChapterMessage[];
  visibleMessageIndex: number;
  unlockedEvidence: LinqingEvidenceId[];
  pressureCue?: LinqingPressureCue;
  conclusion: LinqingConclusion;
  summaryOpen: boolean;
}

export function createLinqingChapterSnapshot(): LinqingChapterSnapshot {
  return {
    activeNpcId: "gu-chenghuai",
    messages: [
      {
        id: "opening",
        speaker: "顾承槐",
        text: getLinqingNpc("gu-chenghuai").opening,
        source: "npc"
      }
    ],
    visibleMessageIndex: 0,
    unlockedEvidence: [],
    conclusion: {
      cause: "low-tax",
      proof: "merchant-ledger"
    },
    summaryOpen: false
  };
}

export const linqingNpcs: LinqingNpc[] = [
  {
    id: "gu-chenghuai",
    name: "顾承槐",
    role: "钞关文书官",
    opening: "钞关只认票、印、船单。若三者都齐，谁也不能凭一句传闻拦船。",
    sceneClass: "linqing-scene-tax-office",
    portraitClass: "linqing-portrait-gu",
    backgroundLabel: "临清钞关税房与朱批案桌"
  },
  {
    id: "luo-wanzhou",
    name: "罗万舟",
    role: "南货船主",
    opening: "我这船货赶着北上，税也交了，印也盖了。再拖一晚，亏的可不止我一人。",
    sceneClass: "linqing-scene-cabin",
    portraitClass: "linqing-portrait-luo",
    backgroundLabel: "商船舱口与封箱货栈"
  },
  {
    id: "ma-san",
    name: "马三",
    role: "码头脚夫",
    opening: "小的只搬货，不识票。可箱子沉不沉、夜里谁催得急，肩膀记得比账本清楚。",
    sceneClass: "linqing-scene-yard",
    portraitClass: "linqing-portrait-ma",
    backgroundLabel: "夜间码头货箱与脚夫栈道"
  },
  {
    id: "xu-yingnian",
    name: "许应年",
    role: "商号账房",
    opening: "商号账目向来清白。若票面与船单有差，多半是抄录忙乱，未必就是私弊。",
    sceneClass: "linqing-scene-ledger",
    portraitClass: "linqing-portrait-xu",
    backgroundLabel: "商号账房与暗账木柜"
  }
];

export const linqingEvidence: LinqingEvidence[] = [
  {
    id: "tax-ticket",
    title: "异常税票",
    tag: "钞关文书",
    summary: "同船南货按普通杂货低报，朱批时辰却早于正式验货。"
  },
  {
    id: "altered-manifest",
    title: "船单涂改",
    tag: "船运记录",
    summary: "船单货名被重墨改写，箱数与税票不合。"
  },
  {
    id: "night-cargo",
    title: "夜搬货箱",
    tag: "码头证言",
    summary: "脚夫见过一批封箱夜间绕开正栈搬入船舱。"
  },
  {
    id: "merchant-ledger",
    title: "商号暗账",
    tag: "账房线索",
    summary: "暗账中有补价、谢银与通关日期，和钞关朱批互相照应。"
  },
  {
    id: "customs-seal",
    title: "钞关放行朱批",
    tag: "关印证据",
    summary: "朱批盖得太早，说明有人先于验货替船主铺好通关路径。"
  }
];

export const linqingChoices: LinqingChoice[] = [
  {
    id: "gu-tax-ticket",
    npcId: "gu-chenghuai",
    label: "核对税票为何低报",
    playerLine: "这张税票把南货写成杂货，朱批又早于验货。顾大人，这算不算规矩里的空子？",
    replyLines: [
      "顾承槐把票据压平，声音仍稳：“票面如此，关上自然照票征税。”",
      "可他停了一下，又补了一句：“若朱批真早于验货，那便不是抄手笔误，而是有人先替这船开了门。”"
    ],
    unlockEvidence: ["tax-ticket", "customs-seal"]
  },
  {
    id: "gu-seal-time",
    npcId: "gu-chenghuai",
    label: "追问朱批为何提前",
    playerLine: "朱批提前，验货在后，这中间是谁催着放行？",
    replyLines: [
      "顾承槐的目光从印泥上移开：“临清船多，急船也多。有人拿漕运调度压下来，文书便容易先走一步。”",
      "“可先走一步和先放一船私货，是两回事。你若要查，就去问船主和账房。”"
    ],
    unlockEvidence: ["customs-seal"]
  },
  {
    id: "luo-manifest",
    npcId: "luo-wanzhou",
    label: "查问船单为何涂改",
    playerLine: "罗船主，船单上的货名被重墨改过，箱数也对不上税票。",
    replyLines: [
      "罗万舟皱眉：“水路生意讲时辰。货到临清临时拼箱，并不稀奇。”",
      "他语气变硬：“可若有人说我夹带私货，就拿出箱里东西来，别拿几笔重墨吓人。”"
    ],
    unlockEvidence: ["altered-manifest"]
  },
  {
    id: "luo-private-cargo",
    npcId: "luo-wanzhou",
    label: "追问是否夹带私货",
    playerLine: "这批箱子若只是杂货，为何要避开正栈，夜里搬上船？",
    replyLines: [
      "罗万舟沉默片刻，手指敲着舱板：“夜搬是为赶潮，不是为避关。”",
      "“但货不是我一家说了算。商号给什么票，关上盖什么印，船主只求这水路别误了时辰。”"
    ],
    unlockEvidence: ["night-cargo"]
  },
  {
    id: "ma-night-cargo",
    npcId: "ma-san",
    label: "询问夜里搬过什么箱",
    playerLine: "马三，你说肩膀记得清楚。那夜的箱子和白日杂货有什么不同？",
    replyLines: [
      "马三搓着肩：“白日杂货轻，夜里那批沉，箱角还垫了油布，怕水也怕人看。”",
      "“催货的人不让走正栈，只说船主急、关上也点过头。小的听命搬货，不敢多问。”"
    ],
    unlockEvidence: ["night-cargo"]
  },
  {
    id: "ma-wharf-route",
    npcId: "ma-san",
    label: "追问谁带路绕开正栈",
    playerLine: "绕开正栈总要有人带路，是船上人，还是关上人？",
    replyLines: [
      "马三压低声音：“带路的是商号伙计，手里却拿着关上的小牌。”",
      "“码头人认牌不认人。牌一亮，谁还敢拦？”"
    ],
    unlockEvidence: ["customs-seal"]
  },
  {
    id: "xu-ledger",
    npcId: "xu-yingnian",
    label: "翻看商号暗账",
    playerLine: "许账房，明账干净，暗账里为何有补价、谢银和同一日通关记号？",
    replyLines: [
      "许应年笑意微收：“商号往来，明账记货，私簿记人情。这在码头不算新鲜。”",
      "“可若你硬要把谢银、朱批、低税三件事连在一起，那这本账就不能只算商号的账了。”"
    ],
    unlockEvidence: ["merchant-ledger"]
  },
  {
    id: "xu-profit",
    npcId: "xu-yingnian",
    label: "追问谁从急放中获利",
    playerLine: "这船越急，补价越高，谁最盼它不经细验就过关？",
    replyLines: [
      "许应年拨了拨算盘：“急字最值钱。船主省时，商号省税，关上省麻烦。”",
      "“若再挂上漕运急调的名头，许多不该快的事，便都快得理直气壮。”"
    ],
    unlockEvidence: ["merchant-ledger", "customs-seal"]
  }
];

export const linqingConclusionOptions = {
  cause: [
    { id: "low-tax" as const, label: "低报税额", hint: "税票把南货压成普通杂货，是疑账最直接的入口。" },
    { id: "private-cargo" as const, label: "夹带私货", hint: "夜搬货箱与船单涂改说明货物并不干净。" },
    { id: "clerical-error" as const, label: "文书误抄", hint: "只解释字面问题，无法解释朱批与暗账。" }
  ],
  proof: [
    { id: "tax-ticket" as const, label: "异常税票", hint: "证明低报和提前朱批。" },
    { id: "merchant-ledger" as const, label: "商号暗账", hint: "证明补价、谢银与通关日期。" },
    { id: "night-cargo" as const, label: "夜搬货箱", hint: "证明货物绕开正栈。" }
  ]
};

export function getLinqingNpc(id: LinqingNpcId) {
  return linqingNpcs.find((npc) => npc.id === id) ?? linqingNpcs[0];
}

export function getLinqingEvidence(id: LinqingEvidenceId) {
  return linqingEvidence.find((evidence) => evidence.id === id) ?? linqingEvidence[0];
}
