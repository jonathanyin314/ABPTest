/* ============================================================
   APB ELITE v3.3 — 终极完整版 (Manus CTO 整合修复)
   修复清单：
   1. 补全 sportRegistry 皮肤映射引擎（中英双语）
   2. 补全 archetypeMap 全部 16 种人格代码
   3. 修复 generatePoster() 完整 html2canvas 逻辑
   4. 修复 openPaymentModal() 动画 + 社会认同逻辑
   5. 补全 loadSavedQuiz() / clearAndStart() 持久化逻辑
   6. 修复 renderQuestion() 皮肤话术 + 进度条颜色 + 返回按钮
   7. 修复 validateAndStart() 性别校验
   8. 删除末尾多余的 toggleLang() 调用
   9. 页面初始化：自动填充所有 i18n 文案
   ============================================================ */

// ─── 全局状态 ────────────────────────────────────────────────
let currentLang = 'zh';
let isRapidMode = true;
let activeSkin = 'S0';
let currentStep = 0;
let userAnswers = [];
let filteredQuestions = [];
let userProfile = { gender: '', sport: '' };
let validityStatus = { honest: true, consistent: true, attentive: true };

// ─── 1. 国际化字典 ────────────────────────────────────────────
const translations = {
    zh: {
        homeSubtitle: "竞技表现基因图谱",
        startBtn: "开始评估",
        box1Title: "感知通道", box1Desc: "识别你对视觉引导或身体触感的依赖程度。",
        box2Title: "指令偏好", box2Desc: "解析大脑在压力下对内部发力或外部目标的指令优先级。",
        box3Title: "注意广度", box3Desc: "评估你在高压环境下是倾向于全场扫描还是精准锁定。",
        confirmTitle: "扫描完成",
        confirmDesc: "你的竞技 DNA 序列已准备就绪，点击下方按钮解析人格画像。",
        revealBtn: "揭晓我的竞技人格",
        confirmBack: "返回检查",
        downloadText: "保存专属结果海报",
        purchaseBtnText: "获取完整报告",
        detected: "系统已自动加载模组：",
        socialProof: "已有",
        socialProofSuffix: "位精英运动员获得报告",
        continueMsg: "发现上次未完成的测评，是否继续？",
        continueBtn: "继续测评",
        restartBtn: "重新开始",
        backBtn: "← 返回上一题",
        generatingBtn: "生成中...",
        identityTitle: "竞技身份档案",
        xfactorTitle: "X 因子分析",
        adviceTitle: "教练建议",
        motLabel: "动力引擎",
        regLabel: "情绪调节",
        lrnLabel: "学习风格"
    },
    en: {
        homeSubtitle: "ATHLETE PERFORMANCE BLUEPRINT",
        startBtn: "START ASSESSMENT",
        box1Title: "Perception", box1Desc: "Identify your reliance on visual guidance or kinesthetic feel.",
        box2Title: "Cue Preference", box2Desc: "Analyze brain priority between internal mechanics or external goals.",
        box3Title: "Attention Span", box3Desc: "Evaluate whether you scan the field or lock onto specific targets.",
        confirmTitle: "SCAN COMPLETE",
        confirmDesc: "Your athletic DNA sequence is ready. Click below to reveal your archetype.",
        revealBtn: "REVEAL MY ARCHETYPE",
        confirmBack: "Back to Review",
        downloadText: "SAVE RESULT POSTER",
        purchaseBtnText: "GET FULL REPORT",
        detected: "SYSTEM LOADED MODULE: ",
        socialProof: "",
        socialProofSuffix: "ATHLETES UNLOCKED THEIR REPORTS",
        continueMsg: "Saved progress found. Continue?",
        continueBtn: "Continue",
        restartBtn: "Restart",
        backBtn: "← Back",
        generatingBtn: "Generating...",
        identityTitle: "Athletic Identity Profile",
        xfactorTitle: "X-Factor Analysis",
        adviceTitle: "Coaching Recommendations",
        motLabel: "Motivation Engine",
        regLabel: "Emotional Regulation",
        lrnLabel: "Learning Style"
    }
};

