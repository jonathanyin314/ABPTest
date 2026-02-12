/* --- APB CORE ENGINE v2.0 --- */
const questions = [
    // 维度 A: 注意广度 (B/N) [cite: 157]
    { dim: "A", label: "注意评估", q: "在比赛防守中，你更倾向于：", a: "监控全场的空档与跑位", b: "死盯自己负责的对位球员", valA: "B", valB: "N" },
    { dim: "A", label: "注意评估", q: "当你持球时，你的第一直觉是：", a: "寻找远端空位的队友", b: "寻找面前的进攻切入点", valA: "B", valB: "N" },
    { dim: "A", label: "注意评估", q: "面对突发反击，你倾向于：", a: "观察整体阵型的变化", b: "加速追赶最近的球权", valA: "B", valB: "N" },
    // 维度 C: 指令偏好 (I/E) [cite: 154]
    { dim: "C", label: "控制模式", q: "罚球或射门前，你脑海中更多是：", a: "身体发力的顺序与感觉", b: "球划过弧线进入目标的过程", valA: "I", valB: "E" },
    { dim: "C", label: "控制模式", q: "教练在场边大喊指令时，你更容易：", a: "检查自己的动作是否变形", b: "立刻观察指令提到的战术位置", valA: "I", valB: "E" },
    { dim: "C", label: "控制模式", q: "陷入疲劳时，你会下意识地：", a: "控制呼吸和心率的节奏", b: "寻找外部节奏或参考物", valA: "I", valB: "E" },
    { dim: "C", label: "控制模式", q: "完成高难度动作后，你的第一反馈是：", a: "刚才的核心收紧感很好", b: "球的落点非常精准", valA: "I", valB: "E" },
    // 维度 P: 感知通道 (V/K) [cite: 152]
    { dim: "P", label: "感知学习", q: "复盘比赛时，你更喜欢哪种方式？", a: "反复观看比赛视频剪辑", b: "在脑中回想肌肉发力的瞬间", valA: "V", valB: "K" },
    { dim: "P", label: "感知学习", q: "理解新战术图纸对你来说：", a: "非常直观，一眼就能看明白", b: "有点抽象，需要在场上走一遍才行", valA: "V", valB: "K" },
    { dim: "P", label: "感知学习", q: "你记忆最深刻的比赛瞬间通常是：", a: "那次传球的惊艳视觉画面", b: "那次对抗中肌肉的撞击感", valA: "V", valB: "K" },
    // 维度 M: 动力引擎 (T/E) [cite: 160]
    { dim: "M", label: "动力引擎", q: "落后时，你的动力主要来自于：", a: "尝试新的进攻方案并打成它", b: "证明自己的能力不比对手差", valA: "T", valB: "E" },
    { dim: "M", label: "动力引擎", q: "面对高强度训练，你更在意：", a: "是否完成了今天的训练目标", b: "是否在组内表现排名第一", valA: "T", valB: "E" },
    { dim: "M", label: "动力引擎", q: "你最希望获得的理想评价是：", a: "一个不断精进自己技术的大师", b: "一个赢得过无数冠军的传奇", valA: "T", valB: "E" },
    // 维度 R: 情绪调节 (S/R) [cite: 162]
    { dim: "R", label: "调节机制", q: "面对关键球失误，你通常会：", a: "迅速压抑情绪，保持冷静专注", b: "通过情绪释放来激励后续表现", valA: "S", valB: "R" },
    { dim: "R", label: "调节机制", q: "当你状态火热时，你通常会：", a: "依然保持冷酷和极度专注", b: "会有更多的激情庆祝和互动", valA: "S", valB: "R" },
    { dim: "R", label: "调节机制", q: "在更衣室面对批评，你表现得：", a: "低头反思，不露声色", b: "会表达观点，据理力争", valA: "S", valB: "R" }
];

let currentStep = 0;
let scores = { A: [], C: [], P: [], M: [], R: [] };

function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentStep];
    // 核心修复：确保所有 getElementById 的 ID 在 index.html 中都存在
    if (document.getElementById('dim-label')) document.getElementById('dim-label').innerText = q.label;
    if (document.getElementById('progress-text')) document.getElementById('progress-text').innerText = `${currentStep + 1} / 16`;
    if (document.getElementById('progress-bar')) document.getElementById('progress-bar').style.width = `${((currentStep + 1) / 16) * 100}%`;
    if (document.getElementById('question-text')) document.getElementById('question-text').innerText = q.q;
    
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${q.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${q.b}</button>
    `;
}

function handleSelect(dim, val) {
    scores[dim].push(val);
    currentStep++;
    if (currentStep < 16) renderQuestion(); else showResult();
}

function showResult() {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    
    const getMajor = (arr) => {
        if (!arr || arr.length === 0) return "";
        const counts = arr.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    const finalA = getMajor(scores['A']); 
    const finalC = getMajor(scores['C']); 
    const finalM = getMajor(scores['M']); 
    const finalR = getMajor(scores['R']); 
    const finalP = getMajor(scores['P']); 

    // 1. 家族原型判断 [cite: 171-174]
    let family = "";
    if (finalA === "B" && finalC === "E") family = "C"; 
    else if (finalA === "B" && finalC === "I") family = "M"; 
    else if (finalA === "N" && finalC === "E") family = "A"; 
    else if (finalA === "N" && finalC === "I") family = "P"; 

    // 2. 映射 4 字母唯一代码 [cite: 58]
    const finalCode = family + finalM + finalR + finalP;
    document.getElementById('result-code').innerText = finalCode;

    // 3. 资产库调用 [cite: 93-122]
    const baseInfo = {
        "C": { name: "Commander", cn: "指挥官", totem: "狮子", vibe: "领袖感、掌控" },
        "M": { name: "Mastermind", cn: "策划家", totem: "猫头鹰", vibe: "精密、神秘" },
        "A": { name: "Assassin", cn: "刺客", totem: "猎豹", vibe: "锐利、爆发" },
        "P": { name: "Practitioner", cn: "实践者", totem: "老鹰", vibe: "专注、平衡" }
    };

    const data = baseInfo[family];
    // 动态命名逻辑 [cite: 135]
    const variant = (finalM === "E") ? (family === "C" ? "将军" : family === "M" ? "宗师" : family === "A" ? "统治者" : "偶像") : data.cn;
    const prefix = (finalR === "S") ? "冷面" : "激情";
    const suffix = (finalP === "V") ? "视觉型" : "动觉型";

    document.getElementById('result-name-cn').innerText = `${prefix}${variant}-${suffix}`;
    document.getElementById('result-name-en').innerText = `The ${(finalR === "S" ? "Stoic" : "Fiery")} ${data.name} (${finalP})`;
    
    // 视觉分层逻辑 [cite: 71-78]
    document.getElementById('totem-desc').innerText = `[图腾: ${data.totem}] [背景: ${(finalR === 'S' ? '蓝色' : '红色')}] [符号: ${(finalM === 'T' ? '齿轮' : '皇冠')}] [边框: ${(finalP === 'V' ? '实线' : '虚线')}]`;
    document.getElementById('character-desc').innerText = `[气质: ${data.vibe}] 遵循去道具化策略，强调体态与动作张力。`;
}
