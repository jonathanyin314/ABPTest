/* --- APB CORE ENGINE v2.0 (i18n FULL VERSION) --- */

let currentLang = 'zh'; // 默认语言
let currentStep = 0;
let userAnswers = [];

// 1. 界面翻译字典 (UI Dictionary)
const translations = {
    zh: {
        langBtn: "English",
        subtitle: "Athlete Performance Blueprint",
        continueMsg: "检测到未完成的测试记录",
        continueBtn: "继续测评",
        restartBtn: "重新开始",
        startBtn: "开始专业测评",
        box1Title: "竞技认知重构",
        box1Desc: "摒弃通用性格测试，基于运动控制理论精准提取感知通道、注意焦点、视野广度等 5 项核心表现变量。",
        box2Title: "高效精密评估",
        box2Desc: "采用精简 16 题评估模型，有效避免测评疲劳并保护竞技专注力。内置置信度加权机制保证高科学信度。",
        box3Title: "去病理化成长架构",
        box3Desc: "结果以天赋风格呈现。基于 Trait 与 Pulse 双模组数据，消除评估防御，优化教练沟通效率。",
        questionLabel: "问题",
        backBtn: "返回上一题",
        confirmTitle: "测评已完成",
        confirmDesc: "你准备好揭晓你的 APB 竞技人格代码了吗？",
        revealBtn: "揭晓我的代码",
        confirmBack: "返回修改最后一题",
        identityTitle: "◈ 赛场身份",
        xfactorTitle: "⚡ 绝杀因子",
        adviceTitle: "⚙ 专家级优化建议",
        motLabel: "动力引擎",
        regLabel: "唤醒调节",
        lrnLabel: "感知学习",
        purchaseBtn: "解锁完整 15 页报告 (￥19.9)",
        oneLiner: "不仅是性格，更是你的赛场基因。"
    },
    en: {
        langBtn: "中文",
        subtitle: "Athlete Performance Blueprint",
        continueMsg: "Unfinished assessment detected",
        continueBtn: "Continue",
        restartBtn: "Restart",
        startBtn: "Start Elite Assessment",
        box1Title: "Cognitive Reconstruction",
        box1Desc: "Move beyond general personality tests. Extract 5 key performance variables based on Motor Control Theory.",
        box2Title: "Precision Assessment",
        box2Desc: "A 16-item model designed to prevent assessment fatigue and protect focus, ensuring high reliability via weighting algorithms.",
        box3Title: "Growth Architecture",
        box3Desc: "Results presented as 'talents'. Use Trait & Pulse modules to optimize coach communication and eliminate defensive bias.",
        questionLabel: "Question",
        backBtn: "Back",
        confirmTitle: "Assessment Complete",
        confirmDesc: "Are you ready to reveal your APB Athlete Archetype code?",
        revealBtn: "Reveal My Code",
        confirmBack: "Back to last question",
        identityTitle: "◈ Identity",
        xfactorTitle: "⚡ The X-Factor",
        adviceTitle: "⚙ Expert Optimization Guidelines",
        motLabel: "Motivation",
        regLabel: "Regulation",
        lrnLabel: "Learning",
        purchaseBtn: "Unlock Full 15-Page Report ($2.99)",
        oneLiner: "It's not just personality; it's your performance DNA."
    }
};

