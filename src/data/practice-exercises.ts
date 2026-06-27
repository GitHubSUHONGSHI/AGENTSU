import { courseModules } from "./python-course";
import type {
  CourseExercise,
  CourseExerciseAnswer,
  CourseModule,
  CourseSection,
  CourseTopic,
  ExerciseDifficulty,
  ExerciseKind,
} from "../types/course";

interface TopicContext {
  module: CourseModule;
  section: CourseSection;
  topic: CourseTopic;
  topicKey: string;
}

const exercisePlan: Array<{
  kind: ExerciseKind;
  difficulty: ExerciseDifficulty;
}> = [
  { kind: "operation", difficulty: "easy" },
  { kind: "reflection", difficulty: "easy" },
  { kind: "operation", difficulty: "hard" },
  { kind: "reflection", difficulty: "hard" },
  { kind: "operation", difficulty: "deep" },
  { kind: "reflection", difficulty: "deep" },
];

const kindLabel: Record<ExerciseKind, string> = {
  operation: "操作式",
  reflection: "思考式",
};

const difficultyLabel: Record<ExerciseDifficulty, string> = {
  easy: "简单",
  hard: "困难",
  deep: "深度",
};

const firstUsefulText = (topic: CourseTopic) => {
  const block = topic.contentBlocks.find(
    (item) => item.kind === "paragraph" || item.kind === "heading" || item.kind === "list",
  );

  if (!block) {
    return topic.summary;
  }

  if (block.kind === "list") {
    return block.items.slice(0, 2).join("；");
  }

  return block.text;
};

const compactText = (value: string) =>
  value.replace(/\s+/g, " ").trim().slice(0, 96);

const depthHintFor = (difficulty: ExerciseDifficulty) =>
  difficulty === "easy"
    ? "重点检查是否抓住核心定义，并能把知识点落到一个最小动作。"
    : difficulty === "hard"
      ? "重点检查是否补充输入、处理、输出，以及常见错误的防护。"
      : "重点检查是否能抽象成可复用方案，并主动说明失败模式。";

const operationExampleFor = (context: TopicContext, difficulty: ExerciseDifficulty) => {
  const { topic } = context;

  if (difficulty === "easy") {
    return [
      `topic = "${topic.title}"`,
      `summary = "${compactText(topic.summary)}"`,
      `print("练习知识点:", topic)`,
      `print("核心线索:", summary)`,
    ].join("\n");
  }

  if (difficulty === "hard") {
    return [
      `raw_value = "示例输入"`,
      `if not raw_value.strip():`,
      `    print("输入不能为空")`,
      `else:`,
      `    print("使用 ${topic.title} 处理:", raw_value.strip())`,
    ].join("\n");
  }

  const functionName = topic.id.replace(/[^a-zA-Z0-9_]/g, "_");
  return [
    `def practice_${functionName}(value):`,
    `    if value is None:`,
    `        return "缺少测试数据"`,
    `    return f"${topic.title} 已处理: {value}"`,
    ``,
    `print(practice_${functionName}("测试数据"))`,
  ].join("\n");
};

const reflectionExampleFor = (context: TopicContext, difficulty: ExerciseDifficulty) => {
  const { module, section, topic } = context;
  const path = `${module.title} / ${section.title}`;

  if (difficulty === "easy") {
    return `示例：学习“${path}”时，先用一句话解释“${topic.title}”解决的问题，再说出它在小练习中出现的位置。`;
  }

  if (difficulty === "hard") {
    return `示例：把“${topic.title}”和同章节相邻知识点对照，分别写出“适合使用它”的场景与“不应该强行使用它”的场景。`;
  }

  return `示例：为“${topic.title}”写一份复盘说明，包含原理、边界、失败原因和改进策略，像给同学做代码评审一样说明取舍。`;
};

const resultFor = (kind: ExerciseKind, difficulty: ExerciseDifficulty, topic: CourseTopic) => {
  if (kind === "operation") {
    return difficulty === "easy"
      ? `控制台应输出练习知识点和核心线索，能看出示例确实围绕“${topic.title}”。`
      : difficulty === "hard"
        ? "有输入时输出处理后的内容；空输入时输出防错提示。"
        : "传入测试数据时返回处理结果；传入 None 时返回明确的失败提示。";
  }

  return difficulty === "easy"
    ? "答案应能让初学者听懂这个知识点解决什么问题，并能对应到一个具体学习场景。"
    : difficulty === "hard"
      ? "答案应清楚区分适用与不适用场景，不把相邻知识点混成一个概念。"
      : "答案应同时覆盖原理、边界、工程取舍，并能说明如何降低失败风险。";
};

