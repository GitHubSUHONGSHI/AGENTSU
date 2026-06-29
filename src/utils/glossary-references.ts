import type {
  CourseContentBlock,
  CourseGlossaryEntry,
  CourseGlossaryReference,
  CourseModule,
} from "../types/course";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isAsciiWord = (value: string) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);

const blockText = (block: CourseContentBlock) => {
  if (block.kind === "paragraph" || block.kind === "heading") {
    return block.text;
  }
  if (block.kind === "list") {
    return block.items.join("\n");
  }
  if (block.kind === "code") {
    return block.code;
  }
  if (block.kind === "table") {
    return block.rows.map((row) => row.map((cell) => cell.text).join(" ")).join("\n");
  }
  return `${block.alt} ${block.src}`;
};

const countTermMatches = (source: string, term: string) => {
  if (!term) {
    return 0;
  }

  // English syntax words need identifier boundaries; Chinese terms are matched by inclusion.
  if (isAsciiWord(term)) {
    const matcher = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, "g");
    return source.match(matcher)?.length ?? 0;
  }

  return source.split(term).length - 1;
};

export const glossaryReferencesFor = (
  entry: CourseGlossaryEntry,
  modules: CourseModule[],
): CourseGlossaryReference[] => {
  const terms = [entry.term, ...(entry.aliases ?? [])];
  const references: CourseGlossaryReference[] = [];

  modules.forEach((module) => {
    module.sections.forEach((section) => {
      section.topics.forEach((topic) => {
        const source = [
          module.title,
          module.summary,
          section.title,
          topic.title,
          topic.summary,
          ...topic.contentBlocks.map(blockText),
        ].join("\n");
        const matchCount = terms.reduce((total, term) => total + countTermMatches(source, term), 0);

        if (matchCount > 0) {
          references.push({
            moduleTitle: module.title,
            sectionTitle: section.title,
            topicTitle: topic.title,
            path: `/modules/${module.id}/sections/${section.id}/topics/${topic.id}`,
            matchCount,
          });
        }
      });
    });
  });

  return references;
};
