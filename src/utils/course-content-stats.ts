import type { CourseContentBlock, CourseModule, CourseSection, CourseTopic } from "../types/course";

export type ContentStats = {
  paragraphs: number;
  headings: number;
  lists: number;
  code: number;
  images: number;
  tables: number;
  blocks: number;
};

export type SectionInsight = {
  id: string;
  title: string;
  topicCount: number;
  stats: ContentStats;
  excerpt: string;
  firstTopicPath: string;
};

export const emptyContentStats = (): ContentStats => ({
  paragraphs: 0,
  headings: 0,
  lists: 0,
  code: 0,
  images: 0,
  tables: 0,
  blocks: 0,
});

const statKeyByKind: Record<CourseContentBlock["kind"], keyof ContentStats> = {
  paragraph: "paragraphs",
  heading: "headings",
  list: "lists",
  code: "code",
  image: "images",
  table: "tables",
};

export const countContentBlocks = (blocks: CourseContentBlock[]) =>
  blocks.reduce((stats, block) => {
    stats.blocks += 1;
    stats[statKeyByKind[block.kind]] += 1;
    return stats;
  }, emptyContentStats());

export const mergeContentStats = (items: ContentStats[]) =>
  items.reduce((total, item) => {
    total.paragraphs += item.paragraphs;
    total.headings += item.headings;
    total.lists += item.lists;
    total.code += item.code;
    total.images += item.images;
    total.tables += item.tables;
    total.blocks += item.blocks;
    return total;
  }, emptyContentStats());

export const topicContentStats = (topic: CourseTopic) => countContentBlocks(topic.contentBlocks);

export const sectionContentStats = (section: CourseSection) =>
  mergeContentStats(section.topics.map(topicContentStats));

export const moduleContentStats = (module: CourseModule) =>
  mergeContentStats(module.sections.map(sectionContentStats));

export const sectionTopicCount = (section: CourseSection) => section.topics.length;

export const sectionCount = (module: CourseModule) => module.sections.length;

export const moduleTopicCount = (module: CourseModule) =>
  module.sections.reduce((total, section) => total + sectionTopicCount(section), 0);

export const firstReadableText = (blocks: CourseContentBlock[]) => {
  for (const block of blocks) {
    if ((block.kind === "paragraph" || block.kind === "heading") && block.text.trim()) {
      return block.text;
    }

    if (block.kind === "list") {
      const item = block.items.find((value) => value.trim());
      if (item) return item;
    }
  }

  return "";
};

export const textExcerpt = (text: string, maxLength = 86) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
};

export const topicExcerpt = (topic: CourseTopic, maxLength?: number) =>
  textExcerpt(firstReadableText(topic.contentBlocks) || topic.summary, maxLength);

export const sectionExcerpt = (section: CourseSection, maxLength?: number) => {
  const firstTopic = section.topics.find((topic) => topic.summary || topic.contentBlocks.length);
  return firstTopic ? topicExcerpt(firstTopic, maxLength) : "";
};

export const moduleSectionInsights = (module: CourseModule): SectionInsight[] =>
  module.sections.map((section) => ({
    id: section.id,
    title: section.title,
    topicCount: sectionTopicCount(section),
    stats: sectionContentStats(section),
    excerpt: sectionExcerpt(section, 104),
    firstTopicPath: section.topics[0]
      ? `/modules/${module.id}/sections/${section.id}/topics/${section.topics[0].id}`
      : `/modules/${module.id}/sections/${section.id}`,
  }));
