import { courseModules } from "./python-course";
import type { CourseExercise, CourseModule, CourseSection, CourseTopic, ExerciseDifficulty } from "../types/course";

interface TopicRef {
  module: CourseModule;
  section: CourseSection;
  topic: CourseTopic;
}

const targetPerDifficulty = 240;

interface ScenarioTemplate {
  name: string;
  role: string;
  input: string;
  process: string;
  output: string;
  edgeCase: string;
}

const scenarioTemplates: ScenarioTemplate[] = [
  {
    name: "CRM 线索导入校验",
    role: "你正在为销售团队开发线索导入前的预处理脚本",
    input: "输入为多条线索记录，每条记录包含姓名、手机号、来源渠道和预算字段",
    process: "需要去除空白字符、过滤缺失姓名或手机号的记录，并把预算转换为数值",
    output: "输出可导入 CRM 的有效记录列表，同时返回被拒绝记录的行号与原因",
    edgeCase: "手机号为空、预算不是数字、同一客户重复出现时都要有明确处理",
  },
  {
    name: "电商订单明细对账",
    role: "你正在为运营同学准备每日订单对账脚本",
    input: "输入为订单明细列表，包含订单号、商品数量、实付金额和退款状态",
    process: "需要剔除已退款订单，统计有效订单数、商品总件数和实收金额",
    output: "输出结构化对账摘要，便于后续写入日报或报表",
    edgeCase: "金额字段缺失、数量为负数、订单号重复时需要保留异常说明",
  },
  {
    name: "服务访问日志质量统计",
    role: "你正在为接口服务编写日志巡检工具",
    input: "输入为多行访问日志，每行包含时间、接口路径、状态码和耗时",
    process: "需要解析日志字段，按接口统计请求量、错误量和平均耗时",
    output: "输出接口维度的质量报告，并列出无法解析的原始日志行",
    edgeCase: "日志字段数量不足、状态码不是整数、耗时为空时不能中断程序",
  },
  {
    name: "应用配置项发布检查",
    role: "你正在为测试环境发布流程补充配置检查脚本",
    input: "输入为配置项字典或键值对列表，包含环境名、数据库地址、开关项和超时时间",
    process: "需要校验必填项、统一布尔开关格式，并把超时时间转换为整数秒",
    output: "输出可用于发布的标准配置对象，以及阻断发布的错误清单",
    edgeCase: "生产环境缺少数据库地址、超时时间小于 1、未知开关值都要被识别",
  },
  {
    name: "客户资料标准化归档",
    role: "你正在整理客服系统导出的客户资料",
    input: "输入为客户记录列表，字段包含客户编号、姓名、城市、邮箱和标签",
    process: "需要规范城市名称、校验邮箱格式，并按城市聚合客户数量",
    output: "输出清洗后的客户资料和城市维度统计结果",
    edgeCase: "邮箱格式异常、客户编号重复、标签为空时需要给出可追踪结果",
  },
  {
    name: "第三方接口响应整理",
    role: "你正在封装第三方接口的响应适配层",
    input: "输入为接口返回的嵌套字典，包含状态码、数据节点和错误消息",
    process: "需要判断请求是否成功，提取核心业务字段，并统一缺省值",
    output: "输出前端页面可直接消费的标准响应结构",
    edgeCase: "数据节点不存在、状态码非成功、字段类型不符合预期时要安全兜底",
  },
  {
    name: "文件导入批次汇总",
    role: "你正在为批量文件导入功能实现结果汇总",
    input: "输入为文件处理结果列表，包含文件名、处理状态、记录数和错误消息",
    process: "需要统计成功文件数、失败文件数、总记录数，并汇总失败原因",
    output: "输出批次摘要和失败文件明细，供页面展示或日志记录",
    edgeCase: "记录数为空、状态值未知、文件名重复时都要被纳入异常明细",
  },
  {
    name: "用户报名表单审核",
    role: "你正在开发活动报名后台的审核辅助脚本",
    input: "输入为报名表单数据，包含姓名、年龄、手机号、报名场次和备注",
    process: "需要校验年龄范围、规范场次名称，并过滤明显无效的报名信息",
    output: "输出可进入审核队列的报名记录和不通过原因",
    edgeCase: "未成年人报名、场次不存在、手机号格式异常时要返回清晰原因",
  },
  {
    name: "财务报表字段转换",
    role: "你正在把财务导出的原始报表转换为分析系统字段",
    input: "输入为多条报表记录，包含科目、发生额、币种和记账日期",
    process: "需要统一字段命名、转换金额精度，并按币种汇总发生额",
    output: "输出标准字段记录和币种维度汇总",
    edgeCase: "金额为空、日期格式异常、未知币种需要进入异常列表",
  },
  {
    name: "批量任务执行结果归档",
    role: "你正在为自动化任务平台生成批次执行报告",
    input: "输入为任务执行结果列表，包含任务名、负责人、耗时、状态和失败原因",
    process: "需要按负责人统计成功率、平均耗时，并提取失败任务清单",
    output: "输出负责人维度报告和可追踪的失败任务明细",
    edgeCase: "负责人为空、耗时不是数字、状态值未知时需要使用默认分组或异常记录",
  },
];

