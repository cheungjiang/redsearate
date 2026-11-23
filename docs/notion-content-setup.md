# Notion 内容库建库与配置

这份文档说明如何把 RedSeaRate 的人写内容迁到 Notion，并让现有部署自动读取。价格库保持不动；内容库是另一个 data source。

## 1. 建 Content 库

在 Notion 里新建一个页面，例如 `RedSeaRate Content`，在页面里新建一个数据库，名称 `RedSeaRate Content`。属性名必须和下面完全一致，大小写和空格都不要改。

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| Title | Title | 是 | 页面 H1；英文约 55 字符，中文约 28 字 |
| Slug | Rich text | 是 | 小写连字符；中英文相同；周报用 `YYYY-MM-DD`，方法页固定 `methodology` |
| Language | Select | 是 | 选项：`en`、`zh` |
| Kind | Select | 是 | 选项：`guide`、`faq`、`brief`、`methodology` |
| Placement | Select | 是 | 选项：`guide`、`home`、`faq`、`methodology`、`brief` |
| Description | Rich text | 是 | 搜索摘要；指南同时作为导语 |
| Lead | Rich text | 否 | 方法页导语；指南可留空 |
| Tags | Multi-select | 否 | 1–2 个标签，例如 `ROUTING`、`CUSTOMS`、`市场观察` |
| Status | Select | 是 | 选项：`draft`、`publish`；只有 `publish` 会进入构建 |
| Published | Date | 否 | 首次发布日期；空则用 Notion 创建日期 |
| Updated | Date | 否 | 最后更新日期；空则用 Notion 最后编辑日期 |
| Order | Number | 否 | 列表排序，越小越靠前 |

正文写在页面 body 里，只使用：

- Heading 2
- Paragraph
- Bulleted list
- Numbered list
- Quote

不要在正文里放图片、表格、嵌入、子页面或 H1。指南 FAQ 放在最后的 H2 `FAQ`（中文页用 `常见问题`），每条用 `Q:` / `A:`（中文用 `问：` / `答：`）两段。详见 `docs/muse-content-writing-guide.md`。

## 2. 建 Backlog 库（可选）

新建数据库 `RedSeaRate Content Backlog`：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| Topic | Title | 选题 |
| Target Keyword | Rich text | 目标关键词 |
| Language | Select | `en` / `zh` |
| Status | Select | `idea` / `drafting` / `review` / `published` |
| Notes | Rich text | 备注 |
| Priority | Select | `P0` / `P1` / `P2` |

Backlog 不参与站点构建，只是给 Muse 和人工排期用。

## 3. 把库接到 Notion integration

1. 打开 Content 数据库页面右上角 `...` → `Connections`，添加和价格库同一个 Notion integration。
2. 打开 Backlog 数据库，同样添加 integration。
3. 确认 integration 有读取权限；seed 导入还需要创建页面的权限。

## 4. 取得 data source ID

现有价格代码用的是 Notion 2025-09-03 的 data source API，不是旧的 database query。Content 库也需要 **data source ID**。

在浏览器里复制数据库页面链接，拿到 32 位 database ID，然后执行：

```sh
curl -sS \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2025-09-03" \
  "https://api.notion.com/v1/databases/<DATABASE_ID>" \
  | jq '.data_sources'
```

返回数组里的 `id` 就是 `NOTION_CONTENT_DATA_SOURCE_ID`。Backlog 同理，得到 `NOTION_BACKLOG_DATA_SOURCE_ID`。

## 5. 配置 GitHub

在 GitHub 仓库：

- `Settings → Secrets and variables → Actions → Secrets`：确认已有 `NOTION_TOKEN`（和价格库共用）。
- `Settings → Secrets and variables → Actions → Variables`：新增 `NOTION_CONTENT_DATA_SOURCE_ID`，值填第 4 步的 data source ID。
- 可选：新增 `NOTION_BACKLOG_DATA_SOURCE_ID`，只给 seed 导入用，不参与部署。
- 如果不想用 Variables，也可以把 `NOTION_CONTENT_DATA_SOURCE_ID` 放进 Secrets；workflow 写成 `vars.NOTION_CONTENT_DATA_SOURCE_ID || secrets.NOTION_CONTENT_DATA_SOURCE_ID`，两种都能读到。

