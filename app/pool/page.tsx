import { connection } from "next/server";
import { listEntries } from "../../lib/db";
import {
  destinations,
  origins,
  shanghaiDate,
  summarize,
  MIN_MARKET_SAMPLES,
  MARKET_WINDOW_DAYS,
} from "../../lib/rates";
import { isMember, removePrice, signOut } from "./actions";
import { PriceForm, SignIn } from "./forms";

const zh = (id: string) =>
  [...origins, ...destinations].find((p) => p.id === id)?.zh ?? id;
const tierName = {
  offer: "本站报价",
  market: "市场价",
  internal: "内部底价",
} as const;

export default async function PoolPage() {
  await connection();
  const member = await isMember();
  const today = shanghaiDate();
  const entries = member ? listEntries() : [];
  const lanes = Object.entries(summarize(entries, today).lanes);
  return (
    <main className="pool wrap">
      <header className="pool-head">
        <a href="/zh" className="brand">
          <span className="brand-symbol">≈</span>
          <span>
            RedSeaRate
          </span>
        </a>
        {member && (
          <form action={signOut}>
            <button className="text-button">退出</button>
          </form>
        )}
      </header>
      <h1>团队价格池</h1>
      <p className="pool-lede">
        把收到的市场价、能做的价格和底价都放进来。网站只显示「本站报价」和满{" "}
        {MIN_MARKET_SAMPLES} 条近 {MARKET_WINDOW_DAYS}{" "}
        天有效市场价的统计，单条市场价、来源、备注和内部底价都不会公开。过期价格自动失效。
      </p>
      {!member ? (
        <SignIn />
      ) : (
        <>
          <PriceForm today={today} />
          <section className="pool-section">
            <h2>网站当前显示</h2>
            {lanes.length ? (
              <table className="pool-table">
                <thead>
                  <tr>
                    <th>航线</th>
                    <th>柜型</th>
                    <th>本站报价</th>
                    <th>市场参考</th>
                  </tr>
                </thead>
                <tbody>
                  {lanes.map(([key, lane]) => {
                    const [o, d, c] = key.split("|");
                    return (
                      <tr key={key}>
                        <td>
                          {zh(o)} → {zh(d)}
                        </td>
                        <td>{c}</td>
                        <td>
                          {lane.offer
                            ? `$${lane.offer.low}${lane.offer.high !== lane.offer.low ? `–${lane.offer.high}` : ""}（至 ${lane.offer.validUntil}）`
                            : "请询价"}
                        </td>
                        <td>
                          {lane.market
                            ? `中位 $${lane.market.median} · ${lane.market.count} 条`
                            : `不足 ${MIN_MARKET_SAMPLES} 条`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="pool-empty">
                还没有可公开的价格，网站各航线显示「请询价」。
              </p>
            )}
          </section>
          <section className="pool-section">
            <h2>
              全部记录 <small>{entries.length} 条</small>
            </h2>
            {entries.length ? (
              <div className="pool-scroll">
                <table className="pool-table">
                  <thead>
                    <tr>
                      <th>录入</th>
                      <th>类型</th>
                      <th>航线</th>
                      <th>柜型</th>
                      <th>USD</th>
                      <th>有效至</th>
                      <th>来源 / 备注</th>
                      <th>录入人</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr
                        key={e.id}
                        className={e.validUntil < today ? "expired" : ""}
                      >
                        <td>{shanghaiDate(new Date(e.createdAt))}</td>
                        <td>
                          <span className={`tier tier-${e.tier}`}>
                            {tierName[e.tier]}
                          </span>
                        </td>
                        <td>
                          {zh(e.origin)} → {zh(e.destination)}
                        </td>
                        <td>{e.container}</td>
                        <td>{e.price}</td>
                        <td>
                          {e.validUntil}
                          {e.validUntil < today && " 已过期"}
                        </td>
                        <td>
                          {[e.source, e.note].filter(Boolean).join(" · ")}
                        </td>
                        <td>{e.submittedBy}</td>
                        <td>
                          <form action={removePrice}>
                            <input type="hidden" name="id" value={e.id} />
                            <button
                              className="text-button"
                              aria-label={`删除第 ${e.id} 条`}
                            >
                              删除
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="pool-empty">价格池还是空的。</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