// ─── 2. 皮肤映射引擎（中英双语）────────────────────────────────
const sportRegistry = {
    S1: ["篮球", "足球", "橄榄球", "手球", "曲棍球", "排球", "棒球", "垒球",
         "basket", "football", "soccer", "rugby", "handball", "hockey", "volleyball", "baseball", "netball", "cricket"],
    S2: ["拳击", "格斗", "击剑", "跆拳道", "柔道", "摔跤", "空手道", "泰拳", "散打",
         "mma", "box", "fight", "fencing", "judo", "wrestling", "karate", "muay", "sanda"],
    S3: ["网球", "羽毛球", "乒乓球", "壁球", "匹克球", "板式网球",
         "tennis", "badminton", "pingpong", "table tennis", "squash", "pickleball", "padel"],
    S4: ["高尔夫", "射击", "射箭", "保龄球", "台球", "斯诺克", "冰壶",
         "golf", "shoot", "archery", "bowling", "billiards", "snooker", "curling"],
    S5: ["举重", "短跑", "游泳", "跳远", "跳高", "铅球", "田径",
         "weight", "sprint", "swim", "jump", "throw", "shot put", "track", "field"],
    S6: ["体操", "花样滑冰", "跳水", "冲浪", "滑板", "攀岩", "舞蹈", "霹雳舞", "马术",
         "gymnastics", "skating", "diving", "surf", "climb", "dance", "breaking", "equestrian"],
    S7: ["马拉松", "自行车", "铁人三项", "越野跑", "赛艇", "皮划艇", "滑雪",
         "marathon", "cycling", "triathlon", "running", "rowing", "kayak", "ski"]
};

// ─── 3. 全 16 种竞技人格代码 ──────────────────────────────────
const archetypeMap = {
    "BITS": { cn: "统帅", en: "The Commander",         oneLiner: "全场在你眼中是一盘棋，你是那个走最后一步的人。" },
    "BITR": { cn: "点火者", en: "The Igniter",          oneLiner: "你在混乱中找到秩序，用情绪点燃团队。" },
    "BETS": { cn: "驱动者", en: "The Driver",           oneLiner: "你用结果说话，每一次胜利都是对自己的证明。" },
    "BETR": { cn: "爆破手", en: "The Detonator",        oneLiner: "压力是你的燃料，关键时刻你总能引爆全场。" },
    "NITS": { cn: "狙击手", en: "The Sniper",           oneLiner: "你屏蔽一切噪音，只专注于那一个完美时机。" },
    "NITR": { cn: "精密仪器", en: "The Precision Engine", oneLiner: "你在极度专注中找到流动感，细节是你的武器。" },
    "NETS": { cn: "终结者", en: "The Finisher",         oneLiner: "你为结果而生，最后一秒的压力反而让你更清醒。" },
    "NETR": { cn: "刀锋", en: "The Edge",               oneLiner: "你在逆境中磨砺自己，越是艰难越能激发潜能。" },
    "BITE": { cn: "战略家", en: "The Strategist",       oneLiner: "你用全局视野规划每一步，过程比结果更重要。" },
    "BIRE": { cn: "教练型领袖", en: "The Coach",        oneLiner: "你天生懂得激励他人，团队的成长是你最大的成就。" },
    "BETE": { cn: "探索者", en: "The Explorer",         oneLiner: "你不断突破自己的边界，每一次 PB 都是新的起点。" },
    "BERE": { cn: "斗士", en: "The Warrior",            oneLiner: "你在对抗中成长，每一场硬仗都让你更强大。" },
    "NITE": { cn: "工匠", en: "The Craftsman",          oneLiner: "你对技术的极致追求让你与众不同，完美是你的标准。" },
    "NIRE": { cn: "感知者", en: "The Sensor",           oneLiner: "你的身体是最精密的仪器，动觉反馈是你的核心优势。" },
    "NETE": { cn: "攀登者", en: "The Climber",          oneLiner: "你为超越自己而战，每一个 PB 都是你写给自己的勋章。" },
    "NERE": { cn: "凤凰", en: "The Phoenix",            oneLiner: "你在最艰难的时刻反而能找到最深的专注。" }
};

