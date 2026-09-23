# Contributing Rules / 规则贡献要求

[English](#english) · [中文](#中文)

## English

### Prepare a Rule

1. Create and test a rule in Mamo Check-in, or author JSON using the [schema](schema/source-rule.v1.schema.json) and [authoring instructions](AGENTS.md). A rule locates images; it does not replace OCR or submit attendance.
2. Choose a stable, author-owned ID such as `alice.fit5122.moodle`. Use lowercase letters and digits separated by single dots or hyphens. Start with a letter, include at least one separator, and stay within 256 characters. IDs cannot contain `builtin` or `demo`. Increase `version` when changing a published rule.
3. Set one source (`gmail`, `moodle`, or `ed`) and list every supported course. Test each listed course. Supply an English name; simplified and traditional Chinese names are welcome. Author metadata may be a name or a name with a public webpage URL.
4. Use supported selectors and literal keywords only. Do not add scripts, network requests, credentials, or instructions to bypass course and message boundaries. A broad selector is not proof of an invalid rule: review the actual images it includes and excludes.

### Privacy and Evidence

- Inspect the JSON before publishing, including names, keywords, selectors, author information and links. Exports are not a guarantee that user-entered fields contain no private information.
- Never submit real messages, email addresses, account menus, cookies, signed URLs, personal data or active attendance codes. Use synthetic images and manually sanitized DOM fixtures. Screenshots alone do not establish selectors.
- Include positive and negative fixtures: expected images, missing images, unrelated images, quoted content, message boundaries and prohibited hosts. Do not assume every quoted image is old; state the intended result explicitly. Multi-course rules need tests for each course and for an empty/unverified course.
- Describe what was tested in the extension, what should match, what must not match, and any limitations. Passing schema and fixture tests does not prove that live OCR or attendance submission is correct.

### Submit for Review

1. Fork this repository and create a branch. Add the rule under `examples/<COURSE>/`; use `examples/shared/` for a multi-course rule. Add sanitized fixtures under `fixtures/<rule-name>/`.
2. Update `catalog.json` with matching metadata and the SHA-256 of the exact JSON file bytes, including whitespace and the final newline. The current catalog validator accepts synthetic examples (`demo: true`, `DEMO1000` / `DEMO2000`). For a real-course contribution, coordinate its catalog admission with the maintainer; do not label real content as a demo or weaken validation to make it pass.
3. With Node.js 22 or later, run:

   ```sh
   npm ci
   npm test
   ```

4. Open a [pull request](https://github.com/mxymalay/mamo-checkin-rules/compare). Include the rule, fixtures, catalog entry, expected matches/exclusions, test results and limitations. Do not change `toolkit/` or its checksum manifest in a normal rule contribution.

Nothing is uploaded automatically by the extension. Opening the contribution link does not publish your rule. Maintainer review is required; merging a rule does not immediately add it to installed extensions, whose catalog is bundled with an extension release.

## 中文

### 准备规则

1. 在 Mamo Check-in 中创建并测试规则，或参考[规则规范](schema/source-rule.v1.schema.json)和[编写要求](AGENTS.md)编写 JSON。规则只负责定位图片，不替代 OCR，也不提交签到。
2. 自行选择稳定、属于自己的 ID，例如 `alice.fit5122.moodle`。使用小写字母和数字，以单个点或连字符分隔；以字母开头、至少包含一个分隔符、最长 256 字符。ID 不能包含 `builtin` 或 `demo`。修改已发布的规则时提高 `version`。
3. 每个规则只对应一种来源（`gmail`、`moodle` 或 `ed`），明确列出适配课程，并逐一测试。提供英文名称，欢迎补充简体和繁体中文名称。作者信息可以是名称，也可以附上公开网页链接。
4. 仅使用支持的选择器和字面关键词，不加入脚本、网络请求、凭据或绕过课程、消息边界的逻辑。选择范围大不代表规则无效，应检查实际包含和排除的图片。

### 隐私与验证

- 发布前检查 JSON 中的名称、关键词、选择器、作者信息和链接。导出功能不能保证用户填写的内容不含私人信息。
- 不得上传真实消息、邮箱地址、账号菜单、Cookie、签名链接、个人信息或有效签到码。使用合成图片和手动脱敏的 DOM 样例，不能仅凭截图推测选择器。
- 提供正反样例，覆盖目标图片、缺图、无关图片、引用内容、消息边界和禁止的主机。不要默认引用中的图片都是旧图片，应明确预期结果。多课程规则需要逐一覆盖适配课程，以及空课程或未验证课程。
- 说明扩展内的测试过程、应匹配和应排除的图片，以及已知限制。通过规范和样例校验不代表真实 OCR 或签到提交一定正确。

### 提交审核

1. Fork 本仓库并创建分支。单课程规则放在 `examples/<课程>/`，多课程规则放在 `examples/shared/`；脱敏测试样例放在 `fixtures/<规则名称>/`。
2. 更新 `catalog.json`，确保元数据与规则一致。SHA-256 按 JSON 原始文件字节计算，包含空白和末尾换行。当前目录校验仅接受合成示例（`demo: true`，课程为 `DEMO1000`、`DEMO2000`）。真实课程贡献应先与维护者确认目录收录方式，不要将真实内容标为示例，也不要削弱校验来通过测试。
3. 使用 Node.js 22 或更新版本执行：

   ```sh
   npm ci
   npm test
   ```

4. 创建 [Pull Request](https://github.com/mxymalay/mamo-checkin-rules/compare)，附上规则、脱敏样例、目录条目、预期匹配与排除结果、测试结果和已知限制。普通规则贡献不要修改 `toolkit/` 或其校验和清单。

扩展不会自动上传内容，点击贡献链接也不会直接发布规则。规则需要维护者审核；合并后不会立即出现在已安装扩展中，共享目录随扩展版本发布。
