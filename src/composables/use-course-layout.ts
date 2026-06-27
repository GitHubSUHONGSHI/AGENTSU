import { computed, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { courseModules } from "../data/python-course";
import { courseProgressKey } from "../symbols/course-progress";
import { useCourseProgress } from "./use-course-progress";
import { useCourseSearch } from "./use-course-search";

export const useCourseLayout = () => {
  const route = useRoute();
  const searchKeyword = ref("");
  const isMobileNavigationOpen = ref(false);

  const { filteredModules } = useCourseSearch(courseModules, searchKeyword);
  const progress = useCourseProgress(courseModules.length);

  provide(courseProgressKey, progress);

  const isCourseHomeRoute = computed(() => route.name === "course-home");
  const isKnowledgeRoute = computed(() => route.name === "knowledge");
  const isPracticeRoute = computed(() => String(route.name ?? "").startsWith("practice"));
  const activeModuleId = computed(() =>
    isCourseHomeRoute.value || isKnowledgeRoute.value
      ? ""
      : String(route.params.moduleId ?? courseModules[0]?.id ?? ""),
  );
  const activeSectionId = computed(() => {
    const value = route.params.sectionId;
    return value ? String(value) : undefined;
  });

  const closeNavigation = () => {
    isMobileNavigationOpen.value = false;
  };

  const openNavigation = () => {
    isMobileNavigationOpen.value = true;
  };

  watch(
    () => route.fullPath,
    () => {
      closeNavigation();
    },
  );

  return {
    activeModuleId,
    activeSectionId,
    closeNavigation,
    filteredModules,
    isCourseHomeRoute,
    isKnowledgeRoute,
    isMobileNavigationOpen,
    isPracticeRoute,
    openNavigation,
    progress,
    searchKeyword,
    totalModules: courseModules.length,
  };
};
