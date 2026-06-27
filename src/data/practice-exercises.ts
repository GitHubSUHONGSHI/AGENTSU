import { courseModules } from "./python-course";
import type {
  CourseExercise,
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
  hard: "难",
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

const promptFor = (
  context: TopicContext,
  kind: ExerciseKind,
  difficulty: ExerciseDifficulty,
) => {
  const { module, section, topic } = context;
  const title = `《${topic.title}》`;
  const path = `${module.title} / ${section.title}`;

  if (kind === "operation" && difficulty === "easy") {
    return `围绕 ${title} 完成一个最小操作：写出 3-5 行 Python 示例或操作步骤，体现它在「${path}」中的核心用法。`;
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
) => {
  const { module, section, topic } = context;
  const sourceHint = compactText(firstUsefulText(topic));
  const taskShape =
    kind === "operation"
      ? "答案应包含可执行的代码片段或清晰步骤，并能说明输入、处理和输出。"
      : "答案应包含概念解释、适用场景和一个容易混淆的边界。";
  const depthHint =
    difficulty === "easy"
      ? "重点检查是否抓住核心定义。"
      : difficulty === "hard"
        ? "重点检查是否能处理限制条件和常见错误。"
        : "重点检查是否能抽象成可复用方案，并说明失败模式。";

  return `${taskShape} 参考方向：结合「${module.title} / ${section.title}」中的「${topic.title}」，先使用知识点摘要“${topic.summary}”定位目标，再参考正文线索“${sourceHint}”。${depthHint}`;
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
