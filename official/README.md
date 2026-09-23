# Official Rule Releases / 官方规则发布

[Latest signed release](latest.json) | [Public verification key](public-key.json)

## English

Compatible Mamo Check-in builds fetch this fixed endpoint on first installation, browser startup (when due), and every six hours. A manual check is available under Recognition and rules > Course recognition rules > Official rules. Older builds need one extension update to gain this capability.

This channel contains **declarative JSON only**. All execution code, identity checks, network host limits, OCR, and attendance submission remain inside the extension. Shared and locally imported rules are a separate channel and are never automatically selected or overwritten.

`latest.json` is a signed index containing the complete atomic rule set. Its envelope has `keyId`, `payload` (the exact signed UTF-8 JSON string) and `signature` (base64 ECDSA P-256/SHA-256, raw 64-byte IEEE P1363). The public key is pinned inside the extension; fetching this public-key file cannot change trust. The payload contains schema/engine versions, a strictly increasing sequence, release version/time and rules. Engine version 1 supports three generic `builtin.gmail`, `builtin.moodle`, `builtin.ed` rules, plus optional `builtin.*` course-specific rules. An explicit course/source rule replaces only its generic official counterpart, not user-selected rules. Course/source assignments must not overlap.

Clients validate size (512 KiB), signature, schema, engine compatibility and replay protection before switching. Downloads omit credentials, reject redirects and time out after ten seconds. Requests contain no course list, email or attendance data; the hosting service still receives ordinary network metadata such as an IP address. Failed updates retain the last working version; offline first use falls back to bundled rules. Active scans retain their original immutable rule snapshot. Local rollback is retained until a newer release sequence is published.

### Publisher Procedure

1. Edit the reviewed rule JSON files under `builtin/` (optional course-specific files may go in subdirectories). Increment changed rule versions. Never add scripts, regular expressions, workflow steps or new network permissions.
2. Test sanitized positive/negative fixtures for every changed source/course in the extension repository, and run both repositories' test suites. Signing is an authenticity check, not evidence that a rule identifies the correct attendance image.
3. Keep the private key **outside both repositories**, mode 0600, with a secure offline backup. Never put it in a commit, issue, browser setting or published artifact. The publisher's local key is managed separately; a lost key requires an extension update to change the pinned trust key.
4. From the extension repository, run:

```sh
node scripts/sign-official-rules.mjs \
  --key "$HOME/.config/mamo-rule-signing/official-v1.pem" \
  --rules ../mamo-checkin-rules/builtin \
  --output ../mamo-checkin-rules/official/latest.json \
  --sequence 2 --version 1.0.1
```

Use the next unused sequence and the intended new release version. The tool validates rules, verifies the signature against the pinned public key and creates an immutable `releases/<sequence>.json` archive. Never edit a signed payload manually. To globally revert a bad release, publish the previous rules with a **higher** sequence.

5. Commit and push reviewed rule files, `latest.json` and the archive together. Fetch the public fixed endpoint and verify its exact bytes and signature. GitHub cache propagation may delay availability; do not claim rollout before verification. This does not publish an extension.

## 中文

支持此功能的扩展首次安装时获取官方规则，浏览器启动时按需检查，并每 6 小时检查一次；也可在「识别与规则 > 课程识别规则库 > 官方规则」手动检查。旧扩展需先更新一次，才能接收后续独立规则更新。

此通道只发布声明式 JSON，不发布或执行远程脚本。身份核验、域名限制、图片识别和签到提交代码仍随扩展安装。共享规则和本地导入独立管理，不会被官方更新覆盖或自动选择。

`latest.json` 是包含全部规则的签名索引，经过固定公钥、签名、格式、兼容性和递增序号校验后整体启用。下载限制 512 KiB / 10 秒，不携带凭据，不跟随重定向，也不上传课程、邮箱或签到数据；托管服务仍可看到 IP 等常规网络信息。更新失败保留原版，离线首次使用有随包规则兜底，进行中的检查继续使用原快照。

通用规则按 Gmail、Moodle、Ed 分开；课程专属规则仅替换对应课程和来源的官方通用规则，不改变用户匹配。局部回滚后不会立即重新安装被撤回版本，直到发布更高序号。

发布前修改 `builtin/` 数据、递增变更规则的版本并完成脱敏样例测试。使用上方签名命令，将 `--sequence` 和 `--version` 换成新的值。私钥仅保存在仓库之外，应安全备份，禁止上传；私钥丢失需更新扩展内固定公钥。提交规则、签名索引和归档后，核验远程下载内容及签名。全局撤回也必须以更高序号重新签发旧规则，不能倒退序号。发布规则不等于发布扩展。
