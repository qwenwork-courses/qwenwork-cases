# 千问办公 · 案例库

面向客户演示的案例展示网页。纯静态，无构建步骤，双击 `index.html` 或部署到任意静态托管即可。

## 目录结构

```
qwenwork-cases/
├── index.html          主页面（含路由与渲染逻辑，logo 以 base64 内联）
├── assets/
│   ├── style.css       样式（品牌绿浅色主题，设计令牌集中在 :root）
│   ├── data.js         行业分类 DEPTS + 实现路径 PATHS + 首页文案 SITE（CASES 在此声明为空数组）
│   ├── cases/          ★ 一个案例一个文件，<id>.js 各自 CASES.push({...}) 自注册
│   ├── og-cover.jpg    转发分享缩略图（1200×630，由 tools/og-card.html 生成）
│   ├── qr.js           二维码编码器（byte 模式，无依赖）
│   └── poster.js       分享海报 canvas 渲染
└── demos/              ★ 演示与可下载材料，**每个案例一个子目录**，demos/<案例 id>/
    ├── amazon-ads/
    ├── contract-review/
    ├── course-creation/
    └── hr-performance/
```

### 案例文件是怎么装载的

纯静态无构建，靠 `<script>` 标签按顺序加载（不用 ES module，保证双击 `index.html` 也能直接开）：

1. `data.js` 先执行，声明 `const CASES = []`（以及 DEPTS / SITE）；
2. `assets/cases/<id>.js` 逐个执行，每个 `CASES.push({...})` 把自己注册进去；
3. 最后内联脚本渲染页面。

**部门内的卡片顺序 = `index.html` 里那批 `<script>` 的排列顺序**（不是文件名排序）。

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

纯前端实时筛选，无后端。匹配范围覆盖标题、slogan、概述、标签、痛点、方案、演示步骤、适用人群、客户名、行业分类名、实现路径名、指标与材料标题；空格分隔的多个词需全部命中（如 `法务 导出`）。搜索与当前 tab 及其二级分类可叠加，胶囊计数会跟着当前搜索词变。

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

## 相关材料（详情页 05 区块）怎么放

可下载 / 可预览的文件放在 **`demos/<案例 id>/`**，与 `assets/cases/<案例 id>.js` 同名对应，一个案例一个子目录，不混放：

```
demos/
├── amazon-ads/
│   ├── amazon-ads-skills-share.html
│   ├── amazon-weekly-report.html
│   └── amazon-asin-report.html
├── contract-review/
│   └── contract-review-skill.md
├── course-creation/
│   ├── course-sop-flow.svg
│   └── course-creation-kit.zip
└── hr-performance/
    └── hr-performance-shihuijun.html
```

在案例文件里用 `links` 声明，路径带上子目录。**详情页把全部材料排成一行**（窄屏自动掉行），分类不占独立行、而是用卡片上的小标签表达，用 `group` 字段归类：

| group | 卡片标签 | 放什么 |
|---|---|---|
| `skill` | 技能包（绿） | SKILL.md、输出模板、打包好的 zip——客户拿去复用同一套标准 |
| `sample` | 示例文档（橙） | 输入素材（如待审合同 docx），客户下载后直接丢给 agent 就能复现输出 |
| `output` | 产物（蓝） | 真实交付结果：交互式 HTML、已发布的在线页面等 |

卡片顺序固定为 技能包 → 示例文档 → 产物（不看 `links` 里的书写顺序）；没写 `group` 的链接默认归到「产物」。

```js
links: [
  /* 技能包：点开预览 SKILL.md 正文，右上角下载的是整个 zip */
  { group: 'skill', label: '合同审查技能包', kind: 'text',
    href: 'demos/contract-review/contract-review-skill.md',
    download: 'demos/contract-review/contract-review-skill-kit.zip',
    downloadName: 'contract-review-skill-kit.zip',
    note: '点开看技能定义，右上角下载包含 SKILL.md + 输出模板' },
  { group: 'sample', label: '云枢平台采购合同.docx', kind: 'file',
    href: 'demos/contract-review/云枢平台采购合同.docx', note: '示例合同，可直接丢给 agent' },
  { group: 'output', label: '交互式审查工作台', kind: 'demo',
    href: 'demos/contract-review/合同审查_星海制造_云枢平台采购_交互式.html' }
]
```

`kind` 决定图标与点击行为：

| kind | 点击行为 |
|---|---|
| `live` | 新窗口打开外链 |
| `demo` | 站内弹窗 iframe 预览，右上角带下载 |
| `doc` | 同上（svg 能直接预览） |
| `text` | 取文本后在弹窗里展示。**`.md` 必须用这个**：它的 content-type 是 `text/markdown`，iframe 会直接触发下载而不是展示 |
| `file` | 直接触发下载，不开预览（docx / zip） |

