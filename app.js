/* --- APB CORE ENGINE v2.0 --- */
const questions = [
    // 维度 A (注意广度): Broad(B) vs Narrow(N) [cite: 105]
    { dim: "A", q: "在比赛防守中，你更倾向于监控全场的空档与跑位，还是死盯对位球员？", a: "监控全场", b: "死盯对位", valA: "B", valB: "N" },
    { dim: "A", q: "当你持球时，你的第一直觉是寻找远端队友，还是寻找面前进攻点？", a: "寻找远端", b: "寻找面前", valA: "B", valB: "N" },
    { dim: "A", q: "面对突发反击，你更倾向于观察整体阵型，还是加速追赶球权？", a: "观察阵型", b: "追赶球权", valA: "B", valB: "N" },
    // 维度 C (指令偏好): Internal(I) vs External(E) [cite: 102]
    { dim: "C", q: "罚球或射门前，你脑海中更多是身体发力感，还是球的运行轨迹？", a: "身体发力感", b: "运行轨迹", valA: "I", valB: "E" },
    { dim: "C", q: "执行技术动作时，你更关注核心收紧感，还是动作的落点精准度？", a: "核心收紧感", b: "落点精准度", valA: "I", valB: "E" },
    { dim: "C", q: "当教练给出指令，你第一反应是检查动作细节，还是看向战术位置？", a: "动作细节", b: "战术位置", valA: "I", valB: "E" },
    { dim: "C", q: "疲劳状态下，你倾向于通过呼吸节奏找回状态，还是寻找外部参考点？", a: "呼吸节奏", b: "外部参考点", valA: "I", valB: "E" },
    // 维度 M (动机): Task(T) vs Ego(E) [cite: 108]
    { dim: "M", q: "什么最能激发你的斗志？", a: "掌握一项从未完成的新技术", b: "在直接对抗中彻底击败对手", valA: "T", valB: "E" },
    { dim: "M", q: "你最希望退役后获得的头衔是？", a: "追求极致的技术大师", b: "赢得无数荣誉的传奇", valA: "T", valB: "E" },
    { dim: "M", q: "面对高强度训练，你更在意？", a: "是否超越了昨天的自己", b: "是否在组内表现排名第一", valA: "T", valB: "E" },
    // 维度 R (调节): Stoic(S) vs Reactive(R) [cite: 110]
    { dim: "R", q: "面对关键失误，你的第一反应是？", a: "面无表情迅速进入下个环节", b: "通过肢体或言语释放情绪", valA: "S", valB: "R" },
    { dim: "R", q: "状态火热时，你通常表现得？", a: "冷酷且极度专注", b: "激情四射并积极互动", valA: "S", valB: "R" },
    { dim: "R", q: "面对裁判误判，你会？", a: "迅速压抑情绪保持专注", b: "表达立场并以此转化为动力", valA: "S", valB: "R" },
    // 维度 P (感知): Visual(V) vs Kinesthetic(K) [cite: 100]
    { dim: "P", q: "学习新战术，你觉得哪种更高效？", a: "反复观看视频录像或示范", b: "在场上走一遍亲身体验", valA: "V", valB: "K" },
    { dim: "P", q: "记忆最深的赛场瞬间通常是？", a: "当时的视觉画面", b: "当时的肌肉发力感", valA: "V", valB: "K" },
    { dim: "P", q: "教练讲解时，你更喜欢？", a: "看战术板上的箭头分布", b: "听描述后直接模仿发力", valA: "V", valB: "K" }
];

let currentStep = 0;
let userAnswers = []; // 存储每一步的具体选择对象

