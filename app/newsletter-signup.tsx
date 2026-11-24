import { ArrowRight, ArrowUpRight } from "lucide-react";
import { newsletterUrl } from "../lib/newsletter";

export default function NewsletterSignup({ lang }: { lang: "en" | "zh" }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const signup = newsletterUrl(lang);
  const archive = zh ? "/zh/market-brief/" : "/market-brief/";
  return (
    <section id="newsletter" className="newsletter-signup wrap" aria-labelledby="newsletter-title">
      <div className="newsletter-panel">
        <div className="newsletter-copy">
          <h2 id="newsletter-title">{t("The Red Sea, once a week.", "红海运价，每周看清。")}</h2>
          <p>{t(
            "Five ports. Rate movements, quote counts and what they mean for your next shipment. A free weekly brief, in English.",
            "吉达、苏赫纳、亚喀巴、吉布提、苏丹港。看运价涨跌、报价样本和出运时该留意的变化，每周整理成一封英文简报，免费订阅。",
          )}</p>
        </div>
        <div className="newsletter-actions">
          {signup ? (
            <>
              <a className="button coral" href={signup} rel="noreferrer">
                {t("Subscribe free on Substack", "前往 Substack 免费订阅")}<ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <p>{t(
                "One English-language brief a week. Follow any email confirmation steps on Substack. Unsubscribe anytime.",
                "在 Substack 填写邮箱，按提示完成订阅。中英文入口均订阅同一英文刊物，可随时退订。",
              )}</p>
            </>
          ) : (
            <p className="newsletter-pending">{t(
              "Email subscriptions are not open yet. Read the weekly brief online for now.",
              "邮件订阅即将开放，您可以先在线阅读每周简报。",
            )}</p>
          )}
          <div className="newsletter-links">
            <a href={archive}>{t("Read past issues", "先看往期简报")}<ArrowRight size={14} aria-hidden="true" /></a>
            <a href={zh ? "/zh/privacy/" : "/privacy/"}>{t("Privacy & data", "隐私与数据")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
