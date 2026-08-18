# 千问办公 · 案例库

面向客户演示的案例展示网页。纯静态，无构建步骤，双击 `index.html` 或部署到任意静态托管即可。

## 目录结构

```
qwenwork-cases/
├── index.html          主页面（含路由与渲染逻辑，logo 以 base64 内联）
├── assets/
│   ├── style.css       样式（品牌绿浅色主题，设计令牌集中在 :root）
│   ├── data.js         ★ 数据源，日常只改这个文件
│   ├── qr.js           二维码编码器（byte 模式，无依赖）
│   └── poster.js       分享海报 canvas 渲染
└── demos/              演示物料（HTML / SVG / ZIP）
```

## 收藏与分享

**我的收藏**：卡片右上角书签图标收藏，工具栏右侧「我的收藏」胶囊切到收藏视图（再点一次退出）。状态存 `localStorage`（key `qw_cases_fav`），环境不支持时自动回退到内存（当次会话有效）。

**分享案例**（详情页 Hero 的「分享案例」）弹窗内两种方式：

- **链接分享**：链接明文展在输入框里，所见即所复制。链接由 `caseUrl()` 以**当前页面地址**为基准只换 hash 生成，不写死域名——本地预览 / 内网 / GitHub Pages 域名各不相同。
- **分享海报**：canvas 现场生成 800×自适应高度的二倍图，包含 logo、部门/客户标签、标题、slogan、封面、三个亮点与**案例二维码**，可一键保存 PNG。

> 二维码是本地算的（`assets/qr.js`），不请第三方 API——外部二维码服务在国内不可靠，也没必要把案例链接送给别人。
>
> 海报要把 CDN 封面画进 canvas，依赖 alicdn 的 `access-control-allow-origin: *`（已确认）。如果以后换到不发 CORS 头的图源，canvas 会被污染、导不出图；此时 `loadImg` 会静默跳过封面，海报仍能生成（封面位置换成深色渐变）。

## 图片资源放在哪

所有展示类图片（Hero 背景、卡片封面）**都走阿里 CDN**，仓库里不再存本地大图——之前本地 PNG 单张 1.3～2.4MB，首屏明显拖慢；CDN 版压到 32～160KB。

| 用途 | 位置 |
|---|---|
| Hero 背景图 | `assets/style.css` 里 `.hero { background-image: url(...) }` |
| 卡片封面 | `assets/data.js` 每个案例的 `cover` 字段 |
| logo | 以 base64 data URI 直接内联在 `index.html` 的 `.brand-logo` 里（320×84，~14KB，不占额外请求） |

换图就直接换 URL。新图上传 CDN 后建议尺寸：背景 1792×1024，卡片封面 1600×900（16:9，会按 `object-position: top center` 裁切显示顶部）。

> 卡片未填 `cover` 时会自动回退到深色品牌渐变占位 + 部门英文水印，不会空白。

背景图上方叠了一层白色柔化层（`.hero::before`），作用是保中间文字可读、四角保留色彩。换成更深的图就把它调重，更浅就调轻。

## 首页搜索

纯前端实时筛选，无后端。匹配范围覆盖标题、slogan、概述、标签、痛点、方案、演示步骤、适用人群、客户名、部门名、指标与材料标题；空格分隔的多个词需全部命中（如 `法务 导出`）。搜索与部门胶囊可叠加，胶囊计数会跟着当前搜索词变。

两个注意点：

- **`dept.desc` 故意排除在匹配范围外**。部门描述里的词会让同部门所有案例被误命中（法务 desc 含“合同”，会导致搜“合同”时把招投标案例也带出来）。
- **`SITE.hotScenes` 里的每个词必须能搜到结果**。快捷标签点下去是空的比没有标签更差。匹配是连续子串，所以“广告投放”搜不到（文案里只有“广告”和“投放”分开出现），改用了“亚马逊广告”。新增标签后先在页面上点一下验证。

标题、副标题、底部标语、搜索框 placeholder、热门标签均在 `data.js` 的 `SITE` 里改；Hero 顶部的统计数字（N 个真实交付 / N 大部门 / N 个落地案例）从数据自动算，不用维护。

## 演示素材怎么放

一个案例有两处图，职责不同：

