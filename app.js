/* --- APB CORE ENGINE v3.0 (Dynamic Progress & Modal Ready) --- */

/* --- APB v3.3 Core Logic --- */
let currentLang = 'zh';
let currentStep = 0;
let userAnswers = [];
let userProfile = { gender: '', sport: '' };
let isRapidMode = true; // 默认极速版
let activeSkin = 'S0';  // 默认母题皮肤

// 模式切换函数
function toggleMode() {
    isRapidMode = !isRapidMode;
    const sw = document.getElementById('mode-switch');
    const rLabel = document.getElementById('label-rapid');
    const sLabel = document.getElementById('label-standard');
    
    if (!isRapidMode) {
        sw.classList.add('active');
        sLabel.classList.replace('text-slate-500', 'text-blue-400');
        rLabel.classList.replace('text-blue-400', 'text-slate-500');
    } else {
        sw.classList.remove('active');
        rLabel.classList.replace('text-slate-500', 'text-blue-400');
        sLabel.classList.replace('text-blue-400', 'text-slate-500');
    }
}

// 任务 2：项目映射引擎 (Sport-to-Skin Mapper)
function getSkinBySport(sportName) {
    const s = sportName.toLowerCase();
    
    // S1: 开放式团队对抗 
    if (/(basket|foot|soccer|rugby|voley|handball|hockey|netball|cricket|baseball|ball)/.test(s)) return 'S1';
    
    // S2: 开放式单人对抗 
    if (/(box|mma|fight|fenc|judo|wrestl|karate|muay|sanda)/.test(s)) return 'S2';
    
    // S3: 网隔对抗 
    if (/(tennis|badminton|pingpong|table tennis|squash|pickleball|padel)/.test(s)) return 'S3';
    
    // S4: 封闭式精准目标
    if (/(golf|shoot|archery|bowl|dart|billiards|snooker|curling)/.test(s)) return 'S4';
    
    // S5: 封闭式力量表现
    if (/(weight|sprint|swim|jump|throw|shot put|track|field)/.test(s)) return 'S5';
    
    // S6: 审美表现评分
    if (/(gymnast|skat|div|surf|climb|dance|breaking|equestrian)/.test(s)) return 'S6';
    
    // S7: 持续性耐力
    if (/(marathon|cycl|triathlon|run|row|kayak|ski)/.test(s)) return 'S7';
    
    return 'S1'; // 无法识别时默认使用最通用的 S1 皮肤
}

const translations = {
    zh: {
        langBtn: "English", subtitle: "Athlete Performance Blueprint", continueMsg: "检测到未完成的测试记录",
        continueBtn: "继续测评", restartBtn: "重新开始", startBtn: "开始专业测评", genderLabel: "选择性别",
        male: "男", female: "女", sportLabel: "你的主项 (可输入)", sportPlaceholder: "例如：网球, 足球, 综合格斗...",
        alertGender: "请先选择性别", box1Title: "竞技认知重构", box1Desc: "摒弃通用性格测试，基于运动控制理论精准提取感知通道、注意焦点、视野广度等 5 项核心表现变量。",
        box2Title: "高效精密评估", box2Desc: "采用精简 16 题评估模型，有效避免测评疲劳并保护竞技专注力。内置置信度加权机制保证高科学信度。",
        box3Title: "去病理化成长架构", box3Desc: "结果以天赋风格呈现。基于 Trait 与 Pulse 双模组数据，消除评估防御，优化教练沟通效率。",
        questionLabel: "分析维度", backBtn: "返回上一题", confirmTitle: "测评已完成", confirmDesc: "你准备好揭晓你的 APB 竞技人格代码了吗？",
        revealBtn: "揭晓我的代码", confirmBack: "返回修改最后一题", identityTitle: "◈ 赛场身份", xfactorTitle: "⚡ 绝杀因子",
        adviceTitle: "⚙ 专家级优化建议", motLabel: "动力引擎", regLabel: "唤醒调节", lrnLabel: "感知学习", purchaseBtn: "获取完整报告", oneLiner: "不仅是性格，更是你的赛场基因。",
        downloadBtn: "保存专属结果海报", generatingBtn: "生成中..."
    },
    en: {
        langBtn: "中文", subtitle: "Athlete Performance Blueprint", continueMsg: "Unfinished assessment detected",
        continueBtn: "Continue", restartBtn: "Restart", startBtn: "Start Elite Assessment", genderLabel: "Select Gender",
        male: "Male", female: "Female", sportLabel: "Your Sport (Type in)", sportPlaceholder: "e.g., Tennis, Soccer, MMA...",
        alertGender: "Please select a gender first", box1Title: "Cognitive Reconstruction", box1Desc: "Extract 5 key performance variables based on Motor Control Theory.",
        box2Title: "Precision Assessment", box2Desc: "A 16-item model designed to prevent fatigue, ensuring high reliability via algorithms.",
        box3Title: "Growth Architecture", box3Desc: "Results presented as 'talents'. Optimize coach communication and eliminate defensive bias.",
        questionLabel: "DIMENSION", backBtn: "Back", confirmTitle: "Assessment Complete", confirmDesc: "Are you ready to reveal your APB Athlete Archetype code?",
        revealBtn: "Reveal My Code", confirmBack: "Back to last question", identityTitle: "◈ Identity", xfactorTitle: "⚡ The X-Factor",
        adviceTitle: "⚙ Expert Optimization Guidelines", motLabel: "Motivation", regLabel: "Regulation", lrnLabel: "Learning", purchaseBtn: "Unlock Full Report", oneLiner: "It's not just personality; it's your performance DNA.",
        downloadBtn: "Save Result Poster", generatingBtn: "Generating..."
    }
};

