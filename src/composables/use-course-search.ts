import { computed, type Ref } from "vue";
import type { CourseModule, CourseSearchOption, CourseSearchResult } from "../types/course";

const includesKeyword = (value: string, keyword: string) =>
  value.toLowerCase().includes(keyword.toLowerCase());

export const useCourseSearch = (modules: CourseModule[], keyword: Ref<string>) => {
  const normalizedKeyword = computed(() => keyword.value.trim());

  const results = computed<CourseSearchResult[]>(() => {
    if (!normalizedKeyword.value) {
      return modules.map((module) => ({ module, matchedSections: module.sections }));
    }

    return modules
      .map((module) => {
        const matchedSections = module.sections
          .map((section) => {
            const topicMatches = section.topics.filter((topic) =>
              includesKeyword(topic.title, normalizedKeyword.value),
            );
            const sectionMatches = includesKeyword(section.title, normalizedKeyword.value);
            return sectionMatches ? section : { ...section, topics: topicMatches };
          })
          .filter((section) => section.topics.length > 0);

        const moduleMatches = includesKeyword(module.title, normalizedKeyword.value);
        return {
          module,
          matchedSections: moduleMatches ? module.sections : matchedSections,
        };
      })
      .filter((result) => result.matchedSections.length > 0);
  });

  const filteredModules = computed(() =>
    results.value.map((result) => ({
      ...result.module,
      sections: result.matchedSections,
    })),
  );

  const searchOptions = computed<CourseSearchOption[]>(() => {
    if (!normalizedKeyword.value) {
      return [];
    }

    return modules.flatMap((module) => {
      const moduleOption = includesKeyword(module.title, normalizedKeyword.value)
        ? [
            {
              id: module.id,
              type: "module" as const,
              title: module.title,
              subtitle: "课程模块",
              path: `/modules/${module.id}`,
            },
          ]
        : [];

      const sectionOptions = module.sections.flatMap((section) => {
        const sectionOption = includesKeyword(section.title, normalizedKeyword.value)
          ? [
              {
                id: `${module.id}:${section.id}`,
                type: "section" as const,
                title: section.title,
                subtitle: module.title,
                path: `/modules/${module.id}/sections/${section.id}`,
              },
            ]
          : [];

        const topicOptions = section.topics
          .filter((topic) => includesKeyword(topic.title, normalizedKeyword.value))
          .map((topic) => ({
            id: `${module.id}:${section.id}:${topic.id}`,
            type: "topic" as const,
            title: topic.title,
            subtitle: `${module.title} / ${section.title}`,
            path: `/modules/${module.id}/sections/${section.id}/topics/${topic.id}`,
          }));

        return [...sectionOption, ...topicOptions];
      });

      return [...moduleOption, ...sectionOptions];
    });
  });

  return {
    normalizedKeyword,
    results,
    filteredModules,
    searchOptions,
  };
};
