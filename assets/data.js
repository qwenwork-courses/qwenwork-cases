/* =============================================================================
 *  千问办公 · 案例库数据源
 *  ---------------------------------------------------------------------------
 *  新增案例只需在 CASES 数组里追加一个对象，页面自动出现在对应部门下。
 *  字段说明见 README.md「怎么加一个新案例」。
 *  status: 'live' = 已交付可演示 | 'demo' = 演示素材就绪 | 'wip' = 待补充
 * ========================================================================== */

const DEPTS = [
  { id: 'legal',     name: '法务',   en: 'Legal',      icon: 'scale',   desc: '合同、合规、风控文书的审查与留痕' },
  { id: 'hr',        name: '人力',   en: 'HR',         icon: 'users',   desc: '绩效、招聘、人事流程的线上化与自动化' },
  { id: 'marketing', name: '市场',   en: 'Marketing',  icon: 'megaphone', desc: '投放、内容、渠道数据的分析与生产' },
  { id: 'admin',     name: '行政',   en: 'Admin',      icon: 'building', desc: '接待、资产、后勤服务的数据化管理' },
  { id: 'training',  name: '培训',   en: 'Training',   icon: 'play',    desc: '课程、知识、SOP 的批量生产与沉淀' },
  { id: 'finance',   name: '财务',   en: 'Finance',    icon: 'coins',   desc: '经营分析、稽核、报表的自动成稿' },
  { id: 'sales',     name: '销售',   en: 'Sales',      icon: 'target',  desc: '客户跟进、方案与标书的提效' },
  { id: 'ops',       name: '生产运营', en: 'Operations', icon: 'gauge',  desc: '质量、排产、异常追溯的实时看板' }
];

/* 案例数据已拆分为「一个案例一个文件」，见 assets/cases/<id>.js，
   每个文件通过 CASES.push({...}) 自注册；这些文件在 index.html 中于 data.js 之后加载。
   新增案例 = 新建 assets/cases/<新id>.js + 在 index.html 的案例脚本列表追加一行。
   部门内的展示顺序 = index.html 里 <script> 的排列顺序。*/
const CASES = [];

/* 首页文案（统计数字自动计算，无需手改） */
const SITE = {
  brand: '千问办公',
  productLine: '案例库',
  title: '全部门 AI 场景实践指引',
  subtitle: '覆盖法务、人力、市场、行政、培训、财务、销售与生产运营八大业务领域',
  slogan: '让 AI 落到真实场景，让实践沉淀为组织能力',
  searchPlaceholder: '搜索场景、问题或业务目标',
  /* 热门场景快捷标签：每个词必须能搜到结果，新增后先在页面上点一下验证 */
  hotScenes: ['合同审查', '绩效管理', '亚马逊广告', '行政接待', '制课'],
  /* 联系表单（钉钉多维表格）——页脚「联系我们」按钮与二维码均指向它
     qr 已验证扫出来就是该表单（带 source=qrcode 渠道参数）*/
  contactForm: {
    url: 'https://alidocs.dingtalk.com/notable/share/form/v01Lk3lbmGYVL5w7Om9_dv19yqvsgs3oebp3pcjys_1qX0QQ0?source=link',
    qr: 'https://gw.alicdn.com/imgextra/i4/O1CN01kX1IHEvlh6J0XMIQ_!!6000000004564-2-tps-265-269.png',
    qrCaption: '钉钉扫码填写表单'
  },
  cta: { label: '预约了解更多', href: '#contact' }
};
