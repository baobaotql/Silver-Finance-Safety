import { RISK_LEVEL } from './constants'

/** 模拟 OCR 高危关键词高亮 */
const HIGH_RISK_KEYWORDS = [
  '高收益', '保本', '验证码', '转账', '点击链接',
  '养老返利', '公检法', '冻结账户', '安全账户',
]

export function highlightKeywords(text) {
  if (!text) return []
  const segments = []
  let remaining = text

  while (remaining.length > 0) {
    let earliest = { index: remaining.length, keyword: '' }

    for (const kw of HIGH_RISK_KEYWORDS) {
      const idx = remaining.indexOf(kw)
      if (idx !== -1 && idx < earliest.index) {
        earliest = { index: idx, keyword: kw }
      }
    }

    if (!earliest.keyword) {
      segments.push({ text: remaining, highlight: false })
      break
    }

    if (earliest.index > 0) {
      segments.push({ text: remaining.slice(0, earliest.index), highlight: false })
    }
    segments.push({ text: earliest.keyword, highlight: true })
    remaining = remaining.slice(earliest.index + earliest.keyword.length)
  }

  return segments
}

/** 模拟分析：根据文本内容返回不同风险结果 */
const MOCK_SCENARIOS = [
  {
    match: (text) => /链接|点击|验证码|转账|公检法|冻结/.test(text),
    result: {
      riskLevel: RISK_LEVEL.HIGH,
      riskType: '链接诱导诈骗',
      riskReason: '内容包含陌生不明链接或索要验证码、要求转账等行为，存在明显诈骗特征。',
      plainExplanation: '这是陌生人发来的可疑信息，点开链接或按对方要求操作，可能会盗取您的个人信息和钱财。',
      suggestions: [
        '切勿点击陌生链接',
        '不要向对方透露手机号和验证码',
        '绝不向陌生人私下转账',
        '有疑问请让子女或社区工作人员帮忙核实',
      ],
    },
  },
  {
    match: (text) => /高收益|保本|养老返利|分红|国家项目/.test(text),
    result: {
      riskLevel: RISK_LEVEL.HIGH,
      riskType: '非法集资',
      riskReason: '宣传内容承诺高收益、保本保息或虚构国家养老项目，符合非法集资典型特征。',
      plainExplanation: '这种宣传往往打着养老福利的幌子，实际上可能拿不到承诺的钱，本金也有损失风险。',
      suggestions: [
        '不要轻信口头承诺的高收益',
        '投资前让子女帮忙查公司是否正规',
        '不向个人账户转账投资',
        '可向当地金融监管部门咨询核实',
      ],
    },
  },
  {
    match: (text) => /收益|理财|投资|优惠|限时/.test(text),
    result: {
      riskLevel: RISK_LEVEL.CAUTION,
      riskType: '金融误导',
      riskReason: '内容存在夸大收益或模糊风险提示的表述，需要进一步核实。',
      plainExplanation: '这些话术听起来很诱人，但可能没有把风险说清楚，建议您多问问、多想想再决定。',
      suggestions: [
        '仔细阅读合同全部条款',
        '不要急于当场签字或付款',
        '让家人陪同了解后再做决定',
      ],
    },
  },
]

const DEFAULT_RESULT = {
  riskLevel: RISK_LEVEL.LOW,
  riskType: '暂无明显风险',
  riskReason: '未检测到明显的诈骗或违规诱导特征，内容整体较为正规。',
  plainExplanation: '目前看这份内容没有明显骗局的迹象，但涉及转账或投资时仍建议谨慎。',
  suggestions: [
    '涉及转账前再次核实对方身份',
    '保留好相关凭证和聊天记录',
    '如有疑问可让家人帮忙把关',
  ],
}

/** 模拟 OCR 提取文本 */
const SAMPLE_OCR_TEXTS = [
  '【紧急通知】您的银行账户涉嫌洗钱，请立即点击链接 http://xxx 验证身份，并发送短信验证码至本号码，否则将冻结账户。',
  '国家养老惠民工程，年化收益15%，保本保息，名额有限，今日报名享养老返利分红！联系电话：138xxxx。',
  '尊敬的客户，您有一份理财收益待领取，限时优惠年化8%，详情请点击查看。',
  '本周社区健康讲座通知：周三下午2点活动室，欢迎参加，免费测血压。',
]

export function mockOcrText(imagePath) {
  const hash = imagePath ? imagePath.length : 0
  return SAMPLE_OCR_TEXTS[hash % SAMPLE_OCR_TEXTS.length]
}

export function mockAnalyze(ocrText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scenario = MOCK_SCENARIOS.find((s) => s.match(ocrText))
      const result = scenario ? { ...scenario.result } : { ...DEFAULT_RESULT }

      resolve({
        ocrText,
        ocrSegments: highlightKeywords(ocrText),
        ...result,
        analyzedAt: new Date().toISOString(),
      })
    }, 2000)
  })
}