`deploy.yml` 已经把这个变量传给 `npm run fetch-prices`；`fetch-notion.ts` 在价格抓取完成后会调用内容抓取。没有配置变量时，内容抓取会打印 warning 并继续使用已提交快照，不会让部署失败。

## 6. 导入 seed

仓库已经提交：

- `data/content-snapshot.json`：构建兜底快照，72 个文档。
- `data/notion-content-seed.json`：可导入 Notion 的 seed，包含 72 个页面和 6 条 Backlog 示例。

先本地 dry run，确认 payload：

```sh
DRY_RUN=1 npm run import-content-seed
```

再导入到 Notion：

```sh
NOTION_TOKEN=... \
NOTION_CONTENT_DATA_SOURCE_ID=... \
NOTION_BACKLOG_DATA_SOURCE_ID=... \
npm run import-content-seed
```

脚本会先查现有页面，按 `Kind + Slug + Language` 跳过已存在的文档；Backlog 按 `Topic + Language` 跳过。可以重复运行，不会重复创建同一篇。

Seed 里的 72 个页面都是 `publish`，因为它们对应已经上线并审过的现有内容。Muse 之后新写的内容必须是 `draft`，人工审核后再改 `publish`。

**迁移完成后不要再随手运行 `npm run export-content-seed`**：它会用代码里的 seed 重写 `data/content-snapshot.json`，把 Notion 上已经改过的内容覆盖回旧版。只有在明确要从代码重新生成 seed 时才运行它。要更新兜底快照，先跑 `npm run fetch-content` 验证 `.data/notion-content.json`，再把它复制为 `data/content-snapshot.json` 并提交。

## 7. 本地验证内容抓取

```sh
NOTION_TOKEN=... \
NOTION_CONTENT_DATA_SOURCE_ID=... \
npm run fetch-content
```

成功时会写 `.data/notion-content.json`。然后：

```sh
npm test
npm run typecheck
npm run build
```

构建会优先读 `.data/notion-content.json`；文件不存在、JSON 无效或没有 publish 文档时，自动读 `data/content-snapshot.json`。

## 8. 发布流程

1. Muse 在 Content 库写 `draft`。
2. 人审事实、数字、单证、链接和中英文配对。
3. 人把 Status 改成 `publish`。
4. 现有 `Deploy to GitHub Pages` 每 10 分钟跑一次：`npm run fetch-prices` 会同时抓价格和内容，然后构建、部署。
5. 不需要改代码，也不需要手动加页面；指南、FAQ、方法页和周报叙述都从 Notion 读取。

## 9. 常见问题

**页面没更新？**
先看 Actions 的 `Deploy to GitHub Pages` 日志里有没有 `Notion content: ... documents written`。如果看到 `NOTION_CONTENT_DATA_SOURCE_ID is not set`，说明仓库变量没配；如果看到 `Notion content fetch failed`，构建会继续用快照，站点不会挂，但内容不会更新。

**某篇指南没出现？**
检查：Status 是否 `publish`；Slug 是否中英文相同；Kind/Placement 是否正确；正文是否有支持的块；中英文 H2 数量和顺序是否大致一致。结构差太多时，代码会跳过该篇，避免中英文错位。

**FAQ 没出现？**
首页 FAQ 需要 `Kind=faq`、`Placement=home`；FAQ 页需要 `Kind=faq`、`Placement=faq`。指南里的 FAQ 必须放在 H2 `FAQ` / `常见问题` 下，并使用 `Q:/A:` 或 `问：/答：`。

**周报叙述没出现？**
`Kind=brief`，`Slug` 必须是该期日期（例如 `2026-11-30`），`Language` 为 `en` 或 `zh`，Status 为 `publish`。周报数字仍来自 `data/market-brief/YYYY-MM-DD.json`，Notion 只提供叙述。

**价格会不会被内容库影响？**
不会。价格仍走原来的 `RedSeaRate 报价库` 和 `lib/notion-prices.ts`，内容库只读 `RedSeaRate Content`。

## 10. 安全边界

- `NOTION_TOKEN` 只放在 GitHub Secrets 或本地环境，不要写进代码、不要用 `NEXT_PUBLIC_`。
- Content 库和 Backlog 库只给需要的 integration 授权。
- 技术 SEO 字段不由 Notion 控制；canonical、hreflang、sitemap、JSON-LD 仍由 `lib/seo.ts` 和路由代码生成。