const topicRefs: TopicRef[] = courseModules.flatMap((module) =>
  module.sections.flatMap((section) =>
    section.topics.map((topic) => ({
      module,
      section,
      topic,
    })),
  ),
);

const difficultyLabel: Record<ExerciseDifficulty, string> = {
  easy: "简单",
  hard: "难度",
};

const slugFor = (value: string) => value.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 48);

const chapterLabel = (ref: TopicRef) => `${ref.module.title} / ${ref.section.title}`;

const nextDifferentSection = (startIndex: number) => {
  const base = topicRefs[startIndex % topicRefs.length];

  for (let offset = 1; offset < topicRefs.length; offset += 1) {
    const candidate = topicRefs[(startIndex + offset) % topicRefs.length];
    if (candidate.section.id !== base.section.id || candidate.module.id !== base.module.id) {
      return candidate;
    }
  }

  return topicRefs[(startIndex + 1) % topicRefs.length];
};

const pickRefs = (index: number, difficulty: ExerciseDifficulty) => {
  const first = topicRefs[index % topicRefs.length];
  const second =
    difficulty === "hard"
      ? nextDifferentSection(index)
      : topicRefs[(index + 1) % topicRefs.length];
  const third = nextDifferentSection(index + 7);

  return difficulty === "hard" ? [first, second, third] : [first, second];
};

const unique = (values: string[]) => Array.from(new Set(values));

const codeFor = (
  id: string,
  scenario: ScenarioTemplate,
  points: string[],
  difficulty: ExerciseDifficulty,
) => {
  const functionName = `practice_${slugFor(id)}`;

  if (difficulty === "easy") {
    return [
      "```python",
      `def ${functionName}(records):`,
      "    accepted = []",
      "    rejected = []",
      "    for row_number, record in enumerate(records, start=1):",
      "        name = str(record.get(\"name\", \"\")).strip()",
      "        phone = str(record.get(\"phone\", \"\")).strip()",
      "        if not name or not phone:",
      "            rejected.append({\"row\": row_number, \"reason\": \"姓名或手机号缺失\"})",
      "            continue",
      "        accepted.append({",
      "            \"name\": name,",
      "            \"phone\": phone,",
      "            \"source\": str(record.get(\"source\", \"unknown\")).strip() or \"unknown\",",
      "        })",
      "    return {",
      `        "scenario": "${scenario.name}",`,
      `        "knowledge_points": ${JSON.stringify(points)},`,
      "        \"accepted\": accepted,",
      "        \"rejected\": rejected,",
      "        \"total\": len(records),",
      "    }",
      "",
      "sample_records = [",
      "    {\"name\": \"  张三  \", \"phone\": \"13800000000\", \"source\": \"官网\"},",
      "    {\"name\": \"\", \"phone\": \"13900000000\", \"source\": \"活动页\"},",
      "]",
      `print(${functionName}(sample_records))`,
      "```",
    ].join("\n");
  }

  return [
    "```python",
    `def ${functionName}(records):`,
    "    owner_summary = {}",
    "    errors = []",
    "    for index, record in enumerate(records, start=1):",
    "        try:",
    "            owner = str(record.get(\"owner\", \"\")).strip() or \"未分配负责人\"",
    "            status = str(record.get(\"status\", \"unknown\")).strip().lower()",
    "            duration = float(record.get(\"duration\", 0))",
    "        except (AttributeError, TypeError, ValueError) as exc:",
    "            errors.append({\"row\": index, \"reason\": str(exc)})",
    "            continue",
    "        if duration < 0 or status not in {\"success\", \"failed\"}:",
    "            errors.append({\"row\": index, \"reason\": \"耗时或状态不合法\"})",
    "            continue",
    "        bucket = owner_summary.setdefault(owner, {\"success\": 0, \"failed\": 0, \"duration\": 0.0})",
    "        bucket[status] += 1",
    "        bucket[\"duration\"] += duration",
    "    for bucket in owner_summary.values():",
    "        total = bucket[\"success\"] + bucket[\"failed\"]",
    "        bucket[\"success_rate\"] = round(bucket[\"success\"] / total, 2) if total else 0",
    "        bucket[\"avg_duration\"] = round(bucket[\"duration\"] / total, 2) if total else 0",
    "    return {",
    `        "scenario": "${scenario.name}",`,
    `        "knowledge_points": ${JSON.stringify(points)},`,
    "        \"summary\": owner_summary,",
    "        \"errors\": errors,",
    "    }",
    "",
    "sample_records = [",
    "    {\"owner\": \"运营\", \"status\": \"success\", \"duration\": \"12.5\"},",
    "    {\"owner\": \"运营\", \"status\": \"failed\", \"duration\": 7},",
    "    {\"owner\": \"\", \"status\": \"unknown\", \"duration\": \"bad\"},",
    "]",
    `print(${functionName}(sample_records))`,
    "```",
  ].join("\n");
};

