/* --- APB ELITE v3.3 PROFESSIONAL ENGINE --- */

let currentLang = 'zh';
let isRapidMode = true; 
let activeSkin = 'S0'; 
let currentStep = 0;
let userAnswers = [];
let userProfile = { gender: '', sport: '' };
let validityStatus = { honest: true, consistent: true, attentive: true };

// --- Step 3: 中英双语映射引擎 (Sport-to-Skin Mapper) ---
const sportRegistry = {
    S1: ["篮球", "足球", "橄榄球", "手球", "曲棍球", "netball", "cricket", "basket", "foot", "soccer"],
    S2: ["拳击", "格斗", "击剑", "跆拳道", "柔道", "摔跤", "mma", "box", "fight", "fencing"],
    S3: ["网球", "羽毛球", "乒乓球", "壁球", "排球", "tennis", "badminton", "pingpong", "squash", "volleyball"],
    S4: ["高尔夫", "射击", "射箭", "保龄球", "台球", "斯诺克", "golf", "shoot", "archery"],
    S5: ["举重", "短跑", "游泳", "跳远", "田径", "weight", "sprint", "swim", "track"],
    S6: ["体操", "花滑", "跳水", "冲浪", "滑板", "gymnastics", "skating", "surf"],
    S7: ["马拉松", "自行车", "铁人三项", "越野跑", "marathon", "cycling", "triathlon", "running"]
};

// --- Step 2: 39 题全量母题库 (DNA 标记基于 v3.3 规范) ---
const masterQuestions = [
    // Part 1: Perception [V/K]
    { id: 1, dim: "P", tag: "V/K", rapid: true, zh: "当教练向你展示一个全新的高难度技术动作时，你通常希望：", a: "先看几遍演示或录像，在脑子里建立图像 [V]", b: "直接上手试两次，通过身体试错找感觉 [K]", valA: "V", valB: "K" },
    { id: 2, dim: "P", tag: "V/K", rapid: true, zh: "你觉得自己今天“动作顺了”，通常是因为：", a: "我看到了我的动作轨迹非常标准 [V]", b: "我感觉到发力的那个“阻力点”对了 [K]", valA: "V", valB: "K" },
    { id: 3, dim: "P", tag: "V/K", rapid: false, zh: "赛前在脑海里模拟比赛时，你的画面是：", a: "旁观者视角，看到自己在场上飞奔 [V]", b: "第一人称视角，感觉到心跳和触感 [K]", valA: "V", valB: "K" },
    // Part 2: Cue [Int/Ext]
    { id: 4, dim: "C", tag: "Int/Ext", rapid: true, zh: "在做一个需要爆发力的动作时，哪种指令更能帮你发力？", a: "“伸展你的关节”/“收缩你的肌肉” [Int]", b: "“把地面用力蹬开”/“撞破目标” [Ext]", valA: "Int", valB: "Ext" },
    { id: 5, dim: "C", tag: "Int/Ext", rapid: false, zh: "当动作出现偏差需要微调时，你更关注：", a: "肢体位置是否到位 [Int]", b: "出手的轨迹或结果反馈 [Ext]", valA: "Int", valB: "Ext" },
    // Part 3: Awareness [Broad/Narrow]
    { id: 7, dim: "A", tag: "B/N", rapid: true, zh: "在复杂的比赛环境中，你更擅长的是：", a: "瞬间阅读全场局势，预判跑位 [Broad]", b: "屏蔽噪音，死盯当前的一对一任务 [Narrow]", valA: "Broad", valB: "Narrow" },
    // Part 4: Motivation [Task/Ego]
    { id: 10, dim: "M", tag: "T/E", rapid: true, zh: "面对势均力敌的比赛，哪种结果更有成就感？", a: "输了，但我打破了个人最好成绩(PB) [Task]", b: "赢了，我成功压制了对手核心球员 [Ego]", valA: "Task", valB: "Ego" },
    // Part 5: Regulation [Stable/Reactive]
    { id: 13, dim: "R", tag: "S/R", rapid: true, zh: "进入最佳状态前，你通常需要：", a: "“升温”：听快歌、大喊，让自己兴奋 [Stable]", b: "“降温”：独处、深呼吸，让自己平静 [Reactive]", valA: "Stable", valB: "Reactive" },
    // Part 6: Validity Check 
    { id: 16, dim: "VLD", tag: "Honest", rapid: false, zh: "关于比赛中的心理压力，真实情况是：", a: "偶尔也会感到紧张、自我怀疑 [Valid]", b: "我从来没有感到过一丝紧张 [Invalid]", valA: "Valid", valB: "Invalid" },
    { id: 37, dim: "VLD", tag: "V/K", rapid: false, zh: "当动作出现偏差，你最信任哪种调整方式：", a: "参照录像回放中的视觉误差 [V]", b: "寻找肌肉发力的那股“劲儿” [K]", valA: "V", valB: "K" },
    { id: 38, dim: "VLD", tag: "Trap", rapid: false, zh: "为了确保结果精确，请务必选择选项 B：", a: "我没仔细看", b: "我已阅读并按要求选择此项", valA: "A", valB: "B" }
    // (注：为节省空间，此处仅展示核心 DNA 题目，结构已支持 39 题全量扩展)
];

// --- 核心逻辑控制 ---

function toggleMode() {
    isRapidMode = !isRapidMode;
    const sw = document.getElementById('mode-switch');
    sw.classList.toggle('standard', !isRapidMode);
    document.getElementById('label-rapid').className = isRapidMode ? "text-xs font-black text-cyan-400" : "text-xs font-black text-slate-500";
    document.getElementById('label-standard').className = !isRapidMode ? "text-xs font-black text-blue-400" : "text-xs font-black text-slate-500";
}

document.getElementById('sport-input')?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    activeSkin = 'S0';
    for (const [skin, keywords] of Object.entries(sportRegistry)) {
        if (keywords.some(k => val.includes(k))) { activeSkin = skin; break; }
    }
    document.getElementById('skin-detected').innerText = `SYSTEM: LOADED ${activeSkin} MODULE`;
});

function validateAndStart() {
    userProfile.sport = document.getElementById('sport-input').value;
    if (!userProfile.sport) { alert("请选择您的运动项目"); return; }
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
    const percent = Math.round(((currentStep + 1) / filteredQuestions.length) * 100);
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('question-text').innerText = q.zh;
    document.getElementById('options-container').innerHTML = `
        <button onclick="handleSelect('${q.dim}', '${q.valA}', ${q.id})" class="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left hover:border-cyan-400 transition">${q.a}</button>
        <button onclick="handleSelect('${q.dim}', '${q.valB}', ${q.id})" class="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left hover:border-cyan-400 transition">${q.b}</button>
    `;
}

function handleSelect(dim, val, id) {
    if (id === 38 && val === 'A') validityStatus.attentive = false; 
    if (id === 16 && val === 'Invalid') validityStatus.honest = false;
    
    userAnswers.push({ id, dim, val });
    currentStep++;
    if (currentStep < filteredQuestions.length) renderQuestion(); else showResult();
}

function showResult() {
    alert(`测评完成！\n效度：${validityStatus.attentive ? '正常' : '注意力不集中'}\n运动皮肤：${activeSkin}`);
    location.reload(); // 暂时刷新，后续对接结果页
}