// 2. 完整 16 题题库 (Question Bank)
const questions = [
    { dim: "A", 
      zh: { q: "比赛中，你更倾向于监控全场的空档与跑位，还是死盯对位球员？", a: "监控全场", b: "死盯对位" },
      en: { q: "During a game, do you tend to monitor open spaces and movements across the field, or stay glued to your direct opponent?", a: "Monitor Field", b: "Stay Glued" },
      valA: "B", valB: "N" },
    { dim: "A", 
      zh: { q: "当你持球时，你的第一直觉是寻找远端队友，还是寻找面前进攻点？", a: "寻找远端", b: "寻找面前" },
      en: { q: "When in possession, is your first instinct to look for distant open teammates or find an immediate attack point?", a: "Distant Open", b: "Attack Point" },
      valA: "B", valB: "N" },
    { dim: "A", 
      zh: { q: "面对突发反击，你更倾向于观察整体阵型，还是加速追赶球权？", a: "观察阵型", b: "追赶球权" },
      en: { q: "Facing a sudden counter-attack, do you prefer observing the overall formation change or sprinting to chase the ball?", a: "Observe Formation", b: "Chase Ball" },
      valA: "B", valB: "N" },
    { dim: "C", 
      zh: { q: "罚球或射门前，你脑海中更多是身体发力感，还是球的运行轨迹？", a: "身体发力感", b: "运行轨迹" },
      en: { q: "Before a shot or free throw, is your mind more focused on internal body feel or the external ball trajectory?", a: "Body Feel", b: "Trajectory" },
      valA: "I", valB: "E" },
    { dim: "C", 
      zh: { q: "执行技术动作时，你更关注核心收紧感，还是动作的落点精准度？", a: "核心收紧感", b: "落点精准度" },
      en: { q: "Executing a skill, do you focus more on the internal core tension or the external accuracy of the result?", a: "Core Tension", b: "Accuracy" },
      valA: "I", valB: "E" },
    { dim: "C", 
      zh: { q: "当教练给出指令，你第一反应是检查动作细节，还是看向战术位置？", a: "动作细节", b: "战术位置" },
      en: { q: "When a coach gives a cue, is your first reaction to check your body mechanics or look at the tactical position?", a: "Body Mechanics", b: "Tactical Position" },
      valA: "I", valB: "E" },
    { dim: "C", 
      zh: { q: "疲劳状态下，你倾向于通过呼吸节奏找回状态，还是寻找外部参考点？", a: "呼吸节奏", b: "外部参考点" },
      en: { q: "Under fatigue, do you tend to regain focus via internal breathing rhythm or by finding an external reference point?", a: "Breathing Rhythm", b: "External Point" },
      valA: "I", valB: "E" },
    { dim: "M", 
      zh: { q: "什么最能激发你的斗志？", a: "掌握一项新技能", b: "击败对手" },
      en: { q: "What motivates you the most?", a: "Mastering a new skill", b: "Defeating an opponent" },
      valA: "T", valB: "E" },
    { dim: "M", 
      zh: { q: "你最希望获得的头衔是？", a: "技术大师", b: "荣誉传奇" },
      en: { q: "Which title do you desire most?", a: "The Master of Technique", b: "The Legend of Honors" },
      valA: "T", valB: "E" },
    { dim: "M", 
      zh: { q: "面对高强度训练，你更在意？", a: "超越昨天的自己", b: "表现排名第一" },
      en: { q: "In high-intensity training, do you care more about surpassing yourself or ranking first in the group?", a: "Surpassing Self", b: "Ranking First" },
      valA: "T", valB: "E" },
    { dim: "R", 
      zh: { q: "面对关键失误，你的第一反应是？", a: "冷面专注", b: "情感释放" },
      en: { q: "Faced with a critical error, is your first reaction to stay stoic or release emotion?", a: "Stay Stoic", b: "Release Emotion" },
      valA: "S", valB: "R" },
    { dim: "R", 
      zh: { q: "状态火热时，你通常表现得？", a: "冷酷专注", b: "激情互动" },
      en: { q: "When you are 'in the zone', do you appear more cold and focused or fiery and interactive?", a: "Cold & Focused", b: "Fiery & Interactive" },
      valA: "S", valB: "R" },
    { dim: "R", 
      zh: { q: "面对裁判误判，你会？", a: "压抑情绪", b: "表达立场" },
      en: { q: "Facing a bad call from the referee, do you suppress emotion or express your stance?", a: "Suppress Emotion", b: "Express Stance" },
      valA: "S", valB: "R" },
    { dim: "P", 
      zh: { q: "学习新战术，你觉得哪种更高效？", a: "观看视频示范", b: "场上亲身体验" },
      en: { q: "What is the most efficient way for you to learn a new tactic?", a: "Watch videos/demos", b: "On-field experience" },
      valA: "V", valB: "K" },
    { dim: "P", 
      zh: { q: "记忆最深的赛场瞬间通常是？", a: "视觉画面", b: "肌肉发力感" },
      en: { q: "Your most vivid game memories are usually...", a: "Visual images", b: "Muscle sensations" },
      valA: "V", valB: "K" },
    { dim: "P", 
      zh: { q: "教练讲解时，你更喜欢？", a: "看战术板箭头", b: "听描述后模仿" },
      en: { q: "During a briefing, do you prefer looking at arrows on a board or listening and mimicking?", a: "Arrows on Board", b: "Listen & Mimic" },
      valA: "V", valB: "K" }
];

// 3. 初始化与事件监听 (Initialization)
window.onload = function() {
    try {
        updateUI(); // 立即渲染首页文字
        
        // 检查存档
        const saved = localStorage.getItem('apb_progress');
        if (saved) {
            document.getElementById('continue-box').classList.remove('hidden');
            document.getElementById('start-btn').classList.add('hidden');
        }
    } catch (e) {
        console.error("Initialization error:", e);
    }
};