const createExercise = (index: number, difficulty: ExerciseDifficulty): CourseExercise => {
  const refs = pickRefs(index, difficulty);
  const scenario = scenarioTemplates[index % scenarioTemplates.length];
  const knowledgePoints = refs.map((ref) => ref.topic.title);
  const chapters = unique(refs.map(chapterLabel));
  const id = `${difficulty}-${String(index + 1).padStart(3, "0")}`;
  const pointText = knowledgePoints.map((point) => `“${point}”`).join("、");
  const chapterText = chapters.join("；");
  const difficultyPrefix = difficultyLabel[difficulty];

  return {
    id,
    difficulty,
    title: `${difficultyPrefix}任务 ${index + 1}：${scenario.name}`,
    description:
      `${scenario.role}。${scenario.input}；${scenario.process}；${scenario.output}。` +
      `本题需综合使用 ${pointText}，并在实现中覆盖边界规则：${scenario.edgeCase}。`,
    chapters,
    knowledgePoints,
    answerMarkdown: [
      `### 参考实现：${scenario.name}`,
      "",
      codeFor(id, scenario, knowledgePoints, difficulty),
      "",
      "- 参考实现保留了有效数据和异常数据两条路径，便于后续写入数据库、报表或日志。",
      "- 实际项目中可以继续拆分校验函数、转换函数和汇总函数，但入口函数应保持可测试。",
    ].join("\n"),
    analysisMarkdown: [
      `### 分析：${difficultyPrefix}题的复合点`,
      "",
      `- 涉及章节：${chapterText}`,
      `- 涉及知识点：${knowledgePoints.join("、")}`,
      `- 业务目标：${scenario.process}，最终形成“正常结果 + 异常明细”的稳定输出。`,
      "- 推荐先明确输入数据结构，再把清洗、校验、计算和输出组织成可复用函数。",
      difficulty === "hard"
        ? "- 难度题要跨章节组合：既要处理集合数据，也要设计异常兜底、统计口径和返回结构。"
        : "- 简单题仍然不是单点题：至少要把数据清洗、条件判断和结果组装串成一个小流程。",
      "- 常见问题是只打印结果，缺少结构化返回值；或遇到脏数据直接报错，无法继续处理后续记录。",
    ].join("\n"),
  };
};

const createPool = (difficulty: ExerciseDifficulty) =>
  Array.from({ length: targetPerDifficulty }, (_, index) => createExercise(index, difficulty));

export const practiceExercises: CourseExercise[] = [
  ...createPool("easy"),
  ...createPool("hard"),
];

export const exerciseDifficultyLabel = difficultyLabel;

export const getExercisesByDifficulty = (difficulty: ExerciseDifficulty) =>
  practiceExercises.filter((exercise) => exercise.difficulty === difficulty);

export const pickExercise = (
  difficulty: ExerciseDifficulty,
  masteredIds: string[],
  previousId?: string,
) => {
  const mastered = new Set(masteredIds);
  const available = getExercisesByDifficulty(difficulty).filter(
    (exercise) => !mastered.has(exercise.id) && exercise.id !== previousId,
  );
  return available[Math.floor(Math.random() * available.length)];
};
