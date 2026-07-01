import { computed, ref } from "vue";
import { courseModules } from "../data/python-course";

type RecentLearning = {
  moduleId: string;
  sectionId?: string;
  topicId?: string;
  title: string;
};

const storageKey = "agentsu:recent-learning";
const recentLearning = ref<RecentLearning | null>(readRecentLearning());

function readRecentLearning() {
  try {
    const rawValue = localStorage.getItem(storageKey);
    return rawValue ? (JSON.parse(rawValue) as RecentLearning) : null;
  } catch {
    return null;
  }
}

const writeRecentLearning = (value: RecentLearning) => {
  recentLearning.value = value;
  localStorage.setItem(storageKey, JSON.stringify(value));
};

const pathForRecentLearning = (value: RecentLearning | null) => {
  if (!value) {
    return "";
  }

  if (value.sectionId && value.topicId) {
    return `/modules/${value.moduleId}/sections/${value.sectionId}/topics/${value.topicId}`;
  }

  if (value.sectionId) {
    return `/modules/${value.moduleId}/sections/${value.sectionId}`;
  }

  return `/modules/${value.moduleId}`;
};

const fallbackModule = computed(() => courseModules[0]);

export const useRecentLearning = () => {
  const recentPath = computed(() => pathForRecentLearning(recentLearning.value));
  const recentTitle = computed(() => recentLearning.value?.title ?? fallbackModule.value?.title ?? "知识章节");

  return {
    recentLearning,
    recentPath,
    recentTitle,
    writeRecentLearning,
  };
};