const questions = [
    { dim: "A", zh: { q: "比赛中，你更倾向于监控全场的空档与跑位，还是死盯对位球员？", a: "监控全场", b: "死盯对位" }, en: { q: "During a game, do you tend to monitor open spaces and movements across the field, or stay glued to your direct opponent?", a: "Monitor Field", b: "Stay Glued" }, valA: "B", valB: "N" },
    { dim: "A", zh: { q: "当你持球时，你的第一直觉是寻找远端队友，还是寻找面前进攻点？", a: "寻找远端", b: "寻找面前" }, en: { q: "When in possession, is your first instinct to look for distant open teammates or find an immediate attack point?", a: "Distant Open", b: "Attack Point" }, valA: "B", valB: "N" },
    { dim: "A", zh: { q: "面对突发反击，你更倾向于观察整体阵型，还是加速追赶球权？", a: "观察阵型", b: "追赶球权" }, en: { q: "Facing a sudden counter-attack, do you prefer observing the overall formation change or sprinting to chase the ball?", a: "Observe Formation", b: "Chase Ball" }, valA: "B", valB: "N" },
    { dim: "C", zh: { q: "罚球或射门前，你脑海中更多是身体发力感，还是球的运行轨迹？", a: "身体发力感", b: "运行轨迹" }, en: { q: "Before a shot or free throw, is your mind more focused on internal body feel or the external ball trajectory?", a: "Body Feel", b: "Trajectory" }, valA: "I", valB: "E" },
    { dim: "C", zh: { q: "执行技术动作时，你更关注核心收紧感，还是动作的落点精准度？", a: "核心收紧感", b: "落点精准度" }, en: { q: "Executing a skill, do you focus more on the internal core tension or the external accuracy of the result?", a: "Core Tension", b: "Accuracy" }, valA: "I", valB: "E" },
    { dim: "C", zh: { q: "当教练给出指令，你第一反应是检查动作细节，还是看向战术位置？", a: "动作细节", b: "战术位置" }, en: { q: "When a coach gives a cue, is your first reaction to check your body mechanics or look at the tactical position?", a: "Body Mechanics", b: "Tactical Position" }, valA: "I", valB: "E" },
    { dim: "C", zh: { q: "疲劳状态下，你倾向于通过呼吸节奏找回状态，还是寻找外部参考点？", a: "呼吸节奏", b: "外部参考点" }, en: { q: "Under fatigue, do you tend to regain focus via internal breathing rhythm or by finding an external reference point?", a: "Breathing Rhythm", b: "External Point" }, valA: "I", valB: "E" },
    { dim: "M", zh: { q: "什么最能激发你的斗志？", a: "掌握一项新技能", b: "击败对手" }, en: { q: "What motivates you the most?", a: "Mastering a new skill", b: "Defeating an opponent" }, valA: "T", valB: "E" },
    { dim: "M", zh: { q: "你最希望获得的头衔是？", a: "技术大师", b: "荣誉传奇" }, en: { q: "Which title do you desire most?", a: "The Master of Technique", b: "The Legend of Honors" }, valA: "T", valB: "E" },
    { dim: "M", zh: { q: "面对高强度训练，你更在意？", a: "超越昨天的自己", b: "表现排名第一" }, en: { q: "In high-intensity training, do you care more about surpassing yourself or ranking first in the group?", a: "Surpassing Self", b: "Ranking First" }, valA: "T", valB: "E" },
    { dim: "R", zh: { q: "面对关键失误，你的第一反应是？", a: "冷面专注", b: "情感释放" }, en: { q: "Faced with a critical error, is your first reaction to stay stoic or release emotion?", a: "Stay Stoic", b: "Release Emotion" }, valA: "S", valB: "R" },
    { dim: "R", zh: { q: "状态火热时，你通常表现得？", a: "冷酷专注", b: "激情互动" }, en: { q: "When you are 'in the zone', do you appear more cold and focused or fiery and interactive?", a: "Cold & Focused", b: "Fiery & Interactive" }, valA: "S", valB: "R" },
    { dim: "R", zh: { q: "面对裁判误判，你会？", a: "压抑情绪", b: "表达立场" }, en: { q: "Facing a bad call from the referee, do you suppress emotion or express your stance?", a: "Suppress Emotion", b: "Express Stance" }, valA: "S", valB: "R" },
    { dim: "P", zh: { q: "学习新战术，你觉得哪种更高效？", a: "观看视频示范", b: "场上亲身体验" }, en: { q: "What is the most efficient way for you to learn a new tactic?", a: "Watch videos/demos", b: "On-field experience" }, valA: "V", valB: "K" },
    { dim: "P", zh: { q: "记忆最深的赛场瞬间通常是？", a: "视觉画面", b: "肌肉发力感" }, en: { q: "Your most vivid game memories are usually...", a: "Visual images", b: "Muscle sensations" }, valA: "V", valB: "K" },
    { dim: "P", zh: { q: "教练讲解时，你更喜欢？", a: "看战术板箭头", b: "听描述后模仿" }, en: { q: "During a briefing, do you prefer looking at arrows on a board or listening and mimicking?", a: "Arrows on Board", b: "Listen & Mimic" }, valA: "V", valB: "K" }
];

