# Mamo Check-in Rule Guide · 规则指南

Declarative JSON packages that help Mamo Check-in locate attendance images inside already verified Gmail messages, Moodle posts and Ed discussions. Rules are data, not scripts: they cannot change identity checks, OCR, attendance submission or built-in rules.

[English](#english) | [中文](#中文) | [Offline demo walkthrough](docs/demo.html) | [Catalogue](catalog.json)

**Official automatic updates:** Compatible builds now support a separate [signed official rule channel](official/README.md). This does not automatically install or update shared/local packages. / **官方自动更新：** 支持此功能的扩展可使用独立的[签名官方规则通道](official/README.md)，不会自动安装或更新共享、本地规则。

## English

### Status and Demos

These examples target [Mamo Check-in 2.0.0](https://github.com/mxymalay/mamo-checkin/releases/tag/v2.0.0) and compatible source-rule builds. The Chrome Web Store follows its separate review process and may have an older version. All examples are **synthetic demos**, not verified real-course adaptations. Samples use only `DEMO1000` and `DEMO2000`, with no usable attendance codes or private messages.

| Package | Source / courses | Demonstrates | Fixtures |
| --- | --- | --- | --- |
| [demo-gmail.json](examples/DEMO1000/demo-gmail.json) | Gmail / DEMO1000 | `.summary img` with dimension limits | [7 cases](fixtures/demo-gmail/) |
| [demo-moodle.json](examples/DEMO1000/demo-moodle.json) | Moodle / DEMO1000 | Literal navigation/context keywords and author-image exclusion | [7 cases](fixtures/demo-moodle/) |
| [demo-ed.json](examples/DEMO1000/demo-ed.json) | Ed / DEMO1000 | Images plus existing Ed attachment-link selectors | [7 cases](fixtures/demo-ed/) |
| [demo-shared-gmail.json](examples/shared/demo-shared-gmail.json) | Gmail / DEMO1000, DEMO2000 | One layout shared by two explicitly listed courses | [9 cases](fixtures/demo-shared-gmail/) |

The canonical example IDs are `community.example.gmail-images`, `community.example.moodle-images`, `community.example.ed-images` and `community.example.shared-gmail-images`. Old IDs have no aliases or automatic migration; invalid installed copies can be removed and reimported. Course folders, DEMO1000/DEMO2000 course identifiers and selectors are unchanged. The shared demo tests both courses, empty/unverified-course rejection and author-image exclusion. Single-course demos reject DEMO2000 as the wrong course. Every demo covers missing images, decoration, quoted content, separate messages and prohibited hosts. Ed attachment selectors illustrate the allowed format; these fixtures do not prove actual attachment downloads or OCR.

Open [docs/demo.html](docs/demo.html) from a local checkout for an English/Chinese walkthrough. It is a static offline explanation, not an extension screenshot or live attendance page. No scripts, remote images, forms, login or submission are involved.

### Find, Import and Choose

Examples are grouped under `examples/DEMO1000/`; rules supporting multiple courses live under `examples/shared/`. Use the course filters in **Shared rules > Browse shared rules** or **Import rules > Import history**. Examples are hidden, including under All courses, until **Expand examples** is selected. Closing any example-course chip hides them all. A shared rule appears under each supported course.

Personal configuration exports include complete imported rule JSON and course bindings, not only IDs. Restore does not need a shared-rule download, even if the remote file is unavailable. Practice data is excluded. **Create rule > Simulated creation** opens a guided, isolated practice flow with a synthetic page in a new tab; **Actual creation** uses configured courses and verified Gmail/Moodle pages. The two creation flows share the same step layout. Saving a draft makes it available in import history, not automatically active. A downloaded DEMO1000 package does not become a real-course adaptation by changing its course code: selectors still need validation against the actual page.

1. Open **Settings > Recognition and rules > Recognition rule repository** in a compatible extension. The other tabs are **OCR method**, **Rule matching test** and **Assign rules to courses**; Windows hides OCR method.
2. **Official rules** lists trusted defaults and verified official updates, with version, manual update check and rollback controls. Ordinary imports cannot replace official rules. The signed channel is separate from shared packages.
3. **Shared rules** has browsing, contribution guidance and an author directory. Browsing uses the extension's bundled static catalogue; downloads require an explicit user action. Review the source, supported courses, version and attribution. Shared packages do not automatically update.
4. **Import rules > New import** accepts a dragged/uploaded JSON file or pasted JSON and offers a full-field template. **Import history** lists saved rules and provides details, JSON copy/download and test actions. Manual import is **always local**, even for repository files or IDs also used by shared packages. Import an `examples/` file, not `catalog.json` or an official release envelope.
5. A local import and an installed community package with the same raw `id` can coexist. Origin is separate app-managed metadata, never an author-supplied JSON field. An ID does not grant built-in or community trust.
6. **Rule matching test** is available in normal mode and uses a guided course/rule selection, image review and completion flow. The default date range is **14 calendar days including today (UTC+8)**, editable before searching. An optional message/post URL narrows the search. Review multiple images individually and optionally run OCR. Selecting a tested rule shows a reminder; history offers **Test again**. Tests **never submit attendance or save formal attendance records**.
7. Rule states are **Waiting for test** (yellow), **Waiting for matching** (blue) and **Matched** (green). Untested packages cannot be selected for matching; explicitly skipping a test requires two confirmations and is labelled separately. Match the exact course code and source: `FIT5222` is not `FIT5122`, and Ed rules do not appear in a Gmail selection. Choose **at most 8 shared + local rules combined**, not 8 of each. Downloading, importing or testing never automatically assigns a package.

A shared package lists both courses in `courses`, but still has exactly one `source`. It does not verify course identity, automatically bind other courses, or search neighboring messages. Select it separately where appropriate.

### Author and Validate

1. Read [AGENTS.md](AGENTS.md) and the [v1 schema](schema/source-rule.v1.schema.json).
2. Obtain a small, manually sanitized DOM sample from a verified message/post root. A screenshot alone cannot establish CSS selectors.
3. Copy the nearest example and choose a stable ID such as `author.course.source` or `alice.fit5122.moodle`. IDs must be nonempty strings of at most 256 characters, starting with a lowercase ASCII letter, with lowercase letters/digits separated by single dots or hyphens. At least one separator is required; no whitespace, uppercase, repeated or trailing separators. **`builtin` and `demo` are forbidden anywhere in a non-built-in ID, case-insensitively.** Only the trusted extension loader can exempt built-ins; no JSON field grants that exemption. The examples' `community.` prefix is only a naming convention, not import origin. DEMO course identifiers and catalogue `demo: true` are unaffected.
4. Set the source, courses, literal keywords and selectors. Use a distinct ID for a distinct package; increment the three-part `version` when changing a published package.
5. Add positive and negative `*.fixture.json` cases under `fixtures/<example-name>/`. Every course in a shared demo needs a positive case. Keep published demos synthetic.
6. Update [catalog.json](catalog.json) to match the example's metadata and exact file digest. All current entries have `demo: true`.
7. With Node 22+ installed, run:

```sh
npm ci
npm test
```

Tests check catalogue regressions, toolkit checksums, rule schema/runtime validation, fixture expectations, complete catalogue coverage, metadata equality and raw-file SHA-256. Fix failures rather than changing expected results without justification.

### Format and Boundaries

Optional attribution is displayed consistently in every library section:

```json
{
  "author": {"name": "mxymalay", "url": "https://github.com/mxymalay"},
  "sourceUrl": "https://github.com/mxymalay/mamo-checkin-rules/blob/main/examples/DEMO1000/demo-gmail.json"
}
```

`author` also accepts a plain name (text only), a webpage URL (clickable), or an object with only `name`. The author icon opens a modal with the available text/link; the adjacent repository icon opens `sourceUrl`, the public rule file page, not a download/update endpoint. The shared author directory aggregates attribution from the catalogue. Links open only after a click; they never change the fixed shared-rule download host. URLs allow HTTP/HTTPS, up to 2048 characters, with no credentials, whitespace or backslashes. Metadata is self-declared, not verified authorship. Keep attribution identical in catalogue and package; update the version and SHA-256 after edits.

The [builtin/](builtin/) directory publishes the extension's built-in JSON for inspection only. These trusted defaults have reserved IDs and cannot be imported as local/community rules or overridden by a download.

Required rule fields: `schemaVersion: 1`, `id`, `version`, `name.en`, `source`, `courses`, `images.selectors`. Chinese names are optional in the rule format; catalogue demos provide `en`, `zh_CN` and `zh_TW`.

The extension's downloadable template includes all supported rule fields. Replace placeholder author/link values before sharing; optional keyword and exclusion arrays can be empty. Empty `attachments.selectors` matches no attachments; only Ed allows nonempty attachment selectors. Do not leave required names, IDs, courses or image selectors empty. Quoted blocks are not inherently old content and are not automatically excluded; explicit exclusion selectors and source/visibility checks still apply.

- Sources: `gmail`, `moodle`, `ed`; one source per package.
- Maximum 64 KiB UTF-8; 20 courses, 20 keywords per category, 8 selectors per category, 256 characters per string. These package limits are separate from the 8-selected-rules limit.
- `keywords.navigation` and `keywords.context` are literal strings, not regular expressions.
- Selectors allow tags, classes, IDs, simple quoted attribute matches, descendants, children and comma groups. No pseudo-classes, wildcards, sibling combinators, script selectors or execution.
- `images.excludeSelectors` and positive integer dimensions up to 4000 narrow selection. Ed-only `attachments.selectors` identifies existing attachment links inside a verified discussion, not arbitrary fetch URLs. Gmail and Moodle rules select images, not links.
- Unknown fields are rejected. Do not put `origin`, `demo`, `path`, `sha256`, cookies, headers, scripts or update URLs in rule JSON. Catalogue metadata belongs in `catalog.json`.
- Runtime validation enforces cross-field and byte-budget constraints beyond JSON Schema. The CLI registers `mamo-selector` using the same runtime validator.

A fixture specifies `source`, `course`, a synthetic `url`, `html`, `expected` image URLs, optional `root` (default `main`), optional `isThread`, and optional `expectedReasons`. Set synthetic image dimensions. Each selected root represents a separately verified message; the locator cannot search sibling roots.

The harness is offline: it never executes fixture scripts, loads image resources or signs in. Platform-looking URLs are synthetic test strings, not live resources to visit. It tests location, not login, real course verification, attachment downloads, OCR accuracy or submission. Those boundaries need the extension's integration tests. Schema success does not prove that the right image or code was found.

### Static Catalogue Contract

Root [catalog.json](catalog.json) has `{ "schemaVersion": 1, "rules": [...] }`. Each entry requires `id`, `version`, `name: {en, zh_CN, zh_TW}`, `source`, `courses`, `path`, `demo`, `sha256`; optional `author` and `sourceUrl` must match the package.

`path` is a repository-relative `examples/<course>/<name>.json` or `examples/shared/<name>.json` path, never a URL. `sha256` is 64 lowercase hexadecimal characters: SHA-256 of the **raw UTF-8 JSON file bytes**, including whitespace and the final newline, not canonicalized or re-serialized JSON:

```sh
shasum -a 256 examples/DEMO1000/demo-gmail.json
```

Maintainers copy this catalogue into the extension as bundled metadata. The consumer contract is to fetch only `https://raw.githubusercontent.com/mxymalay/mamo-checkin-rules/main/{path}` after an explicit user action, enforce a **64 KiB response limit and 10-second timeout**, **omit credentials**, and **reject redirects**. Before installation it must verify the raw digest, package ID and version, then validate the rule format. A changed file requires updated bundled metadata; a mismatch fails closed. This repository's validator does not download files or implement the installer.

There are **no automatic updates for shared/local packages**. The separate [official channel](official/README.md) supplies signed declarative JSON to compatible extensions on installation, when due at startup and every six hours. It uses a pinned public key, offline fallback and cached versions; a failed update does not replace usable rules, and active runs retain their snapshot. It can supply course-specific official overrides but cannot turn ordinary imports into trusted official rules. Older extensions need one compatible extension update first.

Preserve bytes when publishing shared packages: formatting or line-ending changes also change the digest. Publish tested rule files before releasing an extension catalogue that references them. A digest binds a download to reviewed metadata; it is not independent proof of author trust or correct matching. Official release signing and rollback are documented separately; never commit private signing keys.

### Contribute Safely

Read the bilingual [contribution requirements](CONTRIBUTING.md), then submit JSON, sanitized fixtures and the catalogue entry for review, with expected inclusions/exclusions and test results. Never include real names, email addresses, account menus, cookies, source signatures, real messages or currently usable attendance codes. Review diagnostics yourself before publishing; exports omit bodies, images and OCR text by default, and testing tools do not automatically upload samples.

`toolkit/` is reviewed contributor tooling synchronized from the extension, not part of downloaded rule packages. Do not edit it or its checksum manifest in a normal rule PR. Checksums detect accidental drift, not malicious edits to both code and manifest. Grammar and engine changes belong in the main extension with independent review.

---

## 中文

### 状态与示例

本仓库提供 Gmail、Moodle、Ed 的声明式图片定位 JSON，不执行脚本，也不修改身份验证、OCR 或签到提交逻辑。适用于 [Mamo Check-in 2.0.0](https://github.com/mxymalay/mamo-checkin/releases/tag/v2.0.0) 及兼容版本；Chrome 商店采用独立审核流程，版本可能较旧。所有共享目录条目都是**合成演示**，不是已验证的真实课程适配，只使用 `DEMO1000`、`DEMO2000`，不包含可用签到码或私人消息。

| 示例 | 来源与课程 | 重点 |
| --- | --- | --- |
| [demo-gmail.json](examples/DEMO1000/demo-gmail.json) | Gmail / DEMO1000 | 图片选择器与尺寸限制；7 个样例 |
| [demo-moodle.json](examples/DEMO1000/demo-moodle.json) | Moodle / DEMO1000 | 字面导航/上下文关键词、排除作者图片；7 个样例 |
| [demo-ed.json](examples/DEMO1000/demo-ed.json) | Ed / DEMO1000 | 图片与现有附件链接选择器；7 个样例 |
| [demo-shared-gmail.json](examples/shared/demo-shared-gmail.json) | Gmail / DEMO1000、DEMO2000 | 两门课程共享布局；9 个样例 |

示例的规范 ID 为 `community.example.gmail-images`、`community.example.moodle-images`、`community.example.ed-images` 和 `community.example.shared-gmail-images`。旧 ID 不提供别名或自动迁移；无效的已安装副本可删除后重新导入。课程目录、DEMO1000/DEMO2000 课程标识和选择器保持不变。共享示例分别测试两门课程，拒绝未验证/空课程并排除作者图片；单课程示例将 DEMO2000 作为错误课程。各示例覆盖缺图、装饰图、引用、独立消息边界、禁止的图片域名。Ed 示例展示附件选择器格式，不代表已验证真实附件下载或 OCR。

[离线演示页](docs/demo.html) 可在本地直接打开，无脚本、远程图片、登录、表单或提交功能。它是说明文档，不是真实扩展界面截图或签到页面。

### 查找、导入与选择

单课程示例位于 `examples/DEMO1000/`，多课程共用规则位于 `examples/shared/`。在**共享规则 → 查看共享**或**导入规则 → 历史导入**中选择课程标签；共享规则会出现在各个支持课程下。未点击**展开样例**前，“全部课程”也不展示样例规则；点击任一样例课程标签的关闭图标可全部收起。

个人配置导出包含完整的已导入规则 JSON 和课程绑定，不是只有 ID；恢复无需再次下载，即使共享文件不可用也能导入。练习数据不包含在内。**创建规则 → 模拟创建**提供分步隔离练习并新开合成页面；**实际创建**使用已配置课程与验证后的 Gmail/Moodle 页面，两者采用一致的步骤布局。保存草稿后进入历史导入，不自动启用。仅将 DEMO1000 改为真实课程代码不代表完成适配，选择器仍需在实际页面验证。

1. 打开 **设置 → 识别与规则 → 规则识别仓库**。其他一级菜单为 **OCR识图方案、规则匹配测试、规则匹配课程**；Windows 不显示 OCR识图方案。
2. **官方规则**展示可信默认规则与已验证的官方更新，提供版本、手动检查更新和回滚。普通导入不能覆盖官方规则；签名通道与共享包分开。
3. **共享规则**分为**查看共享、我要共享、共享名单**。查看共享使用随扩展打包的静态目录，由用户明确选择下载；先检查平台、课程、版本和作者信息。共享包不会自动更新。
4. **导入规则 → 新建导入**支持拖入/上传 JSON、直接粘贴 JSON，并提供完整字段模板；**历史导入**提供规则详情、复制/下载 JSON 和测试。手动导入**始终属于本地**，即使文件来自本仓库或与共享包 ID 相同。导入 `examples/` 中的规则，不是 `catalog.json` 或官方签名发布文件。
5. 同一原始 `id` 的本地包与已安装社区包可以共存。来源是扩展管理的独立元数据，不写入规则 JSON；作者不能靠 ID 获得内置或社区身份。
6. **规则匹配测试**在正常模式即可使用，按选择课程与规则、检查图片结果、完成分步进行。默认时间为 **UTC+8 最近 14 个自然日（含今天）**，搜索前可修改；可选邮件/帖子链接用于缩小搜索范围。多张图片逐张检查并可单独测试 OCR；选中已测试规则会提醒，历史导入显示**再次测试**。测试**不提交签到、不保存正式签到记录**。
7. 规则状态为黄色**等待测试**、蓝色**等待匹配**、绿色**已匹配**。未测试规则不能直接选择匹配；主动跳过测试需两次确认，并单独标明。课程代码和来源必须同时相同：`FIT5222` 不等于 `FIT5122`，Ed 规则不会显示在 Gmail 选择窗口。每门课程每个来源最多选择**共享与本地规则合计 8 个**，不是各 8 个。下载、导入或测试均不自动匹配。

共享包可在 `courses` 中列出两门课程，但仍然只有一个 `source`。它不验证课程身份、不自动绑定其他课程，也不能跨消息查找图片；需要为适用课程分别选择。

### 编写与验证

先读 [AGENTS.md](AGENTS.md) 和 [v1 规范](schema/source-rule.v1.schema.json)。准备手动脱敏的、已验证消息/帖子根节点内的 DOM，不要凭截图猜选择器。复制最接近的示例，使用作者自选的稳定 ID，例如 `author.course.source` 或 `alice.fit5122.moodle`。ID 必须是非空字符串，最多 256 字符，以小写 ASCII 字母开头；小写字母和数字之间用单个点或连字符分隔，至少有一个分隔符，不得含空白、大写、连续或末尾分隔符。**非内置 ID 的任何位置均不得包含 `builtin` 或 `demo`，不区分大小写。** 仅可信内置加载器可豁免，JSON 字段不能申请豁免。示例的 `community.` 只是命名习惯，不决定来源；DEMO 课程标识和目录 `demo: true` 不受影响。

设置平台、课程、字面关键词和选择器；在 `fixtures/<示例名>/` 添加正反样例，共享示例需覆盖每门课程。已发布内容变更须提高三段式 `version`，不同包用不同 ID。演示继续使用合成数据。同步更新 `catalog.json` 的元数据及原始文件摘要，当前所有示例标记 `demo: true`。

使用 Node 22+ 执行：

```sh
npm ci
npm test
```

测试包括目录回归测试、工具包校验和、规则规范/运行时验证、全部样例、目录完整性、元数据一致性及原始 SHA-256。不得修改预期结果来掩盖误匹配。

### 格式与边界

作者信息为可选字段：`author` 可填纯文字、网页地址，或包含 `name` 和可选 `url` 的对象；`sourceUrl` 填规则文件的公开网页。作者图标打开详情弹窗，相邻的仓库图标跳转源文件，共享名单汇总目录中的作者。链接仅在点击后访问，不替换固定下载地址。作者信息由作者自行声明，不代表身份认证。修改后需同步目录、提高版本并更新摘要。`builtin/` 为内置规则的公开查阅副本，不能作为本地或共享规则导入。

必填为 `schemaVersion: 1`、`id`、`version`、`name.en`、`source`、`courses`、`images.selectors`。规则格式中的中文名称可选，但目录演示提供 `en`、`zh_CN`、`zh_TW` 三种名称。

扩展下载的模板列出全部支持字段。共享前替换作者和链接占位值；可选关键词、排除选择器可为空数组。`attachments.selectors` 为空表示不匹配附件，仅 Ed 可填非空附件选择器。必填名称、ID、课程、图片选择器不得留空。引用块本身不代表内容过期，不会自动排除；明确的排除选择器、来源及可见性校验仍生效。

- 来源仅 `gmail`、`moodle`、`ed`，每包一个来源。
- 单包最多 64 KiB UTF-8、20 门课程、每类 20 个关键词、每类 8 个选择器、每字符串 256 字符。与“最多选择 8 个规则”是不同限制。
- 关键词是字面字符串，不是正则。选择器允许标签、类、ID、简单带引号属性匹配、后代、子节点、逗号分组，不允许伪类、通配符、兄弟组合器或脚本执行。
- `images.excludeSelectors` 与最大 4000 的正整数尺寸可缩小范围。仅 Ed 支持已验证讨论中的现有附件链接选择器；Gmail、Moodle 只选图片。
- 未知字段被拒绝。不得将 `origin`、目录字段 `demo/path/sha256`、脚本、Cookie、请求头或更新网址写入规则文件。
- 运行时另有跨字段/字节预算验证，CLI 使用相同的选择器验证器。JSON 校验通过不代表图片正确，更不代表 OCR 或签到成功。

样例包含 `source`、`course`、合成 `url`、`html`、`expected` 图片地址，可选 `root`（默认 `main`）、`isThread`、`expectedReasons`。图片应设尺寸，每个根节点代表独立验证的消息，不可搜索相邻消息。离线测试不执行脚本、不加载图片、不登录；平台样式地址仅是测试字符串，无需访问。真实登录、课程验证、附件下载、OCR 和提交需由主扩展集成测试验证。

### 静态目录与发布

根目录 `catalog.json` 格式为 `{ "schemaVersion": 1, "rules": [...] }`。条目必填字段为 `id`、`version`、`name: {en, zh_CN, zh_TW}`、`source`、`courses`、`path`、`demo`、`sha256`；可选 `author`、`sourceUrl` 须与规则包一致。`path` 只能是仓库相对路径 `examples/<课程>/<名称>.json` 或 `examples/shared/<名称>.json`，不能是网址。

`sha256` 是**原始 UTF-8 JSON 文件字节**的 64 位小写十六进制 SHA-256，包含空白和末尾换行，不是重新序列化后的 JSON。可运行 `shasum -a 256 examples/DEMO1000/demo-gmail.json` 查看；修改缩进或换行也需要更新摘要。

维护者把目录复制进扩展作为打包元数据。消费者仅在用户明确操作后，从固定地址 `https://raw.githubusercontent.com/mxymalay/mamo-checkin-rules/main/{path}` 下载，限制 **64 KiB、10 秒**，**不携带凭据、拒绝重定向**；安装前验证原始摘要、ID、版本与规则格式。不匹配必须拒绝；文件变更需要同步打包目录。仓库验证器本身不下载文件或实现安装器。

**共享、本地包没有自动更新。** 独立的[官方签名通道](official/README.md)面向兼容扩展，在安装时、启动时按需及每 6 小时检查声明式 JSON 更新。固定公钥验证签名，离线使用随包或缓存版本，失败不覆盖可用规则，运行中的任务保持原快照。官方通道可提供课程专属覆盖，但不会把普通导入变为可信官方规则；旧扩展需先更新一次。

共享包应先发布通过测试的规则，再发布引用它们的扩展目录，保持原始字节不变。摘要证明文件与受审查元数据一致，不单独证明作者可信或规则匹配正确。官方发布的签名与回滚见独立说明；私钥禁止提交。

先阅读中英文[贡献要求](CONTRIBUTING.md)，提交 PR 时附规则、脱敏样例、目录条目、应匹配/应排除说明与测试结果。不得公开真实姓名、邮箱、账号菜单、Cookie、签名链接、消息或当前可用签到码。诊断默认不含正文、图片、OCR 文本；公开前仍须复核，测试工具不会自动上传样本。

`toolkit/` 是从主扩展同步的贡献者工具，不随规则包下载。普通规则 PR 不改工具或其校验和清单。校验和只能发现意外漂移，不能代替代码审查；语法/引擎改动应在主扩展独立审查。
