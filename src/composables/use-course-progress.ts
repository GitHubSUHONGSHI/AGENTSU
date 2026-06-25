import { computed, ref, watch } from "vue";

const STORAGE_KEY = "python-course-completed-modules";

const readStoredIds = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

export const useCourseProgress = (totalModules: number) => {
  const completedModuleIds = ref<string[]>(readStoredIds());

  const completedCount = computed(() => completedModuleIds.value.length);
  const progressPercent = computed(() =>
    totalModules === 0 ? 0 : Math.round((completedCount.value / totalModules) * 100),
  );

  const isCompleted = (moduleId: string) => completedModuleIds.value.includes(moduleId);

  const toggleCompleted = (moduleId: string) => {
    completedModuleIds.value = isCompleted(moduleId)
      ? completedModuleIds.value.filter((id) => id !== moduleId)
      : [...completedModuleIds.value, moduleId];
  };

  watch(
    completedModuleIds,
    (ids) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch {
        // Local storage can fail in private browsing; the in-memory state remains usable.
      }
    },
    { deep: true },
  );

  return {
    completedModuleIds,
    completedCount,
    progressPercent,
    isCompleted,
    toggleCompleted,
  };
};
