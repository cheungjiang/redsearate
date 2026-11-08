"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { jebelAliInquiryText } from "../lib/inquiry";
import { InquiryDialog } from "./inquiry-dialog";
import { useAssignedWhatsapp } from "./use-assigned-whatsapp";

export function JebelAliCta({
  lang,
  transitDays,
  direct,
  carrier,
  wechat,
  whatsapp,
}: {
  lang: "en" | "zh";
  transitDays: number;
  direct: boolean;
  carrier: string;
  wechat: string;
  whatsapp: string[];
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const [cargo, setCargo] = useState("");
  const [copied, setCopied] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const assigned = useAssignedWhatsapp(whatsapp);
  const inquiryText = jebelAliInquiryText(lang, cargo, { transitDays, direct, carrier });
  const whatsappNumber = assigned.replace(/\D/g, "");
  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopied(t("Copied. Paste it into WeChat.", "已复制，粘贴到微信发给我们。"));
    } catch {
      setCopied(t("Copy failed. Select the text above.", "复制失败，请手动选择上方文字。"));
    }
  }
  return (
    <>
      <section className="cta-section wrap">
        <div>
          <div className="eyebrow">{t("ASK ABOUT THIS SAILING", "问这一水船期")}</div>
          <h2>{t("Ask about this sailing.", "问这一水船期。")}</h2>
          <p>
            {t(
              `WeChat ${wechat}, or WhatsApp. Send the origin port and the cargo-ready date. Space is confirmed only after we reply.`,
              `微信 ${wechat}，或 WhatsApp。把起运港和货好时间发过来。舱位以确认后为准。`,
            )}
          </p>
        </div>
        <div>
          <button
            className="button coral"
            onClick={() => {
              setCopied("");
              dialog.current?.showModal();
            }}
          >
            {t("Get a quote for this sailing", "获取这一水的报价")}
            <ArrowUpRight size={18} />
          </button>
          <span>{t("Nothing is held before we confirm.", "确认前不锁舱。")}</span>
        </div>
      </section>
      <InquiryDialog
        lang={lang}
        intent="quote"
        inquiryText={inquiryText}
        cargo={cargo}
        onCargo={setCargo}
        copied={copied}
        onCopy={() => void copyInquiry()}
        wechat={wechat}
        whatsappLabel={assigned}
        whatsappNumber={whatsappNumber}
        dialogRef={dialog}
      />
    </>
  );
}
