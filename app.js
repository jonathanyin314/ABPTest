/* --- APB CORE ENGINE v2.0 --- */
const questions = [
    // A: 视野 (B/N) [cite: 105]
    { dim: "A", q: "比赛中，你更倾向于监控全场的空档与跑位，还是死盯对位球员？", a: "监控全场", b: "死盯对位", valA: "B", valB: "N" },
    { dim: "A", q: "当你持球时，你的第一直觉是寻找远端队友，还是寻找面前进攻点？", a: "寻找远端", b: "寻找面前", valA: "B", valB: "N" },
    { dim: "A", q: "面对突发反击，你更倾向于观察整体阵型，还是加速追赶球权？", a: "观察阵型", b: "追赶球权", valA: "B", valB: "N" },
    // C: 指令 (I/E) [cite: 102]
    { dim: "C", q: "罚球或射门前，你脑海中更多是身体发力感，还是球的运行轨迹？", a: "身体发力感", b: "运行轨迹", valA: "I", valB: "E" },
    { dim: "C", q: "执行技术动作时，你更关注核心收紧感，还是动作的落点精准度？", a: "核心收紧感", b: "落点精准度", valA: "I", valB: "E" },
    { dim: "C", q: "当教练给出指令，你第一反应是检查动作细节，还是看向战术位置？", a: "动作细节", b: "战术位置", valA: "I", valB: "E" },
    { dim: "C", q: "疲劳状态下，你倾向于通过呼吸节奏找回状态，还是寻找外部参考点？", a: "呼吸节奏", b: "外部参考点", valA: "I", valB: "E" },
    // M: 动力 (T/E) [cite: 108]
    { dim: "M", q: "什么最能激发你的斗志？", a: "掌握一项从未完成的新技术", b: "在直接对抗中彻底击败对手", valA: "T", valB: "E" },
    { dim: "M", q: "你最希望退役后获得的头衔是？", a: "追求极致的技术大师", b: "赢得无数荣誉的传奇", valA: "T", valB: "E" },
    { dim: "M", q: "面对高强度训练，你更在意？", a: "是否超越了昨天的自己", b: "是否在组内表现排名第一", valA: "T", valB: "E" },
    // R: 调节 (S/R) [cite: 110]
    { dim: "R", q: "面对关键失误，你的第一反应是？", a: "面无表情迅速进入下个环节", b: "通过肢体或言语释放情绪", valA: "S", valB: "R" },
    { dim: "R", q: "状态火热时，你通常表现得？", a: "冷酷且极度专注", b: "激情四射并积极互动", valA: "S", valB: "R" },
    { dim: "R", q: "面对裁判误判，你会？", a: "迅速压抑情绪保持专注", b: "表达立场并以此转化为动力", valA: "S", valB: "R" },
    // P: 感知 (V/K) [cite: 100]
    { dim: "P", q: "学习新战术，你觉得哪种更高效？", a: "反复观看视频录像或示范", b: "在场上走一遍亲身体验", valA: "V", valB: "K" },
    { dim: "P", q: "记忆最深的赛场瞬间通常是？", a: "当时的视觉画面", b: "当时的肌肉发力感", valA: "V", valB: "K" },
    { dim: "P", q: "教练讲解时，你更喜欢？", a: "看战术板上的箭头分布", b: "听描述后直接模仿发力", valA: "V", valB: "K" }
];

let currentStep = 0;
let scores = { A: [], C: [], M: [], R: [], P: [] };
let resultGenerated = false; // 确保生成结果后不能返回

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
}

function handleSelect(dim, val) {
    // 存储或覆盖当前步骤的选择
    scores[dim][currentStep] = val; 
    currentStep++;

    if (currentStep < 16) {
        renderQuestion();
    } else {
        // 进入确认页
        document.getElementById('quiz-page').classList.add('hidden');
        document.getElementById('confirm-page').classList.remove('hidden');
    }
}

// 功能 1：从确认页返回最后一题
function goBackToLast() {
    currentStep = 15; // 指向第 16 题 (索引 15)
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

// 功能 2 & 核心 Bug 修复：生成结果
function showResult() {
    if (resultGenerated) return; // 锁定状态

    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    const getMajor = (dimKey) => {
        const arr = Object.values(scores[dimKey]).filter(v => v != null);
        const counts = arr.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    // 获取 5 个维度的最终计算值 [cite: 38]
    const finalA = getMajor('A');
    const finalC = getMajor('C');
    const finalM = getMajor('M');
    const finalR = getMajor('R');
    const finalP = getMajor('P');

    // 底座判断：A+C [cite: 119-122]
    let base = "";
    if (finalA === 'B' && finalC === 'E') base = "C";
    else if (finalA === 'B' && finalC === 'I') base = "M";
    else if (finalA === 'N' && finalC === 'E') base = "A";
    else if (finalA === 'N' && finalC === 'I') base = "P";

    // 组合 4 位代码 [cite: 5]
    const finalCode = base + finalM + finalR + finalP;
    document.getElementById('result-code').innerText = finalCode;

    // 获取文案库 [cite: 38, 83, 84]
    const baseMap = {
        "C": { en: "Commander", cn: "指挥官", varE: "将军", vibe: "领袖感、掌控", totem: "狮子" },
        "M": { en: "Mastermind", cn: "策划家", varE: "宗师", vibe: "智力感、精密", totem: "猫头鹰" },
        "A": { en: "Assassin", cn: "刺客", varE: "统治者", vibe: "爆发感、速度", totem: "猎豹" },
        "P": { en: "Practitioner", cn: "实践者", varE: "偶像", vibe: "平衡感、专注", totem: "老鹰" }
    };

    const d = baseMap[base];
    const roleName = (finalM === "E") ? d.varE : d.cn;
    const prefix = (finalR === "S") ? "冷面" : "激情";
    const suffix = (finalP === "V") ? "视觉型" : "动觉型";

    document.getElementById('result-name-cn').innerText = `${prefix}${roleName}-${suffix}`;
    document.getElementById('result-name-en').innerText = `The ${(finalR === "S" ? "Stoic" : "Fiery")} ${(finalM === "E" ? d.varE : d.en)} (${finalP})`;
    
    // 视觉映射 [cite: 21-24]
    document.getElementById('totem-desc').innerText = `[图腾: ${d.totem}] [背景: ${(finalR === 'S' ? '蓝色 (Stoic)' : '红色 (Fiery)')}] [符号: ${(finalM === 'T' ? '齿轮 (Task)' : '皇冠 (Ego)')}] [边框: ${(finalP === 'V' ? '实线 (Visual)' : '虚线 (Kinesthetic)')}]`;
    document.getElementById('character-desc').innerText = `[体态: ${d.vibe}] 遵循去道具化原则，背景图腾承载视觉逻辑，立绘负责演绎气质 [cite: 17, 124, 126] 。`;
    document.getElementById('one-liner').innerText = "你拥有独特的竞技本能，这是你的赛场基因。";

    resultGenerated = true; // 锁定结果，防止篡改
}
