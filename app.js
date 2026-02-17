、/* --- APB CORE ENGINE v2.0 (i18n Bilingual Edition) --- */

let currentLang = 'zh';

const translations = {
    zh: {
        langBtn: "English",
        startBtn: "开始专业测评",
        continueMsg: "检测到未完成的测试记录",
        continueBtn: "继续测评",
        restartBtn: "重新开始",
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
        startBtn: "Start Elite Assessment",
        continueMsg: "Unfinished test detected",
        continueBtn: "Continue",
        restartBtn: "Restart",
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
    // ... 篇幅原因，其他 13 题遵循此 [zh/en] 结构 ...
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
      en: { q: "Which title do you desire most?", a: "The Master of Technique", b: "The Legend of Honors", valA: "T", valB: "E" },
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

let currentStep = 0;
let userAnswers = [];

window.onload = function() {
    updateUI();
    const saved = localStorage.getItem('apb_progress');
    if (saved) {
        document.getElementById('continue-box').classList.remove('hidden');
        document.getElementById('start-btn').classList.add('hidden');
    }
};

function toggleLang() {
    currentLang = (currentLang === 'zh') ? 'en' : 'zh';
    updateUI();
    if (!document.getElementById('quiz-page').classList.contains('hidden')) renderQuestion();
}

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('lang-btn').innerText = t.langBtn;
    document.getElementById('start-btn').innerText = t.startBtn;
    document.getElementById('continue-msg').innerText = t.continueMsg;
    document.getElementById('continue-btn').innerText = t.continueBtn;
    document.getElementById('restart-btn').innerText = t.restartBtn;
    document.getElementById('box1-title').innerText = t.box1Title;
    document.getElementById('box1-desc').innerText = t.box1Desc;
    document.getElementById('box2-title').innerText = t.box2Title;
    document.getElementById('box2-desc').innerText = t.box2Desc;
    document.getElementById('box3-title').innerText = t.box3Title;
    document.getElementById('box3-desc').innerText = t.box3Desc;
}

function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentStep];
    const t = translations[currentLang];
    const qContent = q[currentLang];
    document.getElementById('progress-text').innerText = `${t.questionLabel} ${currentStep + 1} / 16`;
    document.getElementById('progress-bar').style.width = `${((currentStep + 1) / 16) * 100}%`;
    document.getElementById('question-text').innerText = qContent.q;
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${qContent.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${qContent.b}</button>
    `;
    const nav = document.getElementById('back-nav');
    nav.innerHTML = currentStep > 0 ? `<button onclick="goBack()" class="mt-4 text-slate-400 underline">${t.backBtn}</button>` : "";
}

function handleSelect(dim, val) {
    userAnswers[currentStep] = { dim, val };
    currentStep++;
    localStorage.setItem('apb_progress', JSON.stringify({ step: currentStep, answers: userAnswers }));
    if (currentStep < 16) renderQuestion(); 
    else {
        const t = translations[currentLang];
        document.getElementById('quiz-page').classList.add('hidden');
        document.getElementById('confirm-page').classList.remove('hidden');
        document.getElementById('confirm-title').innerText = t.confirmTitle;
        document.getElementById('confirm-desc').innerHTML = t.confirmDesc;
        document.getElementById('reveal-btn').innerText = t.revealBtn;
        document.getElementById('confirm-back-btn').innerText = t.confirmBack;
    }
}

function goBack() { currentStep--; renderQuestion(); }
function goBackToLast() { currentStep = 15; document.getElementById('confirm-page').classList.add('hidden'); document.getElementById('quiz-page').classList.remove('hidden'); renderQuestion(); }
function clearAndStart() { localStorage.removeItem('apb_progress'); location.reload(); }
function loadSavedQuiz() { 
    const data = JSON.parse(localStorage.getItem('apb_progress')); 
    userAnswers = data.answers; currentStep = data.step; 
    document.getElementById('continue-box').classList.add('hidden'); 
    startQuiz(); 
}

function showFinalResult() {
    localStorage.removeItem('apb_progress');
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const getMaj = (dim) => {
        const arr = userAnswers.filter(a => a.dim === dim).map(a => a.val);
        return arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
    };

    const fA = getMaj('A'); const fC = getMaj('C'); const fM = getMaj('M'); const fR = getMaj('R'); const fP = getMaj('P');
    let b = (fA === 'B' && fC === 'E') ? "C" : (fA === 'B' && fC === 'I') ? "M" : (fA === 'N' && fC === 'E') ? "A" : "P";
    document.getElementById('result-code').innerText = b + fM + fR + fP;

    /* --- Bilingual Content Database [cite: 41-80] --- */
    const db = {
        C: { 
            zh: { name: "Commander", cn: "指挥官", v: "将军", team: "[场上将军]: 用想象力撕开防线。", solo: "[控场大师]: 掌控全场节奏。", clutch: "上帝视角", krypt: "直觉陷阱" },
            en: { name: "Commander", cn: "Commander", v: "General", team: "[Field General]: Tear defenses with vision.", solo: "[Control Master]: Master of game tempo.", clutch: "God's Eye", krypt: "Intuition Trap" }
        },
        M: { 
            zh: { name: "Mastermind", cn: "策划家", v: "宗师", team: "[战术架构师]: 计算最佳线路。", solo: "[宗师]: 拆解对手模式。", clutch: "将军", krypt: "分析瘫痪" },
            en: { name: "Mastermind", cn: "Mastermind", v: "Grandmaster", team: "[Tactical Architect]: Calculate optimal routes.", solo: "[Grandmaster]: Break opponent patterns.", clutch: "Checkmate", krypt: "Analysis Paralysis" }
        },
        A: { 
            zh: { name: "Assassin", cn: "刺客", v: "统治者", team: "[突击手]: 屏蔽干扰终结目标。", solo: "[猎手]: 更快更准更狠。", clutch: "本能接管", krypt: "隧道视野" },
            en: { name: "Assassin", cn: "Assassin", v: "Dominator", team: "[Striker]: Finish the target.", solo: "[Hunter]: Faster, sharper, tougher.", clutch: "Instinct Takeover", krypt: "Tunnel Vision" }
        },
        P: { 
            zh: { name: "Practitioner", cn: "实践者", v: "偶像", team: "[专家]: 稳定精密输出。", solo: "[技术大师]: 极致动作纯粹。", clutch: "绝对零度", krypt: "机械僵化" },
            en: { name: "Practitioner", cn: "Practitioner", v: "Icon", team: "[Specialist]: Stable precision output.", solo: "[Technician]: Pure technical mastery.", clutch: "Absolute Zero", krypt: "Mechanical Rigidity" }
        }
    };

    const t = translations[currentLang];
    const d = db[b][currentLang];
    const isEgo = (fM === "E");

    document.getElementById('result-name-cn').innerText = (fR === "S" ? (currentLang==='zh'?"冷面":"Stoic ") : (currentLang==='zh'?"激情":"Fiery ")) + (isEgo ? d.v : d.cn);
    document.getElementById('result-name-en').innerText = `The ${(fR === "S" ? "Stoic" : "Fiery")} ${(isEgo ? d.v : d.name)} (${fP})`;
    document.getElementById('one-liner').innerText = t.oneLiner;
    document.getElementById('identity-title').innerText = t.identityTitle;
    document.getElementById('xfactor-title').innerText = t.xfactorTitle;
    document.getElementById('advice-title').innerText = t.adviceTitle;
    document.getElementById('mot-label').innerText = t.motLabel;
    document.getElementById('reg-label').innerText = t.regLabel;
    document.getElementById('lrn-label').innerText = t.lrnLabel;
    document.getElementById('purchase-btn').innerText = t.purchaseBtn;
    
    // 此处省略了 Team/Solo Context 等详细文案，逻辑与之前一致
}