// 4. 语言切换逻辑 (Language Toggle)
function toggleLang() {
    currentLang = (currentLang === 'zh') ? 'en' : 'zh';
    updateUI();
    // 如果正在答题，重新渲染当前题目
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        renderQuestion();
    }
    // 如果在确认页，刷新确认页文字
    if (!document.getElementById('confirm-page').classList.contains('hidden')) {
        const t = translations[currentLang];
        document.getElementById('confirm-title').innerText = t.confirmTitle;
        document.getElementById('confirm-desc').innerText = t.confirmDesc;
        document.getElementById('reveal-btn').innerText = t.revealBtn;
        document.getElementById('confirm-back-btn').innerText = t.confirmBack;
    }
    // 如果在结果页，刷新结果页（重新计算并填充）
    if (!document.getElementById('result-page').classList.contains('hidden')) {
        // 简单处理：如果切换语言，重新触发一次结果展示逻辑即可更新文字
        // 注意：这里假设 userAnswers 还在
        if(userAnswers.length > 0) showFinalResult();
    }
}

// 5. 更新界面文字 (Update UI)
function updateUI() {
    const t = translations[currentLang];
    
    // 安全更新：先检查元素是否存在
    const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.innerText = txt;
    };

    setTxt('lang-btn', t.langBtn);
    setTxt('home-subtitle', t.subtitle);
    setTxt('continue-msg', t.continueMsg);
    setTxt('continue-btn', t.continueBtn);
    setTxt('restart-btn', t.restartBtn);
    setTxt('start-btn', t.startBtn);
    
    setTxt('box1-title', t.box1Title);
    setTxt('box1-desc', t.box1Desc);
    setTxt('box2-title', t.box2Title);
    setTxt('box2-desc', t.box2Desc);
    setTxt('box3-title', t.box3Title);
    setTxt('box3-desc', t.box3Desc);
}