// ─── 4. 题库（支持皮肤话术 + 中英双语）──────────────────────────
const masterQuestions = [
    // Part 1: Perception [V/K]
    { id: 1, dim: "P", tag: "V/K", rapid: true,
      zh: { S0: "当教练向你展示一个全新的高难度技术动作时，你通常希望：",
            S1: "当教练展示全新的战术配合或高难度动作时，你通常希望：",
            S2: "当教练展示一个新的格挡反击或高难度招式时，你通常希望：",
            S3: "当教练展示一个新的战术落点配合或高难度击球动作时，你通常希望：",
            S4: "当教练展示一个新的精准站位姿态或高难度击发动作时，你通常希望：",
            S5: "当教练展示一个全新的核心发力技巧或高难度动作形态时，你通常希望：",
            S6: "当教练展示一个新的艺术造型或高难度协调组合时，你通常希望：",
            S7: "当教练展示一个新的高效划频、踏频或某种长途巡航姿态时，你通常希望：" },
      en: { S0: "When your coach demonstrates a new complex technique, you usually prefer to:",
            S1: "When your coach shows a new tactical play or complex move, you usually prefer to:" },
      a: "先看几遍演示或录像，在脑子里建立图像", b: "直接上手试两次，通过身体试错找感觉",
      valA: "V", valB: "K" },

    { id: 2, dim: "P", tag: "V/K", rapid: true,
      zh: { S0: '你觉得自己今天"动作顺了"，通常是因为：' },
      en: { S0: "When you feel 'in the zone' today, it's usually because:" },
      a: "我看到了我的动作轨迹非常标准", b: '我感觉到发力的那个"阻力点"对了',
      valA: "V", valB: "K" },

    { id: 3, dim: "P", tag: "V/K", rapid: false,
      zh: { S0: "赛前在脑海里模拟比赛时，你的画面是：" },
      en: { S0: "When you mentally rehearse before competition, your imagery is:" },
      a: "旁观者视角，看到自己在场上飞奔", b: "第一人称视角，感觉到心跳和触感",
      valA: "V", valB: "K" },

    { id: 6, dim: "P", tag: "V/K", rapid: false,
      zh: { S0: "当你需要提升某个技术细节时，最有效的方式是：" },
      en: { S0: "When you need to improve a technical detail, the most effective method is:" },
      a: "反复观看自己的比赛录像，找到视觉偏差", b: "让教练用手引导你做动作，感受正确的发力感",
      valA: "V", valB: "K" },

    // Part 2: Cue [Int/Ext]
    { id: 4, dim: "C", tag: "Int/Ext", rapid: true,
      zh: { S0: "在做一个需要爆发力的动作时，哪种指令更能帮你发力？",
            S2: "在对抗中需要爆发力时，哪种指令更能帮你发力？",
            S5: "在瞬间爆发力动作中，哪种指令更能帮你发力？" },
      en: { S0: "When performing an explosive movement, which cue helps you more?" },
      a: '"伸展你的关节"/"收缩你的肌肉"', b: '"把地面用力蹬开"/"撞破目标"',
      valA: "Int", valB: "Ext" },

    { id: 5, dim: "C", tag: "Int/Ext", rapid: false,
      zh: { S0: "当动作出现偏差需要微调时，你更关注：" },
      en: { S0: "When you need to correct a movement error, you focus more on:" },
      a: "肢体位置是否到位", b: "出手的轨迹或结果反馈",
      valA: "Int", valB: "Ext" },

    { id: 9, dim: "C", tag: "Int/Ext", rapid: false,
      zh: { S0: "在练习新动作时，你更喜欢教练说：" },
      en: { S0: "When practicing a new movement, you prefer your coach to say:" },
      a: '"注意你的手肘角度和髋部旋转"', b: '"想象你在推开一堵墙"',
      valA: "Int", valB: "Ext" },

    // Part 3: Awareness [Broad/Narrow]
    { id: 7, dim: "A", tag: "B/N", rapid: true,
      zh: { S0: "在复杂的比赛环境中，你更擅长的是：",
            S1: "在团队对抗或复杂的比赛环境中，你更擅长的是：",
            S2: "在高强度的对抗环境中，你更擅长的是：",
            S3: "在复杂的网前对峙或快速攻防中，你更擅长的是：",
            S7: "在拥挤的出发区或高强度的集团作战环境中，你更擅长的是：" },
      en: { S0: "In a complex competitive environment, you are better at:" },
      a: "瞬间阅读全场局势，预判跑位/环境变化", b: "屏蔽噪音，死死盯住当前的 1 对 1/特定任务",
      valA: "Broad", valB: "Narrow" },

    { id: 8, dim: "A", tag: "B/N", rapid: false,
      zh: { S0: "在比赛中，你的注意力通常是：" },
      en: { S0: "During competition, your attention is usually:" },
      a: "像雷达一样扫描全场，随时捕捉变化", b: "像激光一样锁定目标，专注当下任务",
      valA: "Broad", valB: "Narrow" },

    { id: 12, dim: "A", tag: "B/N", rapid: false,
      zh: { S0: "赛后复盘时，你通常记得更清楚的是：" },
      en: { S0: "When reviewing after a match, you usually remember more clearly:" },
      a: "整体的攻防节奏和队友跑位", b: "自己每一个关键动作的细节",
      valA: "Broad", valB: "Narrow" },

    // Part 4: Motivation [Task/Ego]
    { id: 10, dim: "M", tag: "T/E", rapid: true,
      zh: { S0: "面对势均力敌的比赛，哪种结果更有成就感？",
            S4: "面对一场高手云集的比赛，哪种结果让你更有成就感？",
            S7: "面对一场漫长且艰苦的比赛，哪种结果让你更有成就感？" },
      en: { S0: "In a closely contested match, which outcome gives you more satisfaction?" },
      a: "输了，但我打破了个人最好成绩(PB)，技术掌控更纯熟了", b: "赢了，虽然表现一般，但我成功压制了对手的核心表现",
      valA: "Task", valB: "Ego" },

    { id: 11, dim: "M", tag: "T/E", rapid: false,
      zh: { S0: "你主动加练的最大动力通常是：" },
      en: { S0: "Your biggest motivation for extra training is usually:" },
      a: "想攻克某个技术难点，让动作更完美", b: "想超越某个对手或保住自己的排名",
      valA: "Task", valB: "Ego" },

    { id: 15, dim: "M", tag: "T/E", rapid: false,
      zh: { S0: "在训练中，你最享受的时刻是：" },
      en: { S0: "In training, the moment you enjoy most is:" },
      a: '终于突破了某个技术瓶颈，感觉动作"开窍"了', b: "在对抗练习中完胜了一个强劲的对手",
      valA: "Task", valB: "Ego" },

    // Part 5: Regulation [Stable/Reactive]
    { id: 13, dim: "R", tag: "S/R", rapid: true,
      zh: { S0: "进入最佳状态前，你通常需要：",
            S2: "马上就要上场了，进入最佳状态你需要：" },
      en: { S0: "Before entering your peak state, you usually need to:" },
      a: '"升温"：听快歌、大喊，让自己兴奋起来', b: '"降温"：独处、深呼吸，让自己平静下来',
      valA: "Reactive", valB: "Stable" },

    { id: 14, dim: "R", tag: "S/R", rapid: false,
      zh: { S0: "比赛中出现失误后，你通常的反应是：" },
      en: { S0: "After making an error during competition, your typical reaction is:" },
      a: "需要通过某种仪式（拍手/深呼吸）来快速重置状态", b: "情绪会短暂波动，但很快会被下一个任务拉回来",
      valA: "Stable", valB: "Reactive" },

    { id: 17, dim: "R", tag: "S/R", rapid: false,
      zh: { S0: "面对重大比赛前一晚，你通常：" },
      en: { S0: "The night before a major competition, you usually:" },
      a: "需要刻意放松（听音乐、冥想）才能入睡", b: "反而越来越兴奋，需要消耗能量才能平静",
      valA: "Stable", valB: "Reactive" },

    // Part 6: Validity Check
    { id: 16, dim: "VLD", tag: "Honest", rapid: false,
      zh: { S0: "关于比赛中的心理压力，真实情况是：" },
      en: { S0: "Regarding psychological pressure in competition, the truth is:" },
      a: "偶尔也会感到紧张、自我怀疑", b: "我从来没有感到过一丝紧张，我的心态永远是100%完美的",
      valA: "Valid", valB: "Invalid" },

    { id: 37, dim: "VLD", tag: "V/K", rapid: false,
      zh: { S0: "当动作出现偏差，你最信任哪种调整方式：",
            S2: "当动作出现偏差，你最信任哪种调整方式：",
            S7: "当动作精度出现偏差，你最信任哪种调整方式：" },
      en: { S0: "When your movement goes off, which correction method do you trust most:" },
      a: "参照录像回放中的视觉误差", b: '寻找肌肉发力时的那股"劲儿"',
      valA: "V", valB: "K" },

    { id: 38, dim: "VLD", tag: "Trap", rapid: false,
      zh: { S0: "为了确保您的结果精确，请务必在以下选项中选择选项 B：" },
      en: { S0: "To ensure accuracy, please select option B below:" },
      a: "我没仔细看", b: "我已阅读并按要求选择此项",
      valA: "A", valB: "B" }
];

