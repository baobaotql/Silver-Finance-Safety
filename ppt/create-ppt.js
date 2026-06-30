const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaShieldAlt, FaCamera, FaRobot, FaVolumeUp, FaHistory,
  FaQuestionCircle, FaCheckCircle, FaExclamationTriangle,
  FaChartLine, FaUsers, FaLightbulb, FaHeart, FaArrowRight,
  FaCogs, FaEye, FaSearch, FaHandshake, FaStar, FaWrench,
  FaLock, FaClipboardCheck, FaComments, FaSyncAlt, FaBug,
  FaImage, FaCode, FaMobileAlt, FaBrain, FaUserShield,
  FaHeadphones, FaIdCard, FaRegSmile
} = require("react-icons/fa");

// ======= Icon rendering helpers =======
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ======= Shared factory functions (avoid object reuse bug) =======
const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

// ======= Colors =======
const C = {
  primary: "1B3A5C",
  primaryDark: "132A42",
  accent: "D4884A",
  accentLight: "F0C78E",
  bgLight: "F7F2EC",
  bgCard: "FFFFFF",
  textDark: "1B3A5C",
  textBody: "4A5568",
  textMuted: "8B9EB0",
  white: "FFFFFF",
  riskGreen: "2E7D32",
  riskYellow: "E65100",
  riskRed: "C62828",
  riskGreenBg: "E8F5E9",
  riskYellowBg: "FFF3E0",
  riskRedBg: "FFEBEE",
  lineLight: "E8E0D9",
};

// ======= ICON PRESETS (generated once) =======
let ICONS = {};

async function loadIcons() {
  const pairs = [
    ["shield", FaShieldAlt, C.primary, 256],
    ["camera", FaCamera, C.accent, 256],
    ["robot", FaRobot, C.accent, 256],
    ["volume", FaVolumeUp, C.accent, 256],
    ["history", FaHistory, C.accent, 256],
    ["question", FaQuestionCircle, C.accent, 256],
    ["checkGreen", FaCheckCircle, C.riskGreen, 256],
    ["warnYellow", FaExclamationTriangle, C.riskYellow, 256],
    ["chart", FaChartLine, C.primary, 256],
    ["users", FaUsers, C.primary, 256],
    ["lightbulb", FaLightbulb, C.accent, 256],
    ["heart", FaHeart, C.riskRed, 256],
    ["arrowRight", FaArrowRight, C.accent, 256],
    ["cogs", FaCogs, C.primary, 256],
    ["eye", FaEye, C.primary, 256],
    ["search", FaSearch, C.accent, 256],
    ["handshake", FaHandshake, C.primary, 256],
    ["star", FaStar, C.accent, 256],
    ["wrench", FaWrench, C.primary, 256],
    ["lock", FaLock, C.primary, 256],
    ["clipboard", FaClipboardCheck, C.accent, 256],
    ["comments", FaComments, C.accent, 256],
    ["sync", FaSyncAlt, C.primary, 256],
    ["bug", FaBug, C.riskRed, 256],
    ["image", FaImage, C.primary, 256],
    ["code", FaCode, C.primary, 256],
    ["mobile", FaMobileAlt, C.primary, 256],
    ["brain", FaBrain, C.accent, 256],
    ["userShield", FaUserShield, C.accent, 256],
    ["headphones", FaHeadphones, C.accent, 256],
    ["idCard", FaIdCard, C.primary, 256],
    ["smile", FaRegSmile, C.accent, 256],
    // white variants for dark backgrounds
    ["shieldW", FaShieldAlt, C.white, 256],
    ["cameraW", FaCamera, C.white, 256],
    ["robotW", FaRobot, C.white, 256],
    ["volumeW", FaVolumeUp, C.white, 256],
    ["heartW", FaHeart, C.white, 256],
    ["starW", FaStar, C.white, 256],
    ["lightbulbW", FaLightbulb, C.white, 256],
    ["usersW", FaUsers, C.white, 256],
    ["chartW", FaChartLine, C.white, 256],
    ["handshakeW", FaHandshake, C.white, 256],
    ["checkW", FaCheckCircle, C.white, 256],
    ["brainW", FaBrain, C.white, 256],
    ["arrowW", FaArrowRight, C.white, 256],
  ];
  for (const [key, comp, color, size] of pairs) {
    ICONS[key] = await iconToBase64Png(comp, `#${color}`, size);
  }
}

// ======= Helper: add icon in colored circle =======
function addIconCircle(slide, iconData, x, y, circleSize, circleColor, opts = {}) {
  const size = circleSize || 0.6;
  slide.addShape("oval", {
    x, y, w: size, h: size,
    fill: { color: circleColor, transparency: opts.transparency || 0 },
  });
  const pad = size * 0.25;
  slide.addImage({
    data: iconData,
    x: x + pad, y: y + pad,
    w: size - pad * 2, h: size - pad * 2,
  });
}

