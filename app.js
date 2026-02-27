/* ============================================================
   APB ELITE v4.0 — 完整重构版
   更新内容：
   1. 完整 39 题题库（S1-S7 皮肤话术，从 PDF 原文提取）
   2. 新算法：5 维度 → 4 位代码（Base=A×C, M, R, P）
   3. 32 种人格 archetypeMap（完整映射表）
   4. 效度防火墙：静默标记，不打断用户
   5. 进度条固定蓝色，无皮肤颜色变化
   6. 皮肤模组后台静默运行，不显示给用户
   ============================================================ */

// ─── 全局状态 ────────────────────────────────────────────────
let currentLang = 'zh';
let isRapidMode = true;
let activeSkin = 'S1';
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

// ─── 3. 32 种竞技人格代码映射表 ──────────────────────────────────
// 代码格式：Base(A×C) + M(T/E) + R(S/R) + P(V/K)
// Base: C=Broad+Ext, M=Broad+Int, A=Narrow+Ext, P=Narrow+Int
const archetypeMap = {
    "CTSV": { cn: "冷面指挥官", en: "The Stoic Commander",     oneLiner: "你是混乱中的风暴眼，直觉是你最锋利的武器。" },
    "CTRV": { cn: "激情指挥官", en: "The Fiery Commander",     oneLiner: "你是混乱中的风暴眼，直觉是你最锋利的武器。" },
    "CESV": { cn: "冷面将军",   en: "The Stoic General",       oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "CERV": { cn: "激情将军",   en: "The Fiery General",       oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "CTSK": { cn: "冷面指挥官", en: "The Stoic Commander",     oneLiner: "你是混乱中的风暴眼，直觉是你最锋利的武器。" },
    "CTRK": { cn: "激情指挥官", en: "The Fiery Commander",     oneLiner: "你是混乱中的风暴眼，直觉是你最锋利的武器。" },
    "CESK": { cn: "冷面将军",   en: "The Stoic General",       oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "CERK": { cn: "激情将军",   en: "The Fiery General",       oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "MTSV": { cn: "冷面策划家", en: "The Stoic Mastermind",    oneLiner: "你是球场上的棋手，总能比对手多算三步。" },
    "MTRV": { cn: "激情策划家", en: "The Fiery Mastermind",    oneLiner: "你是球场上的棋手，总能比对手多算三步。" },
    "MESV": { cn: "冷面宗师",   en: "The Stoic Grandmaster",   oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "MERV": { cn: "激情宗师",   en: "The Fiery Grandmaster",   oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "MTSK": { cn: "冷面策划家", en: "The Stoic Mastermind",    oneLiner: "你是球场上的棋手，总能比对手多算三步。" },
    "MTRK": { cn: "激情策划家", en: "The Fiery Mastermind",    oneLiner: "你是球场上的棋手，总能比对手多算三步。" },
    "MESK": { cn: "冷面宗师",   en: "The Stoic Grandmaster",   oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "MERK": { cn: "激情宗师",   en: "The Fiery Grandmaster",   oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "ATSV": { cn: "冷面刺客",   en: "The Stoic Assassin",      oneLiner: "你是为终结而生的利刃，眼中只有猎物。" },
    "ATRV": { cn: "激情刺客",   en: "The Fiery Assassin",      oneLiner: "你是为终结而生的利刃，眼中只有猎物。" },
    "AESV": { cn: "冷面统治者", en: "The Stoic Dominator",     oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "AERV": { cn: "激情统治者", en: "The Fiery Dominator",     oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "ATSK": { cn: "冷面刺客",   en: "The Stoic Assassin",      oneLiner: "你是为终结而生的利刃，眼中只有猎物。" },
    "ATRK": { cn: "激情刺客",   en: "The Fiery Assassin",      oneLiner: "你是为终结而生的利刃，眼中只有猎物。" },
    "AESK": { cn: "冷面统治者", en: "The Stoic Dominator",     oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "AERK": { cn: "激情统治者", en: "The Fiery Dominator",     oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "PTSV": { cn: "冷面实践者", en: "The Stoic Practitioner",  oneLiner: "你是追求完美的艺术家，每一次动作都是教科书。" },
    "PTRV": { cn: "激情实践者", en: "The Fiery Practitioner",  oneLiner: "你是追求完美的艺术家，每一次动作都是教科书。" },
    "PESV": { cn: "冷面偶像",   en: "The Stoic Icon",          oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "PERV": { cn: "激情偶像",   en: "The Fiery Icon",          oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "PTSK": { cn: "冷面实践者", en: "The Stoic Practitioner",  oneLiner: "你是追求完美的艺术家，每一次动作都是教科书。" },
    "PTRK": { cn: "激情实践者", en: "The Fiery Practitioner",  oneLiner: "你是追求完美的艺术家，每一次动作都是教科书。" },
    "PESK": { cn: "冷面偶像",   en: "The Stoic Icon",          oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" },
    "PERK": { cn: "激情偶像",   en: "The Fiery Icon",          oneLiner: "承认吧，你渴望荣耀。你希望在关键时刻挺身而出，成为被所有人记住的英雄。" }
};

// ─── 4. 题库（39 题，S1-S7 皮肤话术）────────────────────────────
const masterQuestions = [

    // ══════════════════════════════════════════════════════════
    // Part 1: Perception (感知通道) [V / K]
    // ══════════════════════════════════════════════════════════

    { id: 1, dim: "P", rapid: true,
      zh: {
        S1: "当教练向你展示一个全新的战术配合或高难度动作时，你通常希望：",
        S2: "当教练展示一个新的格挡反击或高难度招式时，你通常希望：",
        S3: "当教练展示一个新的战术落点配合或高难度击球动作时，你通常希望：",
        S4: "当教练展示一个新的精准站位姿态或高难度击发动作时，你通常希望：",
        S5: "当教练展示一个全新的核心发力技巧或高难度动作形态时，你通常希望：",
        S6: "当教练展示一个新的艺术造型或高难度协调组合时，你通常希望：",
        S7: "当教练展示一个新的高效划频、踏频或某种长途巡航姿态时，你通常希望："
      },
      a: "先让我看几遍慢动作演示或录像，我要先在脑子里建立动作图像。",
      b: "别讲太多理论，让我直接上场试两次，我要通过身体的试错来找感觉。",
      valA: "V", valB: "K"
    },

    { id: 2, dim: "P", rapid: true,
      zh: {
        S1: "你觉得自己今天「动作顺了」，通常是因为：",
        S2: "你觉得自己今天「出招顺了」或「练到位了」，通常是因为：",
        S3: "你觉得自己今天「动作顺了」或者击球「找回手感了」，通常是因为：",
        S4: "你觉得自己今天「找准准星了」或者「节奏顺了」，通常是因为：",
        S5: "你觉得自己今天「发力顺了」或者「练到位了」，通常是因为：",
        S6: "你觉得自己今天「表现到位了」或者「动作顺了」，通常是因为：",
        S7: "你觉得自己今天「巡航节奏稳了」或者「状态顺了」，通常是因为："
      },
      a: "我看到了我的动作轨迹非常标准，回放里看起来很完美。",
      b: "我感觉到发力的那个「阻力点」对了，身体有一种顺畅的流动感。",
      valA: "V", valB: "K"
    },

    { id: 3, dim: "P", rapid: true,
      zh: {
        S1: "赛前在脑海里模拟接下来的对抗时，你的画面是：",
        S2: "赛前一晚在脑海里模拟接下来的对抗时，你的画面是：",
        S3: "赛前一晚在脑海里模拟接下来的对抗时，你的画面是：",
        S4: "在关键的一击/一发前进行脑海模拟时，你的画面是：",
        S5: "赛前一晚在脑海里模拟接下来的比赛时，你的画面是：",
        S6: "赛前在脑海里模拟接下来的表演程序时，你的画面是：",
        S7: "赛前一晚在脑海里模拟接下来的长距离比赛时，你的画面是："
      },
      a: "像看电影一样，以旁观者视角看到自己在场上跑位的身影。",
      b: "像第一人称一样，感觉到自己心跳的节奏和脚踩地面的触感。",
      valA: "V", valB: "K"
    },

    { id: 17, dim: "P", rapid: false,
      zh: {
        S1: "在进入场地执行动作前，你更倾向于：",
        S2: "在准备发动一次组合进攻前，你更倾向于：",
        S3: "在进入场地执行一次关键发球或回击动作前，你更倾向于：",
        S4: "在正式进入击发/挥杆程序前，你更倾向于：",
        S5: "在进入准备区或触摸器械执行动作前，你更倾向于：",
        S6: "在开始一个关键的艺术造型动作前，你更倾向于：",
        S7: "在开始一轮长距离训练或进入关键坡道前，你更倾向于："
      },
      a: "在脑海里精准「画」出跑动或传导的轨迹线。",
      b: "在身体上寻找重心移动到位的那个「触发点」。",
      valA: "V", valB: "K"
    },

    { id: 18, dim: "P", rapid: false,
      zh: {
        S1: "当整体动作走样时，你最信任：",
        S2: "当整体动作走样时，你最信任：",
        S3: "当整体动作走样时，你最信任：",
        S4: "当这次执行走样时，你最信任：",
        S5: "当这次动作执行走样时，你最信任：",
        S6: "当整套动作形态走样时，你最信任：",
        S7: "当你在长途博弈中感觉动作走样时，你最信任："
      },
      a: "视觉观察到的空间位置差异。",
      b: "肢体反馈回来的那种「不对劲」的感觉。",
      valA: "V", valB: "K"
    },

    { id: 19, dim: "P", rapid: false,
      zh: {
        S1: "你最喜欢的学习策略是：",
        S2: "你最喜欢的学习策略是：",
        S3: "你最喜欢的学习策略是：",
        S4: "你最喜欢的学习策略是：",
        S5: "你最喜欢的学习策略是：",
        S6: "你最喜欢的学习策略是：",
        S7: "你最喜欢的学习策略是："
      },
      a: "阅读战术分解图解或观看演示视频。",
      b: "让身体在实际的对抗尝试中产生肌肉记忆。",
      valA: "V", valB: "K"
    },

    { id: 20, dim: "P", rapid: false,
      zh: {
        S1: "在比赛当天的早晨，你脑海中出现的通常是：",
        S2: "在比赛当天的早晨，你脑海中出现的通常是：",
        S3: "在比赛当天的早晨，你脑海中出现的通常是：",
        S4: "在正式比赛当天的早晨，你脑海中出现的通常是：",
        S5: "在冲击个人最好成绩（PB）当天的早晨，你脑海中出现的通常是：",
        S6: "在正式比赛当天的早晨，你脑海中出现的通常是：",
        S7: "在正式比赛当天的早晨，你脑海中出现的通常是："
      },
      a: "精彩配合的定格画面或成功达成目标的图像。",
      b: "身体对抗时的紧绷感和场上移动的节奏感。",
      valA: "V", valB: "K"
    },

    // ══════════════════════════════════════════════════════════
    // Part 2: Cue (指令偏好) [Int / Ext]
    // ══════════════════════════════════════════════════════════

    { id: 4, dim: "C", rapid: true,
      zh: {
        S1: "在做一个需要爆发力的动作（如跳跃、冲刺、强力对抗）时，哪种指令能帮你发上力？",
        S2: "在做一个需要爆发力的动作（如重击、突刺）时，哪种指令能帮你发上力？",
        S3: "在做一个需要爆发力的动作（如发球、扣杀、强力抽球）时，哪种指令能帮你发上力？",
        S4: "在做一个需要爆发力或精度的动作（如挥杆、击球、放箭）时，哪种指令能帮你发上力？",
        S5: "在做一个需要爆发力的动作（如起跳、挺举、蹬离）时，哪种指令能帮你发上力？",
        S6: "在做一个需要爆发力或大幅度舒展的动作（如跳跃、抛接）时，哪种指令能帮你发上力？",
        S7: "在做一个需要爆发力的瞬间（如终点冲刺、上坡发力）时，哪种指令能帮你发上力？"
      },
      a: "「伸展你的关节」/「用力收缩你的核心肌肉」。",
      b: "「把地面用力蹬开」/「想象你要突破这个阻碍」。",
      valA: "Int", valB: "Ext"
    },

    { id: 5, dim: "C", rapid: true,
      zh: {
        S1: "当你的动作出现偏差需要微调时，你更习惯关注：",
        S2: "当你的动作出现偏差正在进行微调修正时，你更习惯关注：",
        S3: "当你的动作出现偏差需要微调时，你更习惯关注：",
        S4: "当你的预备动作出现偏差需要微调时，你更习惯关注：",
        S5: "当你的动作出现偏差正在进行微调修正时，你更习惯关注：",
        S6: "当你的姿态出现微小偏差正在进行调整时，你更习惯关注：",
        S7: "当你在漫长的赛程中发现效率下降需要调整时，你更习惯关注："
      },
      a: "我的肢体位置是不是没到位？（关注身体部件）",
      b: "刚才那下出手的轨迹是不是偏了？（关注结果反馈）",
      valA: "Int", valB: "Ext"
    },

    { id: 6, dim: "C", rapid: true,
      zh: {
        S1: "在关键时刻为了防止动作变形，你会告诉自己：",
        S2: "在高压比赛的关键时刻，为了防止动作变形，你会告诉自己：",
        S3: "在关键时刻为了防止动作变形，你会告诉自己：",
        S4: "在最后一击的关键时刻，为了防止由于紧张导致的动作变形，你会告诉自己：",
        S5: "在最后一次冲击极限的关键时刻，为了防止动作变形，你会告诉自己：",
        S6: "在决赛的关键时刻，为了防止动作变形或出现晃动，你会告诉自己：",
        S7: "在最后关头冲击极限的关键时刻，为了防止动作崩溃，你会告诉自己："
      },
      a: "保持核心收紧，稳住重心。（控制身体）",
      b: "盯死那个目标，把任务完成。（控制目标）",
      valA: "Int", valB: "Ext"
    },

    { id: 21, dim: "C", rapid: false,
      zh: {
        S1: "在追求精准执行时，你会下意识地：",
        S2: "在追求极致精准的打击时，你会下意识地：",
        S3: "在追求极致精准的落点控制时，你会下意识地：",
        S4: "在追求极致精准的执行时，你会下意识地：",
        S5: "在追求极致精准的技术细节时，你会下意识地：",
        S6: "在追求极致的造型精准度时，你会下意识地：",
        S7: "在追求极致稳定的巡航状态时，你会下意识地："
      },
      a: "检查并锁定某个关节的特定位置。",
      b: "仅关注目标区域的中心点或最终预想位置。",
      valA: "Int", valB: "Ext"
    },

    { id: 22, dim: "C", rapid: false,
      zh: {
        S1: "当体力严重消耗时，你会告诉自己：",
        S2: "当体力严重消耗时，你会告诉自己：",
        S3: "当体力严重消耗时，你会告诉自己：",
        S4: "当比赛耗时过长、体力消耗时，你会告诉自己：",
        S5: "当体力严重消耗、肌肉酸痛时，你会告诉自己：",
        S6: "当体能下降、动作开始吃力时，你会告诉自己：",
        S7: "当体能严重透支、身体产生强烈灼烧感时，你会告诉自己："
      },
      a: "保持核心力量，稳住动作形态。",
      b: "把所有的能量全部推向那个终点目标。",
      valA: "Int", valB: "Ext"
    },

    { id: 23, dim: "C", rapid: false,
      zh: {
        S1: "面对复杂的战术衔接动作，你的关注点是：",
        S2: "面对复杂的组合衔接动作，你的关注点是：",
        S3: "面对复杂的步法衔接和击球动作，你的关注点是：",
        S4: "面对从准备到击发的完整衔接动作，你的关注点是：",
        S5: "面对从准备到爆发的完整链条动作，你的关注点是：",
        S6: "面对极其复杂的连续组合动作，你的关注点是：",
        S7: "面对从巡航到冲刺切换的完整衔接动作，你的关注点是："
      },
      a: "发力的逻辑顺序和身体的力学连接。",
      b: "动作最终产生的物理轨迹和空间效果。",
      valA: "Int", valB: "Ext"
    },

    { id: 24, dim: "C", rapid: false,
      zh: {
        S1: "你表现最顺畅的时刻感觉像是：",
        S2: "你表现最顺畅的时刻感觉像是：",
        S3: "你表现最顺畅的时刻感觉像是：",
        S4: "你表现最顺畅、进入「心流」的时刻感觉像是：",
        S5: "你表现最顺畅、感觉最有「神力」的时刻像是：",
        S6: "你表现最顺畅、感觉身心合一的时刻像是：",
        S7: "你表现最顺畅、感觉进入「心流」的时刻像是："
      },
      a: "意识在精准地指挥身体的每一个环节。",
      b: "意识在远处观察，让身体自动执行任务。",
      valA: "Int", valB: "Ext"
    },

    // ══════════════════════════════════════════════════════════
    // Part 3: Awareness (注意广度) [Broad / Narrow]
    // ══════════════════════════════════════════════════════════

    { id: 7, dim: "A", rapid: true,
      zh: {
        S1: "在复杂的比赛环境中，你更擅长的是：",
        S2: "在高强度的对抗环境中，你更擅长的是：",
        S3: "在复杂的网前对峙或快速攻防中，你更擅长的是：",
        S4: "在关键的一击前，你更擅长的是：",
        S5: "在赛场准备或高强度的竞技环境中，你更擅长的是：",
        S6: "在复杂的表演环境或多变的场地中，你更擅长的是：",
        S7: "在拥挤的出发区或高强度的集团作战环境中，你更擅长的是："
      },
      a: "瞬间阅读全场局势，预判队友和对手的跑位。",
      b: "屏蔽全场噪音，死死盯住当前的 1 对 1 任务。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 8, dim: "A", rapid: true,
      zh: {
        S1: "假如你出现了连续失误，通常是因为：",
        S2: "假如你出现了连续失误，通常是因为：",
        S3: "假如你出现了连续失误，通常是因为：",
        S4: "假如你出现了连续的失误，通常是因为：",
        S5: "假如你在试举/起跑/触壁中出现了连续的节奏失误，通常是因为：",
        S6: "假如你出现了连续的节奏失误，通常是因为：",
        S7: "假如你出现了连续的节奏失误，通常是因为："
      },
      a: "我想得太多，顾虑太多周围的情况，导致反应慢了。",
      b: "我太钻牛角尖，只盯着眼前这一块，没看到侧面过来的干扰。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 9, dim: "A", rapid: true,
      zh: {
        S1: "你最喜欢的比赛状态是：",
        S2: "你最喜欢的比赛状态是：",
        S3: "你最喜欢的比赛状态是：",
        S4: "你最喜欢的竞技状态是：",
        S5: "你最喜欢的竞技状态是：",
        S6: "你最喜欢的表演状态是：",
        S7: "你最喜欢的竞技状态是："
      },
      a: "像雷达一样，感觉自己能覆盖场上的每一个角落。",
      b: "像狙击镜一样，世界消失了，眼中只有我的目标。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 25, dim: "A", rapid: false,
      zh: {
        S1: "在喧闹的环境中，你会：",
        S2: "在喧闹的环境中，你会：",
        S3: "在喧闹的环境中，你会：",
        S4: "在极其喧闹或干扰严重的场馆中，你会：",
        S5: "在极其喧闹的健身房或体育馆中，你会：",
        S6: "在背景音乐嘈杂或观众干扰严重的场馆中，你会：",
        S7: "在背景声音嘈杂或观众干扰严重的赛段中，你会："
      },
      a: "持续监测周围所有的动态，随时应对突发情况。",
      b: "将周围一切模糊化，只留下一个清晰的作业区。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 26, dim: "A", rapid: false,
      zh: {
        S1: "当进入一个陌生的场馆，你会先看：",
        S2: "当进入一个陌生的场馆/竞技场，你会先看：",
        S3: "当进入一个陌生的场馆，你会先看：",
        S4: "当进入一个陌生的比赛场地，你会先看：",
        S5: "当进入一个陌生的比赛场馆，你会先看：",
        S6: "当进入一个陌生的比赛场馆，你会先看：",
        S7: "当进入一个陌生的比赛区域或换项区，你会先看："
      },
      a: "全场的时间、比分盘、空间布局等环境信息。",
      b: "寻找并锁定你即将战斗或防守的那个特定点位。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 27, dim: "A", rapid: false,
      zh: {
        S1: "你觉得哪种状态更让你舒适：",
        S2: "你觉得哪种状态更让你舒适：",
        S3: "你觉得哪种状态更让你舒适：",
        S4: "你觉得哪种状态更让你舒适：",
        S5: "你觉得哪种状态更让你舒适：",
        S6: "你觉得哪种状态更让你舒适：",
        S7: "你觉得哪种状态更让你舒适："
      },
      a: "同时监控多名对手的位置变化和移动意图。",
      b: "彻底锁定当前最重要的唯一目标，不及其余。",
      valA: "Broad", valB: "Narrow"
    },

    { id: 28, dim: "A", rapid: false,
      zh: {
        S1: "在高压情况下，你感觉自己的视野：",
        S2: "在高压情况下，你感觉自己的视野：",
        S3: "在高压情况下，你感觉自己的视野：",
        S4: "在面对具有决定性的绝杀机会时，你感觉自己的视野：",
        S5: "在面对具有决定性的冲刺或试举机会时，你感觉自己的视野：",
        S6: "在面对高难度的组合跳跃或翻腾机会时，你感觉自己的视野：",
        S7: "在面对具有决定性的最后冲刺机会时，你感觉自己的视野："
      },
      a: "变得更宽，能够捕捉到更多队友的空间空档。",
      b: "变成了一束聚光灯，仅聚焦于核心的对抗范围。",
      valA: "Broad", valB: "Narrow"
    },

    // ══════════════════════════════════════════════════════════
    // Part 4: Motivation (动力引擎) [Task / Ego]
    // ══════════════════════════════════════════════════════════

    { id: 10, dim: "M", rapid: true,
      zh: {
        S1: "面对势均力敌的对手，哪种结果让你更有成就感？",
        S2: "面对势均力敌的对手，哪种结果让你更有成就感？",
        S3: "面对势均力敌的对手，哪种结果让你更有成就感？",
        S4: "面对一场高手云集的比赛，哪种结果让你更有成就感？",
        S5: "面对一场高手如云的比赛，哪种结果让你更有成就感？",
        S6: "面对一场强手如林的比赛，哪种结果让你更有成就感？",
        S7: "面对一场漫长且艰苦的比赛，哪种结果让你更有成就感？"
      },
      a: "我们输了，但我打破了个人表现记录，技术更纯熟了。",
      b: "我们赢了，我成功压制了对方核心球员的发挥。",
      valA: "Task", valB: "Ego"
    },

    { id: 11, dim: "M", rapid: true,
      zh: {
        S1: "即使很累了，你依然坚持训练的动力是：",
        S2: "即使已经很累了，你依然坚持加练的动力通常是：",
        S3: "即使很累了，你依然坚持训练的动力是：",
        S4: "即使已经身心俱疲，你依然坚持练习的动力是：",
        S5: "即使已经精疲力竭，你依然坚持额外训练的动力通常是：",
        S6: "即使已经精疲力竭，你依然坚持雕琢动作细节的动力是：",
        S7: "即使已经精疲力竭，你依然坚持完成最后一段里程的动力通常是："
      },
      a: "我想看看自己的极限在哪里，掌握新技能很爽。",
      b: "我不能被别人落下，我要保住我的主力位置。",
      valA: "Task", valB: "Ego"
    },

    { id: 12, dim: "M", rapid: true,
      zh: {
        S1: "当教练表扬其他队友时，你的反应是：",
        S2: "当教练表扬其他选手时，你的第一反应通常是：",
        S3: "当教练表扬其他队友时，你的反应是：",
        S4: "当教练/同行表扬其他选手时，你的反应是：",
        S5: "当教练表扬其他选手（如力量更大或速度更快）时，你的反应是：",
        S6: "当教练表扬其他选手（如形态更美或难度更高）时，你的反应是：",
        S7: "当教练表扬其他选手（如耐力更好或恢复更快）时，你的反应是："
      },
      a: "仔细听教练夸他什么，看看有没有可学的地方。",
      b: "被激起斗志，心里发誓下次要表现得比他更好。",
      valA: "Task", valB: "Ego"
    },

    { id: 29, dim: "M", rapid: false,
      zh: {
        S1: "你会为了什么而额外付出？",
        S2: "你会为了什么而额外付出汗水？",
        S3: "你会为了什么而额外付出汗水？",
        S4: "你会为了什么而付出额外的汗水？",
        S5: "你会为了什么而付出额外的汗水？",
        S6: "你会为了什么而付出额外的汗水？",
        S7: "你会为了什么而付出额外的汗水？"
      },
      a: "攻克一个一直困扰我的技术盲点。",
      b: "确保在接下来的选拔中，没人能取代我的位置。",
      valA: "Task", valB: "Ego"
    },

    { id: 30, dim: "M", rapid: false,
      zh: {
        S1: "看到同伴取得了巨大进步，你的第一反应是：",
        S2: "看到同伴取得了巨大的进步，你的第一反应是：",
        S3: "看到同伴取得了巨大进步，你的第一反应是：",
        S4: "看到竞争对手取得了巨大进步，你的第一反应是：",
        S5: "看到同伴在重量或时间上取得了巨大进步，你的第一反应是：",
        S6: "看到同伴取得了巨大的艺术突破，你的第一反应是：",
        S7: "看到同伴取得了巨大的里程或速度突破，你的第一反应是："
      },
      a: "分析他的训练方法是否有我可以借鉴的地方。",
      b: "感到被威胁，想立刻在接下来的对抗中赢回来。",
      valA: "Task", valB: "Ego"
    },

    { id: 31, dim: "M", rapid: false,
      zh: {
        S1: "赛后你最关心的信息是：",
        S2: "赛后你最关心的信息是：",
        S3: "赛后你最关心的信息是：",
        S4: "赛后你最关心的信息是：",
        S5: "赛后你最关心的信息是：",
        S6: "赛后你最关心的信息是：",
        S7: "赛后你最关心的信息是："
      },
      a: "我的执行和决策是否比上一次比赛更纯熟。",
      b: "我在整个团队中的贡献排名以及与对手的数据差。",
      valA: "Task", valB: "Ego"
    },

    { id: 32, dim: "M", rapid: false,
      zh: {
        S1: "你能忍受单调练习的原因是：",
        S2: "能忍受单调练习的原因是：",
        S3: "你能忍受单调练习的原因是：",
        S4: "你能忍受成千上万次重复练习的原因是：",
        S5: "你能忍受单调、重复的力量或有氧练习的原因是：",
        S6: "你能忍受单调、重复练习的原因是：",
        S7: "你能忍受数小时单调、重复训练的原因是："
      },
      a: "享受技能被一点点磨练精进的过程。",
      b: "知道这些练习能确保我在比赛中彻底击败对手。",
      valA: "Task", valB: "Ego"
    },

    // ══════════════════════════════════════════════════════════
    // Part 5: Regulation (情绪调节) [Stable / Reactive]
    // ══════════════════════════════════════════════════════════

    { id: 13, dim: "R", rapid: true,
      zh: {
        S1: "马上上场了，进入最佳状态你需要：",
        S2: "马上就要上场了，进入最佳状态你需要：",
        S3: "马上上场了，进入最佳状态你需要：",
        S4: "马上开始正式执行了，为了进入最佳状态你需要：",
        S5: "马上开始正式试举/起跑了，进入最佳状态你需要：",
        S6: "马上要开始整套程序了，进入最佳状态你需要：",
        S7: "马上就要发枪了，为了进入最佳的长程竞技状态，你需要："
      },
      a: "「升温」：听快歌、大喊，让自己兴奋躁动起来。",
      b: "「降温」：独处、深呼吸，让自己平静冷酷。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 14, dim: "R", rapid: true,
      zh: {
        S1: "出现了一个低级失误，你的生理反应是：",
        S2: "在比赛中出现了一个低级失误，你的生理反应通常是：",
        S3: "出现了一个低级失误（如发球双误/挂网），你的生理反应是：",
        S4: "在比赛中意外出现了一次严重脱靶/失误，你的生理反应是：",
        S5: "在比赛中意外出现了一次严重失误（如掉杠/抢跑），你的生理反应是：",
        S6: "在表演中意外出现了一个微小失误，你的生理反应是：",
        S7: "在比赛中不幸遭遇了一次意外（如爆胎/抽筋），你的生理反应是："
      },
      a: "比较平稳，我会分析原因，身体没有剧烈起伏。",
      b: "反应剧烈，心跳加速、手心出汗，需要时间平复。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 15, dim: "R", rapid: true,
      zh: {
        S1: "你觉得哪种情绪下你的战斗力最强？",
        S2: "你觉得自己在哪种情绪状态下战斗力最强？",
        S3: "你觉得哪种情绪下你的战斗力最强？",
        S4: "你觉得哪种情绪下你的精准度最高、战斗力最强？",
        S5: "你觉得自己在哪种情绪状态下爆发力最强、战斗力最强？",
        S6: "你觉得自己在哪种情绪状态下艺术表现力最强？",
        S7: "你觉得自己在哪种情绪状态下战斗力最强？"
      },
      a: "充满激情、怒吼、甚至带着一点狂野的时候。",
      b: "极度冷静、面无表情、内心毫无波澜的时候。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 33, dim: "R", rapid: false,
      zh: {
        S1: "面对突然的规则改变或裁判判罚，你的反应是：",
        S2: "面对突然的规则改变或裁判判罚，你的反应是：",
        S3: "面对突然的规则改变或裁判判罚，你的反应是：",
        S4: "面对突然的风向改变或裁判计分纠纷，你的反应是：",
        S5: "面对突然的器材故障或判罚争议，你的反应是：",
        S6: "面对突然的音乐故障或判罚纠纷，你的反应是：",
        S7: "面对突然的赛道改线或裁判计分纠纷，你的反应是："
      },
      a: "情绪平稳，迅速分析对策，身体没有明显起伏。",
      b: "压力感上升，心跳瞬间加快，需要刻意平复。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 34, dim: "R", rapid: false,
      zh: {
        S1: "进入竞技状态时，你更喜欢哪种「体感」？",
        S2: "进入竞技状态时，你更喜欢哪种「体感」？",
        S3: "进入竞技状态时，你更喜欢哪种「体感」？",
        S4: "进入竞技程序时，你更喜欢哪种「体感」？",
        S5: "进入竞技程序时，你更喜欢哪种「体感」？",
        S6: "进入竞技程序时，你更喜欢哪种「体感」？",
        S7: "进入竞技程序时，你更喜欢哪种「体感」？"
      },
      a: "全身发烫、血液沸腾、充满躁动感。",
      b: "手指冰冷、心跳极慢、大脑像手术室一样冷静。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 35, dim: "R", rapid: false,
      zh: {
        S1: "如果今天你感觉「毫无波澜」，没有任何兴奋感：",
        S2: "如果今天你感觉「毫无波澜」，没有任何愤怒或兴奋感：",
        S3: "如果今天你感觉「毫无波澜」，没有任何兴奋感：",
        S4: "如果今天你感觉「毫无波澜」，没有任何兴奋感：",
        S5: "如果今天你感觉「毫无波澜」，没有任何兴奋感：",
        S6: "如果今天你感觉「毫无波澜」，没有任何兴奋感：",
        S7: "如果今天你感觉「毫无波澜」，没有任何兴奋感："
      },
      a: "我会觉得提不起劲，状态不佳，需要被刺激一下。",
      b: "我会觉得状态好极了，这正是我最冷静专注的时候。",
      valA: "Stable", valB: "Reactive"
    },

    { id: 39, dim: "R", rapid: false,
      zh: {
        S1: "如果赛场环境过于安静和冷清：",
        S2: "如果竞技环境过于安静和冷清：",
        S3: "如果赛场环境过于安静和冷清：",
        S4: "如果赛场环境异常安静和冷清：",
        S5: "如果竞技环境过于安静和冷清：",
        S6: "如果赛场环境过于安静和冷清：",
        S7: "如果赛场环境过于安静和冷清："
      },
      a: "我会觉得倦怠，需要一些声响来让自己「燃」起来。",
      b: "我觉得很舒服，这种安静最有利于我进入状态。",
      valA: "Stable", valB: "Reactive"
    },

    // ══════════════════════════════════════════════════════════
    // Part 6: Validity Check (效度校验)
    // ══════════════════════════════════════════════════════════

    { id: 16, dim: "VLD", rapid: false,
      zh: {
        S1: "关于压力，以下哪种更符合真实情况？",
        S2: "关于压力，以下哪种更符合你的真实情况？",
        S3: "关于压力，以下哪种更符合真实情况？",
        S4: "关于压力，以下哪种描述更符合你的真实情况？",
        S5: "关于压力，以下哪种更符合你的真实情况？",
        S6: "关于压力，以下哪种更符合你的真实情况？",
        S7: "关于压力，以下哪种更符合你的真实情况？"
      },
      a: "说实话，遇到重大比赛我也偶尔会紧张和压力山大。",
      b: "我从来没有感到过一丝紧张，我的心态永远是完美的。",
      valA: "Valid", valB: "Invalid"
    },

    { id: 36, dim: "VLD", rapid: false,
      zh: {
        S1: "在决定胜负的关键时刻：",
        S2: "在决定胜负的关键时刻：",
        S3: "在决定胜负的关键时刻：",
        S4: "在决定胜负的关键射击/推杆时刻：",
        S5: "在决定胜负的关键试举/冲刺时刻：",
        S6: "在决定最后排名的关键表演时刻：",
        S7: "在决定胜负的关键耐力时刻："
      },
      a: "我偶尔会因为担心发挥失常而感到压力。",
      b: "我的心态在任何时候都是无敌的，从不怀疑自己。",
      valA: "Valid", valB: "Invalid"
    },

    { id: 37, dim: "VLD", rapid: false,
      zh: {
        S1: "当动作出现偏差，你最信任：",
        S2: "当动作出现偏差，你最信任哪种调整方式？",
        S3: "当动作出现偏差，你最信任哪种调整方式？",
        S4: "当动作精度出现偏差，你最信任哪种调整方式？",
        S5: "当动作精度出现偏差，你最信任哪种调整方式？",
        S6: "当动作精度出现偏差，你最信任哪种调整方式？",
        S7: "当动作精度出现偏差，你最信任哪种调整方式？"
      },
      a: "参照录像回放中的视觉误差。",
      b: "寻找肌肉发力时的那股「劲儿」是否找回来了。",
      valA: "V", valB: "K"
    },

    { id: 38, dim: "VLD", rapid: true,
      zh: {
        S1: "为了结果精确，请务必在以下选项中选择选项 B：",
        S2: "为了确保结果精确，请务必在以下选项中选择选项 B：",
        S3: "为了确保结果精确，请务必在以下选项中选择选项 B：",
        S4: "为了确保结果精确，请务必在以下选项中选择选项 B：",
        S5: "为了确保结果精确，请务必在以下选项中选择选项 B：",
        S6: "为了确保结果精确，请务必在以下选项中选择选项 B：",
        S7: "为了确保结果精确，请务必在以下选项中选择选项 B："
      },
      a: "我没仔细看。",
      b: "我已阅读并按要求选择此项。",
      valA: "Inattentive", valB: "Attentive"
    }

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
            activeSkin = 'S1';
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
    activeSkin = saved.activeSkin || 'S1';
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

    // 皮肤话术自动回退：优先用当前皮肤，若无则用 S1
    const skinKey = q.zh[activeSkin] ? activeSkin : 'S1';
    const questionTxt = q.zh[skinKey];

    // 进度条（固定蓝色）
    const percent = Math.round(((currentStep + 1) / filteredQuestions.length) * 100);
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = `${percent}%`;
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
    // 效度防火墙：静默标记，不打断用户
    if (id === 38 && val === 'Inattentive') validityStatus.attentive = false;
    if ((id === 16 || id === 36) && val === 'Invalid') {
        // 如果两道诚实度题都选了 Invalid，标记为不诚实
        const prevInvalid = userAnswers.find(a => (a.id === 16 || a.id === 36) && a.val === 'Invalid');
        if (prevInvalid) validityStatus.honest = false;
    }
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
    // 一致性校验：Q37 的答案是否与 P 维度多数票一致
    const pAnswers = userAnswers.filter(a => a.dim === 'P').map(a => a.val);
    if (pAnswers.length > 0) {
        const counts = pAnswers.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        const dominantP = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const q37Answer = userAnswers.find(a => a.id === 37);
        if (q37Answer && q37Answer.val !== dominantP) validityStatus.consistent = false;
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

// ─── 12. 算法：5 维度 → 4 位代码 ─────────────────────────────
function calculateArchetype() {
    const getDim = (d) => {
        const votes = userAnswers.filter(a => a.dim === d).map(a => a.val);
        if (votes.length === 0) return null;
        const counts = votes.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        return Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
    };

    // 五个维度
    const dimA = getDim('A');   // Broad / Narrow
    const dimC = getDim('C');   // Int / Ext
    const dimM = getDim('M');   // Task / Ego
    const dimR = getDim('R');   // Stable / Reactive
    const dimP = getDim('P');   // V / K

    // Base = A × C 交叉矩阵
    let base;
    const a = dimA || 'Broad';
    const c = dimC || 'Ext';
    if (a === 'Broad' && c === 'Ext')    base = 'C';  // Commander
    else if (a === 'Broad' && c === 'Int') base = 'M';  // Mastermind
    else if (a === 'Narrow' && c === 'Ext') base = 'A'; // Assassin
    else                                  base = 'P';  // Practitioner

    // 其余三位
    const mCode = (dimM || 'Task') === 'Task' ? 'T' : 'E';
    const rCode = (dimR || 'Stable') === 'Stable' ? 'S' : 'R';
    const pCode = (dimP || 'V') === 'V' ? 'V' : 'K';

    const code = base + mCode + rCode + pCode;

    // 附加效度标记（供数据分析，不影响结果显示）
    const validityLog = {
        attentive: validityStatus.attentive,
        honest: validityStatus.honest,
        consistent: validityStatus.consistent,
        reliable: validityStatus.attentive && validityStatus.honest && validityStatus.consistent
    };
    console.log('[APB Validity]', validityLog);

    const archetype = archetypeMap[code] || { cn: "竞技人格", en: "Athletic Archetype", oneLiner: "你的竞技基因独一无二。" };
    return { code, ...archetype, validityLog };
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
    const code = archetype.code;
    const baseChar = code[0]; // C / M / A / P
    const mChar = code[1];    // T / E
    const rChar = code[2];    // S / R
    const pChar = code[3];    // V / K

    setEl('identity-title', `⚡ ${t.identityTitle}`);

    // Base 身份文案
    const baseContext = {
        C: { team: "你是场上的将军，负责用想象力撕开防线，你的调度是队伍的进攻号角。", solo: "你打的不是球，是空间。你擅长阅读对手意图，用节奏变化掌控全场。" },
        M: { team: "你是队伍的大脑，不仅看得到空档，还能计算出最佳进攻线路和防守轮转。", solo: "你在与对手下棋，擅长拆解对手的动作模式，找出破绽并精准打击。" },
        A: { team: "你是战术体系的尖刀，任务不是组织，而是屏蔽一切干扰，把球送进目标。", solo: "你是一匹独狼，不需要花哨的布局，只需要比对手更快、更准、更狠。" },
        P: { team: "你是队伍的基石，无论环境多么混乱，总能提供最稳定、最精密的输出。", solo: "你在和自己比赛，追求动作的极致纯粹与零误差，对手只是你的陪衬。" }
    };
    setEl('team-context', baseContext[baseChar]?.team || '');
    setEl('solo-context', baseContext[baseChar]?.solo || '');

    setEl('xfactor-title', `🔥 ${t.xfactorTitle}`);

    // 绝杀时刻
    const clutchMap = {
        C: "当全场因压力而视野变窄时，你看得更宽了。你看见了时间流动的缝隙，凭借本能送出致命一击。",
        M: "这不仅仅是运气。你在比赛前段布下的局终于生效，对手掉进了陷阱，你冷静地收割胜利。",
        A: "大脑一片空白，身体自动接管一切。你根本不记得动作细节，只记得「看见目标→解决目标」。",
        P: "全场窒息的压力下，你进入了绝对宁静。心率平稳，动作像机器一样精准完美。"
    };
    setEl('clutch-moment', clutchMap[baseChar] || '');

    // 氪石（弱点）
    const kryptoniteMap = {
        C: "轻视细节。你容易因过度自信而尝试不需要的高难度动作，导致低级失误。",
        M: "思维过载。想得太多会导致你动作僵硬，错失稍纵即逝的最佳时机。",
        A: "隧道视野。极致的专注让你容易忽略处于更好位置的队友，或被针对性防守锁死。",
        P: "机械僵化。你对环境极度敏感，一旦节奏被打乱（如裁判误判），心态易崩盘。"
    };
    setEl('kryptonite', kryptoniteMap[baseChar] || '');

    setEl('advice-title', `🎯 ${t.adviceTitle}`);
    setEl('mot-label', t.motLabel);
    setEl('motivation-text', mChar === 'T'
        ? '以技术突破为目标，设定可量化的 PB 指标，让进步可见。'
        : '以荣耀为燃料，设定竞争性目标，大场面是你最好的激励。');

    setEl('reg-label', t.regLabel);
    setEl('regulation-text', rChar === 'S'
        ? '赛前使用激活型热身（快节奏音乐、动态拉伸），确保唤醒水平充足。'
        : '赛前使用镇定型准备（腹式呼吸、渐进放松），控制唤醒水平。');

    setEl('lrn-label', t.lrnLabel);
    setEl('learning-text', pChar === 'V'
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
