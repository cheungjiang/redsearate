import SubpageShell from "./subpage-shell";

export default function PrivacyPage({ lang }: { lang: "en" | "zh" }) {
  const zh = lang === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const home = zh ? "/zh/" : "/";
  return (
    <SubpageShell lang={lang} className="guide-page" languageHref={zh ? "/privacy/" : "/zh/privacy/"}>
      <article className="guide-article wrap">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb", "面包屑导航")}>
          <a href={home}>{t("Home", "首页")}</a>{" / "}<span>{t("Privacy & data", "隐私与数据")}</span>
        </nav>
        <h1>{t("Privacy & data", "隐私与数据")}</h1>
        <p className="guide-meta">{t("Updated", "更新日期")} <time dateTime="2026-11-24">2026-11-24</time></p>
        <p>{t(
          "You can read rates, use the estimator and browse guides without an account or an email address. Newsletter signup is separate and optional.",
          "查看运价、估算运费和阅读指南都无需注册或提供邮箱。邮件周报单独订阅，不订阅也不影响使用网站。",
        )}</p>

        <h2>{t("The weekly email", "关于邮件周报")}</h2>
        <p>{t(
          "The subscribe button opens RedSeaRate's publication on Substack. Your email goes directly to Substack, which hosts the subscriber list and delivers our free weekly market brief. RedSeaRate can access subscriber details to manage this publication. Both site languages currently lead to the same English-language publication; using the Chinese site does not select a separate Chinese email edition.",
          "订阅按钮会带您前往 RedSeaRate 的 Substack 刊物。邮箱直接提交给 Substack，由该平台托管订阅名单并发送免费市场周报。RedSeaRate 可访问管理本刊所需的订阅资料。目前中英文网站入口均指向同一英文刊物，使用中文网站不会自动订阅独立的中文版邮件。",
        )}</p>
        <p>{t(
          "By subscribing, you ask to receive our weekly market brief, including links to current rates and our quote service. Read the signup notices and complete any verification steps Substack shows or emails to you. We do not sell the subscriber list or use it to sign you up for unrelated marketing. Subscription addresses are not stored in this site's repository or static pages.",
          "订阅用于接收市场周报，邮件中会包含当前运价和本站询价服务的链接。请阅读订阅页说明，并按 Substack 页面或邮件提示完成验证。我们不出售订阅名单，也不将邮箱用于未经同意的无关营销。订阅邮箱不会写入本站代码仓库或静态页面。",
        )}</p>
        <p>{t(
          "Substack is based in the United States and uses service providers in the US and other countries, so subscription data may be processed outside China. Its service may collect technical and usage information, including IP addresses, cookies and email engagement data, under its own privacy policy. Read that policy and the signup notices before subscribing. No Substack script or form is loaded while you browse this site; you choose whether to visit the external signup page.",
          "Substack 总部位于美国，并使用美国及其他国家的服务商，订阅数据可能在中国境外处理。该平台可能按其隐私政策收集 IP 地址、Cookie 和邮件互动记录等技术及使用信息。订阅前请阅读平台隐私政策及页面提示。浏览本站时不会加载 Substack 的脚本或表单，由您自行选择是否前往外部订阅页。",
        )}</p>
        <p><a href="https://substack.com/privacy" rel="noreferrer">{t("Substack privacy policy", "Substack 隐私政策")}</a></p>

        <h2>{t("Unsubscribe or request deletion", "退订与删除资料")}</h2>
        <p>{t(
          "Every newsletter includes an unsubscribe link. You can also contact us through WeChat or WhatsApp from the homepage to request access, correction or deletion of your subscription data. We keep subscription information while you are subscribed; after an unsubscribe or deletion request, only records needed to respect your opt-out or meet applicable obligations may be retained. Unsubscribing does not restrict access to the website.",
          "每封周报都附有退订链接。您也可以通过首页的微信或 WhatsApp 联系我们，申请查看、更正或删除订阅资料。订阅期间保留发送周报所需的信息；退订或申请删除后，可能仅保留为遵守退订意愿或适用义务所必需的记录。退订不影响继续浏览本站。",
        )}</p>

        <h2>{t("Browsing and freight inquiries", "浏览与海运询价")}</h2>
        <p>{t(
          "This site uses no analytics or advertising cookies. The hosting provider may process technical request logs to serve and secure the site. If you contact us, the conversation is handled in WeChat or WhatsApp under those services' terms. Public market prices do not identify their individual sources.",
          "本站不使用统计或广告 Cookie。托管服务商可能为提供和保护网站而处理技术访问日志。通过微信或 WhatsApp 联系我们时，消息由相应平台按其条款处理。公开市场运价不展示单条报价的来源身份。",
        )}</p>
        <p><a className="text-button" href={`${home}#estimate`}>{t("Contact us about your data", "就个人资料问题联系我们")}</a></p>
      </article>
    </SubpageShell>
  );
}
