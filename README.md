# Mamo Check-in Rules · 共享规则

Image-location rules for [Mamo Check-in](https://github.com/mxymalay/mamo-checkin). Declarative JSON only: no scripts, no changes to OCR or attendance submission.

为马莫签到助手提供 Gmail、Moodle、Ed 图片定位规则。规则仅为 JSON 数据，不执行脚本，不修改 OCR 或签到提交逻辑。

## Use / 使用

- In **Recognition and rules → Recognition rule repository**, browse shared rules or import JSON. Test the rule, then manually assign it to the matching course and source.
- 在**识别与规则 → 规则识别仓库**查看共享或导入 JSON，测试后再手动匹配对应课程及来源。
- Current shared examples use synthetic **DEMO1000 / DEMO2000** courses. Select **Expand examples** to see them; they are not verified real-course adaptations.
- 当前共享样例仅使用合成课程 **DEMO1000 / DEMO2000**，点击**展开样例**查看，不代表真实课程适配。

Requires 2.0.0 or a compatible build. / 需要 2.0.0 或兼容版本。

## Contribute / 贡献

Read the [contribution requirements](CONTRIBUTING.md), add a rule with sanitized test fixtures, and submit a pull request. Never include private messages, credentials or active attendance codes.

阅读[贡献要求](CONTRIBUTING.md)，提交规则、脱敏测试样例及 PR；不要包含私人消息、凭据或当前可用签到码。

```sh
npm ci
npm test
```

## Documentation / 文档

- [Rule guide / 规则指南](GUIDE.md): import flow, fields, validation and publishing / 导入流程、字段、校验与发布。
- [Catalogue / 共享目录](catalog.json) · [JSON schema / 规则格式](schema/source-rule.v1.schema.json) · [Offline examples / 离线示例](docs/demo.html)
- [Official updates / 官方更新](official/README.md): a separate signed update channel; shared/local packages do not auto-update / 独立签名通道，共享和本地规则不会自动更新。
- [Agent instructions / Agent 编写说明](AGENTS.md)