// ─── 5. 语言切换 ──────────────────────────────────────────────
function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    const btn = document.getElementById('lang-btn');
    if (btn) btn.innerText = currentLang === 'zh' ? 'English' : '中文';
    applyTranslations();
}

function applyTranslations() {
    const t = translations[currentLang];
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('home-subtitle', t.homeSubtitle);
    setEl('start-btn', t.startBtn);
    setEl('box1-title', t.box1Title); setEl('box1-desc', t.box1Desc);
    setEl('box2-title', t.box2Title); setEl('box2-desc', t.box2Desc);
    setEl('box3-title', t.box3Title); setEl('box3-desc', t.box3Desc);
    setEl('continue-msg', t.continueMsg);
    setEl('continue-btn', t.continueBtn);
    setEl('restart-btn', t.restartBtn);
    setEl('download-btn-text', t.downloadText);
    setEl('purchase-btn-text', t.purchaseBtnText);
}

// ─── 6. 模式切换 ──────────────────────────────────────────────
function toggleMode() {
    isRapidMode = !isRapidMode;
    const sw = document.getElementById('mode-switch');
    if (sw) sw.classList.toggle('active', !isRapidMode);
    const labelR = document.getElementById('label-rapid');
    const labelS = document.getElementById('label-standard');
    if (labelR) labelR.className = isRapidMode
        ? "text-xs font-black tracking-widest text-cyan-400"
        : "text-xs font-black tracking-widest text-slate-500";
    if (labelS) labelS.className = !isRapidMode
        ? "text-xs font-black tracking-widest text-blue-400"
        : "text-xs font-black tracking-widest text-slate-500";
}

