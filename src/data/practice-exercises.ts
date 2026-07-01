import { courseModules } from "./python-course";
import type { CourseExercise, CourseModule, CourseSection, CourseTopic, ExerciseDifficulty } from "../types/course";

interface TopicRef {
  module: CourseModule;
  section: CourseSection;
  topic: CourseTopic;
}

const targetPerDifficulty = 240;

const scenarioTemplates = [
  "后台表单数据校验",
  "订单明细清洗",
  "日志行统计",
  "配置项解析",
  "客户信息整理",
  "接口响应格式化",
  "文件内容汇总",
  "异常输入兜底",
  "报表字段转换",
  "批量任务结果归档",
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

const codeFor = (id: string, scenario: string, points: string[], difficulty: ExerciseDifficulty) => {
  const functionName = `practice_${slugFor(id)}`;

  if (difficulty === "easy") {
    return [
      "```python",
      `def ${functionName}(raw_items):`,
      "    cleaned = []",
      "    for item in raw_items:",
      "        value = str(item).strip()",
      "        if value:",
      "            cleaned.append(value)",
      "    return {",
      `        "scene": "${scenario}",`,
      `        "knowledge": ${JSON.stringify(points)},`,
      "        \"items\": cleaned,",
      "        \"count\": len(cleaned),",
      "    }",
      "",
      `print(${functionName}(["  A001  ", "", "B002"]))`,
      "```",
    ].join("\n");
  }

  return [
    "```python",
    `def ${functionName}(records):`,
    "    summary = {}",
    "    errors = []",
    "    for index, record in enumerate(records, start=1):",
    "        try:",
    "            owner = str(record.get(\"owner\", \"\")).strip() or \"未分配\"",
    "            amount = float(record.get(\"amount\", 0))",
    "        except (AttributeError, TypeError, ValueError) as exc:",
    "            errors.append({\"row\": index, \"reason\": str(exc)})",
    "            continue",
    "        summary[owner] = summary.get(owner, 0) + amount",
    "    return {",
    `        "scene": "${scenario}",`,
    `        "knowledge": ${JSON.stringify(points)},`,
    "        \"summary\": summary,",
    "        \"errors\": errors,",
    "    }",
    "",
    "sample_records = [",
    "    {\"owner\": \"运营\", \"amount\": \"12.5\"},",
    "    {\"owner\": \"运营\", \"amount\": 7},",
    "    {\"owner\": \"\", \"amount\": \"bad\"},",
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

  return {
    id,
    difficulty,
    title: `${difficultyLabel[difficulty]}复合编码题 ${index + 1}`,
    description:
      `在“${scenario}”场景中，综合使用 ${pointText}。请编写一段可运行的 Python 代码，` +
      "完成输入清洗、核心处理和结果输出，并说明至少一个异常或边界输入的处理方式。",
    chapters,
    knowledgePoints,
    answerMarkdown: [
      `### 参考实现：${scenario}`,
      "",
      codeFor(id, scenario, knowledgePoints, difficulty),
      "",
      "- 输出结果需要能看出输入被清洗、处理和统计。",
      "- 可以根据真实业务字段继续拆分函数，但示例必须先保持可运行。",
    ].join("\n"),
    analysisMarkdown: [
      `### 分析：${difficultyLabel[difficulty]}题的复合点`,
      "",
      `- 涉及章节：${chapterText}`,
      `- 涉及知识点：${knowledgePoints.join("、")}`,
      "- 先把输入转成稳定的数据形态，再进入核心处理逻辑。",
      difficulty === "hard"
        ? "- 难度题需要跨章节组合：既要处理数据结构，也要考虑异常兜底和函数边界。"
        : "- 简单题仍然不是单点题：至少要把两个知识点组合成一个完整小流程。",
      "- 常见错误是只写零散语句，没有把输入、处理、输出串成可验证流程。",
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