两个可选字段：`download` 让右上角下载指向与预览不同的文件；`note` 覆盖卡片副文。

两个命名约定：

- 文件名**自带案例前缀**（如 `amazon-weekly-report.html` 而不是 `weekly-report.html`）——下载到本地后文件夹上下文会丢，名字得能单独看懂
- 大体积文件要心里有数：现有材料共约 39MB（技能包 15MB、绩效汇报 12MB、亚马逊分享 10MB）。GitHub 单文件超 50MB 会警告、超 100MB 会报错，真正大的文件建议放 CDN 只存链接

## 怎么加一个新案例

两步（每个案例一个文件，并行改不同案例不会撞车）：

1. 新建 `assets/cases/<你的id>.js`，内容：
   ```js
   /* 部门名 · 案例标题  (live) */
   CASES.push({
     id: '<你的id>',
     dept: 'hr',        // 行业分类（第一行筛选）
     path: 'webapp',    // 实现路径（第二行筛选）
     status: 'live',
     // ...其余字段见下表
   });
   ```
2. 在 `index.html` 的案例脚本列表（`data.js` 之后那批 `<script>`）里，在对应部门位置追加一行：
   ```html
   <script src="assets/cases/<你的id>.js"></script>
   ```
   放在哪个位置 = 卡片在部门内的前后顺序。
3. 如果有可下载 / 可预览的材料，新建 `demos/<你的id>/` 把文件放进去，在 `links` 里引用（见上一节「相关材料怎么放」）。

改现有案例：直接改对应的 `assets/cases/<id>.js`，不碰其他文件。

> 为什么拆文件：之前所有案例堆在一个 `data.js` 里，多人/多分支并行改案例会在该文件冲突。拆后不同案例 = 不同文件，案例内容零冲突；唯一的共享改动是 `index.html` 那一行 `<script>`，而它是“追加行”，即使两个分支各加一行，合并时也只是“两行都保留”，极好解。

新增部门：在 `data.js` 的 `DEPTS` 里加一条，`icon` 取 `index.html` 中 `ICONS` 已定义的名称。

## 两套筛选维度

列表页顶部是三个**互斥的上级 tab**，切换的是“看法”而不是叠加筛选：

| 上级 tab | 二级分类 | 结果区分组方式 |
|---|---|---|
| 按行业看 | `DEPTS` 胶囊（全部 / 法务 / 人力 / … / 电商） | 按行业分区，分区头是行业名 |
| 按实现路径看 | `PATHS` 胶囊（全部 / 全栈网页交付 / … / 浏览器操作） | 按实现路径分区，分区头是路径名 |
| 我的收藏 | 无二级（收藏跨两套分类） | 不分区，一片网格平铺 |

实现上的几个约定：

- 状态是 `viewMode`（`'dept' | 'path' | 'fav'`），两套分类的选中项分开记在 `currentDept` / `currentPath`，**切 tab 不互相清空**，切回去还是之前选的那个类别
- 两套分类**不做叠加**（不存在“行业=法务 且 路径=技能封装”这种组合筛选）
- 搜索框与当前 tab 叠加：搜索只缩小范围，不改变分组方式，二级胶囊计数会跟着搜索词变
- 计数为 0 的类别置灰禁用而不隐藏（分类表始终完整可见，也不会切搜索词时整行跳动）；没有案例的路径不会生成分区
- 详情页的路径标签可点：回列表页并直接切到「按实现路径看」+ 定位到该路径；顶部导航与面包屑的行业链接则切到「按行业看」

实现路径六类：

| id | 名称 | 含义 |
|---|---|---|
| `webapp` | 全栈网页交付 | vibe coding 直出带交互与数据逻辑的免部署网页，可接自有 API Key 调外部大模型 |
| `skill` | 技能封装 | 把专业判断标准沉淀成可复用技能与专家套件 |
| `kb` | 企业知识库问答 | 接入企业知识库做检索问答与问答机器人 |
| `multimodal` | 多模态创作 | 理解图片 / 音频 / 视频，并生成图文音视频内容与成片 |
| `dataflow` | 数据聚合自动化 | 接入电商后台、社媒、业务系统等数据源，聚合后自动跑批成稿 |
| `browser` | 浏览器操作 | 由 Agent 直接控制浏览器完成登录、取数、填单 |

两套分类的定义位置：`DEPTS`（行业，案例字段 `dept`）与 `PATHS`（实现路径，案例字段 `path`），都在 `assets/data.js`。

案例字段说明：

| 字段 | 说明 |
|---|---|
| `id` | 唯一标识，用于 URL（`#/case/<id>`），建议与文件名一致 |
| `dept` | 行业分类 id，需在 `DEPTS` 中存在 |
| `path` | 实现路径 id，需在 `PATHS` 中存在（缺失时卡片不显示路径标签，也筛不到） |
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
