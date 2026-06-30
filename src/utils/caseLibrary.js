/**
 * 案例库 — 金融反诈真实案例
 *
 * 设计原则：
 * - 案例描述精简（≤80字），降低匹配/存储成本
 * - 无需手工标注关键词，LLM 语义匹配自动判定
 * - N-gram 倒排索引负责"召回"，LLM 负责"精判"
 *
 * 架构：
 * - 当前 ≤50 案例 → 全量塞进 LLM prompt，零召回环节
 * - 未来 50+ 案例 → N-gram 粗筛 Top 5 候选 → LLM 精判
 *
 * 数据字段：
 * - id:       唯一标识
 * - title:    案例标题（≤15字）
 * - brief:    简要描述（≤80字，用于展示 + 召回 + LLM prompt）
 * - category: 案例分类
 */

// ==================== 案例库 ====================

export const CASES = [
  // === ① 冒充公检法 ===
  {
    id: 'case_001',
    title: '冒充公安索要保证金',
    brief: '骗子冒充公安局来电，称老人涉嫌洗钱需配合调查，要求将存款转入"安全账户"，骗走养老金 32 万。',
    category: '冒充公检法',
  },
  {
    id: 'case_002',
    title: '仿冒检察院通缉令',
    brief: '老人收到"检察院通缉令"图片，被要求点击链接填写银行卡号和密码以证清白，卡内 18 万被转走。',
    category: '冒充公检法',
  },
  {
    id: 'case_003',
    title: '假客服注销会员诈骗',
    brief: '骗子冒充平台客服，称老人误开会员每月扣费 800 元，诱导下载屏幕共享 APP 后转走存款 26 万。',
    category: '冒充客服',
  },
  {
    id: 'case_004',
    title: '冒充银监会清退资金',
    brief: '不法分子冒充银保监会人员，以"清退回款"为由诱导老人缴纳手续费和认证金，骗取 15 万元。',
    category: '冒充官方机构',
  },
  {
    id: 'case_021',
    title: '冒充检察院资金清查',
    brief: '骗子发来伪造的"刑事拘捕令"和"资金清查令"，要求老人将存款集中转入一张卡并告知密码，转走 21 万。',
    category: '冒充公检法',
  },
  {
    id: 'case_022',
    title: '冒充通信管理局停机',
    brief: '骗子冒充通信管理局称老人手机号发送大量诈骗短信将被强制停机，引导联系"民警"后索要验证码转走 9 万。',
    category: '冒充公检法',
  },
  {
    id: 'case_023',
    title: '假警察视频笔录索密码',
    brief: '骗子穿假警服与老人视频通话做"远程笔录"，以核实账户为由骗取银行卡密码和短信验证码，盗刷 16 万。',
    category: '冒充公检法',
  },

  // === ② 虚假投资理财 ===
  {
    id: 'case_005',
    title: '荐股群导师带单骗局',
    brief: '老人被拉入"投资交流群"，跟随"导师"操作数字货币，前期小额返利后加大投入，最终亏损 45 万无法提现。',
    category: '投资理财诈骗',
  },
  {
    id: 'case_006',
    title: '高息理财平台跑路',
    brief: '某 APP 宣称"年化收益 18%，保本保息"，老人投入养老金 28 万，三个月后平台关闭资金无法取回。',
    category: '投资理财诈骗',
  },
  {
    id: 'case_024',
    title: '虚假黄金期货平台',
    brief: '老人被网友拉入"黄金投资交流群"，在虚假交易平台充值 20 万炒黄金，账面盈利却永远无法提现。',
    category: '投资理财诈骗',
  },
  {
    id: 'case_025',
    title: '冒充银行理财经理',
    brief: '骗子冒充某银行理财经理电话推销"内部高息理财产品"，利率远超市场，老人转账 15 万购买后无法赎回。',
    category: '投资理财诈骗',
  },
  {
    id: 'case_026',
    title: '云算力挖矿骗局',
    brief: '宣称购买云算力挖比特币"躺着赚钱"，老人投入 12 万后平台以系统维护为由关闭，所有投资血本无归。',
    category: '投资理财诈骗',
  },

  // === ③ 保健品/养老诈骗 ===
  {
    id: 'case_007',
    title: '特效药包治百病骗局',
    brief: '老人参加"免费体检"后被诊断多种疾病，花 12 万购买"特效药"，实际成分为廉价维生素片。',
    category: '保健品诈骗',
  },
  {
    id: 'case_008',
    title: '代办养老保险诈骗',
    brief: '骗子声称有"内部渠道"可代办补缴养老保险，收取 8 万"代办费"后失联，老人养老金无着落。',
    category: '养老诈骗',
  },
  {
    id: 'case_009',
    title: '免费讲座诱导购药',
    brief: '老人被"养生讲座"吸引，现场被推销数万元"保健床垫"和"磁疗仪"，实际成本不足千元。',
    category: '保健品诈骗',
  },
  {
    id: 'case_027',
    title: '干细胞治疗骗局',
    brief: '骗子以免费体检为名夸大老人病情，声称注射干细胞可治愈慢性病，老人花 9 万注射后毫无效果。',
    category: '保健品诈骗',
  },
  {
    id: 'case_028',
    title: '以房养老抵押骗局',
    brief: '骗子诱导老人将房产抵押给贷款公司，承诺每月领取高额养老金，实则将抵押款卷走，老人房钱两空。',
    category: '养老诈骗',
  },

  // === ④ 冒充熟人/子女出事 ===
  {
    id: 'case_010',
    title: '假子女出事紧急转账',
    brief: '老人接到电话称子女"出车祸急需手术费"，骗子模仿子女声音哭喊求救，老人慌乱中转账 20 万。',
    category: '冒充熟人',
  },
  {
    id: 'case_029',
    title: '冒充老战友借钱周转',
    brief: '骗子假冒多年未见的老战友来电叙旧，随后以做生意急需周转为由借走 8 万元，事后真战友称从未联系。',
    category: '冒充熟人',
  },
  {
    id: 'case_030',
    title: '冒充孙子被绑架索赎金',
    brief: '老人接到电话称孙子被绑架，背景传来哭喊求救声，要求立即转账 15 万赎金，汇款后发现孙子平安在校。',
    category: '冒充熟人',
  },
  {
    id: 'case_031',
    title: '冒充退休单位领导借钱',
    brief: '骗子冒充老人退休前单位领导，自称临时出差遇到困难急需用钱，老人出于尊重转账 5 万后对方失联。',
    category: '冒充熟人',
  },
  {
    id: 'case_032',
    title: '冒充邻居突发急病',
    brief: '骗子冒充邻居来电称老人老伴在公园晕倒已送医院，急需垫付 3 万住院押金，转账后发现是骗局。',
    category: '冒充熟人',
  },

  // === ⑤ 中奖/返利诈骗 ===
  {
    id: 'case_011',
    title: '中奖手续费连环骗',
    brief: '老人收到"中奖通知"称中了 100 万，需先缴纳 2 万"个人所得税"，缴款后再被要求交 5 万"公证费"才醒悟。',
    category: '中奖诈骗',
  },
  {
    id: 'case_012',
    title: '红包返利钓鱼链接',
    brief: '老人点击"领红包"链接，被引导填写身份证号和银行卡信息，后收到短信提示卡内 6 万元被转走。',
    category: '钓鱼链接',
  },
  {
    id: 'case_033',
    title: '电视节目中奖短信诈骗',
    brief: '老人收到短信称被选为《星光大道》幸运观众中了一等奖，需先缴纳 2 万个人所得税才能领奖。',
    category: '中奖诈骗',
  },
  {
    id: 'case_034',
    title: '银行卡积分兑换陷阱',
    brief: '老人收到"银行卡积分即将清零"短信，点击链接兑换礼品时输入银行卡号和验证码，卡内 4 万被转走。',
    category: '钓鱼链接',
  },
  {
    id: 'case_035',
    title: '扫码免费送电饭煲',
    brief: '老人看到"扫码免费领电饭煲"广告，填写收货信息和银行卡号后，卡内余额被分多次小额转走共 7 万元。',
    category: '中奖诈骗',
  },

  // === ⑥ 刷单/兼职诈骗 ===
  {
    id: 'case_013',
    title: '刷单返利一步步套牢',
    brief: '退休老人被"轻松日赚 200 元"吸引参与刷单，前两单返现后加大投入，最终被骗积攒的 11 万养老钱。',
    category: '刷单诈骗',
  },
  {
    id: 'case_036',
    title: '手工活兼职交材料费',
    brief: '老人被"在家做手工活日结工资"吸引，被要求先交 5000 元材料费，收到廉价材料后再也联系不上对方。',
    category: '刷单诈骗',
  },
  {
    id: 'case_037',
    title: '点赞关注返佣金陷阱',
    brief: '老人在短视频平台被私信"点赞关注可返佣金"，垫付金额从几百元涨到数万元后，对方拉黑失联。',
    category: '刷单诈骗',
  },
  {
    id: 'case_038',
    title: '打字录入员骗培训费',
    brief: '老人被招募为"高薪打字录入员"，先交 3000 元培训费和保密押金，交钱后对方彻底失联。',
    category: '刷单诈骗',
  },
  {
    id: 'case_039',
    title: '试玩 APP 窃取信息',
    brief: '"下载 APP 试玩 3 分钟赚 50 元"诱导老人安装恶意软件，通讯录和短信验证码被窃取，银行卡遭盗刷。',
    category: '刷单诈骗',
  },

  // === ⑦ 贷款/征信诈骗 ===
  {
    id: 'case_014',
    title: '征信修复连环骗',
    brief: '老人因担心征信影响子女，被"征信修复"公司收取 3 万服务费，不但征信未修复，个人信息还被倒卖。',
    category: '征信诈骗',
  },
  {
    id: 'case_040',
    title: '微粒贷强开额度诈骗',
    brief: '骗子声称可强制开通微粒贷高额度，以"激活费""保证金"为名收取 1.5 万后拉黑，微粒贷额度并未开通。',
    category: '征信诈骗',
  },
  {
    id: 'case_041',
    title: '消除网贷逾期记录',
    brief: '老人为帮子女消除网贷逾期记录，付费 2 万给所谓的内部人员，记录未消除且对方继续索要解冻费。',
    category: '征信诈骗',
  },
  {
    id: 'case_042',
    title: '保单贷款骗局',
    brief: '骗子以升级保单收益为由，诱骗老人将保单质押贷款 10 万，随后以购买高息产品为名将资金全部转走。',
    category: '征信诈骗',
  },

  // === ⑧ 仿冒平台/APP ===
  {
    id: 'case_015',
    title: '仿冒银行 APP 钓鱼',
    brief: '老人下载了仿冒的"手机银行"APP，输入账号密码后账户内 23 万被转走，APP 界面与真银行几乎一样。',
    category: '仿冒平台',
  },
  {
    id: 'case_016',
    title: 'AI 换脸冒充亲友视频',
    brief: '骗子用 AI 换脸技术冒充老人孙子视频通话，以"做生意急需周转"为由骗走 30 万，声音相貌均逼真。',
    category: 'AI 新型诈骗',
  },
  {
    id: 'case_043',
    title: '仿冒微信安全中心',
    brief: '老人收到仿冒"微信安全中心"消息，称账号异常需验证身份，点击链接输入银行卡信息后被盗刷 6 万。',
    category: '仿冒平台',
  },
  {
    id: 'case_044',
    title: '仿冒社保查询 APP',
    brief: '老人被引导下载仿冒的社保查询 APP，输入身份证号和银行卡号后账户被盗，养老金的 8 万被转空。',
    category: '仿冒平台',
  },
  {
    id: 'case_045',
    title: '仿冒快递理赔小程序',
    brief: '老人扫码进入仿冒的快递理赔小程序，被要求输入银行卡号和退款验证码，卡内 3 万被转走。',
    category: '仿冒平台',
  },

  // === ⑨ 恐吓威胁类 ===
  {
    id: 'case_017',
    title: '医保卡停用恐吓短信',
    brief: '老人收到"医保卡已停用"短信，点击链接后被要求填写银行卡信息并输入验证码，卡内 5 万被转空。',
    category: '恐吓诈骗',
  },
  {
    id: 'case_018',
    title: '快递丢失理赔骗局',
    brief: '骗子冒充快递公司称包裹丢失需理赔，诱导老人下载远程控制 APP 并操作转账，骗走 8 万元。',
    category: '冒充客服',
  },
  {
    id: 'case_046',
    title: '冒充黑社会恐吓消灾',
    brief: '骗子自称黑社会成员，称老人得罪人被雇来报复，花 5 万可消灾摆平，老人恐惧之下转账。',
    category: '恐吓诈骗',
  },
  {
    id: 'case_047',
    title: '虚假法院传票诈骗',
    brief: '老人收到短信称有法院传票未签收将强制执行，回拨后对方以缴纳保证金可暂缓执行为由骗取 10 万。',
    category: '恐吓诈骗',
  },
  {
    id: 'case_048',
    title: '涉嫌跨国洗钱恐吓',
    brief: '骗子自称国际刑警，称老人护照被用于跨国洗钱犯罪，要求将全部资金转入安全账户自证清白，骗走 25 万。',
    category: '恐吓诈骗',
  },

  // === ⑩ 非法集资 ===
  {
    id: 'case_019',
    title: '养老山庄非法集资',
    brief: '某公司以"养老山庄"项目为名，承诺年收益 15% 吸引老人投资，实为庞氏骗局，500 余名老人被骗超 2 亿。',
    category: '非法集资',
  },
  {
    id: 'case_020',
    title: '玉石投资传销陷阱',
    brief: '"原始股"玉石投资平台，宣称稳赚不赔月收益 30%，拉人头发展下线获提成，老人投入 10 万血本无归。',
    category: '传销诈骗',
  },
  {
    id: 'case_049',
    title: '生态农业高息集资',
    brief: '某公司宣称投资生态农庄每年分红 20%，签订虚假土地租赁合同骗取 200 余名老人超 3000 万，公司为空壳。',
    category: '非法集资',
  },
  {
    id: 'case_050',
    title: '原始股认购骗局',
    brief: '骗子声称某知名企业即将海外上市，可内部认购原始股，多名老人投入毕生积蓄后公司人去楼空。',
    category: '非法集资',
  },
]

