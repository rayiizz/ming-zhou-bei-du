import { evidenceCatalog } from "./evidence";
import type { Ending, EndingId, EvidenceId, GameFlags } from "./types";

export const endings: Record<EndingId, Ending> = {
  truth: {
    id: "truth",
    title: "真相大白",
    summary: "顾承认可证据链。漕粮亏空背后的换粮、改账与私运被揭开。"
  },
  unproven: {
    id: "unproven",
    title: "查无实据",
    summary: "沈砚察觉真相却无法证明。亏空被写作损耗，幕后之人仍在河上。"
  },
  scapegoat: {
    id: "scapegoat",
    title: "替罪收场",
    summary: "证据链被污染或过于薄弱，亏粮责任被推到沈砚和船队身上。"
  }
};

export function resolveEnding(evidenceIds: EvidenceId[], flags: GameFlags): EndingId {
  if (flags.acceptedReplacementGrain || flags.trustedFalseLead) {
    return "scapegoat";
  }

  const evidence = evidenceIds.map((id) => evidenceCatalog[id]);
  const hasAccount = evidence.some((item) => item.type === "account");
  const hasPhysical = evidence.some((item) => item.type === "physical");
  const hasWitness = evidence.some((item) => item.type === "witness" && item.reliability !== "可疑");
  const hasKey = evidence.some((item) => item.type === "key");

  if (hasAccount && hasPhysical && hasWitness && hasKey) {
    return "truth";
  }

  return evidenceIds.length > 0 ? "unproven" : "scapegoat";
}
