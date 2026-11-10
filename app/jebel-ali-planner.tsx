"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MessageCircle } from "lucide-react";
import { jebelAliInquiryText } from "../lib/inquiry";
import { pickWhatsapp, whatsappUrl } from "../lib/whatsapp";
import { InquiryDialog } from "./inquiry-dialog";

type Origin = { id: string; name: string; etd: string };
type Container = "20GP" | "40GP" | "40HQ";
type Lane = { origin: string; container: Container; price: number | null };

export function JebelAliPlanner({
  lang,
  origins,
  lanes,
  transitDays,
  direct,
  carrier,
  whatsapp,
  ratesHref,
}: {
  lang: "en" | "zh";
  origins: Origin[];
  lanes: Lane[];
  transitDays: number;
  direct: boolean;
  carrier: string;
  whatsapp: string[];
  ratesHref: string;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const [tab, setTab] = useState<"quote" | "sailings">("quote");
  const [origin, setOrigin] = useState(origins[0]?.id ?? "");
  const [container, setContainer] = useState<Container>("40HQ");
  const [quantity, setQuantity] = useState(1);
  const [cargo, setCargo] = useState("");
  const [copied, setCopied] = useState("");
  const [assigned, setAssigned] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const whatsappNumber = assigned.replace(/\D/g, "");
  const selected = origins.find((row) => row.id === origin) ?? origins[0];
  const lanePrice = (id: string, box: Container) =>
    lanes.find((lane) => lane.origin === id && lane.container === box)?.price ?? null;
  const price = selected ? lanePrice(selected.id, container) : null;
  const money = price == null ? "" : "US$" + price.toLocaleString("en-US");
  const moneyOf = (amount: number | null) => (amount == null ? t("On request", "请询价") : "US$" + amount.toLocaleString("en-US"));
  const facts = { transitDays, direct, carrier };
  const inquiryText = jebelAliInquiryText(
    lang,
    cargo,
    facts,
    selected
      ? { origin: selected.name, container, quantity, etd: selected.etd, price }
      : undefined,
  );
  const others = origins.filter((row) => row.id !== selected?.id);
  function chooseTab(next: "quote" | "sailings") {
    setTab(next);
    document.getElementById(next === "quote" ? "jebel-tab-quote" : "jebel-tab-sailings")?.focus();
  }
  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopied(t("Copied. Paste it into WeChat.", "已复制，粘贴到微信发给我们。"));
    } catch {
      setCopied(t("Copy failed. Select the text above.", "复制失败，请手动选择上方文字。"));
    }
  }
  return (
    <div className="jebel-card">
      <div
        className="jebel-tabs"
        role="tablist"
        aria-label={t("Quote or sailings", "估价或船期")}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          chooseTab(tab === "quote" ? "sailings" : "quote");
        }}
      >
        <button id="jebel-tab-quote" role="tab" type="button" aria-selected={tab === "quote"} aria-controls="jebel-panel-quote" tabIndex={tab === "quote" ? 0 : -1} onClick={() => setTab("quote")}>
          {t("Get a quote", "获取估价")}
        </button>
        <button id="jebel-tab-sailings" role="tab" type="button" aria-selected={tab === "sailings"} aria-controls="jebel-panel-sailings" tabIndex={tab === "sailings" ? 0 : -1} onClick={() => setTab("sailings")}>
          {t("Route and sailings", "航线与船期")}
        </button>
      </div>

      <div id="jebel-panel-quote" role="tabpanel" aria-labelledby="jebel-tab-quote" hidden={tab !== "quote"}>
        <form
          className="jebel-form"
          onSubmit={(event) => {
            event.preventDefault();
            flushSync(() => {
              setAssigned(pickWhatsapp(whatsapp));
              setCopied("");
            });
            dialog.current?.showModal();
          }}
        >
          <label>
            <span>{t("Origin port", "起运港")}</span>
            <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
              {origins.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
            </select>
          </label>
          <label>
            <span>{t("Destination", "目的港")}</span>
            <input value={t("Jebel Ali", "杰贝阿里")} readOnly aria-readonly="true" />
          </label>
          <div className="jebel-pair">
            <label>
              <span>{t("Container", "柜型")}</span>
              <select value={container} onChange={(event) => setContainer(event.target.value as Container)}>
                <option value="20GP">20GP</option>
                <option value="40GP">40GP</option>
                <option value="40HQ">40HQ</option>
              </select>
            </label>
            <label>
              <span>{t("Quantity", "数量")}</span>
              <input
                type="number"
                min={1}
                max={40}
                value={quantity}
                onChange={(event) => setQuantity(Math.min(40, Math.max(1, Number(event.target.value) || 1)))}
              />
            </label>
          </div>
          <button className="button coral jebel-quote-button" type="submit">
            {t("Get a quote", "获取估价")}
          </button>
          {whatsapp.length > 0 && (
            <button
              type="button"
              className="button whatsapp jebel-quote-button"
              onClick={() => {
                const url = whatsappUrl(pickWhatsapp(whatsapp), inquiryText);
                if (url) window.open(url, "_blank", "noopener");
              }}
            >
              <MessageCircle size={16} />
              {t("Ask on WhatsApp", "WhatsApp 询价")}
            </button>
          )}
        </form>

        <div className="jebel-result" aria-live="polite">
          <span>{t("This sailing", "这一班船")}</span>
          <strong className="jebel-money">{price == null ? t("Ask for this container", "该柜型请询价") : money}</strong>
          {selected && <p>{selected.name} · {container} · ETD {selected.etd}</p>}
          <p className="jebel-fine">
            {t(
              "Figure for this ETD, not the market median below.",
              "这一水的页面价格，不是下方的市场中位数。",
            )}
          </p>
        </div>

        {others.length > 0 && (
          <div className="jebel-others">
            <h2>{t("Other origins", "其他起运港")}</h2>
            <ul>
              {others.map((row) => (
                <li key={row.id}>
                  <button type="button" onClick={() => setOrigin(row.id)}>
                    <span>{row.name}</span>
                    <span>40HQ · {moneyOf(lanePrice(row.id, "40HQ"))} · ETD {row.etd}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <a className="jebel-rates" href={ratesHref}>{t("See all rates", "查看全部运价")}</a>
      </div>

      <div id="jebel-panel-sailings" role="tabpanel" aria-labelledby="jebel-tab-sailings" hidden={tab !== "sailings"}>
        <div className="rates-scroll" tabIndex={0} role="region" aria-label={t("Jebel Ali sailings", "杰贝阿里船期")}>
          <table className="country-table">
            <thead>
              <tr>
                <th scope="col">{t("Origin port", "起运港")}</th>
                <th scope="col">ETD</th>
                <th scope="col">40HQ</th>
              </tr>
            </thead>
            <tbody>
              {origins.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td><time dateTime={row.etd}>{row.etd}</time></td>
                  <td>{moneyOf(lanePrice(row.id, "40HQ"))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="jebel-fine">
          {t(
            `Transit ${transitDays} days, no transshipment, carrier ${carrier}.`,
            `航程 ${transitDays} 天，不中转，船公司 ${carrier}。`,
          )}
        </p>
      </div>

      <InquiryDialog
        lang={lang}
        intent="quote"
        inquiryText={inquiryText}
        cargo={cargo}
        onCargo={setCargo}
        copied={copied}
        onCopy={() => void copyInquiry()}
        whatsappLabel={assigned}
        whatsappNumber={whatsappNumber}
        dialogRef={dialog}
      />
    </div>
  );
}
