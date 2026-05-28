import type { NpcId, SuggestedChoice } from "./types";

interface NpcVisualConfig {
  sceneClass: string;
  portraitClass: string;
  backgroundLabel: string;
}

export const npcVisuals: Record<NpcId, NpcVisualConfig> = {
  "wang-huaiyuan": {
    sceneClass: "scene-npc-wang",
    portraitClass: "portrait-npc-wang",
    backgroundLabel: "徐州临时官署与运河码头"
  },
  "zheng-chaosheng": {
    sceneClass: "scene-npc-zheng",
    portraitClass: "portrait-npc-zheng",
    backgroundLabel: "夜色漕船甲板与船舱"
  },
  "lin-wenqi": {
    sceneClass: "scene-npc-lin",
    portraitClass: "portrait-npc-lin",
    backgroundLabel: "客栈案桌与运河路线图"
  },
  "su-xiuyun": {
    sceneClass: "scene-npc-su",
    portraitClass: "portrait-npc-su",
    backgroundLabel: "扬州戏园后门与码头灯火"
  },
  "zhao-bingfeng": {
    sceneClass: "scene-npc-zhao",
    portraitClass: "portrait-npc-zhao",
    backgroundLabel: "粮仓账房与码头货栈"
  }
};

export const npcDialogueCatalog: Record<NpcId, SuggestedChoice[]> = {
  "wang-huaiyuan": [
    {
      id: "wang-transport-pressure",
      label: "追问运粮为何如此急迫",
      reply:
        "王怀远把袖口按在案上，声音压得很低：“急令压在衙门头上，谁也不敢慢。北都等粮，徐州等验，扬州那边又催着启运，哪一处拖了，最后都算到督运衙门头上。可话说回来，急不该急到不看船况；若永乐号真是带病上路，那就不是误期小过，而是有人把期限看得比船上人命还重。”",
      unlockKnowledge: ["ming-grain-transport", "capital-move-beijing"],
      unlockClues: ["grain-transport-order"]
    },
    {
      id: "wang-departure-ledger",
      label: "核对船队出发文书",
      reply:
        "他翻开文书时没有立刻递给你，只先用指节敲了敲落款：“扬州启运、徐州验报、沿途不得久泊，字面上都干净。可文书干净不等于路上干净，越是写得周全，越容易把责任切成一小段一小段，谁都说自己只照章办事。你若要查，就别只看出发日，也要看是谁把验船、配粮、换班三件事压到同一晚。”",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["grain-transport-order"]
    },
    {
      id: "wang-night-sailing",
      label: "询问徐州险段为何仍要夜行",
      reply:
        "王怀远沉默了一会儿，像是在衡量哪些话能说：“徐州险段夜行，本就是把命交给水势。水急、暗礁、风向，哪一样都不能轻看，老船户听见这两个字都会皱眉。可那几日上头催得厉害，岸上只看船到不到，不问船能不能到。若有人借夜色省验船、省候潮、省换缆，那永乐号出事便不是一阵风浪能说清的。”",
      unlockKnowledge: ["xuzhou-danger-section"]
    }
  ],
  "zheng-chaosheng": [
    {
      id: "zheng-crew-food",
      label: "追问船员昏迷前吃过什么",
      reply:
        "郑潮生先骂了一句，又把声音压下去：“那晚饭食有股苦腥味，像陈药渣混进了米里。我们这些漕兵平日吃惯粗粮，苦一点没人敢挑，可撑篙的、看缆的先后脚软，眼皮像被水往下拖。等有人喊不对，船已经进了最难回头的水道。你要问我是不是有人下药，我不敢断死；可那顿饭之后，船上确实少了半船清醒的人。”",
      unlockClues: ["drug-residue", "soldier-testimony"]
    },
    {
      id: "zheng-grudge",
      label: "问他为何怨恨这趟漕运",
      reply:
        "他盯着甲板缝里的水痕，嘴角绷得很紧：“怨？当然怨。有人拿漕粮换官声，有人拿账本换银子，可真正把篙子戳进水里的是我们。皇粮要紧，这话我们听了一路；可船漏不漏、缆牢不牢、饭里有没有怪味，从没人问过。永乐号沉了以后，岸上的人先问粮损多少，后问文书齐不齐，最后才想起船上也有活人。”",
      unlockKnowledge: ["ming-grain-transport"],
      unlockClues: ["soldier-testimony"]
    },
    {
      id: "zheng-night-noise",
      label: "让他回忆沉船前夜的动静",
      reply:
        "郑潮生闭上眼，像又听见那一夜的水声：“二更后船尾响过一阵，不像撞石，倒像木板被水顶开，又被人急忙压回去。缆索也动过，结法不对，老船手一摸就知道不是平日那几个兄弟系的。风浪声太大，我当时不敢断言；可船沉之前，那声音一阵比一阵闷，像船肚子里早就憋着口气，终于憋不住了。”",
      unlockClues: ["broken-hull-plank", "soldier-testimony"]
    }
  ],
  "lin-wenqi": [
    {
      id: "lin-route-fragment",
      label: "询问兄长留下的路线图",
      reply:
        "林文绮把残图压在灯下，指尖停在朱笔最重的地方：“兄长画图从不多一笔，这几处河段却反复描过。徐州、会通河、几处换船水口，全不像游历所记，倒像在标记某条不该被人看见的路。你看这里，墨迹被水泡开，说明他最后还带在身边。若只是路过，他不会把一张图藏得比家书还紧。”",
      unlockKnowledge: ["huitong-river"],
      unlockClues: ["canal-route-fragment"]
    },
    {
      id: "lin-weaving-office",
      label: "追问织造府为何牵涉漕粮案",
      reply:
        "她没有急着辩解，只把茶盏推远了些：“织造府听着像只管丝绢，可迁都以后，贡品、丝料、漕粮都沿同一条水路北上。船上装的是什么，岸上等的是什么，往往分不开。兄长曾说，运河不只运货，也运消息和风险；一旦有人借漕船夹带私货、夹带文书，织造府的人便可能比漕运官更早听见风声。”",
      unlockKnowledge: ["capital-move-beijing", "yangzhou-wharf"]
    },
    {
      id: "lin-hidden-river",
      label: "请她辨认图上隐去的河段",
      reply:
        "林文绮微微蹙眉，把残图转了半圈：“这段不是画漏，是被刻意略去。它避开了寻常驿路，却贴着几处可换船的水口，像是有人熟悉查验时辰，知道哪里能藏半日、哪里能换一批人上船。若永乐号真与这条暗线相连，沉船便不只是水路事故，也可能是有人在清理一段不能留下的行踪。”",
      unlockKnowledge: ["huitong-river"],
      unlockClues: ["canal-route-fragment"]
    }
  ],
  "su-xiuyun": [
    {
      id: "su-back-door-guests",
      label: "问戏园后门见过哪些船客",
      reply:
        "苏秀云把扇骨轻轻一合，像是在回忆台下的人脸：“戏园后门连着码头小巷，夜里来过漕兵，也来过替商号送信的人。漕兵走路带水气，商号的人鞋底干净，最奇怪的是有个穿船客衣裳的人，袖口却露出账房常用的墨痕。他们不听戏，只借后门避人说话。若说都是一路人，我是不信的。”",
      unlockKnowledge: ["yangzhou-wharf"],
      unlockClues: ["soldier-testimony"]
    },
    {
      id: "su-medicine-source",
      label: "追问药材从何处来",
      reply:
        "她的声音轻了些：“戏班常备跌打药、润喉散，可那味药不在我们的药箱里，苦得发涩。卖药的小厮说是替船上人带的，银钱给得急，也给得重，像怕旁人多问一句。后来我再去找他，摊子已经空了，邻摊只说他天没亮就往北码头走。一个卖药的若只是做买卖，不该走得这样干净。”",
      unlockClues: ["drug-residue"]
    },
    {
      id: "su-wharf-rumor",
      label: "请她复述码头流言",
      reply:
        "苏秀云看向窗外，像怕墙后也有人听：“码头人说，那船沉得太巧。若只怪水急，怎会偏偏在有人换值之后出事？最早放话的人一口咬定是徐州险段吞船，话说得比亲眼见过还顺。我在戏台上学过背词，知道什么叫提前排好的腔。那晚的流言不像风吹出来的，倒像有人先把调子定好了。”",
      unlockKnowledge: ["yangzhou-wharf"],
      unlockClues: ["soldier-testimony"]
    }
  ],
  "zhao-bingfeng": [
    {
      id: "zhao-plank-ledger",
      label: "查看船板采购账目",
      reply:
        "赵秉丰把算盘珠拨得轻响，笑意却没到眼底：“账上写的是上等杉木，验收也盖了印，可码头上谁不晓得，急调的船多半修得仓促。好木料要阴干，要看纹，要等匠人细验；若有人只要文书上好看，拿次木补缺，再让账房把价钱写平，船底自然不会替他守秘密。水一急，账上的上等杉木就露出真相了。”",
      unlockClues: ["broken-hull-plank"]
    },
    {
      id: "zhao-merchant-ships",
      label: "追问商船为何混入官船调度",
      reply:
        "他摊开手，语气像在讲一桩再寻常不过的买卖：“官船不够，商船补上，急运时并不稀奇。稀奇的是哪几条商船能被点名，谁先知道官船短缺，谁又趁夜把租价抬上去。运河上最值钱的从来不只是货，还有消息。永乐号若被塞进这套调度里，船沉之前，已经有人在‘急’字上赚过一轮了。”",
      unlockKnowledge: ["ming-grain-transport", "yangzhou-wharf"]
    },
    {
      id: "zhao-repair-cost",
      label: "逼问他是否压低修船成本",
      reply:
        "赵秉丰终于收了笑，指尖停在算盘上：“压低成本的人未必亲手凿船，可他知道船板薄一分、缆绳旧一寸，到了徐州险段就会多一分险。商人常说省一笔是一笔，可船不是布匹，省坏了还能重裁。若永乐号本就撑不住水势，那压下去的不是银子，是船上人的退路。”",
      unlockKnowledge: ["xuzhou-danger-section"],
      unlockClues: ["broken-hull-plank"]
    }
  ]
};
