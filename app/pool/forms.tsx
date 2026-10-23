"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { signIn, submitPrice } from "./actions";
import { containers, destinations, origins } from "../../lib/rates";

export function SignIn() {
  const [error, action, pending] = useActionState(signIn, "");
  return (
    <form action={action} className="pool-card pool-signin">
      <label>
        团队访问密钥
        <input
          name="key"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="button dark" disabled={pending}>
        {pending ? "验证中…" : "进入价格池"}
      </button>
    </form>
  );
}

export function PriceForm({ today }: { today: string }) {
  // A fresh object per submission, so two successes in a row both clear the form.
  const [result, action, pending] = useActionState(
    async (_: { message: string }, data: FormData) => ({
      message: await submitPrice("", data),
    }),
    { message: "" },
  );
  const state = result.message;
  const form = useRef<HTMLFormElement>(null);
  const nameKey = "pool-submitted-by";
  useEffect(() => {
    const input = form.current?.elements.namedItem(
      "submittedBy",
    ) as HTMLInputElement | null;
    if (input && !input.value)
      input.value = localStorage.getItem(nameKey) ?? "";
  }, []);
  useEffect(() => {
    if (state !== "ok" || !form.current) return;
    const keep = [
      "tier",
      "origin",
      "destination",
      "container",
      "validUntil",
      "submittedBy",
      "source",
    ];
    for (const el of Array.from(form.current.elements) as HTMLInputElement[])
      if (el.name && !keep.includes(el.name)) el.value = "";
    (form.current.elements.namedItem("price") as HTMLInputElement).focus();
  }, [result]);
  return (
    <form
      ref={form}
      className="pool-card pool-form"
      onSubmit={(e) => {
        // Submitting through `action={...}` makes React reset every field,
        // even when the server rejects the entry. Dispatch manually instead;
        // the effect above clears only the per-price fields after a success.
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        localStorage.setItem(nameKey, String(data.get("submittedBy")));
        startTransition(() => action(data));
      }}
    >
      <fieldset className="tier-choice">
        <legend>价格类型</legend>
        <label>
          <input type="radio" name="tier" value="market" defaultChecked />
          <span>
            <b>市场价</b>
            同行、船司、客户转来的报价。同航线柜型满 5 条近 28
            天有效报价后，只公开中位数。
          </span>
        </label>
        <label>
          <input type="radio" name="tier" value="offer" />
          <span>
            <b>本站报价</b>我们确定能订到、愿意公开的价格。会直接显示在网站上。
          </span>
        </label>
        <label>
          <input type="radio" name="tier" value="internal" />
          <span>
            <b>内部底价</b>采购价、同行底价。永远不公开，只在这里可见。
          </span>
        </label>
      </fieldset>
      <div className="pool-grid">
        <label>
          起运港
          <select name="origin" required>
            {origins.map((p) => (
              <option key={p.id} value={p.id}>
                {p.zh}
              </option>
            ))}
          </select>
        </label>
        <label>
          目的港
          <select name="destination" required>
            {destinations.map((p) => (
              <option key={p.id} value={p.id}>
                {p.zh}
              </option>
            ))}
          </select>
        </label>
        <label>
          柜型
          <select name="container" defaultValue="40HC" required>
            {containers.map((c) => (
              <option key={c} value={c}>
                {c === "LCL" ? "拼箱（每 W/M）" : c}
              </option>
            ))}
          </select>
        </label>
        <label>
          海运费 USD
          <input
            name="price"
            type="number"
            min="1"
            max="50000"
            step="1"
            inputMode="decimal"
            required
          />
        </label>
        <label>
          有效期至
          <input name="validUntil" type="date" min={today} required />
        </label>
        <label>
          航程（天，选填）
          <span className="pool-pair">
            <input
              name="transitMin"
              type="number"
              min="1"
              max="119"
              placeholder="最短"
            />
            <input
              name="transitMax"
              type="number"
              min="1"
              max="119"
              placeholder="最长"
            />
          </span>
        </label>
        <label>
          来源（仅团队可见）
          <input
            name="source"
            maxLength={80}
            placeholder="例如：同行 A、船司 MSC、客户转发"
          />
        </label>
        <label>
          录入人
          <input name="submittedBy" maxLength={40} required />
        </label>
      </div>
      <label>
        备注（仅团队可见）
        <textarea
          name="note"
          rows={2}
          maxLength={300}
          placeholder="是否含 BAF、PSS、战险等，船期、舱位情况"
        />
      </label>
      <p className="pool-hint">
        价格都是港到港海运费：整柜按每柜，拼箱按每
        W/M。只填含同样费用的价格，口径不同请写在备注里。
      </p>
      {state && state !== "ok" && (
        <p role="alert" className="form-error">
          {state}
        </p>
      )}
      {state === "ok" && (
        <p role="status" className="pool-ok">
          已加入价格池，网站已更新。
        </p>
      )}
      <button className="button coral" disabled={pending}>
        {pending ? "保存中…" : "加入价格池"}
      </button>
    </form>
  );
}
