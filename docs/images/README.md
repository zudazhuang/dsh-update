# 截图目录

README 的 `## 截图` 段落引用的图片放在这里，文件名固定，换图不换名。

| 文件名 | 画面 | 必须出现的内容 |
|---|---|---|
| `update-safe-sidebar.png` | 侧栏底部更新入口 | 有新版本时的提示/红点 |
| `update-safe-overview.png` | 插件详情页 | 当前运行版本、官方目标版本、渠道、最近检查时间 |
| `update-safe-prepare.png` | 准备阶段 | 隔离目录构建与试启动检查的阶段、结果 |
| `update-safe-settings.png` | 设置页 | 启动检查、定时检查、间隔、每日安装时段、空闲时长、自动切换（默认关闭） |
| `update-safe-rollback.png` | 失败回滚 | 恢复原环境的提示与数据副本路径 |

拍摄约定：

- PNG，宽度 1600 左右，深色或浅色主题都行，同一组保持统一
- 不含密钥、令牌、个人路径（检查一下侧栏会话名和日志区）
- 截完放进本目录，README 里取消 `## 截图` 段的注释即可

市场（awesome-dsh-plugin / dsh-plugin.market）的 `data/screenshots.json` 按仓库 URL 收集 README 里引用的 raw 图片，因此图片必须在 README 中被引用，只放在目录里不会出现在市场卡片上。
