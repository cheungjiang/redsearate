"use client";

import type { ReactNode, RefObject } from "react";
import { Copy, MessageCircle, X } from "lucide-react";

export function InquiryDialog({
  lang,
  intent,
  inquiryText,
  cargo,
  onCargo,
  copied,
  onCopy,
  wechat,
  whatsappLabel,
  whatsappNumber,
  children,
  dialogRef,
}: {
  lang: "en" | "zh";
  intent: "quote" | "booking";
  inquiryText: string;
  cargo: string;
  onCargo: (value: string) => void;
  copied: string;
  onCopy: () => void;
  wechat: string;
  whatsappLabel: string;
  whatsappNumber: string;
  children?: ReactNode;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  return (
    <dialog
      ref={dialogRef}
      className="inquiry-dialog"
      aria-labelledby="inquiry-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      <button
        className="dialog-close"
        aria-label={t("Close dialog", "关闭窗口")}
        onClick={() => dialogRef.current?.close()}
      >
        <X size={21} />
      </button>
      <div className="eyebrow">
        {t("LET’S TALK FREIGHT", "聊聊您的出运计划")}
      </div>
      <h2 id="inquiry-title">
        {intent === "quote"
          ? t("Send us your inquiry.", "把询价发给我们。")
          : t("Send us your booking request.", "把订舱需求发给我们。")}
      </h2>
      <p className="dialog-intro">
        {t(
          "Share your shipment details on WeChat or WhatsApp for a tailored quote.",
          "通过微信或 WhatsApp 发送出运信息，与团队确认专属报价。",
        )}
      </p>
      {children}
      <label>
        {t("Cargo (optional)", "品名（选填）")}
        <input
          value={cargo}
          maxLength={120}
          onChange={(e) => onCargo(e.target.value)}
          placeholder={t("e.g. furniture, 18 t", "例如：办公家具，18 吨")}
        />
      </label>
      <pre className="inquiry-text">{inquiryText}</pre>
      <div className="contact-actions">
        <div className="contact-option">
          <span>
            {t("WeChat", "微信")} <b>{wechat}</b>
          </span>
          <button className="button dark" onClick={onCopy}>
            <Copy size={16} />
            {t("Copy for WeChat", "复制发微信")}
          </button>
        </div>
        {whatsappNumber && (
          <div className="contact-option">
            <span>
              WhatsApp <b>{whatsappLabel}</b>
            </span>
            <a
              className="button whatsapp"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiryText)}`}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle size={16} />
              {t("Open WhatsApp", "打开 WhatsApp")}
            </a>
          </div>
        )}
      </div>
      <p className="copy-status" role="status">
        {copied}
      </p>
      <p className="fine-print">
        {t(
          "Nothing is sent or stored by this website. Space is reserved only after we confirm with you.",
          "本网站不发送也不保存任何信息。我们与您确认后，舱位才算预留。",
        )}
      </p>
    </dialog>
  );
}
