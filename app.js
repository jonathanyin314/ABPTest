/* --- APB CORE ENGINE v2.0 (Deep Content Edition) --- */

const questions = [
    { dim: "A", q: "在比赛防守中，你更倾向于监控全场的空档与跑位，还是死盯对位球员？", a: "监控全场", b: "死盯对位", valA: "B", valB: "N" },
    { dim: "A", q: "当你持球时，你的第一直觉是寻找远端队友，还是寻找面前进攻点？", a: "寻找远端", b: "寻找面前", valA: "B", valB: "N" },
    { dim: "A", q: "面对突发反击，你更倾向于观察整体阵型，还是加速追赶球权？", a: "观察阵型", b: "追赶球权", valA: "B", valB: "N" },
    { dim: "C", q: "罚球或射门前，你脑海中更多是身体发力感，还是球的运行轨迹？", a: "身体发力感", b: "运行轨迹", valA: "I", valB: "E" },
    { dim: "C", q: "执行技术动作时，你更关注核心收紧感，还是动作的落点精准度？", a: "核心收紧感", b: "落点精准度", valA: "I", valB: "E" },
    { dim: "C", q: "当教练给出指令，你第一反应是检查动作细节，还是看向战术位置？", a: "动作细节", b: "战术位置", valA: "I", valB: "E" },
    { dim: "C", q: "疲劳状态下，你倾向于通过呼吸节奏找回状态，还是寻找外部参考点？", a: "呼吸节奏", b: "外部参考点", valA: "I", valB: "E" },
    { dim: "M", q: "什么最能激发你的斗志？", a: "掌握一项从未完成的新技术", b: "在直接对抗中彻底击败对手", valA: "T", valB: "E" },
    { dim: "M", q: "你最希望退役后获得的头衔是？", a: "追求极致的技术大师", b: "赢得无数荣誉的传奇", valA: "T", valB: "E" },
    { dim: "M", q: "面对高强度训练，你更在意？", a: "是否超越了昨天的自己", b: "是否在组内表现排名第一", valA: "T", valB: "E" },
    { dim: "R", q: "面对关键失误，你的第一反应是？", a: "面无表情迅速进入下个环节", b: "通过肢体或言语释放情绪", valA: "S", valB: "R" },
    { dim: "R", q: "状态火热时，你通常表现得？", a: "冷酷且极度专注", b: "激情四射并积极互动", valA: "S", valB: "R" },
    { dim: "R", q: "面对裁判误判，你会？", a: "迅速压抑情绪保持专注", b: "表达立场并以此转化为动力", valA: "S", valB: "R" },
    { dim: "P", q: "学习新战术，你觉得哪种更高效？", a: "反复观看视频录像或示范", b: "在场上走一遍亲身体验", valA: "V", valB: "K" },
    { dim: "P", q: "记忆最深的赛场瞬间通常是？", a: "当时的视觉画面", b: "当时的肌肉发力感", valA: "V", valB: "K" },
    { dim: "P", q: "教练讲解时，你更喜欢？", a: "看战术板上的箭头分布", b: "听描述后直接模仿发力", valA: "V", valB: "K" }
];

let currentStep = 0;
let userAnswers = [];

/* --- 数据持久化 (No-code 友好版) --- */
window.onload = function() {
    const saved = localStorage.getItem('apb_progress');
    if (saved) {
        document.getElementById('continue-box').classList.remove('hidden');
        document.getElementById('start-btn').classList.add('hidden');
    }
};