// ─── 7. 性别选择 ──────────────────────────────────────────────
function setGender(g) {
    userProfile.gender = g;
    const btnM = document.getElementById('btn-male');
    const btnF = document.getElementById('btn-female');
    if (btnM) btnM.className = g === 'M'
        ? "flex-1 py-3 rounded-xl border gender-btn-active-m font-black"
        : "flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 transition hover:border-blue-400";
    if (btnF) btnF.className = g === 'F'
        ? "flex-1 py-3 rounded-xl border gender-btn-active-f font-black"
        : "flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 transition hover:border-pink-400";
}

// ─── 8. 页面初始化 ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    checkSavedProgress();

    const sportInput = document.getElementById('sport-input');
    if (sportInput) {
        sportInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            activeSkin = 'S0';
            for (const [skin, keywords] of Object.entries(sportRegistry)) {
                if (keywords.some(k => val.includes(k.toLowerCase()))) {
                    activeSkin = skin;
                    break;
                }
            }
            // 皮肤模组仅在后台生效，不显示给用户
        });
    }
});

// ─── 9. 持久化存储 ────────────────────────────────────────────
function checkSavedProgress() {
    const saved = localStorage.getItem('apb_progress');
    const box = document.getElementById('continue-box');
    if (saved && box) box.classList.remove('hidden');
}