window.onload = function() {
    updateUI(); 
    const saved = localStorage.getItem('apb_progress');
    if (saved) {
        const data = JSON.parse(saved);
        if(data.profile) {
            userProfile = data.profile;
            if(userProfile.gender) setGender(userProfile.gender);
            if(userProfile.sport) document.getElementById('sport-input').value = userProfile.sport;
        }
        document.getElementById('continue-box').classList.remove('hidden');
        document.getElementById('start-btn').innerText = translations[currentLang].continueBtn; 
    }
};

function toggleLang() {
    currentLang = (currentLang === 'zh') ? 'en' : 'zh';
    updateUI();
    if (!document.getElementById('quiz-page').classList.contains('hidden')) renderQuestion();
    if (!document.getElementById('result-page').classList.contains('hidden')) {
        if(userAnswers.length > 0) showFinalResult();
    }
}

function updateUI() {
    const t = translations[currentLang];
    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

    setTxt('lang-btn', t.langBtn); setTxt('home-subtitle', t.subtitle); setTxt('continue-msg', t.continueMsg);
    setTxt('continue-btn', t.continueBtn); setTxt('restart-btn', t.restartBtn); setTxt('start-btn', t.startBtn);
    setTxt('gender-label', t.genderLabel); setTxt('label-male', t.male); setTxt('label-female', t.female);
    setTxt('sport-label', t.sportLabel); 
    const spInput = document.getElementById('sport-input'); if(spInput) spInput.placeholder = t.sportPlaceholder;

    setTxt('box1-title', t.box1Title); setTxt('box1-desc', t.box1Desc); setTxt('box2-title', t.box2Title);
    setTxt('box2-desc', t.box2Desc); setTxt('box3-title', t.box3Title); setTxt('box3-desc', t.box3Desc);
    setTxt('confirm-title', t.confirmTitle); setTxt('confirm-desc', t.confirmDesc); setTxt('reveal-btn', t.revealBtn);
    setTxt('confirm-back-btn', t.confirmBack); setTxt('identity-title', t.identityTitle); setTxt('xfactor-title', t.xfactorTitle);
    setTxt('advice-title', t.adviceTitle); setTxt('mot-label', t.motLabel); setTxt('reg-label', t.regLabel);
    setTxt('lrn-label', t.lrnLabel); setTxt('purchase-btn-text', t.purchaseBtn);
}