const counterExampleFor = (kind: ExerciseKind, topic: CourseTopic) =>
  kind === "operation"
    ? `反例：只写“使用 ${topic.title} 就可以完成任务”，但没有输入、处理过程或输出结果。问题是无法验证代码是否真的会运行，也无法定位错误发生在哪里。`
    : `反例：只背诵“${topic.title}”的定义，却没有说明适用场景和边界。问题是看似理解了概念，实际遇到相邻知识点时仍然会混用。`;

const promptFor = (
  context: TopicContext,
  kind: ExerciseKind,
  difficulty: ExerciseDifficulty,
) => {
  const { module, section, topic } = context;
  const title = `“${topic.title}”`;
  const path = `${module.title} / ${section.title}`;

  if (kind === "operation" && difficulty === "easy") {
    return `围绕 ${title} 完成一个最小操作：写出 3-5 行 Python 示例或操作步骤，体现它在“${path}”中的核心用法。`;
  }

  if (kind === "reflection" && difficulty === "easy") {
    return `用自己的话说明 ${title} 解决什么问题，并举出一个初学者最容易遇到的使用场景。`;
  }

  if (kind === "operation" && difficulty === "hard") {
    return `设计一个包含输入、处理、输出的小练习，要求使用 ${title}，并指出代码中至少一个需要防错的地方。`;
  }

  if (kind === "reflection" && difficulty === "hard") {
    return `比较 ${title} 与本章节相邻知识的差异，说明什么时候应该使用它，什么时候不适合使用。`;
  }

  if (kind === "operation" && difficulty === "deep") {
    return `把 ${title} 放进一个可复用的小函数、类或脚本流程中，描述接口、关键步骤和一组测试数据。`;
  }

  return `从原理、边界和工程取舍三个角度分析 ${title}：它为什么有效，可能在哪里失败，如何让实现更稳健。`;
};

const answerFor = (
  context: TopicContext,
  kind: ExerciseKind,
  difficulty: ExerciseDifficulty,
): CourseExerciseAnswer => {
  const { module, section, topic } = context;
  const sourceHint = compactText(firstUsefulText(topic));
  const taskShape =
    kind === "operation"
      ? "答案应包含可执行的代码片段或清晰步骤，并能说明输入、处理和输出。"
      : "答案应包含概念解释、适用场景和一个容易混淆的边界。";

  return {
    explanation: `${taskShape} 参考方向：结合“${module.title} / ${section.title}”中的“${topic.title}”，先用摘要“${topic.summary}”定位目标，再参考正文线索“${sourceHint}”。`,
    example:
      kind === "operation"
        ? operationExampleFor(context, difficulty)
        : reflectionExampleFor(context, difficulty),
    result: resultFor(kind, difficulty, topic),
    counterExample: counterExampleFor(kind, topic),
    notes: [
      depthHintFor(difficulty),
      "自检时要能指出案例的输入、处理过程和结果，不能只停留在文字解释。",
      "反例用于提醒常见误区：没有结果、没有边界，或把相邻概念混用。",
    ],
  };
};

const createExercises = (context: TopicContext): CourseExercise[] =>
  exercisePlan.map(({ kind, difficulty }) => ({
    id: `${context.topicKey}-${kind}-${difficulty}`,
    topicId: context.topicKey,
    kind,
    difficulty,
    prompt: promptFor(context, kind, difficulty),
    answer: answerFor(context, kind, difficulty),
  }));

const topicContexts = courseModules.flatMap((module) =>
  module.sections.flatMap((section) =>
    section.topics.map((topic) => ({
      module,
      section,
      topic,
      topicKey: `${module.id}:${section.id}:${topic.id}`,
    })),
  ),
);

export const practiceTopicContexts = topicContexts;
export const practiceExercises = topicContexts.flatMap(createExercises);
export const exerciseKindLabel = kindLabel;
export const exerciseDifficultyLabel = difficultyLabel;

export const getPracticeTopicContext = (
  moduleId?: string,
  sectionId?: string,
  topicId?: string,
) =>
  topicContexts.find(
    (item) =>
      item.module.id === moduleId &&
      item.section.id === sectionId &&
      item.topic.id === topicId,
  ) ?? topicContexts[0];

export const getExercisesForTopic = (topicId: string) =>
  practiceExercises.filter((exercise) => exercise.topicId === topicId);