### 1. `cover` —— 首页卡片封面（静图，走 CDN）

```js
cover: 'https://gw.alicdn.com/imgextra/.../xxx.png'
```

建议 1600×900。不填会自动回退到深色品牌渐变占位（带部门英文水印）。

需要从现有 demo 页批量生成封面时，先用无头 Chrome 截图再上传 CDN：

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --window-size=1600,900 \
  --screenshot="$(pwd)/cover.png" "file://$(pwd)/demos/xxx.html"
```

### 2. `media` —— 详情页 Hero 右侧演示区（动图 / 视频）

**放 MP4 视频**（自动循环静音播放）：
```js
media: { type: 'video', src: '<CDN 或 demos/xxx.mp4>', poster: '<封面图>', caption: '完整操作演示' }
```

**放 GIF 或截图**：
```js
media: { type: 'image', src: '<CDN 或 demos/xxx.gif>', caption: '风险条款 hover 联动效果' }
```

`poster` 和 `caption` 可省略。不填 `media` 时，Hero 右侧会退而展示 `cover`；两个都没有才显示虚线占位框。**动图/视频体积大，建议也上 CDN，不要直接往仓库里塞。**

## 怎么加一个新案例

在 `data.js` 的 `CASES` 数组里追加一个对象，页面自动出现在对应部门分组下。

| 字段 | 说明 |
|---|---|
| `id` | 唯一标识，用于 URL（`#/case/<id>`） |
| `dept` | 部门 id，需在 `DEPTS` 中存在 |
| `status` | `live` 可演示 / `demo` 有素材 / `wip` 待补充 |
| `title` | 案例名称（卡片与详情页大标题） |
| `slogan` | 一句话价值主张（卡片封面与详情页副标题） |
| `summary` | 3-4 行方案概述（详情页「案例概览」引言） |
| `tags` | 标签数组，卡片封面只叠前 2 个 |
| `client` / `clientNote` | 客户名与补充说明，可留空 |
| `metrics` | 3 个 `{value, label}`，渲染为 Hero 左下角「亮点 01/02/03」 |
| `pains` / `solutions` | 「案例概览」左右两栅的列表 |
| `before` / `after` | 「效果对比」文案 |
| `demoLine` | 「演示路径」步骤数组，自动编号 |
| `cover` | 首页卡片封面（CDN URL），见上文 |
| `media` | 详情页 Hero 右侧演示动图/视频，见上文 |
| `prompt` | 「复制 Prompt」区块与卡片上「一键复制 Prompt」的内容 |
| `audience` | 适合的角色数组（卡片只叠前 3 个） |
| `links` | `{label, href, kind}`，kind 取 `live`/`demo`/`doc`/`file` |

新增部门：在 `DEPTS` 里加一条，`icon` 取 `index.html` 中 `ICONS` 已定义的名称。

## 详情页结构

Tab 根据数据自动生成，字段为空的区块不会出现在 Tab 里：

```
Hero（左：标签/标题/slogan/适用人群/三按钮/亮点  右：演示动图）
── Tab 导航（吸顶 + 滚动高亮）
01 案例概览   ← pains / solutions
02 效果对比   ← before / after
03 演示路径   ← demoLine
04 复制 Prompt ← prompt
05 相关材料   ← links
相关案例（同部门自动关联）
```

收藏状态存在 `localStorage`（key `qw_cases_fav`），环境不支持时自动回退到内存。

## 品牌配色

主色取自千问办公官网（qwenwork.cn）：

- 品牌绿 `#30bf69`（`--accent`）
- 深绿 `#22975a`（`--accent-dark`，hover 与文字）
- 亮绿 `#4ce285`（`--accent-2`）
- 浅绿底 `#eefff5`（`--accent-soft`）

改主色只需动 `style.css` 顶部 `:root` 里的 `--accent*` 变量。

## 本地预览

```bash
python3 -m http.server 8090
# 打开 http://localhost:8090
```

直接双击 `index.html` 也能用（hash 路由不依赖服务端）。

## 部署

整个目录传到 GitHub Pages / OSS / 任意静态托管即可，无需构建。注意 `demos/` 里有较大文件（技能包 15MB、绩效汇报 12MB、亚马逊分享 10MB），如托管有体积限制可按需精简。
