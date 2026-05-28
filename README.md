# 明舟北渡

《明舟北渡》是一个以明代大运河为背景的网页对话游戏 Demo。当前版本以“永乐号沉船案”为完整可玩案卷，玩家从案卷馆进入事件，通过 NPC 问询、建议选项、自由输入和知识卡归档推进调查，最后形成案卷判断并生成旅程总结。

## Run

```powershell
corepack pnpm install
corepack pnpm dev
```

打开命令行输出的本地地址即可游玩。当前调试时也可使用：

```powershell
corepack pnpm dev --host 127.0.0.1 --port 5175
```

## Test

```powershell
corepack pnpm test
corepack pnpm build
```

## AI Endpoint

自由问询会优先请求 `VITE_AI_ENDPOINT`，未配置或请求失败时会自动回退到本地离线回复，因此 Demo 不依赖后端也能完整展示。

```powershell
$env:VITE_AI_ENDPOINT="http://127.0.0.1:8787/api/ai/dialogue"
corepack pnpm dev
```

接口期望返回：

```json
{
  "npcReply": "角色回复文本",
  "suggestions": [
    {
      "id": "choice-id",
      "label": "建议选项",
      "reply": "选择后的 NPC 回复",
      "unlockKnowledge": ["ming-grain-transport"],
      "unlockClues": ["grain-transport-order"]
    }
  ],
  "triggeredKnowledge": [],
  "triggeredClues": []
}
```

## Demo Scope

- 大运河案卷馆：首页提供 1 个完整可玩案卷和 2 个可扩展样例。
- 永乐号沉船案：围绕漕粮北运、迁都北京、徐州险段和船只征调展开。
- NPC 问询：可切换督运官、漕兵、织造府相关人物、戏园女子、粮商。
- AI 衍生对话：支持建议选项和自由输入，离线回退保证演示稳定。
- 知识图鉴：归档大运河知识卡、线索卡和人物档案。
- 旅程总结：根据玩家选择生成最终案卷判断。
