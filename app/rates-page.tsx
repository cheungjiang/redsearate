"use client";

import { ArrowLeft } from "lucide-react";
import { type IndexEntry, type SimulationPreview } from "../lib/platform";
import type { JebelAliReference } from "../lib/jebel-ali-prices";
import { defaultShipment, type Snapshot } from "../lib/rates";
import { IndexSnapshot, RatesPreview } from "./platform-sections";
import SubpageShell from "./subpage-shell";

export default function RatesPage({
  lang, snapshot, index, summary, simulation, jebelAli,
}: {
  lang: "en" | "zh";
  snapshot: Snapshot;
  index: IndexEntry[];
  summary: string[];
  simulation: SimulationPreview | null;
  jebelAli: JebelAliReference[];
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  return (
    <SubpageShell lang={lang} className="rates-page" current="rates" languageHref={zh ? "/rates/" : "/zh/rates/"}>
      <div className="rates-page-intro wrap">
        <a className="text-button" href={zh ? "/zh/" : "/"}><ArrowLeft size={16} />{t("Back to homepage", "返回首页")}</a>
        <h1>{t("China to Red Sea freight rates", "中国至红海海运运价")}</h1>
        <ul className="market-summary">
          {summary.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </div>
      <IndexSnapshot lang={lang} liveEntries={index} demoEntries={simulation?.index ?? null} asOf={snapshot.today} />
      <RatesPreview lang={lang} snapshot={snapshot} shipment={defaultShipment} samples={simulation?.rates ?? []} jebelAli={jebelAli} fullPage />
    </SubpageShell>
  );
}