// 6. 测评流程逻辑 (Quiz Logic)
function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentStep];
    const t = translations[currentLang];
    const qContent = q[currentLang]; // 获取当前语言的题目内容
    
    document.getElementById('progress-text').innerText = `${t.questionLabel} ${currentStep + 1} / 16`;
    document.getElementById('progress-bar').style.width = `${((currentStep + 1) / 16) * 100}%`;
    document.getElementById('question-text').innerText = qContent.q;
    
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${qContent.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${qContent.b}</button>
    `;
    
    const nav = document.getElementById('back-nav');
    nav.innerHTML = currentStep > 0 ? `<button onclick="goBack()" class="mt-4 text-slate-400 underline hover:text-blue-500">${t.backBtn}</button>` : "";
}

function handleSelect(dim, val) {
    userAnswers[currentStep] = { dim, val };
    currentStep++;
    // 存档
    localStorage.setItem('apb_progress', JSON.stringify({ step: currentStep, answers: userAnswers }));
    
    if (currentStep < 16) {
        renderQuestion(); 
    } else {
        showConfirmPage();
    }
}

function goBack() { 
    currentStep--; 
    renderQuestion(); 
}

function showConfirmPage() {
    const t = translations[currentLang];
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('confirm-page').classList.remove('hidden');
    
    document.getElementById('confirm-title').innerText = t.confirmTitle;
    document.getElementById('confirm-desc').innerText = t.confirmDesc;
    document.getElementById('reveal-btn').innerText = t.revealBtn;
    document.getElementById('confirm-back-btn').innerText = t.confirmBack;
}

function goBackToLast() { 
    currentStep = 15; 
    document.getElementById('confirm-page').classList.add('hidden'); 
    document.getElementById('quiz-page').classList.remove('hidden'); 
    renderQuestion(); 
}

function clearAndStart() { 
    localStorage.removeItem('apb_progress'); 
    currentStep = 0;
    userAnswers = [];
    location.reload(); 
}

function loadSavedQuiz() { 
    const data = JSON.parse(localStorage.getItem('apb_progress')); 
    if(data) {
        userAnswers = data.answers; 
        currentStep = data.step; 
        document.getElementById('continue-box').classList.add('hidden'); 
        startQuiz(); 
    }
}

// 7. 结果计算与展示 (Result Calculation)
function showFinalResult() {
    localStorage.removeItem('apb_progress');
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const getMaj = (dim) => {
        const arr = userAnswers.filter(a => a.dim === dim).map(a => a.val);
        if(arr.length === 0) return ""; 
        return arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
    };

    const fA = getMaj('A'); 
    const fC = getMaj('C'); 
    const fM = getMaj('M'); 
    const fR = getMaj('R'); 
    const fP = getMaj('P');

    let base = "";
    if (fA === 'B' && fC === 'E') base = "C";
    else if (fA === 'B' && fC === 'I') base = "M";
    else if (fA === 'N' && fC === 'E') base = "A";
    else if (fA === 'N' && fC === 'I') base = "P";

    document.getElementById('result-code').innerText = base + fM + fR + fP;

    /* --- Bilingual Content Database (Full) --- */
    const db = {
        C: { 
            zh: { 
                name: "Commander", cn: "指挥官", v: "将军", 
                team: "[场上将军]: 你负责用想象力撕开防线，你的传球和调度是队伍的进攻号角。", 
                solo: "[控场大师]: 你打的不是球，是空间。你擅长阅读对手意图，用节奏变化掌控全场。", 
                clutch: "上帝视角: 当全场因压力而视野变窄时，你看得更宽了。你看见了时间流动的缝隙。", 
                krypt: "直觉陷阱: 轻视细节。你容易因过度自信而尝试不需要的高难度动作，导致低级失误。",
                motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。",
                motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。",
                regS: "需点火: 基础唤醒度较低，建议赛前听快节奏音乐让自己'热'起来。",
                regR: "需降温: 神经系统易'过热'，建议赛前独处、深呼吸保持冷静。",
                lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。",
                lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。"
            },
            en: { 
                name: "Commander", cn: "Commander", v: "General", 
                team: "[Field General]: You tear defenses with imagination. Your passing dictates the attack.", 
                solo: "[Control Master]: You don't play the ball; you play space. You master the tempo.", 
                clutch: "God's Eye: When others tunnel vision, you see wider. You see the gaps in time.", 
                krypt: "Intuition Trap: Overconfidence. You might try unnecessary high-risk plays.",
                motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.",
                motE: "The Legend: Motivated by glory and being the hero in big moments.",
                regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music/activity before games.",
                regR: "Cool Down Needed: High sensitivity. Needs solitude and breathing to calm down.",
                lrnV: "Visual Learner: Learns best by watching videos and diagrams.",
                lrnK: "Kinesthetic Learner: Learns best by doing and feeling the movement."
            }
        },
        M: { 
            zh: { 
                name: "Mastermind", cn: "策划家", v: "宗师", 
                team: "[战术架构师]: 你是队伍的大脑。你不仅看得到空档，还能计算出最佳的进攻线路。", 
                solo: "[宗师]: 你在与对手下棋。你擅长拆解对手的动作模式，找出破绽并精准打击。", 
                clutch: "将军 (Checkmate): 布局生效，你冷静地收割胜利。", 
                krypt: "分析瘫痪: 想得太多会导致你动作僵硬，错失稍纵即逝的最佳时机。",
                motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。",
                motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。",
                regS: "需点火: 基础唤醒度较低，建议赛前听快节奏音乐让自己'热'起来。",
                regR: "需降温: 神经系统易'过热'，建议赛前独处、深呼吸保持冷静。",
                lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。",
                lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。"
            },
            en: { 
                name: "Mastermind", cn: "Mastermind", v: "Grandmaster", 
                team: "[Tactical Architect]: You are the brain. You calculate the best routes and rotations.", 
                solo: "[Grandmaster]: You play chess. You dismantle opponent patterns to find weakness.", 
                clutch: "Checkmate: Your setup works, and you calmly harvest the victory.", 
                krypt: "Analysis Paralysis: Overthinking leads to hesitation and missed windows.",
                motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.",
                motE: "The Legend: Motivated by glory and being the hero in big moments.",
                regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music/activity before games.",
                regR: "Cool Down Needed: High sensitivity. Needs solitude and breathing to calm down.",
                lrnV: "Visual Learner: Learns best by watching videos and diagrams.",
                lrnK: "Kinesthetic Learner: Learns best by doing and feeling the movement."
            }
        },
        A: { 
            zh: { 
                name: "Assassin", cn: "刺客", v: "统治者", 
                team: "[突击手]: 你是战术尖刀。任务不是组织，而是屏蔽干扰，把球送进目标。", 
                solo: "[猎手]: 你是一匹独狼。不需要花哨的布局，只需要比对手更快、更准、更狠。", 
                clutch: "本能接管: 大脑一片空白，身体自动接管一切。看见目标 -> 解决目标。", 
                krypt: "隧道视野: 极致的专注让你容易忽略处于更好位置的队友，或被对手针对。",
                motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。",
                motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。",
                regS: "需点火: 基础唤醒度较低，建议赛前听快节奏音乐让自己'热'起来。",
                regR: "需降温: 神经系统易'过热'，建议赛前独处、深呼吸保持冷静。",
                lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。",
                lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。"
            },
            en: { 
                name: "Assassin", cn: "Assassin", v: "Dominator", 
                team: "[Striker]: You are the spearhead. Ignore noise, finish the target.", 
                solo: "[Hunter]: A lone wolf. You just need to be faster, sharper, and tougher.", 
                clutch: "Instinct Takeover: Mind goes blank, body takes over. See target -> Destroy target.", 
                krypt: "Tunnel Vision: Extreme focus makes you miss teammates or get trapped.",
                motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.",
                motE: "The Legend: Motivated by glory and being the hero in big moments.",
                regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music/activity before games.",
                regR: "Cool Down Needed: High sensitivity. Needs solitude and breathing to calm down.",
                lrnV: "Visual Learner: Learns best by watching videos and diagrams.",
                lrnK: "Kinesthetic Learner: Learns best by doing and feeling the movement."
            }
        },
        P: { 
            zh: { 
                name: "Practitioner", cn: "实践者", v: "偶像", 
                team: "[专家]: 你是队伍基石。无论环境多么混乱，你总能提供最稳定、精密的输出。", 
                solo: "[技术大师]: 你在和自己比赛。你追求动作的极致纯粹与零误差。", 
                clutch: "绝对零度: 全场窒息的压力下，你进入绝对宁静，动作像机器一样完美。", 
                krypt: "机械僵化: 对环境极度敏感，一旦节奏被打乱(如裁判/装备)，心态易崩盘。",
                motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。",
                motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。",
                regS: "需点火: 基础唤醒度较低，建议赛前听快节奏音乐让自己'热'起来。",
                regR: "需降温: 神经系统易'过热'，建议赛前独处、深呼吸保持冷静。",
                lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。",
                lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。"
            },
            en: { 
                name: "Practitioner", cn: "Practitioner", v: "Icon", 
                team: "[Specialist]: The foundation. You provide stable, precise output in chaos.", 
                solo: "[Technician]: You compete with yourself. You seek zero-error purity.", 
                clutch: "Absolute Zero: In suffocating pressure, you find silence. Machine-like precision.", 
                krypt: "Mechanical Rigidity: Sensitive to environment. Disruption breaks your flow.",
                motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.",
                motE: "The Legend: Motivated by glory and being the hero in big moments.",
                regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music/activity before games.",
                regR: "Cool Down Needed: High sensitivity. Needs solitude and breathing to calm down.",
                lrnV: "Visual Learner: Learns best by watching videos and diagrams.",
                lrnK: "Kinesthetic Learner: Learns best by doing and feeling the movement."
            }
        }
    };

    const t = translations[currentLang];
    const d = db[base][currentLang];
    const isEgo = (fM === "E");

    // 填充结果页文案
    document.getElementById('result-name-cn').innerText = (fR === "S" ? (currentLang==='zh'?"冷面":"Stoic ") : (currentLang==='zh'?"激情":"Fiery ")) + (isEgo ? d.v : d.cn);
    document.getElementById('result-name-en').innerText = `The ${(fR === "S" ? "Stoic" : "Fiery")} ${(isEgo ? d.v : d.name)} (${fP})`;
    document.getElementById('one-liner').innerText = t.oneLiner;
    
    document.getElementById('identity-title').innerText = t.identityTitle;
    document.getElementById('team-context').innerText = d.team;
    document.getElementById('solo-context').innerText = d.solo;
    
    document.getElementById('xfactor-title').innerText = t.xfactorTitle;
    document.getElementById('clutch-moment').innerText = d.clutch;
    document.getElementById('kryptonite').innerText = d.krypt;

    document.getElementById('advice-title').innerText = t.adviceTitle;
    document.getElementById('mot-label').innerText = t.motLabel;
    document.getElementById('motivation-text').innerText = (fM === 'T') ? d.motT : d.motE;
    document.getElementById('reg-label').innerText = t.regLabel;
    document.getElementById('regulation-text').innerText = (fR === 'S') ? d.regS : d.regR;
    document.getElementById('lrn-label').innerText = t.lrnLabel;
    document.getElementById('learning-text').innerText = (fP === 'V') ? d.lrnV : d.lrnK;

    document.getElementById('purchase-btn').innerText = t.purchaseBtn;
}