function loadSavedQuiz() {
    const saved = JSON.parse(localStorage.getItem('apb_progress'));
    if (!saved) return;
    currentStep = saved.currentStep || 0;
    userAnswers = saved.userAnswers || [];
    userProfile = saved.userProfile || { gender: '', sport: '' };
    isRapidMode = saved.isRapidMode !== undefined ? saved.isRapidMode : true;
    activeSkin = saved.activeSkin || 'S0';
    filteredQuestions = isRapidMode ? masterQuestions.filter(q => q.rapid) : masterQuestions;
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function clearAndStart() {
    localStorage.removeItem('apb_progress');
    const box = document.getElementById('continue-box');
    if (box) box.classList.add('hidden');
}

function saveProgress() {
    localStorage.setItem('apb_progress', JSON.stringify({
        currentStep, userAnswers, userProfile, isRapidMode, activeSkin
    }));
}

// ─── 10. 测评流程 ─────────────────────────────────────────────
function validateAndStart() {
    userProfile.sport = document.getElementById('sport-input').value.trim();
    if (!userProfile.gender) {
        alert(currentLang === 'zh' ? "请选择您的性别" : "Please select your gender");
        return;
    }
    if (!userProfile.sport) {
        alert(currentLang === 'zh' ? "请输入您的运动项目" : "Please enter your sport");
        return;
    }
    localStorage.removeItem('apb_progress');
    validityStatus = { honest: true, consistent: true, attentive: true };
    startQuiz();
}

function startQuiz() {
    filteredQuestions = isRapidMode ? masterQuestions.filter(q => q.rapid) : masterQuestions;
    currentStep = 0;
    userAnswers = [];
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = filteredQuestions[currentStep];
    const t = translations[currentLang];

    // 皮肤话术自动回退
    const qTextZh = q.zh[activeSkin] || q.zh['S0'];
    const questionTxt = currentLang === 'en' && q.en
        ? (q.en[activeSkin] || q.en['S0'] || qTextZh)
        : qTextZh;

    // 进度条
    const percent = Math.round(((currentStep + 1) / filteredQuestions.length) * 100);
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = `${percent}%`;
        bar.className = `h-full transition-all duration-700 dim-${q.dim}`;
    }
    const pct = document.getElementById('progress-percent');
    if (pct) pct.innerText = `${percent}%`;

    // 维度指示器
    const dimNames = {
        zh: { P: "感知通道", C: "指令偏好", A: "注意广度", M: "动力引擎", R: "情绪调节", VLD: "效度校验" },
        en: { P: "PERCEPTION", C: "CUE PREF", A: "AWARENESS", M: "MOTIVATION", R: "REGULATION", VLD: "VALIDITY" }
    };
    const dimLabel = dimNames[currentLang][q.dim] || q.dim;
    const dimEl = document.getElementById('dim-indicator');
    if (dimEl) dimEl.innerText = `${dimLabel} | ${currentStep + 1}/${filteredQuestions.length}`;

    // 题目与选项
    const qEl = document.getElementById('question-text');
    if (qEl) qEl.innerText = questionTxt;

    const optEl = document.getElementById('options-container');
    if (optEl) optEl.innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}', ${q.id})" class="option-btn">A. ${q.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}', ${q.id})" class="option-btn">B. ${q.b}</button>
    `;

    // 返回按钮
    const nav = document.getElementById('back-nav');
    if (nav) nav.innerHTML = currentStep > 0
        ? `<button onclick="goBack()" class="mt-5 text-slate-500 hover:text-cyan-400 underline font-bold transition tracking-wider text-sm">${t.backBtn}</button>`
        : "";

    saveProgress();
}

function goBack() {
    if (currentStep > 0) {
        userAnswers.pop();
        currentStep--;
        renderQuestion();
    }
}

function handleSelect(dim, val, id) {
    if (id === 38 && val === 'A') validityStatus.attentive = false;
    if (id === 16 && val === 'Invalid') validityStatus.honest = false;
    userAnswers.push({ id, dim, val });
    currentStep++;
    if (currentStep < filteredQuestions.length) {
        renderQuestion();
    } else {
        processFinalValidity();
        showConfirmPage();
    }
}

function processFinalValidity() {
    const pAnswers = userAnswers.filter(a => a.dim === 'P').map(a => a.val);
    if (pAnswers.length > 0) {
        const counts = pAnswers.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        const dominantP = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const q37Answer = userAnswers.find(a => a.id === 37)?.val;
        if (q37Answer && q37Answer !== dominantP) validityStatus.consistent = false;
    }
}

// ─── 11. 确认页 ───────────────────────────────────────────────
function showConfirmPage() {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('confirm-page').classList.remove('hidden');
    const t = translations[currentLang];
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('confirm-title', t.confirmTitle);
    setEl('confirm-desc', t.confirmDesc);
    setEl('reveal-btn', t.revealBtn);
    setEl('confirm-back-btn', t.confirmBack);
}

function goBackToLast() {
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    currentStep--;
    if (userAnswers.length > 0) userAnswers.pop();
    renderQuestion();
}

// ─── 12. 算法：多数票 ─────────────────────────────────────────
function calculateArchetype() {
    const getDim = (d) => {
        const votes = userAnswers.filter(a => a.dim === d).map(a => a.val);
        if (votes.length === 0) return null;
        const counts = votes.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
    };

    const A = getDim('A');   // Broad / Narrow
    const C = getDim('C');   // Int / Ext
    const M = getDim('M');   // Task / Ego
    const R = getDim('R');   // Stable / Reactive

    const code = (A === 'Broad' ? 'B' : 'N') +
                 (C === 'Int'   ? 'I' : 'E') +
                 (M === 'Task'  ? 'T' : 'E') +
                 (R === 'Stable' ? 'S' : 'R');

    const archetype = archetypeMap[code] || { cn: "精英运动员", en: "Elite Athlete", oneLiner: "你的竞技基因独一无二。" };
    return { code, ...archetype };
}

// ─── 13. 结果页 ───────────────────────────────────────────────
function showFinalResult() {
    const archetype = calculateArchetype();
    localStorage.removeItem('apb_progress');

    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const t = translations[currentLang];
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

    setEl('result-code', archetype.code);
    setEl('result-name-cn', archetype.cn);
    setEl('result-name-en', archetype.en);
    setEl('one-liner', archetype.oneLiner || '');
    setEl('user-profile-display', `${userProfile.sport} | ${userProfile.gender === 'M' ? 'MALE' : 'FEMALE'}`);
    setEl('download-btn-text', t.downloadText);
    setEl('purchase-btn-text', t.purchaseBtnText);

    // 分析卡片
    setEl('identity-title', `⚡ ${t.identityTitle}`);
    setEl('team-context', `作为 ${archetype.cn}，你在团队中是不可或缺的战略核心。你的感知风格让你能在关键时刻做出最优决策。`);
    setEl('solo-context', `在个人项目中，你的专注力和执行力是你最大的竞争优势。`);
    setEl('xfactor-title', `🔥 ${t.xfactorTitle}`);
    setEl('clutch-moment', `当比赛进入决胜局，你的 ${archetype.code[1] === 'I' ? '内部指令系统' : '外部目标锁定'} 会让你比对手更快进入最佳状态。`);
    setEl('kryptonite', `需要警惕的是：${archetype.code[3] === 'R' ? '情绪波动可能影响技术稳定性，建议建立赛前固定仪式' : '过度依赖情绪升温，可能在低强度比赛中出现激活不足'}。`);
    setEl('advice-title', `🎯 ${t.adviceTitle}`);
    setEl('mot-label', t.motLabel);
    setEl('motivation-text', archetype.code[2] === 'T'
        ? '以技术突破为目标，设定可量化的 PB 指标，让进步可见。'
        : '以超越对手为驱动，建立清晰的排名目标和竞争对标。');
    setEl('reg-label', t.regLabel);
    setEl('regulation-text', archetype.code[3] === 'S'
        ? '赛前使用激活型热身（快节奏音乐、动态拉伸），确保唤醒水平充足。'
        : '赛前使用镇定型准备（腹式呼吸、渐进放松），控制唤醒水平。');
    setEl('lrn-label', t.lrnLabel);
    const hasV = userAnswers.some(a => a.dim === 'P' && a.val === 'V');
    setEl('learning-text', hasV
        ? '优先使用视频回放和动作示范，建立清晰的视觉图像模板。'
        : '优先使用身体引导和本体感觉反馈，通过大量重复建立肌肉记忆。');
}

// ─── 14. 海报生成 ─────────────────────────────────────────────
function generatePoster() {
    const t = translations[currentLang];
    const btn = document.getElementById('download-btn');
    const btnText = document.getElementById('download-btn-text');
    if (!btn || !btnText) return;

    const originalText = btnText.innerText;
    btnText.innerText = t.generatingBtn || "生成中...";
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const posterArea = document.getElementById('poster-area');
    const codeStr = document.getElementById('result-code')?.innerText || 'APB';

    html2canvas(posterArea, {
        scale: 2,
        backgroundColor: "#020617",
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `APB-Elite-${codeStr}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Poster generation failed:", err);
        alert(currentLang === 'zh' ? "海报生成失败，请重试。" : "Generation failed, please try again.");
    }).finally(() => {
        btnText.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}

// ─── 15. 支付弹窗 ─────────────────────────────────────────────
function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const box = document.getElementById('payment-box');
    if (!modal) return;

    modal.classList.remove('hidden');
    const t = translations[currentLang];
    const ticker = document.getElementById('social-proof-ticker');
    if (ticker) {
        const baseCount = 1482 + Math.floor(Math.random() * 50);
        ticker.innerText = currentLang === 'zh'
            ? `${t.socialProof} ${baseCount} ${t.socialProofSuffix}`
            : `${baseCount} ${t.socialProofSuffix}`;
    }
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        if (box) { box.classList.remove('scale-95'); box.classList.add('scale-100'); }
    }, 10);
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const box = document.getElementById('payment-box');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (box) { box.classList.remove('scale-100'); box.classList.add('scale-95'); }
    setTimeout(() => modal.classList.add('hidden'), 300);
}