// ==================== N-gram 倒排索引 ====================

/**
 * 将中文文本切分为 2-gram（双字片段）
 * 例："骗子冒充公安" → ["骗子", "子冒", "冒充", "充公", "公安"]
 */
function toBigrams(text) {
  const cleaned = (text || '').replace(/\s+/g, '').replace(/[，。！？、""：；（）《》…—\-\.,!?;:'"()]/g, '')
  const grams = new Set()
  for (let i = 0; i < cleaned.length - 1; i++) {
    grams.add(cleaned.substring(i, i + 2))
  }
  return grams
}

/**
 * Jaccard 相似度：交集 / 并集
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0
  let intersect = 0
  for (const item of setA) {
    if (setB.has(item)) intersect++
  }
  return intersect / (setA.size + setB.size - intersect)
}

/** 召回候选数量 */
const TOP_K = 5

/** 最小 Jaccard 阈值：低于此值视为"无关联"，放弃匹配 */
const MIN_JACCARD = 0.03

/**
 * N-gram 召回：从案例库中筛选出与 OCR 文本最相关的 Top-K 候选
 *
 * @param {string} ocrText  OCR 识别文本
 * @returns {Array<{case: object, score: number}>}  候选案例列表（按得分降序）
 */
export function recallTopCandidates(ocrText) {
  if (!ocrText || ocrText.trim().length === 0) return []

  const ocrGrams = toBigrams(ocrText)

  // 预计算所有案例的 bigram（懒加载缓存）
  const scored = CASES.map((c) => {
    if (!c._bigrams) c._bigrams = toBigrams(c.brief)
    return { case: c, score: jaccardSimilarity(ocrGrams, c._bigrams) }
  })

  scored.sort((a, b) => b.score - a.score)

  // 最高分低于阈值 → 无候选
  if (scored.length === 0 || scored[0].score < MIN_JACCARD) return []

  return scored.slice(0, TOP_K).filter((s) => s.score > 0)
}

// ==================== Prompt 构建 ====================

/**
 * 将所有案例格式化为 LLM prompt 中的案例参考文本
 * 适用于案例 ≤50 条时全量塞入 prompt
 */
export function formatAllCasesForPrompt() {
  return CASES.map((c) =>
    `[${c.id}] ${c.title}（${c.category}）：${c.brief}`
  ).join('\n')
}

/**
 * 将 N-gram 召回的候选案例格式化为 LLM prompt 片段
 * 适用于案例 50+ 条时仅传入 Top-K
 */
export function formatCandidatesForPrompt(candidates) {
  if (!candidates || candidates.length === 0) return ''
  return candidates.map((s) =>
    `[${s.case.id}] ${s.case.title}（${s.case.category}）：${s.case.brief}`
  ).join('\n')
}

/**
 * 根据 LLM 返回的 caseMatch 查找完整案例对象
 */
export function getCaseById(caseId) {
  return CASES.find((c) => c.id === caseId) || null
}

// ==================== 工具函数 ====================

export function getAllCases() {
  return CASES
}

export function getCasesByCategory(category) {
  return CASES.filter((c) => c.category === category)
}

export function getCategories() {
  return [...new Set(CASES.map((c) => c.category))]
}

export default {
  recallTopCandidates,
  formatAllCasesForPrompt,
  formatCandidatesForPrompt,
  getCaseById,
  getAllCases,
  getCasesByCategory,
  getCategories,
  CASES,
}