function loadSavedQuiz() {
    const data = JSON.parse(localStorage.getItem('apb_progress'));
    userAnswers = data.answers;
    currentStep = data.step;
    document.getElementById('continue-box').classList.add('hidden');
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function clearAndStart() {
    localStorage.removeItem('apb_progress');
    location.reload();
}

/* --- 核心逻辑 --- */
function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentStep];
    document.getElementById('progress-text').innerText = `Question ${currentStep + 1} / 16`;
    document.getElementById('progress-bar').style.width = `${((currentStep + 1) / 16) * 100}%`;
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${q.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${q.b}</button>
    `;
    const nav = document.getElementById('back-nav');
    nav.innerHTML = currentStep > 0 ? `<button onclick="goBack()" class="mt-4 text-slate-400 underline">返回上一题</button>` : "";
}

function handleSelect(dim, val) {
    userAnswers[currentStep] = { dim, val };
    currentStep++;
    // 自动保存进度
    localStorage.setItem('apb_progress', JSON.stringify({ step: currentStep, answers: userAnswers }));
    
    if (currentStep < 16) renderQuestion(); 
    else {
        document.getElementById('quiz-page').classList.add('hidden');
        document.getElementById('confirm-page').classList.remove('hidden');
    }
}

function goBack() { currentStep--; renderQuestion(); }
function goBackToLast() { currentStep = 15; document.getElementById('confirm-page').classList.add('hidden'); document.getElementById('quiz-page').classList.remove('hidden'); renderQuestion(); }

function showFinalResult() {
    localStorage.removeItem('apb_progress'); // 完成后清除存档
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const getMaj = (dim) => {
        const arr = userAnswers.filter(a => a.dim === dim).map(a => a.val);
        return arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
    };

    const finalA = getMaj('A'); const finalC = getMaj('C');
    const finalM = getMaj('M'); const finalR = getMaj('R'); const finalP = getMaj('P');

    let base = (finalA === 'B' && finalC === 'E') ? "C" : (finalA === 'B' && finalC === 'I') ? "M" : (finalA === 'N' && finalC === 'E') ? "A" : "P";
    const code = base + finalM + finalR + finalP;
    document.getElementById('result-code').innerText = code;

    /* --- 深度资产调用 (Based on Master Content DB v2.0) --- */
    const contentDB = {
        "C": { name: "Commander", cn: "指挥官", varE: "将军", vibe: "力量、掌控", one: "你是混乱中的风暴眼，直觉是你最锋利的武器。", team: "[场上将军]: 你负责用想象力撕开防线，你的传球和调度是进攻号角。", solo: "[控场大师]: 你打的不是球，是空间。你擅长阅读对手意图，用节奏掌控全场。", clutch: "上帝视角: 全场压力最大时你视野最宽，本能送出致命一击。", krypt: "直觉陷阱: 轻视细节，容易因过度自信尝试不必要的高难度动作。" },
        "M": { name: "Mastermind", cn: "策划家", varE: "宗师", vibe: "精密、神秘", one: "你是球场上的棋手，总能比对手多算三步。", team: "[战术架构师]: 你是队伍大脑，不仅看空档，还能计算最佳进攻线路。", solo: "[宗师]: 你在与对手下棋。你擅长拆解对手动作模式并精准打击。", clutch: "将军: 你在比赛前段布下的局终于生效，你冷静收割胜利。", krypt: "分析瘫痪: 想得太多会导致动作僵硬，错失稍纵即逝的时机。" },
        "A": { name: "Assassin", cn: "刺客", varE: "统治者", vibe: "爆发、锐利", one: "你是为终结而生的利刃，眼中只有猎物。", team: "[突击手]: 你的任务不是组织，而是屏蔽干扰，把球送进目标。", solo: "[猎手]: 独狼模式，不需要花哨布局，只需要比对手更快、更准、更狠。", clutch: "本能接管: 大脑空白，身体自动接管。看见目标 -> 解决目标。", krypt: "隧道视野: 容易忽略位置更好的队友，或被对手针对性防锁。" },
        "P": { name: "Practitioner", cn: "实践者", varE: "偶像", vibe: "专注、平衡", one: "你是追求完美的艺术家，每一次动作都是教科书。", team: "[专家]: 你是队伍基石。无论环境多混乱，你总能提供最精密输出。", solo: "[技术大师]: 你追求动作极致纯粹，对手只是你的陪衬。", clutch: "绝对零度: 全场窒息压力下你进入绝对宁静，动作像机器一样精准。", krypt: "机械僵化: 对环境极度敏感，一旦节奏被打乱心态易崩盘。" }
    };

    const d = contentDB[base];
    document.getElementById('result-name-cn').innerText = (finalR==="S"?"冷面":"激情") + (finalM==="E"?d.varE:d.cn) + "-" + (finalP==="V"?"视觉型":"动觉型");
    document.getElementById('result-name-en').innerText = `The ${(finalR==="S"?"Stoic":"Fiery")} ${(finalM==="E"?d.varE:d.name)} (${finalP})`;
    document.getElementById('one-liner').innerText = d.one;
    document.getElementById('team-context').innerText = d.team;
    document.getElementById('solo-context').innerText = d.solo;
    document.getElementById('clutch-moment').innerText = d.clutch;
    document.getElementById('kryptonite').innerText = d.krypt;

    /* --- 动力引擎、调节、感知学习描述 [cite: 73-80] --- */
    document.getElementById('motivation-text').innerText = (finalM === "T") ? "求道者: 渴望超越昨天的自己，掌握新技能比赢球更兴奋。" : "传奇者: 渴望荣耀，关键时刻挺身而出成为英雄。";
    document.getElementById('regulation-text').innerText = (finalR === "S") ? "需点火: 基础唤醒度较低，建议赛前听快节奏重金属音乐让自己'热'起来。" : "需降温: 神经系统天生敏感易'过热'，建议赛前独处、深呼吸保持冷静。";
    document.getElementById('learning-text').innerText = (finalP === "V") ? "视觉型: 建议多看战术板和录像，脑中建立图像比听教练说更有效。" : "动觉型: 建议以赛代练，通过肌肉反馈和重复实操建立记忆。";
    document.getElementById('totem-desc').innerText = `[图腾: ${d.totem}] [颜色: ${(finalR === 'S' ? '蓝' : '红')}] [符号: ${(finalM === 'T' ? '齿轮' : '皇冠')}] [边框: ${(finalP === 'V' ? '实线' : '虚线')}]`;
    document.getElementById('character-desc').innerText = `[核心气质: ${d.vibe}] 去道具化设计，通过极简素体演绎动作张力。`;
}
