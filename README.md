# Mamo Check-in Source Rules

Declarative JSON packages that help Mamo Check-in locate attendance images inside already verified Gmail messages, Moodle posts and Ed discussions. Rules are data, not scripts: they cannot change identity checks, OCR, attendance submission or built-in rules.

[English](#english) | [中文](#中文) | [Offline demo walkthrough](docs/demo.html) | [Catalogue](catalog.json)

## English

### Status and Demos

These examples target compatible source-rule builds of [Mamo Check-in](https://github.com/mxymalay/mamo-checkin). A released build may not yet expose this UI. All examples are **synthetic demos**, not verified real-course adaptations. Samples use only `DEMO1000` and `DEMO2000`, with no usable attendance codes or private messages.

| Package | Source / courses | Demonstrates | Fixtures |
| --- | --- | --- | --- |
| [demo-gmail.json](examples/DEMO1000/demo-gmail.json) | Gmail / DEMO1000 | `.summary img` with dimension limits | [7 cases](fixtures/demo-gmail/) |
| [demo-moodle.json](examples/DEMO1000/demo-moodle.json) | Moodle / DEMO1000 | Literal navigation/context keywords and author-image exclusion | [7 cases](fixtures/demo-moodle/) |
| [demo-ed.json](examples/DEMO1000/demo-ed.json) | Ed / DEMO1000 | Images plus existing Ed attachment-link selectors | [7 cases](fixtures/demo-ed/) |
| [demo-shared-gmail.json](examples/shared/demo-shared-gmail.json) | Gmail / DEMO1000, DEMO2000 | One layout shared by two explicitly listed courses | [9 cases](fixtures/demo-shared-gmail/) |

The example IDs and rule contents remain unchanged; files now live in course folders. The shared demo tests both courses, empty/unverified-course rejection and author-image exclusion. Single-course demos reject DEMO2000 as the wrong course. Every demo covers missing images, decoration, quoted content, separate messages and prohibited hosts. Ed attachment selectors illustrate the allowed format; these fixtures do not prove actual attachment downloads or OCR.

Open [docs/demo.html](docs/demo.html) from a local checkout for an English/Chinese walkthrough. It is a static offline explanation, not an extension screenshot or live attendance page. No scripts, remote images, forms, login or submission are involved.

### Find, Import and Choose

Examples are grouped under `examples/DEMO1000/`; rules supporting multiple courses live under `examples/shared/`. Choose the corresponding course filter in Community downloads or Local imports. A shared rule appears under each supported course.

Personal configuration exports include complete imported rule JSON and course bindings, not only IDs. Restore does not need a community download, even if the remote file is unavailable. Practice data is excluded. In Local imports, **Create rule > Simulated creation** opens the isolated practice environment; **Actual creation** uses your configured courses and verified source pages. A downloaded DEMO1000 package cannot be tested on another course: developer testing requires a matching configured course and enabled source.

1. Open **Settings > Recognition + rules card > Course recognition rules** in a compatible extension.
2. **Built-in** lists extension-owned rules. They remain available in production; imports cannot replace them.
3. **Community downloads** lists the extension's bundled static catalogue. Review source, courses, version and demo label before explicitly choosing to download/install. There is no remote catalogue polling or automatic update service.
4. **Local imports** accepts a manually selected rule JSON. Manual import is **always local**, even for files from this repository or with the same ID as a community download. Import an `examples/` file, not `catalog.json`.
5. A local import and an installed community package with the same raw `id` can coexist. Origin is separate app-managed metadata, never an author-supplied JSON field. An ID does not grant built-in or community trust.
6. In the course's rule selection, choose only packages matching both course and source. Select **at most 8 community + local rules combined**, not 8 of each. Downloading or importing does not select a package for every course.
7. **Test rule** is developer-only, not a normal installation requirement. In developer mode, compare **Community only** and **Actual combination**, inspect image previews and exclusion reasons, and optionally test OCR. Community-only testing has no built-in fallback. Tests **never submit attendance or save formal attendance records**.

A shared package lists both courses in `courses`, but still has exactly one `source`. It does not verify course identity, automatically bind other courses, or search neighboring messages. Select it separately where appropriate.

### Author and Validate

1. Read [AGENTS.md](AGENTS.md) and the [v1 schema](schema/source-rule.v1.schema.json).
2. Obtain a small, manually sanitized DOM sample from a verified message/post root. A screenshot alone cannot establish CSS selectors.
3. Copy the nearest example and choose a stable ID such as `author.course.source` or `alice.demo1000.gmail`. The demos' `community.` prefix is only a naming convention, not import origin. **`builtin.*` is reserved; imports cannot override built-ins.**
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

Required rule fields: `schemaVersion: 1`, `id`, `version`, `name.en`, `source`, `courses`, `images.selectors`. Chinese names are optional in the rule format; catalogue demos provide `en`, `zh_CN` and `zh_TW`.

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

Root [catalog.json](catalog.json) has `{ "schemaVersion": 1, "rules": [...] }`. Every entry contains exactly `id`, `version`, `name: {en, zh_CN, zh_TW}`, `source`, `courses`, `path`, `demo`, `sha256`.

`path` is a repository-relative `examples/<course>/<name>.json` or `examples/shared/<name>.json` path, never a URL. `sha256` is 64 lowercase hexadecimal characters: SHA-256 of the **raw UTF-8 JSON file bytes**, including whitespace and the final newline, not canonicalized or re-serialized JSON:

```sh
shasum -a 256 examples/DEMO1000/demo-gmail.json
```

Maintainers copy this catalogue into the extension as bundled metadata. The consumer contract is to fetch only `https://raw.githubusercontent.com/mxymalay/mamo-checkin-rules/main/{path}` after an explicit user action, enforce a **64 KiB response limit and 10-second timeout**, **omit credentials**, and **reject redirects**. Before installation it must verify the raw digest, package ID and version, then validate the rule format. A changed file requires updated bundled metadata; a mismatch fails closed. This repository's validator does not download files or implement the installer.

There are **no remote automatic updates**. Preserve bytes when publishing: formatting or line-ending changes also change the digest. Publish tested rule files before releasing an extension catalogue that references them. A digest binds a download to reviewed metadata; it is not independent proof of author trust or correct matching.

### Contribute Safely

Submit JSON, sanitized fixtures and the catalogue entry for review, with expected inclusions/exclusions and test results. Never include real names, email addresses, account menus, cookies, source signatures, real messages or currently usable attendance codes. Review diagnostics yourself before publishing; exports omit bodies, images and OCR text by default, and testing tools do not automatically upload samples.

`toolkit/` is reviewed contributor tooling synchronized from the extension, not part of downloaded rule packages. Do not edit it or its checksum manifest in a normal rule PR. Checksums detect accidental drift, not malicious edits to both code and manifest. Grammar and engine changes belong in the main extension with independent review.

---

## 中文

### 状态与示例

本仓库提供 Gmail、Moodle、Ed 的声明式图片定位 JSON，不执行脚本，也不修改身份验证、OCR 或签到提交逻辑。需要兼容的 [Mamo Check-in](https://github.com/mxymalay/mamo-checkin) 版本；已发布版本可能尚未包含此界面。所有目录条目都是**合成演示**，不是已验证的真实课程适配，只使用 `DEMO1000`、`DEMO2000`，不包含可用签到码或私人消息。

| 示例 | 来源与课程 | 重点 |
| --- | --- | --- |
| [demo-gmail.json](examples/DEMO1000/demo-gmail.json) | Gmail / DEMO1000 | 图片选择器与尺寸限制；7 个样例 |
| [demo-moodle.json](examples/DEMO1000/demo-moodle.json) | Moodle / DEMO1000 | 字面导航/上下文关键词、排除作者图片；7 个样例 |
| [demo-ed.json](examples/DEMO1000/demo-ed.json) | Ed / DEMO1000 | 图片与现有附件链接选择器；7 个样例 |
| [demo-shared-gmail.json](examples/shared/demo-shared-gmail.json) | Gmail / DEMO1000、DEMO2000 | 两门课程共享布局；9 个样例 |

原有三个示例的 ID 与文件内容保持不变。共享示例分别测试两门课程，拒绝未验证/空课程并排除作者图片；单课程示例将 DEMO2000 作为错误课程。各示例覆盖缺图、装饰图、引用、独立消息边界、禁止的图片域名。Ed 示例展示附件选择器格式，不代表已验证真实附件下载或 OCR。

[离线演示页](docs/demo.html) 可在本地直接打开，无脚本、远程图片、登录、表单或提交功能。它是说明文档，不是真实扩展界面截图或签到页面。

### 查找、导入与选择

单课程示例位于 `examples/DEMO1000/`，多课程共用规则位于 `examples/shared/`。在社区下载或本地导入中选择对应课程标签；共享规则会出现在各个支持课程下。

个人配置导出包含完整的已导入规则 JSON 和课程绑定，不是只有 ID；恢复无需再次下载，即使社区文件不可用也能导入。练习数据不包含在内。在本地导入选择 **创建规则 > 模拟创建** 进入隔离练习，选择 **实际创建** 使用已配置课程和验证后的来源页面。下载的 DEMO1000 示例不能使用其他课程测试；开发者测试需要配置对应课程并开启相同来源。

1. 打开 **设置 > 识别与规则卡片 > 课程识别规则库**。
2. **内置**（Built-in）展示扩展自带规则，生产使用时仍然保留；导入包不能替换内置规则。
3. **社区下载**（Community downloads）展示随扩展打包的静态目录。先检查平台、课程、版本和演示标记，再由用户明确选择下载/安装。没有远程目录轮询或自动更新。
4. **本地导入**（Local imports）用于手动选择规则 JSON。手动导入**始终属于本地**，即使文件来自本仓库或与社区包 ID 相同。导入 `examples/` 中的文件，不是 `catalog.json`。
5. 同一原始 `id` 的本地包与已安装社区包可以共存。来源是扩展管理的独立元数据，不写入规则 JSON；作者不能靠 ID 获得内置或社区身份。
6. 在课程规则选择中，只选择课程与平台都匹配的包，最多选择**社区与本地规则合计 8 个**，不是各 8 个。安装或导入不代表已为全部课程启用。
7. **测试规则**仅用于开发者模式，不是普通安装步骤。可对比 **仅社区**（Community only）与 **实际组合**（Actual combination），预览图片、查看过滤原因，按需测试 OCR。仅社区测试没有内置结果兜底。测试**不提交签到、不保存正式签到记录**。

共享包可在 `courses` 中列出两门课程，但仍然只有一个 `source`。它不验证课程身份、不自动绑定其他课程，也不能跨消息查找图片；需要为适用课程分别选择。

### 编写与验证

先读 [AGENTS.md](AGENTS.md) 和 [v1 规范](schema/source-rule.v1.schema.json)。准备手动脱敏的、已验证消息/帖子根节点内的 DOM，不要凭截图猜选择器。复制最接近的示例，使用作者自选的稳定 ID，例如 `author.course.source` 或 `alice.demo1000.gmail`。示例的 `community.` 只是命名习惯，不决定来源。**`builtin.*` 保留，导入不得覆盖内置规则。**

设置平台、课程、字面关键词和选择器；在 `fixtures/<示例名>/` 添加正反样例，共享示例需覆盖每门课程。已发布内容变更须提高三段式 `version`，不同包用不同 ID。演示继续使用合成数据。同步更新 `catalog.json` 的元数据及原始文件摘要，当前所有示例标记 `demo: true`。

使用 Node 22+ 执行：

```sh
npm ci
npm test
```

测试包括目录回归测试、工具包校验和、规则规范/运行时验证、全部样例、目录完整性、元数据一致性及原始 SHA-256。不得修改预期结果来掩盖误匹配。

### 格式与边界

必填为 `schemaVersion: 1`、`id`、`version`、`name.en`、`source`、`courses`、`images.selectors`。规则格式中的中文名称可选，但目录演示提供 `en`、`zh_CN`、`zh_TW` 三种名称。

- 来源仅 `gmail`、`moodle`、`ed`，每包一个来源。
- 单包最多 64 KiB UTF-8、20 门课程、每类 20 个关键词、每类 8 个选择器、每字符串 256 字符。与“最多选择 8 个规则”是不同限制。
- 关键词是字面字符串，不是正则。选择器允许标签、类、ID、简单带引号属性匹配、后代、子节点、逗号分组，不允许伪类、通配符、兄弟组合器或脚本执行。
- `images.excludeSelectors` 与最大 4000 的正整数尺寸可缩小范围。仅 Ed 支持已验证讨论中的现有附件链接选择器；Gmail、Moodle 只选图片。
- 未知字段被拒绝。不得将 `origin`、目录字段 `demo/path/sha256`、脚本、Cookie、请求头或更新网址写入规则文件。
- 运行时另有跨字段/字节预算验证，CLI 使用相同的选择器验证器。JSON 校验通过不代表图片正确，更不代表 OCR 或签到成功。

样例包含 `source`、`course`、合成 `url`、`html`、`expected` 图片地址，可选 `root`（默认 `main`）、`isThread`、`expectedReasons`。图片应设尺寸，每个根节点代表独立验证的消息，不可搜索相邻消息。离线测试不执行脚本、不加载图片、不登录；平台样式地址仅是测试字符串，无需访问。真实登录、课程验证、附件下载、OCR 和提交需由主扩展集成测试验证。

### 静态目录与发布

根目录 `catalog.json` 格式为 `{ "schemaVersion": 1, "rules": [...] }`。条目字段为 `id`、`version`、`name: {en, zh_CN, zh_TW}`、`source`、`courses`、`path`、`demo`、`sha256`。`path` 只能是仓库相对路径 `examples/<课程>/<名称>.json` 或 `examples/shared/<名称>.json`，不能是网址。

`sha256` 是**原始 UTF-8 JSON 文件字节**的 64 位小写十六进制 SHA-256，包含空白和末尾换行，不是重新序列化后的 JSON。可运行 `shasum -a 256 examples/DEMO1000/demo-gmail.json` 查看；修改缩进或换行也需要更新摘要。

维护者把目录复制进扩展作为打包元数据。消费者仅在用户明确操作后，从固定地址 `https://raw.githubusercontent.com/mxymalay/mamo-checkin-rules/main/{path}` 下载，限制 **64 KiB、10 秒**，**不携带凭据、拒绝重定向**；安装前验证原始摘要、ID、版本与规则格式。不匹配必须拒绝；文件变更需要同步打包目录。仓库验证器本身不下载文件或实现安装器。

**没有远程自动更新。** 应先发布通过测试的规则，再发布引用它们的扩展目录，保持原始字节不变。摘要证明文件与受审查元数据一致，不单独证明作者可信或规则匹配正确。

提交 PR 时附规则、脱敏样例、目录条目、应匹配/应排除说明与测试结果。不得公开真实姓名、邮箱、账号菜单、Cookie、签名链接、消息或当前可用签到码。诊断默认不含正文、图片、OCR 文本；公开前仍须复核，测试工具不会自动上传样本。

`toolkit/` 是从主扩展同步的贡献者工具，不随规则包下载。普通规则 PR 不改工具或其校验和清单。校验和只能发现意外漂移，不能代替代码审查；语法/引擎改动应在主扩展独立审查。
