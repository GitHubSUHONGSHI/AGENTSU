import type { CourseContentBlock, CourseSection, CourseTopic } from "../types/course";
import { firstReadableText, sectionContentStats, textExcerpt, topicContentStats } from "./course-content-stats";

export type PracticeLevel = "concept" | "code" | "project";

export type LearningPointSummary = {
  title: string;
  points: string[];
  practiceLevel: PracticeLevel;
  hint: string;
};

const levelText: Record<PracticeLevel, string> = {
  concept: "概念理解",
  code: "代码练习",
  project: "综合实战",
};

const unique = (items: string[]) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const readableHeadings = (blocks: CourseContentBlock[]) =>
  blocks
    .filter((block): block is Extract<CourseContentBlock, { kind: "heading" }> => block.kind === "heading")
    .map((block) => block.text);

const topicSummaryPoint = (topic: CourseTopic) =>
  textExcerpt(firstReadableText(topic.contentBlocks) || topic.summary || topic.title, 34);

const detectPracticeLevel = (codeCount: number, source = ""): PracticeLevel => {
  if (codeCount >= 12 || /案例|项目|系统/.test(source)) return "project";
  if (codeCount > 0) return "code";
  return "concept";
};

const contentHint = (source: string, statsCode: number) => {
  const text = source.toLowerCase();

  if (/正则|regex|re\./i.test(source)) return "注意原始字符串 r''、转义字符和匹配边界，先用小样例验证表达式。";
  if (/文件|读|写|open|with/i.test(source)) return "关注文件路径、编码和 with 自动关闭文件，避免资源未释放。";
  if (/函数|参数|return|lambda/i.test(source)) return "区分参数、返回值和作用域，先写清输入输出再组织函数体。";
  if (/类|对象|继承|self|class/i.test(source)) return "把属性、方法和对象职责分清，确认 self 指向当前实例。";
  if (/异常|错误|try|except/i.test(source)) return "只捕获可预期异常，并保留清晰的错误处理路径。";
  if (/线程|进程|并发|thread|process/i.test(source)) return "留意任务边界、共享数据和阻塞操作，先保证结果可控。";
  if (/网络|http|request|socket/i.test(source)) return "先确认请求方法、参数和状态码，再处理响应数据。";
  if (statsCode > 0 || text.includes("python")) return "建议复制示例到本地运行，观察输入、输出和变量变化。";

  return "先理解概念关系，再进入练习题模块巩固。";
};

export const sectionLearningPoints = (section: CourseSection): LearningPointSummary => {
  const stats = sectionContentStats(section);
  const topicTitles = unique(section.topics.map((topic) => topic.title)).slice(0, 5);
  const source = `${section.title} ${topicTitles.join(" ")}`;
  const practiceLevel = detectPracticeLevel(stats.code, source);
  const points = [
    `核心主题：${topicTitles.length ? topicTitles.join("、") : section.title}`,
    stats.code > 0
      ? `实践强度：${levelText[practiceLevel]}，包含 ${stats.code} 个代码示例。`
      : `实践强度：${levelText[practiceLevel]}，以概念和流程理解为主。`,
    "学习动作：按顺序阅读知识点，遇到代码先运行再进入练习。",
  ];

  return {
    title: "本节要点",
    points,
    practiceLevel,
    hint: contentHint(source, stats.code),
  };
};

export const topicLearningPoints = (topic: CourseTopic): LearningPointSummary => {
  const stats = topicContentStats(topic);
  const headings = unique(readableHeadings(topic.contentBlocks)).slice(0, 3);
  const corePoint = headings.length ? headings.join("、") : topicSummaryPoint(topic);
  const source = `${topic.title} ${topic.summary} ${headings.join(" ")}`;
  const practiceLevel = detectPracticeLevel(stats.code, source);
  const points = [
    `核心内容：${corePoint}`,
    stats.code > 0 ? "代码提示：包含 Python 示例代码，可复制运行。" : "代码提示：本知识点以概念理解为主。",
    `易错提醒：${contentHint(source, stats.code)}`,
  ];

  return {
    title: "本节要点",
    points,
    practiceLevel,
    hint: contentHint(source, stats.code),
  };
};
