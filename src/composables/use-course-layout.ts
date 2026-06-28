import { computed, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { courseModules } from "../data/python-course";
import { courseProgressKey } from "../symbols/course-progress";
import type { CourseSearchOption } from "../types/course";
import { useCourseProgress } from "./use-course-progress";
import { useCourseSearch } from "./use-course-search";

export const useCourseLayout = () => {
  const route = useRoute();
  const router = useRouter();
  const searchKeyword = ref("");
  const isMobileNavigationOpen = ref(false);

  const { filteredModules, normalizedKeyword, searchOptions } = useCourseSearch(
    courseModules,
    searchKeyword,
  );
  const progress = useCourseProgress(courseModules.length);

  provide(courseProgressKey, progress);

  const isCourseHomeRoute = computed(() => route.name === "course-home");
  const isInterviewRoute = computed(() => route.name === "interview");
  const isKnowledgeRoute = computed(() => route.name === "knowledge");
  const isPracticeRoute = computed(() => String(route.name ?? "").startsWith("practice"));
  const activeModuleId = computed(() =>
    isCourseHomeRoute.value || isInterviewRoute.value || isKnowledgeRoute.value
      ? ""
      : String(route.params.moduleId ?? courseModules[0]?.id ?? ""),
  );
  const activeSectionId = computed(() => {
    const value = route.params.sectionId;
    return value ? String(value) : undefined;
  });
  const activeModule = computed(() =>
    courseModules.find((module) => module.id === activeModuleId.value),
  );
  const activeSection = computed(() =>
    activeModule.value?.sections.find((section) => section.id === activeSectionId.value),
  );
  const activeLocationLabel = computed(() =>
    activeSection.value?.title ?? activeModule.value?.title ?? "课程首页",
  );
  const searchResultCount = computed(() =>
    filteredModules.value.reduce(
      (total, module) =>
        total + module.sections.reduce((sum, section) => sum + section.topics.length, 0),
      0,
    ),
  );

  const closeNavigation = () => {
    isMobileNavigationOpen.value = false;
  };

  const openNavigation = () => {
    isMobileNavigationOpen.value = true;
  };

  const selectSearchResult = (option: CourseSearchOption) => {
    closeNavigation();
    void router.push(option.path);
  };

  watch(
    () => route.fullPath,
    () => {
      closeNavigation();
    },
  );

  return {
    activeModuleId,
    activeLocationLabel,
    activeSectionId,
    closeNavigation,
    filteredModules,
    isCourseHomeRoute,
    isInterviewRoute,
    isKnowledgeRoute,
    isMobileNavigationOpen,
    isPracticeRoute,
    openNavigation,
    progress,
    searchResultCount,
    searchKeyword,
    searchOptions,
    searchSummary: computed(() =>
      normalizedKeyword.value ? `找到 ${searchResultCount.value} 个知识点` : "搜索模块、章节或知识点",
    ),
    selectSearchResult,
    totalModules: courseModules.length,
  };
};