// ======= Helper: add card with left accent bar =======
function addCard(slide, x, y, w, h, title, bodyLines, titleSize) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.bgCard },
    shadow: makeShadow(),
  });
  slide.addShape("rect", {
    x, y, w: 0.06, h,
    fill: { color: C.accent },
  });
  // Title
  slide.addText(title, {
    x: x + 0.3, y: y + 0.15, w: w - 0.5, h: 0.4,
    fontSize: titleSize || 13, fontFace: "Calibri", bold: true,
    color: C.textDark, margin: 0,
  });
  // Body
  if (bodyLines && bodyLines.length > 0) {
    const textArr = bodyLines.map((line, i) => ({
      text: line,
      options: { fontSize: 11, color: C.textBody, breakLine: i < bodyLines.length - 1, fontFace: "Calibri" },
    }));
    slide.addText(textArr, {
      x: x + 0.3, y: y + 0.55, w: w - 0.5, h: h - 0.7,
      valign: "top", margin: 0,
    });
  }
}

// ========== MAIN ==========
async function main() {
  await loadIcons();

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "银龄金融安全助手项目组";
  pres.title = "银龄金融安全助手 - 项目汇报";

  // ================================================================
  // SLIDE 01: 封面
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.primaryDark };
    // Decorative top bar
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    // Logo/icon area
    addIconCircle(s, ICONS.shieldW, 4.55, 0.8, 0.9, C.accent, { transparency: 20 });
    // Main title
    s.addText("银龄金融安全助手", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: 42, fontFace: "Georgia", bold: true,
      color: C.white, align: "center", margin: 0,
    });
    // Subtitle
    s.addText("面向老年群体的AI智能金融反诈微信小程序", {
      x: 1, y: 2.8, w: 8, h: 0.5,
      fontSize: 18, fontFace: "Calibri", color: C.accentLight,
      align: "center", margin: 0,
    });
    // Divider
    s.addShape("rect", { x: 3.5, y: 3.5, w: 3, h: 0.03, fill: { color: C.accent } });
    // Info
    s.addText([
      { text: "项目阶段汇报", options: { fontSize: 16, color: C.white, breakLine: true } },
      { text: "2026年6月", options: { fontSize: 13, color: C.textMuted } },
    ], {
      x: 1, y: 3.7, w: 8, h: 0.8,
      align: "center", fontFace: "Calibri", margin: 0,
    });
    // Bottom bar
    s.addShape("rect", { x: 0, y: 5.5, w: 10, h: 0.125, fill: { color: C.accent } });
  }

  // ================================================================
  // SLIDE 02: 目录
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    const items = [
      ["01", "项目背景与意义", ICONS.lightbulb],
      ["02", "产品定位与核心价值", ICONS.star],
      ["03", "项目完整流程", ICONS.sync],
      ["04", "核心功能模块", ICONS.cogs],
      ["05", "开发工作量展示", ICONS.chart],
      ["06", "关键问题与解决方案", ICONS.wrench],
      ["07", "技术架构与创新点", ICONS.brain],
      ["08", "适老化设计特色", ICONS.eye],
      ["09", "项目成果与社会价值", ICONS.handshake],
      ["10", "未来规划", ICONS.arrowRight],
    ];
    // Left dark panel
    s.addShape("rect", { x: 0, y: 0, w: 3.2, h: 5.625, fill: { color: C.primaryDark } });
    s.addText("目  录", {
      x: 0.3, y: 1.8, w: 2.6, h: 1,
      fontSize: 36, fontFace: "Georgia", bold: true,
      color: C.white, align: "center", margin: 0,
    });
    s.addText("CONTENTS", {
      x: 0.3, y: 2.8, w: 2.6, h: 0.5,
      fontSize: 11, fontFace: "Calibri", color: C.textMuted,
      align: "center", letterSpacing: 6, margin: 0,
    });
    // Grid items on right
    const cols = 2, rows = 5;
    const startX = 3.6, startY = 0.3;
    const cellW = 3.0, cellH = 0.9;
    const gapX = 0.25, gapY = 0.1;
    for (let i = 0; i < items.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cellW + gapX);
      const cy = startY + row * (cellH + gapY);
      const [num, title, icon] = items[i];
      // Card
      s.addShape("rect", { x: cx, y: cy, w: cellW, h: cellH, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addShape("rect", { x: cx, y: cy, w: 0.05, h: cellH, fill: { color: C.accent } });
      s.addText(num, {
        x: cx + 0.2, y: cy + 0.1, w: 0.6, h: cellH - 0.2,
        fontSize: 22, fontFace: "Georgia", bold: true, color: C.accent,
        valign: "middle", margin: 0,
      });
      s.addImage({ data: icon, x: cx + cellW - 0.55, y: cy + 0.2, w: 0.35, h: 0.35 });
      s.addText(title, {
        x: cx + 0.75, y: cy + 0.1, w: cellW - 1.4, h: cellH - 0.2,
        fontSize: 13, fontFace: "Calibri", color: C.textDark,
        valign: "middle", margin: 0,
      });
    }
  }

  // ================================================================
  // SLIDE 03: 项目背景与意义
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("项目背景与意义", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("BACKGROUND & SIGNIFICANCE", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // Left: 3 stat callouts
    const stats = [
      ["2.8亿+", "60岁以上人口\n老龄化加速推进", ICONS.users],
      ["60%+", "老年诈骗案件中\n网络/电话诈骗占比", ICONS.warnYellow],
      ["90%", "老年人遭遇诈骗后\n不敢主动求助", ICONS.heart],
    ];
    stats.forEach(([num, desc, icon], i) => {
      const sy = 1.55 + i * 1.3;
      s.addShape("rect", { x: 0.5, y: sy, w: 4.2, h: 1.1, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addImage({ data: icon, x: 0.7, y: sy + 0.15, w: 0.45, h: 0.45 });
      s.addText(num, {
        x: 1.3, y: sy + 0.1, w: 2, h: 0.55,
        fontSize: 28, fontFace: "Georgia", bold: true, color: C.accent, margin: 0,
      });
      s.addText(desc, {
        x: 1.3, y: sy + 0.6, w: 3.2, h: 0.5,
        fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0,
      });
    });

    // Right: 2 problem cards
    addCard(s, 5.1, 1.55, 4.5, 1.5,
      "市场痛点",
      [
        "• 现有反诈宣传专业术语多、内容晦涩",
        "• 缺少专门面向老年人的通俗化解读",
        "• 页面设计不适老，交互复杂难上手",
        "• 老年人金融知识匮乏，风险辨别能力弱",
        "• 诈骗手段不断翻新：AI语音、仿冒平台等",
      ], 14
    );
    addCard(s, 5.1, 3.25, 4.5, 1.5,
      "项目核心意义",
      [
        "• 弥合老年群体数字鸿沟，守护财产安全",
        "• 打造「拍照即辨险」的极简反诈入口",
        "• 建立标准化养老金融风险语料库",
        "• 为养老金融风险研究提供数据支撑",
      ], 14
    );
  }

  // ================================================================
  // SLIDE 04: 产品定位与核心价值
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("产品定位与核心价值", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("PRODUCT POSITIONING & CORE VALUES", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // Product positioning
    s.addShape("rect", { x: 0.5, y: 1.5, w: 9, h: 0.85, fill: { color: C.bgCard }, shadow: makeShadow() });
    s.addShape("rect", { x: 0.5, y: 1.5, w: 0.06, h: 0.85, fill: { color: C.accent } });
    s.addText("面向老年群体的轻量化、适老化AI金融反诈微信小程序", {
      x: 0.8, y: 1.5, w: 8.5, h: 0.85,
      fontSize: 18, fontFace: "Georgia", bold: true, color: C.textDark,
      valign: "middle", margin: 0,
    });

    // 4 core values - 2x2 grid
    const values = [
      { icon: ICONS.brain, title: "智能风险识别", desc: "精准识别金融诈骗、非法集资、\n高收益诱导、仿冒平台等各类\n养老金融风险" },
      { icon: ICONS.comments, title: "通俗风险转译", desc: "将晦涩的金融条款、专业话术、\n诈骗套路转化为老年人易懂的\n口语化表达" },
      { icon: ICONS.eye, title: "全流程适老化", desc: "大字体、高对比配色、极简交互、\n语音朗读、图形化提示\n降低使用门槛" },
      { icon: ICONS.chart, title: "数据研究价值", desc: "沉淀诈骗案例、高频话术、\n风险样本，构建标准化\n养老金融风险语料库" },
    ];
    values.forEach((v, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const vx = 0.5 + col * 4.7;
      const vy = 2.65 + row * 1.4;
      s.addShape("rect", { x: vx, y: vy, w: 4.4, h: 1.2, fill: { color: C.bgCard }, shadow: makeShadow() });
      addIconCircle(s, v.icon, vx + 0.15, vy + 0.2, 0.55, C.accent, { transparency: 15 });
      s.addText(v.title, {
        x: vx + 0.9, y: vy + 0.1, w: 3.2, h: 0.4,
        fontSize: 16, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
      });
      s.addText(v.desc, {
        x: vx + 0.25, y: vy + 0.55, w: 3.9, h: 0.6,
        fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 05: 项目完整流程
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("项目完整流程", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("COMPLETE WORKFLOW", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // User flow - horizontal steps
    const steps = [
      { icon: ICONS.camera, label: "拍照/上传" },
      { icon: ICONS.image, label: "OCR图文识别" },
      { icon: ICONS.robot, label: "AI风险分析" },
      { icon: ICONS.clipboard, label: "风险结果展示" },
      { icon: ICONS.volume, label: "语音播报" },
    ];
    const flowY = 1.7;
    const flowStartX = 0.5;
    const stepW = 1.6;
    const arrowW = 0.3;

    steps.forEach((st, i) => {
      const sx = flowStartX + i * (stepW + arrowW);
      // Step card
      s.addShape("rect", { x: sx, y: flowY, w: stepW, h: 1.2, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addShape("rect", { x: sx, y: flowY, w: stepW, h: 0.05, fill: { color: C.accent } });
      addIconCircle(s, st.icon, sx + stepW / 2 - 0.25, flowY + 0.15, 0.5, C.accent, { transparency: 15 });
      s.addText(st.label, {
        x: sx, y: flowY + 0.72, w: stepW, h: 0.4,
        fontSize: 12, fontFace: "Calibri", bold: true, color: C.textDark,
        align: "center", margin: 0,
      });
      // Arrow between steps
      if (i < steps.length - 1) {
        s.addImage({ data: ICONS.arrowRight, x: sx + stepW + 0.02, y: flowY + 0.35, w: arrowW - 0.04, h: 0.3 });
      }
    });

    // Section: technical architecture
    s.addText("技术架构", {
      x: 0.5, y: 3.3, w: 4, h: 0.4,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    const techLayers = [
      { color: C.primary, label: "微信小程序前端", sub: "UniApp + Vue3", w: 4.2 },
      { color: C.accent, label: "API网关 + 业务逻辑层", sub: "路由分发 / 鉴权 / 限流", w: 4.2 },
      { color: C.primaryDark, label: "AI服务层", sub: "GLM-4.6V视觉模型 / OCR识别 / 关键词引擎", w: 9.0 },
    ];
    techLayers.forEach((layer, i) => {
      const ly = 3.8 + i * 0.55;
      s.addShape("rect", {
        x: 0.5, y: ly, w: layer.w, h: 0.45,
        fill: { color: layer.color },
      });
      s.addText(layer.label + "    " + layer.sub, {
        x: 0.7, y: ly, w: layer.w - 0.4, h: 0.45,
        fontSize: 11, fontFace: "Calibri", color: C.white,
        valign: "middle", margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 06: 核心功能模块
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("核心功能模块", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("CORE FUNCTIONAL MODULES", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    const modules = [
      { icon: ICONS.camera, title: "拍照识别", desc: "调用相机实时拍摄\n大号按钮居中突出\n一键发起风险识别" },
      { icon: ICONS.image, title: "相册上传", desc: "调取微信相册\n选择已保存的截图\n支持聊天/短信/广告" },
      { icon: ICONS.search, title: "OCR文字提取", desc: "精准提取图片全文\n自动标注高危关键词\n支持模糊/倾斜文档" },
      { icon: ICONS.robot, title: "AI风险分析", desc: "三层风险判定机制\n规则引擎+AI语义\n三大风险类型覆盖" },
      { icon: ICONS.volume, title: "语音播报", desc: "分析完成自动播报\n平缓语速清晰吐字\n支持随时暂停/重听" },
      { icon: ICONS.clipboard, title: "历史记录", desc: "留存所有识别记录\n支持回看/删除\n数据本地安全存储" },
    ];
    modules.forEach((m, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const mx = 0.45 + col * 3.15;
      const my = 1.55 + row * 1.95;
      // Card
      s.addShape("rect", { x: mx, y: my, w: 2.9, h: 1.75, fill: { color: C.bgCard }, shadow: makeShadow() });
      // Top accent
      s.addShape("rect", { x: mx, y: my, w: 2.9, h: 0.04, fill: { color: C.accent } });
      // Icon
      addIconCircle(s, m.icon, mx + 1.07, my + 0.2, 0.55, C.accent, { transparency: 15 });
      // Title
      s.addText(m.title, {
        x: mx + 0.15, y: my + 0.85, w: 2.6, h: 0.35,
        fontSize: 15, fontFace: "Calibri", bold: true, color: C.textDark,
        align: "center", margin: 0,
      });
      // Desc
      s.addText(m.desc, {
        x: mx + 0.15, y: my + 1.15, w: 2.6, h: 0.55,
        fontSize: 10, fontFace: "Calibri", color: C.textBody,
        align: "center", margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 07: 开发工作量展示
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("开发工作量展示", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("DEVELOPMENT WORK METRICS", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // Top: 4 big number cards
    const metrics = [
      { num: "19+", label: "源文件", sub: "Vue组件 + JS模块" },
      { num: "10+", label: "Vue页面组件", sub: "首页/分析/结果/历史等" },
      { num: "80+", label: "高风险关键词", sub: "覆盖8大诈骗类型" },
      { num: "6", label: "核心功能模块", sub: "拍照/OCR/AI/语音/历史/帮助" },
    ];
    metrics.forEach((m, i) => {
      const mx = 0.45 + i * 2.35;
      s.addShape("rect", { x: mx, y: 1.5, w: 2.1, h: 1.5, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addText(m.num, {
        x: mx + 0.1, y: 1.55, w: 1.9, h: 0.65,
        fontSize: 36, fontFace: "Georgia", bold: true, color: C.accent,
        align: "center", margin: 0,
      });
      s.addText(m.label, {
        x: mx + 0.1, y: 2.15, w: 1.9, h: 0.35,
        fontSize: 14, fontFace: "Calibri", bold: true, color: C.textDark,
        align: "center", margin: 0,
      });
      s.addText(m.sub, {
        x: mx + 0.1, y: 2.5, w: 1.9, h: 0.4,
        fontSize: 10, fontFace: "Calibri", color: C.textMuted,
        align: "center", margin: 0,
      });
    });

    // Development phases table
    s.addText("开发阶段总览", {
      x: 0.5, y: 3.3, w: 4, h: 0.4,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    const rows = [
      ["第一阶段", "基础框架搭建", "首页、拍照上传、图片压缩、隐私弹窗"],
      ["第二阶段", "AI核心能力", "对接GLM-4.6V、风险判定、JSON解析、缓存"],
      ["第三阶段", "适老化完善", "语音播报、历史记录、帮助中心、结果页"],
      ["第四阶段", "优化与联调", "关键词库扩容、重试机制、兜底逻辑、BUG修复"],
    ];
    const headerRow = [
      { text: "阶段", options: { fill: { color: C.primary }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
      { text: "主要内容", options: { fill: { color: C.primary }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
      { text: "具体产出", options: { fill: { color: C.primary }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri", align: "center" } },
    ];
    const dataRows = rows.map((r, i) => r.map((cell, j) => ({
      text: cell,
      options: {
        fill: { color: i % 2 === 0 ? C.white : "F0EBE4" },
        color: C.textBody, fontSize: 10, fontFace: "Calibri",
        align: j === 0 ? "center" : "left",
      },
    })));
    s.addTable([headerRow, ...dataRows], {
      x: 0.5, y: 3.75, w: 9, h: 1.7,
      colW: [1.2, 1.8, 6.0],
      border: { pt: 0.5, color: C.lineLight },
      margin: [4, 8, 4, 8],
    });
  }

  // ================================================================
  // SLIDE 08: 关键问题与解决方案（上）
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("开发协作：关键问题与解决方案（上）", {
      x: 0.6, y: 0.2, w: 9, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("KEY PROBLEMS SOLVED DURING DEVELOPMENT (1/2)", {
      x: 0.6, y: 0.85, w: 9, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    const problems = [
      {
        icon: ICONS.bug, num: "01",
        title: "域名白名单错误（request: fail URL not in domain list）",
        prob: "问题：API请求 open.bigmodel.cn 被微信域名校验拦截，真机调试时即使配置了合法域名仍报错。",
        sol: "解决：修改 project.private.config.json 设置 urlCheck: false 用于开发调试；指导在微信公众平台后台添加 request 合法域名；针对测试号在开发者工具【域名信息】中单独配置。",
      },
      {
        icon: ICONS.bug, num: "02",
        title: "图片缓存哈希碰撞 — 始终显示同一结果",
        prob: "问题：simpleHash 只取 Base64 前 64 字符，但 JPEG/PNG 文件头完全一致，导致 A 图分析后 B/C/D 图全部命中缓存返回 A 的结果。",
        sol: "解决：重写哈希算法 — 取首部256 + 中部256 + 尾部256 字符拼接后做 djb2 校验和；缓存 Key 加版本号 v2 使旧脏缓存失效；新增调试日志输出每次指纹。",
      },
      {
        icon: ICONS.bug, num: "03",
        title: "模型返回格式异常 — JSON 解析频繁失败",
        prob: "问题：AI 模型输出有时带 ```json 标记、尾部逗号、未转义换行、嵌套括号等非纯 JSON，原有 2 种简单尝试不足以覆盖。",
        sol: "解决：① 添加 response_format 强制 JSON 输出模式；② 构建 5 层递进解析引擎（直接解析→去 markdown→贪婪正则→平衡括号→自动修复）；③ 新增 fallbackFromRawText() 兜底，解析失败仍能输出可用结果。",
      },
    ];

    problems.forEach((p, i) => {
      const py = 1.5 + i * 1.3;
      s.addShape("rect", { x: 0.4, y: py, w: 9.2, h: 1.15, fill: { color: C.bgCard }, shadow: makeShadow() });
      // Number circle
      s.addShape("oval", { x: 0.55, y: py + 0.08, w: 0.42, h: 0.42, fill: { color: C.accent } });
      s.addText(p.num, {
        x: 0.55, y: py + 0.08, w: 0.42, h: 0.42,
        fontSize: 14, fontFace: "Georgia", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      // Title
      s.addText(p.title, {
        x: 1.15, y: py + 0.05, w: 8.2, h: 0.3,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
      });
      // Problem
      s.addText(p.prob, {
        x: 1.15, y: py + 0.35, w: 8.2, h: 0.35,
        fontSize: 9, fontFace: "Calibri", color: C.riskRed, margin: 0,
      });
      // Solution
      s.addText(p.sol, {
        x: 1.15, y: py + 0.65, w: 8.2, h: 0.5,
        fontSize: 9, fontFace: "Calibri", color: C.riskGreen, margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 09: 关键问题与解决方案（下）
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("开发协作：关键问题与解决方案（下）", {
      x: 0.6, y: 0.2, w: 9, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("KEY PROBLEMS SOLVED DURING DEVELOPMENT (2/2)", {
      x: 0.6, y: 0.85, w: 9, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    const problems = [
      {
        icon: ICONS.bug, num: "04",
        title: "高风险判定从未触发 — 词库过窄 + AI 保守",
        prob: "问题：原 HIGH_RISK_KEYWORDS 仅 19 条，「公检法」「法院传票」等典型诈骗词还在 caution 里，且 Prompt 判断标准过于笼统。",
        sol: "解决：高风险词库扩展至 80+ 条，按 8 大诈骗类型分类；「公检法/冒充/钓鱼链接」等从 caution 移至 HIGH；新增组合升级机制（≥3 条 caution → auto HIGH）；Prompt 重写强调「宁可误判高也不要漏判」。",
      },
      {
        icon: ICONS.bug, num: "05",
        title: "模型返回为空 — API 偶发无响应",
        prob: "问题：max_tokens=1024 偏小，无重试机制，API 返回空或 finish_reason=length 截断时直接抛 error 阻塞用户使用。",
        sol: "解决：① 3 次指数退避重试（2s/4s）；② 检测到 length 截断自动翻倍 max_tokens；③ max_tokens 提升至 2048；④ 新增 makeEmptyFallbackResult() 终极兜底，所有重试失败仍返回友好提示而非报错。",
      },
      {
        icon: ICONS.star, num: "06",
        title: "其他优化：适老化交互与系统健壮性",
        prob: "问题：分析结果页缺少语音播报自动触发、历史记录数据持久化需优化、低风险结果需安全语言过滤防止误导老人。",
        sol: "解决：语音播报自动触发机制 + 常驻播放/暂停按钮；storage 模块封装缓存 LRU 淘汰（上限 50 条）；低风险结果强制替换「内容安全/无风险」等绝对描述为审慎表述，保障老年用户不被误导。",
      },
    ];

    problems.forEach((p, i) => {
      const py = 1.5 + i * 1.3;
      s.addShape("rect", { x: 0.4, y: py, w: 9.2, h: 1.15, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addShape("oval", { x: 0.55, y: py + 0.08, w: 0.42, h: 0.42, fill: { color: i === 2 ? C.riskGreen : C.accent } });
      s.addText(p.num, {
        x: 0.55, y: py + 0.08, w: 0.42, h: 0.42,
        fontSize: 14, fontFace: "Georgia", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(p.title, {
        x: 1.15, y: py + 0.05, w: 8.2, h: 0.3,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
      });
      s.addText(p.prob, {
        x: 1.15, y: py + 0.35, w: 8.2, h: 0.35,
        fontSize: 9, fontFace: "Calibri", color: C.riskRed, margin: 0,
      });
      s.addText(p.sol, {
        x: 1.15, y: py + 0.65, w: 8.2, h: 0.5,
        fontSize: 9, fontFace: "Calibri", color: C.riskGreen, margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 10: 技术架构与创新点
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("技术架构与创新点", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("TECHNICAL ARCHITECTURE & INNOVATIONS", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // Left: 3-layer risk engine
    s.addText("三层风险判定引擎", {
      x: 0.5, y: 1.45, w: 5, h: 0.4,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    const layers = [
      { color: C.primary, label: "第一层 规则引擎", desc: "80+ 关键词库扫描，组合升级机制" },
      { color: C.accent, label: "第二层 AI语义分析", desc: "GLM-4.6V 视觉模型，上下文语义判读" },
      { color: C.riskGreen, label: "第三层 综合打分", desc: "规则得分 + AI结论 → 低/慎/高三等级" },
    ];
    layers.forEach((l, i) => {
      const ly = 1.95 + i * 0.65;
      s.addShape("rect", { x: 0.5, y: ly, w: 4.5, h: 0.55, fill: { color: l.color } });
      s.addText(l.label, {
        x: 0.7, y: ly, w: 2, h: 0.55,
        fontSize: 11, fontFace: "Calibri", bold: true, color: C.white,
        valign: "middle", margin: 0,
      });
      s.addText(l.desc, {
        x: 2.7, y: ly, w: 2.2, h: 0.55,
        fontSize: 9, fontFace: "Calibri", color: C.white,
        valign: "middle", margin: 0,
      });
    });

    // JSON parse engine summary box
    s.addShape("rect", { x: 0.5, y: 3.95, w: 4.5, h: 1.5, fill: { color: C.bgCard }, shadow: makeShadow() });
    s.addShape("rect", { x: 0.5, y: 3.95, w: 0.05, h: 1.5, fill: { color: C.accent } });
    s.addText("5层JSON解析回退引擎", {
      x: 0.75, y: 4.0, w: 4, h: 0.3,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    s.addText([
      { text: "① 直接解析 → ② 去Markdown → ③ 贪婪正则", options: { breakLine: true, fontSize: 9, color: C.textBody } },
      { text: "④ 平衡括号 → ⑤ 自动修复 → 兜底提取", options: { fontSize: 9, color: C.textBody } },
    ], { x: 0.75, y: 4.35, w: 4, h: 1, fontFace: "Calibri", margin: 0 });

    // Right: 4 innovations
    const innovations = [
      { icon: ICONS.comments, title: "金融话术→老年口语", desc: "独创适老化风险转译，摒弃专业术语" },
      { icon: ICONS.eye, title: "全链路适老化交互", desc: "字体/配色/按钮/语音全套适配" },
      { icon: ICONS.search, title: "场景垂直化定位", desc: "聚焦养老金融+老年诈骗细分场景" },
      { icon: ICONS.chart, title: "数据价值复用", desc: "自动沉淀诈骗话术，构建风险语料库" },
    ];
    innovations.forEach((inv, i) => {
      const iy = 1.5 + i * 0.96;
      s.addShape("rect", { x: 5.3, y: iy, w: 4.3, h: 0.82, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addImage({ data: inv.icon, x: 5.45, y: iy + 0.13, w: 0.38, h: 0.38 });
      s.addText(inv.title, {
        x: 5.95, y: iy + 0.08, w: 3.4, h: 0.3,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
      });
      s.addText(inv.desc, {
        x: 5.55, y: iy + 0.42, w: 3.8, h: 0.35,
        fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 11: 适老化设计特色
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("适老化设计特色", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("SENIOR-FRIENDLY DESIGN FEATURES", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    const features = [
      { icon: ICONS.eye, title: "字体规范", items: ["基础正文 ≥ 18px", "风险等级/按钮 ≥ 24px", "无衬线字体，不加斜体"] },
      { icon: ICONS.mobile, title: "交互极简", items: ["少输入、少跳转、少弹窗", "按钮放大、间距加宽", "全程拍照/上传为主"] },
      { icon: ICONS.idCard, title: "高对比配色", items: ["绿色·低风险 | 黄色·需谨慎", "红色·高风险 | 浅底配深字", "色盲友好，红绿独立辨识"] },
      { icon: ICONS.volume, title: "语音播报", items: ["分析完成自动朗读", "平缓语速，吐字清晰", "常驻播放/暂停按钮"] },
      { icon: ICONS.lock, title: "隐私安全", items: ["敏感信息自动脱敏", "HTTPS加密传输", "首次使用弹窗授权"] },
      { icon: ICONS.comments, title: "语言通俗", items: ["零金融专业术语", "口语化一句话一个意思", "语气严肃但温和"] },
    ];

    features.forEach((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const fx = 0.45 + col * 3.15;
      const fy = 1.5 + row * 2.0;
      s.addShape("rect", { x: fx, y: fy, w: 2.9, h: 1.82, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addShape("rect", { x: fx, y: fy, w: 2.9, h: 0.04, fill: { color: C.accent } });
      addIconCircle(s, f.icon, fx + 1.05, fy + 0.15, 0.5, C.accent, { transparency: 15 });
      s.addText(f.title, {
        x: fx + 0.1, y: fy + 0.72, w: 2.7, h: 0.3,
        fontSize: 14, fontFace: "Calibri", bold: true, color: C.textDark,
        align: "center", margin: 0,
      });
      s.addText(f.items.map((it, idx) => ({
        text: "• " + it,
        options: { bullet: false, breakLine: idx < f.items.length - 1, fontSize: 10, color: C.textBody, fontFace: "Calibri" },
      })), {
        x: fx + 0.15, y: fy + 1.05, w: 2.6, h: 0.75,
        valign: "top", margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 12: 项目成果与社会价值
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("项目成果与社会价值", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("ACHIEVEMENTS & SOCIAL VALUE", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    // Left: Product & Technical achievements
    s.addText("产品成果", {
      x: 0.5, y: 1.45, w: 4, h: 0.35,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    s.addShape("rect", { x: 0.5, y: 1.85, w: 4.3, h: 1.65, fill: { color: C.bgCard }, shadow: makeShadow() });
    s.addShape("rect", { x: 0.5, y: 1.85, w: 0.05, h: 1.65, fill: { color: C.riskGreen } });
    s.addText([
      { text: "✓ 完整微信小程序 V1.0", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 拍照识别 + AI分析 + 语音播报", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 三层风险判定引擎（80+关键词）", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 全流程适老化交互体验", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 历史记录 + 帮助中心", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 隐私弹窗 + 数据脱敏 + 安全过滤", options: { fontSize: 11, color: C.textBody } },
    ], { x: 0.75, y: 1.95, w: 3.8, h: 1.5, fontFace: "Calibri", margin: 0 });

    // Technical achievements
    s.addText("技术成果", {
      x: 5.2, y: 1.45, w: 4, h: 0.35,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
    });
    s.addShape("rect", { x: 5.2, y: 1.85, w: 4.3, h: 1.65, fill: { color: C.bgCard }, shadow: makeShadow() });
    s.addShape("rect", { x: 5.2, y: 1.85, w: 0.05, h: 1.65, fill: { color: C.accent } });
    s.addText([
      { text: "✓ 5层JSON递进解析引擎", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 智能哈希缓存 + 版本化Key", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 3次指数退避重试机制", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 多层安全兜底（永不出错）", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 关键词组合升级 + 本地扫描", options: { breakLine: true, fontSize: 11, color: C.textBody } },
      { text: "✓ 可复用适老化交互方案", options: { fontSize: 11, color: C.textBody } },
    ], { x: 5.45, y: 1.95, w: 3.8, h: 1.5, fontFace: "Calibri", margin: 0 });

    // Bottom: Social value - 4 cards
    const values = [
      { icon: ICONS.usersW, title: "赋能老年群体", desc: "提升老年人自主\n辨别金融风险能力" },
      { icon: ICONS.shieldW, title: "守护财产安全", desc: "针对性打击养老\n诈骗，减少损失" },
      { icon: ICONS.mobile, title: "弥合数字鸿沟", desc: "优化适老化体验\n让科技服务老人" },
      { icon: ICONS.chartW, title: "助力行业发展", desc: "服务银发经济\n健康有序推进" },
    ];
    values.forEach((v, i) => {
      const vx = 0.45 + i * 2.35;
      s.addShape("rect", { x: vx, y: 3.75, w: 2.1, h: 1.6, fill: { color: C.primary } });
      addIconCircle(s, v.icon, vx + 0.65, 3.9, 0.55, C.accent, { transparency: 20 });
      s.addText(v.title, {
        x: vx + 0.1, y: 4.5, w: 1.9, h: 0.3,
        fontSize: 14, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", margin: 0,
      });
      s.addText(v.desc, {
        x: vx + 0.1, y: 4.8, w: 1.9, h: 0.5,
        fontSize: 10, fontFace: "Calibri", color: C.accentLight,
        align: "center", margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 13: 未来规划
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.bgLight };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.25, fill: { color: C.primaryDark } });
    s.addText("未来规划", {
      x: 0.6, y: 0.2, w: 8, h: 0.7,
      fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
    });
    s.addText("FUTURE ROADMAP", {
      x: 0.6, y: 0.85, w: 8, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0,
    });

    const plans = [
      { icon: ICONS.headphones, phase: "V1.1", title: "AI语音问答", desc: "支持语音提问，口头咨询防骗问题，老人只需说话就能获得风险分析" },
      { icon: ICONS.users, phase: "V1.2", title: "家属协同监护", desc: "绑定亲属账号，老人识别到高风险时自动推送提醒给家属" },
      { icon: ICONS.handshake, phase: "V1.3", title: "社区联动", desc: "对接社区、养老机构，推送本地反诈通知与线下活动" },
      { icon: ICONS.chart, phase: "V1.4", title: "风险热力图", desc: "可视化展示本地区高发诈骗类型、风险点位，辅助监管决策" },
      { icon: ICONS.cogs, phase: "V2.0", title: "数据驾驶舱", desc: "面向监管、研究机构的风险数据可视化后台，提供研究素材" },
    ];

    plans.forEach((plan, i) => {
      const py = 1.5 + i * 0.78;
      const isLast = i === plans.length - 1;
      // Timeline line
      s.addShape("rect", { x: 2.2, y: py + 0.25, w: 0.03, h: isLast ? 0.5 : 0.78, fill: { color: C.accent } });
      // Circle dot
      s.addShape("oval", { x: 2.05, y: py + 0.18, w: 0.33, h: 0.33, fill: { color: C.accent } });
      s.addText(plan.phase, {
        x: 1.1, y: py + 0.1, w: 0.85, h: 0.3,
        fontSize: 10, fontFace: "Calibri", bold: true, color: C.accent,
        align: "center", margin: 0,
      });
      // Card
      s.addShape("rect", { x: 2.65, y: py, w: 6.8, h: 0.65, fill: { color: C.bgCard }, shadow: makeShadow() });
      s.addImage({ data: plan.icon, x: 2.8, y: py + 0.11, w: 0.32, h: 0.32 });
      s.addText(plan.title, {
        x: 3.25, y: py + 0.05, w: 3, h: 0.28,
        fontSize: 14, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0,
      });
      s.addText(plan.desc, {
        x: 3.25, y: py + 0.32, w: 5.8, h: 0.28,
        fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0,
      });
    });
  }

  // ================================================================
  // SLIDE 14: 感谢页
  // ================================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.primaryDark };
    s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

    addIconCircle(s, ICONS.heartW, 4.4, 1.2, 1.0, C.accent, { transparency: 20 });

    s.addText("感谢聆听", {
      x: 0.5, y: 2.5, w: 9, h: 0.8,
      fontSize: 42, fontFace: "Georgia", bold: true, color: C.white,
      align: "center", margin: 0,
    });
    s.addText("THANK YOU", {
      x: 0.5, y: 3.3, w: 9, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.textMuted,
      align: "center", spacing: 8, margin: 0,
    });
    s.addShape("rect", { x: 3.5, y: 3.95, w: 3, h: 0.03, fill: { color: C.accent } });
    s.addText("银龄金融安全助手  ·  守护每一位长者的财产安全", {
      x: 1, y: 4.2, w: 8, h: 0.5,
      fontSize: 13, fontFace: "Calibri", color: C.accentLight,
      align: "center", margin: 0,
    });

    s.addShape("rect", { x: 0, y: 5.5, w: 10, h: 0.125, fill: { color: C.accent } });
  }

  // ================================================================
  // WRITE FILE
  // ================================================================
  await pres.writeFile({ fileName: "/Applications/中国人民银行/Silver-Finance-Safety-Assistant/ppt/银龄金融安全助手-项目汇报.pptx" });
  console.log("PPT 生成完成：银龄金融安全助手-项目汇报.pptx");
}

main().catch((err) => {
  console.error("PPT 生成失败:", err);
  process.exit(1);
});
