import { computed, type Ref } from "vue";
import type { CourseModule, CourseSearchResult } from "../types/course";

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

  return {
    normalizedKeyword,
    results,
    filteredModules,
  };
};