function setGender(g) {
    userProfile.gender = g;
    const btnM = document.getElementById('btn-male'); const btnF = document.getElementById('btn-female');
    if(btnM && btnF) {
        btnM.classList.remove('gender-btn-active-m'); btnF.classList.remove('gender-btn-active-f');
        if (g === 'M') btnM.classList.add('gender-btn-active-m');
        if (g === 'F') btnF.classList.add('gender-btn-active-f');
    }
}

function validateAndStart() {
    if (!userProfile.gender) { alert(translations[currentLang].alertGender); return; }
    const sportInput = document.getElementById('sport-input').value.trim();
    userProfile.sport = sportInput || "Athlete"; 
    
    // 激活映射引擎
    activeSkin = getSkinBySport(userProfile.sport);
    console.log(`System: Sport mapped to Skin ${activeSkin}`);
    
    startQuiz();
}

function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const totalQuestions = isRapidMode ? 8 : 16;
    const q = questions[currentStep];
    const t = translations[currentLang];
    
    /* 动态进度条逻辑 (Task 2) */
    const percent = Math.round(((currentStep + 1) / totalQuestions) * 100);
    document.getElementById('dim-indicator').innerText = `${t.questionLabel} ${q.dim} | ${currentStep + 1}/${totalQuestions}`;
    document.getElementById('progress-percent').innerText = `${percent}%`;
    const pb = document.getElementById('progress-bar');
    pb.style.width = `${percent}%`;
    pb.className = `h-full w-0 transition-all duration-700 ease-out dim-${q.dim}`; // 绑定变色 Class
    
    document.getElementById('question-text').innerText = q[currentLang].q;
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${q[currentLang].a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${q[currentLang].b}</button>
    `;
    
    document.getElementById('back-nav').innerHTML = currentStep > 0 ? `<button onclick="goBack()" class="mt-5 text-slate-500 hover:text-cyan-400 underline font-bold transition tracking-wider text-sm">${t.backBtn}</button>` : "";
}

function handleSelect(dim, val) {
    const totalQuestions = isRapidMode ? 8 : 16;
    userAnswers[currentStep] = { dim, val };
    currentStep++;
    localStorage.setItem('apb_progress', JSON.stringify({ step: currentStep, answers: userAnswers, profile: userProfile, isRapid: isRapidMode }));
    
    if (currentStep < totalQuestions) {
        renderQuestion();
    } else {
        showConfirmPage();
    }
}

function goBack() { currentStep--; renderQuestion(); }

function showConfirmPage() {
    const t = translations[currentLang];
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('confirm-page').classList.remove('hidden');
    document.getElementById('confirm-title').innerText = t.confirmTitle;
    document.getElementById('confirm-desc').innerText = t.confirmDesc;
    document.getElementById('reveal-btn').innerText = t.revealBtn;
    document.getElementById('confirm-back-btn').innerText = t.confirmBack;
}

function goBackToLast() { currentStep = 15; document.getElementById('confirm-page').classList.add('hidden'); document.getElementById('quiz-page').classList.remove('hidden'); renderQuestion(); }
function clearAndStart() { localStorage.removeItem('apb_progress'); userProfile = { gender: '', sport: '' }; currentStep = 0; userAnswers = []; location.reload(); }
function loadSavedQuiz() { 
    const data = JSON.parse(localStorage.getItem('apb_progress')); 
    if(data) { userAnswers = data.answers; currentStep = data.step; document.getElementById('continue-box').classList.add('hidden'); startQuiz(); }
}

function showFinalResult() {
    localStorage.removeItem('apb_progress');
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const getMaj = (dim) => {
        const arr = userAnswers.filter(a => a.dim === dim).map(a => a.val);
        if(arr.length === 0) return ""; 
        return arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
    };

    const fA = getMaj('A'); const fC = getMaj('C'); const fM = getMaj('M'); const fR = getMaj('R'); const fP = getMaj('P');
    let base = (fA === 'B' && fC === 'E') ? "C" : (fA === 'B' && fC === 'I') ? "M" : (fA === 'N' && fC === 'E') ? "A" : "P";
    document.getElementById('result-code').innerText = base + fM + fR + fP;

    const genderText = userProfile.gender === 'M' ? (currentLang==='zh'?'男':'MALE') : (currentLang==='zh'?'女':'FEMALE');
    const sportText = userProfile.sport ? userProfile.sport.toUpperCase() : "ATHLETE";
    document.getElementById('user-profile-display').innerText = `${genderText} | ${sportText}`;

    const db = {
        C: { 
            zh: { name: "Commander", cn: "指挥官", v: "将军", team: "[场上将军]: 你负责用想象力撕开防线，你的传球和调度是队伍的进攻号角。", solo: "[控场大师]: 你打的不是球，是空间。你擅长阅读对手意图，用节奏变化掌控全场。", clutch: "上帝视角: 当全场因压力而视野变窄时，你看得更宽了。你看见了时间流动的缝隙，凭借本能送出致命一击。", krypt: "直觉陷阱: 轻视细节。你容易因过度自信而尝试不需要的高难度动作，导致低级失误。", motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。", motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。", regS: "需点火: 基础唤醒度较低，建议赛前听快节奏重金属音乐、大声吼叫，让自己'热'起来。", regR: "需降温: 神经系统天生敏感易'过热'，建议赛前戴降噪耳机、独处、深呼吸保持冷静。", lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。", lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。" },
            en: { name: "Commander", cn: "Commander", v: "General", team: "[Field General]: You tear defenses apart with imagination. Your passing and scheduling are the attacking bugle call of the team.", solo: "[Control Master]: You don't play the ball; you play space. You master the opponent's intentions and control the tempo.", clutch: "God's Eye: When pressure gives others tunnel vision, yours widens. You see the gaps in time and deliver a fatal blow by instinct.", krypt: "Intuition Trap: Disregarding details. Overconfidence may lead you to attempt unnecessary high-difficulty plays, causing turnovers.", motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.", motE: "The Legend: Motivated by glory and being the hero in big moments.", regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music or shouting to get 'hot' before the game.", regR: "Cool Down Needed: High sensitivity. Needs solitude and deep breathing to calm down and focus.", lrnV: "Visual Learner: Learns best by watching videos and diagrams to build mental images.", lrnK: "Kinesthetic Learner: Learns best by doing, sweating, and feeling the muscle feedback." }
        },
        M: { 
            zh: { name: "Mastermind", cn: "策划家", v: "宗师", team: "[战术架构师]: 你是队伍的大脑。你不仅看得到空档，还能计算出最佳的进攻线路和防守轮转。", solo: "[宗师]: 你在与对手下棋。你擅长拆解对手的动作模式，找出破绽并精准打击。", clutch: "将军 (Checkmate): 这不仅仅是运气。你在比赛前段布下的局终于生效，对手掉进了陷阱，你冷静地收割胜利。", krypt: "分析瘫痪: 思维过载。想得太多会导致你动作僵硬，错失稍纵即逝的最佳时机。", motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。", motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。", regS: "需点火: 基础唤醒度较低，建议赛前听快节奏重金属音乐、大声吼叫，让自己'热'起来。", regR: "需降温: 神经系统天生敏感易'过热'，建议赛前戴降噪耳机、独处、深呼吸保持冷静。", lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。", lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。" },
            en: { name: "Mastermind", cn: "Mastermind", v: "Grandmaster", team: "[Tactical Architect]: You are the brain. You see gaps and calculate the optimal attacking routes and rotations.", solo: "[Grandmaster]: You play chess. You dismantle opponent patterns to find weakness and strike precisely.", clutch: "Checkmate: It's not luck. The trap you set earlier finally works, and you calmly harvest the victory.", krypt: "Analysis Paralysis: Mental overload. Overthinking leads to hesitation and missing the best window of opportunity.", motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.", motE: "The Legend: Motivated by glory and being the hero in big moments.", regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music or shouting to get 'hot' before the game.", regR: "Cool Down Needed: High sensitivity. Needs solitude and deep breathing to calm down and focus.", lrnV: "Visual Learner: Learns best by watching videos and diagrams to build mental images.", lrnK: "Kinesthetic Learner: Learns best by doing, sweating, and feeling the muscle feedback." }
        },
        A: { 
            zh: { name: "Assassin", cn: "刺客", v: "统治者", team: "[突击手]: 你是战术体系的尖刀。你的任务不是组织，而是屏蔽一切干扰，把那该死的球送进目标。", solo: "[猎手]: 你是一匹独狼。你不需要花哨的布局，你只需要比对手更快、更准、更狠。", clutch: "本能接管: 大脑一片空白，身体自动接管一切。你根本不记得动作细节，只记得：看见目标 -> 解决目标。", krypt: "隧道视野: 独狼陷阱。极致的专注让你容易忽略处于更好位置的队友，或被对手针对性防守锁死。", motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。", motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。", regS: "需点火: 基础唤醒度较低，建议赛前听快节奏重金属音乐、大声吼叫，让自己'热'起来。", regR: "需降温: 神经系统天生敏感易'过热'，建议赛前戴降噪耳机、独处、深呼吸保持冷静。", lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。", lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。" },
            en: { name: "Assassin", cn: "Assassin", v: "Dominator", team: "[Striker]: You are the spearhead. Your job isn't to organize, but to block noise and finish the target.", solo: "[Hunter]: A lone wolf. You don't need fancy setups, you just need to be faster, sharper, and tougher.", clutch: "Instinct Takeover: Mind goes blank, body takes over. You don't remember details, just: See Target -> Destroy Target.", krypt: "Tunnel Vision: Extreme focus makes you miss open teammates or get trapped by targeted defense.", motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.", motE: "The Legend: Motivated by glory and being the hero in big moments.", regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music or shouting to get 'hot' before the game.", regR: "Cool Down Needed: High sensitivity. Needs solitude and deep breathing to calm down and focus.", lrnV: "Visual Learner: Learns best by watching videos and diagrams to build mental images.", lrnK: "Kinesthetic Learner: Learns best by doing, sweating, and feeling the muscle feedback." }
        },
        P: { 
            zh: { name: "Practitioner", cn: "实践者", v: "偶像", team: "[专家]: 你是队伍的基石。无论环境多么混乱，你总能提供最稳定、最精密的输出。", solo: "[技术大师]: 你在和自己比赛。你追求动作的极致纯粹与零误差，对手只是你的陪衬。", clutch: "绝对零度: 全场窒息的压力下，你进入了绝对宁静。心率平稳，动作像机器一样精准完美。", krypt: "机械僵化: 易碎品。你对环境极度敏感，一旦节奏被打乱(如裁判误判、装备问题)，心态易崩盘。", motT: "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。", motE: "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。", regS: "需点火: 基础唤醒度较低，建议赛前听快节奏重金属音乐、大声吼叫，让自己'热'起来。", regR: "需降温: 神经系统天生敏感易'过热'，建议赛前戴降噪耳机、独处、深呼吸保持冷静。", lrnV: "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。", lrnK: "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。" },
            en: { name: "Practitioner", cn: "Practitioner", v: "Icon", team: "[Specialist]: The foundation. In chaos, you provide the most stable, precise output.", solo: "[Technician]: You compete with yourself. You seek zero-error purity. The opponent is just background.", clutch: "Absolute Zero: In suffocating pressure, you find absolute silence. Heart rate steady, movement machine-like.", krypt: "Mechanical Rigidity: Fragile to disruption. Highly sensitive to environment; bad calls or gear issues can break your flow.", motT: "The Seeker: Motivated by mastery and self-improvement rather than just winning.", motE: "The Legend: Motivated by glory and being the hero in big moments.", regS: "Ignition Needed: Low arousal baseline. Needs high-tempo music or shouting to get 'hot' before the game.", regR: "Cool Down Needed: High sensitivity. Needs solitude and deep breathing to calm down and focus.", lrnV: "Visual Learner: Learns best by watching videos and diagrams to build mental images.", lrnK: "Kinesthetic Learner: Learns best by doing, sweating, and feeling the muscle feedback." }
        }
    };

    const t = translations[currentLang]; const d = db[base][currentLang]; const isEgo = (fM === "E");
    document.getElementById('result-name-cn').innerText = (fR === "S" ? (currentLang==='zh'?"冷面":"Stoic ") : (currentLang==='zh'?"激情":"Fiery ")) + (isEgo ? d.v : d.cn);
    document.getElementById('result-name-en').innerText = `The ${(fR === "S" ? "Stoic" : "Fiery")} ${(isEgo ? d.v : d.name)} (${fP})`;
    document.getElementById('one-liner').innerText = t.oneLiner;
    document.getElementById('identity-title').innerText = t.identityTitle; document.getElementById('team-context').innerText = d.team; document.getElementById('solo-context').innerText = d.solo;
    document.getElementById('xfactor-title').innerText = t.xfactorTitle; document.getElementById('clutch-moment').innerText = d.clutch; document.getElementById('kryptonite').innerText = d.krypt;
    document.getElementById('advice-title').innerText = t.adviceTitle; document.getElementById('mot-label').innerText = t.motLabel; document.getElementById('motivation-text').innerText = (fM === 'T') ? d.motT : d.motE;
    document.getElementById('reg-label').innerText = t.regLabel; document.getElementById('regulation-text').innerText = (fR === 'S') ? d.regS : d.regR;
    document.getElementById('lrn-label').innerText = t.lrnLabel; document.getElementById('learning-text').innerText = (fP === 'V') ? d.lrnV : d.lrnK;
    document.getElementById('purchase-btn-text').innerText = t.purchaseBtn;
}

/* --- 支付弹窗逻辑 (精简版：仅保留社会认同) --- */
function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const box = document.getElementById('payment-box');
    modal.classList.remove('hidden');
    
    // 更新社会认同文字
    const t = translations[currentLang];
    const ticker = document.getElementById('social-proof-ticker');
    const baseCount = 1482 + Math.floor(Math.random() * 50);
    ticker.innerText = (currentLang === 'zh') 
        ? `已有 ${baseCount} 位精英运动员获得报告` 
        : `${baseCount} ATHLETES UNLOCKED THEIR REPORTS`;
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
    }, 10);
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const box = document.getElementById('payment-box');
    modal.classList.add('opacity-0'); box.classList.remove('scale-100'); box.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300); 
}

// 点击背景关闭
document.getElementById('payment-modal').addEventListener('click', function(e) { if (e.target === this) closePaymentModal(); });

/* =========================================
   9. 生成分享海报逻辑 (Task 4: html2canvas)
   ========================================= */
function generatePoster() {
    const t = translations[currentLang];
    const btn = document.getElementById('download-btn');
    const btnText = document.getElementById('download-btn-text');
    const originalText = btnText.innerText;
    
    // UI 反馈：按钮变成“生成中...”并禁用，防止用户狂点
    btnText.innerText = t.generatingBtn || "Generating...";
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    // 获取我们要截图的那个正方形区域
    const posterArea = document.getElementById('poster-area');
    const codeStr = document.getElementById('result-code').innerText;
    
    // 使用 html2canvas 引擎进行 DOM 截图
    html2canvas(posterArea, {
        scale: 2, // 提高 2 倍分辨率，让海报在手机上更清晰
        backgroundColor: "#020617", // 强制使用深渊黑背景防止透明底报错
        useCORS: true // 允许跨域加载字体或图片
    }).then(canvas => {
        // 创建一个隐藏的 a 标签用于触发下载
        const link = document.createElement('a');
        link.download = `APB-Elite-${codeStr}.png`; // 自动命名，如 APB-Elite-CTSV.png
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // 恢复按钮状态
        btnText.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }).catch(err => {
        console.error("Poster generation failed:", err);
        alert(currentLang === 'zh' ? "海报生成失败，请重试。" : "Generation failed, please try again.");
        // 恢复按钮状态
        btnText.innerText = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}