function startQuiz() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    currentStep = 0;
    userAnswers = [];
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentStep];
    document.getElementById('progress-text').innerText = `Question ${currentStep + 1} / 16`;
    document.getElementById('progress-bar').style.width = `${((currentStep + 1) / 16) * 100}%`;
    document.getElementById('question-text').innerText = q.q;
    
    // 渲染选项
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}')" class="option-btn">A. ${q.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}')" class="option-btn">B. ${q.b}</button>
    `;

    // 渲染“返回上一题”按钮 (第一题不显示)
    const navContainer = document.getElementById('back-nav');
    if (currentStep > 0) {
        navContainer.innerHTML = `<button onclick="goBack()" class="mt-4 text-slate-400 text-sm font-bold hover:text-blue-600 transition underline tracking-widest">返回上一题</button>`;
    } else {
        navContainer.innerHTML = "";
    }
}

function handleSelect(dim, val) {
    // 存储当前答案
    userAnswers[currentStep] = { dim: dim, val: val };
    
    currentStep++;
    if (currentStep < 16) {
        renderQuestion();
    } else {
        // 进入确认揭晓页
        document.getElementById('quiz-page').classList.add('hidden');
        document.getElementById('confirm-page').classList.remove('hidden');
    }
}

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion();
    }
}

function goBackToLast() {
    currentStep = 15; // 指向最后一题
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    renderQuestion();
}

function showFinalResult() {
    // 切换页面
    document.getElementById('confirm-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    // 置信度加权算法逻辑 [cite: 114]
    const calculateDim = (dimName) => {
        const relevant = userAnswers.filter(a => a.dim === dimName).map(a => a.val);
        const counts = relevant.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    const finalA = calculateDim('A'); // B/N
    const finalC = calculateDim('C'); // I/E
    const finalM = calculateDim('M'); // T/E
    const finalR = calculateDim('R'); // S/R
    const finalP = calculateDim('P'); // V/K

    // 确定四大家族底座 [cite: 119-122]
    let base = "";
    if (finalA === 'B' && finalC === 'E') base = "C";
    else if (finalA === 'B' && finalC === 'I') base = "M";
    else if (finalA === 'N' && finalC === 'E') base = "A";
    else if (finalA === 'N' && finalC === 'I') base = "P";

    // 构造唯一代码: [家族]+[动力]+[调节]+[感知] [cite: 5]
    const code = base + finalM + finalR + finalP;
    document.getElementById('result-code').innerText = code;

    // 获取资产库数据 [cite: 38, 83]
    const db = {
        "C": { name: "Commander", cn: "指挥官", variant: "将军", vibe: "领袖感、力量、掌控", totem: "狮子" },
        "M": { name: "Mastermind", cn: "策划家", variant: "宗师", vibe: "智力感、精密、神秘", totem: "猫头鹰" },
        "A": { name: "Assassin", cn: "刺客", variant: "统治者", vibe: "速度感、爆发、锐利", totem: "猎豹" },
        "P": { name: "Practitioner", cn: "实践者", variant: "偶像", vibe: "平衡感、极简、专注", totem: "老鹰" }
    };

    const data = db[base];
    const isEgo = (finalM === "E");
    const roleCN = isEgo ? data.variant : data.cn;
    const prefix = (finalR === "S" ? "冷面" : "激情");
    const suffix = (finalP === "V" ? "视觉型" : "动觉型");

    document.getElementById('result-name-cn').innerText = `${prefix}${roleCN}-${suffix}`;
    document.getElementById('result-name-en').innerText = `The ${(finalR === "S" ? "Stoic" : "Fiery")} ${(isEgo ? data.variant : data.name)} (${finalP})`;
    
    // 视觉分层逻辑 [cite: 19-24]
    document.getElementById('totem-desc').innerText = `[图腾: ${data.totem}] [背景颜色: ${(finalR === 'S' ? '蓝色' : '红色')}] [核心符号: ${(finalM === 'T' ? '齿轮' : '皇冠')}] [边框样式: ${(finalP === 'V' ? '实线' : '虚线')}]`;
    document.getElementById('character-desc').innerText = `[核心气质: ${data.vibe}] 遵循去道具化原则，立绘仅负责表现原型气质。`;
    document.getElementById('one-liner').innerText = "不仅是性格，更是你的赛场基因。";
}
